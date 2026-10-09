import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useStore } from "../../lib/store";

export default function BestSellerSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const {
    addToCart,
    toggleWishlist,
    wishlist,
    notify,
    format,
    products: dynamicProducts,
    categories: dynamicCategories
  } = useStore();

  // Only use products from backend
  const products = dynamicProducts || [];

  const categoryTabs = [
    { id: "all", label: "all" },
    ...(dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories.map((c) => ({
        id: (c.categoryname || "").toLowerCase(),
        label: (c.categoryname || "").toLowerCase()
      }))
      : [])
  ];

  const filtered =
    activeTab === "all"
      ? products
      : products.filter(
        (p) =>
          (p.category || "").toLowerCase() === activeTab.toLowerCase() ||
          String(p.categoryid || "") === String(activeTab)
      );

  return (
    <section style={{ padding: "50px 0 90px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            textAlign: "center",
            marginBottom: "28px",
            fontWeight: 400
          }}
        >
          Best Seller
        </h2>

        {/* Category Tabs */}
        {categoryTabs.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              marginBottom: "48px",
              borderBottom: "1px solid #ebebeb",
              paddingBottom: "12px",
              flexWrap: "wrap"
            }}
          >
            {categoryTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  fontSize: "0.85rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: activeTab === t.id ? "var(--primary)" : "#777777",
                  borderBottom: activeTab === t.id ? "2px solid var(--primary)" : "none",
                  paddingBottom: "12px",
                  marginBottom: "-13px",
                  transition: "all 0.2s",
                  background: "none",
                  cursor: "pointer"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 320px))",
            gap: "28px",
            justifyContent: "flex-start"
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
                color: "#888888"
              }}
            >
              <p style={{ fontSize: "1rem" }}>No pieces found in this collection.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isLiked = wishlist.includes(item.id);

              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    transition: "transform 0.3s ease"
                  }}
                >
                  {/* Product Image Frame */}
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1/1",
                      backgroundColor: "#f7f7f7",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                    className="product-card-hover"
                    onClick={() => navigate(`/product/${item._id || item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transition: "transform 0.5s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />

                    {/* Hover Quick Action Buttons */}
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        zIndex: 2
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(item.id);
                        }}
                        aria-label="Wishlist"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          display: "grid",
                          placeItems: "center",
                          color: isLiked ? "var(--primary)" : "#333",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                      >
                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(item.id, item.metals?.[0] || "", "", "", item.price);
                          notify("Added to Bag", `1x ${item.name} (${format(item.price)})`);
                        }}
                        aria-label="Add to Cart"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          display: "grid",
                          placeItems: "center",
                          color: "#333",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Item Details According to Backend */}
                  <div style={{ paddingTop: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#888888", fontWeight: 600 }}>
                        {item.category || "Jewelry"} {item.sku ? `• ${item.sku}` : ""}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        lineHeight: 1.3,
                        color: "#181818",
                        margin: "2px 0 0 0",
                        cursor: "pointer",
                        fontFamily: "var(--font-serif)"
                      }}
                      onClick={() => navigate(`/product/${item._id || item.id}`)}
                    >
                      {item.name}
                    </h4>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                      <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--primary)" }}>
                        {format(item.price)}
                      </span>
                      {item.metals && item.metals.length > 0 && (
                        <span style={{ fontSize: "0.74rem", color: "#777777" }}>
                          {item.metals.length} {item.metals.length === 1 ? "metal" : "metals"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
