import React from 'react';
import styled from 'styled-components';
import { ProductCard } from '../ProductCard';
import { Product } from '../../data/content';

interface ShopSectionProps {
  products: Product[];
  onAddToCart: (name: string, price: number, size: string) => void;
}

const ShopContainer = styled.section`
  padding: 12vh 6vw 10vh 6vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .header-group {
    width: 100%;
    max-width: 1240px;
    margin-bottom: 24px;
  }

  .eyebrow {
    font-family: ${({ theme }) => theme.fonts.display};
    letter-spacing: 0.18em;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.gold};
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 8px;
  }

  p.section-sub {
    font-size: 1rem;
    color: #cbd5e1;
    max-width: 50ch;
    margin-top: 14px;
    line-height: 1.6;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
  width: 100%;
  max-width: 1240px;
  margin-top: 20px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  onAddToCart,
}) => {
  return (
    <ShopContainer id="shop">
      <div className="header-group rv">
        <span className="eyebrow">Merchandise & Drops</span>
        <h2 className="d" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}>
          Shop <span className="o">all</span>
        </h2>
        <p className="section-sub">
          Faith you can wear. Heavyweight cotton, oversized boxy silhouette,
          forged in purpose and worn in legacy.
        </p>
      </div>

      <Grid className="grid rv" id="grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </Grid>
    </ShopContainer>
  );
};
