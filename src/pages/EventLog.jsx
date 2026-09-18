import React, { useState } from 'react';
import {
  ListOrdered,
  Trash2,
  Search,
  Filter,
  ArrowUpRight,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import Header from '../components/Header';
import { useSimulation } from '../context/SimulationContext';

export default function EventLog() {
  const { eventLog, clearLog } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = eventLog.filter((log) => {
    const matchesSearch =
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.frame.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Header
        title="Event Log"
        subtitle="Detailed simulation event history"
      />

      <div className="page-wrapper">
        {/* Top Controls Bar */}
        <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '380px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search event details, frame ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {/* Filter & Clear Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>STATUS:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <option value="ALL">All Events</option>
                  <option value="SENT">SENT</option>
                  <option value="ACK">ACK</option>
                  <option value="LOST">LOST</option>
                  <option value="TIMEOUT">TIMEOUT</option>
                  <option value="RETRANSMIT">RETRANSMIT</option>
                </select>
              </div>

              <button onClick={clearLog} className="btn btn-secondary">
                <Trash2 size={15} />
                Clear Log
              </button>
            </div>
          </div>
        </div>

        {/* Events Table Card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 20px' }}>Time</th>
                  <th style={{ padding: '14px 20px' }}>Event</th>
                  <th style={{ padding: '14px 20px' }}>Frame</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No events recorded yet. Run the simulation to view dynamic protocol activities.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    let badgeBg = '#f1f5f9';
                    let badgeColor = '#475569';

                    if (log.status === 'SENT') {
                      badgeBg = 'var(--color-blue-light)';
                      badgeColor = '#1e40af';
                    } else if (log.status === 'ACK' || log.status === 'COMPLETED') {
                      badgeBg = 'var(--color-green-light)';
                      badgeColor = '#065f46';
                    } else if (log.status === 'LOST') {
                      badgeBg = 'var(--color-red-light)';
                      badgeColor = '#991b1b';
                    } else if (log.status === 'TIMEOUT' || log.status === 'RETRANSMIT') {
                      badgeBg = 'var(--color-orange-light)';
                      badgeColor = '#92400e';
                    } else if (log.status === 'RUNNING') {
                      badgeBg = 'var(--color-purple-light)';
                      badgeColor = '#5b21b6';
                    }

                    return (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="font-mono" style={{ padding: '12px 20px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                          {log.time}
                        </td>
                        <td style={{ padding: '12px 20px', fontWeight: '700', color: '#0f172a' }}>
                          {log.event}
                        </td>
                        <td className="font-mono" style={{ padding: '12px 20px', fontWeight: '700', color: '#7c3aed' }}>
                          {log.frame}
                        </td>
                        <td style={{ padding: '12px 20px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              backgroundColor: badgeBg,
                              color: badgeColor
                            }}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 20px', color: 'var(--text-main)' }}>
                          {log.details}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Showing {filteredLogs.length} events</span>
            <span>Go-Back-N ARQ Event Dissector</span>
          </div>
        </div>
      </div>
    </div>
  );
}
