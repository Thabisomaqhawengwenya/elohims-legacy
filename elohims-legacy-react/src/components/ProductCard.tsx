import React, { useState } from 'react';
import styled from 'styled-components';
import frontImgUrl from '../assets/front.webp';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (name: string, price: number, size: string) => void;
}

const CardWrapper = styled.div<{ $soon: boolean }>`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.borderDark};
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(6px);
  transition:
    transform 0.3s,
    border-color 0.3s;
  opacity: ${({ $soon }) => ($soon ? 0.55 : 1)};

  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.colors.blue};
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    letter-spacing: 0.05em;
    font-size: 1.2rem;
    text-transform: uppercase;
  }

  div.m {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.85rem;

    b {
      color: #ffffff;
    }
  }

  button {
    margin-top: 12px;
    width: 100%;
    padding: 10px;
    border-radius: 30px;
    border: 1px solid #ffffff;
    background: none;
    color: #ffffff;
    font-weight: 600;
    font-size: 0.8rem;
    transition: background 0.2s, color 0.2s;

    &:hover:not(:disabled) {
      background: #ffffff;
      color: #000000;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const Swatch = styled.div<{ $isAvailable: boolean }>`
  height: 220px;
  display: grid;
  place-items: center;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.15em;
  color: #777777;
  border-radius: 10px;
  margin-bottom: 14px;
  background: ${({ $isAvailable }) =>
    $isAvailable
      ? `url(${frontImgUrl}) center / 88% no-repeat, radial-gradient(circle at 50% 35%, #e3ddd0, #8f897c)`
      : '#14151a'};
  filter: ${({ $isAvailable }) =>
    $isAvailable ? 'drop-shadow(0 8px 14px rgba(0, 0, 0, 0.35))' : 'none'};
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const [buttonLabel, setButtonLabel] = useState<string>('Add to cart');
  const isAvailable = product.status === 'available';

  const handleAdd = () => {
    if (!isAvailable || product.price === null) return;
    onAddToCart(product.name, product.price, 'M');
    setButtonLabel('Added ✓');
    setTimeout(() => {
      setButtonLabel('Add to cart');
    }, 1200);
  };

  return (
    <CardWrapper $soon={!isAvailable} className="card">
      <Swatch $isAvailable={isAvailable} className="sw">
        {!isAvailable && 'SOON'}
      </Swatch>
      <h4>{product.name}</h4>
      <div className="m">
        <span>{product.meta}</span>
        <b>{product.price !== null ? `$${product.price}` : '—'}</b>
      </div>
      <button
        type="button"
        disabled={!isAvailable}
        onClick={handleAdd}
        className={isAvailable ? 'add2' : ''}
      >
        {isAvailable ? buttonLabel : 'Coming soon'}
      </button>
    </CardWrapper>
  );
};
