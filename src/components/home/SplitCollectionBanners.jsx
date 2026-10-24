import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../lib/store";

export default function SplitCollectionBanners() {
  const { collectionBanners } = useStore();
  const [hoveredId, setHoveredId] = useState(null);

  if (!Array.isArray(collectionBanners) || collectionBanners.length === 0) {
    return null;
  }

  return (
    <section style={{ backgroundColor: "#ffffff", padding: "clamp(48px, 6vw, 84px) 0" }}>
      <div className="container-luxury" style={{ display: "flex", flexDirection: "column", gap: "clamp(36px, 5vw, 64px)" }}>
        {collectionBanners.map((b, i) => {
          const isLeft = b.position === "left" || (!b.position && i % 2 === 0);
          const bannerId = b._id || b.bannerid || i;
          const isHovered = hoveredId === bannerId;

          const tagText = b.tag || "Featured Collection";

          return (
            <div
              key={bannerId}
              onMouseEnter={() => setHoveredId(bannerId)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: "relative",
                backgroundColor: "#FAF8F5",
                backgroundImage: "linear-gradient(135deg, #FAF8F5 0%, #F5F0E6 100%)",
                borderRadius: "28px",
                border: isHovered ? "1px solid rgba(85, 104, 50, 0.45)" : "1px solid #EAE3D5",
                padding: "clamp(16px, 2.5vw, 24px)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                alignItems: "center",
                gap: "clamp(24px, 4vw, 56px)",
                boxShadow: isHovered
                  ? "0 22px 50px rgba(85, 104, 50, 0.12)"
                  : "0 8px 30px rgba(28, 34, 23, 0.04)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <style>{`
                @media (max-width: 768px) {
                  .split-banner-image-col {
                    order: 1 !important;
                    height: clamp(240px, 55vw, 360px) !important;
                  }
                  .split-banner-content-col {
                    order: 2 !important;
                    padding: 16px 8px !important;
                  }
                }
              `}</style>
              {/* IMAGE COLUMN */}
              <div
                className="split-banner-image-col"
                style={{
                  order: isLeft ? 1 : 2,
                  position: "relative",
                  height: "clamp(340px, 40vw, 480px)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: "#EFEBE2",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
                }}
              >
                <img
                  src={b.image}
                  alt={b.title || "Collection"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isHovered ? "scale(1.05)" : "scale(1)"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(20, 26, 16, 0.3) 0%, rgba(0,0,0,0) 40%)",
                    pointerEvents: "none"
                  }}
                />
              </div>

              {/* CONTENT COLUMN */}
              <div
                className="split-banner-content-col"
                style={{
                  order: isLeft ? 2 : 1,
                  padding: "clamp(16px, 3vw, 40px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                {/* Eyebrow matching signature gold line design */}
                <p
                  className="eyebrow"
                  style={{
                    color: "var(--gold-deep)",
                    marginBottom: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase"
                  }}
                >
                  <span style={{ height: "1px", width: "24px", backgroundColor: "var(--gold)" }} />
                  {tagText}
                  <span style={{ height: "1px", width: "24px", backgroundColor: "var(--gold)" }} />
                </p>

                {/* Editorial Title */}
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.2rem, 3.8vw, 3.2rem)",
                    lineHeight: 1.14,
                    fontWeight: 500,
                    color: "var(--foreground)",
                    margin: "0 0 16px 0"
                  }}
                >
                  {b.title}
                </h2>

                {/* Description */}
                {b.description && (
                  <p
                    style={{
                      fontSize: "clamp(0.92rem, 1.2vw, 1rem)",
                      lineHeight: 1.75,
                      color: "var(--muted-foreground)",
                      maxWidth: "520px",
                      margin: "0 0 24px 0"
                    }}
                  >
                    {b.description}
                  </p>
                )}

                {/* Luxury Atelier Guarantee Highlights */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "14px 20px",
                    marginBottom: "32px",
                    paddingBottom: "24px",
                    borderBottom: "1px solid #EAE3D5"
                  }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#555" }}>
                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>✦</span>
                    <span>100% Certified Lab Diamonds</span>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#555" }}>
                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>✦</span>
                    <span>18K Gold &amp; Platinum</span>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#555" }}>
                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>✦</span>
                    <span>Lifetime Warranty</span>
                  </div>
                </div>

                {/* Action CTA Group */}
                <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
                  <Link
                    to={b.buttonLink || "/collections"}
                    className="eyebrow"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "13px 32px",
                      backgroundColor: "var(--primary)",
                      color: "#ffffff",
                      borderRadius: "999px",
                      fontSize: "0.76rem",
                      fontWeight: 600,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      boxShadow: "0 6px 20px rgba(85, 104, 50, 0.3)",
                      transition: "all 0.25s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(85, 104, 50, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(85, 104, 50, 0.3)";
                    }}
                  >
                    <span>{b.buttonText || "EXPLORE COLLECTION"}</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/contact"
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      textDecoration: "none",
                      borderBottom: "1.5px solid var(--gold)",
                      paddingBottom: "3px",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                  >
                    Book Consultation →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}