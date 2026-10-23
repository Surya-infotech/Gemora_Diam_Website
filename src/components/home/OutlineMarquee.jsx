import React from "react";
import { Sparkles } from "lucide-react";

const MARQUEE_ITEMS = [
  { prefix: "Handcrafted For Your", accent: "Forever", highlight: true },
  { prefix: "100% Ethically Certified", accent: "Lab Diamonds", highlight: false },
  { prefix: "Complimentary Insured", accent: "Global Delivery", highlight: false },
  { prefix: "Bespoke Atelier", accent: "Craftsmanship", highlight: true },
  { prefix: "Lifetime Atelier", accent: "Warranty", highlight: false },
  { prefix: "Custom Fine Jewelry", accent: "Designed For You", highlight: true },
];

export default function OutlineMarquee() {
  // Duplicate twice to create continuous seamless 50% loop
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      style={{
        borderTop: "1px solid rgba(197, 160, 89, 0.28)",
        borderBottom: "1px solid rgba(197, 160, 89, 0.28)",
        padding: "clamp(18px, 2.6vw, 24px) 0",
        overflow: "hidden",
        backgroundColor: "#FAF8F5",
        position: "relative",
        width: "100%",
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)"
      }}
    >
      <div
        className="animate-marquee"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "clamp(36px, 5vw, 64px)",
          whiteSpace: "nowrap"
        }}
      >
        {repeated.map((item, index) => (
          <React.Fragment key={index}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                fontWeight: 400,
                color: "#181818",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{item.prefix}</span>
              {item.accent && (
                <span
                  style={{
                    fontStyle: "italic",
                    color: item.highlight ? "var(--primary)" : "var(--gold-deep)",
                    fontWeight: 500
                  }}
                >
                  {item.accent}
                </span>
              )}
            </span>

            {/* Luxury Diamond Sparkle Emblem */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--gold)",
                fontSize: "0.85rem",
                flexShrink: 0
              }}
            >
              <span style={{ width: "12px", height: "1px", backgroundColor: "rgba(197, 160, 89, 0.5)" }} />
              <Sparkles size={13} style={{ color: "var(--gold)" }} />
              <span style={{ width: "12px", height: "1px", backgroundColor: "rgba(197, 160, 89, 0.5)" }} />
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
