import React from 'react';
import { AlertTriangle, ShieldAlert, Cpu, Radio, CheckCircle, Flame } from 'lucide-react';

export default function ScenarioCard({ scenario, isActive, onTrigger }) {
  const getIcon = (tag) => {
    switch (tag?.toUpperCase()) {
      case 'FAULT-TOLERANCE':
        return AlertTriangle;
      case 'SECURITY':
        return ShieldAlert;
      case 'PERFORMANCE':
        return scenario.id === 'core-congestion' ? Cpu : Radio;
      case 'RECOVERY':
        return CheckCircle;
      default:
        return Flame;
    }
  };

  const Icon = getIcon(scenario.tag);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: isActive
          ? '1px solid #ef4444'
          : scenario.tag === 'RECOVERY'
          ? '1px solid rgba(16, 185, 129, 0.4)'
          : '1px solid var(--border-card)',
        backgroundColor: isActive ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-card)',
        boxShadow: isActive ? '0 0 25px rgba(239, 68, 68, 0.2)' : undefined,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Banner Tag */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className={`badge-tag ${scenario.tagColor || 'orange'}`}>
            <Icon size={12} />
            {scenario.tag}
          </span>
          {isActive && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span className="demo-dot animate-pulse-dot" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
              ACTIVE FAULT
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
          {scenario.title}
        </h3>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.45' }}>
          {scenario.description}
        </p>

        {/* Expected impact box */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: '#090e1a',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '18px'
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Expected Impact:
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
            {scenario.expected}
          </div>
        </div>
      </div>

      {/* Button */}
      <div>
        {scenario.tag === 'RECOVERY' ? (
          <button
            onClick={onTrigger}
            className="btn btn-restore"
            style={{ width: '100%', padding: '10px' }}
          >
            ● Restore All Nominal States
          </button>
        ) : (
          <button
            onClick={onTrigger}
            disabled={isActive}
            className={`btn ${isActive ? 'btn-secondary' : 'btn-danger'}`}
            style={{ width: '100%', padding: '10px', opacity: isActive ? 0.7 : 1 }}
          >
            {isActive ? (
              <>Fault Injected</>
            ) : (
              <>
                <AlertTriangle size={15} />
                {scenario.buttonLabel || 'Trigger Fault Scenario'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
