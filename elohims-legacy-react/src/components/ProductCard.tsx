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
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 22px;
  padding: 14px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  color: var(--card-text);
  transition:
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s ease;
  opacity: ${({ $soon, $outOfStock }) => ($soon ? 0.92 : $outOfStock ? 0.85 : 1)};

  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-medium);
  }
`;

const SwatchStage = styled.div<{ $isAvailable: boolean }>`
  position: relative;
  height: 310px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: ${({ $isAvailable }) =>
    $isAvailable ? 'var(--swatch-stage-bg)' : 'var(--btn-disabled-bg)'};
  border: 1px solid var(--swatch-border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  cursor: pointer;

  .garment-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);

    img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.35));
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  &:hover .garment-wrapper img {
    transform: scale(1.04);
  }

  .placeholder-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;

    span.soon-tag {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.4rem;
      letter-spacing: 0.18em;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 500;
    }

    span.drop-tag {
      font-size: 0.74rem;
      letter-spacing: 0.1em;
      color: var(--gold);
      text-transform: uppercase;
      margin-top: 6px;
      font-weight: 700;
    }
  }
`;

/* Single Unified Front / Back Flip Button */
const FlipButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  padding: 5px 12px;
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
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

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
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.75);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  cursor: pointer;
  z-index: 6;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 4px 4px;
  gap: 10px;

  .title-price-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;

    h4 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-weight: 500;
      letter-spacing: 0.03em;
      font-size: 1.15rem;
      text-transform: uppercase;
      color: var(--card-text);
      line-height: 1.2;
      margin: 0;
    }

    .price-box {
      display: flex;
      align-items: baseline;
      gap: 6px;

      span.price {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--gold);
      }

      span.orig-price {
        font-size: 0.8rem;
        color: var(--text-muted);
        text-decoration: line-through;
        opacity: 0.7;
      }
    }
  }

  p.specs-text {
    margin: 0;
    font-size: 0.76rem;
    color: var(--text-muted);
    line-height: 1.35;
  }

  /* Minimalist Size Ribbon */
  .size-ribbon {
    display: flex;
    background: var(--bg-surface);
    border: 1px solid var(--border-medium);
    border-radius: 9999px;
    padding: 2px;
    gap: 2px;

    button.size-chip {
      flex: 1;
      height: 28px;
      border-radius: 9999px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.72rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;

      &.active {
        background: var(--btn-primary-bg);
        color: var(--btn-primary-text);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }

      &:hover:not(.active) {
        color: var(--text-primary);
      }
    }
  }

  /* Streamlined Minimal Action Button */
  button.cta-btn {
    width: 100%;
    height: 42px;
    border-radius: 9999px;
    border: none;
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: var(--btn-shadow);

    &:hover:not(:disabled) {
      background: var(--btn-hover-bg);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &.added {
      background: #059669;
      color: #ffffff;
    }

    &.soon-btn {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      color: var(--text-primary);

      &:hover {
        background: var(--text-primary);
        color: var(--bg);
        border-color: var(--text-primary);
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
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAdded, setIsAdded] = useState<boolean>(false);

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
      <SwatchStage
        $isAvailable={isAvailable || isOutOfStock}
        className="sw"
        onClick={() => {
          if (isTee) {
            handleToggleView();
          }
        }}
        title={isTee ? `Click garment or button to view ${activeView === 'front' ? 'back' : 'front'}` : undefined}
      >
        {isAvailable || isOutOfStock ? (
          <>
            {/* Single Unified Flip Button */}
            {isTee && (
              <FlipButton
                type="button"
                onClick={handleToggleView}
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
              title="Inspect Garment in Macro Studio"
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
          <div className="placeholder-box">
            <span className="soon-tag">Coming Soon</span>
            <span className="drop-tag">Next Drop</span>
          </div>
        )}
      </SwatchStage>

      <CardBody>
        <div className="title-price-row">
          <h4>{product.name}</h4>
          <div className="price-box">
            <span className="price">
              {product.price !== null ? `$${product.price}` : '—'}
            </span>
            {hasDiscount && (
              <span className="orig-price">${product.originalPrice}</span>
            )}
          </div>
        </div>

        <p className="specs-text">
          {product.specs || (isSoon ? 'Limited Capsule Drop' : '280 GSM Heavyweight Cotton · Oversized Cut')}
        </p>

        {/* Minimalist Size Ribbon */}
        {isAvailable && (
          <div className="size-ribbon">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Action Button */}
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
