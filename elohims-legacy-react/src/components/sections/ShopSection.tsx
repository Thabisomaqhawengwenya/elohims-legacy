import React from 'react';
import styled from 'styled-components';
import { ProductCard } from '../ProductCard';
import { Product } from '../../data/content';

interface ShopSectionProps {
  products: Product[];
  onAddToCart: (name: string, price: number, size: string) => void;
  onOpenLookbook?: (view: 'front' | 'back', product?: Product) => void;
  onOpenSizeGuide?: () => void;
  onOpenWaitlist?: (productName: string) => void;
}

const ShopContainer = styled.section`
  padding: 12vh 6vw 10vh 6vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .header-group {
    width: 100%;
    max-width: 1280px;
    margin-bottom: 24px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 26px;
  width: 100%;
  max-width: 1280px;
  margin-top: 20px;

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
  return (
    <ShopContainer id="shop">
      <div className="header-group rv">
        <h2 className="d" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}>
          Shop <span className="o">all</span>
        </h2>
      </div>

      <Grid className="grid rv" id="grid">
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
      </Grid>
    </ShopContainer>
  );
};
