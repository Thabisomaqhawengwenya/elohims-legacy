import React, { useState } from 'react';
import styled from 'styled-components';

interface ProductSectionProps {
  onAddToCart: (name: string, price: number, size: string) => void;
  onOpenLookbook?: (view: 'front' | 'back') => void;
  onOpenSizeGuide?: () => void;
}

const Price = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2.2rem;
  margin-top: 22px;
  color: var(--gold);
  text-shadow: var(--gold-shadow);
  transition: color 0.3s ease;
`;

const SizeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;

  span.size-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  button.guide-btn {
    background: transparent;
    border: none;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
`;

const SizesContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0 20px;

  button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid var(--border-medium);
    background: var(--size-btn-bg);
    backdrop-filter: blur(10px);
    color: var(--text-primary);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s,
      border-color 0.2s,
      box-shadow 0.2s,
      transform 0.2s;

    &:hover {
      border-color: var(--text-primary);
      background: rgba(128, 128, 128, 0.15);
      transform: scale(1.05);
    }

    &.on {
      background: var(--text-primary);
      color: var(--bg);
      border-color: var(--text-primary);
      font-weight: 700;
      box-shadow: 0 0 16px rgba(128, 128, 128, 0.3);
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
`;

const AddButton = styled.button`
  border: 0;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  padding: 15px 38px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  box-shadow: var(--btn-shadow);
  cursor: pointer;
  transition:
    transform 0.2s,
    background 0.2s,
    box-shadow 0.2s,
    color 0.2s;

  &:hover {
    transform: scale(1.04);
    background: var(--btn-hover-bg);
    color: var(--btn-primary-text);
  }
`;

const SecondaryButton = styled.button`
  border: 1px solid var(--border-medium);
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 14px 26px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--text-primary);
    background: var(--card-bg);
    transform: scale(1.02);
  }
`;

export const ProductSection: React.FC<ProductSectionProps> = ({
  onAddToCart,
  onOpenLookbook,
  onOpenSizeGuide,
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

      <div className="rv">
        <SizeHeader>
          <span className="size-label">Select Size</span>
          <button
            type="button"
            className="guide-btn"
            onClick={() => onOpenSizeGuide?.()}
          >
            Size & Fit Guide ↗
          </button>
        </SizeHeader>
      </div>

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

      <ButtonRow className="rv">
        <AddButton
          type="button"
          className="add"
          data-n="Directed by Elohim Tee"
          data-p="25"
          onClick={handleAdd}
        >
          {buttonLabel}
        </AddButton>
        <SecondaryButton
          type="button"
          onClick={() => onOpenLookbook?.('front')}
        >
          Inspect Macro View ⌕
        </SecondaryButton>
      </ButtonRow>
    </section>
  );
};
