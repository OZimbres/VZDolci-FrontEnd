import { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { CartProvider } from './application/contexts/CartContext';
import { Header } from './presentation/components/common/Header';
import { Footer } from './presentation/components/common/Footer';
import { SideCart } from './presentation/components/common/SideCart';
import { StructuredData } from './presentation/components/common/StructuredData';
import { SkipLink } from './presentation/components/common/SkipLink';
import { HomePage } from './presentation/pages/HomePage';
import { ProductsPage } from './presentation/pages/ProductsPage';
import { AboutPage } from './presentation/pages/AboutPage';
import { FAQPage } from './presentation/pages/FAQPage';
import { ContactPage } from './presentation/pages/ContactPage';
import { CheckoutPage } from './presentation/pages/CheckoutPage';
import { CheckoutSuccessPage } from './presentation/pages/CheckoutSuccessPage';
import { CheckoutFailurePage } from './presentation/pages/CheckoutFailurePage';
import { CheckoutPendingPage } from './presentation/pages/CheckoutPendingPage';
import { CheckoutReturnPage } from './presentation/pages/CheckoutReturnPage';
import './presentation/styles/global.css';

/**
 * App Component
 * Root component with routing and context providers
 */
function App() {
  const sideCartRef = useRef(null);

  const handleCartClick = () => {
    if (sideCartRef.current) {
      sideCartRef.current.toggleCart();
    }
  };

  return (
    <CartProvider>
      <Router>
        <SkipLink />
        <StructuredData />
        <Header onCartClick={handleCartClick} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/failure" element={<CheckoutFailurePage />} />
          <Route path="/checkout/pending" element={<CheckoutPendingPage />} />
          <Route path="/checkout/retorno" element={<CheckoutReturnPage />} />
        </Routes>
        <Footer />
        <SideCart ref={sideCartRef} />
        <Analytics />
        <SpeedInsights />
      </Router>
    </CartProvider>
  );
}

export default App;
