import React, { useState } from 'react';
import styled from 'styled-components';

interface ProductSectionProps {
  onAddToCart: (name: string, price: number, size: string) => void;
}

const Price = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  margin-top: 22px;
  color: ${({ theme }) => theme.colors.gold};
`;

const SizesContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 14px 0;

  button {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.borderButton};
    background: none;
    color: #ffffff;
    font-size: 0.75rem;
    transition:
      background 0.2s,
      color 0.2s;

    &.on {
      background: #ffffff;
      color: #000000;
    }
  }
`;

const AddButton = styled.button`
  border: 0;
  background: ${({ theme }) => theme.colors.blue};
  color: #000000;
  padding: 14px 34px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.85rem;
  transition:
    transform 0.2s,
    background 0.2s;

  &:hover {
    transform: scale(1.06);
    background: ${({ theme }) => theme.colors.gold};
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
