import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../../lib/store";
import SectionHeading from "../SectionHeading";

const CURATED_FALLBACKS = {
  bracelets: {
    img: "https://images.unsplash.com/photo-1611591475155-426475489c36?q=80&w=1000&auto=format&fit=crop",
    desc: "Handcrafted tennis and cuff bracelets sculpted with certified conflict-free diamonds."
  },
  "bridal sets": {
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop",
    desc: "Harmonized engagement and wedding eternity bands designed to sit flush forever."
  },
  earrings: {
    img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop",
    desc: "Luminous diamond studs, drops, and cascading chandeliers cut for exceptional brilliance."
  },
  "engagement rings": {
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
    desc: "Solitaire, halo, and three-stone silhouettes set with certified lab-grown diamonds."
  },
  "wedding bands": {
    img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1000&auto=format&fit=crop",
    desc: "Eternity and comfort-fit wedding bands forged in recycled 18k gold and platinum."
  }
};

const DEFAULT_CATEGORIES = [
  {
    id: "cat-1",
    img: "https://images.unsplash.com/photo-1611591475155-426475489c36?q=80&w=1000&auto=format&fit=crop",
    title: "Bracelets",
    desc: "Handcrafted tennis and cuff bracelets sculpted with certified conflict-free diamonds.",
    link: "/collections?category=Bracelets"
  },
  {
    id: "cat-2",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop",
    title: "Bridal Sets",
    desc: "Harmonized engagement and wedding eternity bands designed to sit flush forever.",
    link: "/collections?category=Bridal+Sets"
  },
  {
    id: "cat-3",
    img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop",
    title: "Earrings",
    desc: "Luminous diamond studs, drops, and cascading chandeliers cut for exceptional brilliance.",
    link: "/collections?category=Earrings"
  }
];

function cleanCategoryData(c, i) {
  const title = c.categoryname || c.title || "Jewelry";
  const key = title.trim().toLowerCase();
  const fallback = CURATED_FALLBACKS[key] || {
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
    desc: "Masterfully sculpted fine jewelry pieces crafted with ethical diamonds and recycled precious metals."
  };

  const rawDesc = c.description || c.desc || "";
  const isGibberish = !rawDesc || rawDesc.trim().length < 8 || /sdfsdf|asdf|test|lorem|qwerty/i.test(rawDesc);
  const desc = isGibberish ? fallback.desc : rawDesc.trim();

  // If image is missing, use curated fallback
  const rawImg = c.image || c.categoryimage || c.img || "";
  const img = rawImg && rawImg.trim() ? rawImg : fallback.img;

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

  const rawCards = (categories && categories.length > 0) ? categories : DEFAULT_CATEGORIES;
  const cards = rawCards.map(cleanCategoryData);

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

                  {/* Top Floating Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.94)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "0.66rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    <Sparkles size={11} style={{ color: "var(--gold)" }} />
                    <span>Curated</span>
                  </div>
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
