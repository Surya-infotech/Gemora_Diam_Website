import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  RotateCcw,
  Headphones,
  ArrowRight
} from "lucide-react";
import { useStore } from "../lib/store";
import { CURRENCIES } from "../lib/products";
import { CartLines } from "./CartLines";

import visaSvg from "../assets/vemus/payment_visa.svg";
import masterSvg from "../assets/vemus/payment_master.svg";
import applePaySvg from "../assets/vemus/payment_apple-pay.svg";
import amexSvg from "../assets/vemus/payment_am-ex.svg";
import discoverSvg from "../assets/vemus/payment_discover.svg";

export function Logo() {
  const { generalSettings } = useStore();
  const brandName = generalSettings?.softwarename;
  return (
    <Link to="/" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", textDecoration: "none" }}>
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2.3rem",
          fontWeight: 600,
          fontStyle: "italic",
          letterSpacing: "0.03em",
          color: "var(--foreground)",
          lineHeight: 1
        }}
      >
        {brandName}
      </span>
      <span
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "var(--primary)",
          fontWeight: 600,
          marginTop: "2px"
        }}
      >
        Fine Jewelry
      </span>
    </Link>
  );
}

function Badge({ n }) {
  if (!n) return null;
  return (
    <span
      style={{
        position: "absolute",
        top: "-7px",
        right: "-8px",
        backgroundColor: "var(--primary)",
        color: "#ffffff",
        fontSize: "0.62rem",
        fontWeight: 700,
        height: "17px",
        minWidth: "17px",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        padding: "0 3px",
        border: "1.5px solid #ffffff"
      }}
    >
      {n}
    </span>
  );
}

export function Header() {
  const { cartCount, wishlist, currency, setCurrency, setCartOpen, generalSettings, products: dynamicProducts, format } = useStore();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Top countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ d: 11, h: 11, m: 54, s: 52 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        if (prev.d > 0) return { ...prev, d: prev.d - 1, h: 23, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const searchPool = dynamicProducts || [];

  const results = q
    ? searchPool.filter((p) => (p.name + " " + (p.category || "")).toLowerCase().includes(q.toLowerCase()))
    : searchPool.slice(0, 4);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      setSearch(false);
      navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <>
      {/* 1. Black Top Announcement Bar Marquee */}
      <div
        style={{
          backgroundColor: "#181818",
          color: "#ffffff",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontSize: "0.72rem",
          letterSpacing: "0.15em",
          padding: "8px 0",
          textTransform: "uppercase",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <div className="animate-marquee" style={{ display: "inline-flex", gap: "60px" }}>
          <span>FREE SHIPPING ON ALL ORDERS OVER $200</span>
          <span>&mdash;</span>
          <span>VIP MEMBERS GET EXTRA DISCOUNTS &ndash; <Link to="/contact" style={{ textDecoration: "underline", color: "var(--primary)" }}>JOIN TODAY!</Link></span>
          <span>&mdash;</span>
          <span>HASSLE-FREE RETURNS ON ALL ORDERS</span>
          <span>&mdash;</span>
          <span>FREE SHIPPING ON ALL ORDERS OVER $200</span>
          <span>&mdash;</span>
          <span>VIP MEMBERS GET EXTRA DISCOUNTS &ndash; <Link to="/contact" style={{ textDecoration: "underline", color: "var(--primary)" }}>JOIN TODAY!</Link></span>
          <span>&mdash;</span>
          <span>HASSLE-FREE RETURNS ON ALL ORDERS</span>
          <span>&mdash;</span>
        </div>
      </div>

      {/* 2. Secondary Gold Header Bar */}
      <div
        style={{
          backgroundColor: "var(--gold-bar)",
          color: "#ffffff",
          fontSize: "0.76rem",
          fontWeight: 500,
          padding: "8px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        {/* Left: Phone & Store */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {generalSettings?.phone && (
            <>
              <a
                href={`tel:${generalSettings.phone.replace(/\s+/g, '')}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#ffffff" }}
              >
                <Phone size={13} />
                <span>{generalSettings.phone}</span>
              </a>
              <span style={{ opacity: 0.5 }}>|</span>
            </>
          )}
          <Link
            to="/contact"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#ffffff" }}
          >
            <MapPin size={13} />
            <span>Our Store</span>
          </Link>
        </div>

        {/* Center: Countdown Sale */}
        <div style={{ textAlign: "center", letterSpacing: "0.02em" }}>
          Get 30% off and FREE SHIPPING. Sale ends in{" "}
          <strong style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
            {timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s
          </strong>{" "}
          -{" "}
          <Link to="/shop" style={{ textDecoration: "underline", fontWeight: 600, color: "#ffffff" }}>
            SHOP NOW
          </Link>
        </div>

        {/* Right: Currency & Language */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "0.76rem",
                fontWeight: 500,
                outline: "none",
                cursor: "pointer"
              }}
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} style={{ color: "#181818" }}>
                  United States {c} (${CURRENCIES[c].symbol})
                </option>
              ))}
            </select>
          </div>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}>
            EN <ChevronDown size={12} />
          </span>
        </div>
      </div>

      {/* 3. Main Navigation Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #ebebeb",
          boxShadow: "0 2px 12px rgba(0,0,0,0.03)"
        }}
      >
        <div
          className="container-luxury"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            height: "82px",
            gap: "20px"
          }}
        >
          {/* Left: Desktop Nav / Mobile Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              aria-label="Menu"
              onClick={() => setMobile(true)}
              style={{ display: "flex", alignItems: "center", color: "#181818" }}
              className="mobile-only-btn"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            <nav
              style={{ display: "flex", gap: "26px", alignItems: "center" }}
              className="desktop-only-nav"
            >
              <Link
                to="/"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: location.pathname === "/" ? "var(--primary)" : "#181818",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s"
                }}
              >
                HOME <ChevronDown size={12} />
              </Link>

              <Link
                to="/shop"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: location.pathname === "/shop" ? "var(--primary)" : "#181818",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s"
                }}
              >
                SHOP <ChevronDown size={12} />
              </Link>

              <Link
                to="/shop?category=Rings"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#181818",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s"
                }}
              >
                PRODUCTS <ChevronDown size={12} />
              </Link>

              <Link
                to="/about"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: location.pathname === "/about" ? "var(--primary)" : "#181818",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s"
                }}
              >
                PAGES <ChevronDown size={12} />
              </Link>

              <Link
                to="/contact"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: location.pathname === "/contact" ? "var(--primary)" : "#181818",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s"
                }}
              >
                BLOGS <ChevronDown size={12} />
              </Link>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div style={{ textAlign: "center" }}>
            <Logo />
          </div>

          {/* Right: Search Pill & User/Wishlist/Cart Icons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "18px" }}>
            {/* Pill Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                maxWidth: "240px",
                width: "100%"
              }}
              className="desktop-only-nav"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for anything..."
                style={{
                  width: "100%",
                  padding: "9px 18px 9px 38px",
                  borderRadius: "50px",
                  border: "1px solid #dcdcdc",
                  fontSize: "0.82rem",
                  outline: "none",
                  backgroundColor: "#fafafa",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "#dcdcdc")}
              />
              <Search
                size={16}
                strokeWidth={1.5}
                style={{ position: "absolute", left: "14px", color: "#888888", pointerEvents: "none" }}
              />
            </form>

            {/* Mobile Search Icon Button */}
            <button
              aria-label="Search"
              onClick={() => setSearch(true)}
              style={{ color: "#181818" }}
              className="mobile-only-btn"
            >
              <Search size={22} strokeWidth={1.4} />
            </button>

            {/* Account Icon */}
            <Link
              to="/profile"
              aria-label="Account"
              style={{ color: "#181818", display: "inline-flex", alignItems: "center" }}
              className="desktop-only-nav"
            >
              <User size={22} strokeWidth={1.4} />
            </Link>

            {/* Wishlist Icon with Badge */}
            <Link
              to="/profile?tab=wishlist"
              aria-label="Wishlist"
              style={{ position: "relative", color: "#181818", display: "inline-flex", alignItems: "center" }}
            >
              <Heart size={22} strokeWidth={1.4} />
              <Badge n={wishlist.length} />
            </Link>

            {/* Cart Bag Icon with Badge */}
            <button
              aria-label="Shopping Bag"
              onClick={() => setCartOpen(true)}
              style={{ position: "relative", color: "#181818", display: "inline-flex", alignItems: "center" }}
            >
              <ShoppingBag size={22} strokeWidth={1.4} />
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
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setMobile(false)}
        >
          <div
            style={{
              width: "82%",
              maxWidth: "340px",
              height: "100%",
              backgroundColor: "#ffffff",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              animation: "slideInLeft 0.25s ease-out"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Logo />
              <button onClick={() => setMobile(false)} style={{ color: "#181818" }}>
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "16px" }}>
              <Link
                to="/"
                onClick={() => setMobile(false)}
                style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobile(false)}
                style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}
              >
                Shop All
              </Link>
              <Link
                to="/shop?category=Rings"
                onClick={() => setMobile(false)}
                style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}
              >
                Rings &amp; Diamonds
              </Link>
              <Link
                to="/shop?category=Necklaces"
                onClick={() => setMobile(false)}
                style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}
              >
                Necklaces &amp; Charms
              </Link>
              <Link
                to="/about"
                onClick={() => setMobile(false)}
                style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobile(false)}
                style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}
              >
                Contact &amp; Stores
              </Link>
            </nav>

            <div style={{ marginTop: "auto", borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <label style={{ fontSize: "0.75rem", color: "#888", display: "block", marginBottom: "6px" }}>
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #ddd", background: "transparent" }}
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            padding: "80px 20px 20px 20px",
            animation: "fadeIn 0.2s ease-out"
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
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span className="eyebrow" style={{ color: "var(--primary)" }}>
                {generalSettings?.softwarename ? `Search ${generalSettings.softwarename} Jewelry` : "Search Jewelry"}
              </span>
              <button onClick={() => setSearch(false)}>
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search rings, necklaces, solitaires..."
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
                  outline: "none"
                }}
              />
            </form>

            <p className="eyebrow" style={{ marginTop: "24px", color: "#888" }}>
              {q ? `${results.length} matching pieces` : "Popular Creations"}
            </p>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {results.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSearch(false);
                    navigate(`/shop?item=${p.id}`);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "8px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <img src={p.image} alt={p.name} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "2px" }} />
                  <div>
                    <h4 style={{ fontSize: "0.95rem", margin: 0, fontWeight: 500 }}>{p.name}</h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600 }}>{format(p.price)}</span>
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
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)"
      }}
      onClick={() => setCartOpen(false)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s ease-out",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.15)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 28px",
            borderBottom: "1px solid #eee"
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.3rem", margin: 0, fontFamily: "var(--font-serif)" }}>Shopping Bag</h3>
            <span style={{ fontSize: "0.75rem", color: "#888" }}>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ color: "#181818" }}>
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
              <ShoppingBag size={48} strokeWidth={1} style={{ margin: "0 auto 16px auto", opacity: 0.4 }} />
              <p style={{ fontSize: "1rem", fontWeight: 500, color: "#333" }}>Your bag is empty</p>
              <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>Explore our fine jewelry collection to add pieces.</p>
              <Link
                to="/shop"
                onClick={() => setCartOpen(false)}
                className="eyebrow"
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  padding: "12px 28px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "2px"
                }}
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
          <div style={{ borderTop: "1px solid #eee", padding: "24px 28px", backgroundColor: "#fafafa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem" }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{format(subtotal)}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#777", marginTop: "6px" }}>
              Complimentary insured worldwide shipping &amp; 30-day returns.
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
                textAlign: "center"
              }}
            >
              View Bag &amp; Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { notify, generalSettings, socialMedia, categories, subscribeNewsletter } = useStore();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    setSubscribing(true);
    const res = await subscribeNewsletter(email);
    setSubscribing(false);
    if (res.ok) {
      notify(generalSettings?.softwarename ? `Thank you for joining the ${generalSettings.softwarename} Circle!` : "Thank you for subscribing!", "Enjoy 15% off your first purchase.");
      setEmail("");
    } else {
      notify("Subscription status", res.message || "Email submitted.");
      setEmail("");
    }
  };

  const navCategories = categories && categories.length > 0
    ? categories.map((c) => ({
        label: c.categoryname.toUpperCase(),
        to: `/shop?category=${encodeURIComponent(c.categoryname)}`
      }))
    : [
        { label: "NEW COLLECTION", to: "/shop" },
        { label: "ALL JEWELRY", to: "/shop" },
        { label: "CHARMS", to: "/shop?category=Charms" },
        { label: "BRACELETS", to: "/shop?category=Bracelets" },
        { label: "RINGS", to: "/shop?category=Rings" },
        { label: "EARRINGS", to: "/shop?category=Earrings" },
        { label: "GIFTS", to: "/shop" },
        { label: "COLLECTIONS", to: "/shop" }
      ];

  return (
    <footer style={{ backgroundColor: "#ffffff", color: "#181818" }}>
      {/* 1. Value Badges Bar (#F5F2E9 Cream Background) */}
      <div style={{ backgroundColor: "#F5F2E9", borderTop: "1px solid #eae5d8", padding: "36px 0" }}>
        <div
          className="container-luxury"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "28px",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid var(--primary)", display: "grid", placeItems: "center", color: "var(--primary)", flexShrink: 0 }}>
              <Truck size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>Free Shipping</h4>
              <p style={{ fontSize: "0.78rem", color: "#666", margin: "2px 0 0 0" }}>Enjoy free shipping on all orders</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid var(--primary)", display: "grid", placeItems: "center", color: "var(--primary)", flexShrink: 0 }}>
              <CreditCard size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>Flexible Payment</h4>
              <p style={{ fontSize: "0.78rem", color: "#666", margin: "2px 0 0 0" }}>Pay with Multiple Credit Cards</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid var(--primary)", display: "grid", placeItems: "center", color: "var(--primary)", flexShrink: 0 }}>
              <RotateCcw size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>14 - Days Return</h4>
              <p style={{ fontSize: "0.78rem", color: "#666", margin: "2px 0 0 0" }}>Free return/exchange within 30 days</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid var(--primary)", display: "grid", placeItems: "center", color: "var(--primary)", flexShrink: 0 }}>
              <Headphones size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>Premium Support</h4>
              <p style={{ fontSize: "0.78rem", color: "#666", margin: "2px 0 0 0" }}>Enjoy our premium support</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Navigation Links Strip */}
      <div style={{ borderBottom: "1px solid #eee", padding: "22px 0", backgroundColor: "#ffffff" }}>
        <div
          className="container-luxury"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "center"
          }}
        >
          {navCategories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: "#222222",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.target.style.color = "#222222")}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Main Footer 4 Columns */}
      <div
        className="container-luxury"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "48px",
          paddingTop: "70px",
          paddingBottom: "60px"
        }}
      >
        {/* Col 1: Join the Tribe */}
        <div>
          {generalSettings?.softwarename && (
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)" }}>
              JOIN THE #{generalSettings.softwarename.replace(/\s+/g, '').toUpperCase()} TRIBE
            </span>
          )}
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginTop: "12px", marginBottom: "8px" }}>
            Shiny Things Await - 10% Off Inside!
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.6 }}>
            Get early access to new products, exclusive deals &amp; more.
          </p>

          <form onSubmit={handleSubscribe} style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", borderBottom: "1.5px solid #181818", paddingBottom: "8px" }}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "0.85rem",
                  background: "transparent"
                }}
              />
              <button type="submit" aria-label="Subscribe" style={{ color: "var(--primary)" }}>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Socials */}
          {socialMedia && socialMedia.length > 0 && (
            <div style={{ display: "flex", gap: "14px", marginTop: "24px", flexWrap: "wrap" }}>
              {socialMedia.map((net, idx) => (
                <a
                  key={net._id || idx}
                  href={net.url}
                  target="_blank"
                  rel="noreferrer"
                  title={net.platform}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid #ddd",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "#555",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#ddd";
                    e.currentTarget.style.color = "#555";
                  }}
                >
                  {net.platform ? net.platform[0].toUpperCase() : "✦"}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Col 2: Find Us */}
        <div>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", marginBottom: "20px" }}>
            FIND US
          </h4>
          {generalSettings?.address && (
            <>
              <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "14px", lineHeight: 1.6 }}>
                <span>
                  {generalSettings.address}, {generalSettings.cityname}
                  <br />
                  {generalSettings.statename}, {generalSettings.countryname}{generalSettings.postalcode ? ` - ${generalSettings.postalcode}` : ""}
                </span>
              </p>
              <p style={{ fontSize: "0.85rem", marginBottom: "10px" }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    [generalSettings.address, generalSettings.cityname, generalSettings.statename, generalSettings.countryname].filter(Boolean).join(", ")
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "underline", color: "#181818", fontWeight: 500 }}
                >
                  See Our Stores
                </a>
              </p>
            </>
          )}
          {generalSettings?.phone && (
            <p style={{ fontSize: "0.85rem", marginBottom: "8px" }}>
              <a
                href={`tel:${generalSettings.phone.replace(/\s+/g, "")}`}
                style={{ color: "#666", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                {generalSettings.phone}
              </a>
            </p>
          )}
          {generalSettings?.email && (
            <p style={{ fontSize: "0.85rem" }}>
              <a
                href={`mailto:${generalSettings.email}`}
                style={{ color: "#666", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                {generalSettings.email}
              </a>
            </p>
          )}
        </div>

        {/* Col 3: Help */}
        <div>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", marginBottom: "20px" }}>
            HELP
          </h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              ["Shipping", "/terms"],
              ["Returns", "/returns"],
              ["Privacy Policy", "/privacy-policy"],
              ["My Wishlist", "/profile?tab=wishlist"],
              ["Compare", "/shop"],
              ["FAQ's", "/faq"]
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} style={{ fontSize: "0.85rem", color: "#666", transition: "color 0.2s" }} onMouseEnter={(e) => (e.target.style.color = "var(--primary)")} onMouseLeave={(e) => (e.target.style.color = "#666")}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: About Us */}
        <div>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", marginBottom: "20px" }}>
            ABOUT US
          </h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              ["Our Story", "/about"],
              ["Visit Our Store", "/contact"],
              ["Contact Us", "/contact"],
              ["Account", "/profile"]
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} style={{ fontSize: "0.85rem", color: "#666", transition: "color 0.2s" }} onMouseEnter={(e) => (e.target.style.color = "var(--primary)")} onMouseLeave={(e) => (e.target.style.color = "#666")}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Bottom Bar: Copyright & Payment icons */}
      <div style={{ borderTop: "1px solid #ebebeb", padding: "20px 0" }}>
        <div
          className="container-luxury"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "0.8rem",
            color: "#777"
          }}
        >
          <p style={{ margin: 0 }}>
            {generalSettings?.copyright || `© ${new Date().getFullYear()} ${generalSettings?.softwarename || "Gemora Diam"}. All Rights Reserved.`}
          </p>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <img src={visaSvg} alt="Visa" style={{ height: "22px", objectFit: "contain" }} />
            <img src={masterSvg} alt="Mastercard" style={{ height: "22px", objectFit: "contain" }} />
            <img src={applePaySvg} alt="Apple Pay" style={{ height: "22px", objectFit: "contain" }} />
            <img src={amexSvg} alt="Amex" style={{ height: "22px", objectFit: "contain" }} />
            <img src={discoverSvg} alt="Discover" style={{ height: "22px", objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
