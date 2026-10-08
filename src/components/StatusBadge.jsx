export function StatusBadge({ s }) {
  const getStyle = () => {
    switch (s) {
      case "Delivered":
        return { backgroundColor: "var(--primary)", color: "#ffffff" };
      case "Shipped":
        return { backgroundColor: "var(--gold)", color: "#ffffff" };
      case "Crafted":
        return { backgroundColor: "var(--primary-soft)", color: "var(--primary)", border: "1px solid var(--border)" };
      default:
        return { backgroundColor: "var(--blush)", color: "#ffffff" };
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
