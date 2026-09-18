// Campus NetSim – Static Mock Data Store
// Designed for pure frontend demo simulation

export const INITIAL_DEVICES = [
  {
    id: "PC-001",
    hostname: "CSE-PC-01",
    type: "PC",
    ip: "192.168.10.21",
    subnet: "255.255.255.0",
    gateway: "192.168.10.254",
    area: "LAN",
    subArea: "CSE Department (192.168.10.0/24)",
    location: "Block-A Lab 3",
    status: "Active",
    mac: "00:1A:2B:3C:4D:01",
    x: 80,
    y: 110,
    ports: ["eth0"]
  },
  {
    id: "PC-002",
    hostname: "CSE-PC-02",
    type: "PC",
    ip: "192.168.10.22",
    subnet: "255.255.255.0",
    gateway: "192.168.10.254",
    area: "LAN",
    subArea: "CSE Department (192.168.10.0/24)",
    location: "Block-A Lab 4",
    status: "Active",
    mac: "00:1A:2B:3C:4D:02",
    x: 80,
    y: 200,
    ports: ["eth0"]
  },
  {
    id: "SW-001",
    hostname: "CSE-Switch-Access",
    type: "Switch",
    ip: "192.168.10.10",
    subnet: "255.255.255.0",
    gateway: "192.168.10.254",
    area: "LAN",
    subArea: "CSE Department (192.168.10.0/24)",
    location: "Block-A Server Rack 1",
    status: "Active",
    mac: "00:1A:2B:3C:4D:10",
    x: 180,
    y: 155,
    ports: ["fa0/1", "fa0/2", "gi0/1"]
  },
  {
    id: "RT-001",
    hostname: "CSE-Gateway-Router",
    type: "Router",
    ip: "192.168.10.254",
    subnet: "255.255.255.0",
    gateway: "10.0.0.1",
    area: "LAN",
    subArea: "CSE Department (192.168.10.0/24)",
    location: "Block-A NOC",
    status: "Active",
    mac: "00:1A:2B:3C:4D:FE",
    x: 290,
    y: 155,
    ports: ["gi0/0", "gi0/1"]
  },
  {
    id: "PC-003",
    hostname: "ECE-Workstation-01",
    type: "PC",
    ip: "192.168.20.21",
    subnet: "255.255.255.0",
    gateway: "192.168.20.254",
    area: "LAN",
    subArea: "ECE Department (192.168.20.0/24)",
    location: "Block-B VLSI Lab",
    status: "Active",
    mac: "00:1A:2B:3C:5E:01",
    x: 80,
    y: 350,
    ports: ["eth0"]
  },
  {
    id: "PC-004",
    hostname: "ECE-Workstation-02",
    type: "PC",
    ip: "192.168.20.22",
    subnet: "255.255.255.0",
    gateway: "192.168.20.254",
    area: "LAN",
    subArea: "ECE Department (192.168.20.0/24)",
    location: "Block-B DSP Lab",
    status: "Active",
    mac: "00:1A:2B:3C:5E:02",
    x: 80,
    y: 440,
    ports: ["eth0"]
  },
  {
    id: "SW-002",
    hostname: "ECE-Switch-Access",
    type: "Switch",
    ip: "192.168.20.10",
    subnet: "255.255.255.0",
    gateway: "192.168.20.254",
    area: "LAN",
    subArea: "ECE Department (192.168.20.0/24)",
    location: "Block-B Server Rack 1",
    status: "Active",
    mac: "00:1A:2B:3C:5E:10",
    x: 180,
    y: 395,
    ports: ["fa0/1", "fa0/2", "gi0/1"]
  },
  {
    id: "RT-002",
    hostname: "ECE-Gateway-Router",
    type: "Router",
    ip: "192.168.20.254",
    subnet: "255.255.255.0",
    gateway: "10.0.0.2",
    area: "LAN",
    subArea: "ECE Department (192.168.20.0/24)",
    location: "Block-B NOC",
    status: "Active",
    mac: "00:1A:2B:3C:5E:FE",
    x: 290,
    y: 395,
    ports: ["gi0/0", "gi0/1"]
  },
  {
    id: "RT-003",
    hostname: "North-Campus-Core",
    type: "Router",
    ip: "10.0.0.1",
    subnet: "255.255.0.0",
    gateway: "10.0.0.1",
    area: "MAN",
    subArea: "Campus Core (10.0.0.0/16)",
    location: "Central Admin Server Room",
    status: "Active",
    mac: "00:1A:2B:CC:01:01",
    x: 430,
    y: 180,
    ports: ["gi0/0", "gi0/1", "ten0/1", "ten0/2"]
  },
  {
    id: "RT-004",
    hostname: "South-Campus-Core",
    type: "Router",
    ip: "10.0.0.2",
    subnet: "255.255.0.0",
    gateway: "10.0.0.2",
    area: "MAN",
    subArea: "Campus Core (10.0.0.0/16)",
    location: "South Tech Tower NOC",
    status: "Active",
    mac: "00:1A:2B:CC:02:02",
    x: 430,
    y: 370,
    ports: ["gi0/0", "gi0/1", "ten0/1", "ten0/2"]
  },
  {
    id: "SW-003",
    hostname: "Campus-Aggregation-Switch",
    type: "Switch",
    ip: "10.0.0.10",
    subnet: "255.255.0.0",
    gateway: "10.0.0.1",
    area: "MAN",
    subArea: "Campus Core (10.0.0.0/16)",
    location: "Central Data Center",
    status: "Active",
    mac: "00:1A:2B:CC:0A:0A",
    x: 580,
    y: 275,
    ports: ["ten0/1", "ten0/2", "ten0/3", "ten0/4"]
  },
  {
    id: "SW-004",
    hostname: "DataCenter-Switch",
    type: "Switch",
    ip: "172.16.0.10",
    subnet: "255.255.255.0",
    gateway: "10.0.0.10",
    area: "LAN",
    subArea: "Campus Data Center (172.16.0.0/24)",
    location: "Data Center Tier-3 Row 1",
    status: "Active",
    mac: "00:1A:2B:DC:01:01",
    x: 720,
    y: 180,
    ports: ["gi0/1", "gi0/2", "gi0/3", "ten0/1"]
  },
  {
    id: "SRV-001",
    hostname: "Campus-Web-Portal",
    type: "Server",
    ip: "172.16.0.25",
    subnet: "255.255.255.0",
    gateway: "172.16.0.10",
    area: "LAN",
    subArea: "Campus Data Center (172.16.0.0/24)",
    location: "Blade Enclosure 01",
    status: "Active",
    mac: "00:1A:2B:DC:25:25",
    x: 840,
    y: 140,
    ports: ["eth0", "eth1"]
  },
  {
    id: "SRV-002",
    hostname: "Campus-DNS",
    type: "Server",
    ip: "172.16.0.53",
    subnet: "255.255.255.0",
    gateway: "172.16.0.10",
    area: "LAN",
    subArea: "Campus Data Center (172.16.0.0/24)",
    location: "Blade Enclosure 02",
    status: "Active",
    mac: "00:1A:2B:DC:53:53",
    x: 840,
    y: 230,
    ports: ["eth0"]
  },
  {
    id: "RT-005",
    hostname: "Campus-Edge-Router",
    type: "Router",
    ip: "203.0.113.1",
    subnet: "255.255.255.252",
    gateway: "203.0.113.2",
    area: "WAN",
    subArea: "WAN Gateway & Cloud (203.0.113.0/24)",
    location: "Campus Telco Room",
    status: "Active",
    mac: "00:1A:2B:EE:01:01",
    x: 720,
    y: 380,
    ports: ["gi0/1", "serial0/1"]
  },
  {
    id: "CLD-001",
    hostname: "External-Cloud-Host",
    type: "Cloud Host",
    ip: "203.0.113.100",
    subnet: "255.255.255.0",
    gateway: "203.0.113.1",
    area: "WAN",
    subArea: "WAN Gateway & Cloud (203.0.113.0/24)",
    location: "AWS / Global Internet Tier 1",
    status: "Standby",
    mac: "52:54:00:FE:ED:01",
    x: 850,
    y: 380,
    ports: ["wan0"]
  }
];

export const INITIAL_LINKS = [
  { id: "L-01", from: "PC-001", to: "SW-001", bandwidth: "100 Mbps", type: "lan", latency: 1, loss: 0, status: "Online" },
  { id: "L-02", from: "PC-002", to: "SW-001", bandwidth: "100 Mbps", type: "lan", latency: 1, loss: 0, status: "Online" },
  { id: "L-03", from: "SW-001", to: "RT-001", bandwidth: "1 Gbps", type: "lan", latency: 2, loss: 0, status: "Online" },
  
  { id: "L-04", from: "PC-003", to: "SW-002", bandwidth: "100 Mbps", type: "lan", latency: 1, loss: 0, status: "Online" },
  { id: "L-05", from: "PC-004", to: "SW-002", bandwidth: "100 Mbps", type: "lan", latency: 1, loss: 0, status: "Online" },
  { id: "L-06", from: "SW-002", to: "RT-002", bandwidth: "1 Gbps", type: "lan", latency: 2, loss: 0, status: "Online" },

  { id: "L-07", from: "RT-001", to: "RT-003", bandwidth: "1 Gbps", type: "man", latency: 4, loss: 0, status: "Online" },
  { id: "L-08", from: "RT-002", to: "RT-004", bandwidth: "1 Gbps", type: "man", latency: 4, loss: 0, status: "Online" },
  
  { id: "L-09", from: "RT-003", to: "RT-004", bandwidth: "10 Gbps", type: "man-fiber", latency: 3, loss: 0, status: "Online", name: "MAN Core Fiber Backbone" },
  { id: "L-10", from: "RT-003", to: "SW-003", bandwidth: "10 Gbps", type: "man", latency: 3, loss: 0, status: "Online" },
  { id: "L-11", from: "RT-004", to: "SW-003", bandwidth: "10 Gbps", type: "man", latency: 3, loss: 0, status: "Online" },

  { id: "L-12", from: "SW-003", to: "SW-004", bandwidth: "10 Gbps", type: "lan", latency: 3, loss: 0, status: "Online" },
  { id: "L-13", from: "SW-004", to: "SRV-001", bandwidth: "1 Gbps", type: "lan", latency: 2, loss: 0, status: "Online" },
  { id: "L-14", from: "SW-004", to: "SRV-002", bandwidth: "1 Gbps", type: "lan", latency: 2, loss: 0, status: "Online" },

  { id: "L-15", from: "SW-003", to: "RT-005", bandwidth: "1 Gbps", type: "wan", latency: 6, loss: 0.1, status: "Online" },
  { id: "L-16", from: "RT-005", to: "CLD-001", bandwidth: "1.5 Mbps", type: "wan-isp", latency: 28, loss: 0.2, status: "Online", name: "WAN ISP Uplink" }
];

export const INITIAL_ROUTING_TABLE = [
  { id: 1, destination: "192.168.10.0/24", nextHop: "Directly Connected", interface: "gi0/0 (CSE-LAN)", metric: 1, protocol: "Connected", status: "Active", age: "00:04:12" },
  { id: 2, destination: "192.168.20.0/24", nextHop: "10.0.0.2", interface: "gi0/1 (MAN-02)", metric: 20, protocol: "OSPF", status: "Active", age: "00:15:30" },
  { id: 3, destination: "10.0.0.0/16", nextHop: "10.0.0.1", interface: "gi0/1 (MAN-01)", metric: 10, protocol: "OSPF", status: "Active", age: "01:22:04" },
  { id: 4, destination: "172.16.0.0/24", nextHop: "10.0.0.3", interface: "ten0/1 (CORE-01)", metric: 15, protocol: "RIP", status: "Active", age: "00:08:45" },
  { id: 5, destination: "203.0.113.0/24", nextHop: "10.0.0.10", interface: "ten0/2 (EDGE-GW)", metric: 25, protocol: "OSPF", status: "Active", age: "02:10:11" },
  { id: 6, destination: "0.0.0.0/0", nextHop: "203.0.113.1", interface: "serial0/1 (ISP-WAN)", metric: 1, protocol: "Static", status: "Active", age: "05:40:22" }
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: 1, time: "10:42:18", type: "packet", message: "Packet delivered: CSE-PC-01 → CSE-Gateway", status: "success" },
  { id: 2, time: "10:41:52", type: "routing", message: "OSPF route updated: North-Core → Data Center (Cost: 15)", status: "info" },
  { id: 3, time: "10:40:31", type: "health", message: "Link health check: 16/16 links online & nominal", status: "success" },
  { id: 4, time: "10:38:15", type: "system", message: "Dijkstra SPF recalculation completed in 1.2ms", status: "info" },
  { id: 5, time: "10:35:02", type: "arp", message: "ARP cache refreshed on Campus-Aggregation-Switch", status: "info" }
];

export const CHAOS_SCENARIOS = [
  {
    id: "fiber-cut",
    tag: "FAULT-TOLERANCE",
    tagColor: "orange",
    title: "MAN Backbone Fiber Cut (Failover Test)",
    description: "Simulate a physical fiber cable cut between North Core Router and South Core Router.",
    expected: "Traffic should reroute through the alternate campus aggregation path with slight latency increase.",
    buttonLabel: "Trigger Fault Scenario",
    impact: {
      brokenLinkId: "L-09",
      brokenDevices: [],
      latencyPenalty: 18,
      packetLossPenalty: 0.8,
      bandwidthReduction: 0.5,
      alert: "WARNING: Physical fiber link severed on North-South MAN Core Backbone! OSPF dynamic reroute active."
    }
  },
  {
    id: "ddos-attack",
    tag: "SECURITY",
    tagColor: "red",
    title: "DDoS Attack on Campus Web Portal",
    description: "Simulate a distributed denial-of-service SYN flood against the primary Campus Web Portal server.",
    expected: "Massive simulated packet spike, elevated response latency, and portal status degraded to Warning.",
    buttonLabel: "Trigger Fault Scenario",
    impact: {
      targetDeviceId: "SRV-001",
      deviceStatusOverride: "Warning",
      packetBurst: 1850,
      latencyPenalty: 95,
      packetLossPenalty: 4.5,
      alert: "SECURITY ALERT: High-volume SYN flood attack detected targeting Campus-Web-Portal (172.16.0.25)!"
    }
  },
  {
    id: "core-congestion",
    tag: "PERFORMANCE",
    tagColor: "yellow",
    title: "North Campus Core Router Congestion",
    description: "Simulate severe peak-hour congestion and buffer overflow on the North Campus Core gateway.",
    expected: "Reduced effective bandwidth, queue latency spikes, and high packet drop probability.",
    buttonLabel: "Trigger Fault Scenario",
    impact: {
      targetDeviceId: "RT-003",
      deviceStatusOverride: "Warning",
      bandwidthReduction: 0.7,
      latencyPenalty: 52,
      packetLossPenalty: 2.1,
      alert: "PERFORMANCE ALERT: Queue saturation on North-Campus-Core interface buffer! Bandwidth throttled."
    }
  },
  {
    id: "wan-degradation",
    tag: "PERFORMANCE",
    tagColor: "purple",
    title: "WAN Uplink Degradation & Packet Storm",
    description: "Simulate ISP uplink degradation, packet jitter, and packet storm on the external WAN gateway.",
    expected: "Internet traffic experiences severe packet loss (12.4%) and high round-trip latency.",
    buttonLabel: "Trigger Fault Scenario",
    impact: {
      brokenLinkId: "L-16",
      targetDeviceId: "RT-005",
      latencyPenalty: 140,
      packetLossPenalty: 12.4,
      bandwidthReduction: 0.85,
      alert: "CARRIER ALERT: Upstream ISP carrier circuit degraded on Campus-Edge-Router WAN link!"
    }
  }
];

export const INITIAL_TIME_SERIES = [
  { time: "10:35", throughput: 4.2, packets: 120, latency: 38, bandwidth: 4.2, loss: 0.1 },
  { time: "10:36", throughput: 4.4, packets: 145, latency: 40, bandwidth: 4.4, loss: 0.1 },
  { time: "10:37", throughput: 4.8, packets: 190, latency: 41, bandwidth: 4.8, loss: 0.2 },
  { time: "10:38", throughput: 5.1, packets: 210, latency: 42, bandwidth: 5.1, loss: 0.2 },
  { time: "10:39", throughput: 4.6, packets: 160, latency: 39, bandwidth: 4.6, loss: 0.1 },
  { time: "10:40", throughput: 4.9, packets: 220, latency: 43, bandwidth: 4.9, loss: 0.2 },
  { time: "10:41", throughput: 4.82, packets: 195, latency: 42, bandwidth: 4.82, loss: 0.2 }
];
