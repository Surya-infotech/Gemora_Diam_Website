import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useStore } from "../../lib/store";

const BESTSELLER_ENGAGEMENT_RINGS = [
  {
    id: "oval-cut-1ct-igi",
    name: "Oval Cut 1Ct IGI Certified Lab Grown Diamond Engagement Ring",
    price: 1850,
    image: "/bestsellers/oval_cut_ring.jpg",
    category: "Engagement Rings",
    metals: [
      { name: "Yellow Gold", color: "#e5c158" },
      { name: "White Gold", color: "#e0e2e5" },
      { name: "Rose Gold", color: "#e8a896" },
      { name: "Platinum", color: "#cbd3db" }
    ],
    link: "/collections?category=Engagement+Rings"
  },
  {
    id: "round-cut-4ct-igi",
    name: "Round Cut 4Ct IGI Certified Lab Grown Diamond Cluster Ring",
    price: 4220,
    image: "/bestsellers/marquise_cut_ring.jpg",
    category: "Engagement Rings",
    metals: [
      { name: "Yellow Gold", color: "#e5c158" },
      { name: "White Gold", color: "#e0e2e5" },
      { name: "Rose Gold", color: "#e8a896" },
      { name: "Platinum", color: "#cbd3db" }
    ],
    link: "/collections?category=Engagement+Rings"
  },
  {
    id: "round-cut-1ct-bezel",
    name: "Round Cut 1Ct IGI Certified Solitaire Cathedral Bezel Ring",
    price: 2150,
    image: "/bestsellers/round_cut_ring.jpg",
    category: "Engagement Rings",
    metals: [
      { name: "Yellow Gold", color: "#e5c158" },
      { name: "White Gold", color: "#e0e2e5" },
      { name: "Rose Gold", color: "#e8a896" },
      { name: "Platinum", color: "#cbd3db" }
    ],
    link: "/collections?category=Engagement+Rings"
  },
  {
    id: "emerald-cut-1-5ct-solitaire",
    name: "Emerald Cut 1.5Ct IGI Certified Lab Grown Diamond Solitaire Ring",
    price: 2650,
    image: "/bestsellers/emerald_cut_ring.jpg",
    category: "Engagement Rings",
    metals: [
      { name: "Yellow Gold", color: "#e5c158" },
      { name: "White Gold", color: "#e0e2e5" },
      { name: "Rose Gold", color: "#e8a896" },
      { name: "Platinum", color: "#cbd3db" }
    ],
    link: "/collections?category=Engagement+Rings"
  }
];

const BESTSELLER_WEDDING_BANDS = [
  {
    id: "french-pave-eternity",
    name: "French Pavé Micro-Diamond Eternity Band in 18K Solid Gold",
    price: 980,
    image: "/bestsellers/pave_band.jpg",
    category: "Wedding Bands",
    metals: [
      { name: "Yellow Gold", color: "#e5c158" },
      { name: "White Gold", color: "#e0e2e5" },
      { name: "Rose Gold", color: "#e8a896" },
      { name: "Platinum", color: "#cbd3db" }
    ],
    link: "/collections?category=Wedding+Bands"
  },
  {
    id: "chevron-contoured-band",
    name: "Chevron Contoured Diamond Ring Guard Band in 950 Platinum",
    price: 1120,
    image: "/bestsellers/chevron_band.jpg",
    category: "Wedding Bands",
    metals: [
      { name: "Platinum", color: "#cbd3db" },
      { name: "White Gold", color: "#e0e2e5" },
      { name: "Yellow Gold", color: "#e5c158" },
      { name: "Rose Gold", color: "#e8a896" }
    ],
    link: "/collections?category=Wedding+Bands"
  },
  {
    id: "classic-domed-band",
    name: "Classic Domed Comfort-Fit 18K Yellow Gold Wedding Band",
    price: 680,
    image: "/bestsellers/classic_band.jpg",
    category: "Wedding Bands",
    metals: [
      { name: "Yellow Gold", color: "#e5c158" },
      { name: "White Gold", color: "#e0e2e5" },
      { name: "Rose Gold", color: "#e8a896" },
      { name: "Platinum", color: "#cbd3db" }
    ],
    link: "/collections?category=Wedding+Bands"
  },
  {
    id: "alternating-baguette-band",
    name: "Alternating Baguette & Round Brilliant Diamond Eternity Band",
    price: 1450,
    image: "/bestsellers/baguette_band.jpg",
    category: "Wedding Bands",
    metals: [
      { name: "Rose Gold", color: "#e8a896" },
      { name: "Yellow Gold", color: "#e5c158" },
      { name: "White Gold", color: "#e0e2e5" },
      { name: "Platinum", color: "#cbd3db" }
    ],
    link: "/collections?category=Wedding+Bands"
  }
];

export default function BestSellerSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("engagement");
  const [selectedMetals, setSelectedMetals] = useState({});
  const { wishlist, toggleWishlist, format } = useStore();

  const handleMetalSelect = (itemId, metalName, e) => {
    e.stopPropagation();
    setSelectedMetals((prev) => ({ ...prev, [itemId]: metalName }));
  };

  const currentItems = activeTab === "engagement"
    ? BESTSELLER_ENGAGEMENT_RINGS
    : BESTSELLER_WEDDING_BANDS;

  const currentCategoryLink = activeTab === "engagement"
    ? "/collections?category=Engagement+Rings"
    : "/collections?category=Wedding+Bands";

  const currentCategoryLabel = activeTab === "engagement"
    ? "Shop all engagement rings"
    : "Shop all wedding bands";

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

        {/* Tesora-Style Filter Tabs & Category Link */}
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
          <div style={{ display: "flex", gap: "clamp(24px, 3.5vw, 40px)" }}>
            <button
              type="button"
              onClick={() => setActiveTab("engagement")}
              style={{
                background: "none",
                border: "none",
                padding: "0 0 12px 0",
                fontSize: "0.76rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: activeTab === "engagement" ? "var(--foreground)" : "#8c867a",
                borderBottom: activeTab === "engagement" ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Engagement Rings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("wedding")}
              style={{
                background: "none",
                border: "none",
                padding: "0 0 12px 0",
                fontSize: "0.76rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: activeTab === "wedding" ? "var(--foreground)" : "#8c867a",
                borderBottom: activeTab === "wedding" ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Wedding Bands
            </button>
          </div>

          {/* Right Action Link */}
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
        </div>

        {/* 4-Column Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: "clamp(16px, 1.8vw, 24px)"
          }}
        >
          {currentItems.map((item) => {
            const isLiked = wishlist.includes(item.id);
            const activeMetal = selectedMetals[item.id] || item.metals?.[0]?.name;

            return (
              <div
                key={item.id}
                onClick={() => navigate(item.link || `/collections`)}
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
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />

                  {/* Top-Left: IGI Certified Pill Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      zIndex: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.94)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(220, 215, 205, 0.8)",
                      borderRadius: "50px",
                      padding: "4px 10px",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#3d372e",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                    }}
                  >
                    IGI CERTIFIED
                  </div>

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
                  {/* Row 1: Title and Metal Swatches */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        lineHeight: 1.35,
                        color: "#1a1a1a",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.2em",
                        flex: 1
                      }}
                    >
                      {item.name}
                    </h3>

                    {/* Circular Metal Color Swatches */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        marginTop: "3px",
                        flexShrink: 0
                      }}
                    >
                      {item.metals.map((metal) => {
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
                  </div>

                  {/* Row 2: Price */}
                  <div
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "#222222",
                      marginTop: "6px"
                    }}
                  >
                    {format(item.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}