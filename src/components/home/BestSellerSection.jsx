import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "../../lib/store";
import SectionHeading from "../SectionHeading";

const CURATED_BESTSELLERS = [
  {
    id: "curated-1",
    _id: "curated-1",
    name: "The Round Brilliant Solitaire Ring",
    category: "Engagement Rings",
    price: 1850,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    metals: ["18k Yellow Gold", "Platinum", "18k White Gold"]
  },
  {
    id: "curated-2",
    _id: "curated-2",
    name: "The Luminous Oval Pavé Ring",
    category: "Engagement Rings",
    price: 2450,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    metals: ["18k Yellow Gold", "14k Rose Gold", "Platinum"]
  },
  {
    id: "curated-3",
    _id: "curated-3",
    name: "The Grand Emerald Cut Eternity Band",
    category: "Wedding Bands",
    price: 3100,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
    metals: ["Platinum", "18k White Gold", "18k Yellow Gold"]
  },
  {
    id: "curated-4",
    _id: "curated-4",
    name: "The Vintage Floral Cushion Solitaire",
    category: "Engagement Rings",
    price: 2150,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    metals: ["18k Yellow Gold", "Platinum"]
  }
];

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

  const products = (dynamicProducts && dynamicProducts.length > 0) ? dynamicProducts : CURATED_BESTSELLERS;

  const categoryTabs = [
    { id: "all", label: "All Pieces" },
    ...(dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories.map((c) => ({
        id: (c.categoryname || "").toLowerCase(),
        label: c.categoryname || ""
      }))
      : [
        { id: "engagement rings", label: "Engagement Rings" },
        { id: "wedding bands", label: "Wedding Bands" },
        { id: "fine jewelry", label: "Fine Jewelry" }
      ])
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
    <section style={{ padding: "clamp(48px, 6vw, 84px) 0 clamp(48px, 7vw, 96px) 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Section Header */}
        <SectionHeading
          eyebrow="Most Loved"
          title="Our best sellers"
          description="Handcrafted engagement rings and bestselling bridal icons, sculpted with ethical certified lab diamonds."
        />

        {/* Filter Bar & Category Link */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "clamp(24px, 4vw, 36px)",
            paddingBottom: "8px"
          }}
        >
          {categoryTabs.length > 1 ? (
            <div
              className="no-scrollbar"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "8px",
                flexWrap: "wrap",
                overflowX: "auto"
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
                      fontSize: "0.72rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: isActive ? "#ffffff" : "var(--foreground)",
                      backgroundColor: isActive ? "var(--primary)" : "#FAF8F5",
                      border: isActive ? "1px solid var(--primary)" : "1px solid #E5DFD3",
                      padding: "9px 20px",
                      borderRadius: "999px",
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
          ) : <div />}

          <Link
            to="/collections?category=Engagement+Rings"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.74rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--foreground)",
              borderBottom: "1.5px solid var(--primary)",
              paddingBottom: "3px",
              textDecoration: "none",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
          >
            <span>Shop all Engagement Rings</span>
            <ArrowRight size={14} style={{ color: "var(--primary)" }} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="products-responsive-grid">
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
                    borderRadius: "12px",
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
                      backgroundColor: "#FAF9F6",
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
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />

                    {/* Quick Floating Wishlist Action */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        zIndex: 2
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(item.id);
                        }}
                        aria-label="Toggle wishlist"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          border: "1px solid #EDE7DC",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                          display: "grid",
                          placeItems: "center",
                          color: isLiked ? "var(--primary)" : "var(--foreground)",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                      >
                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info Block */}
                  <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--gold-deep)",
                        fontWeight: 600,
                        marginBottom: "6px"
                      }}
                    >
                      {item.category || "Fine Jewelry"}
                    </span>

                    <h4
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        lineHeight: 1.3,
                        color: "var(--foreground)",
                        margin: "0 0 10px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.6em"
                      }}
                    >
                      {item.name}
                    </h4>

                    {item.price > 0 && (
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "var(--primary)",
                          marginBottom: "16px"
                        }}
                      >
                        {format(item.price)}
                      </div>
                    )}

                    {/* Quick Add To Bag Action */}
                    <div style={{ marginTop: "auto" }}>
                      <button
                        onClick={() => {
                          addToCart(item.id, item.metals?.[0] || "", "", "", item.price);
                          notify("Added to Bag", `1x ${item.name}`);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          backgroundColor: "var(--primary)",
                          color: "#ffffff",
                          border: "none",
                          padding: "10px 14px",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          transition: "all 0.25s",
                          boxShadow: "0 2px 8px rgba(85, 104, 50, 0.25)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--primary)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <ShoppingBag size={14} />
                        <span>Add To Bag</span>
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
