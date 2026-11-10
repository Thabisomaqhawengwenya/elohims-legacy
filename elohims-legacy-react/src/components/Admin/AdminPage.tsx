import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Product, ProductStatus, StorePromotion, StoreSettings } from '../../data/content';
import frontImgUrl from '../../assets/front.webp';

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
  padding: 30px 6vw 80px;
  position: relative;
  z-index: 10;
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-medium);
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;

  .brand-group {
    display: flex;
    align-items: baseline;
    gap: 12px;

    h1 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.5rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin: 0;
      color: var(--text-primary);
    }

    span.portal-tag {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--gold);
      padding: 3px 10px;
      border-radius: 9999px;
    }
  }

  .actions-group {
    display: flex;
    align-items: center;
    gap: 12px;

    button.back-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--text-primary);
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: var(--btn-primary-bg);
        color: var(--btn-primary-text);
        border-color: var(--btn-primary-bg);
      }
    }

    button.theme-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--text-primary);
      padding: 8px 14px;
      border-radius: 9999px;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--text-primary);
      }
    }
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }

  .metric-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    padding: 18px 20px;
    box-shadow: var(--card-shadow);
    display: flex;
    flex-direction: column;
    gap: 6px;

    span.lbl {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    span.val {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.8rem;
      color: var(--text-primary);
      letter-spacing: 0.02em;

      &.gold {
        color: var(--gold);
      }
    }

    span.hint {
      font-size: 0.72rem;
      color: var(--text-muted);
    }
  }
`;

const NavigationTabs = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border-medium);
  margin-bottom: 26px;
  overflow-x: auto;
  padding-bottom: 2px;

  button.tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-muted);
    padding: 10px 18px;
    font-size: 0.84rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &.active {
      color: var(--text-primary);
      border-bottom-color: var(--gold);
    }

    &:hover:not(.active) {
      color: var(--text-primary);
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.25rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0;
  }

  button.add-btn {
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border: none;
    padding: 10px 22px;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: var(--btn-shadow);
    transition: all 0.2s ease;

    &:hover {
      background: var(--btn-hover-bg);
      transform: scale(1.02);
    }
  }
`;

const MerchTable = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--card-shadow);

  .table-scroll {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.85rem;

    th {
      background: var(--bg-surface);
      padding: 14px 18px;
      font-size: 0.72rem;
      font-weight: 700;
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

      &.name-cell {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1.05rem;
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

const StatusSwitcher = styled.div`
  display: inline-flex;
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: 9999px;
  padding: 2px;
  gap: 2px;

  button {
    background: transparent;
    border: none;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 5px 11px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease;
    color: var(--text-muted);

    &.in-stock.active {
      background: #22c55e;
      color: #ffffff;
    }

    &.out-of-stock.active {
      background: #ef4444;
      color: #ffffff;
    }

    &.soon.active {
      background: var(--gold);
      color: #0c0d12;
    }
  }
`;

const PromoBox = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  padding: 24px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 720px;

  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .info {
      h4 {
        margin: 0 0 4px;
        font-size: 0.95rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      p {
        margin: 0;
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }

    input[type='checkbox'] {
      width: 22px;
      height: 22px;
      cursor: pointer;
      accent-color: var(--gold);
    }
  }

  .form-group {
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

    input {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-medium);
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 0.88rem;
      color: var(--text-primary);
      outline: none;

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
    padding: 10px 26px;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--btn-hover-bg);
      transform: scale(1.02);
    }
  }
`;

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
  border-radius: 22px;
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
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);

  // Form states for adding merch
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('T-Shirt');
  const [newPrice, setNewPrice] = useState<string>('25');
  const [newOrigPrice, setNewOrigPrice] = useState<string>('');
  const [newStatus, setNewStatus] = useState<ProductStatus>('in_stock');
  const [newSpecs, setNewSpecs] = useState<string>('Oversized Boxy Fit · 280 GSM Cotton');
  const [newPromoBadge, setNewPromoBadge] = useState<string>('');
  const [newSizes, setNewSizes] = useState<string>('S, M, L, XL');

  // Form states for promotion
  const [promoEnabled, setPromoEnabled] = useState<boolean>(promotion.enabled);
  const [promoBanner, setPromoBanner] = useState<string>(promotion.bannerText);
  const [promoCode, setPromoCode] = useState<string>(promotion.code || '');

  // Settings
  const [whatsAppNum, setWhatsAppNum] = useState<string>(settings.whatsAppNumber);
  const [supportEmail, setSupportEmail] = useState<string>(settings.email);

  // Load waitlist
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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const parsedPrice = parseFloat(newPrice);
    const parsedOrigPrice = newOrigPrice ? parseFloat(newOrigPrice) : null;
    const sizesArray = newSizes.split(',').map((s) => s.trim()).filter(Boolean);

    onAddProduct({
      name: newName.trim(),
      category: newCategory,
      price: isNaN(parsedPrice) ? null : parsedPrice,
      originalPrice: parsedOrigPrice && !isNaN(parsedOrigPrice) ? parsedOrigPrice : null,
      status: newStatus,
      sizes: sizesArray.length ? sizesArray : ['S', 'M', 'L', 'XL'],
      specs: newSpecs.trim(),
      promoBadge: newPromoBadge.trim() || undefined,
      meta: `${sizesArray[0] || 'S'} – ${sizesArray[sizesArray.length - 1] || 'XL'}`,
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewName('');
    setNewPrice('25');
    setNewOrigPrice('');
    setNewPromoBadge('');
  };

  const handleSavePromo = () => {
    onUpdatePromotion({
      enabled: promoEnabled,
      bannerText: promoBanner.trim(),
      code: promoCode.trim() || undefined,
    });
    alert('Sitewide promotion settings saved successfully.');
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      whatsAppNumber: whatsAppNum.trim(),
      email: supportEmail.trim(),
    });
    alert('Studio dispatch and contact settings saved.');
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

  // Metrics
  const inStockCount = products.filter(
    (p) => p.status === 'in_stock' || p.status === 'available'
  ).length;
  const outOfStockCount = products.filter((p) => p.status === 'out_of_stock').length;
  const nextDropCount = products.filter((p) => p.status === 'soon').length;

  return (
    <PageWrapper>
      <TopBar>
        <div className="brand-group">
          <h1>Elohim's Legacy</h1>
          <span className="portal-tag">Studio Command</span>
        </div>
        <div className="actions-group">
          <button
            type="button"
            className="theme-btn"
            onClick={onToggleTheme}
            title="Toggle theme"
          >
            {isLight ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button
            type="button"
            className="back-btn"
            onClick={onBackToStore}
          >
            ← Back to Storefront
          </button>
        </div>
      </TopBar>

      <MetricsGrid>
        <div className="metric-card">
          <span className="lbl">Total Catalog</span>
          <span className="val">{products.length}</span>
          <span className="hint">Pieces managed</span>
        </div>
        <div className="metric-card">
          <span className="lbl">In Stock Active</span>
          <span className="val gold">{inStockCount}</span>
          <span className="hint">Available for immediate purchase</span>
        </div>
        <div className="metric-card">
          <span className="lbl">Out / Next Drop</span>
          <span className="val">{outOfStockCount + nextDropCount}</span>
          <span className="hint">{outOfStockCount} Out · {nextDropCount} Next Drop</span>
        </div>
        <div className="metric-card">
          <span className="lbl">VIP Drop Waitlist</span>
          <span className="val gold">{waitlistEntries.length}</span>
          <span className="hint">Registered buyers</span>
        </div>
      </MetricsGrid>

      <NavigationTabs>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Merchandise Catalog ({products.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'promo' ? 'active' : ''}`}
          onClick={() => setActiveTab('promo')}
        >
          Promotions & Campaigns
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'waitlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('waitlist')}
        >
          VIP Waitlist Leads ({waitlistEntries.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Dispatch & Settings
        </button>
      </NavigationTabs>

      {activeTab === 'catalog' && (
        <section>
          <SectionHeader>
            <h2>Merchandise Inventory</h2>
            <button
              type="button"
              className="add-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              + Add Merch Piece
            </button>
          </SectionHeader>

          <MerchTable>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Piece</th>
                    <th>Category</th>
                    <th>Stock Status</th>
                    <th>Price (USD)</th>
                    <th>Promo Tag</th>
                    <th>Sizes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => {
                    const currentStatus =
                      item.status === 'available' ? 'in_stock' : item.status;
                    return (
                      <tr key={item.id}>
                        <td className="name-cell">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={frontImgUrl}
                              alt={item.name}
                              style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'contain' }}
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td>{item.category || 'Apparel'}</td>
                        <td>
                          <StatusSwitcher>
                            <button
                              type="button"
                              className={`in-stock ${currentStatus === 'in_stock' ? 'active' : ''}`}
                              onClick={() => onToggleStock(item.id, 'in_stock')}
                              title="Mark In Stock"
                            >
                              In Stock
                            </button>
                            <button
                              type="button"
                              className={`out-of-stock ${currentStatus === 'out_of_stock' ? 'active' : ''}`}
                              onClick={() => onToggleStock(item.id, 'out_of_stock')}
                              title="Mark Out of Stock"
                            >
                              Out of Stock
                            </button>
                            <button
                              type="button"
                              className={`soon ${currentStatus === 'soon' ? 'active' : ''}`}
                              onClick={() => onToggleStock(item.id, 'soon')}
                              title="Mark Coming Soon"
                            >
                              Next Drop
                            </button>
                          </StatusSwitcher>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {item.price !== null ? `$${item.price}` : '—'}
                          </span>
                          {item.originalPrice && (
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '6px', fontSize: '0.8rem' }}>
                              ${item.originalPrice}
                            </span>
                          )}
                        </td>
                        <td>
                          {item.promoBadge ? (
                            <span style={{ background: 'var(--gold)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                              {item.promoBadge}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                        <td>{item.sizes.join(' · ') || 'One Size'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                const p = prompt(`Enter new price in USD for "${item.name}":`, item.price?.toString() || '25');
                                if (p !== null) {
                                  const val = parseFloat(p);
                                  onUpdateProduct(item.id, { price: isNaN(val) ? null : val });
                                }
                              }}
                              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '4px', padding: '3px 8px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.72rem' }}
                            >
                              Edit Price
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove "${item.name}" from catalog?`)) {
                                  onDeleteProduct(item.id);
                                }
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}
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
          </MerchTable>
        </section>
      )}

      {activeTab === 'promo' && (
        <section>
          <SectionHeader>
            <h2>Sitewide Promotions & Announcements</h2>
          </SectionHeader>
          <PromoBox>
            <div className="toggle-row">
              <div className="info">
                <h4>Show Sitewide Announcement Bar</h4>
                <p>When enabled, a top announcement bar appears across all storefront views.</p>
              </div>
              <input
                type="checkbox"
                checked={promoEnabled}
                onChange={(e) => setPromoEnabled(e.target.checked)}
              />
            </div>

            <div className="form-group">
              <label>Announcement Banner Headline</label>
              <input
                type="text"
                value={promoBanner}
                onChange={(e) => setPromoBanner(e.target.value)}
                placeholder="e.g. NATIONWIDE DROP: HARARE SAME-DAY & SWIFT COURIER CONNECT"
              />
            </div>

            <div className="form-group">
              <label>Discount Promo Code (Optional)</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. LEGACY10"
              />
            </div>

            <button type="button" className="save-btn" onClick={handleSavePromo}>
              Save Promotion Changes
            </button>
          </PromoBox>
        </section>
      )}

      {activeTab === 'waitlist' && (
        <section>
          <SectionHeader>
            <h2>VIP Capsule Drop Subscribers ({waitlistEntries.length})</h2>
            <button type="button" className="add-btn" onClick={handleCopyWaitlist}>
              Copy All WhatsApp Numbers
            </button>
          </SectionHeader>

          <MerchTable>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Merch Piece</th>
                    <th>WhatsApp Number</th>
                    <th>Size</th>
                    <th>Email</th>
                    <th>Timestamp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No waitlist registrations yet. When visitors click "VIP Drop Access" on Sweaters and Hoodies, their contact info appears here.
                      </td>
                    </tr>
                  ) : (
                    waitlistEntries.map((entry, idx) => (
                      <tr key={idx}>
                        <td className="name-cell">{entry.product}</td>
                        <td style={{ fontWeight: 600 }}>{entry.whatsapp}</td>
                        <td>{entry.size}</td>
                        <td>{entry.email || '—'}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </td>
                        <td>
                          <a
                            href={`https://wa.me/${entry.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi from Elohim's Legacy! Your VIP drop access for ${entry.product} is now unlocked.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#25d366', fontWeight: 700, fontSize: '0.75rem' }}
                          >
                            Chat ↗
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </MerchTable>
        </section>
      )}

      {activeTab === 'settings' && (
        <section>
          <SectionHeader>
            <h2>Store & Dispatch Settings</h2>
          </SectionHeader>
          <PromoBox>
            <div className="form-group">
              <label>WhatsApp Orders Phone Number (Zimbabwe)</label>
              <input
                type="text"
                value={whatsAppNum}
                onChange={(e) => setWhatsAppNum(e.target.value)}
                placeholder="2637XXXXXXXX"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                International format without spaces or '+' (e.g. 263772123456)
              </span>
            </div>

            <div className="form-group">
              <label>Support / Brand Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="hello@elohimslegacy.com"
              />
            </div>

            <button type="button" className="save-btn" onClick={handleSaveSettings}>
              Save Settings
            </button>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset entire store catalog to factory default state? Any custom items will be cleared.')) {
                    onResetToDefaults();
                    alert('Catalog reset to initial launch pieces.');
                  }
                }}
                style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
              >
                Reset Catalog to Factory Defaults
              </button>
            </div>
          </PromoBox>
        </section>
      )}

      {/* Add Merch Modal */}
      <ModalOverlay $isOpen={isAddModalOpen} onClick={() => setIsAddModalOpen(false)}>
        <ModalCard onClick={(e) => e.stopPropagation()}>
          <header>
            <h3>Add New Merchandise Piece</h3>
            <button type="button" className="close" onClick={() => setIsAddModalOpen(false)}>
              ✕
            </button>
          </header>
          <form onSubmit={handleAddSubmit}>
            <div className="field">
              <label>Piece Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kingdom Oversized Heavyweight Tee"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="field">
                <label>Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
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
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as ProductStatus)}>
                  <option value="in_stock">In Stock (Available)</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="soon">Coming Soon / Next Drop</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Price in USD ($)</label>
                <input
                  type="number"
                  placeholder="25"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Original / Compare Price ($ USD, Optional)</label>
                <input
                  type="number"
                  placeholder="30"
                  value={newOrigPrice}
                  onChange={(e) => setNewOrigPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Promo Badge (Optional)</label>
              <input
                type="text"
                placeholder="e.g. DROP 02, 15% OFF, SIGNATURE"
                value={newPromoBadge}
                onChange={(e) => setNewPromoBadge(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Available Sizes (Comma separated)</label>
              <input
                type="text"
                placeholder="S, M, L, XL"
                value={newSizes}
                onChange={(e) => setNewSizes(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Fabric Quality & Specs</label>
              <input
                type="text"
                placeholder="e.g. Oversized Boxy Cut · 280 GSM Cotton"
                value={newSpecs}
                onChange={(e) => setNewSpecs(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-modal">
              Publish Merch Piece to Storefront
            </button>
          </form>
        </ModalCard>
      </ModalOverlay>
    </PageWrapper>
  );
};
