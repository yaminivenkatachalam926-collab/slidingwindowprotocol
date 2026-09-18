import React, { useState } from 'react';
import { X, Server, Plus, ShieldAlert } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';

export default function DeviceModal({ isOpen, onClose }) {
  const { addDevice, devices } = useNetwork();

  const [formData, setFormData] = useState({
    id: `DEV-0${devices.length + 1}`,
    type: "PC",
    hostname: "",
    ip: "",
    subnet: "255.255.255.0",
    gateway: "192.168.10.254",
    area: "LAN",
    subArea: "CSE Department (192.168.10.0/24)",
    status: "Active",
    location: "Block-A Computer Lab"
  });

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto adjust defaults based on area if user changes area
      if (name === "area") {
        if (value === "LAN") {
          updated.subnet = "255.255.255.0";
          updated.gateway = "192.168.10.254";
          updated.subArea = "CSE Department (192.168.10.0/24)";
        } else if (value === "MAN") {
          updated.subnet = "255.255.0.0";
          updated.gateway = "10.0.0.1";
          updated.subArea = "Campus Core (10.0.0.0/16)";
        } else if (value === "WAN") {
          updated.subnet = "255.255.255.252";
          updated.gateway = "203.0.113.1";
          updated.subArea = "WAN Gateway & Cloud (203.0.113.0/24)";
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.hostname.trim() || !formData.ip.trim()) {
      setError("Please fill in all required fields (*).");
      return;
    }

    addDevice(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--accent-cyan)' }}>
              <Server size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>Register Campus Network Device</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Demo registration adds device to client-side network state</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Device ID *</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g. PC-005 or RT-006"
                className="form-input font-mono"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hardware Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                <option value="PC">PC (Workstation)</option>
                <option value="Switch">Switch (L2/L3)</option>
                <option value="Router">Router (Gateway/Core)</option>
                <option value="Server">Server (Application/DB)</option>
                <option value="Cloud Host">Cloud Host (WAN)</option>
                <option value="Firewall">Security Firewall</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Device Hostname / Label *</label>
              <input
                type="text"
                name="hostname"
                value={formData.hostname}
                onChange={handleChange}
                placeholder="e.g. CSE-PC-03 or Lab-Switch-02"
                className="form-input font-mono"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">IPv4 Address *</label>
              <input
                type="text"
                name="ip"
                value={formData.ip}
                onChange={handleChange}
                placeholder="e.g. 192.168.10.35"
                className="form-input font-mono"
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Subnet Mask</label>
              <input
                type="text"
                name="subnet"
                value={formData.subnet}
                onChange={handleChange}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Gateway</label>
              <input
                type="text"
                name="gateway"
                value={formData.gateway}
                onChange={handleChange}
                className="form-input font-mono"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Network Area *</label>
              <select name="area" value={formData.area} onChange={handleChange} className="form-select">
                <option value="LAN">LAN (Local Area Network)</option>
                <option value="MAN">MAN (Campus Core Backbone)</option>
                <option value="WAN">WAN (External Cloud / ISP)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Operational Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value="Active">Active</option>
                <option value="Standby">Standby</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Campus Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Block-A Lab 3 or Central Server Room"
              className="form-input"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} />
              Register Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
