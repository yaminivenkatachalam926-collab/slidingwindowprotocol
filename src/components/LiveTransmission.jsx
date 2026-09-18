import React from 'react';
import { ArrowRight, ArrowLeft, Send, CheckCircle2, AlertOctagon, Radio } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function LiveTransmission() {
  const { frames, receiverFrames, inTransitFrame } = useSimulation();

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
            Live Transmission Channel
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time physical/data link layer frame & ACK exchange visualization
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#7c3aed', background: '#ede9fe', padding: '4px 10px', borderRadius: '9999px', fontWeight: '700' }}>
          Full-Duplex Link Model
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 1fr', gap: '20px', alignItems: 'center' }}>
        
        {/* LEFT: SENDER */}
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={16} />
              </div>
              <span style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>Sender</span>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 8px', borderRadius: '4px' }}>
              SOURCE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {frames.map((frame) => (
              <div
                key={frame.id}
                className={`frame-box ${frame.status}`}
                style={{ width: '100%', height: '56px' }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>F{frame.id}</span>
                <span style={{ fontSize: '0.58rem', fontWeight: '700' }}>{frame.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: TX & ACK CHANNELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', padding: '10px 0' }}>
          
          {/* TX Channel (Data Frames) */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: '#2563eb', marginBottom: '4px' }}>
              <span>TX CHANNEL</span>
              <span>→ → →</span>
            </div>
            
            <div
              style={{
                height: '48px',
                background: '#f8fafc',
                border: '1px dashed #94a3b8',
                borderRadius: '8px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {inTransitFrame && inTransitFrame.type === 'DATA' ? (
                <div
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: inTransitFrame.isLost ? '#fee2e2' : '#dbeafe',
                    border: `1px solid ${inTransitFrame.isLost ? '#ef4444' : '#2563eb'}`,
                    color: inTransitFrame.isLost ? '#991b1b' : '#1e40af',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    animation: 'slide-right 0.8s ease-in-out infinite'
                  }}
                >
                  {inTransitFrame.isLost ? (
                    <>
                      <AlertOctagon size={13} color="#ef4444" />
                      <span>F{inTransitFrame.id} LOST (✕)</span>
                    </>
                  ) : (
                    <>
                      <Radio size={13} color="#2563eb" />
                      <span>FRAME F{inTransitFrame.id}</span>
                    </>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Channel Idle</span>
              )}
            </div>
          </div>

          {/* ACK Channel (Feedback) */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
              <span>← ← ←</span>
              <span>ACK CHANNEL</span>
            </div>

            <div
              style={{
                height: '48px',
                background: '#f8fafc',
                border: '1px dashed #94a3b8',
                borderRadius: '8px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {inTransitFrame && inTransitFrame.type === 'ACK' ? (
                <div
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: '#dcfce7',
                    border: '1px solid #16a34a',
                    color: '#15803d',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    animation: 'slide-left 0.8s ease-in-out infinite'
                  }}
                >
                  <CheckCircle2 size={13} color="#16a34a" />
                  <span>ACK{inTransitFrame.id}</span>
                </div>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Channel Idle</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: RECEIVER */}
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} />
              </div>
              <span style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>Receiver</span>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '4px' }}>
              DESTINATION
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {receiverFrames.map((frame) => (
              <div
                key={frame.id}
                className={`frame-box ${frame.status}`}
                style={{ width: '100%', height: '56px' }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>F{frame.id}</span>
                <span style={{ fontSize: '0.58rem', fontWeight: '700' }}>{frame.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-right {
          0% { transform: translateX(-40px); opacity: 0.2; }
          50% { opacity: 1; }
          100% { transform: translateX(40px); opacity: 0.2; }
        }
        @keyframes slide-left {
          0% { transform: translateX(40px); opacity: 0.2; }
          50% { opacity: 1; }
          100% { transform: translateX(-40px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
