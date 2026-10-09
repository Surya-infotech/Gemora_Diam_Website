export default function OutlineMarquee() {
  return (
    <div
      style={{
        borderTop: "1px solid #EAE3D5",
        borderBottom: "1px solid #EAE3D5",
        padding: "26px 0",
        overflow: "hidden",
        backgroundColor: "#FAF9F6"
      }}
    >
      <div className="animate-marquee" style={{ display: "inline-flex", alignItems: "center", gap: "60px" }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            WebkitTextStroke: "1px #708447",
            color: "transparent",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}
        >
          Bespoke Atelier
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.4rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "var(--foreground)",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}
        >
          Ethical Lab Diamonds
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.4rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            WebkitTextStroke: "1px #708447",
            color: "transparent",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}
        >
          Insured Worldwide Delivery
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.4rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "var(--foreground)",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}
        >
          Certified Authenticity
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.4rem" }}>✦</span>
      </div>
    </div>
  );
}
