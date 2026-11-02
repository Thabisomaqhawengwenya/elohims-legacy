import React, { useState } from 'react';
import styled from 'styled-components';
import frontImgUrl from '../assets/front.webp';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (name: string, price: number, size: string) => void;
}

const CardWrapper = styled.div<{ $soon: boolean }>`
  background: rgba(14, 17, 25, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  padding: 18px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
  transition:
    transform 0.3s,
    border-color 0.3s,
    box-shadow 0.3s;
  opacity: ${({ $soon }) => ($soon ? 0.65 : 1)};

  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.colors.blue};
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.85);
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    letter-spacing: 0.05em;
    font-size: 1.3rem;
    text-transform: uppercase;
    color: #ffffff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  }

  div.m {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    color: #cbd5e1;
    font-size: 0.9rem;
    font-weight: 500;

    b {
      color: #ffffff;
      font-size: 1.05rem;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
    }
  }

  button {
    margin-top: 14px;
    width: 100%;
    padding: 12px;
    border-radius: 30px;
    border: 1.5px solid rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    color: #ffffff;
    font-weight: 600;
    font-size: 0.85rem;
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.2s,
      border-color 0.2s;

    &:hover:not(:disabled) {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      transform: scale(1.02);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const Swatch = styled.div<{ $isAvailable: boolean }>`
  height: 220px;
  display: grid;
  place-items: center;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.15em;
  color: #a0aec0;
  border-radius: 12px;
  margin-bottom: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: ${({ $isAvailable }) =>
    $isAvailable
      ? `url(${frontImgUrl}) center / 88% no-repeat, radial-gradient(circle at 50% 35%, #e3ddd0, #8f897c)`
      : '#12141c'};
  filter: ${({ $isAvailable }) =>
    $isAvailable ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.45))' : 'none'};
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
