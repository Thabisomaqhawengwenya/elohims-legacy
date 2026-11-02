import { useState, useCallback } from 'react';

export interface CartItem {
  name: string;
  price: number;
  size: string;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((name: string, price: number, size: string) => {
    setItems((prev) => [...prev, { name, price, size }]);
  }, []);

  const checkoutWhatsApp = useCallback(
    (whatsAppNumber: string) => {
      if (items.length === 0) {
        alert('Your cart is empty');
        return;
      }

      const total = items.reduce((sum, item) => sum + item.price, 0);
      const itemList = items
        .map((item) => `- ${item.name} (${item.size}) $${item.price}`)
        .join('\n');

      const message = `Hi! I would like to order from Elohim's Legacy:\n${itemList}\nTotal: $${total}`;
      const url = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    },
    [items]
  );

  return {
    items,
    itemCount: items.length,
    addItem,
    checkoutWhatsApp,
  };
}
