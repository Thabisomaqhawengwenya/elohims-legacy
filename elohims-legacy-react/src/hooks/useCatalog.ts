import { useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductStatus,
  StorePromotion,
  StoreSettings,
  STORE_DATA,
  INITIAL_PROMOTION,
  INITIAL_SETTINGS,
} from '../data/content';

const CATALOG_STORAGE_KEY = 'elohims_catalog_v3';
const PROMO_STORAGE_KEY = 'elohims_promo_v1';
const SETTINGS_STORAGE_KEY = 'elohims_settings_v1';

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse catalog from storage', err);
      }
    }
    return STORE_DATA.catalog as Product[];
  });

  const [promotion, setPromotion] = useState<StorePromotion>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PROMO_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse promo from storage', err);
      }
    }
    return INITIAL_PROMOTION;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse settings from storage', err);
      }
    }
    return INITIAL_SETTINGS;
  });

  // Sync products
  useEffect(() => {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      console.error('Failed to save catalog to storage', err);
    }
  }, [products]);

  // Sync promo
  useEffect(() => {
    try {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promotion));
    } catch (err) {
      console.error('Failed to save promotion to storage', err);
    }
  }, [promotion]);

  // Sync settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings to storage', err);
    }
  }, [settings]);

  const addProduct = useCallback(
    (newProduct: Omit<Product, 'id'>) => {
      const generatedId = newProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;

      const productWithId: Product = {
        ...newProduct,
        id: generatedId,
      };

      setProducts((prev) => [productWithId, ...prev]);
      return productWithId;
    },
    []
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleStockStatus = useCallback(
    (id: string, targetStatus?: ProductStatus) => {
      setProducts((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;

          if (targetStatus) {
            return { ...item, status: targetStatus };
          }

          // Cycle through in_stock -> out_of_stock -> soon -> in_stock
          let nextStatus: ProductStatus = 'in_stock';
          if (item.status === 'in_stock' || item.status === 'available') {
            nextStatus = 'out_of_stock';
          } else if (item.status === 'out_of_stock') {
            nextStatus = 'soon';
          } else {
            nextStatus = 'in_stock';
          }

          return { ...item, status: nextStatus };
        })
      );
    },
    []
  );

  const updatePromotion = useCallback((updates: Partial<StorePromotion>) => {
    setPromotion((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback((updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(STORE_DATA.catalog as Product[]);
    setPromotion(INITIAL_PROMOTION);
    setSettings(INITIAL_SETTINGS);
  }, []);

  return {
    products,
    promotion,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStockStatus,
    updatePromotion,
    updateSettings,
    resetToDefaults,
  };
}
