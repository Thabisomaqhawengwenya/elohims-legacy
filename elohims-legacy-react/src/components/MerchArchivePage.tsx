import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ProductCard } from './ProductCard';
import { Product, StorePromotion } from '../data/content';

interface MerchArchivePageProps {
  products: Product[];
  promotion: StorePromotion;
  onAddToCart: (name: string, price: number, size: string) => void;
  onOpenLookbook?: (view: 'front' | 'back', product?: Product) => void;
  onOpenSizeGuide?: () => void;
  onOpenWaitlist?: (productName: string) => void;
  onBackToStore: () => void;
  onCartClick: () => void;
  cartCount: number;
  isLight: boolean;
  onToggleTheme: () => void;
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 20;
  overflow-x: hidden;
`;

const TopNavBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 6vw;
  background: var(--nav-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-light);

  .left-group {
    display: flex;
    align-items: center;
    gap: 16px;

    button.back-btn {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      color: var(--text-primary);
      padding: 8px 16px;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: var(--text-primary);
        color: var(--bg);
        border-color: var(--text-primary);
        transform: translateX(-3px);
      }
    }

    b.brand {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.15rem;
      letter-spacing: 0.12em;
      color: var(--text-primary);

      @media (max-width: 680px) {
        display: none;
      }
    }
  }

  .right-group {
    display: flex;
    align-items: center;
    gap: 12px;

    button.theme-btn {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      color: var(--text-primary);
      padding: 7px 14px;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--text-primary);
      }
    }

    button.cart-btn {
      background: var(--text-primary);
      color: var(--bg);
      border: none;
      padding: 8px 18px;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);

      &:hover {
        opacity: 0.9;
        transform: scale(1.04);
      }
    }
  }
`;

const ContentContainer = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 40px 6vw 80px;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 36px;

  span.eyebrow {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gold);
  }

  h1.page-title {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(2.4rem, 5vw, 4.2rem);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1.1;
    margin: 0;
    color: var(--text-primary);

    span.accent {
      color: var(--gold);
      font-style: italic;
    }
  }

  p.lead-text {
    max-width: 680px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-muted);
    margin: 0;
  }
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: 20px;
  margin-bottom: 36px;

  .filter-pills {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    button.filter-pill {
      background: transparent;
      border: 1px solid var(--border-medium);
      color: var(--text-muted);
      padding: 7px 16px;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: var(--text-primary);
        color: var(--bg);
        border-color: var(--text-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      }

      &:hover:not(.active) {
        color: var(--text-primary);
        border-color: var(--text-primary);
      }
    }
  }

  .meta-status {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 10px;

    span.dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 8px #22c55e;
    }
  }
`;

const CatalogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  width: 100%;

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

const TrustFooterBanner = styled.div`
  margin-top: 60px;
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: 24px;
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 24px 20px;
  }

  .trust-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span.icon-title {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    p.note {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.45;
    }
  }
`;

export const MerchArchivePage: React.FC<MerchArchivePageProps> = ({
  products,
  onAddToCart,
  onOpenLookbook,
  onOpenSizeGuide,
  onOpenWaitlist,
  onBackToStore,
  onCartClick,
  cartCount,
  isLight,
  onToggleTheme,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tees' | 'sweaters' | 'hoodies' | 'instock'>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'instock') return p.status === 'in_stock' || p.status === 'available';
      if (selectedFilter === 'tees') {
        return (
          p.category?.toLowerCase().includes('t-shirt') ||
          p.category?.toLowerCase().includes('tee') ||
          p.name.toLowerCase().includes('tee')
        );
      }
      if (selectedFilter === 'sweaters') {
        return (
          p.category?.toLowerCase().includes('sweater') ||
          p.name.toLowerCase().includes('sweater')
        );
      }
      if (selectedFilter === 'hoodies') {
        return (
          p.category?.toLowerCase().includes('hoodie') ||
          p.name.toLowerCase().includes('hoodie')
        );
      }
      return true;
    });
  }, [products, selectedFilter]);

  return (
    <PageWrapper>
      <TopNavBar>
        <div className="left-group">
          <button
            type="button"
            className="back-btn"
            onClick={onBackToStore}
            title="Return to Interactive Storefront"
          >
            ← Return to Store
          </button>
          <b className="brand">ELOHIM'S LEGACY</b>
        </div>

        <div className="right-group">
          <button
            type="button"
            className="theme-btn"
            onClick={onToggleTheme}
            title={isLight ? 'Switch to Dark' : 'Switch to Light'}
          >
            {isLight ? 'Dark' : 'Light'}
          </button>
          <button
            type="button"
            className="cart-btn"
            onClick={onCartClick}
            title="Open Shopping Cart"
          >
            Cart ({cartCount})
          </button>
        </div>
      </TopNavBar>

      <ContentContainer>
        <HeaderSection>
          <span className="eyebrow">The Official Collection Archive · Zimbabwe</span>
          <h1 className="page-title">
            All <span className="accent">Merchandise</span>
          </h1>
          <p className="lead-text">
            Faith you can wear. Heavyweight 280–420 GSM streetwear forged in purpose, printed with divine scripture, and tailored for effortless drape.
          </p>
        </HeaderSection>

        <ControlsBar>
          <div className="filter-pills">
            <button
              type="button"
              className={`filter-pill ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All Pieces ({products.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedFilter === 'tees' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('tees')}
            >
              Heavyweight Tees (2)
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedFilter === 'sweaters' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('sweaters')}
            >
              Sweaters (1)
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedFilter === 'hoodies' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('hoodies')}
            >
              Hoodies (1)
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedFilter === 'instock' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('instock')}
            >
              In Stock Only
            </button>
          </div>

          <div className="meta-status">
            <span className="dot" />
            <span>Showing {filteredProducts.length} of {products.length} garments</span>
          </div>
        </ControlsBar>

        <CatalogGrid>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenLookbook={onOpenLookbook}
              onOpenSizeGuide={onOpenSizeGuide}
              onOpenWaitlist={onOpenWaitlist}
            />
          ))}
        </CatalogGrid>

        <TrustFooterBanner>
          <div className="trust-item">
            <span className="icon-title">⚡ Harare Same-Day Dispatch</span>
            <p className="note">
              Orders placed before 2 PM dispatched within hours. Swift Courier Connect across all 10 provinces in Zimbabwe.
            </p>
          </div>
          <div className="trust-item">
            <span className="icon-title">💳 Local Payment Methods</span>
            <p className="note">
              EcoCash, InnBucks, USD Cash on Delivery, and direct WhatsApp checkout support.
            </p>
          </div>
          <div className="trust-item">
            <span className="icon-title">📐 Premium Heavyweight Milled</span>
            <p className="note">
              Custom 280 GSM cotton and 380–420 GSM French terry fabrics crafted for lifetime wear.
            </p>
          </div>
        </TrustFooterBanner>
      </ContentContainer>
    </PageWrapper>
  );
};
