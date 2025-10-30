import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../application/contexts/CartContext';
import './Header.css';

/**
 * Header Component
 * Displays the navigation bar
 */
export const Header = memo(function Header({ onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    closeMenu();
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          VZ Dolci
        </Link>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/produtos" className="nav-link" onClick={closeMenu}>
              Produtos
            </Link>
          </li>
          <li>
            <Link to="/sobre" className="nav-link" onClick={closeMenu}>
              Sobre Nós
            </Link>
          </li>
          <li>
            <Link to="/faq" className="nav-link" onClick={closeMenu}>
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/contato" className="nav-link" onClick={closeMenu}>
              Contato
            </Link>
          </li>
          <li>
            <Link to="/checkout" className="nav-link" onClick={closeMenu}>
              Pagamento
            </Link>
          </li>
        </ul>

        <div className="header-icons">
          <button 
            className="header-icon-btn cart-icon" 
            onClick={handleCartClick}
            aria-label="Abrir carrinho"
          >
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
        </div>

        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
});
