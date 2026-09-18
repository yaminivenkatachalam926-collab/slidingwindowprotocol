import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Sliders,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  PlaySquare,
  BarChart2,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { useSimulation } from '../context/SimulationContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    totalFrames,
    windowSize,
    currentBase,
    metrics,
    status,
    eventLog,
    startSimulation
  } = useSimulation();

  const windowEnd = Math.min(totalFrames, currentBase + windowSize - 1);
  const currentWindowStr = status === 'IDLE' ? '—' : `[F${currentBase}..F${windowEnd}]`;

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Overview of the current simulation state"
      />

      <div className="page-wrapper">
        {/* Top 6 Statistics Cards */}
        <div className="grid-6" style={{ marginBottom: '28px' }}>
          <StatCard
            title="TOTAL FRAMES"
            value={totalFrames}
            subtitle="Configured sequence size"
            icon={Layers}
            accent="purple"
          />
          <StatCard
            title="CURRENT WINDOW"
            value={currentWindowStr}
            subtitle={`Size: ${windowSize} frames`}
            icon={Sliders}
            accent="purple"
          />
          <StatCard
            title="FRAMES TRANSMITTED"
            value={metrics.framesTransmitted}
            subtitle="Cumulative sent frames"
            icon={Send}
            accent="blue"
          />
          <StatCard
            title="ACKS RECEIVED"
            value={metrics.acksReceived}
            subtitle="Successful delivery"
            icon={CheckCircle2}
            accent="green"
          />
          <StatCard
            title="LOST FRAMES"
            value={metrics.lostFrames}
            subtitle="Dropped in transmission"
            icon={AlertTriangle}
            accent="red"
          />
          <StatCard
            title="RETRANSMISSIONS"
            value={metrics.retransmissions}
            subtitle="Go-Back-N rewinds"
            icon={RotateCcw}
            accent="orange"
          />
        </div>

        {/* Middle Section: Protocol Overview Banner & Quick Controls */}
        <div className="grid-3" style={{ marginBottom: '28px' }}>
          
          {/* Card 1: Protocol Architecture */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                  Sliding Window Protocol — Go-Back-N ARQ
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Automatic Repeat reQuest error-control mechanism for reliable transport
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', background: '#ede9fe', padding: '4px 10px', borderRadius: '9999px' }}>
                Flow Control
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '18px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>SENDER BUFFER</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>N = {windowSize} Frames</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Can transmit up to N unacked frames</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>RECEIVER BUFFER</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#16a34a', marginTop: '2px' }}>1 Frame (In-Order)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Discards out-of-order arrivals</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>ERROR RECOVERY</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ea580c', marginTop: '2px' }}>Timeout Go-Back-N</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Rewinds & retransmits from Base</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  startSimulation();
                  navigate('/simulator');
                }}
                className="btn btn-primary"
              >
                <PlaySquare size={16} />
                Launch Live Simulator
              </button>
              <button
                onClick={() => navigate('/statistics')}
                className="btn btn-secondary"
              >
                <BarChart2 size={16} />
                View Detailed Statistics
              </button>
            </div>
          </div>

          {/* Card 2: Quick Launch & Simulation State */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
              Simulation Engine State
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Protocol State</span>
                <span style={{ fontWeight: '700', color: status === 'RUNNING' ? '#16a34a' : '#7c3aed' }}>{status}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Window Base (Expected)</span>
                <span style={{ fontWeight: '700' }}>F{currentBase}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Efficiency Estimate</span>
                <span style={{ fontWeight: '700', color: '#2563eb' }}>
                  {metrics.framesTransmitted > 0 ? Math.round((metrics.acksReceived / metrics.framesTransmitted) * 100) : 100}%
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mode</span>
                <span style={{ fontWeight: '700', color: '#4c1d95' }}>Pure Client-Side React</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Event Log Stream */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                Recent Event Activity Stream
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Live chronological transmission log from sender and receiver channels
              </p>
            </div>
            <button
              onClick={() => navigate('/event-log')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              View Full Log <ArrowRight size={14} />
            </button>
          </div>

          {eventLog.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No transmission events yet. Click "Launch Live Simulator" to begin the simulation.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {eventLog.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${
                      log.status === 'LOST'
                        ? '#ef4444'
                        : log.status === 'ACK'
                        ? '#10b981'
                        : log.status === 'TIMEOUT' || log.status === 'RETRANSMIT'
                        ? '#f59e0b'
                        : '#7c3aed'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {log.time}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                      {log.event}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {log.details}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: log.status === 'LOST' ? '#fee2e2' : log.status === 'ACK' ? '#dcfce7' : '#ede9fe',
                      color: log.status === 'LOST' ? '#991b1b' : log.status === 'ACK' ? '#15803d' : '#5b21b6'
                    }}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
