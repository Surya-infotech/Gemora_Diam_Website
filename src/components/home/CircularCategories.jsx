import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "../../lib/store";

import promo1 from "../../assets/vemus/collections_promo-1.jpg";
import promo2 from "../../assets/vemus/collections_promo-2.jpg";
import promo3 from "../../assets/vemus/collections_promo-3.jpg";

export default function CircularCategories() {
  const { categories } = useStore();

  if (!categories || categories.length === 0) {
    return null;
  }

  const cards = categories.map((c, i) => ({
    img: c.image || c.categoryimage || (i % 3 === 0 ? promo1 : i % 3 === 1 ? promo2 : promo3),
    title: c.categoryname,
    desc: c.description || `Handcrafted ${c.categoryname.toLowerCase()} sculpted with certified conflict-free diamonds and gold.`,
    link: `/shop?category=${encodeURIComponent(c.categoryname)}`
  }));

  return (
    <section style={{ padding: "80px 0 60px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "36px",
            width: "100%"
          }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                borderRadius: "50%",
                border: "1px solid #e8e3d6",
                padding: "48px 36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                maxWidth: "360px",
                aspectRatio: "1/1",
                justifyContent: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
                backgroundColor: "#fcfbfa",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(174,135,62,0.12)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e8e3d6";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Pill-shaped thumbnail image */}
              <div
                style={{
                  width: "110px",
                  height: "64px",
                  borderRadius: "32px",
                  overflow: "hidden",
                  marginBottom: "18px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  flexShrink: 0
                }}
              >
                <img
                  src={c.img}
                  alt={c.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.65rem",
                  color: "var(--primary)",
                  marginBottom: "10px",
                  fontWeight: 500,
                  lineHeight: 1.2
                }}
              >
                {c.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "#666666",
                  lineHeight: 1.55,
                  maxWidth: "240px",
                  marginBottom: "20px"
                }}
              >
                {c.desc}
              </p>

              {/* Link */}
              <Link
                to={c.link}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#181818",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  textDecoration: "none"
                }}
              >
                SHOP NOW <ArrowUpRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
