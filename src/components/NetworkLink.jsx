import React from 'react';

export default function NetworkLink({ link, fromNode, toNode, showBandwidth = true, isHighlighted = false }) {
  if (!fromNode || !toNode) return null;

  const isDown = link.status === "Down";

  // Link styling by type
  let strokeColor = "rgba(0, 210, 255, 0.4)";
  let activeStrokeColor = "#00d2ff";
  let badgeColor = "#38bdf8";

  if (link.type === "man-fiber" || link.type === "man") {
    strokeColor = "rgba(168, 85, 247, 0.45)";
    activeStrokeColor = "#c084fc";
    badgeColor = "#c084fc";
  } else if (link.type === "wan" || link.type === "wan-isp") {
    strokeColor = "rgba(249, 115, 22, 0.45)";
    activeStrokeColor = "#fb923c";
    badgeColor = "#fb923c";
  }

  if (isDown) {
    strokeColor = "#ef4444";
    activeStrokeColor = "#ef4444";
    badgeColor = "#f87171";
  } else if (isHighlighted) {
    strokeColor = "#10b981";
    activeStrokeColor = "#10b981";
  }

  const midX = (fromNode.x + toNode.x) / 2;
  const midY = (fromNode.y + toNode.y) / 2;

  const strokeWidth = link.type === "man-fiber" ? 3 : 2;

  return (
    <g className="network-link-group">
      {/* Background glow path */}
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        stroke={isDown ? 'rgba(239, 68, 68, 0.3)' : strokeColor}
        strokeWidth={strokeWidth + 2}
        strokeOpacity="0.4"
      />

      {/* Main Connection line */}
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        stroke={isDown ? '#ef4444' : strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isDown ? "4 4" : "none"}
      />

      {/* Animated Flow line when Online */}
      {!isDown && (
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke={activeStrokeColor}
          strokeWidth={strokeWidth}
          className="animated-link"
          strokeOpacity="0.8"
        />
      )}

      {/* Bandwidth Pill Label */}
      {showBandwidth && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x="-30"
            y="-10"
            width="60"
            height="20"
            rx="5"
            fill="#090e1a"
            stroke={isDown ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}
            strokeWidth="1"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill={isDown ? '#f87171' : badgeColor}
            fontSize="9"
            fontFamily="var(--font-mono)"
            fontWeight="600"
          >
            {isDown ? 'CUT' : link.bandwidth}
          </text>
        </g>
      )}
    </g>
  );
}
