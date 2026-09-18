import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'purple'
}) {
  const accents = {
    purple: {
      bg: '#f5f3ff',
      border: '#ddd6fe',
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
      numColor: '#4c1d95'
    },
    blue: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      numColor: '#1e40af'
    },
    green: {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      numColor: '#15803d'
    },
    red: {
      bg: '#fef2f2',
      border: '#fecaca',
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      numColor: '#b91c1c'
    },
    orange: {
      bg: '#fffbeb',
      border: '#fde68a',
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      numColor: '#b45309'
    }
  };

  const current = accents[accent] || accents.purple;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${current.iconColor}`,
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: current.iconBg,
              color: current.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: '1.85rem',
            fontWeight: '800',
            color: current.numColor,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
