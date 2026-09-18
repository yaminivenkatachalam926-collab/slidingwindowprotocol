import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DEVICES,
  INITIAL_LINKS,
  INITIAL_ROUTING_TABLE,
  INITIAL_ACTIVITY_LOGS,
  CHAOS_SCENARIOS,
  INITIAL_TIME_SERIES
} from '../data/mockData';

const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [routingTable, setRoutingTable] = useState(INITIAL_ROUTING_TABLE);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [activeScenarios, setActiveScenarios] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState(INITIAL_TIME_SERIES);
  const [toasts, setToasts] = useState([]);

  // Live Metrics
  const [metrics, setMetrics] = useState({
    totalDevices: 15,
    activeDevices: 14,
    standbyDevices: 1,
    linksOnline: 16,
    totalLinks: 16,
    throughput: 4.82,
    packetsTransmitted: 0,
    deliverySuccess: 100,
    deliveredCount: 0,
    cpuUtilization: 42,
    memoryUsage: 61,
    packetLoss: 0.2,
    latency: 42
  });

  // Settings
  const [settings, setSettings] = useState({
    defaultPacketSize: 1024,
    defaultLatency: 50,
    animationSpeed: "Normal (1x)",
    autoRefresh: true,
    showIPAddresses: true,
    showLinkBandwidth: true,
    showPacketAnimation: true,
    showDeviceLabels: true
  });

  // Toast Notification Helper
  const addToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Device
  const addDevice = (deviceData) => {
    const id = deviceData.id || `DEV-${Math.floor(100 + Math.random() * 900)}`;
    const newDevice = {
      id,
      hostname: deviceData.hostname,
      type: deviceData.type || "PC",
      ip: deviceData.ip,
      subnet: deviceData.subnet || "255.255.255.0",
      gateway: deviceData.gateway || "192.168.10.254",
      area: deviceData.area || "LAN",
      subArea: deviceData.subArea || `${deviceData.area} Subnet`,
      location: deviceData.location || "Campus Lab Area",
      status: deviceData.status || "Active",
      mac: `00:1A:2B:EE:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      x: 350 + (Math.random() * 100 - 50),
      y: 260 + (Math.random() * 80 - 40),
      ports: ["eth0"]
    };

    setDevices(prev => [...prev, newDevice]);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      totalDevices: prev.totalDevices + 1,
      activeDevices: newDevice.status === "Active" ? prev.activeDevices + 1 : prev.activeDevices,
      standbyDevices: newDevice.status === "Standby" ? prev.standbyDevices + 1 : prev.standbyDevices
    }));

    // Add log
    const now = new Date().toLocaleTimeString();
    setActivityLogs(prev => [
      { id: Date.now(), time: now, type: "device", message: `New device registered: ${newDevice.hostname} (${newDevice.ip})`, status: "success" },
      ...prev.slice(0, 19)
    ]);

    addToast(`Device registered successfully: ${newDevice.hostname} (Demo Mode)`, "success");
    return newDevice;
  };

  // Trigger Chaos Scenario
  const triggerScenario = (scenarioId) => {
    const scenario = CHAOS_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    if (activeScenarios.includes(scenarioId)) {
      addToast(`Scenario "${scenario.title}" is already active`, "warning");
      return;
    }

    setActiveScenarios(prev => [...prev, scenarioId]);

    // Apply Impacts
    if (scenario.impact.brokenLinkId) {
      setLinks(prev => prev.map(l => l.id === scenario.impact.brokenLinkId ? { ...l, status: "Down" } : l));
    }

    if (scenario.impact.targetDeviceId) {
      setDevices(prev => prev.map(d => d.id === scenario.impact.targetDeviceId ? { ...d, status: scenario.impact.deviceStatusOverride || "Warning" } : d));
    }

    // Apply metrics
    setMetrics(prev => {
      const newLatency = Math.min(250, prev.latency + (scenario.impact.latencyPenalty || 0));
      const newLoss = Math.min(25, Number((prev.packetLoss + (scenario.impact.packetLossPenalty || 0)).toFixed(1)));
      const newThroughput = Number((Math.max(0.8, prev.throughput * (1 - (scenario.impact.bandwidthReduction || 0)))).toFixed(2));
      const newPackets = prev.packetsTransmitted + (scenario.impact.packetBurst || 0);

      return {
        ...prev,
        latency: newLatency,
        packetLoss: newLoss,
        throughput: newThroughput,
        packetsTransmitted: newPackets,
        linksOnline: scenario.impact.brokenLinkId ? prev.linksOnline - 1 : prev.linksOnline,
        cpuUtilization: Math.min(96, prev.cpuUtilization + (scenario.id === "ddos-attack" ? 38 : 15)),
        deliverySuccess: newLoss > 5 ? 88 : 98
      };
    });

    // Add log
    const now = new Date().toLocaleTimeString();
    setActivityLogs(prev => [
      { id: Date.now(), time: now, type: "fault", message: scenario.impact.alert, status: "danger" },
      ...prev.slice(0, 19)
    ]);

    addToast(`Fault injected: ${scenario.title} (Demo Simulation)`, "danger");
  };

  // Restore Nominal State
  const restoreNominal = () => {
    setActiveScenarios([]);
    setDevices(INITIAL_DEVICES);
    setLinks(INITIAL_LINKS);
    setMetrics(prev => ({
      ...prev,
      totalDevices: 15,
      activeDevices: 14,
      standbyDevices: 1,
      linksOnline: 16,
      throughput: 4.82,
      deliverySuccess: 100,
      cpuUtilization: 42,
      memoryUsage: 61,
      packetLoss: 0.2,
      latency: 42
    }));

    const now = new Date().toLocaleTimeString();
    setActivityLogs(prev => [
      { id: Date.now(), time: now, type: "restore", message: "Network restored to nominal operational baseline. All links active.", status: "success" },
      ...prev.slice(0, 19)
    ]);

    addToast("Network restored to nominal state. All faults cleared.", "success");
  };

  // Toggle single link status
  const toggleLinkStatus = (linkId) => {
    setLinks(prev => {
      let isNowOnline = false;
      const updated = prev.map(l => {
        if (l.id === linkId) {
          isNowOnline = l.status === "Down";
          return { ...l, status: isNowOnline ? "Online" : "Down" };
        }
        return l;
      });

      setMetrics(m => ({
        ...m,
        linksOnline: isNowOnline ? m.linksOnline + 1 : m.linksOnline - 1
      }));

      addToast(`Link ${linkId} status changed to ${isNowOnline ? 'Online' : 'Down'}`, isNowOnline ? 'success' : 'warning');
      return updated;
    });
  };

  // Increment packet stats
  const recordPacketTransmission = (success = true, size = 1024) => {
    setMetrics(prev => {
      const newTotal = prev.packetsTransmitted + 1;
      const newDelivered = success ? prev.deliveredCount + 1 : prev.deliveredCount;
      const newDeliveryRate = Math.round((newDelivered / newTotal) * 100);

      return {
        ...prev,
        packetsTransmitted: newTotal,
        deliveredCount: newDelivered,
        deliverySuccess: newDeliveryRate
      };
    });
  };

  return (
    <NetworkContext.Provider
      value={{
        devices,
        links,
        routingTable,
        setRoutingTable,
        activityLogs,
        setActivityLogs,
        activeScenarios,
        timeSeriesData,
        metrics,
        setMetrics,
        settings,
        setSettings,
        toasts,
        addToast,
        removeToast,
        addDevice,
        triggerScenario,
        restoreNominal,
        toggleLinkStatus,
        recordPacketTransmission
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}
