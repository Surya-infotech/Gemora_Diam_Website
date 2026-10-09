import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../lib/store";

import banner5 from "../../assets/vemus/banner_banner-5.jpg";
import banner6 from "../../assets/vemus/banner_banner-6.jpg";

export default function SplitCollectionBanners() {
  const { categories } = useStore();

  if (!categories || categories.length < 2) {
    return null;
  }

  const cat1 = categories[0];
  const cat2 = categories[1];
  const img1 = cat1.image || banner5;
  const img2 = cat2.image || banner6;

  return (
    <section style={{ backgroundColor: "#ffffff", padding: "40px 0 60px 0" }}>
      <div className="container-luxury" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {/* Banner 1: Image Left, Content Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            backgroundColor: "#faf8f5",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.04)",
            border: "1px solid #f0eae1"
          }}
        >
          <div style={{ minHeight: "280px", maxHeight: "360px", height: "100%", overflow: "hidden", position: "relative" }}>
            <img
              src={img1}
              alt={cat1.categoryname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.8s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          <div
            style={{
              padding: "clamp(24px, 4vw, 42px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#faf8f5"
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--primary)",
                marginBottom: "10px",
                display: "inline-block"
              }}
            >
              Featured Collection
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.7rem, 2.8vw, 2.2rem)",
                lineHeight: 1.2,
                fontWeight: 400,
                color: "#181818",
                marginBottom: "12px"
              }}
            >
              {cat1.categoryname} Collection
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.6,
                color: "#666666",
                maxWidth: "460px",
                marginBottom: "22px"
              }}
            >
              {cat1.description || `Explore our signature handcrafted ${cat1.categoryname.toLowerCase()} pieces designed for elegance and timeless charm.`}
            </p>
            <div>
              <Link
                to={`/shop?category=${encodeURIComponent(cat1.categoryname)}`}
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "11px 26px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "2px",
                  fontSize: "0.76rem",
                  letterSpacing: "0.16em",
                  textDecoration: "none",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.92";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Shop Collection <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: Content Left, Image Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            backgroundColor: "#faf8f5",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.04)",
            border: "1px solid #f0eae1"
          }}
        >
          <div
            style={{
              padding: "clamp(24px, 4vw, 42px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#faf8f5"
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--primary)",
                marginBottom: "10px",
                display: "inline-block"
              }}
            >
              Curated Craftsmanship
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.7rem, 2.8vw, 2.2rem)",
                lineHeight: 1.2,
                fontWeight: 400,
                color: "#181818",
                marginBottom: "12px"
              }}
            >
              {cat2.categoryname} Collection
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.6,
                color: "#666666",
                maxWidth: "460px",
                marginBottom: "22px"
              }}
            >
              {cat2.description || `Celebrate special moments with our exquisite ${cat2.categoryname.toLowerCase()} sculpted with certified stones.`}
            </p>
            <div>
              <Link
                to={`/shop?category=${encodeURIComponent(cat2.categoryname)}`}
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "11px 26px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "2px",
                  fontSize: "0.76rem",
                  letterSpacing: "0.16em",
                  textDecoration: "none",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.92";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Shop Collection <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div style={{ minHeight: "280px", maxHeight: "360px", height: "100%", overflow: "hidden", position: "relative" }}>
            <img
              src={img2}
              alt={cat2.categoryname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.8s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
