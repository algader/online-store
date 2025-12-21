import React, { useContext } from 'react';
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>🛒 {t('home.title')}</h1>
        <nav>
          <Link to="/">{t('nav.home')}</Link>
          {user ? (
            <>
              <Link to="/cart">{t('nav.cart')} ({getTotalItems()})</Link>
              <Link to="/orders">{t('nav.orders')}</Link>
              {user.role === 'admin' && (
                <Link to="/admin">{t('nav.admin')}</Link>
              )}
              <button onClick={handleLogout}>{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login">{t('nav.login')}</Link>
              <Link to="/register">{t('nav.register')}</Link>
            </>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
