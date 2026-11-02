import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
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
  const { itemCount, addItem, checkoutWhatsApp } = useCart();
  const { hasFinePointer } = useMouse();

  // Scroll-reveal IntersectionObserver trigger
  useReveal();

  const handleCartClick = () => {
    checkoutWhatsApp(STORE_DATA.whatsAppNumber);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Loader isReady={isLoaded} />
      <Scene onLoaded={() => setIsLoaded(true)} />
      <Cursor hasFinePointer={hasFinePointer} />
      <Navbar
        brandName={STORE_DATA.brand.name}
        cartCount={itemCount}
        onCartClick={handleCartClick}
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
