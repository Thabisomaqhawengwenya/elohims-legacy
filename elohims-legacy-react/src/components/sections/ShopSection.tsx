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
  onNavigateToMerch?: () => void;
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

      .actions-cluster {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
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

const ViewAllMerchButton = styled.button`
  background: #d79872;
  color: #ffffff;
  border: none;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 18px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(215, 152, 114, 0.35);

  &:hover {
    background: #c88962;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(215, 152, 114, 0.45);
  }

  &:active {
    transform: scale(0.96);
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

const ArchiveCallout = styled.div`
  width: 100%;
  max-width: 860px;
  margin-top: 40px;
  background: rgba(15, 17, 23, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  .lead {
    font-size: 0.88rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  button.explore-btn {
    background: var(--bg-surface);
    border: 1.5px solid var(--border-medium);
    color: var(--text-primary);
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 8px 18px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #d79872;
      color: #ffffff;
      border-color: #d79872;
      transform: translateY(-2px);
    }
  }
`;

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  onAddToCart,
  onOpenLookbook,
  onOpenSizeGuide,
  onOpenWaitlist,
  onNavigateToMerch,
}) => {
  const [layoutMode, setLayoutMode] = useState<'arc' | 'grid'>('arc');

  return (
    <ShopContainer id="shop">
      <div className="header-group rv">
        <div className="header-row">
          <h2 className="d" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', margin: 0 }}>
            Shop <span className="o">all</span>
          </h2>

          <div className="actions-cluster">
            {onNavigateToMerch && (
              <ViewAllMerchButton
                type="button"
                onClick={onNavigateToMerch}
                title="View All Merch on Dedicated Page"
              >
                All Merch ({products.length}) →
              </ViewAllMerchButton>
            )}

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

      {onNavigateToMerch && (
        <ArchiveCallout>
          <span className="lead">Want to explore all upcoming drops & colorways in one place?</span>
          <button
            type="button"
            className="explore-btn"
            onClick={onNavigateToMerch}
          >
            Explore Full Merch Archive ({products.length} Items) ↗
          </button>
        </ArchiveCallout>
      )}
    </ShopContainer>
  );
};
