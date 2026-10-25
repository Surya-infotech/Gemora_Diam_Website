import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Phone,
  ArrowRight,
  LogOut,
  Truck,
  ShieldCheck,
  Lock,
  Sparkles,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { useStore } from "../lib/store";
import { formatPhoneNumber } from "../lib/formatters";
import { CartLines } from "./CartLines";
import MegaMenu from "./MegaMenu";

export function Logo() {
  const { generalSettings } = useStore();
  const brandName = generalSettings?.softwarename || "Gemora Diam";
  return (
    <Link
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "clamp(6px, 1.5vw, 10px)",
        textDecoration: "none",
        transition: "opacity 0.2s",
        flexShrink: 0
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {/* Brand Identity Logo */}
      <img
        src="/GEMORALOGO.png"
        alt={brandName}
        style={{
          width: "clamp(34px, 5.5vw, 46px)",
          height: "clamp(34px, 5.5vw, 46px)",
          objectFit: "contain",
          flexShrink: 0,
          display: "block"
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.02rem, 2vw, 1.45rem)",
            fontWeight: 600,
            fontStyle: "italic",
            letterSpacing: "0.02em",
            color: "var(--foreground)",
            whiteSpace: "nowrap"
          }}
        >
          {brandName}
        </span>
        <span
          style={{
            fontSize: "clamp(0.44rem, 0.9vw, 0.50rem)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--primary)",
            fontWeight: 600,
            marginTop: "3px",
            whiteSpace: "nowrap"
          }}
        >
          Fine Jewelry • Design Studio
        </span>
      </div>
    </Link>
  );
}

function Badge({ n }) {
  if (!n) return null;
  return (
    <span
      style={{
        position: "absolute",
        top: "-6px",
        right: "-8px",
        backgroundColor: "var(--primary)",
        color: "#ffffff",
        fontSize: "0.62rem",
        fontWeight: 700,
        height: "18px",
        minWidth: "18px",
        borderRadius: "9px",
        display: "grid",
        placeItems: "center",
        padding: "0 4px",
        border: "1.5px solid #ffffff",
        boxShadow: "0 2px 6px rgba(85, 104, 50, 0.4)",
        lineHeight: 1
      }}
    >
      {n}
    </span>
  );
}

function AccountMenu() {
  const { user, logout } = useStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: "relative" }} ref={menuRef} className="tablet-up-nav">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account Menu"
        style={{
          background: "none",
          border: "none",
          color: "var(--foreground)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-soft)";
          e.currentTarget.style.color = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "var(--foreground)";
        }}
      >
        <User size={21} strokeWidth={1.5} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 14px)",
            right: 0,
            backgroundColor: "#ffffff",
            color: "var(--foreground)",
            boxShadow: "var(--shadow-luxury)",
            borderRadius: "4px",
            border: "1px solid #ebe6dc",
            padding: "8px 0",
            minWidth: "240px",
            zIndex: 9999,
            animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {user ? (
            <>
              <div style={{ padding: "12px 20px 14px", borderBottom: "1px solid #f2eee6" }}>
                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--gold-deep)", fontWeight: 700 }}>
                  Client Profile
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", marginTop: "3px" }}>
                  {user.fullname}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "1px" }}>
                  {user.email}
                </div>
              </div>

              <div style={{ padding: "8px 0" }}>
                <Link
                  to="/profile?tab=wishlist"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "9px 20px",
                    fontSize: "0.84rem",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary-soft)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                >
                  My Wishlist
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "9px 20px",
                    fontSize: "0.84rem",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary-soft)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                >
                  Orders &amp; Tracking
                </Link>

                <Link
                  to="/profile?tab=settings"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "9px 20px",
                    fontSize: "0.84rem",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary-soft)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                >
                  Security &amp; Addresses
                </Link>
              </div>

              <div style={{ borderTop: "1px solid #f2eee6", paddingTop: "6px" }}>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "9px 20px",
                    background: "none",
                    border: "none",
                    color: "var(--destructive)",
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "14px 20px" }}>
              <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--foreground)" }}>
                Sign In to Gemora Diam
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", margin: "4px 0 14px", lineHeight: 1.5 }}>
                Access saved pieces, bespoke orders, and concierge tracking.
              </p>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="eyebrow"
                style={{
                  display: "block",
                  textAlign: "center",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  padding: "10px 14px",
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderRadius: "2px",
                  letterSpacing: "0.14em",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
              >
                Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const {
    cartCount,
    wishlist,
    setCartOpen,
    generalSettings,
    products: dynamicProducts,
    format,
    user,
    logout,
    menus,
    categories
  } = useStore();
  const [mobile, setMobile] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const searchPool = dynamicProducts || [];

  const results = q
    ? searchPool.filter((p) => (p.name + " " + (p.category || "")).toLowerCase().includes(q.toLowerCase()))
    : searchPool.slice(0, 4);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      setSearch(false);
      navigate(`/collections?search=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <>
      {/* Sleek Tesora-Style Unified Luxury Announcement Bar */}
      <div
        style={{
          backgroundColor: "var(--primary)",
          color: "#ffffff",
          fontSize: "clamp(0.66rem, 1.4vw, 0.74rem)",
          fontWeight: 500,
          padding: "7px clamp(12px, 3vw, 24px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          position: "relative",
          zIndex: 101,
          overflow: "hidden"
        }}
      >
        <div className="container-luxury announcement-bar-wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          {/* Left: Concierge Phone */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }} className="desktop-only-nav">
            {generalSettings?.phone && (
              <a
                href={`tel:${generalSettings.phone.replace(/\s+/g, '')}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#ffffff",
                  letterSpacing: "0.04em",
                  fontSize: "inherit",
                  textDecoration: "none",
                  opacity: 0.95
                }}
              >
                <Phone size={12} strokeWidth={1.8} />
                <span>Concierge: {formatPhoneNumber(generalSettings.phone)}</span>
              </a>
            )}
          </div>

          {/* Center: Core Guarantees with Luxury Diamond Accents */}
          <div className="announcement-guarantees-track">
            <span>Complimentary Insured Delivery</span>
            <span style={{ color: "var(--gold-light)", opacity: 0.9 }}>•</span>
            <span>7-Day Bespoke Returns</span>
            <span style={{ color: "var(--gold-light)", opacity: 0.9 }} className="announcement-hide-mobile">•</span>
            <span className="announcement-hide-mobile">Lifetime Warranty</span>
            <span style={{ color: "var(--gold-light)", opacity: 0.9 }} className="tablet-up-nav">•</span>
            <span className="tablet-up-nav">100% Certified Lab Diamonds</span>
          </div>

          {/* Right: Book Appointment CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {/* Full text for tablets and desktops */}
            <Link
              to="/contact"
              className="announcement-btn-full"
              style={{
                alignItems: "center",
                gap: "5px",
                color: "#ffffff",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "3px 10px",
                borderRadius: "50px",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.borderColor = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
              }}
            >
              <span>Book Appointment</span>
              <ArrowRight size={11} />
            </Link>

            {/* Compact button for mobile phones */}
            <Link
              to="/contact"
              className="announcement-btn-compact"
              style={{
                alignItems: "center",
                gap: "4px",
                color: "#ffffff",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "3px 8px",
                borderRadius: "50px",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.25)"
              }}
            >
              <span>Book</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Main Sticky Navigation Header (Single-Row Tesora Design) */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid #ebe5da",
          boxShadow: "0 4px 20px rgba(28, 34, 23, 0.04)",
          transition: "all 0.3s ease"
        }}
      >
        <div className="container-luxury site-navbar-tesora">
          {/* Left Cluster: Mobile Burger Toggle + Brand Logo + Desktop Capsule Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 1.6vw, 24px)", flexShrink: 0 }}>
            {/* Mobile Navigation Drawer Toggle */}
            <button
              aria-label="Toggle navigation menu"
              onClick={() => setMobile(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--foreground)",
                padding: "6px",
                borderRadius: "4px",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
              className="mobile-only-btn"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            {/* Brand Identity Logo with Diamond Atelier Crest */}
            <Logo />

            {/* Desktop Capsule Search Bar (Tesora Style: right-aligned magnifying glass) */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                width: "clamp(170px, 16vw, 280px)"
              }}
              className="desktop-only-nav"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search fine jewelry, rings, bands..."
                className="desktop-search-input"
                style={{
                  width: "100%",
                  padding: "8px 38px 8px 16px",
                  borderRadius: "50px",
                  border: "1px solid #dcd7ce",
                  fontSize: "0.80rem",
                  letterSpacing: "0.01em",
                  outline: "none",
                  backgroundColor: "#ffffff",
                  color: "var(--foreground)",
                  transition: "all 0.25s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(85, 104, 50, 0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#dcd7ce";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                aria-label="Submit search"
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "var(--foreground)",
                  opacity: 0.75,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.75";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
              >
                <Search size={15} strokeWidth={1.7} />
              </button>
            </form>
          </div>

          {/* Center-Right: Inline Navigation Links & Dynamic MegaMenu Dropdown */}
          <div style={{ display: "flex", alignItems: "center", marginLeft: "auto", marginRight: "clamp(8px, 1.4vw, 22px)" }}>
            <MegaMenu inline={true} />
          </div>

          {/* Far Right: Client Action Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1.2vw, 16px)", flexShrink: 0 }}>
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearch(true)}
              aria-label="Open search"
              style={{
                background: "none",
                border: "none",
                color: "var(--foreground)",
                padding: "6px",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer"
              }}
              className="mobile-only-btn"
            >
              <Search size={21} strokeWidth={1.5} />
            </button>

            {/* Account Menu */}
            <AccountMenu />

            {/* Wishlist Link with Luxury Count Badge */}
            <Link
              to="/profile?tab=wishlist"
              aria-label="Wishlist"
              style={{
                position: "relative",
                color: "var(--foreground)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                borderRadius: "50%",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary-soft)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--foreground)";
              }}
            >
              <Heart size={21} strokeWidth={1.5} />
              <Badge n={wishlist.length} />
            </Link>

            {/* Shopping Bag Button with Luxury Count Badge */}
            <button
              aria-label="Shopping Bag"
              onClick={() => setCartOpen(true)}
              style={{
                position: "relative",
                color: "var(--foreground)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                borderRadius: "50%",
                transition: "all 0.2s ease",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary-soft)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--foreground)";
              }}
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              <Badge n={cartCount} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(22, 30, 18, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)"
          }}
          onClick={() => setMobile(false)}
        >
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Logo and Close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Logo />
              <button
                onClick={() => setMobile(false)}
                aria-label="Close menu"
                style={{
                  color: "var(--foreground)",
                  padding: "6px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              <Link
                to="/"
                onClick={() => setMobile(false)}
                style={{
                  fontSize: "1.02rem",
                  fontWeight: 600,
                  color: location.pathname === "/" ? "var(--primary)" : "var(--foreground)",
                  padding: "8px 0",
                  borderBottom: "1px solid #f2eee6"
                }}
              >
                Home
              </Link>

              {/* Dynamic Menus from Backend if configured */}
              {Array.isArray(menus) && menus.length > 0 ? (
                menus.map((m, mIdx) => {
                  const mTitle = typeof m?.title === "object" ? m.title?.value || m.title?.label || "Collection" : (m?.title || "Collection");
                  const rawSlug = typeof m?.slug === "object" ? m.slug?.value || m.slug?.slug || "" : (m?.slug || "");
                  const mSlug = rawSlug || (typeof mTitle === "string" ? mTitle.toLowerCase().trim().replace(/\s+/g, "-") : "collections");
                  const cleanUrl = mSlug.startsWith("/") ? mSlug : `/collection/${mSlug}`;
                  const col1Items = m.column1?.items || [];
                  const col2Items = m.column2?.items || [];
                  const allItems = [...col1Items, ...col2Items];
                  const hasSub = allItems.length > 0;
                  const menuKey = m.menuid || m._id || mIdx;
                  const isExpanded = expandedMobileMenu === menuKey;

                  return (
                    <div key={menuKey} style={{ borderBottom: "1px solid #f2eee6", paddingBottom: "4px" }}>
                      {hasSub ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpandedMobileMenu(isExpanded ? null : menuKey);
                          }}
                          aria-expanded={isExpanded}
                          aria-label={`Toggle ${mTitle} menu`}
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "none",
                            border: "none",
                            padding: "8px 0",
                            cursor: "pointer",
                            textAlign: "left",
                            fontFamily: "inherit",
                            color: "inherit"
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1.02rem",
                              fontWeight: 600,
                              color: isExpanded ? "var(--primary)" : "var(--foreground)",
                              transition: "color 0.2s ease"
                            }}
                          >
                            {mTitle}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isExpanded ? "var(--primary)" : "var(--muted-foreground)",
                              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                              transition: "transform 0.2s ease, color 0.2s ease"
                            }}
                          >
                            <ChevronRight size={18} strokeWidth={2} />
                          </span>
                        </button>
                      ) : (
                        <Link
                          to={cleanUrl}
                          onClick={() => setMobile(false)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "1.02rem",
                            fontWeight: 600,
                            color: "var(--foreground)",
                            padding: "8px 0",
                            textDecoration: "none"
                          }}
                        >
                          <span>{mTitle}</span>
                        </Link>
                      )}

                      {hasSub && isExpanded && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "6px 0 10px 4px" }}>
                          {allItems.map((it, itIdx) => {
                            const itLabel = typeof it?.label === "object" ? it.label?.value || it.label?.label || "" : String(it?.label || "");
                            const itSlug = typeof it?.slug === "object" ? it.slug?.value || it.slug?.slug || "" : String(it?.slug || "");
                            const itUrl = itSlug ? (itSlug.startsWith("/") ? itSlug : `/collection/${itSlug}`) : `/collections?style=${encodeURIComponent(itLabel)}`;
                            return (
                              <Link
                                key={itIdx}
                                to={itUrl}
                                onClick={() => setMobile(false)}
                                style={{
                                  fontSize: "0.76rem",
                                  color: "var(--muted-foreground)",
                                  backgroundColor: "#FAF8F5",
                                  border: "1px solid #EBE5DA",
                                  padding: "5px 12px",
                                  borderRadius: "50px",
                                  textDecoration: "none"
                                }}
                              >
                                {itLabel}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                /* Standard Fallback Curated Categories */
                [
                  {
                    id: "fallback-engagement",
                    title: "Engagement Rings",
                    popular: true,
                    slug: "/collections?category=Engagement%20Rings",
                    items: [
                      { label: "Solitaire", url: "/collections?style=Solitaire" },
                      { label: "Halo", url: "/collections?style=Halo" },
                      { label: "Vintage Style", url: "/collections?style=Vintage%20Style" },
                      { label: "Three Stone", url: "/collections?style=Three%20Stone" },
                      { label: "Oval Cut", url: "/collections?style=Oval%20Cut" },
                      { label: "Round Cut", url: "/collections?style=Round%20Cut" }
                    ]
                  },
                  {
                    id: "fallback-bridal",
                    title: "Wedding Rings & Bridal Sets",
                    slug: "/collections?category=Bridal%20Sets",
                    items: [
                      { label: "Eternity Bands", url: "/collections?category=Bridal%20Sets&style=Eternity%20Bands" },
                      { label: "Classic Rings", url: "/collections?category=Bridal%20Sets&style=Classic%20Rings" },
                      { label: "Two Stone", url: "/collections?category=Bridal%20Sets&style=Two%20Stone" }
                    ]
                  },
                  {
                    id: "fallback-fine",
                    title: "Fine Jewelry",
                    slug: "/collections",
                    items: [
                      { label: "Bracelets", url: "/collections?category=Bracelets" },
                      { label: "Earrings", url: "/collections?category=Earrings" },
                      { label: "Pendants", url: "/collections?category=Pendants" }
                    ]
                  }
                ].map((cat) => {
                  const isExpanded = expandedMobileMenu === cat.id;
                  return (
                    <div key={cat.id} style={{ borderBottom: "1px solid #f2eee6", paddingBottom: "4px" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setExpandedMobileMenu(isExpanded ? null : cat.id);
                        }}
                        aria-expanded={isExpanded}
                        aria-label={`Toggle ${cat.title} menu`}
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "none",
                          border: "none",
                          padding: "8px 0",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "inherit",
                          color: "inherit"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "1.02rem", fontWeight: 600, color: isExpanded ? "var(--primary)" : "var(--foreground)" }}>
                            {cat.title}
                          </span>
                          {cat.popular && (
                            <span style={{ fontSize: "0.58rem", backgroundColor: "var(--primary)", color: "#fff", padding: "2px 6px", borderRadius: "2px", fontWeight: 700 }}>
                              POPULAR
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isExpanded ? "var(--primary)" : "var(--muted-foreground)",
                            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease, color 0.2s ease"
                          }}
                        >
                          <ChevronRight size={18} strokeWidth={2} />
                        </span>
                      </button>

                      {isExpanded && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "6px 0 10px 4px" }}>
                          {cat.items.map((it) => (
                            <Link
                              key={it.label}
                              to={it.url}
                              onClick={() => setMobile(false)}
                              style={{
                                fontSize: "0.76rem",
                                color: "var(--muted-foreground)",
                                backgroundColor: "#FAF8F5",
                                border: "1px solid #EBE5DA",
                                padding: "5px 12px",
                                borderRadius: "50px",
                                textDecoration: "none"
                              }}
                            >
                              {it.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              <Link
                to="/collections"
                onClick={() => setMobile(false)}
                style={{
                  fontSize: "1.02rem",
                  fontWeight: 600,
                  color: location.pathname === "/collections" ? "var(--primary)" : "var(--foreground)",
                  padding: "8px 0",
                  borderBottom: "1px solid #f2eee6"
                }}
              >
                All Collections
              </Link>
              <Link
                to="/about"
                onClick={() => setMobile(false)}
                style={{
                  fontSize: "1.02rem",
                  fontWeight: 600,
                  color: location.pathname === "/about" ? "var(--primary)" : "var(--foreground)",
                  padding: "8px 0",
                  borderBottom: "1px solid #f2eee6"
                }}
              >
                About Gemora
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobile(false)}
                style={{
                  fontSize: "1.02rem",
                  fontWeight: 600,
                  color: location.pathname === "/contact" ? "var(--primary)" : "var(--foreground)",
                  padding: "8px 0",
                  borderBottom: "1px solid #f2eee6"
                }}
              >
                Contact &amp; Concierge
              </Link>
            </nav>

            {/* Mobile Footer Area: Account and Sign out */}
            <div style={{ marginTop: "auto", borderTop: "1px solid #f0ede6", paddingTop: "18px" }}>
              {user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "var(--primary)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        fontSize: "0.9rem"
                      }}
                    >
                      {user.fullname ? user.fullname[0] : "C"}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--foreground)" }}>{user.fullname}</div>
                      <div style={{ fontSize: "0.76rem", color: "var(--muted-foreground)" }}>{user.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobile(false)}
                    style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--foreground)", marginTop: "4px" }}
                  >
                    My Account &amp; Settings
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobile(false)}
                    style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--foreground)" }}
                  >
                    My Orders &amp; Tracking
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobile(false);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "var(--destructive)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      marginTop: "4px"
                    }}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/profile"
                  onClick={() => setMobile(false)}
                  className="eyebrow"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "13px",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    borderRadius: "6px",
                    letterSpacing: "0.14em"
                  }}
                >
                  <User size={16} />
                  Sign In to Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {search && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(22, 30, 18, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            padding: "clamp(24px, 5vw, 60px) 16px",
            overflowY: "auto",
            animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          onClick={() => setSearch(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              maxWidth: "680px",
              width: "100%",
              padding: "clamp(20px, 4vw, 36px)",
              borderRadius: "8px",
              alignSelf: "flex-start",
              boxShadow: "var(--shadow-luxury)",
              border: "1px solid #e8e2d5"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span className="eyebrow" style={{ color: "var(--primary)" }}>
                {generalSettings?.softwarename ? `Search ${generalSettings.softwarename}` : "Search Gemora Diam"}
              </span>
              <button
                onClick={() => setSearch(false)}
                aria-label="Close search"
                style={{ color: "var(--foreground)", padding: "4px", cursor: "pointer" }}
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search rings, bracelets, solitaires..."
                style={{
                  width: "100%",
                  borderBottom: "2px solid var(--primary)",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  background: "transparent",
                  paddingBottom: "10px",
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
                  color: "var(--foreground)",
                  outline: "none"
                }}
              />
            </form>

            <p className="eyebrow" style={{ marginTop: "20px", color: "var(--muted-foreground)" }}>
              {q ? `${results.length} matching pieces` : "Popular Creations"}
            </p>

            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {results.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSearch(false);
                    navigate(`/product/${p._id || p.id}`);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "48px", height: "48px", objectFit: "fill", borderRadius: "4px", backgroundColor: "#f6f6f6" }}
                  />
                  <div>
                    <h4 style={{ fontSize: "0.92rem", margin: 0, fontWeight: 500, fontFamily: "var(--font-serif)" }}>{p.name}</h4>
                    <span style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 600 }}>{format(p.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartCount, subtotal, format } = useStore();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "rgba(18, 26, 15, 0.62)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "opacity 0.25s ease"
      }}
      onClick={() => setCartOpen(false)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          maxWidth: "min(460px, 100vw)",
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "-8px 0 36px rgba(0, 0, 0, 0.16)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid #EDE8DE",
            backgroundColor: "#FAF9F6"
          }}
        >
          <div>
            <span
              className="eyebrow"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                color: "var(--primary)",
                fontWeight: 700,
                display: "block",
                marginBottom: "3px"
              }}
            >
              SHOPPING BAG
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3
                style={{
                  fontSize: "1.35rem",
                  margin: 0,
                  fontFamily: "var(--font-serif)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--foreground)"
                }}
              >
                Shopping Bag
              </h3>
              <span
                style={{
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  padding: "3px 9px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(85, 104, 50, 0.1)",
                  color: "var(--primary)",
                  letterSpacing: "0.02em"
                }}
              >
                {cartCount} {cartCount === 1 ? "creation" : "creations"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close shopping bag"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #EDE8DE",
              backgroundColor: "#ffffff",
              color: "var(--foreground)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F4F1EA";
              e.currentTarget.style.borderColor = "#D8D1C5";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#EDE8DE";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Complimentary Delivery Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 24px",
            backgroundColor: "rgba(85, 104, 50, 0.06)",
            borderBottom: "1px solid rgba(85, 104, 50, 0.12)",
            fontSize: "0.76rem",
            color: "#38471e",
            letterSpacing: "0.01em"
          }}
        >
          <Truck size={15} style={{ flexShrink: 0, color: "var(--primary)" }} />
          <span>
            <strong>Complimentary Insured Shipping</strong> &amp; Signature Gift Box
          </span>
        </div>

        {/* Drawer Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "4px 24px 20px",
            scrollbarWidth: "thin",
            scrollbarColor: "#D8D1C5 transparent"
          }}
        >
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 20px 40px", color: "var(--muted-foreground)" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(85, 104, 50, 0.08)",
                  border: "1px solid rgba(85, 104, 50, 0.15)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 20px",
                  color: "var(--primary)"
                }}
              >
                <ShoppingBag size={32} strokeWidth={1.4} />
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.35rem",
                  color: "var(--foreground)",
                  margin: "0 0 8px",
                  fontWeight: 600
                }}
              >
                Your Bag is Empty
              </h4>
              <p
                style={{
                  fontSize: "0.85rem",
                  maxWidth: "280px",
                  marginInline: "auto",
                  lineHeight: 1.6,
                  color: "var(--muted-foreground)"
                }}
              >
                Explore our fine jewelry collection to select your handcrafted bespoke pieces.
              </p>
              <Link
                to="/collections"
                onClick={() => setCartOpen(false)}
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "24px",
                  padding: "13px 28px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  letterSpacing: "0.14em",
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 14px rgba(85, 104, 50, 0.2)"
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
                <span>Discover Collections</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <CartLines compact={true} onProductClick={() => setCartOpen(false)} />
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #EDE8DE",
              padding: "18px 24px 22px",
              backgroundColor: "#FAF9F6",
              boxShadow: "0 -8px 24px rgba(0, 0, 0, 0.03)"
            }}
          >
            {/* Price rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline"
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--foreground)"
                  }}
                >
                  Estimated Subtotal
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--primary)",
                    fontSize: "1.3rem",
                    fontFamily: "var(--font-serif)"
                  }}
                >
                  {format(subtotal)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.78rem",
                  color: "var(--muted-foreground)"
                }}
              >
                <span>Insured Armoured Transit</span>
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>COMPLIMENTARY</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                setCartOpen(false);
                navigate("/cart");
              }}
              className="eyebrow"
              style={{
                width: "100%",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                padding: "15px 20px",
                borderRadius: "8px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                letterSpacing: "0.14em",
                fontSize: "0.78rem",
                fontWeight: 600,
                boxShadow: "0 6px 20px rgba(85, 104, 50, 0.28)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(85, 104, 50, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(85, 104, 50, 0.28)";
              }}
            >
              <span>View Bag &amp; Checkout</span>
              <ArrowRight size={15} />
            </button>

            {/* Luxury Trust Indicators */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
                marginTop: "14px",
                paddingTop: "12px",
                borderTop: "1px dashed #E5DFD3",
                fontSize: "0.7rem",
                color: "var(--muted-foreground)"
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Lock size={12} strokeWidth={2} style={{ color: "var(--primary)" }} />
                <span>256-Bit SSL</span>
              </span>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <ShieldCheck size={12} strokeWidth={2} style={{ color: "var(--primary)" }} />
                <span>Certified Genuine</span>
              </span>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Sparkles size={12} strokeWidth={2} style={{ color: "var(--primary)" }} />
                <span>30-Day Returns</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Footer } from "./Footer";