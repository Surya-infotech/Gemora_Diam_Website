import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useStore } from "../../lib/store";

function getMetalColor(metalName = "") {
  const norm = String(metalName).toLowerCase();
  if (norm.includes("rose")) return "#e8a896";
  if (norm.includes("yellow") || norm.includes("gold")) {
    if (norm.includes("white")) return "#e0e2e5";
    return "#e5c158";
  }
  if (norm.includes("platinum")) return "#cbd3db";
  if (norm.includes("white") || norm.includes("silver")) return "#e0e2e5";
  return "#e5c158";
}

export default function BestSellerSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [selectedMetals, setSelectedMetals] = useState({});
  const { products, categories, productsLoading, wishlist, toggleWishlist, format, getItemPrice } = useStore();

  const handleMetalSelect = (itemId, metalName, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMetals((prev) => ({ ...prev, [itemId]: metalName }));
  };

  // Derive dynamic categories with products from database
  const categoriesWithProducts = (categories || [])
    .map((c) => c.categoryname || c.name || c.title)
    .filter(Boolean)
    .filter((catName) =>
      (products || []).some((p) => p.category?.toLowerCase() === catName.toLowerCase())
    );

  const extraProductCategories = Array.from(
    new Set(
      (products || [])
        .map((p) => p.category)
        .filter(Boolean)
        .filter(
          (pCat) =>
            !categoriesWithProducts.some(
              (c) => c.toLowerCase() === pCat.toLowerCase()
            )
        )
    )
  );

  const dynamicTabs = [...categoriesWithProducts, ...extraProductCategories];

  // If no dynamic products exist in the database, cleanly do not render default mock data
  if (!productsLoading && (!products || products.length === 0 || dynamicTabs.length === 0)) {
    return null;
  }

  const currentTab = activeTab && dynamicTabs.includes(activeTab)
    ? activeTab
    : dynamicTabs[0] || "";

  const currentItems = (products || []).filter(
    (p) => p.category?.toLowerCase() === currentTab.toLowerCase()
  );

  const currentCategoryLink = `/collections?category=${encodeURIComponent(currentTab)}`;
  const currentCategoryLabel = `Shop all ${currentTab.toLowerCase()}`;

  return (
    <section style={{ padding: "clamp(50px, 6vw, 90px) 0 clamp(60px, 7vw, 100px) 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Tesora-Style Header: Left-Aligned Eyebrow & Title */}
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "0.74rem",
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--gold-deep)",
              margin: "0 0 6px 0"
            }}
          >
            Most Loved
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 3.8vw, 2.85rem)",
              fontWeight: 500,
              color: "#181818",
              lineHeight: 1.15,
              margin: 0
            }}
          >
            Our best sellers
          </h2>
        </div>

        {/* Dynamic Filter Tabs & Category Link */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "16px",
            borderBottom: "1px solid #ebe5da",
            paddingBottom: "0",
            marginBottom: "32px"
          }}
        >
          {/* Underlined Minimal Tabs */}
          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(18px, 2.8vw, 36px)",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              maxWidth: "100%",
              flex: "1 1 auto"
            }}
          >
            {dynamicTabs.map((tab) => {
              const isSelected = currentTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0 0 12px 0",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: isSelected ? "var(--foreground)" : "#8c867a",
                    borderBottom: isSelected ? "2px solid var(--primary)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Right Action Link */}
          {currentTab && (
            <Link
              to={currentCategoryLink}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--foreground)",
                paddingBottom: "12px",
                textDecoration: "none",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
            >
              <span>{currentCategoryLabel}</span>
              <ArrowRight size={13} strokeWidth={2} style={{ color: "var(--primary)" }} />
            </Link>
          )}
        </div>

        {/* 4-Column Product Grid (Strict 4 columns matching Tesora proportions) */}
        <div className="bestseller-grid">
          {currentItems.map((item) => {
            const isLiked = wishlist.includes(item.id);
            const rawMetals = item.metals || [];
            const metals = rawMetals.map((m) => {
              if (typeof m === "object" && m !== null) {
                return { name: m.name || m.metalname || "", color: m.color || getMetalColor(m.name || m.metalname) };
              }
              return { name: String(m), color: getMetalColor(m) };
            });
            const activeMetal = selectedMetals[item.id] || metals[0]?.name || "";
            const currentPrice = getItemPrice
              ? getItemPrice(item, activeMetal)
              : (item.price || 0);
            const itemImage = item.image || item.galleryImages?.[0] || item.gallery?.[0] || "";

            return (
              <div
                key={item.id}
                onClick={() => navigate(item.link || `/product/${item.id || item._id}` || `/collections`)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid #ebe5da",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 14px 34px rgba(28, 34, 23, 0.08)";
                  e.currentTarget.style.borderColor = "#dcd4c7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#ebe5da";
                }}
              >
                {/* Product Image Stage */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    backgroundColor: "#f8f7f4",
                    overflow: "hidden"
                  }}
                >
                  {itemImage ? (
                    <img
                      src={itemImage}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#bbb", fontSize: "12px" }}>
                      No Image
                    </div>
                  )}



                  {/* Top-Right: Circular Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    aria-label="Toggle wishlist"
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      zIndex: 2,
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(220, 215, 205, 0.6)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      display: "grid",
                      placeItems: "center",
                      color: isLiked ? "var(--primary)" : "var(--foreground)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)")}
                  >
                    <Heart size={14} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.6} />
                  </button>

                  {/* Bottom-Right: Subtle Gold Atelier Watermark Monogram */}
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 36 36"
                    fill="none"
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "12px",
                      zIndex: 1,
                      opacity: 0.35,
                      color: "var(--gold)",
                      pointerEvents: "none"
                    }}
                  >
                    <path
                      d="M18 3L32 10.5V19C32 26.5 25.5 32.5 18 34.5C10.5 32.5 4 26.5 4 19V10.5L18 3Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path d="M18 8L26 14L18 29L10 14L18 8Z" stroke="currentColor" strokeWidth="1" />
                    <path d="M10 14H26M18 8V29" stroke="currentColor" strokeWidth="0.8" />
                  </svg>
                </div>

                {/* Product Meta & Swatches */}
                <div style={{ padding: "14px 14px 16px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Row 1: Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.84rem",
                      fontWeight: 500,
                      lineHeight: 1.35,
                      color: "#1a1a1a",
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.3em",
                      width: "100%"
                    }}
                  >
                    {item.name}
                  </h3>

                  {/* Row 2: Price dynamically updated by selected metal & Circular Swatches */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", gap: "6px" }}>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "#222222",
                        transition: "color 0.2s ease",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {format ? format(currentPrice) : `$${currentPrice?.toLocaleString()}`}
                    </div>

                    {/* Circular Metal Color Swatches */}
                    {metals.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          flexShrink: 0
                        }}
                      >
                        {metals.map((metal) => {
                          const isSelected = activeMetal === metal.name;
                          return (
                            <button
                              key={metal.name}
                              type="button"
                              title={metal.name}
                              onClick={(e) => handleMetalSelect(item.id, metal.name, e)}
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: metal.color,
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                outline: "none",
                                boxShadow: isSelected
                                  ? "0 0 0 1.5px #ffffff, 0 0 0 2.5px var(--primary)"
                                  : "none",
                                transition: "transform 0.15s ease"
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .bestseller-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 1.8vw, 24px);
        }
        @media (max-width: 1024px) {
          .bestseller-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .bestseller-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .bestseller-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
        @media (max-width: 350px) {
          .bestseller-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}