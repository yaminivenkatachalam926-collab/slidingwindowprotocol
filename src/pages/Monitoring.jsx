import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Radio,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { useNetwork } from '../context/NetworkContext';

export default function Monitoring() {
  const { metrics, links, activeScenarios, timeSeriesData } = useNetwork();
  const [chartData, setChartData] = useState(timeSeriesData);

  // Periodic subtle live fluctuation to give a real-time monitoring feel
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const last = prev[prev.length - 1];
        const nextSec = new Date();
        const timeStr = `${nextSec.getHours()}:${String(nextSec.getMinutes()).padStart(2, '0')}:${String(nextSec.getSeconds()).padStart(2, '0')}`;
        
        const jitterThroughput = Number((metrics.throughput + (Math.random() * 0.4 - 0.2)).toFixed(2));
        const jitterLatency = Math.round(metrics.latency + (Math.random() * 4 - 2));
        const jitterPackets = Math.round(180 + Math.random() * 60);

        const newEntry = {
          time: timeStr,
          throughput: Math.max(0.5, jitterThroughput),
          packets: jitterPackets,
          latency: Math.max(5, jitterLatency),
          bandwidth: Math.max(0.5, jitterThroughput),
          loss: metrics.packetLoss
        };

        return [...prev.slice(1), newEntry];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [metrics]);

  const customTooltipStyle = {
    backgroundColor: '#090e1a',
    borderColor: 'rgba(0, 210, 255, 0.3)',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '0.78rem'
  };

  return (
    <div>
      <Header
        title="Network Monitoring & Telemetry"
        subtitle="Real-time campus network metrics, bandwidth charts and link performance"
      />

      <div className="page-wrapper">
        {/* Top 6 Metric Cards */}
        <div className="grid-6" style={{ marginBottom: '24px' }}>
          <StatCard
            title="Network Health"
            value={`${activeScenarios.length > 0 ? (100 - activeScenarios.length * 12) : 98}%`}
            subValue="SLA target: 99.9%"
            icon={Activity}
            accent={activeScenarios.length > 0 ? "yellow" : "green"}
          />
          <StatCard
            title="CPU Utilization"
            value={`${metrics.cpuUtilization}%`}
            subValue="Campus Core Routers"
            icon={Cpu}
            accent={metrics.cpuUtilization > 75 ? "red" : "cyan"}
          />
          <StatCard
            title="Memory Usage"
            value={`${metrics.memoryUsage}%`}
            subValue="Aggregated buffer cache"
            icon={HardDrive}
            accent="purple"
          />
          <StatCard
            title="Bandwidth"
            value={`${metrics.throughput} Mbps`}
            subValue="Live aggregated flow"
            icon={Radio}
            accent="cyan"
          />
          <StatCard
            title="Packet Loss"
            value={`${metrics.packetLoss}%`}
            subValue="End-to-end drop rate"
            icon={AlertTriangle}
            accent={metrics.packetLoss > 1 ? "red" : "green"}
          />
          <StatCard
            title="Latency"
            value={`${metrics.latency} ms`}
            subValue="Average round-trip delay"
            icon={Clock}
            accent={metrics.latency > 100 ? "red" : metrics.latency > 50 ? "orange" : "cyan"}
          />
        </div>

        {/* 4 Real-Time Recharts Grids */}
        <div className="grid-2" style={{ marginBottom: '24px' }}>
          
          {/* Chart 1: Network Throughput */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Network Throughput (Mbps)</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time aggregated bandwidth flow</p>
              </div>
              <span className="font-mono text-cyan" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                {metrics.throughput} Mbps
              </span>
            </div>

            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00d2ff" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} />
                  <YAxis stroke="var(--text-dim)" fontSize={10} domain={[0, 10]} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Area type="monotone" dataKey="throughput" stroke="#00d2ff" strokeWidth={2} fillOpacity={1} fill="url(#throughputGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Round-Trip Latency */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Round-Trip Latency (ms)</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hop latency & queue buffer delay</p>
              </div>
              <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: metrics.latency > 80 ? '#ef4444' : '#10b981' }}>
                {metrics.latency} ms
              </span>
            </div>

            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} />
                  <YAxis stroke="var(--text-dim)" fontSize={10} domain={[0, 200]} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Line type="monotone" dataKey="latency" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Packet Delivery Volume */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Packet Delivery Volume</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Packets successfully delivered per sampling period</p>
              </div>
              <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#34d399' }}>
                {metrics.deliverySuccess}% Success
              </span>
            </div>

            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} />
                  <YAxis stroke="var(--text-dim)" fontSize={10} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="packets" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Simulated Packet Loss Rate */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Packet Loss Rate (%)</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transmission drop & CRC error rate</p>
              </div>
              <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: metrics.packetLoss > 1 ? '#ef4444' : '#fbbf24' }}>
                {metrics.packetLoss}%
              </span>
            </div>

            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} />
                  <YAxis stroke="var(--text-dim)" fontSize={10} domain={[0, 15]} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Area type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#lossGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Active Links Status Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                Active Physical & Logical Links
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Interconnect link telemetry, bandwidth allocation and latency
              </p>
            </div>
            <span className="font-mono text-cyan" style={{ fontSize: '0.8rem' }}>
              {metrics.linksOnline} of {links.length} Online
            </span>
          </div>

          <div className="table-container">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Link ID & Nodes</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Allocated Bandwidth</th>
                  <th>Latency</th>
                  <th>Packet Loss</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => {
                  const isDown = link.status === "Down";
                  return (
                    <tr key={link.id}>
                      <td style={{ fontWeight: '600', color: '#fff' }}>
                        <span className="font-mono text-cyan" style={{ marginRight: '8px' }}>{link.id}</span>
                        {link.name ? `${link.name} (${link.from} ↔ ${link.to})` : `${link.from} ↔ ${link.to}`}
                      </td>
                      <td>
                        <span className="badge-tag" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-main)' }}>
                          {link.type.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={link.status} size="sm" />
                      </td>
                      <td className="font-mono" style={{ color: isDown ? '#ef4444' : '#38bdf8', fontWeight: '700' }}>
                        {isDown ? '0 bps (Severed)' : link.bandwidth}
                      </td>
                      <td className="font-mono" style={{ color: 'var(--text-main)' }}>
                        {isDown ? '∞ ms' : `${link.latency} ms`}
                      </td>
                      <td className="font-mono" style={{ color: link.loss > 1 ? '#ef4444' : 'var(--text-dim)' }}>
                        {isDown ? '100%' : `${link.loss}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
