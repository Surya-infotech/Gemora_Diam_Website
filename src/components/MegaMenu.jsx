import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useStore } from "../lib/store";
import promo1 from "../assets/vemus/collections_promo-1.jpg";

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
        <circle cx="12" cy="5.5" r="1.6" fill="currentColor" />
      </svg>
    );
  }
  if (norm.includes("vintage")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <path d="M7 11 C8 9 9 7 12 5 C15 7 16 9 17 11" strokeWidth="0.9" />
        <circle cx="12" cy="5" r="1.8" />
      </svg>
    );
  }
  if (norm.includes("three")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <circle cx="12" cy="5" r="2" />
        <circle cx="8" cy="7" r="1.4" />
        <circle cx="16" cy="7" r="1.4" />
      </svg>
    );
  }
  if (norm.includes("nature")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <path d="M12 4 Q14 2 16 5 Q14 8 12 7" strokeWidth="0.9" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 4 Q10 2 8 5 Q10 8 12 7" strokeWidth="0.9" fill="currentColor" fillOpacity="0.2" />
      </svg>
    );
  }
  if (norm.includes("bezel")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" />
        <circle cx="12" cy="5.5" r="3" strokeWidth="1.3" />
        <circle cx="12" cy="5.5" r="1.5" strokeWidth="0.6" />
      </svg>
    );
  }
  if (norm.includes("pave")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="15" r="7" strokeDasharray="2 1.5" />
        <circle cx="12" cy="5" r="2.2" />
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
// 3. Main Dynamic Mega Menu Component
// ==========================================
export default function MegaMenu() {
  const { menus } = useStore();
  const location = useLocation();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const timeoutRef = useRef(null);

  const activeMenus = Array.isArray(menus) ? menus : [];

  const handleMouseEnter = (menuId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenuId(menuId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 120);
  };

  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenuId(null);
  };

  const currentMenu = activeMenus.find((m) => m.menuid === activeMenuId);

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
        {/* Dynamic Menus from Backend */}
        {activeMenus.map((menu) => {
          const isMenuOpen = activeMenuId === menu.menuid;
          const isPageActive = location.pathname === menu.slug;
          return (
            <div
              key={menu.menuid || menu.title}
              onMouseEnter={() => handleMouseEnter(menu.menuid)}
              style={{ position: "relative" }}
            >
              <Link
                to={menu.slug || "/collections"}
                onClick={closeMenu}
                className={`nav-link-luxury ${isMenuOpen || isPageActive ? "active" : ""}`}
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: isMenuOpen || isPageActive ? "var(--primary)" : "var(--foreground)",
                  padding: "6px 2px"
                }}
              >
                {menu.title}
                <ChevronDown size={12} strokeWidth={1.8} style={{ opacity: 0.7 }} />
              </Link>
            </div>
          );
        })}

        {/* Ensure Collections tab appears if no collection menu created */}
        {!activeMenus.some((m) => (m.title || "").toLowerCase().includes("collection") || (m.slug || "").includes("/collection")) && (
          <div onMouseEnter={closeMenu} style={{ position: "relative" }}>
            <Link
              to="/collections"
              onClick={closeMenu}
              className={`nav-link-luxury ${location.pathname === "/collections" || location.pathname === "/collection" ? "active" : ""}`}
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                color: location.pathname === "/collections" || location.pathname === "/collection" ? "var(--primary)" : "var(--foreground)",
                padding: "6px 2px"
              }}
            >
              Collections
            </Link>
          </div>
        )}

        {/* STATIC TABS: ABOUT US & CONTACT */}
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

      {/* ---------------- Full-Width Dynamic Mega Menu Dropdown Panel ---------------- */}
      {currentMenu && (
        <div
          onMouseEnter={() => handleMouseEnter(currentMenu.menuid)}
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1.5fr 1fr 1.3fr",
                gap: "40px",
                alignItems: "start"
              }}
            >
              {/* COLUMN 1: Styles / Categories */}
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
                  {currentMenu.column1?.title || "Shop by Style"}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {(currentMenu.column1?.items || []).map((item) => (
                    <Link
                      key={item.label}
                      to={item.slug || "/collections"}
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
                        <RingStyleIcon styleName={item.filterValue || item.label} size={16} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  {currentMenu.column1?.bottomText && (
                    <Link
                      to={currentMenu.column1?.bottomUrl || "/collections"}
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
                      {currentMenu.column1.bottomText}
                    </Link>
                  )}
                </div>
              </div>

              {/* COLUMN 2: Diamond Shapes */}
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
                  {currentMenu.column2?.title || "Shop by Diamond Shape"}
                </h4>
                {(() => {
                  const items = currentMenu.column2?.items || [];
                  const mid = Math.ceil(items.length / 2);
                  const col1 = items.slice(0, mid);
                  const col2 = items.slice(mid);

                  return (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {col1.map((item) => (
                            <Link
                              key={item.label}
                              to={item.slug || "/collections"}
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
                                <DiamondShapeIcon shape={item.shape || item.label} size={16} />
                              </span>
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {col2.map((item) => (
                            <Link
                              key={item.label}
                              to={item.slug || "/collections"}
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
                                <DiamondShapeIcon shape={item.shape || item.label} size={16} />
                              </span>
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {currentMenu.column2?.bottomText && (
                        <Link
                          to={currentMenu.column2?.bottomUrl || "/collections"}
                          onClick={closeMenu}
                          style={{
                            display: "inline-block",
                            marginTop: "16px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "var(--primary)",
                            textDecoration: "underline",
                            textUnderlineOffset: "4px"
                          }}
                        >
                          {currentMenu.column2.bottomText}
                        </Link>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* COLUMN 3: Featured & Curations */}
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
                  {currentMenu.column3?.title || "Featured"}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {(currentMenu.column3?.items || []).map((item) => (
                    <Link
                      key={item.label}
                      to={item.slug || "/collections"}
                      onClick={closeMenu}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
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
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            padding: "2px 6px",
                            backgroundColor: "#1b211a",
                            color: "#d4af37",
                            borderRadius: "2px",
                            lineHeight: 1
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* COLUMN 4: Promotional Atelier Banner Card */}
              {currentMenu.banner && (
                <div
                  style={{
                    position: "relative",
                    borderRadius: "4px",
                    overflow: "hidden",
                    aspectRatio: "4 / 3",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.08)"
                  }}
                >
                  <img
                    src={currentMenu.banner.image || promo1}
                    alt={currentMenu.banner.title || "Featured Collection"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(18,22,15,0.85) 0%, rgba(18,22,15,0.2) 60%, transparent 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "20px",
                      color: "#ffffff"
                    }}
                  >
                    {currentMenu.banner.eyebrow && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "#d4af37",
                          fontWeight: 600,
                          marginBottom: "4px"
                        }}
                      >
                        {currentMenu.banner.eyebrow}
                      </span>
                    )}
                    <h5
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        margin: "0 0 6px 0",
                        color: "#ffffff"
                      }}
                    >
                      {currentMenu.banner.title}
                    </h5>
                    {currentMenu.banner.description && (
                      <p
                        style={{
                          fontSize: "0.74rem",
                          lineHeight: 1.4,
                          color: "rgba(255,255,255,0.8)",
                          margin: "0 0 12px 0"
                        }}
                      >
                        {currentMenu.banner.description}
                      </p>
                    )}
                    <Link
                      to={currentMenu.banner.buttonLink || "/collections"}
                      onClick={closeMenu}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#c5a059",
                        color: "#181f13",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "8px 14px",
                        borderRadius: "2px",
                        textDecoration: "none",
                        width: "fit-content",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0b86a")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c5a059")}
                    >
                      <span>{currentMenu.banner.buttonText || "EXPLORE COLLECTION"}</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Atelier Concierge Strip */}
          {currentMenu.bottomBar?.text && (
            <div
              style={{
                backgroundColor: "#FAF8F5",
                borderTop: "1px solid #EDE8DE",
                padding: "10px 20px",
                textAlign: "center"
              }}
            >
              <Link
                to={currentMenu.bottomBar.link || "/contact"}
                onClick={closeMenu}
                style={{
                  fontSize: "0.74rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
              >
                <span style={{ color: "var(--gold-deep)" }}>✦</span>
                <span>{currentMenu.bottomBar.text}</span>
                <span style={{ fontSize: "0.85rem" }}>→</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
