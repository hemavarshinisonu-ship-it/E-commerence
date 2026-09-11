import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="#22c55e" />}
          {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
          {toast.type === 'info' && <Info size={18} color="#6366f1" />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} style={{ color: 'var(--text-muted)' }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
