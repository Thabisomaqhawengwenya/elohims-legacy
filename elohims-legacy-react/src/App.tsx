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

  const { itemCount, addItem, checkoutWhatsApp } = useCart();
  const { hasFinePointer } = useMouse();

  // Scroll-reveal IntersectionObserver trigger
  useReveal();

  const handleCartClick = () => {
    checkoutWhatsApp(STORE_DATA.whatsAppNumber);
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
        onCartClick={handleCartClick}
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
        <ProductSection onAddToCart={addItem} />
        <ShopSection
          products={STORE_DATA.catalog}
          onAddToCart={addItem}
        />
        <ContactSection email={STORE_DATA.contact.email} />
      </main>
    </ThemeProvider>
  );
};

export default App;
