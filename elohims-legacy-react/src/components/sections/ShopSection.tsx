import React from 'react';
import styled from 'styled-components';
import { ProductCard } from '../ProductCard';
import { Product } from '../../data/content';

interface ShopSectionProps {
  products: Product[];
  onAddToCart: (name: string, price: number, size: string) => void;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 5vh;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  onAddToCart,
}) => {
  return (
    <section id="shop">
      <h2 className="d rv" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
        Shop <span className="o">all</span>
      </h2>
      <Grid className="grid rv" id="grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </Grid>
    </section>
  );
};
