import React from 'react';
import { useSimulation } from '../context/SimulationContext';

export default function CurrentWindow() {
  const { windowSize, currentBase, nextSeqNum, frames, totalFrames } = useSimulation();

  const windowEnd = Math.min(totalFrames, currentBase + windowSize - 1);

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
            Current Sliding Window
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Sender transmission buffer window [F{currentBase} ... F{windowEnd}]
          </p>
        </div>

        {/* Top metrics pill group */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
          <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>WINDOW SIZE</span>
            <span style={{ fontWeight: '800', color: '#7c3aed' }}>{windowSize}</span>
          </div>
          <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>CURRENT BASE</span>
            <span style={{ fontWeight: '800', color: '#2563eb' }}>F{currentBase}</span>
          </div>
          <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>NEXT SEQUENCE</span>
            <span style={{ fontWeight: '800', color: '#0f172a' }}>F{nextSeqNum}</span>
          </div>
        </div>
      </div>

      {/* Frame Sequence Visualizer with Sliding Window Bracket */}
      <div style={{ position: 'relative', padding: '20px 10px 10px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: 'max-content' }}>
          {frames.map((frame) => {
            const isInsideWindow = frame.id >= currentBase && frame.id <= windowEnd;

            return (
              <div
                key={frame.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {/* Window indicator label on top */}
                <div style={{ height: '16px', fontSize: '0.65rem', fontWeight: '700', color: '#7c3aed' }}>
                  {isInsideWindow ? (frame.id === currentBase ? '◀ BASE' : 'WINDOW') : ''}
                </div>

                {/* Frame Box */}
                <div className={`frame-box ${frame.status}`}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>
                    F{frame.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: '700',
                      marginTop: '2px',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {frame.status}
                  </span>
                </div>

                {/* Sub-label */}
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Seq {frame.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--color-purple-light)', border: '1px solid var(--color-purple)' }} />
          <span>Active in Window</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--color-blue-light)', border: '1px solid var(--color-blue)' }} />
          <span>Sent (Unacked)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--color-green-light)', border: '1px solid var(--color-green)' }} />
          <span>Acknowledged</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--color-red-light)', border: '1px solid var(--color-red)' }} />
          <span>Lost / Dropped</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--color-orange-light)', border: '1px solid var(--color-orange)' }} />
          <span>Retransmitting</span>
        </div>
      </div>
    </div>
  );
}
