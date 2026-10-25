import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../../lib/store";
import SectionHeading from "../SectionHeading";

export default function ShopTheLookSection() {
  const navigate = useNavigate();
  const { products, productsLoading, format } = useStore();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // If no dynamic products exist in the database, cleanly do not render default mock data
  if (!productsLoading && (!products || products.length === 0)) {
    return null;
  }

  // Derive dynamic look items purely from active backend products
  const looks = (products || []).slice(0, 3).map((item) => {
    const rawMetals = item.metals || [];
    const firstMetal = rawMetals[0]
      ? (typeof rawMetals[0] === "object" ? rawMetals[0].name || rawMetals[0].metalname : String(rawMetals[0]))
      : null;

    const specsList = [
      item.shapes?.[0],
      item.clarities?.[0],
      firstMetal
    ].filter(Boolean);

    const specs = specsList.length > 0 ? specsList.join(" • ") : (item.subcategory || item.category || "");
    const image = item.image || item.galleryImages?.[0] || item.gallery?.[0] || "";
    const targetLink = `/product/${item.id || item._id}`;
    const displayPrice = format ? format(item.price) : `$${item.price?.toLocaleString()}`;

    return {
      id: item.id || item._id,
      title: item.name,
      suiteTag: (item.category || "Fine Jewelry").toUpperCase(),
      specs,
      image,
      targetLink,
      displayPrice
    };
  });

  if (looks.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: "clamp(60px, 7vw, 100px) 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Luxury Gold-Lined Section Heading */}
        <SectionHeading
          eyebrow="Curated Lookbook"
          title="Curated Ensembles"
          description="Discover how our master jewelers layer and harmonize timeless solitaire and bridal pieces."
        />

        {/* 3-Column Luxury Look Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(20px, 2.5vw, 32px)",
            marginTop: "24px",
            justifyContent: "center"
          }}
        >
          {looks.map((look, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={look.id}
                onClick={() => navigate(look.targetLink)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: "relative",
                  height: "clamp(460px, 42vw, 560px)",
                  borderRadius: "22px",
                  overflow: "hidden",
                  backgroundColor: "#FAF9F6",
                  border: isHovered ? "1px solid #c5a059" : "1px solid #ebe5da",
                  boxShadow: isHovered
                    ? "0 22px 50px rgba(28, 34, 23, 0.14)"
                    : "0 10px 30px rgba(28, 34, 23, 0.05)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  maxWidth: "420px",
                  width: "100%",
                  margin: "0 auto"
                }}
              >
                {/* Background Editorial Jewelry Photography */}
                {look.image ? (
                  <img
                    src={look.image}
                    alt={look.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      objectPosition: "center",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                      transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#999", backgroundColor: "#f4f1ea" }}>
                    No Image Available
                  </div>
                )}

                {/* Refined Luxury Vignettes (Top & Bottom) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(16, 22, 13, 0.35) 0%, rgba(0,0,0,0) 30%), linear-gradient(0deg, rgba(16, 22, 13, 0.85) 0%, rgba(16, 22, 13, 0.3) 45%, rgba(0,0,0,0) 70%)",
                    pointerEvents: "none"
                  }}
                />

                {/* Bottom Inset Glassmorphic Look Card */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.96)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: "16px",
                    padding: "16px 18px",
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    boxShadow: isHovered
                      ? "0 14px 34px rgba(18, 24, 15, 0.2)"
                      : "0 8px 24px rgba(18, 24, 15, 0.12)",
                    transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                    transition: "all 0.3s ease",
                    zIndex: 2
                  }}
                >
                  {/* Top Row: Suite Category & Price */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.64rem",
                        fontWeight: 700,
                        letterSpacing: "0.20em",
                        textTransform: "uppercase",
                        color: "var(--gold-deep)"
                      }}
                    >
                      {look.suiteTag}
                    </span>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        letterSpacing: "0.02em"
                      }}
                    >
                      {look.displayPrice}
                    </span>
                  </div>

                  {/* Main Title in Luxury Serif */}
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      margin: "0 0 6px 0",
                      lineHeight: 1.25,
                      letterSpacing: "0.01em",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {look.title}
                  </h4>

                  {/* Specs & Description */}
                  {look.specs && (
                    <p
                      style={{
                        fontSize: "0.74rem",
                        color: "var(--muted-foreground)",
                        margin: "0 0 14px 0",
                        lineHeight: 1.4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {look.specs}
                    </p>
                  )}

                  {/* Bottom Action Row: Call to Action Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "1px solid #ebe5da"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--foreground)",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <Sparkles size={13} style={{ color: "var(--gold-deep)" }} />
                      <span>Bespoke Pairing</span>
                    </span>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: isHovered ? "var(--primary)" : "#f4f1ea",
                        color: isHovered ? "#ffffff" : "var(--primary)",
                        padding: "7px 15px",
                        borderRadius: "50px",
                        fontSize: "0.70rem",
                        fontWeight: 700,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        transition: "all 0.25s ease"
                      }}
                    >
                      <span style={{ color: "inherit", fontWeight: 700 }}>Shop Look</span>
                      <ArrowRight size={12} strokeWidth={2.2} style={{ color: "inherit" }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
