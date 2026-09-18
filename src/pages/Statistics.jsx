import React from 'react';
import {
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Send,
  Zap,
  Percent,
  Layers
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
  Legend,
  ResponsiveContainer
} from 'recharts';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { useSimulation } from '../context/SimulationContext';

export default function Statistics() {
  const { totalFrames, metrics, historyData, transmissionDelay } = useSimulation();

  const totalSent = metrics.framesTransmitted;
  const deliveryRate = totalSent > 0 ? Math.round((metrics.acksReceived / totalSent) * 100) : 100;
  const efficiency = totalSent > 0 ? Math.round((metrics.successfulFrames / totalSent) * 100) : 100;

  // Chart 1: ACK vs Lost Comparison
  const ackLostData = [
    { name: 'Transmitted', count: metrics.framesTransmitted, fill: '#3b82f6' },
    { name: 'Acknowledged', count: metrics.acksReceived, fill: '#10b981' },
    { name: 'Lost Frames', count: metrics.lostFrames, fill: '#ef4444' },
    { name: 'Retransmissions', count: metrics.retransmissions, fill: '#f59e0b' }
  ];

  // Dummy or real history
  const chartTimelineData = historyData.length > 0 ? historyData : [
    { step: 1, transmitted: 1, acked: 1, lost: 0, base: 1 },
    { step: 2, transmitted: 2, acked: 2, lost: 0, base: 2 },
    { step: 3, transmitted: 4, acked: 3, lost: 1, base: 3 },
    { step: 4, transmitted: 6, acked: 4, lost: 1, base: 4 },
    { step: 5, transmitted: 7, acked: 5, lost: 1, base: 5 }
  ];

  return (
    <div>
      <Header
        title="Statistics"
        subtitle="Transmission statistics and protocol behavior"
      />

      <div className="page-wrapper">
        {/* Top 8 Statistics Cards */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          <StatCard
            title="TOTAL FRAMES"
            value={totalFrames}
            subtitle="Configured frame stream"
            icon={Layers}
            accent="purple"
          />
          <StatCard
            title="SUCCESSFUL FRAMES"
            value={metrics.successfulFrames}
            subtitle="Delivered & confirmed"
            icon={CheckCircle2}
            accent="green"
          />
          <StatCard
            title="LOST FRAMES"
            value={metrics.lostFrames}
            subtitle="Channel loss events"
            icon={AlertTriangle}
            accent="red"
          />
          <StatCard
            title="RETRANSMISSIONS"
            value={metrics.retransmissions}
            subtitle="Go-Back-N repeats"
            icon={RotateCcw}
            accent="orange"
          />
        </div>

        <div className="grid-4" style={{ marginBottom: '28px' }}>
          <StatCard
            title="ACKS RECEIVED"
            value={metrics.acksReceived}
            subtitle="Valid feedback tokens"
            icon={CheckCircle2}
            accent="green"
          />
          <StatCard
            title="PACKET DELIVERY RATE"
            value={`${deliveryRate}%`}
            subtitle="ACK / Transmitted ratio"
            icon={Percent}
            accent="blue"
          />
          <StatCard
            title="AVERAGE LATENCY"
            value={`${metrics.averageLatency || Math.round(transmissionDelay * 0.75)} ms`}
            subtitle="Estimated RTT delay"
            icon={Clock}
            accent="purple"
          />
          <StatCard
            title="EFFICIENCY"
            value={`${efficiency}%`}
            subtitle="Channel throughput yield"
            icon={Zap}
            accent={efficiency > 80 ? 'green' : 'orange'}
          />
        </div>

        {/* 4 Recharts Data Visualizations */}
        <div className="grid-2" style={{ gap: '24px', marginBottom: '28px' }}>
          
          {/* Chart 1: Frame Transmission Timeline */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              1. Frame Transmission Cumulative Progression
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Transmitted frames vs. verified ACKs over sequence steps
            </p>

            <div style={{ height: '230px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTimelineData}>
                  <defs>
                    <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="step" label={{ value: 'Simulation Step', position: 'insideBottom', offset: -4 }} fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="transmitted" stroke="#7c3aed" fillOpacity={1} fill="url(#txGrad)" name="Transmitted" />
                  <Line type="monotone" dataKey="acked" stroke="#10b981" strokeWidth={2.5} name="ACKed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: ACK vs Lost Distribution */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              2. Transmission Outcome Distribution
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Breakdown of successful, dropped, and repeated packets
            </p>

            <div style={{ height: '230px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ackLostData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Retransmission Count Over Time */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              3. Channel Loss & Timeout Events
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Cumulative packet drop count during transmission
            </p>

            <div style={{ height: '230px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="step" fontSize={11} />
                  <YAxis fontSize={11} domain={[0, 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="lost" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Lost Frames" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Window Movement & Base Sequence */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              4. Sliding Window Base Index (F_base)
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Window sliding movement progression along sequence space
            </p>

            <div style={{ height: '230px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="step" fontSize={11} />
                  <YAxis fontSize={11} domain={[1, totalFrames + 1]} />
                  <Tooltip />
                  <Line type="stepAfter" dataKey="base" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} name="Current Base" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
