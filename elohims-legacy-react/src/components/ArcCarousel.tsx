import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Product } from '../data/content';
import { ProductCard } from './ProductCard';

interface ArcCarouselProps {
  products: Product[];
  onAddToCart: (name: string, price: number, size: string) => void;
  onOpenLookbook?: (view: 'front' | 'back', product?: Product) => void;
  onOpenSizeGuide?: () => void;
  onOpenWaitlist?: (productName: string) => void;
}

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  position: relative;
  overflow: visible;
  padding: 30px 0 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
`;

const ArcStage = styled.div`
  width: 100%;
  height: 640px;
  position: relative;
  perspective: 1400px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  cursor: grab;
  touch-action: pan-y;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    height: 590px;
  }
`;

const CardSlot = styled.div<{ $x: number; $y: number; $rot: number; $scale: number; $zIndex: number; $opacity: number }>`
  position: absolute;
  top: 15px;
  width: 320px;
  transform-origin: center top;
  transform: translate3d(${({ $x }) => $x}px, ${({ $y }) => $y}px, 0px)
    rotateZ(${({ $rot }) => $rot}deg)
    scale(${({ $scale }) => $scale});
  z-index: ${({ $zIndex }) => $zIndex};
  opacity: ${({ $opacity }) => $opacity};
  will-change: transform, opacity;
  transition: opacity 0.2s ease;
  pointer-events: ${({ $opacity }) => ($opacity < 0.25 ? 'none' : 'auto')};

  @media (max-width: 768px) {
    width: 290px;
  }
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 640px;
  margin-top: 15px;
  padding: 0 20px;
  gap: 16px;
  z-index: 50;

  .nav-btn {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--bg-surface);
    border: 1.5px solid var(--border-medium);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.15rem;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);

    &:hover {
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
      border-color: var(--btn-primary-bg);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .hint-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    span.drag-hint {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dots-indicator {
      display: flex;
      gap: 8px;

      span.dot {
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background: var(--border-medium);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

        &.active {
          width: 26px;
          background: var(--gold);
        }
      }
    }
  }
`;

export const ArcCarousel: React.FC<ArcCarouselProps> = ({
  products,
  onAddToCart,
  onOpenLookbook,
  onOpenSizeGuide,
  onOpenWaitlist,
}) => {
  // Angular offset in radians
  const [angleOffset, setAngleOffset] = useState<number>(0);
  const angleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartAngleRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  // Virtual looping items so carousel is full
  const displayItems = useMemo(() => {
    if (products.length <= 2) {
      return [
        ...products.map((p, i) => ({ ...p, virtualKey: `${p.id}-0-${i}` })),
        ...products.map((p, i) => ({ ...p, virtualKey: `${p.id}-1-${i}` })),
        ...products.map((p, i) => ({ ...p, virtualKey: `${p.id}-2-${i}` })),
        ...products.map((p, i) => ({ ...p, virtualKey: `${p.id}-3-${i}` })),
      ];
    }
    if (products.length <= 4) {
      return [
        ...products.map((p, i) => ({ ...p, virtualKey: `${p.id}-0-${i}` })),
        ...products.map((p, i) => ({ ...p, virtualKey: `${p.id}-1-${i}` })),
      ];
    }
    return products.map((p, i) => ({ ...p, virtualKey: `${p.id}-${i}` }));
  }, [products]);

  const numItems = displayItems.length || 1;
  // Angular step between cards
  const ANGLE_STEP = (2 * Math.PI) / numItems;

  // Snap calculation
  const snapToNearest = useCallback(() => {
    const current = targetAngleRef.current;
    const step = ANGLE_STEP;
    const snapped = Math.round(current / step) * step;
    targetAngleRef.current = snapped;
  }, [ANGLE_STEP]);

  // Spring physics loop
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      if (!isDraggingRef.current) {
        // Friction decay
        if (Math.abs(velocityRef.current) > 0.0001) {
          targetAngleRef.current += velocityRef.current;
          velocityRef.current *= 0.88;
          if (Math.abs(velocityRef.current) <= 0.0001) {
            velocityRef.current = 0;
            snapToNearest();
          }
        }

        // Spring lerp towards target angle
        const diff = targetAngleRef.current - angleRef.current;
        angleRef.current += diff * 0.16;
      }

      setAngleOffset(angleRef.current);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [snapToNearest]);

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Don't initiate drag if clicking on interactive buttons or controls
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('.view-toggle') ||
      target.closest('.action-btn')
    ) {
      return;
    }

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = angleRef.current;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dx = e.clientX - lastXRef.current;

    // Movement sensitivity mapped to radius
    const deltaAngle = deltaX / 950;
    angleRef.current = dragStartAngleRef.current + deltaAngle;
    targetAngleRef.current = angleRef.current;

    velocityRef.current = (dx / 950) / (dt / 16.6);
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    velocityRef.current = Math.max(-0.06, Math.min(0.06, velocityRef.current));
    if (Math.abs(velocityRef.current) < 0.002) {
      snapToNearest();
    }
  };

  // Wheel horizontal scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      targetAngleRef.current -= e.deltaX / 1200;
      snapToNearest();
    }
  };

  // Next / Prev button actions
  const handlePrev = () => {
    targetAngleRef.current += ANGLE_STEP;
  };

  const handleNext = () => {
    targetAngleRef.current -= ANGLE_STEP;
  };

  // Active original item index
  const rawIdx = Math.round(-angleOffset / ANGLE_STEP);
  const activeNormalizedIdx = ((rawIdx % products.length) + products.length) % products.length;

  // Arc Radius
  const RADIUS = 1100;

  return (
    <CarouselContainer onWheel={handleWheel}>
      <ArcStage
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {displayItems.map((product, idx) => {
          let theta = (idx * ANGLE_STEP) + angleOffset;

          // Wrap theta to range [-PI, PI]
          theta = ((theta % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
          if (theta > Math.PI) {
            theta -= 2 * Math.PI;
          }

          // Arc Curve Math (Convex Arch):
          // x = RADIUS * sin(theta)
          // y = RADIUS * (1 - cos(theta))  --> apex is at y=0, sides dip downwards
          const x = RADIUS * Math.sin(theta);
          const y = RADIUS * (1 - Math.cos(theta));
          const rotZ = theta * (180 / Math.PI) * 0.92; // Tangential tilt
          const scale = Math.max(0.78, 1 - Math.abs(theta) * 0.28);
          const zIndex = Math.round(100 - Math.abs(theta) * 50);

          // Visibility dropoff for items outside the visible screen arch
          const opacity = Math.max(0, 1 - Math.pow(Math.abs(theta) / (ANGLE_STEP * 2.6), 2.2));
          const isCenter = Math.abs(theta) < ANGLE_STEP * 0.45;

          return (
            <CardSlot
              key={product.virtualKey}
              $x={x}
              $y={y}
              $rot={rotZ}
              $scale={scale}
              $zIndex={zIndex}
              $opacity={opacity}
              onClick={() => {
                if (!hasMovedRef.current && !isCenter) {
                  // Click non-centered card to center it smoothly
                  targetAngleRef.current -= theta;
                }
              }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onOpenLookbook={onOpenLookbook}
                onOpenSizeGuide={onOpenSizeGuide}
                onOpenWaitlist={onOpenWaitlist}
              />
            </CardSlot>
          );
        })}
      </ArcStage>

      {/* Nav Controls & Indicator */}
      <NavControls>
        <button
          type="button"
          className="nav-btn"
          onClick={handlePrev}
          title="Previous Piece"
          aria-label="Previous card"
        >
          ←
        </button>

        <div className="hint-group">
          <span className="drag-hint">
            Drag Arc To Explore ↔
          </span>
          <div className="dots-indicator">
            {products.map((p, i) => (
              <span
                key={p.id}
                className={`dot ${i === activeNormalizedIdx ? 'active' : ''}`}
                onClick={() => {
                  const targetDiff = i - activeNormalizedIdx;
                  targetAngleRef.current -= targetDiff * ANGLE_STEP;
                }}
                style={{ cursor: 'pointer' }}
                title={p.name}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="nav-btn"
          onClick={handleNext}
          title="Next Piece"
          aria-label="Next card"
        >
          →
        </button>
      </NavControls>
    </CarouselContainer>
  );
};
