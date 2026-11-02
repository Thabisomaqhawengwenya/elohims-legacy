import React, { useState } from 'react';
import styled from 'styled-components';
import frontImgUrl from '../assets/front.webp';
import backImgUrl from '../assets/back.webp';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (name: string, price: number, size: string) => void;
}

const CardWrapper = styled.div<{ $soon: boolean }>`
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
  opacity: ${({ $soon }) => ($soon ? 0.85 : 1)};

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--card-shadow);
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

    .price-val {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.4rem;
      color: var(--card-text);
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .meta-val {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
  }

  .size-picker {
    display: flex;
    gap: 6px;
    margin-top: 12px;
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
      color 0.2s ease;

    &:hover:not(:disabled) {
      background: var(--btn-hover-bg);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
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
      <SwatchStage $isAvailable={isAvailable} className="sw">
        {isAvailable ? (
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
            </ViewToggle>

            <div className="garment-wrapper">
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

      {isAvailable && (
        <p className="specs-line">
          Oversized Boxy Fit · Heavyweight Cotton
        </p>
      )}

      <div className="price-row">
        <span className="price-val">
          {product.price !== null ? `$${product.price}` : '—'}
        </span>
        <span className="meta-val">{product.meta}</span>
      </div>

      {isAvailable && (
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
      )}

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
          : 'Coming Soon'}
      </button>
    </CardWrapper>
  );
};
