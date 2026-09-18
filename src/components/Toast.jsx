import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';

export default function Toast() {
  const { toasts, removeToast } = useNetwork();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === "success") Icon = CheckCircle2;
        if (toast.type === "warning") Icon = AlertTriangle;
        if (toast.type === "danger") Icon = AlertCircle;

        return (
          <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ lineHeight: 1.4 }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
