export function StatusBadge({ s }) {
  const getStyle = () => {
    switch (s) {
      case "Delivered":
        return { backgroundColor: "var(--primary)", color: "#ffffff" };
      case "Shipped":
        return { backgroundColor: "var(--gold)", color: "#ffffff" };
      case "Processing":
        return { backgroundColor: "var(--primary-soft)", color: "var(--primary)", border: "1px solid var(--border)" };
      case "Cancelled":
        return { backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" };
      default:
        return { backgroundColor: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" };
    }
  };

  return (
    <span
      className="eyebrow"
      style={{
        padding: "4px 10px",
        fontSize: "0.62rem",
        borderRadius: "2px",
        ...getStyle()
      }}
    >
      {s}
    </span>
  );
}
