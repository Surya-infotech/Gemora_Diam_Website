import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../lib/store";

export default function ShopTheLookSection() {
  const navigate = useNavigate();
  const { products: dynamicProducts, format } = useStore();

  const products = dynamicProducts || [];
  const looks = products
    .filter((item) => item.image || item.galleryImages?.[0])
    .slice(0, 3)
    .map((item) => ({
      img: item.galleryImages?.[0] || item.image,
      product: item
    }));

  if (looks.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: "90px 0 100px 0", backgroundColor: "#ffffff" }}>
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
            <span>ATELIER LOOKBOOK</span>
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
            Curated Ensembles
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", marginTop: "12px", lineHeight: 1.6 }}>
            Discover how our master jewelers layer and harmonize timeless solitaire and bridal pieces.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              looks.length === 1
                ? "minmax(min(100%, 280px), 460px)"
                : looks.length === 2
                  ? "repeat(auto-fit, minmax(min(100%, 280px), 480px))"
                  : "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            justifyContent: "center",
            gap: "32px"
          }}
        >
          {looks.map((item, idx) => (
            <div
              key={item.product?.id || idx}
              onClick={() => (item.product?._id || item.product?.id) && navigate(`/product/${item.product._id || item.product.id}`)}
              style={{
                position: "relative",
                height: "clamp(420px, 60vw, 560px)",
                overflow: "hidden",
                borderRadius: "6px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                border: "1px solid #EAE3D5",
                backgroundColor: "#FAF9F6",
                cursor: "pointer"
              }}
            >
              {/* Main Model / Product Look Image */}
              <img
                src={item.img}
                alt={item.product?.name || "Product"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />

              {/* Dark subtle bottom vignette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(16, 22, 13, 0.6) 0%, rgba(0,0,0,0) 45%)",
                  pointerEvents: "none"
                }}
              />

              {/* Floating Bottom Frosted Pill Product Card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "4px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  transition: "transform 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <img
                  src={item.product?.image || item.img}
                  alt={item.product?.name || ""}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "3px",
                    objectFit: "fill",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ECE7DD",
                    flexShrink: 0
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h5
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "var(--foreground)"
                    }}
                  >
                    {item.product?.name}
                  </h5>
                  {item.product?.price && (
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", marginTop: "2px" }}>
                      {format(item.product.price)}
                    </div>
                  )}
                </div>

                <div
                  className="eyebrow"
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  <span>VIEW</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
