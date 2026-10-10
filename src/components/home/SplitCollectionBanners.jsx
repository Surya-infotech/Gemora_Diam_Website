import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../lib/store";

import banner5 from "../../assets/vemus/banner_banner-5.jpg";
import banner6 from "../../assets/vemus/banner_banner-6.jpg";

function resolveBannerImage(img, fallback) {
  if (!img) return fallback;
  if (typeof img === "string") {
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("blob:")) {
      return img;
    }
    if (img.includes("banner-5") || img.includes("banner_5")) return banner5;
    if (img.includes("banner-6") || img.includes("banner_6")) return banner6;
  }
  return img || fallback;
}

export default function SplitCollectionBanners() {
  const { collectionBanners, categories } = useStore();

  let itemsToRender = [];

  if (Array.isArray(collectionBanners) && collectionBanners.length > 0) {
    itemsToRender = collectionBanners;
  } else if (categories && categories.length >= 2) {
    const cat1 = categories[0];
    const cat2 = categories[1];
    itemsToRender = [
      {
        bannerid: 1,
        tag: "FEATURED ATELIER",
        title: `${cat1.categoryname} Collection`,
        description: cat1.description || "",
        image: cat1.image || banner5,
        buttonText: "SHOP COLLECTION",
        buttonLink: `/shop?category=${encodeURIComponent(cat1.categoryname)}`,
        position: "left"
      },
      {
        bannerid: 2,
        tag: "CURATED CRAFTSMANSHIP",
        title: `${cat2.categoryname} Collection`,
        description: cat2.description || "",
        image: cat2.image || banner6,
        buttonText: "SHOP COLLECTION",
        buttonLink: `/shop?category=${encodeURIComponent(cat2.categoryname)}`,
        position: "right"
      }
    ];
  }

  if (itemsToRender.length === 0) {
    return null;
  }

  return (
    <section style={{ backgroundColor: "#ffffff", padding: "40px 0 80px 0" }}>
      <div className="container-luxury" style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {itemsToRender.map((b, i) => {
          const isLeft = b.position === "left" || (!b.position && i % 2 === 0);
          const fallbackImg = i % 2 === 0 ? banner5 : banner6;
          const displayImg = resolveBannerImage(b.image, fallbackImg);

          const imageBlock = (
            <div style={{ minHeight: "320px", maxHeight: "420px", height: "100%", overflow: "hidden", position: "relative" }}>
              <img
                src={displayImg}
                alt={b.title}
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
          );

          const contentBlock = (
            <div
              style={{
                padding: "clamp(32px, 5vw, 56px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "#FAF9F6"
              }}
            >
              {b.tag && (
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
                  <span>{b.tag}</span>
                  <span>✦</span>
                </span>
              )}
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
                {b.title}
              </h2>
              {b.description ? (
                <p
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.7,
                    color: "var(--muted-foreground)",
                    maxWidth: "480px",
                    marginBottom: "28px"
                  }}
                >
                  {b.description}
                </p>
              ) : null}
              <div>
                <Link
                  to={b.buttonLink || "/shop"}
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
                  <span>{b.buttonText || "SHOP COLLECTION"}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          );

          return (
            <div
              key={b._id || b.bannerid || i}
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
              {isLeft ? (
                <>
                  {imageBlock}
                  {contentBlock}
                </>
              ) : (
                <>
                  {contentBlock}
                  {imageBlock}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
