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
  background: #c8cbd0;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: #0c0d12;
  opacity: ${({ $soon }) => ($soon ? 0.9 : 1)};

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 48px rgba(0, 0, 0, 0.6);
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    letter-spacing: 0.04em;
    font-size: 1.35rem;
    text-transform: uppercase;
    color: #0c0d12;
    line-height: 1.15;
    margin-top: 14px;
    padding: 0 2px;
  }

  .specs-line {
    font-size: 0.8rem;
    color: #52525b;
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
      color: #0c0d12;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .meta-val {
      font-size: 0.8rem;
      color: #52525b;
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
    background: #0c0d12;
    color: #ffffff;
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
      transform 0.15s ease;

    &:hover:not(:disabled) {
      background: #27272a;
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      background: rgba(0, 0, 0, 0.08);
      color: #71717a;
      border: 1px solid rgba(0, 0, 0, 0.12);
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
    ${({ $active }) => ($active ? '#0c0d12' : 'rgba(0, 0, 0, 0.2)')};
  background: ${({ $active }) => ($active ? '#0c0d12' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#18181b')};
  font-size: 0.75rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  &:hover {
    border-color: #0c0d12;
    background: ${({ $active }) => ($active ? '#0c0d12' : 'rgba(0, 0, 0, 0.08)')};
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
      ? 'radial-gradient(circle at 50% 45%, #d6d9de 0%, #b8bcc3 100%)'
      : '#b8bcc3'};
  border: 1px solid rgba(0, 0, 0, 0.08);
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
      color: #52525b;
      text-transform: uppercase;
      font-weight: 500;
    }

    span.drop-tag {
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      color: #71717a;
      text-transform: uppercase;
      margin-top: 6px;
      font-weight: 600;
    }
  }
`;

const ViewToggle = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  background: rgba(255, 255, 255, 0.85);
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
