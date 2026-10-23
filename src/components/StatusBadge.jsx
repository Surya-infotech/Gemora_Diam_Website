export function StatusBadge({ s }) {
  const getStyle = () => {
    switch (s) {
      case "Delivered":
        return {
          backgroundColor: "var(--primary)",
          color: "#ffffff",
          border: "1px solid var(--primary)"
        };
      case "Shipped":
        return {
          backgroundColor: "rgba(30, 64, 175, 0.08)",
          color: "#1d4ed8",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        };
      case "Processing":
        return {
          backgroundColor: "rgba(197, 160, 89, 0.12)",
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
          border: "1px solid rgba(85, 104, 50, 0.25)"
        };
    }
  };

  return (
    <span
      className="eyebrow"
      style={{
        padding: "4px 12px",
        fontSize: "0.66rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        borderRadius: "999px",
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        whiteSpace: "nowrap",
        ...getStyle()
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: "currentColor"
        }}
      />
      <span>{s || "Confirmed"}</span>
    </span>
  );
}
