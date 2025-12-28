import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>🛒 {t('home.title')}</h1>
        
        {/* Hamburger Button for Mobile */}
        <button 
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={isMenuOpen ? 'nav-open' : ''}>
          <Link to="/" onClick={closeMenu}>{t('nav.home')}</Link>
          {user ? (
            <>
              <Link to="/cart" onClick={closeMenu}>{t('nav.cart')} ({getTotalItems()})</Link>
              <Link to="/orders" onClick={closeMenu}>{t('nav.orders')}</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={closeMenu}>{t('nav.admin')}</Link>
              )}
              <button onClick={handleLogout}>{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>{t('nav.login')}</Link>
              <Link to="/register" onClick={closeMenu}>{t('nav.register')}</Link>
            </>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
