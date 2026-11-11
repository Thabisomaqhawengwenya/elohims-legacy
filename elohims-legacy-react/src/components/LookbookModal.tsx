import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import frontImgUrl from '../assets/front.webp';
import backImgUrl from '../assets/back.webp';
import tee2FrontUrl from '../assets/tee2-front.jpg';
import tee2BackUrl from '../assets/tee2-back.jpg';
import { Product, STORE_DATA } from '../data/content';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'front' | 'back';
  product?: Product | null;
  onAddToCart?: (name: string, price: number, size: string) => void;
  onOpenSizeGuide?: () => void;
  onOpenWaitlist?: (productName: string) => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(3, 4, 7, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 1200;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.22s ease-out;

  @media (max-width: 768px) {
    padding: 10px;
    align-items: flex-end;
  }
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 1060px;
  max-height: 88vh;
  background: var(--card-bg);
  border: 1px solid var(--border-medium);
  border-radius: 28px;
  box-shadow: 0 35px 90px rgba(0, 0, 0, 0.75);
  color: var(--text-primary);
  animation: ${slideUp} 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.12fr 1fr;
  position: relative;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
    max-height: 92vh;
    overflow-y: auto;
    border-radius: 24px 24px 16px 16px;
  }
`;

/* Left Column: High-Res 2D Garment Showcase Stage */
const ShowcaseStage = styled.div<{ $isZoomed: boolean }>`
  position: relative;
  background: radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(0, 0, 0, 0.35) 85%
    ),
    var(--swatch-stage-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 24px;
  min-height: 480px;
  border-right: 1px solid var(--border-light);
  overflow: hidden;
  cursor: ${({ $isZoomed }) => ($isZoomed ? 'zoom-out' : 'zoom-in')};
  user-select: none;

  @media (max-width: 880px) {
    border-right: none;
    border-bottom: 1px solid var(--border-light);
    min-height: 380px;
    padding: 24px 16px;
  }

  .stage-tags {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 10;
    pointer-events: none;

    .drop-chip {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--gold);
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(8px);
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      width: fit-content;
    }

    .view-chip {
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      font-weight: 600;
      color: #ffffff;
      background: rgba(20, 22, 28, 0.7);
      backdrop-filter: blur(8px);
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      width: fit-content;
    }
  }

  /* Single Unified Front/Back Flip Button */
  .flip-btn-dock {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;

    button.flip-toggle {
      background: rgba(10, 12, 16, 0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1.5px solid rgba(255, 255, 255, 0.22);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);

      &:hover {
        background: #ffffff;
        color: #000000;
        border-color: #ffffff;
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.96);
      }
    }
  }

  .garment-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 88%;
      max-height: 420px;
      object-fit: contain;
      filter: drop-shadow(0 22px 40px rgba(0, 0, 0, 0.55));
      transition:
        transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
        filter 0.3s ease;
      transform: ${({ $isZoomed }) => ($isZoomed ? 'scale(1.85)' : 'scale(1)')};
    }

    .placeholder-art {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px;

      span.glyph {
        font-size: 3.5rem;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      h4 {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1.4rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin: 0 0 6px 0;
      }

      p {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin: 0;
      }
    }
  }

  /* Studio Podium Shadow Base */
  .podium-base {
    position: absolute;
    bottom: 42px;
    width: 60%;
    height: 18px;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0) 75%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Bottom Macro Zoom Bar */
  .bottom-stage-bar {
    position: absolute;
    bottom: 18px;
    left: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    pointer-events: auto;

    span.hint {
      font-size: 0.7rem;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.7);
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(6px);
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.1);

      @media (max-width: 480px) {
        display: none;
      }
    }

    .zoom-chips {
      display: inline-flex;
      background: rgba(10, 12, 16, 0.75);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 9999px;
      padding: 3px;
      gap: 3px;

      button {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.65);
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.2s ease;

        &.active {
          background: #ffffff;
          color: #000000;
        }
      }
    }
  }
`;

/* Right Column: Floating Frosted Purchase & Details Panel */
const DetailsPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 34px 32px 30px 32px;
  overflow-y: auto;
  position: relative;
  background: var(--card-bg);

  @media (max-width: 880px) {
    padding: 24px 20px;
  }

  .top-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    span.eyebrow {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--gold);
    }

    button.close-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--text-muted);
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s ease;

      &:hover {
        background: var(--text-primary);
        color: var(--bg);
        border-color: var(--text-primary);
        transform: rotate(90deg);
      }
    }
  }

  h2.piece-title {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(1.35rem, 2.2vw, 1.85rem);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 0 14px 0;
    line-height: 1.25;
    color: var(--text-primary);
  }

  .price-stock-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    flex-wrap: wrap;

    .price-wrap {
      display: flex;
      align-items: baseline;
      gap: 8px;

      span.current-price {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1.6rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      span.original-price {
        font-size: 0.95rem;
        text-decoration: line-through;
        color: var(--text-muted);
      }
    }

    span.stock-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 9999px;
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);

      &.in-stock {
        color: #22c55e;
        border-color: rgba(34, 197, 94, 0.35);

        &::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
        }
      }

      &.out-of-stock {
        color: #f59e0b;
        border-color: rgba(245, 158, 11, 0.35);

        &::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
        }
      }
    }
  }

  /* Scripture Story & Garment Narrative */
  .story-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-light);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 22px;

    p.description {
      font-size: 0.88rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0 0 12px 0;
    }

    .scripture-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      span.scripture-tag {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 0.68rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--gold);
        background: var(--card-bg);
        border: 1px solid var(--border-medium);
        padding: 3px 8px;
        border-radius: 6px;
      }
    }
  }

  /* Specs Micro-Grid */
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 22px;

    .spec-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;

      span.label {
        font-size: 0.68rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-muted);
      }

      span.value {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 0.82rem;
        color: var(--text-primary);
        font-weight: 600;
      }
    }
  }

  /* Size Selector Section */
  .size-section {
    margin-bottom: 24px;

    .size-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      span.size-label {
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-primary);
      }

      button.size-guide-btn {
        background: transparent;
        border: none;
        color: var(--gold);
        font-size: 0.74rem;
        font-weight: 600;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .size-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;

      button.size-pill {
        background: var(--bg-surface);
        border: 1.5px solid var(--border-medium);
        color: var(--text-primary);
        padding: 10px 0;
        border-radius: 12px;
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(.active) {
          border-color: var(--text-primary);
          transform: translateY(-2px);
        }

        &.active {
          background: var(--text-primary);
          color: var(--bg);
          border-color: var(--text-primary);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        }
      }
    }
  }

  /* Primary CTA Buttons */
  .actions-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 22px;

    button.primary-cart-btn {
      width: 100%;
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
      border: none;
      padding: 14px 20px;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);

      &:hover {
        background: var(--btn-hover-bg);
        transform: translateY(-2px);
      }

      &:active {
        transform: scale(0.98);
      }

      &.added {
        background: #22c55e;
        color: #ffffff;
      }
    }

    button.secondary-waitlist-btn {
      width: 100%;
      background: var(--bg-surface);
      color: var(--text-primary);
      border: 1.5px solid var(--border-medium);
      padding: 14px 20px;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--text-primary);
        background: var(--card-bg);
        transform: translateY(-2px);
      }
    }

    a.whatsapp-quick-btn {
      width: 100%;
      background: rgba(37, 211, 102, 0.12);
      color: #25d366;
      border: 1.5px solid rgba(37, 211, 102, 0.35);
      padding: 12px 18px;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(37, 211, 102, 0.2);
        border-color: #25d366;
        transform: translateY(-2px);
      }
    }
  }

  /* Zimbabwe Trust Badges */
  .trust-strip {
    background: var(--bg-surface);
    border: 1px solid var(--border-light);
    border-radius: 14px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .trust-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.74rem;
      color: var(--text-secondary);

      span.icon {
        font-size: 0.95rem;
      }
    }
  }
`;

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  initialView = 'front',
  product,
  onAddToCart,
  onOpenSizeGuide,
  onOpenWaitlist,
}) => {
  const [activeView, setActiveView] = useState<'front' | 'back'>(initialView);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Distinguish pieces
  const isTee2 =
    product?.id === 'lord-i-cant-tee' ||
    product?.frontImage === 'tee2-front' ||
    Boolean(product?.name.toLowerCase().includes('lord') || product?.name.toLowerCase().includes("can't"));

  const isTee1 =
    product?.id === 'tee-1' ||
    product?.frontImage === 'front' ||
    Boolean(product?.name.toLowerCase().includes('directed') || product?.name.toLowerCase().includes('elohim'));

  const isTee = isTee1 || isTee2;
  const isAvailable = product?.status === 'available' || (!product?.status && product?.price !== null);
  const isOutOfStock = product?.status === 'out_of_stock';

  let frontSrc = frontImgUrl;
  let backSrc = backImgUrl;

  if (isTee2) {
    frontSrc = tee2FrontUrl;
    backSrc = tee2BackUrl;
  } else if (product?.frontImage && product.frontImage.startsWith('http')) {
    frontSrc = product.frontImage;
    backSrc = product.backImage || product.frontImage;
  }

  const displayName = product?.name || 'Directed by Elohim Tee';
  const price = product?.price ?? 25;
  const originalPrice = product?.originalPrice ?? (price > 0 ? price + 10 : null);
  const availableSizes = useMemo(
    () => (product?.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL']),
    [product?.sizes]
  );

  useEffect(() => {
    setActiveView(initialView);
    setIsZoomed(false);
    setIsAdded(false);
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  }, [initialView, isOpen, product, availableSizes, selectedSize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggleView = () => {
    setActiveView((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleAddToCart = () => {
    if (!onAddToCart || !isAvailable) return;
    onAddToCart(displayName, price, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  };

  // WhatsApp Pre-filled link
  const cleanPhone = STORE_DATA.whatsAppNumber.replace(/[^0-9]/g, '');
  const whatsAppText = encodeURIComponent(
    `Hi Elohim's Legacy! I would like to order the ${displayName} in size ${selectedSize} ($${price}). Harare delivery / payment instructions please!`
  );
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${whatsAppText}`;

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${displayName} Quick View Showcase`}
    >
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* Left Column: High-Res 2D Garment Showcase Stage (Minus 3D Rotation) */}
        <ShowcaseStage
          $isZoomed={isZoomed}
          onClick={() => setIsZoomed((prev) => !prev)}
        >
          <div className="stage-tags">
            <span className="drop-chip">
              {isTee2 ? 'Drop 02 · Boxy Cut' : 'Drop 01 · Original'}
            </span>
            <span className="view-chip">
              {activeView === 'front'
                ? 'Chest Print Detail'
                : isTee2
                  ? 'Scripture Seals & Collage'
                  : "Back Lord's Prayer (Matt 6:9-13)"}
            </span>
          </div>

          {/* Unified Front/Back Flip Toggle Button */}
          {isTee && (
            <div className="flip-btn-dock" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="flip-toggle"
                onClick={handleToggleView}
                title={`Switch to ${activeView === 'front' ? 'back' : 'front'} view`}
              >
                <span>{activeView === 'front' ? 'Back ⟲' : 'Front ⟲'}</span>
              </button>
            </div>
          )}

          <div className="garment-viewport">
            {isTee ? (
              <img
                src={activeView === 'front' ? frontSrc : backSrc}
                alt={`${displayName} - ${activeView} view`}
              />
            ) : (
              <div className="placeholder-art">
                <span className="glyph">✝</span>
                <h4>{displayName}</h4>
                <p>Limited Capsule Prototype · Upcoming Drop</p>
              </div>
            )}
          </div>

          <div className="podium-base" />

          {/* Bottom Zoom & Inspection Dock */}
          <div className="bottom-stage-bar" onClick={(e) => e.stopPropagation()}>
            <span className="hint">
              {isZoomed ? 'Click stage to zoom out' : 'Click garment to inspect print details'}
            </span>

            <div className="zoom-chips">
              <button
                type="button"
                className={!isZoomed ? 'active' : ''}
                onClick={() => setIsZoomed(false)}
              >
                100% Fit
              </button>
              <button
                type="button"
                className={isZoomed ? 'active' : ''}
                onClick={() => setIsZoomed(true)}
              >
                185% Macro
              </button>
            </div>
          </div>
        </ShowcaseStage>

        {/* Right Column: Floating Frosted Purchase & Details Panel */}
        <DetailsPanel>
          <div className="top-meta">
            <span className="eyebrow">
              {isTee2 ? 'Collection 02 · Biblical Streetwear' : 'Collection 01 · Elohim Exclusive'}
            </span>
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <h2 className="piece-title">{displayName}</h2>

          <div className="price-stock-row">
            <div className="price-wrap">
              <span className="current-price">
                {price !== null ? `$${price}` : 'TBA'}
              </span>
              {originalPrice && (
                <span className="original-price">${originalPrice}</span>
              )}
            </div>

            {isAvailable ? (
              <span className="stock-indicator in-stock">In Stock · Harare Hub</span>
            ) : isOutOfStock ? (
              <span className="stock-indicator out-of-stock">Sold Out · Restock Soon</span>
            ) : (
              <span className="stock-indicator out-of-stock">VIP Drop · Capsule</span>
            )}
          </div>

          {/* Scripture Story & Narrative */}
          <div className="story-card">
            <p className="description">
              {isTee2
                ? 'Crafted with a relaxed boxy cut from custom-milled 280 GSM cotton. Back piece features the multi-color paper collage typography "Lord, I Can\'t But You Can" anchored by five essential covenant promises.'
                : isTee1
                  ? 'A tribute to divine sovereignty. Features the iconic "Directed by Elohim" cutout ransom-style chest print and the complete Lord\'s Prayer (Matthew 6:9–13) on the reverse.'
                  : product?.specs || 'Exclusive capsule streetwear crafted with heavyweight premium cotton.'}
            </p>

            <div className="scripture-pills">
              {isTee2 ? (
                <>
                  <span className="scripture-tag">2 Cor 12:9 (Grace)</span>
                  <span className="scripture-tag">Isa 40:29 (Strength)</span>
                  <span className="scripture-tag">Matt 19:26 (All Things)</span>
                  <span className="scripture-tag">Phil 4:13 (Through Christ)</span>
                  <span className="scripture-tag">Ex 14:14 (Stillness)</span>
                </>
              ) : isTee1 ? (
                <>
                  <span className="scripture-tag">Matthew 6:9–13 (The Lord's Prayer)</span>
                  <span className="scripture-tag">Colossians 3:17</span>
                </>
              ) : (
                <span className="scripture-tag">Capsule Release</span>
              )}
            </div>
          </div>

          {/* Specs Micro-Grid */}
          <div className="specs-grid">
            <div className="spec-box">
              <span className="label">Fabric Weight</span>
              <span className="value">280 GSM Cotton</span>
            </div>
            <div className="spec-box">
              <span className="label">Silhouette</span>
              <span className="value">Boxy Streetwear Fit</span>
            </div>
            <div className="spec-box">
              <span className="label">Print Style</span>
              <span className="value">High-Density Plastisol</span>
            </div>
            <div className="spec-box">
              <span className="label">Collar</span>
              <span className="value">1.25" Reinforced Rib</span>
            </div>
          </div>

          {/* Size Selector */}
          {isAvailable && (
            <div className="size-section">
              <div className="size-header">
                <span className="size-label">Select Size</span>
                {onOpenSizeGuide && (
                  <button
                    type="button"
                    className="size-guide-btn"
                    onClick={() => {
                      onClose();
                      onOpenSizeGuide();
                    }}
                  >
                    Size Guide (cm/in) ↗
                  </button>
                )}
              </div>

              <div className="size-row">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="actions-group">
            {isAvailable ? (
              <>
                <button
                  type="button"
                  className={`primary-cart-btn ${isAdded ? 'added' : ''}`}
                  onClick={handleAddToCart}
                >
                  {isAdded ? `Added to Cart (${selectedSize}) ✓` : `Add to Cart — $${price}`}
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-quick-btn"
                >
                  <span>Order via WhatsApp ↗</span>
                </a>
              </>
            ) : isOutOfStock ? (
              <button
                type="button"
                className="secondary-waitlist-btn"
                onClick={() => {
                  onClose();
                  onOpenWaitlist?.(`${displayName} (Restock Alert)`);
                }}
              >
                Notify Me When Restocked ↗
              </button>
            ) : (
              <button
                type="button"
                className="secondary-waitlist-btn"
                onClick={() => {
                  onClose();
                  onOpenWaitlist?.(displayName);
                }}
              >
                Join VIP Drop Waitlist ↗
              </button>
            )}
          </div>

          {/* Zimbabwe Trust Strip */}
          <div className="trust-strip">
            <div className="trust-row">
              <span className="icon">⚡</span>
              <span>
                <strong>Harare Same-Day Dispatch</strong> · Bulawayo & Nationwide 24–48h
              </span>
            </div>
            <div className="trust-row">
              <span className="icon">💳</span>
              <span>
                <strong>Payment:</strong> EcoCash, InnBucks, USD Cash on Delivery
              </span>
            </div>
          </div>
        </DetailsPanel>
      </ModalContainer>
    </ModalOverlay>
  );
};
