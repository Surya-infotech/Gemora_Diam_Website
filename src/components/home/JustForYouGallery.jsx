import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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
        const cleanDesc = (p.description || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        list.push({
          id: p.id,
          product: p,
          img: p.image,
          title: p.name,
          desc: cleanDesc || `${p.category} Collection`,
          category: p.category,
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
                title: p.name,
                desc: `${p.category} Detail`,
                category: p.category,
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
        <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 48px auto" }}>
          <span
            className="eyebrow"
            style={{
              color: "var(--primary)",
              letterSpacing: "0.26em",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>✦</span>
            <span>ATELIER PERSPECTIVES</span>
            <span>✦</span>
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 4.2vw, 3.2rem)",
              fontWeight: 400,
              marginTop: "12px",
              lineHeight: 1.15
            }}
          >
            Just For You
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", marginTop: "12px", lineHeight: 1.6 }}>
            Every angle captured with artisan fidelity and unparalleled gemstone brilliance.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "4px",
          width: "100%",
          padding: "0 4px"
        }}
      >
        {tiles.map((t, idx) => (
          <div
            key={t.id || idx}
            onClick={() => {
              if (t.link) navigate(t.link);
            }}
            className="just-for-you-card"
          >
            <img
              src={t.img}
              alt={t.title}
              className="just-for-you-img"
            />

            {/* Hover overlay with Title, Eyebrow & Shop Now */}
            <div className="just-for-you-overlay">
              <span
                className="eyebrow"
                style={{
                  color: "var(--gold-light)",
                  letterSpacing: "0.22em",
                  marginBottom: "8px",
                  fontSize: "0.72rem"
                }}
              >
                ✦ {t.category ? t.category.toUpperCase() : "ATELIER PIECE"} ✦
              </span>

              <h4 className="just-for-you-title">
                {t.title}
              </h4>

              {t.desc ? (
                <p className="just-for-you-desc">
                  {t.desc}
                </p>
              ) : null}

              <div
                className="eyebrow"
                style={{
                  fontSize: "0.74rem",
                  letterSpacing: "0.18em",
                  color: "var(--gold-light)",
                  borderBottom: "1.5px solid var(--gold-light)",
                  paddingBottom: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "4px",
                  flexShrink: 0
                }}
              >
                <span>DISCOVER PIECE</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
