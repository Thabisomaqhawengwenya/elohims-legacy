import React, { useState } from 'react';
import styled from 'styled-components';

interface ProductSectionProps {
  onAddToCart: (name: string, price: number, size: string) => void;
}

const Price = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2.2rem;
  margin-top: 22px;
  color: ${({ theme }) => theme.colors.gold};
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9);
`;

const SizesContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 16px 0;

  button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    background: rgba(15, 17, 24, 0.7);
    backdrop-filter: blur(10px);
    color: #ffffff;
    font-size: 0.8rem;
    font-weight: 600;
    transition:
      background 0.2s,
      color 0.2s,
      border-color 0.2s,
      box-shadow 0.2s,
      transform 0.2s;

    &:hover {
      border-color: #ffffff;
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
    }

    &.on {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      font-weight: 700;
      box-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
    }
  }
`;

const AddButton = styled.button`
  border: 0;
  background: ${({ theme }) => theme.colors.blue};
  color: #000000;
  padding: 15px 38px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 20px rgba(217, 200, 169, 0.35);
  transition:
    transform 0.2s,
    background 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: scale(1.06);
    background: #e5d5b7;
    box-shadow: 0 6px 28px rgba(217, 200, 169, 0.55);
    color: #000000;
  }
`;

export const ProductSection: React.FC<ProductSectionProps> = ({
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [buttonLabel, setButtonLabel] = useState<string>('Add to cart');

  const sizes = ['S', 'M', 'L', 'XL'] as const;

  const handleAdd = () => {
    onAddToCart('Directed by Elohim Tee', 25, selectedSize);
    setButtonLabel('Added ✓');
    setTimeout(() => {
      setButtonLabel('Add to cart');
    }, 1200);
  };

  return (
    <section>
      <h2 className="d rv" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
        The <span className="o">tee</span>
      </h2>
      <p className="l rv">
        Oversized boxy fit, drop shoulder, soft-washed heavyweight cotton.{' '}
        <b>Directed by Elohim</b> on the front, the prayer on the back.
      </p>
      <Price className="price rv">$25</Price>
      <SizesContainer className="sizes rv">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={selectedSize === size ? 'on' : ''}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </SizesContainer>
      <div className="rv">
        <AddButton
          type="button"
          className="add"
          data-n="Directed by Elohim Tee"
          data-p="25"
          onClick={handleAdd}
        >
          {buttonLabel}
        </AddButton>
      </div>
    </section>
  );
};
