import { ShieldCheck, Truck, RefreshCw, Sparkles } from "lucide-react";
import SectionHeading from "../SectionHeading";

const PROMISES = [
  {
    icon: Truck,
    title: "Complimentary Insured Shipping",
    desc: "Discreet luxury delivery direct to your door with full insurance coverage."
  },
  {
    icon: RefreshCw,
    title: "7-Day Free Returns & Resizing",
    desc: "Try it in person with complete peace of mind. Complimentary ring resizing included."
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Warranty",
    desc: "Annual prong inspection, ultrasonic diamond cleaning, and lifetime craftsmanship guarantee."
  },
  {
    icon: Sparkles,
    title: "100% Certified Lab Diamonds",
    desc: "Kimberley Process compliant, IGI & GIA certified diamonds with exceptional fire."
  }
];

export default function TrustBadgesSection() {
  return (
    <section
      aria-label="The Gemora Diam Promise"
      style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #ECE7DD",
        borderBottom: "1px solid #ECE7DD",
        padding: "clamp(48px, 6vw, 72px) 0"
      }}
    >
      <div className="container-luxury">
        {/* Section Header */}
        <SectionHeading
          eyebrow="The Gemora Promise"
          title="Craftsmanship & Care"
          description="Every bespoke design is backed by our lifetime warranty, certified diamonds, and master craftsmanship."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "clamp(24px, 3.5vw, 40px)",
            alignItems: "flex-start"
          }}
        >
          {PROMISES.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  textAlign: "left"
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-soft)",
                    color: "var(--primary)",
                    border: "1px solid rgba(85, 104, 50, 0.2)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(85, 104, 50, 0.08)"
                  }}
                >
                  <IconComponent size={22} strokeWidth={1.6} />
                </div>

                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      margin: "0 0 4px 0",
                      lineHeight: 1.25
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--muted-foreground)",
                      lineHeight: 1.55,
                      margin: 0
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
