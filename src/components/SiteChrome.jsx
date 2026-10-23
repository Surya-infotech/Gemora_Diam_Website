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
  MapPin,
  ArrowRight,
  LogOut
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
        gap: "10px",
        textDecoration: "none",
        transition: "opacity 0.2s",
        flexShrink: 0
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {/* Exquisite Diamond Atelier Crest */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 36 36"
        fill="none"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <path
          d="M18 2.5L32 9.5V18.5C32 26 25.5 32 18 34C10.5 32 4 26 4 18.5V9.5L18 2.5Z"
          stroke="url(#gemoraCrestGrad)"
          strokeWidth="1.2"
          fill="rgba(85, 104, 50, 0.05)"
        />
        <path
          d="M18 8L26 14L18 28.5L10 14L18 8Z"
          stroke="var(--primary)"
          strokeWidth="1.1"
        />
        <path
          d="M10 14H26M18 8V28.5M14 14L18 28.5L22 14"
          stroke="#b38728"
          strokeWidth="0.8"
          strokeOpacity="0.85"
        />
        <defs>
          <linearGradient id="gemoraCrestGrad" x1="4" y1="2.5" x2="32" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d4af37" />
            <stop offset="0.5" stopColor="#556832" />
            <stop offset="1" stopColor="#b38728" />
          </linearGradient>
        </defs>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.15rem, 1.6vw, 1.45rem)",
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
            fontSize: "0.50rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--primary)",
            fontWeight: 600,
            marginTop: "3px",
            whiteSpace: "nowrap"
          }}
        >
          Fine Jewelry • Atelier
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
  const { cartCount, wishlist, setCartOpen, generalSettings, products: dynamicProducts, format, user, logout } = useStore();
  const [mobile, setMobile] = useState(false);
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
          fontSize: "clamp(0.68rem, 1.8vw, 0.74rem)",
          fontWeight: 500,
          padding: "7px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          position: "relative",
          zIndex: 101
        }}
      >
        <div
          className="container-luxury"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingLeft: 0,
            paddingRight: 0,
            gap: "12px"
          }}
        >
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              flex: 1,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            <span>Complimentary Insured Delivery</span>
            <span style={{ color: "var(--gold-light)", opacity: 0.9 }}>•</span>
            <span>7-Day Bespoke Returns</span>
            <span style={{ color: "var(--gold-light)", opacity: 0.9 }}>•</span>
            <span>Lifetime Atelier Warranty</span>
            <span style={{ color: "var(--gold-light)", opacity: 0.9 }} className="tablet-up-nav">•</span>
            <span className="tablet-up-nav">100% Certified Lab Diamonds</span>
          </div>

          {/* Right: Book Appointment CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              to="/contact"
              style={{
                display: "inline-flex",
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
              <span>Book an Appointment</span>
              <ArrowRight size={11} />
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
                width: "clamp(190px, 16vw, 280px)"
              }}
              className="desktop-only-nav"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search fine jewelry, rings, bands..."
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
            backdropFilter: "blur(6px)"
          }}
          onClick={() => setMobile(false)}
        >
          <div
            style={{
              width: "84%",
              maxWidth: "360px",
              height: "100%",
              overflowY: "auto",
              backgroundColor: "#ffffff",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              animation: "slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "10px 0 35px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Logo />
              <button
                onClick={() => setMobile(false)}
                aria-label="Close menu"
                style={{ color: "var(--foreground)", padding: "4px" }}
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              <Link
                to="/"
                onClick={() => setMobile(false)}
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: location.pathname === "/" ? "var(--primary)" : "var(--foreground)",
                  padding: "4px 0"
                }}
              >
                Home
              </Link>

              {/* Engagement Rings */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Link
                  to="/collections?category=Engagement%20Rings"
                  onClick={() => setMobile(false)}
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>Engagement Rings</span>
                  <span style={{ fontSize: "0.6rem", backgroundColor: "var(--primary)", color: "#fff", padding: "1px 6px", borderRadius: "2px" }}>POPULAR</span>
                </Link>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingLeft: "8px", marginTop: "4px" }}>
                  {["Solitaire", "Halo", "Vintage Style Rings", "Three Stone", "Nature Inspired"].map((st) => (
                    <Link
                      key={st}
                      to={`/collections?style=${encodeURIComponent(st)}`}
                      onClick={() => setMobile(false)}
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--muted-foreground)",
                        backgroundColor: "#faf8f5",
                        border: "1px solid #ebe5da",
                        padding: "3px 10px",
                        borderRadius: "50px",
                        textDecoration: "none"
                      }}
                    >
                      {st}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Wedding & Bridal */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Link
                  to="/collections?category=Bridal%20Sets"
                  onClick={() => setMobile(false)}
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "var(--foreground)"
                  }}
                >
                  Wedding Rings &amp; Bridal Sets
                </Link>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingLeft: "8px", marginTop: "4px" }}>
                  {["Bridal Sets", "Eternity", "Classic", "Two Stone"].map((st) => (
                    <Link
                      key={st}
                      to={`/collections?category=Bridal%20Sets&style=${encodeURIComponent(st)}`}
                      onClick={() => setMobile(false)}
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--muted-foreground)",
                        backgroundColor: "#faf8f5",
                        border: "1px solid #ebe5da",
                        padding: "3px 10px",
                        borderRadius: "50px",
                        textDecoration: "none"
                      }}
                    >
                      {st}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Fine Jewelry */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Link
                  to="/collections"
                  onClick={() => setMobile(false)}
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "var(--foreground)"
                  }}
                >
                  Fine Jewelry
                </Link>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingLeft: "8px", marginTop: "4px" }}>
                  <Link
                    to="/collections?category=Bracelets"
                    onClick={() => setMobile(false)}
                    style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", backgroundColor: "#faf8f5", border: "1px solid #ebe5da", padding: "3px 10px", borderRadius: "50px", textDecoration: "none" }}
                  >
                    Bracelets
                  </Link>
                  <Link
                    to="/collections?category=Earrings"
                    onClick={() => setMobile(false)}
                    style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", backgroundColor: "#faf8f5", border: "1px solid #ebe5da", padding: "3px 10px", borderRadius: "50px", textDecoration: "none" }}
                  >
                    Earrings
                  </Link>
                  <Link
                    to="/collections?shape=Round"
                    onClick={() => setMobile(false)}
                    style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", backgroundColor: "#faf8f5", border: "1px solid #ebe5da", padding: "3px 10px", borderRadius: "50px", textDecoration: "none" }}
                  >
                    Round Cut
                  </Link>
                  <Link
                    to="/collections?shape=Emerald"
                    onClick={() => setMobile(false)}
                    style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", backgroundColor: "#faf8f5", border: "1px solid #ebe5da", padding: "3px 10px", borderRadius: "50px", textDecoration: "none" }}
                  >
                    Emerald Cut
                  </Link>
                </div>
              </div>

              <Link
                to="/collections"
                onClick={() => setMobile(false)}
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: (location.pathname === "/collections" || location.pathname === "/collections") ? "var(--primary)" : "var(--foreground)",
                  padding: "4px 0"
                }}
              >
                All Collections
              </Link>
              <Link
                to="/about"
                onClick={() => setMobile(false)}
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: location.pathname === "/about" ? "var(--primary)" : "var(--foreground)",
                  padding: "4px 0"
                }}
              >
                About Our Atelier
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobile(false)}
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: location.pathname === "/contact" ? "var(--primary)" : "var(--foreground)",
                  padding: "4px 0"
                }}
              >
                Contact &amp; Concierge
              </Link>
            </nav>

            <div style={{ marginTop: "auto", borderTop: "1px solid #eee", paddingTop: "20px" }}>
              {user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        backgroundColor: "var(--primary)",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        fontSize: "0.95rem"
                      }}
                    >
                      {user.fullname ? user.fullname[0] : "C"}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)" }}>{user.fullname}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>{user.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobile(false)}
                    style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)", marginTop: "4px" }}
                  >
                    My Account &amp; Settings
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobile(false)}
                    style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)" }}
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
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      marginTop: "6px"
                    }}
                  >
                    <LogOut size={16} />
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
                    padding: "14px",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    borderRadius: "2px",
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
            display: "flex",
            justifyContent: "center",
            padding: "80px 20px 20px 20px",
            animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          onClick={() => setSearch(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              maxWidth: "680px",
              width: "100%",
              padding: "36px",
              borderRadius: "4px",
              alignSelf: "flex-start",
              boxShadow: "var(--shadow-luxury)",
              border: "1px solid #e8e2d5"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span className="eyebrow" style={{ color: "var(--primary)" }}>
                {generalSettings?.softwarename ? `Search ${generalSettings.softwarename}` : "Search Gemora Diam"}
              </span>
              <button
                onClick={() => setSearch(false)}
                aria-label="Close search"
                style={{ color: "var(--foreground)", padding: "4px" }}
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
                  paddingBottom: "12px",
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.8rem",
                  color: "var(--foreground)",
                  outline: "none"
                }}
              />
            </form>

            <p className="eyebrow" style={{ marginTop: "24px", color: "var(--muted-foreground)" }}>
              {q ? `${results.length} matching pieces` : "Popular Creations"}
            </p>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
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
                    gap: "16px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderRadius: "3px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "2px", backgroundColor: "#f6f6f6" }}
                  />
                  <div>
                    <h4 style={{ fontSize: "0.95rem", margin: 0, fontWeight: 500, fontFamily: "var(--font-serif)" }}>{p.name}</h4>
                    <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>{format(p.price)}</span>
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
        zIndex: 9999,
        backgroundColor: "rgba(22, 30, 18, 0.65)",
        backdropFilter: "blur(6px)"
      }}
      onClick={() => setCartOpen(false)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          maxWidth: "480px",
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "var(--shadow-luxury)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 30px",
            borderBottom: "1px solid #ede8de",
            backgroundColor: "#faf9f6"
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.35rem", margin: 0, fontFamily: "var(--font-serif)", fontWeight: 500 }}>
              Shopping Bag
            </h3>
            <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
              {cartCount} {cartCount === 1 ? "creation" : "creations"} selected
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
            style={{
              color: "var(--foreground)",
              padding: "6px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 30px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--muted-foreground)" }}>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-soft)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 20px",
                  color: "var(--primary)"
                }}
              >
                <ShoppingBag size={34} strokeWidth={1.4} />
              </div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--foreground)" }}>
                Your Bag is Empty
              </p>
              <p style={{ fontSize: "0.88rem", marginTop: "8px", maxWidth: "280px", marginInline: "auto", lineHeight: 1.6 }}>
                Explore our fine jewelry collection to select your handcrafted bespoke pieces.
              </p>
              <Link
                to="/collections"
                onClick={() => setCartOpen(false)}
                className="eyebrow"
                style={{
                  display: "inline-block",
                  marginTop: "24px",
                  padding: "14px 32px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "2px",
                  letterSpacing: "0.16em",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
              >
                Discover Collection
              </Link>
            </div>
          ) : (
            <CartLines />
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #ede8de",
              padding: "24px 30px",
              backgroundColor: "#faf9f6"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "1.1rem" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 500 }}>Subtotal</span>
              <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.3rem" }}>
                {format(subtotal)}
              </span>
            </div>
            <p style={{ fontSize: "0.76rem", color: "var(--muted-foreground)", marginTop: "6px", lineHeight: 1.5 }}>
              Complimentary insured worldwide shipping • 30-day effortless returns.
            </p>
            <button
              onClick={() => {
                setCartOpen(false);
                navigate("/cart");
              }}
              className="eyebrow"
              style={{
                width: "100%",
                marginTop: "18px",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                padding: "16px",
                borderRadius: "2px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                letterSpacing: "0.18em",
                fontWeight: 600,
                boxShadow: "0 6px 20px rgba(85, 104, 50, 0.28)",
                cursor: "pointer",
                transition: "all 0.2s"
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
              <span>View Bag &amp; Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { Footer } from "./Footer";