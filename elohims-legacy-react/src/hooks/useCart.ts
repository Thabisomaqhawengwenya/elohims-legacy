import { useState, useCallback, useEffect } from 'react';

export interface CartItem {
  name: string;
  price: number;
  size: string;
  quantity: number;
}

const STORAGE_KEY = 'elohims_cart_v2';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to load cart from storage', err);
      }
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to storage', err);
    }
  }, [items]);

  const addItem = useCallback(
    (name: string, price: number, size: string, quantity = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.name === name && item.size === size
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }

        return [...prev, { name, price, size, quantity }];
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (name: string, size: string, delta: number) => {
      setItems((prev) =>
        prev
          .map((item) => {
            if (item.name === name && item.size === size) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null)
      );
    },
    []
  );

  const removeItem = useCallback((name: string, size: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.name === name && item.size === size))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const generateWhatsAppUrl = useCallback(
    (
      whatsAppNumber: string,
      options?: { deliveryCity?: string; paymentMethod?: string }
    ) => {
      if (items.length === 0) return '';

      const lines = [
        "Grace & Peace! I'd like to place an order from Elohim's Legacy:",
        '',
        ...items.map(
          (item) =>
            `• ${item.quantity}x ${item.name} [Size: ${item.size}] - $${item.price * item.quantity} USD`
        ),
        '',
        `Total: $${subtotal} USD`,
      ];

      if (options?.deliveryCity) {
        lines.push(`Delivery Location: ${options.deliveryCity}`);
      }
      if (options?.paymentMethod) {
        lines.push(`Preferred Payment: ${options.paymentMethod}`);
      }

      lines.push(
        '',
        'Please confirm stock availability and dispatch time. Thank you!'
      );

      const message = lines.join('\n');
      return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
    },
    [items, subtotal]
  );

  const checkoutWhatsApp = useCallback(
    (
      whatsAppNumber: string,
      options?: { deliveryCity?: string; paymentMethod?: string }
    ) => {
      const url = generateWhatsAppUrl(whatsAppNumber, options);
      if (!url) {
        alert('Your cart is empty');
        return;
      }
      window.open(url, '_blank');
    },
    [generateWhatsAppUrl]
  );

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    generateWhatsAppUrl,
    checkoutWhatsApp,
  };
}
