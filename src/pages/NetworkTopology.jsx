import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Plus,
  Link as LinkIcon,
  Info,
  X,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Scissors
} from 'lucide-react';
import Header from '../components/Header';
import NetworkNode from '../components/NetworkNode';
import NetworkLink from '../components/NetworkLink';
import DeviceModal from '../components/DeviceModal';
import StatusBadge from '../components/StatusBadge';
import { useNetwork } from '../context/NetworkContext';

export default function NetworkTopology() {
  const navigate = useNavigate();
  const { devices, links, toggleLinkStatus, settings, addToast } = useNetwork();

  const [selectedDevice, setSelectedDevice] = useState(devices[0] || null);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [newLinkFrom, setNewLinkFrom] = useState(devices[0]?.id || "");
  const [newLinkTo, setNewLinkTo] = useState(devices[1]?.id || "");
  const [newLinkSpeed, setNewLinkSpeed] = useState("1 Gbps");

  const handleRefresh = () => {
    addToast("Topology canvas layout refreshed and synchronized", "info");
  };

  const handleConnectLink = (e) => {
    e.preventDefault();
    if (newLinkFrom === newLinkTo) {
      addToast("Cannot connect a device to itself", "warning");
      return;
    }
    addToast(`Connected link between ${newLinkFrom} and ${newLinkTo} (${newLinkSpeed})`, "success");
    setConnectModalOpen(false);
  };

  return (
    <div>
      <Header
        title="Multi-Area Campus Network Topology Canvas"
        subtitle="Interactive campus network showing LAN, MAN and WAN connections"
      />

      <div className="page-wrapper">
        {/* Top Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>LEGEND:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#00d2ff', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-main)' }}>LAN Link (100M / 1G)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '4px', backgroundColor: '#c084fc', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-main)' }}>MAN 10G Optical Fiber</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#fb923c', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-main)' }}>WAN ISP Link</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleRefresh} className="btn btn-secondary">
              <RefreshCw size={15} />
              Refresh
            </button>
            <button onClick={() => setConnectModalOpen(true)} className="btn btn-secondary">
              <LinkIcon size={15} />
              Connect Link
            </button>
            <button onClick={() => setIsDeviceModalOpen(true)} className="btn btn-primary">
              <Plus size={16} />
              + Add Device
            </button>
          </div>
        </div>

        {/* Main Canvas & Detail Panel Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedDevice ? '1fr 340px' : '1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Topology Interactive SVG / DOM Canvas */}
          <div
            className="card"
            style={{
              padding: '0',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#070b14',
              border: '1px solid rgba(0, 210, 255, 0.2)',
              minHeight: '600px'
            }}
          >
            {/* Area Zone Background Enclosures */}
            <div
              style={{
                position: 'relative',
                width: '950px',
                height: '560px',
                margin: '0 auto',
                transformOrigin: 'top left'
              }}
            >
              {/* AREA 1: CSE Dept LAN */}
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '40px',
                  width: '330px',
                  height: '220px',
                  backgroundColor: 'rgba(0, 210, 255, 0.03)',
                  border: '1px dashed rgba(0, 210, 255, 0.25)',
                  borderRadius: '12px',
                  padding: '10px'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                  AREA 1: LAN • CSE DEPARTMENT
                </div>
                <div className="font-mono" style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  192.168.10.0/24
                </div>
              </div>

              {/* AREA 2: ECE Dept LAN */}
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '280px',
                  width: '330px',
                  height: '220px',
                  backgroundColor: 'rgba(0, 210, 255, 0.03)',
                  border: '1px dashed rgba(0, 210, 255, 0.25)',
                  borderRadius: '12px',
                  padding: '10px'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                  AREA 2: LAN • ECE DEPARTMENT
                </div>
                <div className="font-mono" style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  192.168.20.0/24
                </div>
              </div>

              {/* AREA 3: Campus Core MAN */}
              <div
                style={{
                  position: 'absolute',
                  left: '375px',
                  top: '110px',
                  width: '270px',
                  height: '340px',
                  backgroundColor: 'rgba(168, 85, 247, 0.03)',
                  border: '1px dashed rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  padding: '10px'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#c084fc', letterSpacing: '0.05em' }}>
                  AREA 3: MAN • CAMPUS CORE
                </div>
                <div className="font-mono" style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  10.0.0.0/16 Backbone
                </div>
              </div>

              {/* CAMPUS DATA CENTER */}
              <div
                style={{
                  position: 'absolute',
                  left: '665px',
                  top: '70px',
                  width: '250px',
                  height: '210px',
                  backgroundColor: 'rgba(0, 210, 255, 0.03)',
                  border: '1px dashed rgba(0, 210, 255, 0.25)',
                  borderRadius: '12px',
                  padding: '10px'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                  CAMPUS DATA CENTER
                </div>
                <div className="font-mono" style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  172.16.0.0/24 (Servers & DNS)
                </div>
              </div>

              {/* WAN GATEWAY & CLOUD */}
              <div
                style={{
                  position: 'absolute',
                  left: '665px',
                  top: '300px',
                  width: '250px',
                  height: '160px',
                  backgroundColor: 'rgba(249, 115, 22, 0.03)',
                  border: '1px dashed rgba(249, 115, 22, 0.3)',
                  borderRadius: '12px',
                  padding: '10px'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fb923c', letterSpacing: '0.05em' }}>
                  WAN GATEWAY & CLOUD
                </div>
                <div className="font-mono" style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                  203.0.113.0/24 (Global ISP)
                </div>
              </div>

              {/* SVG Link Layer */}
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
              >
                {links.map((link) => {
                  const fromNode = devices.find((d) => d.id === link.from);
                  const toNode = devices.find((d) => d.id === link.to);
                  return (
                    <NetworkLink
                      key={link.id}
                      link={link}
                      fromNode={fromNode}
                      toNode={toNode}
                      showBandwidth={settings.showLinkBandwidth}
                    />
                  );
                })}
              </svg>

              {/* Interactive Device Nodes */}
              {devices.map((device) => (
                <NetworkNode
                  key={device.id}
                  device={device}
                  isSelected={selectedDevice?.id === device.id}
                  onClick={() => setSelectedDevice(device)}
                  showIP={settings.showIPAddresses}
                  showLabels={settings.showDeviceLabels}
                />
              ))}
            </div>
          </div>

          {/* Node Detail Inspection Panel */}
          {selectedDevice && (
            <div className="card" style={{ animation: 'modal-fade 0.2s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>Device Inspector</h3>
                </div>
                <button
                  onClick={() => setSelectedDevice(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Top Details */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                    {selectedDevice.id}
                  </span>
                  <StatusBadge status={selectedDevice.status} size="sm" />
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  {selectedDevice.hostname}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedDevice.subArea || selectedDevice.area}
                </div>
              </div>

              {/* Spec Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090e1a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>IPv4 Address</span>
                  <span className="font-mono text-cyan">{selectedDevice.ip}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090e1a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subnet Mask</span>
                  <span className="font-mono" style={{ color: 'var(--text-main)' }}>{selectedDevice.subnet}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090e1a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gateway</span>
                  <span className="font-mono" style={{ color: 'var(--text-main)' }}>{selectedDevice.gateway}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090e1a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Device Type</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>{selectedDevice.type}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090e1a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Network Area</span>
                  <StatusBadge text={selectedDevice.area} size="sm" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090e1a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Location</span>
                  <span style={{ color: 'var(--text-main)' }}>{selectedDevice.location}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#090e1a', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>MAC Address</span>
                  <span className="font-mono" style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{selectedDevice.mac}</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => navigate('/packet-simulator', { state: { defaultSource: selectedDevice.hostname } })}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Send size={15} />
                Simulate Packet From Node
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Device Modal */}
      <DeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />

      {/* Connect Link Modal */}
      {connectModalOpen && (
        <div className="modal-overlay" onClick={() => setConnectModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Connect Network Link</h3>
              <button onClick={() => setConnectModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConnectLink}>
              <div className="form-group">
                <label className="form-label">Source Node</label>
                <select value={newLinkFrom} onChange={(e) => setNewLinkFrom(e.target.value)} className="form-select">
                  {devices.map(d => <option key={d.id} value={d.id}>{d.hostname} ({d.ip})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Destination Node</label>
                <select value={newLinkTo} onChange={(e) => setNewLinkTo(e.target.value)} className="form-select">
                  {devices.map(d => <option key={d.id} value={d.id}>{d.hostname} ({d.ip})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Link Bandwidth Speed</label>
                <select value={newLinkSpeed} onChange={(e) => setNewLinkSpeed(e.target.value)} className="form-select">
                  <option value="100 Mbps">100 Mbps (FastEthernet)</option>
                  <option value="1 Gbps">1 Gbps (GigabitEthernet)</option>
                  <option value="10 Gbps">10 Gbps (TenGigabit Fiber)</option>
                  <option value="1.5 Mbps">1.5 Mbps (WAN T1 / ISP)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setConnectModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Establish Connection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
