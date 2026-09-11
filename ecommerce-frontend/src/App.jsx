import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import AccountModal from './components/AccountModal';

import HomePage from './pages/HomePage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import * as orderApi from './api/orders';

import './styles/main.css';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const data = await orderApi.getOrders();
        setUserOrders(data || []);
      } catch (err) {
        // Silently fail if guest
      }
    };
    fetchUserOrders();
  }, [currentPage]);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />

      {/* Account Settings, Profile, Language & Notification Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        orders={userOrders}
        setCurrentPage={setCurrentPage}
      />

      {/* Slide-in Cart Sidebar Drawer */}
      <CartDrawer setCurrentPage={setCurrentPage} />

      {/* Main Page Route Area */}
      <main className="main-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'wishlist' && <WishlistPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'orders' && <OrdersPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'signup' && <SignupPage setCurrentPage={setCurrentPage} />}
      </main>

      {/* Dynamic Toast Notifications */}
      <ToastContainer />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>© 2026 LUXE E-Commerce Platform. Built with Express, MySQL, React & Vite.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
