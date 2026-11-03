import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CartItem } from '../hooks/useCart';
import frontImgUrl from '../assets/front.webp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onUpdateQuantity: (name: string, size: string, delta: number) => void;
  onRemoveItem: (name: string, size: string) => void;
  onCheckout: (options?: { deliveryCity?: string; paymentMethod?: string }) => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 1000;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  justify-content: flex-end;
  animation: ${fadeIn} 0.25s ease-out;
`;

const DrawerContent = styled.div`
  width: 100%;
  max-width: 440px;
  height: 100%;
  background: var(--card-bg);
  border-left: 1px solid var(--border-medium);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid var(--border-light);

  .title-group {
    display: flex;
    align-items: baseline;
    gap: 10px;

    h3 {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.25rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0;
      color: var(--text-primary);
    }

    span.count {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 0.85rem;
      color: var(--gold);
      font-weight: 600;
    }
  }

  button.close-btn {
    background: transparent;
    border: 1px solid var(--border-medium);
    color: var(--text-muted);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:hover {
      color: var(--text-primary);
      border-color: var(--text-primary);
      transform: rotate(90deg);
    }
  }
`;

const ItemsBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-medium);
    border-radius: 4px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px 20px;

  .empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px dashed var(--border-medium);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--text-muted);
    font-size: 1.2rem;
  }

  h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.1rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 8px;
    color: var(--text-primary);
  }

  p {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
    max-width: 260px;
    margin-bottom: 24px;
  }

  button.browse-btn {
    border: 1px solid var(--border-medium);
    background: transparent;
    color: var(--text-primary);
    padding: 12px 28px;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
      border-color: var(--btn-primary-bg);
      transform: scale(1.02);
    }
  }
`;

const CartItemRow = styled.div`
  display: flex;
  gap: 16px;
  padding: 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--border-medium);
  }

  .item-thumb {
    width: 74px;
    height: 74px;
    border-radius: 10px;
    background: radial-gradient(circle at 50% 50%, #d8dade 0%, #b8bcc3 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 85%;
      height: 85%;
      object-fit: contain;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;

      h5 {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 0.95rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin: 0;
        color: var(--text-primary);
      }

      button.remove-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 2px 4px;
        font-size: 0.75rem;
        transition: color 0.2s;

        &:hover {
          color: #ef4444;
        }
      }
    }

    .size-tag {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 6px;

      span.size-val {
        background: var(--card-bg);
        border: 1px solid var(--border-medium);
        padding: 2px 8px;
        border-radius: 9999px;
        font-weight: 700;
        color: var(--text-primary);
      }
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      .price {
        font-family: ${({ theme }) => theme.fonts.display};
        font-size: 1rem;
        font-weight: 600;
        color: var(--gold);
      }

      .qty-control {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--card-bg);
        border: 1px solid var(--border-medium);
        border-radius: 9999px;
        padding: 2px 8px;

        button {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s;

          &:hover {
            transform: scale(1.2);
          }
        }

        span.qty {
          font-family: ${({ theme }) => theme.fonts.display};
          font-size: 0.8rem;
          min-width: 14px;
          text-align: center;
        }
      }
    }
  }
`;

const TrustSection = styled.div`
  background: var(--bg-surface);
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .trust-header {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .trust-badges {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    .badge-card {
      background: var(--card-bg);
      border: 1px solid var(--border-light);
      border-radius: 10px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      span.label {
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      span.desc {
        font-size: 0.65rem;
        color: var(--text-muted);
        line-height: 1.3;
      }
    }
  }

  .quick-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;

    label {
      font-size: 0.68rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .chip-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      button.chip {
        background: var(--card-bg);
        border: 1px solid var(--border-medium);
        color: var(--text-primary);
        font-size: 0.7rem;
        padding: 5px 10px;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          background: var(--text-primary);
          color: var(--bg);
          border-color: var(--text-primary);
          font-weight: 700;
        }

        &:hover:not(.active) {
          border-color: var(--text-primary);
        }
      }
    }
  }
`;

const Footer = styled.div`
  padding: 20px 24px;
  background: var(--card-bg);
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 14px;

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    span.lbl {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    span.val {
      font-family: ${({ theme }) => theme.fonts.display};
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-primary);
    }
  }

  .dispatch-note {
    font-size: 0.72rem;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.4;
  }

  button.checkout-btn {
    width: 100%;
    height: 52px;
    border-radius: 9999px;
    border: none;
    background: #25d366; /* WhatsApp Brand Accent for Trust */
    color: #ffffff;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 18px rgba(37, 211, 102, 0.35);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 24px rgba(37, 211, 102, 0.5);
      background: #20bd5a;
    }

    &:disabled {
      background: var(--border-medium);
      color: var(--text-muted);
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  }
`;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Harare (Same-day)');
  const [selectedPayment, setSelectedPayment] = useState<string>('EcoCash USD');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const cities = ['Harare (Same-day)', 'Bulawayo (Swift)', 'Nationwide Zim'];
  const paymentMethods = ['EcoCash USD', 'InnBucks', 'Cash on Delivery'];

  return (
    <Overlay $isOpen={isOpen} onClick={onClose} role="dialog" aria-modal="true">
      <DrawerContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <div className="title-group">
            <h3>Cart</h3>
            <span className="count">
              [{items.reduce((s, i) => s + i.quantity, 0)}]
            </span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </Header>

        <ItemsBody>
          {items.length === 0 ? (
            <EmptyState>
              <div className="empty-icon">00</div>
              <h4>Your Cart Is Empty</h4>
              <p>
                Faith you can wear. Select your size on the Directed by Elohim
                Tee to begin your order.
              </p>
              <button
                type="button"
                className="browse-btn"
                onClick={() => {
                  onClose();
                  const target = document.getElementById('shop');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Browse Merch
              </button>
            </EmptyState>
          ) : (
            items.map((item) => (
              <CartItemRow key={`${item.name}-${item.size}`}>
                <div className="item-thumb">
                  <img src={frontImgUrl} alt={item.name} />
                </div>
                <div className="item-info">
                  <div className="item-header">
                    <h5>{item.name}</h5>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.name, item.size)}
                      title="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="size-tag">
                    Size: <span className="size-val">{item.size}</span>
                  </div>
                  <div className="item-bottom">
                    <span className="price">${item.price * item.quantity}</span>
                    <div className="qty-control">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.name, item.size, -1)
                        }
                        aria-label="Decrease quantity"
                      >
                        –
                      </button>
                      <span className="qty">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.name, item.size, 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </CartItemRow>
            ))
          )}
        </ItemsBody>

        {items.length > 0 && (
          <>
            <TrustSection>
              <span className="trust-header">Zimbabwe Delivery & Payment</span>
              <div className="trust-badges">
                <div className="badge-card">
                  <span className="label">⚡ Verified Payments</span>
                  <span className="desc">
                    EcoCash USD · InnBucks · USD Cash on Delivery
                  </span>
                </div>
                <div className="badge-card">
                  <span className="label">🚚 Fast Dispatch</span>
                  <span className="desc">
                    Harare same-day or Swift / Courier Connect
                  </span>
                </div>
              </div>

              <div className="quick-options">
                <label>Select Delivery Area</label>
                <div className="chip-row">
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className={`chip ${selectedCity === city ? 'active' : ''}`}
                      onClick={() => setSelectedCity(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div className="quick-options">
                <label>Payment Preference</label>
                <div className="chip-row">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      className={`chip ${selectedPayment === pm ? 'active' : ''}`}
                      onClick={() => setSelectedPayment(pm)}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>
            </TrustSection>

            <Footer>
              <div className="summary-row">
                <span className="lbl">Total</span>
                <span className="val">${subtotal} USD</span>
              </div>
              <p className="dispatch-note">
                Orders are confirmed directly with our Harare dispatch desk on
                WhatsApp.
              </p>
              <button
                type="button"
                className="checkout-btn"
                onClick={() =>
                  onCheckout({
                    deliveryCity: selectedCity,
                    paymentMethod: selectedPayment,
                  })
                }
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.07c-.24.68-1.4 1.29-1.93 1.37-.5.08-1.15.11-3.32-.78-2.77-1.15-4.57-3.95-4.71-4.14-.14-.19-1.12-1.49-1.12-2.85 0-1.35.71-2.02.96-2.29.25-.28.55-.35.74-.35.18 0 .37 0 .53.01.17.01.4.06.62.53.24.52.82 2 .89 2.15.07.15.11.33.02.53-.1.19-.15.31-.29.49-.15.18-.31.39-.45.53-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.37 2.46 1.52.31.15.49.13.67-.08.19-.21.79-.92 1-1.24.21-.31.43-.26.71-.16.29.1 1.83.86 2.15 1.02.31.16.52.24.6.37.07.13.07.76-.17 1.44z" />
                </svg>
                Order via WhatsApp · ${subtotal}
              </button>
            </Footer>
          </>
        )}
      </DrawerContent>
    </Overlay>
  );
};
