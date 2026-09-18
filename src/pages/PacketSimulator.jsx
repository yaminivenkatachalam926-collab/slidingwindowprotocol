import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Layers,
  Clock,
  HardDrive,
  Shield,
  Activity,
  Zap,
  Play
} from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { useNetwork } from '../context/NetworkContext';

export default function PacketSimulator() {
  const location = useLocation();
  const defaultSourceProp = location.state?.defaultSource;

  const { devices, links, recordPacketTransmission, activeScenarios, addToast } = useNetwork();

  const [sourceNode, setSourceNode] = useState(defaultSourceProp || "CSE-PC-01");
  const [destNode, setDestNode] = useState("Campus-Web-Portal");
  const [packetType, setPacketType] = useState("TCP");
  const [packetSize, setPacketSize] = useState(1024);
  const [simDelay, setSimDelay] = useState(50);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentHopIndex, setCurrentHopIndex] = useState(-1);
  const [simStatus, setSimStatus] = useState("Idle"); // Idle | In-Transit | Delivered | Dropped
  const [currentPath, setCurrentPath] = useState([]);
  const [simMetrics, setSimMetrics] = useState({
    latency: 0,
    hops: 0,
    packetSize: 1024,
    status: "Idle"
  });

  // Calculate realistic shortest path between source & dest
  const computePath = (srcName, dstName) => {
    // Standard campus topology paths
    if (srcName.startsWith("CSE") && dstName.startsWith("Campus-Web-Portal")) {
      return [
        { name: "CSE-PC-01", ip: "192.168.10.21", type: "Workstation" },
        { name: "CSE-Switch-Access", ip: "192.168.10.10", type: "Switch" },
        { name: "CSE-Gateway-Router", ip: "192.168.10.254", type: "Router" },
        { name: "North-Campus-Core", ip: "10.0.0.1", type: "Router" },
        { name: "Campus-Aggregation-Switch", ip: "10.0.0.10", type: "Switch" },
        { name: "DataCenter-Switch", ip: "172.16.0.10", type: "Switch" },
        { name: "Campus-Web-Portal", ip: "172.16.0.25", type: "Server" }
      ];
    } else if (srcName.startsWith("ECE") && dstName.startsWith("Campus-Web-Portal")) {
      return [
        { name: "ECE-Workstation-01", ip: "192.168.20.21", type: "Workstation" },
        { name: "ECE-Switch-Access", ip: "192.168.20.10", type: "Switch" },
        { name: "ECE-Gateway-Router", ip: "192.168.20.254", type: "Router" },
        { name: "South-Campus-Core", ip: "10.0.0.2", type: "Router" },
        { name: "Campus-Aggregation-Switch", ip: "10.0.0.10", type: "Switch" },
        { name: "DataCenter-Switch", ip: "172.16.0.10", type: "Switch" },
        { name: "Campus-Web-Portal", ip: "172.16.0.25", type: "Server" }
      ];
    } else if (dstName.includes("Cloud") || dstName.includes("Edge")) {
      return [
        { name: srcName, ip: "192.168.10.21", type: "Workstation" },
        { name: "CSE-Switch-Access", ip: "192.168.10.10", type: "Switch" },
        { name: "CSE-Gateway-Router", ip: "192.168.10.254", type: "Router" },
        { name: "North-Campus-Core", ip: "10.0.0.1", type: "Router" },
        { name: "Campus-Aggregation-Switch", ip: "10.0.0.10", type: "Switch" },
        { name: "Campus-Edge-Router", ip: "203.0.113.1", type: "Router" },
        { name: "External-Cloud-Host", ip: "203.0.113.100", type: "Cloud Host" }
      ];
    } else {
      // Generic fallback path
      return [
        { name: srcName, ip: "192.168.10.21", type: "Source" },
        { name: "Campus-Switch-Access", ip: "192.168.10.1", type: "Switch" },
        { name: "North-Campus-Core", ip: "10.0.0.1", type: "Router" },
        { name: dstName, ip: "172.16.0.25", type: "Destination" }
      ];
    }
  };

  const handleSendPacket = () => {
    if (isSimulating) return;

    if (sourceNode === destNode) {
      addToast("Source and destination cannot be identical", "warning");
      return;
    }

    const path = computePath(sourceNode, destNode);
    setCurrentPath(path);
    setIsSimulating(true);
    setCurrentHopIndex(0);
    setSimStatus("In-Transit");

    // Check if WAN or Core link is broken in active scenarios
    const isFiberCut = activeScenarios.includes("fiber-cut");
    const isWanDegraded = activeScenarios.includes("wan-degradation");
    const isDDoS = activeScenarios.includes("ddos-attack");

    const calculatedLatency = isFiberCut ? 74 : isWanDegraded ? 180 : isDDoS ? 138 : 42;

    let hop = 0;
    const interval = setInterval(() => {
      hop += 1;
      if (hop < path.length) {
        setCurrentHopIndex(hop);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setSimStatus("Delivered");
        setSimMetrics({
          latency: calculatedLatency,
          hops: path.length - 1,
          packetSize: packetSize,
          status: "Delivered"
        });
        recordPacketTransmission(true, packetSize);
        addToast(`Packet ${packetType} successfully delivered to ${destNode} (RTT: ${calculatedLatency}ms)`, "success");
      }
    }, Math.max(200, simDelay * 8));
  };

  const handleReset = () => {
    setIsSimulating(false);
    setCurrentHopIndex(-1);
    setSimStatus("Idle");
    setCurrentPath([]);
    setSimMetrics({ latency: 0, hops: 0, packetSize: 1024, status: "Idle" });
  };

  return (
    <div>
      <Header
        title="Packet Simulator"
        subtitle="Simulate packet transmission across the campus network."
      />

      <div className="page-wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Column: Transmission Parameter Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={18} style={{ color: 'var(--accent-cyan)' }} />
              Packet Configuration
            </h3>

            {/* Source */}
            <div className="form-group">
              <label className="form-label">SOURCE NODE:</label>
              <select
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
                className="form-select font-mono"
                disabled={isSimulating}
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.hostname}>
                    {d.hostname} ({d.ip})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div className="form-group">
              <label className="form-label">DESTINATION NODE:</label>
              <select
                value={destNode}
                onChange={(e) => setDestNode(e.target.value)}
                className="form-select font-mono"
                disabled={isSimulating}
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.hostname}>
                    {d.hostname} ({d.ip})
                  </option>
                ))}
              </select>
            </div>

            {/* Packet Protocol Type */}
            <div className="form-group">
              <label className="form-label">PACKET TYPE / PROTOCOL:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {['TCP', 'UDP', 'ICMP'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPacketType(type)}
                    className={`btn ${packetType === type ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px', fontSize: '0.8rem' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Packet Size */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>PACKET SIZE:</label>
                <span className="font-mono text-cyan" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                  {packetSize} bytes
                </span>
              </div>
              <input
                type="range"
                min="64"
                max="1500"
                step="64"
                value={packetSize}
                onChange={(e) => setPacketSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                disabled={isSimulating}
              />
            </div>

            {/* Simulated Delay */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>HOP DELAY:</label>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {simDelay} ms
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="10"
                value={simDelay}
                onChange={(e) => setSimDelay(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#a855f7' }}
                disabled={isSimulating}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleSendPacket}
                disabled={isSimulating}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Play size={16} />
                {isSimulating ? 'Transmitting...' : 'Send Packet'}
              </button>
              <button
                onClick={handleReset}
                disabled={isSimulating}
                className="btn btn-secondary"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Right Column: Visual Path & Real-Time Hop Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Status Header Metrics */}
            <div className="grid-4">
              <div className="card" style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>PACKET STATUS</span>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={simStatus} />
                </div>
              </div>

              <div className="card" style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>LATENCY</span>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                  {simMetrics.latency > 0 ? `${simMetrics.latency} ms` : '—'}
                </div>
              </div>

              <div className="card" style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>HOPS</span>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
                  {simMetrics.hops > 0 ? simMetrics.hops : (currentPath.length > 0 ? currentPath.length - 1 : 6)}
                </div>
              </div>

              <div className="card" style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>PACKET SIZE</span>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#c084fc', marginTop: '2px' }}>
                  {packetSize} bytes
                </div>
              </div>
            </div>

            {/* Visual Hop-by-Hop Pipeline Canvas */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                  Hop-by-Hop Network Transmission Path
                </h3>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  OSPF SPF Path Resolution
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '10px 0' }}>
                {(currentPath.length > 0 ? currentPath : computePath(sourceNode, destNode)).map((node, index, arr) => {
                  const isActiveHop = currentHopIndex === index;
                  const isPassed = currentHopIndex > index;
                  const isLast = index === arr.length - 1;

                  return (
                    <React.Fragment key={index}>
                      {/* Node Box */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 18px',
                          borderRadius: '10px',
                          background: isActiveHop
                            ? 'rgba(0, 210, 255, 0.15)'
                            : isPassed
                            ? 'rgba(16, 185, 129, 0.08)'
                            : '#090e1a',
                          border: `1px solid ${
                            isActiveHop
                              ? '#00d2ff'
                              : isPassed
                              ? 'rgba(16, 185, 129, 0.4)'
                              : 'rgba(255, 255, 255, 0.06)'
                          }`,
                          boxShadow: isActiveHop ? '0 0 15px rgba(0, 210, 255, 0.3)' : undefined,
                          transition: 'all 0.25s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          {/* Hop Number Circle */}
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              backgroundColor: isActiveHop ? '#00d2ff' : isPassed ? '#10b981' : '#1e293b',
                              color: isActiveHop || isPassed ? '#000' : 'var(--text-muted)'
                            }}
                          >
                            {index === 0 ? 'S' : isLast ? 'D' : index}
                          </div>

                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: isActiveHop ? '#00d2ff' : '#fff' }}>
                              {node.name}
                            </div>
                            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              IPv4: {node.ip} • Type: {node.type}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isActiveHop ? (
                            <span className="badge-tag cyan animate-pulse-dot">
                              Processing Packet
                            </span>
                          ) : isPassed ? (
                            <span className="badge-tag" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
                              Forwarded
                            </span>
                          ) : (
                            <span className="badge-tag" style={{ color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.04)' }}>
                              Queued
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Connector Arrow */}
                      {!isLast && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                          <ArrowDown
                            size={18}
                            style={{
                              color: isPassed || isActiveHop ? '#00d2ff' : 'rgba(255, 255, 255, 0.15)',
                              transition: 'color 0.2s ease'
                            }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Protocol Packet Frame Dissection */}
            <div className="card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                Simulated {packetType} Packet Dissection (L2 - L4 Breakdown)
              </h4>
              <div className="grid-3" style={{ fontSize: '0.75rem' }}>
                <div style={{ padding: '10px', background: '#090e1a', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '4px' }}>L2: ETHERNET II</div>
                  <div className="font-mono text-dim">Dst MAC: 00:1A:2B:DC:25:25</div>
                  <div className="font-mono text-dim">Src MAC: 00:1A:2B:3C:4D:01</div>
                  <div className="font-mono text-dim">EtherType: 0x0800 (IPv4)</div>
                </div>

                <div style={{ padding: '10px', background: '#090e1a', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ color: '#c084fc', fontWeight: '700', marginBottom: '4px' }}>L3: IPv4 HEADER</div>
                  <div className="font-mono text-dim">TTL: 64 • Header Length: 20B</div>
                  <div className="font-mono text-dim">Proto: {packetType === 'TCP' ? '6 (TCP)' : packetType === 'UDP' ? '17 (UDP)' : '1 (ICMP)'}</div>
                  <div className="font-mono text-dim">Checksum: 0x4f12 [Valid]</div>
                </div>

                <div style={{ padding: '10px', background: '#090e1a', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ color: '#34d399', fontWeight: '700', marginBottom: '4px' }}>L4: {packetType} PAYLOAD</div>
                  <div className="font-mono text-dim">Src Port: 54182 → Dst Port: 80</div>
                  <div className="font-mono text-dim">Seq: 1042918 • Ack: 0</div>
                  <div className="font-mono text-dim">Payload: {packetSize - 40} bytes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
