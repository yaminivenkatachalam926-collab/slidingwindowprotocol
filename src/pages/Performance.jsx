import React from 'react';
import {
  TrendingUp,
  Percent,
  RotateCcw,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { useSimulation } from '../context/SimulationContext';

export default function Performance() {
  const { metrics, windowSize, totalFrames, lossProbability, transmissionDelay } = useSimulation();

  const totalTransmitted = metrics.framesTransmitted || 1;
  const deliveryRate = Math.round((metrics.acksReceived / totalTransmitted) * 100);
  const retransmissionRate = Math.round((metrics.retransmissions / totalTransmitted) * 100);
  const efficiency = Math.round((metrics.successfulFrames / totalTransmitted) * 100);
  const averageDelay = metrics.averageLatency || Math.round(transmissionDelay * 0.75);

  // Dynamic bar chart data
  const performanceData = [
    {
      category: 'Successful',
      count: metrics.successfulFrames,
      color: '#10b981'
    },
    {
      category: 'Lost',
      count: metrics.lostFrames,
      color: '#ef4444'
    },
    {
      category: 'Retransmitted',
      count: metrics.retransmissions,
      color: '#f59e0b'
    },
    {
      category: 'ACKs Received',
      count: metrics.acksReceived,
      color: '#7c3aed'
    }
  ];

  return (
    <div>
      <Header
        title="Performance"
        subtitle="Network efficiency visualization and transmission analysis"
      />

      <div className="page-wrapper">
        
        {/* Top Large Chart Card: Transmission Performance */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                Transmission Performance Metrics
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Comparison of delivered, dropped, and repeated packets across simulation
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '9999px' }}>
              Channel Throughput: {efficiency}%
            </span>
          </div>

          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          <StatCard
            title="DELIVERY RATE"
            value={`${deliveryRate}%`}
            subtitle="Successful packet ratio"
            icon={Percent}
            accent="green"
          />
          <StatCard
            title="RETRANSMISSION RATE"
            value={`${retransmissionRate}%`}
            subtitle="Channel loss penalty"
            icon={RotateCcw}
            accent={retransmissionRate > 25 ? 'red' : 'orange'}
          />
          <StatCard
            title="AVERAGE DELAY"
            value={`${averageDelay} ms`}
            subtitle="Mean round-trip time"
            icon={Clock}
            accent="purple"
          />
          <StatCard
            title="PROTOCOL EFFICIENCY"
            value={`${efficiency}%`}
            subtitle="Payload throughput yield"
            icon={Zap}
            accent="blue"
          />
        </div>

        {/* Analytical Theory & Protocol Formula Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen size={18} style={{ color: '#7c3aed' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
              Go-Back-N Mathematical Efficiency & Analysis
            </h3>
          </div>

          <div className="grid-2" style={{ gap: '20px', fontSize: '0.82rem' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: '800', color: '#7c3aed', marginBottom: '6px' }}>
                Channel Utilization Formula (Error-Free)
              </div>
              <div className="font-mono" style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '8px', color: '#0f172a' }}>
                η = N / (1 + 2a) &nbsp;&nbsp;(where a = T_prop / T_trans)
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.45' }}>
                When window size <strong>N ≥ 1 + 2a</strong>, the link is kept 100% busy in an error-free channel, outperforming Stop-and-Wait (N=1) by a factor of N.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: '800', color: '#ea580c', marginBottom: '6px' }}>
                Efficiency with Frame Loss Probability (p = {lossProbability}%)
              </div>
              <div className="font-mono" style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '8px', color: '#0f172a' }}>
                η_actual = (1 - p) / (1 + (N - 1)p)
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.45' }}>
                With a frame loss probability <strong>p = {lossProbability / 100}</strong>, a lost frame forces the retransmission of up to N subsequent unacknowledged frames.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
