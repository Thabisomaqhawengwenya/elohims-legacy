import React, { useState } from 'react';
import styled from 'styled-components';
import { ProductCard } from '../ProductCard';
import { ArcCarousel } from '../ArcCarousel';
import { Product } from '../../data/content';

interface ShopSectionProps {
  products: Product[];
  onAddToCart: (name: string, price: number, size: string) => void;
  onOpenLookbook?: (view: 'front' | 'back', product?: Product) => void;
  onOpenSizeGuide?: () => void;
  onOpenWaitlist?: (productName: string) => void;
}

const ShopContainer = styled.section`
  padding: 10vh 5vw 8vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .header-group {
    width: 100%;
    max-width: 1280px;
    margin-bottom: 10px;

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;
    }
  }
`;

const LayoutSwitcher = styled.div`
  display: inline-flex;
  background: var(--bg-surface);
  border: 1.5px solid var(--border-medium);
  border-radius: 9999px;
  padding: 3px;
  gap: 3px;

  button {
    background: transparent;
    border: none;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 9999px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    &:hover:not(.active) {
      color: var(--text-primary);
    }
  }
`;

const FlatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 26px;
  width: 100%;
  max-width: 1280px;
  margin-top: 24px;

  @media (min-width: 1180px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1179px) and (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 639px) {
    grid-template-columns: 1fr;
  }
`;

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  onAddToCart,
  onOpenLookbook,
  onOpenSizeGuide,
  onOpenWaitlist,
}) => {
  const [layoutMode, setLayoutMode] = useState<'arc' | 'grid'>('arc');

  return (
    <ShopContainer id="shop">
      <div className="header-group rv">
        <div className="header-row">
          <h2 className="d" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', margin: 0 }}>
            Shop <span className="o">all</span>
          </h2>

          <LayoutSwitcher>
            <button
              type="button"
              className={layoutMode === 'arc' ? 'active' : ''}
              onClick={() => setLayoutMode('arc')}
              title="Interactive Curved Arc Carousel"
            >
              Arc Carousel
            </button>
            <button
              type="button"
              className={layoutMode === 'grid' ? 'active' : ''}
              onClick={() => setLayoutMode('grid')}
              title="Standard Flat Grid View"
            >
              Grid View
            </button>
          </LayoutSwitcher>
        </div>
      </div>

      {layoutMode === 'arc' ? (
        <ArcCarousel
          products={products}
          onAddToCart={onAddToCart}
          onOpenLookbook={onOpenLookbook}
          onOpenSizeGuide={onOpenSizeGuide}
          onOpenWaitlist={onOpenWaitlist}
        />
      ) : (
        <FlatGrid className="grid rv" id="grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenLookbook={onOpenLookbook}
              onOpenSizeGuide={onOpenSizeGuide}
              onOpenWaitlist={onOpenWaitlist}
            />
          ))}
        </FlatGrid>
      )}
    </ShopContainer>
  );
};
