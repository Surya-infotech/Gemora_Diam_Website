export function StatusBadge({ s }) {
  const getStyle = () => {
    switch (s) {
      case "Delivered":
        return {
          backgroundColor: "rgba(85, 104, 50, 0.12)",
          color: "var(--primary)",
          border: "1px solid rgba(85, 104, 50, 0.3)"
        };
      case "Shipped":
        return {
          backgroundColor: "rgba(30, 64, 175, 0.08)",
          color: "#1d4ed8",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        };
      case "Processing":
        return {
          backgroundColor: "rgba(197, 160, 89, 0.14)",
          color: "var(--gold-deep)",
          border: "1px solid rgba(197, 160, 89, 0.35)"
        };
      case "Cancelled":
        return {
          backgroundColor: "#FEF2F2",
          color: "#dc2626",
          border: "1px solid #FECACA"
        };
      default: // Confirmed / Placed
        return {
          backgroundColor: "rgba(85, 104, 50, 0.1)",
          color: "var(--primary)",
          border: "1px solid rgba(85, 104, 50, 0.28)"
        };
    }
  };

  const isLive = s === "Confirmed" || s === "Processing" || s === "Shipped";

  return (
    <span
      className="eyebrow"
      style={{
        padding: "4px 12px",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        borderRadius: "999px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        ...getStyle()
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "currentColor",
          display: "inline-block",
          animation: isLive ? "statusPulse 2s ease-in-out infinite" : "none"
        }}
      />
      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.8); }
        }
      `}</style>
      <span>{s || "Confirmed"}</span>
    </span>
  );
}
