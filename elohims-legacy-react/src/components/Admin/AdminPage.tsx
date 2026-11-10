import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Product, ProductStatus, StorePromotion, StoreSettings } from '../../data/content';
import frontImgUrl from '../../assets/front.webp';
import backImgUrl from '../../assets/back.webp';

interface AdminPageProps {
  products: Product[];
  promotion: StorePromotion;
  settings: StoreSettings;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onToggleStock: (id: string, status?: ProductStatus) => void;
  onUpdatePromotion: (updates: Partial<StorePromotion>) => void;
  onUpdateSettings: (updates: Partial<StoreSettings>) => void;
  onResetToDefaults: () => void;
  onBackToStore: () => void;
  isLight: boolean;
  onToggleTheme: () => void;
}

interface WaitlistEntry {
  product: string;
  whatsapp: string;
  email?: string;
  size: string;
  timestamp: string;
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg);
  color: var(--text-primary);
  font-family: ${({ theme }) => theme.fonts.body};
  padding: 24px 5vw 80px;
  position: relative;
  z-index: 10;
  transition: background 0.3s ease, color 0.3s ease;
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--border-medium);
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;

  .brand-group {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;

    .brand-title {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.45rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin: 0;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 10px;

      .brand-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--gold);
        box-shadow: 0 0 10px var(--gold);
      }
    }

    .portal-chip {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--gold);
      padding: 4px 12px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  }

  .actions-group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    button.nav-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--text-primary);
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: var(--btn-primary-bg);
        color: var(--btn-primary-text);
        border-color: var(--btn-primary-bg);
        transform: translateY(-1px);
      }

      &.primary {
        background: var(--btn-primary-bg);
        color: var(--btn-primary-text);
        border-color: var(--btn-primary-bg);
        box-shadow: var(--btn-shadow);

        &:hover {
          background: var(--btn-hover-bg);
        }
      }
    }

    button.icon-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--text-primary);
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--gold);
        transform: scale(1.05);
      }
    }
  }
`;

/* Pinterest-Inspired Bento Grid Hero */
const BentoHeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 18px;
  margin-bottom: 32px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const BentoCard = styled.div<{ $gradient?: boolean }>`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 22px;
  padding: 22px 24px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: var(--border-medium);
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;

    .label-group {
      display: flex;
      flex-direction: column;
      gap: 3px;

      span.eyebrow {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 0.68rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-muted);
      }

      h3 {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1.15rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin: 0;
        color: var(--text-primary);
      }
    }

    span.badge-pill {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 9999px;
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--gold);
    }
  }

  .stat-highlight {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin: 8px 0 12px;

    span.number {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 2.4rem;
      line-height: 1;
      color: var(--text-primary);
      letter-spacing: -0.02em;

      &.gold {
        color: var(--gold);
      }
    }

    span.sub {
      font-size: 0.82rem;
      color: var(--text-muted);
    }
  }

  /* Telemetry Progress Bar */
  .progress-track {
    width: 100%;
    height: 8px;
    background: var(--bg-surface);
    border-radius: 9999px;
    overflow: hidden;
    display: flex;
    margin: 12px 0 10px;
    border: 1px solid var(--border-light);

    .bar-in-stock {
      height: 100%;
      background: #22c55e;
      transition: width 0.3s ease;
    }

    .bar-out-stock {
      height: 100%;
      background: #ef4444;
      transition: width 0.3s ease;
    }

    .bar-soon {
      height: 100%;
      background: var(--gold);
      transition: width 0.3s ease;
    }
  }

  .breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.72rem;
    color: var(--text-muted);
    flex-wrap: wrap;
    gap: 8px;

    .dot-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;

      span.dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;

        &.green {
          background: #22c55e;
        }
        &.red {
          background: #ef4444;
        }
        &.gold {
          background: var(--gold);
        }
      }
    }
  }

  /* Live Promo HUD */
  .promo-live-box {
    background: var(--bg-surface);
    border: 1px dashed var(--border-medium);
    border-radius: 12px;
    padding: 10px 14px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .promo-status-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7rem;

      span.tag {
        color: var(--gold);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      span.active-indicator {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #22c55e;
        font-weight: 700;

        &::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
        }
      }
    }

    p.banner-snippet {
      margin: 0;
      font-size: 0.75rem;
      font-family: ${({ theme }) => theme.fonts.display};
      letter-spacing: 0.04em;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* Waitlist Pulse */
  .waitlist-ticker {
    background: var(--bg-surface);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 10px 12px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .ticker-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .ticker-content {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-primary);
      display: flex;
      justify-content: space-between;
      align-items: center;

      span.time {
        font-size: 0.68rem;
        color: var(--text-muted);
      }
    }
  }
`;

/* Tab Navigation Bar */
const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-medium);
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;

  .tabs-group {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 2px;

    button.tab-btn {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      padding: 10px 16px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 6px;

      span.tab-count {
        font-size: 0.68rem;
        padding: 1px 6px;
        border-radius: 9999px;
        background: var(--bg-surface);
        border: 1px solid var(--border-light);
      }

      &.active {
        color: var(--text-primary);
        border-bottom-color: var(--gold);

        span.tab-count {
          background: var(--gold);
          color: #0c0d12;
          border-color: var(--gold);
          font-weight: 800;
        }
      }

      &:hover:not(.active) {
        color: var(--text-primary);
      }
    }
  }

  .view-controls {
    display: flex;
    align-items: center;
    gap: 8px;

    .view-pill {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      border-radius: 9999px;
      padding: 2px;
      display: inline-flex;
      gap: 2px;

      button {
        background: transparent;
        border: none;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.15s ease;

        &.active {
          background: var(--btn-primary-bg);
          color: var(--btn-primary-text);
        }
      }
    }
  }
`;

/* Merch Filters Ribbon */
const FiltersRibbon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 14px;

  .category-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    button.chip {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--text-primary);
        color: var(--text-primary);
      }

      &.active {
        background: var(--text-primary);
        color: var(--bg);
        border-color: var(--text-primary);
      }
    }
  }

  .search-and-status {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    .search-box {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      border-radius: 9999px;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 8px;

      input {
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-primary);
        font-size: 0.78rem;
        width: 160px;

        &::placeholder {
          color: var(--text-muted);
        }
      }
    }

    select.status-filter {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      border-radius: 9999px;
      padding: 6px 12px;
      color: var(--text-primary);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      outline: none;
      cursor: pointer;
    }
  }
`;

/* Pinterest-Inspired Visual Streetwear Grid */
const VisualCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 22px;
  margin-bottom: 30px;
`;

const MerchStudioCard = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 22px;
  padding: 16px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-medium);
  }

  /* Ash Grey Stage for Garment */
  .card-stage {
    width: 100%;
    aspect-ratio: 1.1;
    background: ${({ theme }) => theme.colors.swatchStageBg};
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 14px;
    border: 1px solid rgba(255, 255, 255, 0.04);

    img.garment-thumb {
      max-width: 82%;
      max-height: 82%;
      object-fit: contain;
      filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
      transition: transform 0.3s ease;
    }

    &:hover img.garment-thumb {
      transform: scale(1.04);
    }

    .placeholder-art {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--text-muted);

      svg {
        opacity: 0.5;
      }

      span.drop-label {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 0.72rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--gold);
      }
    }

    .top-floating-badges {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      z-index: 2;

      span.promo-badge {
        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        background: var(--gold);
        color: #0c0d12;
        padding: 2px 8px;
        border-radius: 9999px;
      }

      span.category-badge {
        font-size: 0.62rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        backdrop-filter: blur(6px);
        padding: 2px 8px;
        border-radius: 9999px;
      }
    }

    .view-switch-pills {
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: inline-flex;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      padding: 2px;
      gap: 2px;
      z-index: 2;

      button {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.62rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 2px 8px;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.15s ease;

        &.active {
          background: #ffffff;
          color: #000000;
        }
      }
    }
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;

    .title-price-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;

      h4.piece-title {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1.12rem;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        margin: 0;
        color: var(--text-primary);
        line-height: 1.2;
      }

      .price-cluster {
        display: flex;
        align-items: baseline;
        gap: 6px;

        span.current-price {
          font-family: ${({ theme }) => theme.fonts.display};
          font-size: 1.15rem;
          color: var(--gold);
          font-weight: 700;
        }

        span.orig-price {
          font-size: 0.78rem;
          text-decoration: line-through;
          color: var(--text-muted);
        }
      }
    }

    p.specs-copy {
      margin: 0;
      font-size: 0.74rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .sizes-line {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 4px 0 8px;
      flex-wrap: wrap;

      span.size-tag {
        font-size: 0.68rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 6px;
        background: var(--bg-surface);
        border: 1px solid var(--border-light);
        color: var(--text-muted);
      }
    }

    /* 3-State Tactile Segmented Switcher */
    .status-segment-bar {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      border-radius: 9999px;
      padding: 3px;
      gap: 3px;
      margin-top: auto;

      button {
        background: transparent;
        border: none;
        font-size: 0.66rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 6px 4px;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.15s ease;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;

        &.active.in-stock {
          background: #22c55e;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.35);
        }

        &.active.out-of-stock {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
        }

        &.active.soon {
          background: var(--gold);
          color: #0c0d12;
          box-shadow: 0 2px 8px rgba(217, 200, 169, 0.35);
        }
      }
    }

    .card-footer-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      margin-top: 8px;
      border-top: 1px solid var(--border-light);

      button.text-action {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        cursor: pointer;
        padding: 4px;
        transition: color 0.15s ease;

        &:hover {
          color: var(--text-primary);
        }

        &.danger {
          color: #ef4444;
          &:hover {
            color: #dc2626;
          }
        }
      }
    }
  }
`;

/* Table Data View (Alternative view mode) */
const TableContainer = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  margin-bottom: 30px;

  .table-scroll {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.84rem;

    th {
      background: var(--bg-surface);
      padding: 14px 18px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.7rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-medium);
      white-space: nowrap;
    }

    td {
      padding: 16px 18px;
      border-bottom: 1px solid var(--border-light);
      vertical-align: middle;
      color: var(--text-primary);

      &.piece-cell {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 0.98rem;
        letter-spacing: 0.04em;
      }
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: rgba(128, 128, 128, 0.04);
    }
  }
`;

/* Studio Campaign & Promo Settings Box */
const StudioSettingsCard = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 22px;
  padding: 28px;
  box-shadow: var(--card-shadow);
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 22px;

  .section-intro {
    h3 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.25rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin: 0 0 6px;
    }
    p {
      margin: 0;
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
  }

  .toggle-banner-switch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-surface);
    border: 1px solid var(--border-medium);
    border-radius: 14px;
    padding: 16px 18px;

    .info-wrap {
      display: flex;
      flex-direction: column;
      gap: 3px;

      span.title {
        font-weight: 700;
        font-size: 0.86rem;
      }
      span.desc {
        font-size: 0.74rem;
        color: var(--text-muted);
      }
    }

    input[type='checkbox'] {
      width: 24px;
      height: 24px;
      cursor: pointer;
      accent-color: var(--gold);
    }
  }

  /* Interactive Banner Preview */
  .live-preview-section {
    display: flex;
    flex-direction: column;
    gap: 8px;

    span.preview-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    .banner-mockup {
      background: #000000;
      color: var(--gold);
      border: 1px solid var(--border-medium);
      border-radius: 12px;
      padding: 12px 18px;
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.76rem;
      letter-spacing: 0.08em;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;

      span.code-pill {
        background: var(--gold);
        color: #000000;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 4px;
      }
    }
  }

  .input-block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    input,
    textarea {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 0.88rem;
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: var(--gold);
      }
    }
  }

  button.save-btn {
    align-self: flex-start;
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border: none;
    padding: 11px 28px;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: var(--btn-shadow);
    transition: all 0.2s;

    &:hover {
      background: var(--btn-hover-bg);
      transform: scale(1.02);
    }
  }
`;

/* Add / Edit Merch Modal */
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 580px;
  background: var(--card-bg);
  border: 1px solid var(--border-medium);
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  color: var(--text-primary);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-light);

    h3 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.2rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin: 0;
    }

    button.close {
      background: transparent;
      border: 1px solid var(--border-medium);
      color: var(--text-muted);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--text-primary);
        border-color: var(--text-primary);
      }
    }
  }

  form {
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .preset-chips-row {
      display: flex;
      flex-direction: column;
      gap: 6px;

      span.chip-label {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
        letter-spacing: 0.06em;
      }

      .chips {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;

        button.preset-btn {
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          color: var(--text-muted);
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;

          &:hover {
            border-color: var(--gold);
            color: var(--text-primary);
          }
        }
      }
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;

      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--text-muted);
      }

      input,
      select,
      textarea {
        background: var(--bg-surface);
        border: 1.5px solid var(--border-medium);
        border-radius: 10px;
        padding: 10px 12px;
        color: var(--text-primary);
        font-size: 0.86rem;
        outline: none;

        &:focus {
          border-color: var(--gold);
        }
      }
    }

    button.submit-modal {
      margin-top: 10px;
      height: 46px;
      border-radius: 9999px;
      border: none;
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
      font-weight: 700;
      font-size: 0.88rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: var(--btn-shadow);
      transition: all 0.2s;

      &:hover {
        background: var(--btn-hover-bg);
        transform: scale(1.02);
      }
    }
  }
`;

const MerchStudioCardItem: React.FC<{
  item: Product;
  onToggleStock: (id: string, status?: ProductStatus) => void;
  onEdit: (item: Product) => void;
  onDelete: (id: string) => void;
}> = ({ item, onToggleStock, onEdit, onDelete }) => {
  const [teeView, setTeeView] = useState<'front' | 'back'>('front');
  const currentStatus = item.status === 'available' ? 'in_stock' : item.status;
  const isTee =
    item.category?.toLowerCase().includes('t-shirt') ||
    item.category?.toLowerCase().includes('tee') ||
    item.name.toLowerCase().includes('tee');

  return (
    <MerchStudioCard>
      {/* Ash Grey Garment Stage */}
      <div className="card-stage">
        <div className="top-floating-badges">
          {item.promoBadge && <span className="promo-badge">{item.promoBadge}</span>}
          <span className="category-badge">{item.category || 'Apparel'}</span>
        </div>

        {isTee ? (
          <>
            <img
              src={teeView === 'front' ? frontImgUrl : backImgUrl}
              alt={`${item.name} (${teeView})`}
              className="garment-thumb"
            />
            <div className="view-switch-pills">
              <button
                type="button"
                className={teeView === 'front' ? 'active' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setTeeView('front');
                }}
              >
                Front
              </button>
              <button
                type="button"
                className={teeView === 'back' ? 'active' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setTeeView('back');
                }}
              >
                Back
              </button>
            </div>
          </>
        ) : (
          <div className="placeholder-art">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
            </svg>
            <span className="drop-label">Capsule Merch</span>
          </div>
        )}
      </div>

      {/* Metadata & Actions */}
      <div className="card-meta">
        <div className="title-price-row">
          <h4 className="piece-title">{item.name}</h4>
          <div className="price-cluster">
            <span className="current-price">
              {item.price !== null ? `$${item.price}` : '—'}
            </span>
            {item.originalPrice && (
              <span className="orig-price">${item.originalPrice}</span>
            )}
          </div>
        </div>

        <p className="specs-copy">{item.specs || 'Premium Luxury Cut · Faith you can wear'}</p>

        <div className="sizes-line">
          {item.sizes.map((sz) => (
            <span key={sz} className="size-tag">{sz}</span>
          ))}
        </div>

        {/* 3-State Tactile Switcher */}
        <div className="status-segment-bar">
          <button
            type="button"
            className={`in-stock ${currentStatus === 'in_stock' ? 'active' : ''}`}
            onClick={() => onToggleStock(item.id, 'in_stock')}
            title="Set In Stock"
          >
            🟢 In Stock
          </button>
          <button
            type="button"
            className={`out-of-stock ${currentStatus === 'out_of_stock' ? 'active' : ''}`}
            onClick={() => onToggleStock(item.id, 'out_of_stock')}
            title="Set Sold Out"
          >
            🔴 Sold Out
          </button>
          <button
            type="button"
            className={`soon ${currentStatus === 'soon' ? 'active' : ''}`}
            onClick={() => onToggleStock(item.id, 'soon')}
            title="Set Next Drop"
          >
            ⏳ Next Drop
          </button>
        </div>

        <div className="card-footer-actions">
          <button
            type="button"
            className="text-action"
            onClick={() => onEdit(item)}
          >
            ✏️ Edit Details
          </button>
          <button
            type="button"
            className="text-action danger"
            onClick={() => {
              if (confirm(`Remove "${item.name}" from storefront?`)) {
                onDelete(item.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </MerchStudioCard>
  );
};

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  promotion,
  settings,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStock,
  onUpdatePromotion,
  onUpdateSettings,
  onResetToDefaults,
  onBackToStore,
  isLight,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'promo' | 'waitlist' | 'settings'>('catalog');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);

  // Add / Edit Form states
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('T-Shirt');
  const [formPrice, setFormPrice] = useState<string>('25');
  const [formOrigPrice, setFormOrigPrice] = useState<string>('');
  const [formStatus, setFormStatus] = useState<ProductStatus>('in_stock');
  const [formSpecs, setFormSpecs] = useState<string>('Oversized Boxy Fit · 280 GSM Cotton');
  const [formPromoBadge, setFormPromoBadge] = useState<string>('');
  const [formSizes, setFormSizes] = useState<string>('S, M, L, XL');

  // Promotion Form
  const [promoEnabled, setPromoEnabled] = useState<boolean>(promotion.enabled);
  const [promoBanner, setPromoBanner] = useState<string>(promotion.bannerText);
  const [promoCode, setPromoCode] = useState<string>(promotion.code || '');

  // Dispatch Settings
  const [whatsAppNum, setWhatsAppNum] = useState<string>(settings.whatsAppNumber);
  const [supportEmail, setSupportEmail] = useState<string>(settings.email);

  // Load waitlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('elohims_drop_waitlist');
      if (saved) {
        setWaitlistEntries(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load waitlist', err);
    }
  }, [activeTab]);

  // Sync promotion props into local form if changed
  useEffect(() => {
    setPromoEnabled(promotion.enabled);
    setPromoBanner(promotion.bannerText);
    setPromoCode(promotion.code || '');
  }, [promotion]);

  // Metrics calculation
  const inStockCount = useMemo(
    () => products.filter((p) => p.status === 'in_stock' || p.status === 'available').length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.status === 'out_of_stock').length,
    [products]
  );
  const nextDropCount = useMemo(
    () => products.filter((p) => p.status === 'soon').length,
    [products]
  );

  const totalCount = products.length || 1;
  const inStockPct = Math.round((inStockCount / totalCount) * 100);
  const outStockPct = Math.round((outOfStockCount / totalCount) * 100);
  const soonPct = 100 - inStockPct - outStockPct;

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Status filter
      const resolvedStatus = p.status === 'available' ? 'in_stock' : p.status;
      if (selectedStatusFilter !== 'all' && resolvedStatus !== selectedStatusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = (p.category || '').toLowerCase().includes(q);
        const matchesSpecs = (p.specs || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesSpecs) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedStatusFilter, searchQuery]);

  // Categories list
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Open modal for new item
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('T-Shirt');
    setFormPrice('25');
    setFormOrigPrice('');
    setFormStatus('in_stock');
    setFormSpecs('Oversized Boxy Fit · 280 GSM Cotton');
    setFormPromoBadge('');
    setFormSizes('S, M, L, XL');
    setIsAddModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (item: Product) => {
    setEditingProduct(item);
    setFormName(item.name);
    setFormCategory(item.category || 'T-Shirt');
    setFormPrice(item.price !== null ? item.price.toString() : '');
    setFormOrigPrice(item.originalPrice ? item.originalPrice.toString() : '');
    setFormStatus(item.status === 'available' ? 'in_stock' : item.status);
    setFormSpecs(item.specs || '');
    setFormPromoBadge(item.promoBadge || '');
    setFormSizes(item.sizes ? item.sizes.join(', ') : 'S, M, L, XL');
    setIsAddModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedPrice = parseFloat(formPrice);
    const parsedOrigPrice = formOrigPrice ? parseFloat(formOrigPrice) : null;
    const sizesArray = formSizes.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, {
        name: formName.trim(),
        category: formCategory,
        price: isNaN(parsedPrice) ? null : parsedPrice,
        originalPrice: parsedOrigPrice && !isNaN(parsedOrigPrice) ? parsedOrigPrice : null,
        status: formStatus,
        sizes: sizesArray.length ? sizesArray : ['S', 'M', 'L', 'XL'],
        specs: formSpecs.trim(),
        promoBadge: formPromoBadge.trim() || undefined,
        meta: `${sizesArray[0] || 'S'} – ${sizesArray[sizesArray.length - 1] || 'XL'}`,
      });
    } else {
      onAddProduct({
        name: formName.trim(),
        category: formCategory,
        price: isNaN(parsedPrice) ? null : parsedPrice,
        originalPrice: parsedOrigPrice && !isNaN(parsedOrigPrice) ? parsedOrigPrice : null,
        status: formStatus,
        sizes: sizesArray.length ? sizesArray : ['S', 'M', 'L', 'XL'],
        specs: formSpecs.trim(),
        promoBadge: formPromoBadge.trim() || undefined,
        meta: `${sizesArray[0] || 'S'} – ${sizesArray[sizesArray.length - 1] || 'XL'}`,
      });
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const handleSavePromo = () => {
    onUpdatePromotion({
      enabled: promoEnabled,
      bannerText: promoBanner.trim(),
      code: promoCode.trim() || undefined,
    });
    alert('Sitewide promotion settings saved and synchronized with storefront.');
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      whatsAppNumber: whatsAppNum.trim(),
      email: supportEmail.trim(),
    });
    alert('Dispatch & WhatsApp order settings updated.');
  };

  const handleCopyWaitlist = () => {
    if (!waitlistEntries.length) {
      alert('Waitlist is currently empty.');
      return;
    }
    const numbers = waitlistEntries.map((e) => e.whatsapp).join(', ');
    navigator.clipboard.writeText(numbers);
    alert(`Copied ${waitlistEntries.length} WhatsApp numbers to clipboard.`);
  };

  return (
    <PageWrapper>
      {/* Top Header */}
      <TopBar>
        <div className="brand-group">
          <h1 className="brand-title">
            <span className="brand-dot" />
            Elohim's Legacy
          </h1>
          <span className="portal-chip">Studio Command</span>
        </div>
        <div className="actions-group">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? '🌙' : '☀️'}
          </button>
          <button
            type="button"
            className="nav-btn primary"
            onClick={handleOpenAddModal}
          >
            + Add Merch
          </button>
          <button
            type="button"
            className="nav-btn"
            onClick={onBackToStore}
          >
            ← Storefront
          </button>
        </div>
      </TopBar>

      {/* Bento Grid Telemetry Hero */}
      <BentoHeroGrid>
        {/* Card 1: Inventory Health (Spans 1.5) */}
        <BentoCard>
          <div>
            <div className="card-head">
              <div className="label-group">
                <span className="eyebrow">Catalog Telemetry</span>
                <h3>Inventory Dynamics</h3>
              </div>
              <span className="badge-pill">Drop 01 Live</span>
            </div>

            <div className="stat-highlight">
              <span className="number">{products.length}</span>
              <span className="sub">Total Merch Pieces Managed</span>
            </div>

            <div className="progress-track" title={`${inStockPct}% In Stock · ${outStockPct}% Out of Stock · ${soonPct}% Next Drop`}>
              <div className="bar-in-stock" style={{ width: `${inStockPct}%` }} />
              <div className="bar-out-stock" style={{ width: `${outStockPct}%` }} />
              <div className="bar-soon" style={{ width: `${soonPct}%` }} />
            </div>
          </div>

          <div className="breakdown-row">
            <div className="dot-item">
              <span className="dot green" />
              <span>{inStockCount} In Stock ({inStockPct}%)</span>
            </div>
            <div className="dot-item">
              <span className="dot red" />
              <span>{outOfStockCount} Sold Out ({outStockPct}%)</span>
            </div>
            <div className="dot-item">
              <span className="dot gold" />
              <span>{nextDropCount} Coming Soon ({soonPct}%)</span>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Drop Campaign HUD */}
        <BentoCard>
          <div>
            <div className="card-head">
              <div className="label-group">
                <span className="eyebrow">Drop Campaign</span>
                <h3>Promo Announcement</h3>
              </div>
              <span className="badge-pill">{promotion.enabled ? 'ACTIVE' : 'MUTED'}</span>
            </div>

            <div className="stat-highlight">
              <span className="number gold">{promotion.code || 'NO CODE'}</span>
              <span className="sub">Active Voucher</span>
            </div>

            <div className="promo-live-box">
              <div className="promo-status-line">
                <span className="tag">Live Storefront Pill</span>
                <span className="active-indicator">Broadcasting</span>
              </div>
              <p className="banner-snippet">{promotion.bannerText}</p>
            </div>
          </div>

          <div className="breakdown-row" style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '0.74rem' }}>
              Tap <strong style={{ color: 'var(--gold)' }}>Promotions</strong> tab to edit
            </span>
          </div>
        </BentoCard>

        {/* Card 3: VIP Drop Radar */}
        <BentoCard>
          <div>
            <div className="card-head">
              <div className="label-group">
                <span className="eyebrow">VIP Capsule Access</span>
                <h3>Waitlist Radar</h3>
              </div>
              <span className="badge-pill">Sweaters & Hoodies</span>
            </div>

            <div className="stat-highlight">
              <span className="number gold">{waitlistEntries.length}</span>
              <span className="sub">Registered Leads</span>
            </div>

            <div className="waitlist-ticker">
              <div className="ticker-header">
                <span>Latest Drop Request</span>
                <span>Signal</span>
              </div>
              <div className="ticker-content">
                {waitlistEntries.length > 0 ? (
                  <>
                    <span>{waitlistEntries[waitlistEntries.length - 1].product} ({waitlistEntries[waitlistEntries.length - 1].size})</span>
                    <span className="time">{waitlistEntries[waitlistEntries.length - 1].whatsapp}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    Listening for customer waitlist opt-ins...
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="breakdown-row" style={{ marginTop: '12px' }}>
            <span
              onClick={handleCopyWaitlist}
              style={{ color: 'var(--gold)', cursor: 'pointer', fontWeight: 700, fontSize: '0.74rem' }}
            >
              📋 Copy WhatsApp Leads ({waitlistEntries.length})
            </span>
          </div>
        </BentoCard>
      </BentoHeroGrid>

      {/* Navigation Tabs & View Controls */}
      <NavigationBar>
        <div className="tabs-group">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            Catalog Inventory
            <span className="tab-count">{products.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
            Promotions & Banners
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'waitlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('waitlist')}
          >
            VIP Waitlist Leads
            <span className="tab-count">{waitlistEntries.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Dispatch & Store
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="view-controls">
            <div className="view-pill">
              <button
                type="button"
                className={viewMode === 'cards' ? 'active' : ''}
                onClick={() => setViewMode('cards')}
                title="Studio Visual Cards View"
              >
                Cards
              </button>
              <button
                type="button"
                className={viewMode === 'table' ? 'active' : ''}
                onClick={() => setViewMode('table')}
                title="Compact Table Data View"
              >
                Table
              </button>
            </div>
          </div>
        )}
      </NavigationBar>

      {/* Tab Content: Catalog Inventory */}
      {activeTab === 'catalog' && (
        <section>
          {/* Filters Ribbon */}
          <FiltersRibbon>
            <div className="category-chips">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="search-and-status">
              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search merchandise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="status-filter"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="in_stock">In Stock 🟢</option>
                <option value="out_of_stock">Sold Out 🔴</option>
                <option value="soon">Coming Soon ⏳</option>
              </select>
            </div>
          </FiltersRibbon>

          {/* Cards View (Pinterest Streetwear Studio View) */}
          {viewMode === 'cards' ? (
            <VisualCardsGrid>
              {filteredProducts.map((item) => (
                <MerchStudioCardItem
                  key={item.id}
                  item={item}
                  onToggleStock={onToggleStock}
                  onEdit={handleOpenEditModal}
                  onDelete={onDeleteProduct}
                />
              ))}
            </VisualCardsGrid>
          ) : (
            /* Compact Table View */
            <TableContainer>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Merch Piece</th>
                      <th>Category</th>
                      <th>Stock Status</th>
                      <th>Price (USD)</th>
                      <th>Promo Tag</th>
                      <th>Sizes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((item) => {
                      const currentStatus =
                        item.status === 'available' ? 'in_stock' : item.status;
                      return (
                        <tr key={item.id}>
                          <td className="piece-cell">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={frontImgUrl}
                                alt={item.name}
                                style={{ width: '34px', height: '34px', borderRadius: '6px', objectFit: 'contain' }}
                              />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td>{item.category || 'Apparel'}</td>
                          <td>
                            <div style={{ display: 'inline-flex', gap: '4px' }}>
                              <button
                                type="button"
                                onClick={() => onToggleStock(item.id, 'in_stock')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '9999px',
                                  border: 'none',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  background: currentStatus === 'in_stock' ? '#22c55e' : 'var(--bg-surface)',
                                  color: currentStatus === 'in_stock' ? '#ffffff' : 'var(--text-muted)',
                                }}
                              >
                                In Stock
                              </button>
                              <button
                                type="button"
                                onClick={() => onToggleStock(item.id, 'out_of_stock')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '9999px',
                                  border: 'none',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  background: currentStatus === 'out_of_stock' ? '#ef4444' : 'var(--bg-surface)',
                                  color: currentStatus === 'out_of_stock' ? '#ffffff' : 'var(--text-muted)',
                                }}
                              >
                                Sold Out
                              </button>
                              <button
                                type="button"
                                onClick={() => onToggleStock(item.id, 'soon')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '9999px',
                                  border: 'none',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  background: currentStatus === 'soon' ? 'var(--gold)' : 'var(--bg-surface)',
                                  color: currentStatus === 'soon' ? '#0c0d12' : 'var(--text-muted)',
                                }}
                              >
                                Soon
                              </button>
                            </div>
                          </td>
                          <td>
                            <strong style={{ fontFamily: 'monospace' }}>
                              {item.price !== null ? `$${item.price}` : '—'}
                            </strong>
                            {item.originalPrice && (
                              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '6px', fontSize: '0.8rem' }}>
                                ${item.originalPrice}
                              </span>
                            )}
                          </td>
                          <td>
                            {item.promoBadge ? (
                              <span style={{ background: 'var(--gold)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                                {item.promoBadge}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                          <td>{item.sizes.join(' · ') || 'One Size'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '4px 10px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.74rem' }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove "${item.name}"?`)) {
                                    onDeleteProduct(item.id);
                                  }
                                }}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 600 }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TableContainer>
          )}
        </section>
      )}

      {/* Tab Content: Promotions & Campaigns */}
      {activeTab === 'promo' && (
        <section>
          <StudioSettingsCard>
            <div className="section-intro">
              <h3>Drop Promotion & Announcement HUD</h3>
              <p>Configure the sitewide announcement bar broadcasting across all storefront views and cart drawer checkout.</p>
            </div>

            <div className="toggle-banner-switch">
              <div className="info-wrap">
                <span className="title">Sitewide Announcement Bar</span>
                <span className="desc">Toggles the top promotional ribbon across the header</span>
              </div>
              <input
                type="checkbox"
                checked={promoEnabled}
                onChange={(e) => setPromoEnabled(e.target.checked)}
              />
            </div>

            <div className="live-preview-section">
              <span className="preview-label">Live Storefront Preview</span>
              <div className="banner-mockup">
                <span>{promoBanner || 'NATIONWIDE DROP: HARARE SAME-DAY & SWIFT COURIER CONNECT'}</span>
                {promoCode && <span className="code-pill">CODE: {promoCode}</span>}
              </div>
            </div>

            <div className="input-block">
              <label>Announcement Headline Text</label>
              <input
                type="text"
                value={promoBanner}
                onChange={(e) => setPromoBanner(e.target.value)}
                placeholder="e.g. NATIONWIDE DROP: HARARE SAME-DAY & SWIFT COURIER CONNECT"
              />
            </div>

            <div className="input-block">
              <label>Discount Promo Voucher Code (Optional)</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. LEGACY10"
              />
            </div>

            <button type="button" className="save-btn" onClick={handleSavePromo}>
              Save Campaign Changes
            </button>
          </StudioSettingsCard>
        </section>
      )}

      {/* Tab Content: VIP Drop Waitlist */}
      {activeTab === 'waitlist' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'inherit', fontSize: '1.25rem', letterSpacing: '0.04em', margin: 0, textTransform: 'uppercase' }}>
                VIP Drop Waitlist Registrations ({waitlistEntries.length})
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Direct prospective buyers registered from Sweaters & Hoodies drop cards.
              </p>
            </div>
            <button
              type="button"
              className="save-btn"
              onClick={handleCopyWaitlist}
              style={{
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                border: 'none',
                padding: '9px 20px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              📋 Copy All WhatsApp Numbers
            </button>
          </div>

          <TableContainer>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Merch Piece</th>
                    <th>WhatsApp Phone</th>
                    <th>Size Request</th>
                    <th>Email Address</th>
                    <th>Registered Date</th>
                    <th>Direct Chat</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No waitlist registrations yet. When buyers click "VIP Drop Access" on upcoming Sweaters and Hoodies, their contact leads appear here.
                      </td>
                    </tr>
                  ) : (
                    waitlistEntries.map((entry, idx) => (
                      <tr key={idx}>
                        <td className="piece-cell">{entry.product}</td>
                        <td style={{ fontWeight: 700, letterSpacing: '0.03em' }}>{entry.whatsapp}</td>
                        <td>
                          <span style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            {entry.size}
                          </span>
                        </td>
                        <td>{entry.email || '—'}</td>
                        <td style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </td>
                        <td>
                          <a
                            href={`https://wa.me/${entry.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi from Elohim's Legacy! Your VIP drop access for ${entry.product} (${entry.size}) is now unlocked.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.76rem', textDecoration: 'none' }}
                          >
                            Open WhatsApp ↗
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TableContainer>
        </section>
      )}

      {/* Tab Content: Dispatch & Settings */}
      {activeTab === 'settings' && (
        <section>
          <StudioSettingsCard>
            <div className="section-intro">
              <h3>Zimbabwe Dispatch & Store Configuration</h3>
              <p>Configure official WhatsApp order routing and brand email for customer inquiries.</p>
            </div>

            <div className="input-block">
              <label>WhatsApp Orders Phone Number (Zimbabwe Format)</label>
              <input
                type="text"
                value={whatsAppNum}
                onChange={(e) => setWhatsAppNum(e.target.value)}
                placeholder="2637XXXXXXXX"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                International format without spaces (e.g. 263772123456)
              </span>
            </div>

            <div className="input-block">
              <label>Official Brand & Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="hello@elohimslegacy.com"
              />
            </div>

            <button type="button" className="save-btn" onClick={handleSaveSettings}>
              Save Store Dispatch Settings
            </button>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset catalog back to initial launch pieces? Custom pieces will be restored to default.')) {
                    onResetToDefaults();
                    alert('Catalog restored to default pieces.');
                  }
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                }}
              >
                Reset Catalog to Factory Defaults
              </button>
            </div>
          </StudioSettingsCard>
        </section>
      )}

      {/* Add / Edit Merchandise Modal */}
      <ModalOverlay $isOpen={isAddModalOpen} onClick={() => setIsAddModalOpen(false)}>
        <ModalCard onClick={(e) => e.stopPropagation()}>
          <header>
            <h3>{editingProduct ? 'Edit Merchandise Piece' : 'Add New Merch Piece'}</h3>
            <button type="button" className="close" onClick={() => setIsAddModalOpen(false)}>
              ✕
            </button>
          </header>
          <form onSubmit={handleModalSubmit}>
            {/* Streetwear presets */}
            <div className="preset-chips-row">
              <span className="chip-label">Quick Streetwear Fabric Presets:</span>
              <div className="chips">
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setFormCategory('T-Shirt');
                    setFormSpecs('Oversized Boxy Cut · 280 GSM Cotton · Drop Shoulder');
                    setFormPrice('25');
                  }}
                >
                  280 GSM Boxy Tee ($25)
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setFormCategory('Sweater');
                    setFormSpecs('380 GSM Heavy Fleece · Pre-Shrunk · Drop Seam');
                    setFormPrice('45');
                  }}
                >
                  380 GSM Sweater ($45)
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setFormCategory('Hoodie');
                    setFormSpecs('420 GSM French Terry · Double-Layered Hood · Kangaroo Pocket');
                    setFormPrice('55');
                  }}
                >
                  420 GSM Hoodie ($55)
                </button>
              </div>
            </div>

            <div className="field">
              <label>Piece Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kingdom Heavyweight Boxy Tee"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="field">
                <label>Category</label>
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                  <option value="T-Shirt">T-Shirt</option>
                  <option value="Sweater">Sweater</option>
                  <option value="Hoodie">Hoodie</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Headwear">Headwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="field">
                <label>Stock Status</label>
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as ProductStatus)}>
                  <option value="in_stock">In Stock 🟢</option>
                  <option value="out_of_stock">Sold Out 🔴</option>
                  <option value="soon">Coming Soon / Next Drop ⏳</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Price in USD ($)</label>
                <input
                  type="number"
                  placeholder="25"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Compare-At Price ($ USD, Optional)</label>
                <input
                  type="number"
                  placeholder="30"
                  value={formOrigPrice}
                  onChange={(e) => setFormOrigPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Promo Badge (Optional)</label>
              <input
                type="text"
                placeholder="e.g. DROP 02, SIGNATURE PIECE, 15% OFF"
                value={formPromoBadge}
                onChange={(e) => setFormPromoBadge(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Available Sizes (Comma separated)</label>
              <input
                type="text"
                placeholder="S, M, L, XL"
                value={formSizes}
                onChange={(e) => setFormSizes(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Fabric Quality & Specs</label>
              <input
                type="text"
                placeholder="e.g. Oversized Boxy Cut · 280 GSM Cotton"
                value={formSpecs}
                onChange={(e) => setFormSpecs(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-modal">
              {editingProduct ? 'Save Piece Updates' : 'Publish Merch Piece to Storefront'}
            </button>
          </form>
        </ModalCard>
      </ModalOverlay>
    </PageWrapper>
  );
};
