import React, { useState } from 'react';
import styled from 'styled-components';
import frontImgUrl from '../assets/front.webp';
import backImgUrl from '../assets/back.webp';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (name: string, price: number, size: string) => void;
  onOpenLookbook?: (view: 'front' | 'back') => void;
  onOpenSizeGuide?: () => void;
  onOpenWaitlist?: (productName: string) => void;
}

const CardWrapper = styled.div<{ $soon: boolean; $outOfStock: boolean }>`
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 16px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s ease,
    border-color 0.3s ease;
  color: var(--card-text);
  opacity: ${({ $soon, $outOfStock }) => ($soon ? 0.88 : $outOfStock ? 0.8 : 1)};

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--card-shadow);
  }

  .badge-row {
    position: absolute;
    top: 26px;
    left: 26px;
    display: flex;
    gap: 6px;
    z-index: 6;
    flex-wrap: wrap;

    span.status-pill {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 3px 9px;
      border-radius: 9999px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: inline-flex;
      align-items: center;
      gap: 5px;

      &.in-stock {
        background: rgba(34, 197, 94, 0.9);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);

        &::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ffffff;
        }
      }

      &.out-of-stock {
        background: rgba(239, 68, 68, 0.9);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
      }

      &.promo-tag {
        background: var(--gold);
        color: #0c0d12;
        font-weight: 800;
        box-shadow: 0 2px 8px rgba(217, 200, 169, 0.3);
      }
    }
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    letter-spacing: 0.04em;
    font-size: 1.35rem;
    text-transform: uppercase;
    color: var(--card-text);
    line-height: 1.15;
    margin-top: 14px;
    padding: 0 2px;
  }

  .specs-line {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 5px;
    padding: 0 2px;
    line-height: 1.4;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 10px;
    padding: 0 2px;

    .price-group {
      display: flex;
      align-items: baseline;
      gap: 8px;

      .price-val {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1.4rem;
        color: var(--card-text);
        font-weight: 600;
        letter-spacing: 0.02em;

        &.sale {
          color: var(--gold);
        }
      }

      .orig-price {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1rem;
        color: var(--text-muted);
        text-decoration: line-through;
        opacity: 0.7;
      }
    }

    .meta-val {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
  }

  .size-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;

    span.lbl {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    button.guide-link {
      background: transparent;
      border: none;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: var(--gold);
      cursor: pointer;
      padding: 0;
      text-transform: uppercase;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
        text-decoration: underline;
      }
    }
  }

  .size-picker {
    display: flex;
    gap: 6px;
    margin-top: 6px;
  }

  button.action-btn {
    margin-top: 14px;
    width: 100%;
    height: 44px;
    border-radius: 9999px;
    border: none;
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    font-weight: 600;
    font-size: 0.86rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.2s ease,
      transform 0.15s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    &:hover:not(:disabled) {
      background: var(--btn-hover-bg);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &.waitlist-btn {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      color: var(--text-primary);
      cursor: pointer;

      &:hover {
        background: var(--text-primary);
        color: var(--bg);
        border-color: var(--text-primary);
        transform: translateY(-2px);
      }
    }

    &.out-btn {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      color: var(--text-muted);
      cursor: pointer;

      &:hover {
        border-color: var(--text-primary);
        color: var(--text-primary);
      }
    }

    &:disabled {
      background: var(--btn-disabled-bg);
      color: var(--text-muted);
      border: 1px solid var(--border-light);
      cursor: not-allowed;
    }

    &.added {
      background: #059669;
      color: #ffffff;
    }
  }
`;

const SizePill = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 32px;
  border-radius: 9999px;
  border: 1.5px solid
    ${({ $active }) => ($active ? 'var(--card-text)' : 'var(--border-medium)')};
  background: ${({ $active }) => ($active ? 'var(--card-text)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--bg)' : 'var(--card-text)')};
  font-size: 0.75rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  &:hover {
    border-color: var(--card-text);
    background: ${({ $active }) =>
      $active ? 'var(--card-text)' : 'rgba(128, 128, 128, 0.1)'};
  }
`;

const SwatchStage = styled.div<{ $isAvailable: boolean }>`
  position: relative;
  height: 310px;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: ${({ $isAvailable }) =>
    $isAvailable
      ? 'var(--swatch-stage-bg)'
      : 'var(--btn-disabled-bg)'};
  border: 1px solid var(--swatch-border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

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
      filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.3));
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

    span.soon-tag {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.5rem;
      letter-spacing: 0.2em;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 500;
    }

    span.drop-tag {
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-top: 6px;
      font-weight: 600;
      opacity: 0.8;
    }
  }
`;

const ViewToggle = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 9999px;
  padding: 2px;
  gap: 2px;
  z-index: 5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  button {
    background: transparent;
    border: none;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #52525b;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s;

    &.active {
      background: #0c0d12;
      color: #ffffff;
    }

    &:hover:not(.active) {
      color: #0c0d12;
    }
  }
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenLookbook,
  onOpenSizeGuide,
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

  const handleAdd = () => {
    if (!isAvailable || product.price === null) return;
    onAddToCart(product.name, product.price, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  return (
    <CardWrapper
      $soon={isSoon}
      $outOfStock={isOutOfStock}
      className="card"
    >
      <div className="badge-row">
        {isAvailable && (
          <span className="status-pill in-stock">
            In Stock
          </span>
        )}
        {isOutOfStock && (
          <span className="status-pill out-of-stock">
            Out of Stock
          </span>
        )}
        {product.promoBadge && (
          <span className="status-pill promo-tag">
            {product.promoBadge}
          </span>
        )}
      </div>

      <SwatchStage $isAvailable={isAvailable || isOutOfStock} className="sw">
        {isAvailable || isOutOfStock ? (
          <>
            <ViewToggle>
              <button
                type="button"
                className={activeView === 'front' ? 'active' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('front');
                }}
                title="View Front Print"
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
                title="View Back Prayer Print"
              >
                Back
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLookbook?.(activeView);
                }}
                title="Inspect Garment in Macro Studio"
              >
                Zoom ⌕
              </button>
            </ViewToggle>

            <div
              className="garment-wrapper"
              onClick={() => onOpenLookbook?.(activeView)}
              style={{ cursor: 'pointer' }}
              title="Click to zoom in macro studio"
            >
              <img
                src={activeView === 'front' ? frontImgUrl : backImgUrl}
                alt={`${product.name} - ${activeView === 'front' ? 'Front' : 'Back'}`}
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

      <h4>{product.name}</h4>

      <p className="specs-line">
        {product.specs || (isSoon ? 'Capsule Collection · Limited Run' : 'Oversized Boxy Fit · Heavyweight Cotton')}
      </p>

      <div className="price-row">
        <div className="price-group">
          <span className={`price-val ${hasDiscount ? 'sale' : ''}`}>
            {product.price !== null ? `$${product.price}` : '—'}
          </span>
          {hasDiscount && (
            <span className="orig-price">${product.originalPrice}</span>
          )}
        </div>
        <span className="meta-val">{product.meta}</span>
      </div>

      {isAvailable && (
        <>
          <div className="size-header-row">
            <span className="lbl">Select Size</span>
            <button
              type="button"
              className="guide-link"
              onClick={() => onOpenSizeGuide?.()}
            >
              Size Guide ↗
            </button>
          </div>
          <div className="size-picker">
            {availableSizes.map((size) => (
              <SizePill
                key={size}
                type="button"
                $active={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </SizePill>
            ))}
          </div>
        </>
      )}

      {isAvailable ? (
        <button
          type="button"
          onClick={handleAdd}
          className={`action-btn add2 ${isAdded ? 'added' : ''}`}
        >
          {isAdded
            ? `Added (${selectedSize}) ✓`
            : `Add to cart · $${product.price}`}
        </button>
      ) : isOutOfStock ? (
        <button
          type="button"
          onClick={() => onOpenWaitlist?.(`${product.name} (Restock Alert)`)}
          className="action-btn out-btn"
        >
          Sold Out · Notify Restock ↗
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onOpenWaitlist?.(product.name)}
          className="action-btn waitlist-btn"
        >
          VIP Drop Access ↗
        </button>
      )}
    </CardWrapper>
  );
};
