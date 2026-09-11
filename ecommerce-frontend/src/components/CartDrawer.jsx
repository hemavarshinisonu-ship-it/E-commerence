import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CheckoutModal from './CheckoutModal';
import OrderSuccessModal from './OrderSuccessModal';
import * as orderApi from '../api/orders';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 300;

const CartDrawer = ({ setCurrentPage }) => {
  const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, itemCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleOpenCheckoutModal = () => {
    if (!isAuthenticated) {
      addToast('Please sign in to complete your checkout.', 'error');
      setCurrentPage('login');
      closeCart();
      return;
    }
    if (cartItems.length === 0) return;
    setIsCheckoutModalOpen(true);
  };

  const handleOrderSuccess = async (checkoutPayload) => {
    try {
      const result = await orderApi.createOrder(checkoutPayload);
      setPlacedOrderDetails(result.order);
      setIsCheckoutModalOpen(false);
      clearCart();
      closeCart();
      setIsSuccessModalOpen(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order';
      addToast(msg, 'error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={closeCart} />

      {/* Slide-in Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={20} color="var(--accent-primary)" />
            <span>Shopping Cart ({itemCount})</span>
          </div>
          <button onClick={closeCart} className="close-drawer-btn">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="shipping-bar-container">
          {amountUntilFreeShipping > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={16} color="var(--accent-primary)" />
              <span>Add <strong>${amountUntilFreeShipping.toFixed(2)}</strong> more for <strong>FREE Express Shipping</strong></span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80' }}>
              <Truck size={16} color="#4ade80" />
              <span>Congratulations! You unlocked <strong>FREE Express Shipping</strong>!</span>
            </div>
          )}
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${shippingProgress}%` }} />
          </div>
        </div>

        {/* Drawer Body Items List */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Looks like you haven't added any items yet.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cart_id || item.product_id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>

                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="delete-item-btn"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{amountUntilFreeShipping === 0 ? 'FREE' : '$15.00'}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(subtotal + (amountUntilFreeShipping === 0 ? 0 : 15)).toFixed(2)}</span>
            </div>

            <button
              onClick={handleOpenCheckoutModal}
              className="btn-checkout"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} color="#4ade80" />
              <span>Encrypted 256-bit Secure Checkout</span>
            </div>
          </div>
        )}
      </div>

      {/* Address & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        subtotal={subtotal}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Placed Success Modal */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        orderDetails={placedOrderDetails}
        onViewOrders={() => {
          setIsSuccessModalOpen(false);
          setCurrentPage('orders');
        }}
        onContinueShopping={() => {
          setIsSuccessModalOpen(false);
          setCurrentPage('home');
        }}
      />
    </>
  );
};

export default CartDrawer;
