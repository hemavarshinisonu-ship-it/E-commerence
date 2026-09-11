import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GoogleModal from '../components/GoogleModal';
import { Sparkles, Lock, Mail, User, ArrowRight } from 'lucide-react';

const SignupPage = ({ setCurrentPage }) => {
  const { signup, googleLogin, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await signup({ name: name || 'Demo User', email, password: password || 'password123' });
      setCurrentPage('home');
    } catch (err) {
      // Handled in context toast
    }
  };

  const handleSelectGoogleAccount = async (account) => {
    setIsGoogleModalOpen(false);
    try {
      await googleLogin({ name: account.name, email: account.email });
      setCurrentPage('home');
    } catch (err) {
      // Handled in context toast
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '10px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '9999px', marginBottom: '0.75rem' }}>
            <Sparkles size={28} color="var(--accent-primary)" />
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join LUXE Store for fast checkout, saved wishlists & exclusive offers.</p>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            transition: 'var(--transition-fast)',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR EMAIL</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter any email address..."
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth-submit"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'underline' }}
          >
            Sign in here
          </button>
        </div>
      </div>

      {/* Google Account Selector Popup */}
      <GoogleModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleSelectGoogleAccount}
      />
    </div>
  );
};

export default SignupPage;
