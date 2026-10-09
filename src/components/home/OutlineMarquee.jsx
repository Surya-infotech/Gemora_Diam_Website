export default function OutlineMarquee() {
  return (
    <div
      style={{
        borderTop: "1px solid #ebebeb",
        borderBottom: "1px solid #ebebeb",
        padding: "24px 0",
        overflow: "hidden",
        backgroundColor: "#faf9f7"
      }}
    >
      <div className="animate-marquee" style={{ display: "inline-flex", alignItems: "center", gap: "50px" }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            WebkitTextStroke: "1px #555555",
            color: "transparent",
            letterSpacing: "0.08em"
          }}
        >
          NOW, PAY LATER
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            color: "#333333",
            letterSpacing: "0.08em"
          }}
        >
          SHOP NOW
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            WebkitTextStroke: "1px #555555",
            color: "transparent",
            letterSpacing: "0.08em"
          }}
        >
          FREE SHIPPING
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            color: "#333333",
            letterSpacing: "0.08em"
          }}
        >
          100% CERTIFIED
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
      </div>
    </div>
  );
}
