import React from 'react';
import { ShoppingBag, Heart, ShoppingCart, User, LogOut, Package, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from '../utils/translations';

const LANG_FLAGS = {
  en: '🇺🇸 EN',
  ta: '🇮🇳 தமிழ்',
  hi: '🇮🇳 हिंदी',
  es: '🇪🇸 ES',
  fr: '🇫🇷 FR'
};

const Navbar = ({ currentPage, setCurrentPage, onOpenAccountModal }) => {
  const { user, isAuthenticated, logout, language } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const t = useTranslation(language);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <button onClick={() => setCurrentPage('home')} className="logo">
          <Sparkles size={24} color="#6366f1" />
          <span>LUXE<span className="logo-badge">STORE</span></span>
        </button>

        {/* Navigation Links */}
        <div className="nav-links">
          <button
            onClick={() => setCurrentPage('home')}
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          >
            <ShoppingBag size={18} />
            <span>{t('products')}</span>
          </button>

          {/* Wishlist Link with Badge */}
          <button
            onClick={() => setCurrentPage('wishlist')}
            className={`nav-item ${currentPage === 'wishlist' ? 'active' : ''}`}
          >
            <Heart size={18} />
            <span>{t('wishlist')}</span>
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </button>

          {/* Orders History Link */}
          {isAuthenticated && (
            <button
              onClick={() => setCurrentPage('orders')}
              className={`nav-item ${currentPage === 'orders' ? 'active' : ''}`}
            >
              <Package size={18} />
              <span>{t('orders')}</span>
            </button>
          )}

          {/* Cart Icon Trigger */}
          <button onClick={openCart} className="nav-item" title="Open Shopping Cart">
            <ShoppingCart size={18} />
            <span>{t('cart')}</span>
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </button>
        </div>

        {/* User Profile / Auth Action */}
        <div className="user-menu">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={onOpenAccountModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                title="Account Settings, Profile, Language & Notifications"
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {(user?.name || 'A')[0].toUpperCase()}
                </div>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {LANG_FLAGS[language] || '🇺🇸 EN'}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              <button onClick={logout} className="nav-item" title={t('signOut')}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => setCurrentPage('login')} className="btn-login">
              {t('signIn')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
