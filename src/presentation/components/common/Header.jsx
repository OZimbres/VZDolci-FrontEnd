import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../application/contexts/CartContext';
import './Header.css';

/**
 * Header Component
 * Displays the navigation bar
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getItemCount } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
        </ul>

        <div className="cart-icon" onClick={closeMenu}>
          <Link to="/contato" className="nav-link">
            🛒 {getItemCount() > 0 && <span className="cart-badge">{getItemCount()}</span>}
          </Link>
        </div>

        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
