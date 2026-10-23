import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../lib/store";
import SectionHeading from "../SectionHeading";

function cleanCategoryData(c, i) {
  const title = c.categoryname || c.title || "Jewelry";
  const desc = c.description || c.desc || "";
  const img = c.image || c.categoryimage || c.img || "";

  return {
    id: c._id || c.categoryid || c.id || i,
    title,
    desc,
    img,
    link: `/collections?category=${encodeURIComponent(title)}`
  };
}

export default function CircularCategories() {
  const { categories } = useStore();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!categories || categories.length === 0) {
    return null;
  }

  const cards = categories
    .filter((c) => c && (c.categoryname || c.title))
    .map(cleanCategoryData);

  if (cards.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: "clamp(60px, 7vw, 96px) 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Section Header */}
        <SectionHeading
          eyebrow="Atelier Curations"
          title="Signature Collections"
          description="Explore masterfully sculpted designs crafted with ethical lab-grown diamonds and recycled precious metals."
        />

        {/* High-End Editorial Category Cards Grid */}
        <div className="categories-balanced-grid">
          {cards.map((c, i) => {
            const isHovered = hoveredIdx === i;

            return (
              <Link
                key={c.id || i}
                to={c.link}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#FAF9F6",
                  borderRadius: "20px",
                  border: isHovered ? "1px solid var(--primary)" : "1px solid #EAE5D9",
                  overflow: "hidden",
                  textDecoration: "none",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? "0 20px 45px rgba(85, 104, 50, 0.12)"
                    : "0 4px 20px rgba(0, 0, 0, 0.03)"
                }}
              >
                {/* 1. Portrait Photographic Hero Window */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "clamp(260px, 28vw, 340px)",
                    overflow: "hidden",
                    backgroundColor: "#f2ece1"
                  }}
                >
                  <img
                    src={c.img}
                    alt={c.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                      transform: isHovered ? "scale(1.06)" : "scale(1)"
                    }}
                  />

                  {/* Gentle Bottom Gradient Shadow */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(20, 26, 16, 0.45) 0%, rgba(20, 26, 16, 0.05) 50%, rgba(0,0,0,0) 100%)",
                      pointerEvents: "none"
                    }}
                  />
                </div>

                {/* 2. Card Editorial Details Surface */}
                <div
                  style={{
                    padding: "clamp(22px, 3vw, 30px) clamp(18px, 2.5vw, 26px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    flexGrow: 1
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)",
                      color: "var(--foreground)",
                      margin: "0 0 10px 0",
                      fontWeight: 500,
                      lineHeight: 1.2
                    }}
                  >
                    {c.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.86rem",
                      color: "var(--muted-foreground)",
                      lineHeight: 1.6,
                      maxWidth: "290px",
                      margin: "0 0 22px 0",
                      flexGrow: 1
                    }}
                  >
                    {c.desc}
                  </p>

                  {/* 3. Luxury Action Button in Gemora Brand Primary Green */}
                  <div
                    style={{
                      marginTop: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "9px 24px",
                      borderRadius: "999px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      backgroundColor: isHovered ? "var(--primary)" : "var(--primary-soft)",
                      color: isHovered ? "#ffffff" : "var(--primary)",
                      border: isHovered ? "1px solid var(--primary)" : "1px solid rgba(85, 104, 50, 0.28)",
                      transition: "all 0.25s ease",
                      boxShadow: isHovered ? "0 4px 14px rgba(85, 104, 50, 0.3)" : "none"
                    }}
                  >
                    <span>Explore Collection</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
