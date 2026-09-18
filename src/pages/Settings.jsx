import React from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Eye,
  Info,
  CheckCircle,
  Shield,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import Header from '../components/Header';
import { useNetwork } from '../context/NetworkContext';

export default function Settings() {
  const { settings, setSettings, addToast, restoreNominal } = useNetwork();

  const handleToggle = (key) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      addToast(`Setting updated: ${key} is now ${updated[key] ? 'Enabled' : 'Disabled'}`, 'info');
      return updated;
    });
  };

  const handleSpeedChange = (val) => {
    setSettings(prev => ({ ...prev, animationSpeed: val }));
    addToast(`Animation speed set to ${val}`, 'info');
  };

  return (
    <div>
      <Header
        title="Settings & Simulation Controls"
        subtitle="Frontend simulation parameters, rendering toggles and demo environment options"
      />

      <div className="page-wrapper">
        <div className="grid-2" style={{ gap: '24px', alignItems: 'start' }}>
          
          {/* Left Column: Simulation & Topology Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Simulation Settings */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>Simulation Parameters</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Default Packet Payload Size</span>
                    <span className="font-mono text-cyan" style={{ fontSize: '0.82rem', fontWeight: '700' }}>
                      {settings.defaultPacketSize} bytes
                    </span>
                  </div>
                  <input
                    type="range"
                    min="64"
                    max="1500"
                    step="64"
                    value={settings.defaultPacketSize}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultPacketSize: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    Packet Animation Speed
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {['Slow (0.5x)', 'Normal (1x)', 'Fast (2x)'].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`btn ${settings.animationSpeed === speed ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '8px', fontSize: '0.78rem' }}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>Real-Time Telemetry Jitter</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Simulate subtle metric fluctuations in monitoring charts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoRefresh}
                    onChange={() => handleToggle('autoRefresh')}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            {/* Topology Rendering Toggles */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Eye size={18} style={{ color: '#a855f7' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>Topology Canvas Toggles</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>Display IPv4 Badges</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Show IP subnet labels beneath network node icons</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showIPAddresses}
                    onChange={() => handleToggle('showIPAddresses')}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>Display Link Bandwidths</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Show 100M / 1G / 10G capacity tags on SVG links</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showLinkBandwidth}
                    onChange={() => handleToggle('showLinkBandwidth')}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>Animated Flow Dashlines</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Render flowing packets across online links</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showPacketAnimation}
                    onChange={() => handleToggle('showPacketAnimation')}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>Show Device Hostnames</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Display host labels on canvas nodes</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showDeviceLabels}
                    onChange={() => handleToggle('showDeviceLabels')}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Demo Information & Architecture */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Demo Architecture Info */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Info size={18} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>Demo Environment Information</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
                <div style={{ padding: '10px 12px', background: '#090e1a', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>PROJECT TITLE</div>
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>Campus NetSim</div>
                  <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>LAN • MAN • WAN Network Simulation & Monitoring</div>
                </div>

                <div style={{ padding: '10px 12px', background: '#090e1a', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ARCHITECTURE MODE</div>
                  <div style={{ fontWeight: '700', color: '#34d399' }}>Pure Frontend-Only Simulation</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Zero Backend • Zero External APIs • 100% Client-Side State</div>
                </div>

                <div style={{ padding: '10px 12px', background: '#090e1a', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>APPLICATION VERSION</div>
                  <div className="font-mono" style={{ fontWeight: '700', color: '#c084fc' }}>v1.0.0 (Demo Release)</div>
                </div>

                <div style={{ padding: '10px 12px', background: '#090e1a', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>PRESENTATION READY</div>
                  <div style={{ color: 'var(--text-main)' }}>College Mini Project • Computer Networks Laboratory Demo</div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button onClick={restoreNominal} className="btn btn-secondary" style={{ width: '100%' }}>
                  <RotateCcw size={15} />
                  Reset All Simulation Data to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
