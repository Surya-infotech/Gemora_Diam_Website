import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useStore } from "../lib/store";
import atelierImg from "../assets/atelier.jpg";
import promo1 from "../assets/vemus/collections_promo-1.jpg";
import promo2 from "../assets/vemus/collections_promo-2.jpg";

// ==========================================
// 1. Precise Diamond Shape Outline Icons (SVG)
// ==========================================
export function DiamondShapeIcon({ shape, size = 18 }) {
  const norm = (shape || "").toLowerCase();

  if (norm.includes("emerald")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <polygon points="6,3 18,3 21,6 21,18 18,21 6,21 3,18 3,6" />
        <polygon points="8,6 16,6 18,8 18,16 16,18 8,18 6,16 6,8" strokeWidth="0.8" />
        <rect x="10" y="8" width="4" height="8" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("round")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="9" />
        <polygon points="12,4 19,12 12,20 5,12" strokeWidth="0.8" />
        <line x1="7" y1="7" x2="17" y2="17" strokeWidth="0.8" />
        <line x1="7" y1="17" x2="17" y2="7" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("oval")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <ellipse cx="12" cy="12" rx="7" ry="10" />
        <polygon points="12,3 17,12 12,21 7,12" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("cushion")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <polygon points="12,5 19,12 12,19 5,12" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("princess")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="4" y="4" width="16" height="16" rx="0.5" />
        <polygon points="12,4 20,12 12,20 4,12" strokeWidth="0.8" />
        <line x1="4" y1="4" x2="20" y2="20" strokeWidth="0.8" />
        <line x1="4" y1="20" x2="20" y2="4" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("pear")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 3 C16 9 19 14 19 17 A7 7 0 0 1 5 17 C5 14 8 9 12 3 Z" />
        <polygon points="12,7 16,16 8,16" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("radiant")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <polygon points="6,4 18,4 20,6 20,18 18,20 6,20 4,18 4,6" />
        <polygon points="12,6 17,12 12,18 7,12" strokeWidth="0.8" />
        <line x1="4" y1="6" x2="20" y2="18" strokeWidth="0.7" />
        <line x1="4" y1="18" x2="20" y2="6" strokeWidth="0.7" />
      </svg>
    );
  }
  if (norm.includes("marquise")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2 C18 7 19 17 12 22 C5 17 6 7 12 2 Z" />
        <line x1="12" y1="2" x2="12" y2="22" strokeWidth="0.8" />
        <line x1="7" y1="12" x2="17" y2="12" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("heart")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 6 C10 3 5 3 4 7 C3 12 12 19 12 21 C12 19 21 12 20 7 C19 3 14 3 12 6 Z" />
        <polygon points="12,8 16,13 8,13" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("asscher")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <polygon points="6,3 18,3 21,6 21,18 18,21 6,21 3,18 3,6" />
        <polygon points="8,5 16,5 19,8 19,16 16,19 8,19 5,16 5,8" strokeWidth="0.8" />
        <rect x="9" y="9" width="6" height="6" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("rose")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="9" />
        <polygon points="12,4 19,8 19,16 12,20 5,16 5,8" strokeWidth="0.8" />
        <polygon points="12,7 16,10 16,14 12,17 8,14 8,10" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("baguette")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="6" y="3" width="12" height="18" rx="0.5" />
        <rect x="9" y="5" width="6" height="14" strokeWidth="0.8" />
      </svg>
    );
  }
  // Antique / Old Cut fallback
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" strokeWidth="0.9" />
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="0.8" />
      <line x1="3" y1="12" x2="21" y2="12" strokeWidth="0.8" />
    </svg>
  );
}

// ==========================================
// 2. Ring Style Silhouette Icons (SVG)
// ==========================================
export function RingStyleIcon({ styleName, size = 18 }) {
  const norm = (styleName || "").toLowerCase();

  if (norm.includes("solitaire")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <circle cx="12" cy="5.5" r="2.2" strokeWidth="1.1" fill="currentColor" fillOpacity="0.15" />
      </svg>
    );
  }
  if (norm.includes("halo") && !norm.includes("hidden")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <circle cx="12" cy="5.5" r="3.4" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        <circle cx="12" cy="5.5" r="1.6" fill="currentColor" fillOpacity="0.25" />
      </svg>
    );
  }
  if (norm.includes("three")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <circle cx="12" cy="5" r="2.2" fill="currentColor" fillOpacity="0.2" />
        <circle cx="8" cy="6.5" r="1.3" />
        <circle cx="16" cy="6.5" r="1.3" />
      </svg>
    );
  }
  if (norm.includes("vintage")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <path d="M7 11 Q12 7 17 11" strokeWidth="0.8" />
        <circle cx="12" cy="5.5" r="2" />
        <path d="M10 5.5 C10 3.5 14 3.5 14 5.5" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("nature")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <path d="M9 10 Q11 6 12 5 Q13 6 15 10" strokeWidth="0.8" />
        <path d="M10 8 Q8 6 9 4" strokeWidth="0.8" />
        <path d="M14 8 Q16 6 15 4" strokeWidth="0.8" />
        <circle cx="12" cy="5" r="1.6" />
      </svg>
    );
  }
  if (norm.includes("pave")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" strokeDasharray="1.5 1.5" strokeWidth="1.5" />
        <circle cx="12" cy="5.5" r="2.2" />
      </svg>
    );
  }
  if (norm.includes("bezel")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <circle cx="12" cy="5.5" r="2.8" strokeWidth="1.4" />
        <circle cx="12" cy="5.5" r="1.4" fill="currentColor" fillOpacity="0.25" />
      </svg>
    );
  }
  if (norm.includes("side")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <circle cx="12" cy="5" r="2.2" />
        <circle cx="8.5" cy="8" r="1" />
        <circle cx="15.5" cy="8" r="1" />
      </svg>
    );
  }
  if (norm.includes("hidden")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <ellipse cx="12" cy="7.2" rx="3.5" ry="1.2" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        <circle cx="12" cy="4.5" r="2" />
      </svg>
    );
  }
  if (norm.includes("toi")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <circle cx="10" cy="5.5" r="2" />
        <polygon points="14,3.5 16,5.5 14,7.5 12,5.5" strokeWidth="0.8" />
      </svg>
    );
  }
  // Generic ring
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="14" r="7" />
      <polygon points="12,3 15,6 12,9 9,6" strokeWidth="0.9" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

// ==========================================
// 3. Main Mega Menu Component
// ==========================================
export default function MegaMenu() {
  const { collectionBanners } = useStore();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);

  const featuredBanner =
    Array.isArray(collectionBanners) && collectionBanners.length > 0
      ? collectionBanners[0]
      : {
          title: "The Atelier Diamond Edit",
          tag: "ENDS SOON • DON'T MISS OUT!",
          description: "Complimentary Insured Delivery on all orders $1,000+ & Lifetime Warranty",
          image: promo1,
          buttonText: "EXPLORE COLLECTIONS",
          buttonLink: "/collections"
        };

  const handleMouseEnter = (menuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  };

  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
  };

  // ------------------------------------------
  // Configuration Data for Each Category Tab
  // ------------------------------------------
  const ringStyles = [
    { label: "Nature Inspired Rings", query: "Nature Inspired" },
    { label: "Vintage Style Rings", query: "Vintage Style Rings" },
    { label: "Solitaire Rings", query: "Solitaire" },
    { label: "Halo Rings", query: "Halo" },
    { label: "Three Stone Rings", query: "Three Stone" },
    { label: "Pave Rings", query: "Pave" },
    { label: "Side Stone Rings", query: "Side Stone" },
    { label: "Bezel Set Rings", query: "Bezel Set" },
    { label: "Hidden Halo Rings", query: "Hidden Halo" },
    { label: "Toi et Moi Rings", query: "Toi et Moi" }
  ];

  const diamondShapesCol1 = [
    { label: "Antique Cut", shape: "antique" },
    { label: "Dutch Marquise", shape: "marquise" },
    { label: "Marquise", shape: "marquise" },
    { label: "Oval", shape: "oval" },
    { label: "Pear", shape: "pear" },
    { label: "Cushion", shape: "cushion" },
    { label: "Emerald", shape: "emerald" },
    { label: "Radiant", shape: "radiant" },
    { label: "Princess", shape: "princess" },
    { label: "Rose Cut", shape: "rose cut" }
  ];

  const diamondShapesCol2 = [
    { label: "Old Cut", shape: "old cut" },
    { label: "Baguette", shape: "baguette" },
    { label: "Asscher", shape: "asscher" },
    { label: "Heart", shape: "heart" },
    { label: "Round", shape: "round" }
  ];

  const bridalStyles = [
    { label: "Eternity Bands", query: "Eternity" },
    { label: "Classic Wedding Bands", query: "Classic" },
    { label: "Contour & Curved Bands", query: "Contour" },
    { label: "Two Stone Bridal Sets", query: "Two Stone" },
    { label: "Four Stone Bridal Sets", query: "Four Stone" },
    { label: "Stackable Diamond Bands", query: "Stackable" },
    { label: "Men's Atelier Bands", query: "Men" },
    { label: "Complete Bridal Sets", query: "Bridal Sets" }
  ];

  const jewelryCategories = [
    { label: "Tennis Bracelets", query: "Bracelets", param: "category" },
    { label: "Diamond Stud Earrings", query: "Earrings", param: "category" },
    { label: "Hoop & Drop Earrings", query: "Earrings", param: "category" },
    { label: "Cuff & Bangle Bracelets", query: "Bracelets", param: "category" },
    { label: "Solitaire Diamond Pendants", query: "Necklace", param: "search" },
    { label: "Eternity Rings", query: "Eternity", param: "style" },
    { label: "Cocktail Atelier Pieces", query: "Cocktail", param: "style" }
  ];

  return (
    <div
      style={{ position: "relative", width: "100%" }}
      onMouseLeave={handleMouseLeave}
    >
      {/* ---------------- Navigation Bar Row ---------------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(18px, 2.5vw, 42px)",
          padding: "10px 0 14px",
          borderTop: "1px solid rgba(235, 229, 218, 0.6)"
        }}
        className="desktop-only-nav"
      >
        {/* TAB 1: ENGAGEMENT RINGS */}
        <div
          onMouseEnter={() => handleMouseEnter("engagement")}
          style={{ position: "relative" }}
        >
          <Link
            to="/collections?category=Engagement%20Rings"
            onClick={closeMenu}
            className={`nav-link-luxury ${activeMenu === "engagement" ? "active" : ""}`}
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: activeMenu === "engagement" ? "var(--primary)" : "var(--foreground)",
              padding: "6px 2px"
            }}
          >
            Engagement Rings
            <ChevronDown size={12} strokeWidth={1.8} style={{ opacity: 0.7 }} />
          </Link>
        </div>

        {/* TAB 2: WEDDING RINGS */}
        <div
          onMouseEnter={() => handleMouseEnter("wedding")}
          style={{ position: "relative" }}
        >
          <Link
            to="/collections?category=Bridal%20Sets"
            onClick={closeMenu}
            className={`nav-link-luxury ${activeMenu === "wedding" ? "active" : ""}`}
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: activeMenu === "wedding" ? "var(--primary)" : "var(--foreground)",
              padding: "6px 2px"
            }}
          >
            Wedding Rings
            <ChevronDown size={12} strokeWidth={1.8} style={{ opacity: 0.7 }} />
          </Link>
        </div>

        {/* TAB 3: FINE JEWELRY */}
        <div
          onMouseEnter={() => handleMouseEnter("jewelry")}
          style={{ position: "relative" }}
        >
          <Link
            to="/collections"
            onClick={closeMenu}
            className={`nav-link-luxury ${activeMenu === "jewelry" ? "active" : ""}`}
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: activeMenu === "jewelry" ? "var(--primary)" : "var(--foreground)",
              padding: "6px 2px"
            }}
          >
            Fine Jewelry
            <ChevronDown size={12} strokeWidth={1.8} style={{ opacity: 0.7 }} />
          </Link>
        </div>

        {/* TAB 4: COLLECTIONS */}
        <div
          onMouseEnter={() => handleMouseEnter("shopall")}
          style={{ position: "relative" }}
        >
          <Link
            to="/collections"
            onClick={closeMenu}
            className={`nav-link-luxury ${activeMenu === "shopall" ? "active" : ""}`}
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: activeMenu === "shopall" ? "var(--primary)" : "var(--foreground)",
              padding: "6px 2px"
            }}
          >
            Collections
            <ChevronDown size={12} strokeWidth={1.8} style={{ opacity: 0.7 }} />
          </Link>
        </div>

        {/* TAB 5: ABOUT US (Direct Link, No Dropdown) */}
        <div onMouseEnter={closeMenu} style={{ position: "relative" }}>
          <Link
            to="/about"
            onClick={closeMenu}
            className={`nav-link-luxury ${location.pathname === "/about" ? "active" : ""}`}
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              color: location.pathname === "/about" ? "var(--primary)" : "var(--foreground)",
              padding: "6px 2px"
            }}
          >
            About Us
          </Link>
        </div>

        {/* TAB 6: CONTACT (Direct Link, No Dropdown) */}
        <div onMouseEnter={closeMenu} style={{ position: "relative" }}>
          <Link
            to="/contact"
            onClick={closeMenu}
            className={`nav-link-luxury ${location.pathname === "/contact" ? "active" : ""}`}
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              color: location.pathname === "/contact" ? "var(--primary)" : "var(--foreground)",
              padding: "6px 2px"
            }}
          >
            Contact
          </Link>
        </div>
      </div>

      {/* ---------------- Full-Width Mega Menu Dropdown Panel ---------------- */}
      {activeMenu && (
        <div
          onMouseEnter={() => handleMouseEnter(activeMenu)}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            width: "100%",
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e8e3d8",
            borderBottom: "1px solid #e0dad0",
            boxShadow: "0 22px 45px rgba(26, 32, 20, 0.08)",
            zIndex: 999,
            animation: "fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <div className="container-luxury" style={{ padding: "36px 44px 28px" }}>
            {/* 1. ENGAGEMENT RINGS MEGA MENU */}
            {activeMenu === "engagement" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.5fr 1fr 1.3fr",
                  gap: "40px",
                  alignItems: "start"
                }}
              >
                {/* Col 1: Collections by Style */}
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Shop by Ring Style
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {ringStyles.map((item) => (
                      <Link
                        key={item.label}
                        to={`/collections?style=${encodeURIComponent(item.query)}`}
                        onClick={closeMenu}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "10px",
                          color: "var(--foreground)",
                          textDecoration: "none",
                          fontSize: "0.84rem",
                          fontWeight: 500,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--primary)";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--foreground)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ color: "var(--gold-deep)", display: "flex", alignItems: "center" }}>
                          <RingStyleIcon styleName={item.query} size={16} />
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Link
                      to="/collections?category=Engagement%20Rings"
                      onClick={closeMenu}
                      style={{
                        marginTop: "8px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--primary)",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px"
                      }}
                    >
                      View All Ring Collections
                    </Link>
                  </div>
                </div>

                {/* Col 2: Diamond Shapes (2 Sub-columns) */}
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Shop by Diamond Shape
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                    {/* Left Sub-column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {diamondShapesCol1.map((item) => (
                        <Link
                          key={item.label}
                          to={`/collections?shape=${encodeURIComponent(item.label)}`}
                          onClick={closeMenu}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "9px",
                            color: "var(--foreground)",
                            textDecoration: "none",
                            fontSize: "0.84rem",
                            fontWeight: 500,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--primary)";
                            e.currentTarget.style.transform = "translateX(3px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--foreground)";
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          <span style={{ color: "var(--gold-deep)", display: "flex", alignItems: "center" }}>
                            <DiamondShapeIcon shape={item.shape} size={16} />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Right Sub-column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {diamondShapesCol2.map((item) => (
                        <Link
                          key={item.label}
                          to={`/collections?shape=${encodeURIComponent(item.label)}`}
                          onClick={closeMenu}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "9px",
                            color: "var(--foreground)",
                            textDecoration: "none",
                            fontSize: "0.84rem",
                            fontWeight: 500,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--primary)";
                            e.currentTarget.style.transform = "translateX(3px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--foreground)";
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          <span style={{ color: "var(--gold-deep)", display: "flex", alignItems: "center" }}>
                            <DiamondShapeIcon shape={item.shape} size={16} />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      ))}

                      <Link
                        to="/collections"
                        onClick={closeMenu}
                        style={{
                          marginTop: "14px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "var(--primary)",
                          textDecoration: "underline",
                          textUnderlineOffset: "4px"
                        }}
                      >
                        Explore All Shapes
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Col 3: Featured Curations */}
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Featured
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Link
                      to="/collections?featured=bestseller"
                      onClick={closeMenu}
                      style={{
                        color: "var(--foreground)",
                        textDecoration: "none",
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        transition: "color 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                    >
                      Top 20 Engagement Rings
                    </Link>
                    <Link
                      to="/collections?featured=new"
                      onClick={closeMenu}
                      style={{
                        color: "var(--foreground)",
                        textDecoration: "none",
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        transition: "color 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                    >
                      New Arrivals
                    </Link>
                    <Link
                      to="/collections?featured=bestseller"
                      onClick={closeMenu}
                      style={{
                        color: "var(--foreground)",
                        textDecoration: "none",
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        transition: "color 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                    >
                      Best Sellers
                    </Link>
                    <Link
                      to="/collections?style=Vintage%20Style%20Rings"
                      onClick={closeMenu}
                      style={{
                        color: "var(--foreground)",
                        textDecoration: "none",
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        transition: "color 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                    >
                      Designer Atelier Rings
                    </Link>
                    <Link
                      to="/collections?search=solitaire"
                      onClick={closeMenu}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--foreground)",
                        textDecoration: "none",
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        transition: "color 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                    >
                      <span>Zodiac &amp; Celestial Jewelry</span>
                      <span
                        style={{
                          backgroundColor: "#161e12",
                          color: "#ffffff",
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "2px",
                          letterSpacing: "0.1em"
                        }}
                      >
                        NEW
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Col 4: Featured Promo Card */}
                <div
                  style={{
                    backgroundColor: "#141c10",
                    color: "#ffffff",
                    borderRadius: "4px",
                    overflow: "hidden",
                    position: "relative",
                    minHeight: "260px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "24px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.14)"
                  }}
                >
                  <img
                    src={featuredBanner?.image || atelierImg}
                    alt={featuredBanner?.title || "Atelier Diamond Showcase"}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.62,
                      transition: "transform 0.6s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <span
                      style={{
                        color: "var(--gold-light)",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase"
                      }}
                    >
                      {featuredBanner?.tag || "ATELIER SPOTLIGHT"}
                    </span>
                    <h5
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.15rem",
                        marginTop: "6px",
                        lineHeight: 1.25,
                        color: "#ffffff"
                      }}
                    >
                      {featuredBanner?.title || "Ends Soon • Don't Miss Out!"}
                    </h5>
                    <p
                      style={{
                        fontSize: "0.76rem",
                        color: "rgba(255,255,255,0.82)",
                        marginTop: "8px",
                        lineHeight: 1.5
                      }}
                    >
                      Complimentary Insured Delivery &amp; Lifetime Polish on bespoke creations.
                    </p>
                    <Link
                      to={featuredBanner?.buttonLink || "/collections"}
                      onClick={closeMenu}
                      className="eyebrow"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "14px",
                        backgroundColor: "var(--gold-deep)",
                        color: "#161e12",
                        padding: "8px 18px",
                        borderRadius: "2px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em"
                      }}
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 2. WEDDING RINGS MEGA MENU */}
            {activeMenu === "wedding" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.5fr 1fr 1.3fr",
                  gap: "40px",
                  alignItems: "start"
                }}
              >
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Bridal Collections
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {bridalStyles.map((item) => (
                      <Link
                        key={item.label}
                        to={`/collections?category=Bridal%20Sets&style=${encodeURIComponent(item.query)}`}
                        onClick={closeMenu}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "10px",
                          color: "var(--foreground)",
                          textDecoration: "none",
                          fontSize: "0.84rem",
                          fontWeight: 500,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--primary)";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--foreground)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <span style={{ color: "var(--gold-deep)", display: "flex", alignItems: "center" }}>
                          <RingStyleIcon styleName={item.query} size={16} />
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Link
                      to="/collections?category=Bridal%20Sets"
                      onClick={closeMenu}
                      style={{
                        marginTop: "8px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--primary)",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px"
                      }}
                    >
                      View All Bridal Collections
                    </Link>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Diamond Band Shapes
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {diamondShapesCol1.slice(0, 6).map((item) => (
                        <Link
                          key={item.label}
                          to={`/collections?category=Bridal%20Sets&shape=${encodeURIComponent(item.label)}`}
                          onClick={closeMenu}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "9px",
                            color: "var(--foreground)",
                            textDecoration: "none",
                            fontSize: "0.84rem",
                            fontWeight: 500,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--primary)";
                            e.currentTarget.style.transform = "translateX(3px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--foreground)";
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          <span style={{ color: "var(--gold-deep)", display: "flex", alignItems: "center" }}>
                            <DiamondShapeIcon shape={item.shape} size={16} />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {diamondShapesCol2.map((item) => (
                        <Link
                          key={item.label}
                          to={`/collections?category=Bridal%20Sets&shape=${encodeURIComponent(item.label)}`}
                          onClick={closeMenu}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "9px",
                            color: "var(--foreground)",
                            textDecoration: "none",
                            fontSize: "0.84rem",
                            fontWeight: 500,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--primary)";
                            e.currentTarget.style.transform = "translateX(3px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--foreground)";
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          <span style={{ color: "var(--gold-deep)", display: "flex", alignItems: "center" }}>
                            <DiamondShapeIcon shape={item.shape} size={16} />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Bridal Highlights
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Link
                      to="/collections?category=Bridal%20Sets"
                      onClick={closeMenu}
                      style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem", fontWeight: 500 }}
                    >
                      Matching His &amp; Hers Bands
                    </Link>
                    <Link
                      to="/collections?category=Bridal%20Sets&style=Eternity"
                      onClick={closeMenu}
                      style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem", fontWeight: 500 }}
                    >
                      Full Eternity Diamond Rings
                    </Link>
                    <Link
                      to="/collections?category=Bridal%20Sets"
                      onClick={closeMenu}
                      style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem", fontWeight: 500 }}
                    >
                      Bespoke Wedding Band Sets
                    </Link>
                    <Link
                      to="/contact"
                      onClick={closeMenu}
                      style={{ color: "var(--gold-deep)", textDecoration: "underline", fontSize: "0.84rem", fontWeight: 600, marginTop: "8px" }}
                    >
                      Book Bridal Fitting Consultation →
                    </Link>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#faf7f2",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: "1px solid #ede8de",
                    padding: "20px"
                  }}
                >
                  <img
                    src={promo2}
                    alt="Bridal Sets"
                    style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "2px" }}
                  />
                  <h5 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", marginTop: "12px", color: "var(--foreground)" }}>
                    Timeless Bridal Sets
                  </h5>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "6px", lineHeight: 1.5 }}>
                    Mastercrafted to interlock seamlessly with your engagement ring.
                  </p>
                  <Link
                    to="/collections?category=Bridal%20Sets"
                    onClick={closeMenu}
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                      letterSpacing: "0.14em"
                    }}
                  >
                    EXPLORE BRIDAL ARCHIVE →
                  </Link>
                </div>
              </div>
            )}

            {/* 3. FINE JEWELRY MEGA MENU */}
            {activeMenu === "jewelry" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.5fr 1fr 1.3fr",
                  gap: "40px",
                  alignItems: "start"
                }}
              >
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Signature Collections
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {jewelryCategories.map((item) => (
                      <Link
                        key={item.label}
                        to={`/collections?${item.param}=${encodeURIComponent(item.query)}`}
                        onClick={closeMenu}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "var(--foreground)",
                          textDecoration: "none",
                          fontSize: "0.84rem",
                          fontWeight: 500,
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                      >
                        <span style={{ color: "var(--gold-deep)" }}>✦</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Link
                      to="/collections"
                      onClick={closeMenu}
                      style={{
                        marginTop: "8px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--primary)",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px"
                      }}
                    >
                      View All Collections
                    </Link>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Diamond Shapes
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 18px" }}>
                    {diamondShapesCol1.slice(0, 8).map((item) => (
                      <Link
                        key={item.label}
                        to={`/collections?shape=${encodeURIComponent(item.label)}`}
                        onClick={closeMenu}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "var(--foreground)",
                          textDecoration: "none",
                          fontSize: "0.84rem",
                          fontWeight: 500
                        }}
                      >
                        <span style={{ color: "var(--gold-deep)" }}>
                          <DiamondShapeIcon shape={item.shape} size={15} />
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "18px"
                    }}
                  >
                    Curations
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Link to="/collections?category=Bracelets" onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>
                      Tennis &amp; Bangle Bracelets
                    </Link>
                    <Link to="/collections?category=Earrings" onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>
                      Diamond Solitaire Studs
                    </Link>
                    <Link to="/collections?featured=bestseller" onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>
                      Everyday Luxury Icons
                    </Link>
                    <Link to="/collections?featured=new" onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>
                      New Atelier Arrivals
                    </Link>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#161e12",
                    borderRadius: "4px",
                    overflow: "hidden",
                    padding: "22px",
                    color: "#ffffff"
                  }}
                >
                  <span style={{ fontSize: "0.68rem", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    FEATURED ATELIER
                  </span>
                  <h5 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginTop: "6px" }}>
                    Handcrafted Bracelets
                  </h5>
                  <p style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.8)", marginTop: "6px", lineHeight: 1.5 }}>
                    Sculpted with certified conflict-free diamonds and 18K solid gold.
                  </p>
                  <Link
                    to="/collections?category=Bracelets"
                    onClick={closeMenu}
                    style={{
                      display: "inline-block",
                      marginTop: "12px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--gold-light)",
                      letterSpacing: "0.14em"
                    }}
                  >
                    EXPLORE BRACELETS →
                  </Link>
                </div>
              </div>
            )}

            {/* 4. COLLECTIONS MEGA MENU */}
            {activeMenu === "shopall" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1.2fr",
                  gap: "36px",
                  alignItems: "start"
                }}
              >
                <div>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                    Categories
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Link to="/collections?category=Bracelets" onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>Bracelets</Link>
                    <Link to="/collections?category=Bridal%20Sets" onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>Bridal Sets</Link>
                    <Link to="/collections?category=Earrings" onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>Earrings</Link>
                    <Link to="/collections?category=Engagement%20Rings" onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>Engagement Rings</Link>
                    <Link to="/collections" onClick={closeMenu} style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "underline", fontSize: "0.8rem", marginTop: "6px" }}>Browse All Pieces</Link>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                    Diamond Shapes
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {["Round", "Emerald", "Oval", "Princess", "Cushion", "Pear", "Heart"].map((s) => (
                      <Link key={s} to={`/collections?shape=${encodeURIComponent(s)}`} onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--gold-deep)" }}><DiamondShapeIcon shape={s} size={15} /></span>
                        <span>{s} Cut</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                    Precious Metals
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {["18K White Gold", "14K White Gold", "10K Yellow Gold", "10K White Gold", "925 Silver"].map((m) => (
                      <Link key={m} to={`/collections?search=${encodeURIComponent(m)}`} onClick={closeMenu} style={{ color: "var(--foreground)", textDecoration: "none", fontSize: "0.84rem" }}>
                        {m}
                      </Link>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: "#FAF9F6", padding: "20px", borderRadius: "4px", border: "1px solid #ebe5da" }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--primary)", letterSpacing: "0.18em", fontWeight: 700 }}>
                    THE ATELIER ARCHIVE
                  </span>
                  <h5 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginTop: "8px" }}>
                    Conflict-Free Lab Grown Diamonds
                  </h5>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "6px", lineHeight: 1.5 }}>
                    Certified by premier gemological institutes with exact chemical and optical purity.
                  </p>
                  <Link to="/collections" onClick={closeMenu} style={{ display: "inline-block", marginTop: "12px", fontSize: "0.74rem", fontWeight: 700, color: "var(--primary)" }}>
                    VIEW COMPLETE CATALOG →
                  </Link>
                </div>
              </div>
            )}


          </div>

          {/* ---------------- Bottom Banner Strip (Across all Mega Menus) ---------------- */}
          <div
            style={{
              backgroundColor: "#faf8f4",
              borderTop: "1px solid #eee8de",
              padding: "10px 24px",
              textAlign: "center"
            }}
          >
            <Link
              to="/contact"
              onClick={closeMenu}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.74rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--primary)",
                textDecoration: "none",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-deep)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary)")}
            >
              <span>💍</span>
              <span>DESIGN YOUR OWN BESPOKE ENGAGEMENT RING &bull; BOOK AN ATELIER APPOINTMENT</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
