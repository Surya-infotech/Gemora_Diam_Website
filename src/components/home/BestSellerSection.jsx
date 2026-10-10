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

  const products = dynamicProducts || [];

  const categoryTabs = [
    { id: "all", label: "All Pieces" },
    ...(dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories.map((c) => ({
        id: (c.categoryname || "").toLowerCase(),
        label: c.categoryname || ""
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
    <section style={{ padding: "80px 0 100px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px auto" }}>
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
            <span>TIMELESS ATELIER ICONS</span>
            <span>✦</span>
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
              fontWeight: 400,
              marginTop: "12px",
              lineHeight: 1.15
            }}
          >
            Most Coveted Creations
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", marginTop: "12px", lineHeight: 1.6 }}>
            Bespoke rings, bracelets, and fine jewelry sculpted to perfection with ethical lab-grown diamonds.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categoryTabs.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "48px",
              flexWrap: "wrap"
            }}
          >
            {categoryTabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="eyebrow"
                  style={{
                    fontSize: "0.76rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: isActive ? "#ffffff" : "var(--foreground)",
                    backgroundColor: isActive ? "var(--primary)" : "#FAF8F5",
                    border: isActive ? "1px solid var(--primary)" : "1px solid #E5DFD3",
                    padding: "10px 22px",
                    borderRadius: "50px",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                    boxShadow: isActive ? "0 4px 14px rgba(85, 104, 50, 0.25)" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.color = "var(--primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "#E5DFD3";
                      e.currentTarget.style.color = "var(--foreground)";
                    }
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
            gap: "clamp(20px, 3vw, 32px)",
            justifyContent: "center"
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 20px",
                color: "var(--muted-foreground)"
              }}
            >
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--foreground)" }}>
                No pieces found in this category
              </p>
              <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
                Browse other collections or speak with our atelier concierge.
              </p>
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
                    backgroundColor: "#FAF9F6",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: "1px solid #EDE7DC",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.03)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 14px 34px rgba(85, 104, 50, 0.12)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#EDE7DC";
                    e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.03)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Product Image Stage */}
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1/1",
                      backgroundColor: "#ffffff",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      borderBottom: "1px solid #F0EBE0"
                    }}
                    onClick={() => navigate(`/product/${item._id || item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "16px",
                        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />

                    {/* Quick Floating Action Icons */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
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
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          display: "grid",
                          placeItems: "center",
                          color: isLiked ? "var(--primary)" : "var(--foreground)",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                          border: "1px solid #ECE7DD",
                          transition: "all 0.2s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                      >
                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(item.id, item.metals?.[0] || "", "", "", item.price);
                          notify("Added to Bag", `1x ${item.name} (${format(item.price)})`);
                        }}
                        aria-label="Add to Bag"
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--foreground)",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                          border: "1px solid #ECE7DD",
                          transition: "all 0.2s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--primary)";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.color = "var(--foreground)";
                        }}
                      >
                        <ShoppingBag size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span className="eyebrow" style={{ color: "var(--gold-deep)", fontSize: "0.7rem", letterSpacing: "0.14em" }}>
                        {item.category || "Jewelry"} {item.sku ? `&bull; ${item.sku}` : ""}
                      </span>
                      {item.metals && item.metals.length > 0 && (
                        <span style={{ fontSize: "0.74rem", color: "var(--muted-foreground)" }}>
                          {item.metals.length} {item.metals.length === 1 ? "metal" : "metals"}
                        </span>
                      )}
                    </div>

                    <h4
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        lineHeight: 1.3,
                        color: "var(--foreground)",
                        margin: "0 0 10px 0",
                        cursor: "pointer",
                        fontFamily: "var(--font-serif)",
                        transition: "color 0.2s"
                      }}
                      onClick={() => navigate(`/product/${item._id || item.id}`)}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                    >
                      {item.name}
                    </h4>

                    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "8px" }}>
                      <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)" }}>
                        {format(item.price)}
                      </span>

                      <button
                        onClick={() => navigate(`/product/${item._id || item.id}`)}
                        className="eyebrow"
                        style={{
                          fontSize: "0.72rem",
                          letterSpacing: "0.12em",
                          color: "var(--foreground)",
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                          cursor: "pointer",
                          transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                      >
                        View Details
                      </button>
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
