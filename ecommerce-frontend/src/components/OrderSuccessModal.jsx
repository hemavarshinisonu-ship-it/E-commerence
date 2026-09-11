import React from 'react';
import { CheckCircle2, Truck, ShoppingBag, ArrowRight, Package } from 'lucide-react';

const OrderSuccessModal = ({ isOpen, onClose, orderDetails, onViewOrders, onContinueShopping }) => {
  if (!isOpen || !orderDetails) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(8px)',
      zIndex: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: '#131b2e',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        color: '#f8fafc',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        textAlign: 'center',
        padding: '2.5rem 2rem',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Animated Checkmark Badge */}
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
        }}>
          <CheckCircle2 size={48} />
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Order Placed Successfully! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
          Thank you for your purchase. We have received your order and are preparing it for shipment.
        </p>

        {/* Order Details Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          textAlign: 'left',
          marginBottom: '1.75rem',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Order ID</span>
            <strong style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>#{orderDetails.id}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Method</span>
            <strong>{orderDetails.paymentMethod || 'Google Pay'}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Amount</span>
            <strong style={{ color: '#22c55e', fontSize: '1rem' }}>${orderDetails.totalAmount?.toFixed(2)}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)', fontWeight: '600' }}>
            <Truck size={16} />
            <span>Estimated Delivery: <strong>{orderDetails.estimatedDelivery || 'In 3 Days'}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onViewOrders}
            className="btn-checkout"
            style={{ flex: 1, background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Package size={16} />
            <span>Track Orders</span>
          </button>

          <button
            onClick={onContinueShopping}
            className="btn-checkout"
            style={{ flex: 1 }}
          >
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
