import React, { useState } from 'react';
import styled from 'styled-components';
import frontImgUrl from '../assets/front.webp';
import backImgUrl from '../assets/back.webp';
import tee2FrontUrl from '../assets/tee2-front.jpg';
import tee2BackUrl from '../assets/tee2-back.jpg';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (name: string, price: number, size: string) => void;
  onOpenLookbook?: (view: 'front' | 'back', product?: Product) => void;
  onOpenSizeGuide?: () => void;
  onOpenWaitlist?: (productName: string) => void;
}

const CardWrapper = styled.div<{ $soon: boolean; $outOfStock: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: var(--card-text);
  background: rgba(15, 17, 23, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 44px;
  padding: 12px 12px 18px 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  transition:
    transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s ease,
    box-shadow 0.28s ease;
  opacity: ${({ $soon, $outOfStock }) => ($soon ? 0.92 : $outOfStock ? 0.85 : 1)};

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(215, 152, 114, 0.4);
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.55);
  }
`;

/* Squircle Garment Image Stage matching Studio Lighting (Zero Square Box Cutoff) */
const SwatchStage = styled.div<{ $isAvailable: boolean }>`
  position: relative;
  height: 330px;
  width: 100%;
  border-radius: 36px;
  overflow: hidden;
  background: ${({ $isAvailable }) =>
    $isAvailable
      ? 'radial-gradient(circle at 50% 50%, #d8dde1 0%, #b8c0c6 100%)'
      : 'radial-gradient(circle at 50% 50%, #20242f 0%, #11141c 100%)'};
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  transition:
    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease;

  .garment-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);

    img {
      max-width: 92%;
      max-height: 92%;
      object-fit: contain;
      filter: drop-shadow(0 14px 22px rgba(0, 0, 0, 0.32));
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  &:hover .garment-wrapper img {
    transform: scale(1.05);
  }

  .placeholder-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;

    span.glyph {
      font-size: 2.8rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    span.soon-tag {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.25rem;
      letter-spacing: 0.16em;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    span.drop-tag {
      font-size: 0.74rem;
      letter-spacing: 0.12em;
      color: #d79872;
      text-transform: uppercase;
      margin-top: 6px;
      font-weight: 700;
    }
  }
`;

/* Single Unified Front / Back Flip Button */
const FlipButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(10, 12, 16, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 9999px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  z-index: 6;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);

  &:hover {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
    transform: scale(1.04);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const ZoomPill = styled.button`
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(10, 12, 16, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.85);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  cursor: pointer;
  z-index: 6;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
    transform: scale(1.06);
  }
`;

/* Clean Minimal Centered Details Stack matching Reference */
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 8px 4px 8px;
  gap: 6px;

  h4.product-title {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 700;
    letter-spacing: 0.04em;
    font-size: 1.02rem;
    text-transform: uppercase;
    color: var(--card-text);
    line-height: 1.25;
    margin: 0;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #d79872;
    }
  }

  /* Centered Sizes Line ("S, M, L" / "S · M · L · XL") */
  .sizes-row {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.84rem;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    font-weight: 500;
    margin: 1px 0;

    span.size-chip {
      cursor: pointer;
      padding: 1px 6px;
      border-radius: 6px;
      transition: all 0.15s ease;

      &.active {
        color: var(--card-text);
        font-weight: 700;
        background: var(--bg-surface);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      }

      &:hover:not(.active) {
        color: var(--card-text);
      }
    }
  }

  /* Centered Price ("1000 ₽" -> "$25") */
  .price-row {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
    margin: 2px 0 10px 0;

    span.price {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--card-text);
    }

    span.orig-price {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-decoration: line-through;
      opacity: 0.7;
    }
  }

  /* Full Pill Action Button styled in Reference Caramel/Terracotta Tone */
  button.cta-btn {
    width: 100%;
    max-width: 240px;
    height: 46px;
    border-radius: 9999px;
    border: none;
    background: #d79872;
    color: #ffffff;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 0.84rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 6px 18px rgba(215, 152, 114, 0.35);

    &:hover:not(:disabled) {
      background: #c88962;
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(215, 152, 114, 0.45);
    }

    &:active:not(:disabled) {
      transform: scale(0.96);
    }

    &.added {
      background: #22c55e;
      color: #ffffff;
      box-shadow: 0 6px 18px rgba(34, 197, 94, 0.35);
    }

    &.soon-btn {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      color: var(--text-primary);
      box-shadow: none;

      &:hover {
        background: var(--card-bg);
        border-color: #d79872;
        color: #d79872;
        transform: translateY(-2px);
      }
    }
  }
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenLookbook,
  onOpenWaitlist,
}) => {
  const isAvailable = product.status === 'available' || product.status === 'in_stock';
  const isOutOfStock = product.status === 'out_of_stock';
  const isSoon = product.status === 'soon';
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];

  const hasDiscount = Boolean(product.originalPrice && product.price && product.originalPrice > product.price);

  const isTee =
    product.category?.toLowerCase().includes('t-shirt') ||
    product.category?.toLowerCase().includes('tee') ||
    product.name.toLowerCase().includes('tee');

  const isTee2 =
    product.id === 'lord-i-cant-tee' ||
    product.frontImage === 'tee2-front' ||
    product.name.toLowerCase().includes('lord') ||
    product.name.toLowerCase().includes("can't");

  // Tee 2 defaults to the iconic back collage; Tee 1 defaults to front chest print
  const [activeView, setActiveView] = useState<'front' | 'back'>(isTee2 ? 'back' : 'front');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const frontSrc = isTee2 ? tee2FrontUrl : frontImgUrl;
  const backSrc = isTee2 ? tee2BackUrl : backImgUrl;

  const handleToggleView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveView((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable || product.price === null) return;
    onAddToCart(product.name, product.price, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  return (
    <CardWrapper
      $soon={isSoon}
      $outOfStock={isOutOfStock}
      className="card"
    >
      {/* Squircle Garment Stage */}
      <SwatchStage
        $isAvailable={isAvailable || isOutOfStock}
        className="sw"
        onClick={() => {
          onOpenLookbook?.(activeView, product);
        }}
        title={`Click to quick view ${product.name}`}
      >
        {isAvailable || isOutOfStock ? (
          <>
            {/* Single Unified Flip Button */}
            {isTee && (
              <FlipButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleView();
                }}
                title={`Switch to ${activeView === 'front' ? 'back' : 'front'} view`}
              >
                <span>{activeView === 'front' ? 'Back ⟲' : 'Front ⟲'}</span>
              </FlipButton>
            )}

            {/* Subtle Zoom Trigger */}
            <ZoomPill
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLookbook?.(activeView, product);
              }}
              title="Quick View & Garment Showcase"
            >
              ⌕
            </ZoomPill>

            <div className="garment-wrapper">
              <img
                src={activeView === 'front' ? frontSrc : backSrc}
                alt={`${product.name} - ${activeView}`}
                loading="eager"
              />
            </div>
          </>
        ) : (
          <div
            className="placeholder-box"
            onClick={() => onOpenLookbook?.(activeView, product)}
          >
            <span className="glyph">✝</span>
            <span className="soon-tag">Coming Soon</span>
            <span className="drop-tag">Next Drop</span>
          </div>
        )}
      </SwatchStage>

      {/* Centered Minimal Details Stack matching Reference */}
      <CardBody>
        <h4
          className="product-title"
          onClick={() => onOpenLookbook?.(activeView, product)}
        >
          {product.name}
        </h4>

        {/* Centered Available Sizes ("S, M, L" / "S · M · L · XL") */}
        <div className="sizes-row">
          {availableSizes.map((size, idx) => (
            <React.Fragment key={size}>
              <span
                className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                title={`Select size ${size}`}
              >
                {size}
              </span>
              {idx < availableSizes.length - 1 && <span>,</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Centered Price ("1000 ₽" -> "$25") */}
        <div className="price-row">
          <span className="price">
            {product.price !== null ? `$${product.price}` : '—'}
          </span>
          {hasDiscount && (
            <span className="orig-price">${product.originalPrice}</span>
          )}
        </div>

        {/* Full Pill Warm Caramel/Terracotta Action Button */}
        {isAvailable ? (
          <button
            type="button"
            onClick={handleAdd}
            className={`cta-btn ${isAdded ? 'added' : ''}`}
          >
            {isAdded ? `Added (${selectedSize}) ✓` : 'Add to Cart'}
          </button>
        ) : isOutOfStock ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenWaitlist?.(`${product.name} (Restock Alert)`);
            }}
            className="cta-btn soon-btn"
          >
            Notify Restock ↗
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenWaitlist?.(product.name);
            }}
            className="cta-btn soon-btn"
          >
            VIP Drop Access ↗
          </button>
        )}
      </CardBody>
    </CardWrapper>
  );
};
