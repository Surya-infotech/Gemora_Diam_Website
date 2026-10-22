import React from "react";

const MARQUEE_ITEMS = [
  { text: "Bespoke Atelier", outline: true },
  { text: "Ethical Lab Diamonds", outline: false },
  { text: "Insured Worldwide Delivery", outline: true },
  { text: "Certified Authenticity", outline: false },
];

export default function OutlineMarquee() {
  // Duplicate items twice to guarantee smooth seamless loop on ultra-wide screens
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      style={{
        borderTop: "1px solid #EAE3D5",
        borderBottom: "1px solid #EAE3D5",
        padding: "clamp(16px, 3vw, 26px) 0",
        overflow: "hidden",
        backgroundColor: "#FAF9F6",
        width: "100vw",
        maxWidth: "100%"
      }}
    >
      <div className="animate-marquee" style={{ display: "inline-flex", alignItems: "center", gap: "clamp(30px, 5vw, 60px)" }}>
        {repeated.map((item, index) => (
          <React.Fragment key={index}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 3.2vw, 2.8rem)",
                fontWeight: 400,
                WebkitTextStroke: item.outline ? "1px #708447" : "none",
                color: item.outline ? "transparent" : "var(--foreground)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap"
              }}
            >
              {item.text}
            </span>
            <span style={{ color: "var(--gold)", fontSize: "clamp(1rem, 2vw, 1.4rem)", flexShrink: 0 }}>✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
