import React from 'react';
import { Monitor, Router, Server, Cloud, Cpu, Shield, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function NetworkNode({ device, isSelected, onClick, showIP = true, showLabels = true }) {
  const getDeviceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'router':
        return Router;
      case 'switch':
        return Cpu;
      case 'server':
        return Server;
      case 'cloud host':
      case 'cloud':
        return Cloud;
      case 'firewall':
        return Shield;
      case 'pc':
      case 'workstation':
      default:
        return Monitor;
    }
  };

  const Icon = getDeviceIcon(device.type);
  const isDown = device.status === "Down" || device.status === "Fault";
  const isWarning = device.status === "Warning";

  // Area badge color
  let areaColor = "#00d2ff";
  if (device.area === "MAN") areaColor = "#a855f7";
  if (device.area === "WAN") areaColor = "#f97316";

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${device.x}px`,
        top: `${device.y}px`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: isSelected ? 30 : 10,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none'
      }}
      className="network-node-wrapper"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {/* Node Icon Box */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: isDown ? '#2d1212' : isWarning ? '#2d2212' : '#0e172a',
            border: `2px solid ${
              isSelected
                ? '#00d2ff'
                : isDown
                ? '#ef4444'
                : isWarning
                ? '#f59e0b'
                : 'rgba(0, 210, 255, 0.3)'
            }`,
            boxShadow: isSelected
              ? '0 0 20px rgba(0, 210, 255, 0.6), 0 0 5px #00d2ff'
              : isDown
              ? '0 0 15px rgba(239, 68, 68, 0.5)'
              : isWarning
              ? '0 0 15px rgba(245, 158, 11, 0.5)'
              : '0 4px 12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDown ? '#f87171' : isWarning ? '#fbbf24' : areaColor,
            position: 'relative'
          }}
        >
          <Icon size={22} />

          {/* Mini status indicator dot */}
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isDown ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981',
              border: '2px solid #080c14',
              boxShadow: `0 0 6px ${isDown ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}`
            }}
          />

          {isWarning && (
            <span
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: '-4px',
                color: '#f59e0b'
              }}
            >
              <AlertTriangle size={12} />
            </span>
          )}
        </div>

        {/* Labels */}
        {showLabels && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >
            <span
              style={{
                fontSize: '0.73rem',
                fontWeight: '700',
                color: '#fff',
                whiteSpace: 'nowrap',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {device.hostname}
            </span>

            {showIP && (
              <span
                className="font-mono"
                style={{
                  fontSize: '0.66rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  background: 'rgba(9, 14, 26, 0.85)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginTop: '1px'
                }}
              >
                {device.ip}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
