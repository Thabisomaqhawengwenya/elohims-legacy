import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { Navbar } from './components/Navbar';
import { Cursor } from './components/Cursor';
// Three.js + the 3D tee load in their own chunk so the page shell (and admin) paint first
const Scene = lazy(() =>
  import('./components/Scene').then((m) => ({ default: m.Scene }))
);
import { Loader } from './components/Loader';
import { PromoBanner } from './components/PromoBanner';
import { HeroSection } from './components/sections/HeroSection';
import { StatementSection } from './components/sections/StatementSection';
import { BackPrintSection } from './components/sections/BackPrintSection';
import { ProductSection } from './components/sections/ProductSection';
import { ShopSection } from './components/sections/ShopSection';
import { ContactSection } from './components/sections/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { LookbookModal } from './components/LookbookModal';
import { WaitlistModal } from './components/WaitlistModal';
import { AdminPage } from './components/Admin/AdminPage';
import { useCart } from './hooks/useCart';
import { useCatalog } from './hooks/useCatalog';
import { useMouse } from './hooks/useMouse';
import { useReveal } from './hooks/useReveal';
import { STORE_DATA, Product } from './data/content';

export const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('elohims_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // View state: 'store' or 'admin'
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'store';
  });

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToView = (view: 'store' | 'admin') => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
    } else {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  // Dynamic Catalog, Promotions, and Settings Hook
  const {
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
  } = useCatalog();

  // Modal / Drawer States
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [lookbookView, setLookbookView] = useState<'front' | 'back' | null>(null);
  const [lookbookProduct, setLookbookProduct] = useState<Product | null>(null);
  const [waitlistProduct, setWaitlistProduct] = useState<string | null>(null);

  const {
    items,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    checkoutWhatsApp,
  } = useCart();

  const { hasFinePointer } = useMouse();

  // Scroll-reveal IntersectionObserver trigger
  useReveal();

  const handleAddToCart = (name: string, price: number, size: string) => {
    addItem(name, price, size);
    setIsCartOpen(true);
  };

  const handleToggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('elohims_theme', next);
      return next;
    });
  };

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Loader isReady={isLoaded} />

      {/* 3D WebGL Scene only runs on Storefront */}
      {currentView === 'store' && (
        <Suspense fallback={null}>
          <Scene
            onLoaded={() => setIsLoaded(true)}
            isLight={themeMode === 'light'}
          />
        </Suspense>
      )}

      <Cursor hasFinePointer={hasFinePointer} />

      {currentView === 'admin' ? (
        <AdminPage
          products={products}
          promotion={promotion}
          settings={settings}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onToggleStock={toggleStockStatus}
          onUpdatePromotion={updatePromotion}
          onUpdateSettings={updateSettings}
          onResetToDefaults={resetToDefaults}
          onBackToStore={() => navigateToView('store')}
          isLight={themeMode === 'light'}
          onToggleTheme={handleToggleTheme}
        />
      ) : (
        <>
          <PromoBanner
            promotion={promotion}
            onAdminClick={() => navigateToView('admin')}
          />
          <Navbar
            brandName={STORE_DATA.brand.name}
            cartCount={itemCount}
            onCartClick={() => setIsCartOpen(true)}
            isLight={themeMode === 'light'}
            onToggleTheme={handleToggleTheme}
            onAdminClick={() => navigateToView('admin')}
          />
          <main>
            <HeroSection
              headline={STORE_DATA.hero.headline}
              headlineAccent={STORE_DATA.hero.headlineAccent}
              description={STORE_DATA.hero.description}
            />
            <StatementSection statement={STORE_DATA.brand.statement} />
            <BackPrintSection />
            <ProductSection
              onAddToCart={handleAddToCart}
              onOpenLookbook={(view) => { setLookbookProduct(null); setLookbookView(view); }}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />
            <ShopSection
              products={products}
              onAddToCart={handleAddToCart}
              onOpenLookbook={(view, product) => { setLookbookProduct(product ?? null); setLookbookView(view); }}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              onOpenWaitlist={(productName) => setWaitlistProduct(productName)}
            />
            <ContactSection
              email={settings.email || STORE_DATA.contact.email}
              onAdminClick={() => navigateToView('admin')}
            />
          </main>

          {/* Slide-Over Cart Drawer with Zimbabwe trust badges */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={items}
            subtotal={subtotal}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onCheckout={(options) => {
              checkoutWhatsApp(settings.whatsAppNumber || STORE_DATA.whatsAppNumber, options);
            }}
          />

          {/* Streetwear Sizing Table Modal */}
          <SizeGuideModal
            isOpen={isSizeGuideOpen}
            onClose={() => setIsSizeGuideOpen(false)}
          />

          {/* Macro Studio Inspection Modal */}
          <LookbookModal
            isOpen={lookbookView !== null}
            initialView={lookbookView ?? 'front'}
            product={lookbookProduct}
            onClose={() => { setLookbookView(null); setLookbookProduct(null); }}
            onAddToCart={handleAddToCart}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onOpenWaitlist={(name) => setWaitlistProduct(name)}
          />

          {/* VIP Capsule Drop Waitlist Modal */}
          <WaitlistModal
            isOpen={waitlistProduct !== null}
            productName={waitlistProduct ?? ''}
            onClose={() => setWaitlistProduct(null)}
          />
        </>
      )}
    </ThemeProvider>
  );
};

export default App;
