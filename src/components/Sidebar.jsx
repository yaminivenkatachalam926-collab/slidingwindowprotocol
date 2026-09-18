import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlaySquare,
  ListOrdered,
  BarChart2,
  TrendingUp,
  Radio,
  Layers
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/simulator', label: 'Simulator', icon: PlaySquare },
    { path: '/event-log', label: 'Event Log', icon: ListOrdered },
    { path: '/statistics', label: 'Statistics', icon: BarChart2 },
    { path: '/performance', label: 'Performance', icon: TrendingUp }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Layers size={22} />
        </div>
        <div>
          <div className="sidebar-title">CN SIMULATOR</div>
          <div className="sidebar-subtitle">Sliding Window Protocol</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={14} style={{ color: '#a78bfa' }} />
          <span>v1.0 — Go-Back-N ARQ</span>
        </div>
      </div>
    </aside>
  );
}
