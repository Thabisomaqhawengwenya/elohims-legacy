import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { Navbar } from './components/Navbar';
import { Cursor } from './components/Cursor';
import { Scene } from './components/Scene';
import { Loader } from './components/Loader';
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
import { useCart } from './hooks/useCart';
import { useMouse } from './hooks/useMouse';
import { useReveal } from './hooks/useReveal';
import { STORE_DATA } from './data/content';

export const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('elohims_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // Modal / Drawer States
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [lookbookView, setLookbookView] = useState<'front' | 'back' | null>(null);
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
      <Scene
        onLoaded={() => setIsLoaded(true)}
        isLight={themeMode === 'light'}
      />
      <Cursor hasFinePointer={hasFinePointer} />
      <Navbar
        brandName={STORE_DATA.brand.name}
        cartCount={itemCount}
        onCartClick={() => setIsCartOpen(true)}
        isLight={themeMode === 'light'}
        onToggleTheme={handleToggleTheme}
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
          onOpenLookbook={(view) => setLookbookView(view)}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />
        <ShopSection
          products={STORE_DATA.catalog}
          onAddToCart={handleAddToCart}
          onOpenLookbook={(view) => setLookbookView(view)}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          onOpenWaitlist={(productName) => setWaitlistProduct(productName)}
        />
        <ContactSection email={STORE_DATA.contact.email} />
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
          checkoutWhatsApp(STORE_DATA.whatsAppNumber, options);
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
        onClose={() => setLookbookView(null)}
      />

      {/* VIP Capsule Drop Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistProduct !== null}
        productName={waitlistProduct ?? ''}
        onClose={() => setWaitlistProduct(null)}
      />
    </ThemeProvider>
  );
};

export default App;
