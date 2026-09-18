import React from 'react';
import { useSimulation } from '../context/SimulationContext';

export default function Header({ title, subtitle }) {
  const { status } = useSimulation();

  const getStatusClass = () => {
    switch (status) {
      case 'RUNNING':
        return 'running';
      case 'PAUSED':
        return 'paused';
      case 'COMPLETED':
        return 'completed';
      case 'IDLE':
      default:
        return 'ready';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'RUNNING':
        return '● RUNNING';
      case 'PAUSED':
        return '● PAUSED';
      case 'COMPLETED':
        return '● COMPLETED';
      case 'IDLE':
      default:
        return '● READY';
    }
  };

  return (
    <header className="top-header">
      <div className="header-title-box">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div>
        <span className={`status-pill ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>
    </header>
  );
}
