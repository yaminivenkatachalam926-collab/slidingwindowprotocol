import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  RefreshCw,
  Search,
  Filter,
  Server,
  Send,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import Header from '../components/Header';
import DeviceModal from '../components/DeviceModal';
import StatusBadge from '../components/StatusBadge';
import { useNetwork } from '../context/NetworkContext';

export default function Devices() {
  const navigate = useNavigate();
  const { devices, addToast } = useNetwork();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm);

    const matchesArea = areaFilter === "ALL" || device.area === areaFilter;
    const matchesType = typeFilter === "ALL" || device.type === typeFilter;

    return matchesSearch && matchesArea && matchesType;
  });

  const handleRefresh = () => {
    addToast("Device table synchronized with current simulated hardware inventory", "info");
  };

  const handlePing = (device) => {
    addToast(`ICMP echo reply from ${device.ip} (${device.hostname}): time=1.2ms TTL=64`, "success");
  };

  return (
    <div>
      <Header
        title="Network Devices"
        subtitle="Campus infrastructure inventory & hardware management"
      />

      <div className="page-wrapper">
        {/* Top Controls & Action Bar */}
        <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '420px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search by Hostname, IP address or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input font-mono"
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {/* Filter Dropdowns & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Area Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>AREA:</span>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  <option value="ALL">All Areas</option>
                  <option value="LAN">LAN</option>
                  <option value="MAN">MAN</option>
                  <option value="WAN">WAN</option>
                </select>
              </div>

              {/* Type Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>TYPE:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  <option value="ALL">All Types</option>
                  <option value="PC">PC (Workstation)</option>
                  <option value="Switch">Switch</option>
                  <option value="Router">Router</option>
                  <option value="Server">Server</option>
                  <option value="Cloud Host">Cloud Host</option>
                </select>
              </div>

              <button onClick={handleRefresh} className="btn btn-secondary">
                <RefreshCw size={15} />
                Refresh
              </button>

              <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                <Plus size={16} />
                + Add Device
              </button>
            </div>
          </div>
        </div>

        {/* Devices Table Card */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Hostname</th>
                  <th>Hardware Type</th>
                  <th>IPv4 Address</th>
                  <th>Subnet / Gateway</th>
                  <th>Network Area</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No devices match the specified query filters.
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device) => (
                    <tr key={device.id}>
                      <td className="font-mono" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                        {device.id}
                      </td>
                      <td style={{ fontWeight: '600', color: '#fff' }}>
                        {device.hostname}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 'normal' }}>
                          {device.location}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>
                          {device.type}
                        </span>
                      </td>
                      <td className="font-mono text-cyan" style={{ fontSize: '0.85rem' }}>
                        {device.ip}
                      </td>
                      <td className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        <div>{device.subnet}</div>
                        <div>GW: {device.gateway}</div>
                      </td>
                      <td>
                        <StatusBadge text={device.area} size="sm" />
                      </td>
                      <td>
                        <StatusBadge status={device.status} size="sm" />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handlePing(device)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            title="Simulate ICMP Echo Ping"
                          >
                            Ping
                          </button>
                          <button
                            onClick={() => navigate('/packet-simulator', { state: { defaultSource: device.hostname } })}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            title="Open in Packet Simulator"
                          >
                            <Send size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Info */}
          <div style={{ padding: '12px 20px', background: '#090e1a', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Showing {filteredDevices.length} of {devices.length} registered campus devices</span>
            <span className="font-mono">Subnet Coverage: 192.168.0.0/16, 10.0.0.0/16, 172.16.0.0/24</span>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Device Registration */}
      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
