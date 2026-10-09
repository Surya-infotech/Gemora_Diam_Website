import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../lib/store";

export default function JustForYouGallery() {
  const { products } = useStore();
  const navigate = useNavigate();

  // Dynamically build tiles from backend products and their uploaded gallery images
  const dynamicTiles = useMemo(() => {
    if (!products || products.length === 0) return [];

    const list = [];
    // 1. First add each active backend product's main image
    products.forEach((p) => {
      if (p.image) {
        list.push({
          id: p.id,
          product: p,
          img: p.image,
          title: p.name || "Handcrafted Jewelry",
          desc: p.description?.trim() || `${p.category || "Fine Jewelry"} Collection`,
          link: `/product/${p._id || p.id}`
        });
      }
    });

    // 2. If fewer than 6, supplement with gallery images of backend products
    if (list.length < 6) {
      products.forEach((p) => {
        if (Array.isArray(p.galleryImages)) {
          p.galleryImages.forEach((gImg, idx) => {
            if (list.length < 6 && gImg && gImg !== p.image) {
              list.push({
                id: `${p.id}-gal-${idx}`,
                product: p,
                img: gImg,
                title: p.name || "Exclusive Detail",
                desc: `${p.category || "Fine Jewelry"} Detail`,
                link: `/product/${p._id || p.id}`
              });
            }
          });
        }
      });
    }

    return list.slice(0, 6);
  }, [products]);

  if (!dynamicTiles || dynamicTiles.length === 0) {
    return null;
  }

  const tiles = dynamicTiles;

  return (
    <section style={{ padding: "80px 0 0 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            textAlign: "center",
            marginBottom: "40px",
            fontWeight: 400
          }}
        >
          Just For You
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2px",
          width: "100%"
        }}
      >
        {tiles.map((t, idx) => (
          <div
            key={t.id || idx}
            onClick={() => {
              if (t.link) navigate(t.link);
            }}
            style={{
              position: "relative",
              height: "360px",
              overflow: "hidden",
              cursor: "pointer"
            }}
          >
            <img
              src={t.img}
              alt={t.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* Hover overlay with Title & Shop Now */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.45)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#ffffff",
                padding: "24px",
                opacity: 0,
                transition: "opacity 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "#ffffff", marginBottom: "6px" }}>
                {t.title}
              </h4>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", marginBottom: "16px", maxWidth: "240px" }}>
                {t.desc}
              </p>
              <Link
                to={t.link || "/shop"}
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: "0.76rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#ffffff",
                  borderBottom: "1.5px solid #ffffff",
                  paddingBottom: "4px"
                }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
