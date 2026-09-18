import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Activity,
  CheckCircle,
  AlertTriangle,
  Send,
  Zap,
  CheckCircle2
} from 'lucide-react';
import Header from '../components/Header';
import CurrentWindow from '../components/CurrentWindow';
import LiveTransmission from '../components/LiveTransmission';
import { useSimulation } from '../context/SimulationContext';

export default function Simulator() {
  const {
    totalFrames,
    setTotalFrames,
    windowSize,
    setWindowSize,
    lossProbability,
    setLossProbability,
    transmissionDelay,
    setTransmissionDelay,
    status,
    currentBase,
    nextSeqNum,
    metrics,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    applyPreset
  } = useSimulation();

  const isRunning = status === 'RUNNING';
  const isPaused = status === 'PAUSED';
  const isCompleted = status === 'COMPLETED';
  const isIdle = status === 'IDLE';

  const windowEnd = Math.min(totalFrames, currentBase + windowSize - 1);

  return (
    <div>
      <Header
        title="Sliding Window Flow Control Simulator"
        subtitle="Reliable Data Transmission using Go-Back-N ARQ"
      />

      <div className="page-wrapper">
        
        {/* Top Control Split: Configuration & Status Cards */}
        <div className="grid-2" style={{ marginBottom: '24px', alignItems: 'stretch' }}>
          
          {/* Card 1: Simulation Configuration */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} style={{ color: 'var(--color-purple)' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    Simulation Configuration
                  </h3>
                </div>
                
                {/* Demo Presets */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => applyPreset('PERFECT')} className="btn btn-preset" title="0% Loss, 600ms">
                    Perfect Net
                  </button>
                  <button onClick={() => applyPreset('LOW_LOSS')} className="btn btn-preset" title="10% Loss, 800ms">
                    Low Loss
                  </button>
                  <button onClick={() => applyPreset('HIGH_LOSS')} className="btn btn-preset" title="40% Loss, 1000ms">
                    High Loss
                  </button>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid-2" style={{ gap: '14px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">TOTAL FRAMES</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={totalFrames}
                    onChange={(e) => setTotalFrames(Number(e.target.value))}
                    disabled={isRunning}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">WINDOW SIZE (N)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={windowSize}
                    onChange={(e) => setWindowSize(Number(e.target.value))}
                    disabled={isRunning}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">FRAME LOSS PROBABILITY (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={lossProbability}
                    onChange={(e) => setLossProbability(Number(e.target.value))}
                    disabled={isRunning}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">TRANSMISSION DELAY (MS)</label>
                  <input
                    type="number"
                    min="200"
                    max="3000"
                    step="100"
                    value={transmissionDelay}
                    onChange={(e) => setTransmissionDelay(Number(e.target.value))}
                    disabled={isRunning}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              {isPaused ? (
                <button onClick={resumeSimulation} className="btn btn-primary" style={{ flex: 1 }}>
                  <Play size={16} /> Resume
                </button>
              ) : (
                <button
                  onClick={startSimulation}
                  disabled={isRunning}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Play size={16} /> {isCompleted ? 'Restart Simulation' : 'Start Simulation'}
                </button>
              )}

              <button
                onClick={pauseSimulation}
                disabled={!isRunning}
                className="btn btn-pause"
              >
                <Pause size={16} /> Pause
              </button>

              <button
                onClick={resetSimulation}
                className="btn btn-secondary"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Card 2: Simulation Status */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} style={{ color: '#2563eb' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    Simulation Status
                  </h3>
                </div>
                
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    color: isRunning ? '#16a34a' : isPaused ? '#d97706' : isCompleted ? '#7c3aed' : '#64748b'
                  }}
                >
                  ● {status}
                </span>
              </div>

              {/* Status Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.82rem' }}>
                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>CURRENT BASE</span>
                  <span style={{ fontWeight: '800', color: '#7c3aed' }}>F{currentBase}</span>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>ACTIVE WINDOW</span>
                  <span style={{ fontWeight: '800', color: '#2563eb' }}>[F{currentBase} .. F{windowEnd}]</span>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>FRAMES SENT</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>{metrics.framesTransmitted}</span>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>ACKS RECEIVED</span>
                  <span style={{ fontWeight: '800', color: '#16a34a' }}>{metrics.acksReceived}</span>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>LOST FRAMES</span>
                  <span style={{ fontWeight: '800', color: '#dc2626' }}>{metrics.lostFrames}</span>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', fontWeight: '700' }}>RETRANSMISSIONS</span>
                  <span style={{ fontWeight: '800', color: '#d97706' }}>{metrics.retransmissions}</span>
                </div>
              </div>
            </div>

            {/* Completion Banner */}
            {isCompleted && (
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d' }}>
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>Simulation Completed Successfully!</div>
                  <div style={{ fontSize: '0.75rem', color: '#166534' }}>All {totalFrames} frames delivered with {metrics.retransmissions} retransmissions.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Current Sliding Window Visualizer */}
        <CurrentWindow />

        {/* Card 4: Live Transmission Channel */}
        <LiveTransmission />

      </div>
    </div>
  );
}
