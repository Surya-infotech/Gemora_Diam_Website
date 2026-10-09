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
    <section style={{ backgroundColor: "#ffffff", padding: "40px 0 80px 0" }}>
      <div className="container-luxury" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {/* Banner 1: Image Left, Content Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            backgroundColor: "#FAF9F6",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
            border: "1px solid #EAE3D5"
          }}
        >
          <div style={{ minHeight: "320px", maxHeight: "420px", height: "100%", overflow: "hidden", position: "relative" }}>
            <img
              src={img1}
              alt={cat1.categoryname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          <div
            style={{
              padding: "clamp(32px, 5vw, 56px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#FAF9F6"
            }}
          >
            <span
              className="eyebrow"
              style={{
                color: "var(--primary)",
                letterSpacing: "0.24em",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "12px"
              }}
            >
              <span>✦</span>
              <span>FEATURED ATELIER</span>
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 3.2vw, 2.6rem)",
                lineHeight: 1.18,
                fontWeight: 400,
                color: "var(--foreground)",
                marginBottom: "14px"
              }}
            >
              {cat1.categoryname} Collection
            </h2>
            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.7,
                color: "var(--muted-foreground)",
                maxWidth: "480px",
                marginBottom: "28px"
              }}
            >
              {cat1.description || `Explore our signature handcrafted ${cat1.categoryname.toLowerCase()} pieces designed for elegance, brilliance, and timeless charm.`}
            </p>
            <div>
              <Link
                to={`/shop?category=${encodeURIComponent(cat1.categoryname)}`}
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "13px 30px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "2px",
                  fontSize: "0.78rem",
                  letterSpacing: "0.18em",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(85, 104, 50, 0.25)",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: Content Left, Image Right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            backgroundColor: "#FAF9F6",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
            border: "1px solid #EAE3D5"
          }}
        >
          <div
            style={{
              padding: "clamp(32px, 5vw, 56px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#FAF9F6"
            }}
          >
            <span
              className="eyebrow"
              style={{
                color: "var(--primary)",
                letterSpacing: "0.24em",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "12px"
              }}
            >
              <span>✦</span>
              <span>CURATED CRAFTSMANSHIP</span>
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 3.2vw, 2.6rem)",
                lineHeight: 1.18,
                fontWeight: 400,
                color: "var(--foreground)",
                marginBottom: "14px"
              }}
            >
              {cat2.categoryname} Collection
            </h2>
            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.7,
                color: "var(--muted-foreground)",
                maxWidth: "480px",
                marginBottom: "28px"
              }}
            >
              {cat2.description || `Celebrate special moments with our exquisite ${cat2.categoryname.toLowerCase()} sculpted with certified stones and flawless finishing.`}
            </p>
            <div>
              <Link
                to={`/shop?category=${encodeURIComponent(cat2.categoryname)}`}
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "13px 30px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "2px",
                  fontSize: "0.78rem",
                  letterSpacing: "0.18em",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(85, 104, 50, 0.25)",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div style={{ minHeight: "320px", maxHeight: "420px", height: "100%", overflow: "hidden", position: "relative" }}>
            <img
              src={img2}
              alt={cat2.categoryname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
