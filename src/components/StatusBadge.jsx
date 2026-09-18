import React from 'react';

export default function StatusBadge({ status, text, size = "md" }) {
  const displayStatus = status || text || "Active";
  const label = text || status;

  let colorClass = "bg-slate-800 text-slate-300 border-slate-700";
  let dotColor = "#94a3b8";

  const lower = String(displayStatus).toLowerCase();

  if (lower === "active" || lower === "online" || lower === "healthy" || lower === "delivered" || lower === "connected" || lower === "normal") {
    colorClass = "status-badge-success";
    dotColor = "#10b981";
  } else if (lower === "warning" || lower === "degraded" || lower === "congested" || lower === "in-transit" || lower === "standby") {
    colorClass = "status-badge-warning";
    dotColor = "#f59e0b";
  } else if (lower === "down" || lower === "error" || lower === "fault" || lower === "dropped" || lower === "failed") {
    colorClass = "status-badge-danger";
    dotColor = "#ef4444";
  } else if (lower === "lan") {
    colorClass = "status-badge-cyan";
    dotColor = "#00d2ff";
  } else if (lower === "man") {
    colorClass = "status-badge-purple";
    dotColor = "#a855f7";
  } else if (lower === "wan") {
    colorClass = "status-badge-orange";
    dotColor = "#f97316";
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: size === "sm" ? "2px 8px" : "4px 10px",
        borderRadius: "9999px",
        fontSize: size === "sm" ? "0.7rem" : "0.75rem",
        fontWeight: "600",
        letterSpacing: "0.02em",
        border: "1px solid currentColor",
        lineHeight: 1
      }}
      className={colorClass}
    >
      <span
        style={{
          width: size === "sm" ? "6px" : "7px",
          height: size === "sm" ? "6px" : "7px",
          borderRadius: "50%",
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${dotColor}`
        }}
      />
      {label}
    </span>
  );
}
