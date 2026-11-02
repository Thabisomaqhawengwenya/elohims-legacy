import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import frontImgUrl from '../assets/front.webp';
import backImgUrl from '../assets/back.webp';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (name: string, price: number, size: string) => void;
}

const pulseAnim = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(52, 211, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
  }
`;

const CardWrapper = styled.div<{ $soon: boolean }>`
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(18, 22, 33, 0.92) 0%,
    rgba(10, 12, 18, 0.96) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 16px 16px 20px 16px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.75),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease,
    box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.colors.gold};
    box-shadow:
      0 24px 50px rgba(0, 0, 0, 0.9),
      0 0 32px rgba(217, 200, 169, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }

  /* Card Header Info */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 0 4px;
  }

  .eyebrow {
    font-family: ${({ theme }) => theme.fonts.display};
    letter-spacing: 0.16em;
    font-size: 0.68rem;
    color: ${({ theme }) => theme.colors.gold};
    text-transform: uppercase;
    font-weight: 500;
  }

  .collection-tag {
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    color: #94a3b8;
    text-transform: uppercase;
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    letter-spacing: 0.04em;
    font-size: 1.35rem;
    text-transform: uppercase;
    color: #ffffff;
    line-height: 1.15;
    margin-top: 14px;
    padding: 0 4px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95);
  }

  .specs-line {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-top: 6px;
    padding: 0 4px;
    line-height: 1.4;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 12px;
    padding: 0 4px;

    .price-value {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.45rem;
      color: ${({ theme }) => theme.colors.gold};
      font-weight: 600;
      letter-spacing: 0.03em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    }

    .meta-tag {
      font-size: 0.78rem;
      color: #cbd5e1;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-weight: 500;
    }
  }

  /* Size Selector on Card */
  .size-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 0 4px;

    span.label {
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
      min-width: 34px;
    }

    .size-chips {
      display: flex;
      gap: 6px;
      flex: 1;
    }
  }

  /* Action CTA Button */
  button.action-btn {
    margin-top: 16px;
    width: 100%;
    height: 46px;
    border-radius: 9999px;
    border: 1.5px solid rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    color: #ffffff;
    font-weight: 600;
    font-size: 0.86rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition:
      background 0.25s ease,
      color 0.25s ease,
      transform 0.2s ease,
      border-color 0.25s ease,
      box-shadow 0.25s ease;

    &:hover:not(:disabled) {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.35);
    }

    &:active:not(:disabled) {
      transform: scale(0.97);
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.03);
      color: #94a3b8;
    }

    &.added {
      background: #34d399;
      color: #052e16;
      border-color: #34d399;
      box-shadow: 0 0 20px rgba(52, 211, 153, 0.6);
      font-weight: 700;
    }
  }
`;

const SizeChip = styled.button<{ $selected: boolean }>`
  flex: 1;
  height: 32px;
  border-radius: 9999px;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? '#ffffff' : 'rgba(255, 255, 255, 0.22)'};
  background: ${({ $selected }) =>
    $selected ? '#ffffff' : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ $selected }) => ($selected ? '#000000' : '#e2e8f0')};
  font-size: 0.75rem;
  font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s,
    transform 0.15s;

  &:hover {
    border-color: #ffffff;
    background: ${({ $selected }) =>
      $selected ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'};
    color: ${({ $selected }) => ($selected ? '#000000' : '#ffffff')};
  }
`;

/* Stage / Garment Viewport with Studio Lighting */
const GarmentStage = styled.div<{ $isAvailable: boolean }>`
  position: relative;
  height: 320px;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${({ $isAvailable }) =>
    $isAvailable
      ? `radial-gradient(
          circle at 50% 42%,
          rgba(255, 255, 255, 0.18) 0%,
          rgba(40, 48, 68, 0.45) 45%,
          rgba(11, 14, 22, 0.95) 85%
        )`
      : `radial-gradient(
          circle at 50% 50%,
          rgba(30, 36, 52, 0.4) 0%,
          rgba(10, 12, 18, 0.95) 80%
        )`};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  /* Ambient Studio Keylight effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% 25%,
      rgba(217, 200, 169, 0.08) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  /* Garment Image Container */
  .garment-img-box {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.85))
        drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7));
      transition:
        transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.25s ease;
    }
  }

  &:hover .garment-img-box img {
    transform: scale(1.06);
  }
`;

/* Interactive View Switcher Pill (Front | Back) */
const ViewSwitcher = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  background: rgba(8, 10, 15, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 9999px;
  padding: 3px;
  gap: 3px;
  z-index: 5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  button {
    background: transparent;
    border: none;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #94a3b8;
    text-transform: uppercase;
    transition:
      background 0.2s,
      color 0.2s,
      box-shadow 0.2s;

    &.active {
      background: #ffffff;
      color: #000000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    &:hover:not(.active) {
      color: #ffffff;
    }
  }
`;

/* Floating Glass Badges on Stage */
const StageBadge = styled.div<{ $position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }>`
  position: absolute;
  ${({ $position }) => {
    switch ($position) {
      case 'top-left':
        return 'top: 12px; left: 12px;';
      case 'top-right':
        return 'top: 12px; right: 12px;';
      case 'bottom-left':
        return 'bottom: 12px; left: 12px;';
      case 'bottom-right':
        return 'bottom: 12px; right: 12px;';
    }
  }}
  background: rgba(8, 10, 15, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 9999px;
  padding: 4px 10px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #e2e8f0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  &.gold {
    color: ${({ theme }) => theme.colors.gold};
    border-color: rgba(217, 200, 169, 0.35);
  }
`;

const PulseDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  display: inline-block;
  animation: ${pulseAnim} 2s infinite;
`;

const ClockDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gold};
  display: inline-block;
`;

/* Silhouette Stage for Upcoming Apparel (Sweaters & Hoodies) */
const SilhouetteStage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  svg {
    width: 140px;
    height: 140px;
    opacity: 0.85;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.9));
    transition: transform 0.35s ease;
  }

  &:hover svg {
    transform: scale(1.08);
  }

  .teaser-label {
    margin-top: 14px;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 0.95rem;
    letter-spacing: 0.16em;
    color: #ffffff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
    text-transform: uppercase;
  }

  .teaser-sub {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.gold};
    text-transform: uppercase;
    margin-top: 4px;
  }
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const isAvailable = product.status === 'available';
  const availableSizes = ['S', 'M', 'L', 'XL'] as const;

  const handleAdd = () => {
    if (!isAvailable || product.price === null) return;
    onAddToCart(product.name, product.price, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  return (
    <CardWrapper $soon={!isAvailable} className="card">
      <div className="card-header">
        <span className="eyebrow">
          {isAvailable ? 'Faith in Motion' : 'Capsule Drop'}
        </span>
        <span className="collection-tag">Collection 01</span>
      </div>

      <GarmentStage $isAvailable={isAvailable} className="sw">
        {isAvailable ? (
          <>
            {/* Badges */}
            <StageBadge $position="top-left" className="gold">
              Signature Piece
            </StageBadge>

            {/* Front / Back Toggle Pill */}
            <ViewSwitcher>
              <button
                type="button"
                className={activeView === 'front' ? 'active' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('front');
                }}
                title="View Front Chest Print"
              >
                Front
              </button>
              <button
                type="button"
                className={activeView === 'back' ? 'active' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('back');
                }}
                title="View Matthew 6:9-13 Prayer Backprint"
              >
                Back
              </button>
            </ViewSwitcher>

            {/* Garment Image Showcase */}
            <div className="garment-img-box">
              <img
                src={activeView === 'front' ? frontImgUrl : backImgUrl}
                alt={`${product.name} - ${activeView === 'front' ? 'Front Print' : 'Back Prayer Print'}`}
                loading="eager"
              />
            </div>

            <StageBadge $position="bottom-left">
              280 GSM Heavyweight
            </StageBadge>

            <StageBadge $position="bottom-right">
              <PulseDot /> In Stock
            </StageBadge>
          </>
        ) : (
          /* Upcoming Drops Mockup Stage */
          <>
            <StageBadge $position="top-left" className="gold">
              Upcoming Drop
            </StageBadge>

            <StageBadge $position="top-right" style={{ top: 12, right: 12 }}>
              <ClockDot /> Autumn / Winter
            </StageBadge>

            <SilhouetteStage>
              {product.id === 'sweaters' ? (
                /* Luxury Crewneck Sweater Vector Silhouette */
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient
                      id="sweaterGlow"
                      cx="50%"
                      cy="40%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor="#475569" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                    </radialGradient>
                    <linearGradient
                      id="sweaterShine"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  {/* Sweater Torso & Dropped Sleeves */}
                  <path
                    d="M 32 18 C 38 23 62 23 68 18 L 86 34 L 78 44 L 70 38 L 70 82 L 30 82 L 30 38 L 22 44 L 14 34 Z"
                    fill="url(#sweaterGlow)"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.2"
                  />
                  {/* Ribbed Neckline */}
                  <path
                    d="M 37 18 C 42 22 58 22 63 18"
                    stroke="#d9c8a9"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Subtle Chest Emblem Accent */}
                  <circle
                    cx="50"
                    cy="36"
                    r="4"
                    stroke="rgba(217, 200, 169, 0.4)"
                    strokeWidth="1"
                    fill="none"
                  />
                  <line
                    x1="46"
                    y1="36"
                    x2="54"
                    y2="36"
                    stroke="rgba(217, 200, 169, 0.4)"
                    strokeWidth="1"
                  />
                  <line
                    x1="50"
                    y1="32"
                    x2="50"
                    y2="40"
                    stroke="rgba(217, 200, 169, 0.4)"
                    strokeWidth="1"
                  />
                </svg>
              ) : (
                /* Luxury Boxy Heavyweight Hoodie Vector Silhouette */
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient
                      id="hoodieGlow"
                      cx="50%"
                      cy="40%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor="#475569" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                    </radialGradient>
                  </defs>
                  {/* Hood Silhouette */}
                  <path
                    d="M 36 24 C 36 12 64 12 64 24 Z"
                    fill="#1e293b"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.2"
                  />
                  {/* Hoodie Torso & Dropped Sleeves */}
                  <path
                    d="M 30 22 C 38 27 62 27 70 22 L 88 38 L 80 48 L 71 42 L 71 84 L 29 84 L 29 42 L 20 48 L 12 38 Z"
                    fill="url(#hoodieGlow)"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.2"
                  />
                  {/* Kangaroo Pocket */}
                  <path
                    d="M 38 60 L 62 60 L 59 74 L 41 74 Z"
                    fill="#0f172a"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                  />
                </svg>
              )}
              <div className="teaser-label">{product.name}</div>
              <div className="teaser-sub">
                {product.id === 'sweaters'
                  ? '380 GSM Heavy Fleece'
                  : '420 GSM French Terry'}
              </div>
            </SilhouetteStage>

            <StageBadge $position="bottom-left">
              {product.id === 'sweaters' ? 'Crewneck Cut' : 'Oversized Fit'}
            </StageBadge>
          </>
        )}
      </GarmentStage>

      <h4>{product.name}</h4>

      <p className="specs-line">
        {isAvailable
          ? 'Oversized Boxy Cut · Drop Shoulder · 100% Cotton'
          : product.id === 'sweaters'
            ? 'Pre-Shrunk Luxury Fleece · Dropped Seams'
            : 'Custom Double-Layered Hood · Kangaroo Pocket'}
      </p>

      <div className="price-row">
        <span className="price-value">
          {product.price !== null ? `$${product.price}` : '—'}
        </span>
        <span className="meta-tag">{product.meta}</span>
      </div>

      {/* Size Selector for Available Product */}
      {isAvailable && (
        <div className="size-selector">
          <span className="label">Size:</span>
          <div className="size-chips">
            {availableSizes.map((size) => (
              <SizeChip
                key={size}
                type="button"
                $selected={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </SizeChip>
            ))}
          </div>
        </div>
      )}

      {/* Add To Cart or Upcoming Trigger */}
      <button
        type="button"
        disabled={!isAvailable}
        onClick={handleAdd}
        className={`action-btn ${isAvailable ? 'add2' : ''} ${isAdded ? 'added' : ''}`}
      >
        {isAvailable
          ? isAdded
            ? `Added (${selectedSize}) ✓`
            : `Add to cart · $${product.price}`
          : 'Next Drop · Stay Tuned'}
      </button>
    </CardWrapper>
  );
};
