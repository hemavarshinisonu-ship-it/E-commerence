import React, { useState } from 'react';
import { X, MapPin, CreditCard, ShieldCheck, CheckCircle2, Plus, ArrowRight, Truck, Check } from 'lucide-react';

const INITIAL_ADDRESSES = [
  {
    id: 1,
    name: 'Alex Mercer',
    phone: '+91 98765 43210',
    pincode: '600040',
    address: 'Flat 4B, Green Acres Apartments, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Home'
  },
  {
    id: 2,
    name: 'Alex Mercer',
    phone: '+91 98765 43210',
    pincode: '600096',
    address: '5th Floor, Cyber Tech Park, OMR Highway',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Office'
  }
];

const CheckoutModal = ({ isOpen, onClose, cartItems, subtotal, onOrderSuccess }) => {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address Form
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    type: 'Home'
  });

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState('google_pay'); // 'google_pay', 'paytm', 'card', 'cod'
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.address || !newAddr.pincode) return;
    const added = { id: Date.now(), ...newAddr };
    setAddresses((prev) => [...prev, added]);
    setSelectedAddressId(added.id);
    setIsAddingNewAddress(false);
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleFinalCheckout = async () => {
    setIsSubmitting(true);
    try {
      await onOrderSuccess({
        shippingAddress: selectedAddress,
        paymentMethod,
        upiId: paymentMethod.includes('pay') ? upiId : null
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '620px',
        background: '#131b2e',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        color: '#f8fafc',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 15, 25, 0.5)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Checkout & Delivery</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Step {step} of 2: {step === 1 ? 'Select Delivery Address' : 'Payment Options'}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
          <div
            onClick={() => setStep(1)}
            style={{
              flex: 1,
              padding: '0.85rem',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: step === 1 ? 'var(--accent-primary)' : 'var(--text-muted)',
              borderBottom: step === 1 ? '3px solid var(--accent-primary)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <MapPin size={16} />
            <span>1. Delivery Address</span>
          </div>
          <div
            onClick={() => setStep(2)}
            style={{
              flex: 1,
              padding: '0.85rem',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: step === 2 ? 'var(--accent-primary)' : 'var(--text-muted)',
              borderBottom: step === 2 ? '3px solid var(--accent-primary)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <CreditCard size={16} />
            <span>2. Payment Details</span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {step === 1 ? (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--accent-primary)" />
                Select Delivery Address
              </h4>

              {!isAddingNewAddress ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        style={{
                          padding: '1rem',
                          borderRadius: '12px',
                          border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                          background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{addr.name}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                            {addr.type}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', lineHeight: '1.4' }}>
                          {addr.address}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Mobile: {addr.phone}</p>
                        {isSelected && (
                          <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--accent-primary)' }}>
                            <CheckCircle2 size={18} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: '1px dashed var(--accent-primary)',
                      color: 'var(--accent-primary)',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      justifyContent: 'center',
                      background: 'rgba(99, 102, 241, 0.05)',
                      marginTop: '0.5rem'
                    }}
                  >
                    <Plus size={18} />
                    <span>Add New Delivery Address</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveNewAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddr.name}
                        onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                        placeholder="Alex Mercer"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="text"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        required
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        placeholder="600040"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">City / District</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        placeholder="Chennai"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Flat, House No., Building, Street</label>
                    <input
                      type="text"
                      required
                      value={newAddr.address}
                      onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                      placeholder="Flat 4B, Green Acres, Anna Nagar"
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-checkout" style={{ flex: 1 }}>
                      Save & Deliver Here
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      style={{ padding: '0.85rem 1.25rem', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} color="var(--accent-primary)" />
                Select Payment Method
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {/* 1. Google Pay */}
                <div
                  onClick={() => setPaymentMethod('google_pay')}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${paymentMethod === 'google_pay' ? '#4285F4' : 'var(--border-color)'}`,
                    background: paymentMethod === 'google_pay' ? 'rgba(66, 133, 244, 0.12)' : 'var(--bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>Google Pay (UPI)</span>
                    <span style={{ marginLeft: 'auto', background: '#22c55e', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>Fastest</span>
                  </div>
                  {paymentMethod === 'google_pay' && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Enter Google Pay UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okaxis"
                        className="form-input"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Paytm / PhonePe */}
                <div
                  onClick={() => setPaymentMethod('paytm')}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${paymentMethod === 'paytm' ? '#00baf2' : 'var(--border-color)'}`,
                    background: paymentMethod === 'paytm' ? 'rgba(0, 186, 242, 0.12)' : 'var(--bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#002e6e', color: '#00baf2', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem' }}>
                      Paytm / PhonePe
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>UPI & Paytm Wallet</span>
                  </div>
                  {paymentMethod === 'paytm' && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Enter Paytm / PhonePe VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="mobileNo@paytm"
                        className="form-input"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${paymentMethod === 'card' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === 'card' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CreditCard size={20} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Credit / Debit / ATM Card</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number (4532 •••• •••• 8910)"
                        className="form-input"
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="form-input"
                        />
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          className="form-input"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${paymentMethod === 'cod' ? '#22c55e' : 'var(--border-color)'}`,
                    background: paymentMethod === 'cod' ? 'rgba(34, 197, 94, 0.12)' : 'var(--bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Truck size={20} color="#22c55e" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery (COD)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Total Summary & Actions */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(11, 15, 25, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Amount Payable</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</div>
          </div>

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-checkout"
              style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
            >
              <span>Continue to Payment</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalCheckout}
              disabled={isSubmitting}
              className="btn-checkout"
              style={{ width: 'auto', padding: '0.75rem 1.5rem', background: '#22c55e' }}
            >
              <span>{isSubmitting ? 'Processing Payment...' : 'Pay & Confirm Order'}</span>
              <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
