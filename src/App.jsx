import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './application/contexts/CartContext';
import { Header } from './presentation/components/common/Header';
import { Footer } from './presentation/components/common/Footer';
import { HomePage } from './presentation/pages/HomePage';
import { ProductsPage } from './presentation/pages/ProductsPage';
import { AboutPage } from './presentation/pages/AboutPage';
import { FAQPage } from './presentation/pages/FAQPage';
import { ContactPage } from './presentation/pages/ContactPage';
import './presentation/styles/global.css';

/**
 * App Component
 * Root component with routing and context providers
 */
function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contato" element={<ContactPage />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
