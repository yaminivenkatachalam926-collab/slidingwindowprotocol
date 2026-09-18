import React, { useState } from 'react';
import {
  GitFork,
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  Share2,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { useNetwork } from '../context/NetworkContext';

export default function RoutingProtocols() {
  const { routingTable, addToast } = useNetwork();

  const [isCalculatingSpf, setIsCalculatingSpf] = useState(false);
  const [spfResult, setSpfResult] = useState(null);
  const [activeProtocolTab, setActiveProtocolTab] = useState("ALL");

  const filteredRoutes = routingTable.filter((r) => {
    if (activeProtocolTab === "ALL") return true;
    return r.protocol.toUpperCase() === activeProtocolTab;
  });

  const handleRunSpf = () => {
    setIsCalculatingSpf(true);
    setSpfResult(null);

    addToast("Executing Dijkstra Shortest Path First (SPF) algorithm...", "info");

    setTimeout(() => {
      setIsCalculatingSpf(false);
      setSpfResult({
        rootNode: "North-Campus-Core (10.0.0.1)",
        executionTime: "1.18 ms",
        vertices: 15,
        edges: 16,
        optimalTree: [
          { dest: "CSE-Gateway-Router", via: "gi0/0", cost: 10, nextHop: "Direct" },
          { dest: "DataCenter-Switch", via: "ten0/1", cost: 15, nextHop: "Campus-Aggregation-Switch" },
          { dest: "South-Campus-Core", via: "ten0/2", cost: 10, nextHop: "Direct (10G Fiber)" },
          { dest: "Campus-Web-Portal", via: "ten0/1", cost: 25, nextHop: "DataCenter-Switch" },
          { dest: "External-Cloud-Host", via: "ten0/2", cost: 35, nextHop: "Campus-Edge-Router" }
        ]
      });
      addToast("Shortest path calculated successfully.", "success");
    }, 1200);
  };

  return (
    <div>
      <Header
        title="Routing Protocols"
        subtitle="Dynamic link-state (OSPF) and distance-vector (RIP) routing convergence"
      />

      <div className="page-wrapper">
        {/* Protocol Overview Cards */}
        <div className="grid-2" style={{ marginBottom: '24px' }}>
          {/* OSPF Card */}
          <div className="card" style={{ border: '1px solid rgba(0, 210, 255, 0.3)', background: 'linear-gradient(180deg, rgba(0, 210, 255, 0.05) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="badge-tag cyan" style={{ marginBottom: '6px' }}>
                  INTERIOR GATEWAY PROTOCOL
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                  OSPF (Open Shortest Path First)
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Hierarchical link-state routing protocol (RFC 2328)
                </p>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="grid-3" style={{ fontSize: '0.78rem', background: '#090e1a', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ALGORITHM</div>
                <div style={{ fontWeight: '700', color: '#00d2ff' }}>Dijkstra SPF</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>METRIC</div>
                <div style={{ fontWeight: '700', color: '#fff' }}>Cost (10^8 / BW)</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ADMIN DISTANCE</div>
                <div className="font-mono" style={{ fontWeight: '700', color: '#c084fc' }}>110</div>
              </div>
            </div>
          </div>

          {/* RIP Card */}
          <div className="card" style={{ border: '1px solid rgba(168, 85, 247, 0.3)', background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.05) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="badge-tag purple" style={{ marginBottom: '6px' }}>
                  LEGACY DISTANCE VECTOR
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                  RIP (Routing Information Protocol)
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Distance-vector protocol with Bellman-Ford updates (RFC 2453)
                </p>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="grid-3" style={{ fontSize: '0.78rem', background: '#090e1a', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ALGORITHM</div>
                <div style={{ fontWeight: '700', color: '#c084fc' }}>Distance Vector</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>METRIC</div>
                <div style={{ fontWeight: '700', color: '#fff' }}>Hop Count (Max 15)</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ADMIN DISTANCE</div>
                <div className="font-mono" style={{ fontWeight: '700', color: '#c084fc' }}>120</div>
              </div>
            </div>
          </div>
        </div>

        {/* SPF Calculation Interactive Sandbox */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
                Dijkstra Shortest Path Tree (SPF) Simulator
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Calculate minimal cost spanning trees across campus fiber links
              </p>
            </div>

            <button
              onClick={handleRunSpf}
              disabled={isCalculatingSpf}
              className="btn btn-primary"
            >
              <Play size={16} />
              {isCalculatingSpf ? 'Calculating shortest path...' : 'Run SPF Calculation'}
            </button>
          </div>

          {/* Results breakdown */}
          {spfResult && (
            <div style={{ marginTop: '16px', padding: '16px', background: '#090e1a', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', animation: 'modal-fade 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Shortest path calculated successfully.
                </span>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Convergence: {spfResult.executionTime} • {spfResult.vertices} Nodes • {spfResult.edges} Links
                </span>
              </div>

              <div className="grid-3" style={{ gap: '10px' }}>
                {spfResult.optimalTree.map((item, idx) => (
                  <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.78rem' }}>
                    <div style={{ fontWeight: '700', color: '#fff', marginBottom: '2px' }}>{item.dest}</div>
                    <div className="font-mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.72rem' }}>
                      Interface: {item.via} • Cost: {item.cost}
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Next-hop: {item.nextHop}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Campus Routing Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                Campus Master Routing Table (FIB)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Active forwarding information base with metric costs & interfaces
              </p>
            </div>

            {/* Protocol Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'OSPF', 'RIP', 'CONNECTED', 'STATIC'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveProtocolTab(tab)}
                  className={`btn ${activeProtocolTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Next Hop</th>
                  <th>Interface</th>
                  <th>Metric Cost</th>
                  <th>Protocol</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.id}>
                    <td className="font-mono" style={{ fontWeight: '700', color: '#fff' }}>
                      {route.destination}
                    </td>
                    <td className="font-mono text-cyan" style={{ fontSize: '0.82rem' }}>
                      {route.nextHop}
                    </td>
                    <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {route.interface}
                    </td>
                    <td className="font-mono" style={{ fontWeight: '700', color: '#fbbf24' }}>
                      {route.metric}
                    </td>
                    <td>
                      <span
                        className="badge-tag"
                        style={{
                          background: route.protocol === 'OSPF' ? 'rgba(0, 210, 255, 0.15)' : route.protocol === 'RIP' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                          color: route.protocol === 'OSPF' ? '#00d2ff' : route.protocol === 'RIP' ? '#c084fc' : '#fff'
                        }}
                      >
                        {route.protocol}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={route.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
