import { useNavigate } from "react-router-dom";
import { useStore } from "../../lib/store";

export default function ShopTheLookSection() {
  const navigate = useNavigate();
  const { products: dynamicProducts } = useStore();

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
    <section style={{ padding: "80px 0 90px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            textAlign: "center",
            marginBottom: "44px",
            fontWeight: 400
          }}
        >
          Shop the Look
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              looks.length === 1
                ? "minmax(320px, 440px)"
                : looks.length === 2
                  ? "repeat(auto-fit, minmax(320px, 480px))"
                  : "repeat(auto-fit, minmax(300px, 1fr))",
            justifyContent: "center",
            gap: "28px"
          }}
        >
          {looks.map((item, idx) => (
            <div
              key={item.product?.id || idx}
              onClick={() => (item.product?._id || item.product?.id) && navigate(`/product/${item.product._id || item.product.id}`)}
              style={{
                position: "relative",
                height: "520px",
                overflow: "hidden",
                borderRadius: "2px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                backgroundColor: "#f7f7f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                  transition: "transform 0.5s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />

              {/* Floating Bottom Pill Product Card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "4px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                }}
              >
                <img
                  src={item.product?.image || item.img}
                  alt={item.product?.name || ""}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "2px",
                    objectFit: "contain",
                    backgroundColor: "#f5f5f5",
                    flexShrink: 0
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h5
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#181818"
                    }}
                  >
                    {item.product?.name}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
