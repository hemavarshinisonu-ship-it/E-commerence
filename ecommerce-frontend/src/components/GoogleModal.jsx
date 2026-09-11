import React, { useState } from 'react';
import { X, UserPlus, Check, ArrowRight } from 'lucide-react';

const PRESET_GOOGLE_ACCOUNTS = [
  { name: 'Alex Mercer', email: 'alex.mercer@gmail.com', avatarBg: '#4285F4' },
  { name: 'Sarah Connor', email: 'sarah.connor@gmail.com', avatarBg: '#EA4335' },
  { name: 'David Miller', email: 'david.miller@gmail.com', avatarBg: '#FBBC05' }
];

const GoogleModal = ({ isOpen, onClose, onSelectAccount }) => {
  const [selectedAccount, setSelectedAccount] = useState(PRESET_GOOGLE_ACCOUNTS[0]);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (isCustomMode) {
      if (!customEmail) return;
      const derivedName = customName || customEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      onSelectAccount({ name: derivedName, email: customEmail });
    } else {
      onSelectAccount(selectedAccount);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#ffffff',
        borderRadius: '16px',
        color: '#1f2937',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        animation: 'popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span style={{ fontWeight: '700', fontSize: '1rem', color: '#111827' }}>Sign in with Google</span>
          </div>
          <button onClick={onClose} style={{ color: '#6b7280', padding: '4px', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
              Choose an account
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
              to continue to <strong style={{ color: '#4f46e5' }}>LUXE Store</strong>
            </p>
          </div>

          {!isCustomMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {PRESET_GOOGLE_ACCOUNTS.map((acc) => {
                const isSelected = selectedAccount?.email === acc.email;
                return (
                  <div
                    key={acc.email}
                    onClick={() => setSelectedAccount(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? '#4f46e5' : '#e5e7eb'}`,
                      background: isSelected ? '#f5f3ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: acc.avatarBg,
                      color: '#ffffff',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      {acc.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#111827' }}>{acc.name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{acc.email}</div>
                    </div>
                    {isSelected && <Check size={18} color="#4f46e5" />}
                  </div>
                );
              })}

              {/* Add another Google account option */}
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1',
                  color: '#4f46e5',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  background: '#f8fafc',
                  marginTop: '0.25rem'
                }}
              >
                <UserPlus size={18} />
                <span>Use another Google account</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="your.google.account@gmail.com"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '0.3rem' }}>
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                style={{ fontSize: '0.82rem', color: '#6b7280', textDecoration: 'underline', alignSelf: 'flex-start', cursor: 'pointer' }}
              >
                ← Back to saved accounts
              </button>
            </div>
          )}

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: '#4f46e5',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.95rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Continue as {isCustomMode ? (customName || 'User') : selectedAccount.name.split(' ')[0]}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: '#f9fafb',
          borderTop: '1px solid #f3f4f6',
          fontSize: '0.78rem',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          To continue, Google will share your name and email address with LUXE Store.
        </div>
      </div>
    </div>
  );
};

export default GoogleModal;
