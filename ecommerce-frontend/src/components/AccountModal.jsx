import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../utils/translations';
import { X, User, Package, Globe, Bell, LogOut, Check, Save, ShieldCheck } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷' }
];

const AccountModal = ({ isOpen, onClose, orders, setCurrentPage }) => {
  const { user, updateUserProfile, language, setLanguage, notifications, toggleNotification, logout } = useAuth();
  const { addToast } = useToast();
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'language', 'notifications'

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Alex Mercer',
    email: user?.email || 'alex@example.com',
    phone: user?.phone || '+91 98765 43210',
    bio: user?.bio || 'LUXE VIP Shopper'
  });

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    addToast('Profile updated successfully!', 'success');
  };

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    const langObj = LANGUAGES.find((l) => l.code === langCode);
    addToast(`🌐 Language changed to ${langObj?.name}!`, 'success');
  };

  const handleToggleNotificationSetting = (id, label) => {
    toggleNotification(id);
    const isNowEnabled = notifications?.[id] === false; // toggled state
    addToast(`🔔 Notification setting "${label}" ${isNowEnabled ? 'enabled' : 'disabled'}!`, 'info');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '780px',
        height: '560px',
        background: '#131b2e',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        color: '#f8fafc',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        display: 'flex',
        overflow: 'hidden',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Left Sidebar Navigation */}
        <div style={{
          width: '240px',
          background: 'rgba(11, 15, 25, 0.7)',
          borderRight: '1px solid var(--border-color)',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            {/* User Profile Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', padding: '0 0.5rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px var(--accent-glow)'
              }}>
                {(user?.name || 'A')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <ShieldCheck size={12} />
                  <span>LUXE VIP Member</span>
                </div>
              </div>
            </div>

            {/* Sidebar Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: activeTab === 'profile' ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === 'profile' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <User size={18} />
                <span>{t('editProfile')}</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: activeTab === 'orders' ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === 'orders' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <Package size={18} />
                <span>{t('myOrders')}</span>
              </button>

              <button
                onClick={() => setActiveTab('language')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: activeTab === 'language' ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === 'language' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <Globe size={18} />
                <span>{t('language')}</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: activeTab === 'notifications' ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === 'notifications' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <Bell size={18} />
                <span>{t('notifications')}</span>
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <LogOut size={18} />
            <span>{t('signOut')}</span>
          </button>
        </div>

        {/* Right Main Content Area */}
        <div style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {activeTab === 'profile' && t('editProfile')}
              {activeTab === 'orders' && t('myOrders')}
              {activeTab === 'language' && t('language')}
              {activeTab === 'notifications' && t('notifications')}
            </h3>
            <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>

          {/* Tab 1: Edit Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Profile Bio / Tagline</label>
                <input
                  type="text"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ marginTop: '0.5rem', width: 'auto', alignSelf: 'flex-start', padding: '0.75rem 1.75rem' }}
              >
                <Save size={18} />
                <span>{t('saveChanges')}</span>
              </button>
            </form>
          )}

          {/* Tab 2: My Orders */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Recent orders and delivery status</p>
                <button
                  onClick={() => {
                    onClose();
                    setCurrentPage('orders');
                  }}
                  style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  View All Orders →
                </button>
              </div>

              {orders && orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {orders.slice(0, 3).map((ord) => (
                    <div key={ord.id} style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Order #{ord.id}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(ord.created_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#22c55e' }}>${parseFloat(ord.total_amount).toFixed(2)}</div>
                        <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700, background: 'rgba(34, 197, 94, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                          {ord.status || 'PAID'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Package size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                  <p>No recent orders found.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Language Settings */}
          {activeTab === 'language' && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                {t('selectLanguage')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <div
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>{lang.flag}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{lang.name}</span>
                      </div>
                      {isSelected && <Check size={18} color="var(--accent-primary)" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Notification Settings */}
          {activeTab === 'notifications' && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Choose which notifications you would like to receive.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { id: 'orderUpdates', label: 'Order Updates & Delivery Tracking', desc: 'Real-time SMS & email alerts when your package ships' },
                  { id: 'priceDrops', label: 'Wishlist Price Drop Alerts', desc: 'Instant notification when saved items go on sale' },
                  { id: 'promos', label: 'Promotional Deals & Flash Sales', desc: 'Exclusive VIP discount codes and weekend offers' },
                  { id: 'security', label: 'Security & Login Alerts', desc: 'Notifies you when a new device accesses your account' }
                ].map((item) => {
                  const enabled = notifications?.[item.id] !== false;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleNotificationSetting(item.id, item.label)}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>

                      {/* Switch Toggle */}
                      <div style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '9999px',
                        background: enabled ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        padding: '2px'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#fff',
                          transform: enabled ? 'translateX(20px)' : 'translateX(0)',
                          transition: 'all 0.2s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
