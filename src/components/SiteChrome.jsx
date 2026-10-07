import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ShieldCheck,
  Gem,
  Lock
} from "lucide-react";
import { useStore } from "../lib/store";
import { CURRENCIES, PRODUCTS } from "../lib/products";
import { CartLines } from "./CartLines";

const NAV = [
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/shop?category=Rings" },
  { label: "High Jewelry", to: "/shop?high=true" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];

export function Logo() {
  return (
    <Link to="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.9rem",
          letterSpacing: "0.32em",
          paddingLeft: "0.32em",
          color: "var(--foreground)",
          fontWeight: 500
        }}
      >
        GEMORA
      </span>
      <span className="eyebrow" style={{ fontSize: "0.55rem", color: "var(--gold-deep)", marginTop: "4px" }}>
        Haute Joaillerie
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
        top: "-6px",
        right: "-6px",
        backgroundColor: "var(--primary)",
        color: "#ffffff",
        fontSize: "0.6rem",
        fontWeight: 700,
        height: "16px",
        minWidth: "16px",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        padding: "0 2px"
      }}
    >
      {n}
    </span>
  );
}

export function Header() {
  const { cartCount, wishlist, currency, setCurrency, setCartOpen } = useStore();
  const [bar, setBar] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();

  const results = q
    ? PRODUCTS.filter((p) => (p.name + p.category).toLowerCase().includes(q.toLowerCase()))
    : PRODUCTS.slice(0, 4);

  return (
    <>
      {/* Announcement Bar */}
      {bar && (
        <div
          style={{
            position: "relative",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: "9px 40px",
            textAlign: "center",
            fontSize: "0.72rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 500
          }}
        >
          <span>✦ Complimentary insured worldwide delivery &amp; GIA certification dossier</span>
          <button
            onClick={() => setBar(false)}
            aria-label="Dismiss bar"
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.7)"
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "var(--background)",
          borderBottom: "1px solid var(--border)",
          transition: "all 0.3s ease"
        }}
      >
        <div
          className="container-luxury"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            height: "84px"
          }}
        >
          {/* Left: Desktop Nav / Mobile Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button
              aria-label="Menu"
              onClick={() => setMobile(true)}
              style={{ display: "flex", alignItems: "center" }}
              className="mobile-only-btn"
            >
              <Menu size={22} strokeWidth={1.4} />
            </button>

            <nav style={{ display: "flex", gap: "28px" }} className="desktop-only-nav">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  className="eyebrow"
                  style={{
                    color: location.pathname === n.to.split("?")[0] ? "var(--primary)" : "var(--foreground)",
                    transition: "color 0.2s ease"
                  }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <Logo />

          {/* Right: Currency & Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "18px" }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
                color: "var(--foreground)"
              }}
              className="desktop-only-nav"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button aria-label="Search" onClick={() => setSearch(true)}>
              <Search size={19} strokeWidth={1.4} />
            </button>

            <Link to="/profile?tab=wishlist" aria-label="Wishlist" style={{ position: "relative" }} className="desktop-only-nav">
              <Heart size={19} strokeWidth={1.4} />
              <Badge n={wishlist.length} />
            </Link>

            <Link to="/profile?tab=overview" aria-label="Account" className="desktop-only-nav">
              <User size={19} strokeWidth={1.4} />
            </Link>

            <button aria-label="Bag" onClick={() => setCartOpen(true)} style={{ position: "relative" }}>
              <ShoppingBag size={19} strokeWidth={1.4} />
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
            backgroundColor: "rgba(24, 31, 19, 0.6)",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setMobile(false)}
        >
          <div
            style={{
              width: "80%",
              maxWidth: "340px",
              height: "100%",
              backgroundColor: "var(--background)",
              padding: "36px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              animation: "slideInLeft 0.25s ease-out"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="font-serif" style={{ fontSize: "1.6rem" }}>Menu</span>
              <button onClick={() => setMobile(false)}>
                <X size={22} strokeWidth={1.4} />
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  onClick={() => setMobile(false)}
                  className="font-serif"
                  style={{ fontSize: "1.45rem", color: "var(--foreground)" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/orders"
                onClick={() => setMobile(false)}
                className="font-serif"
                style={{ fontSize: "1.45rem", color: "var(--foreground)" }}
              >
                Orders &amp; Tracking
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobile(false)}
                className="font-serif"
                style={{ fontSize: "1.45rem", color: "var(--foreground)" }}
              >
                My Account
              </Link>
            </nav>

            <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", background: "transparent" }}
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
            backgroundColor: "rgba(24, 31, 19, 0.75)",
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
              backgroundColor: "var(--background)",
              maxWidth: "680px",
              width: "100%",
              padding: "36px",
              borderRadius: "2px",
              alignSelf: "flex-start",
              boxShadow: "var(--shadow-soft)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span className="eyebrow" style={{ color: "var(--gold-deep)" }}>Maison Vault Search</span>
              <button onClick={() => setSearch(false)}>
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>

            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search rings, necklaces, solitaires..."
              style={{
                width: "100%",
                borderBottom: "1.5px solid var(--primary)",
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

            <p className="eyebrow" style={{ marginTop: "24px", color: "var(--muted-foreground)" }}>
              {q ? `${results.length} matching pieces` : "Popular Creations"}
            </p>

            <ul style={{ listStyle: "none", padding: 0, marginTop: "12px", maxHeight: "320px", overflowY: "auto" }}>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/shop?category=${p.category}`}
                    onClick={() => setSearch(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "12px 8px",
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.15s ease"
                    }}
                  >
                    <img src={p.image} alt={p.name} style={{ width: "56px", height: "56px", objectFit: "cover" }} />
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem" }}>{p.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                      {p.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, subtotal, format } = useStore();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(24, 31, 19, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end"
      }}
      onClick={() => setCartOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          backgroundColor: "var(--background)",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.25s ease-out",
          boxShadow: "var(--shadow-soft)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "28px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h3 className="font-serif" style={{ fontSize: "1.85rem", margin: 0 }}>Your Bag</h3>
          <button onClick={() => setCartOpen(false)}>
            <X size={20} strokeWidth={1.4} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 28px" }}>
          {cart.length ? (
            <CartLines compact />
          ) : (
            <div style={{ padding: "80px 20px", textAlign: "center" }}>
              <p className="font-serif" style={{ fontSize: "1.5rem" }}>Your bag is empty</p>
              <Link
                to="/shop"
                onClick={() => setCartOpen(false)}
                className="eyebrow"
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  borderBottom: "1px solid var(--foreground)",
                  paddingBottom: "4px"
                }}
              >
                Discover the collection
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: "1px solid var(--border)", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem" }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{format(subtotal)}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "6px" }}>
              Complimentary insured shipping &amp; GIA documentation.
            </p>
            <button
              onClick={() => {
                setCartOpen(false);
                navigate("/cart");
              }}
              className="eyebrow"
              style={{
                width: "100%",
                marginTop: "20px",
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                padding: "16px",
                borderRadius: "2px"
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
  const { notify } = useStore();

  const cols = [
    { title: "Shop", links: [["Rings", "/shop?category=Rings"], ["Necklaces", "/shop?category=Necklaces"], ["High Jewelry", "/shop?high=true"], ["Bespoke", "/contact"]] },
    { title: "Customer Service", links: [["Contact", "/contact"], ["My Orders", "/orders"], ["My Account", "/profile"], ["Book an Appointment", "/contact"]] },
    { title: "Legal", links: [["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms"], ["About Gemora", "/about"]] }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    notify("Welcome to Gemora Diam", "Your 10% collector code: GEMORA10");
    setEmail("");
  };

  return (
    <footer style={{ marginTop: "120px", backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
      <div
        className="container-luxury"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "48px",
          paddingTop: "80px",
          paddingBottom: "80px"
        }}
      >
        {/* Col 1: Maison Bio */}
        <div style={{ gridColumn: "span 2" }}>
          <p className="font-serif" style={{ fontSize: "2.4rem", letterSpacing: "0.3em", margin: 0, color: "#ffffff" }}>
            GEMORA
          </p>
          <p style={{ marginTop: "18px", maxWidth: "380px", fontSize: "0.88rem", lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>
            Since 1987, Gemora Diam has crafted heirloom jewelry in our atelier — ethically sourced, meticulously finished, and made to be passed down across generations.
          </p>

          <form onSubmit={handleSubscribe} style={{ marginTop: "32px" }}>
            <p className="eyebrow" style={{ color: "var(--gold)" }}>
              Receive 10% off your first order
            </p>
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.3)", marginTop: "12px", maxWidth: "360px" }}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  padding: "10px 0",
                  fontSize: "0.85rem",
                  color: "#ffffff",
                  outline: "none"
                }}
              />
              <button type="submit" className="eyebrow" style={{ color: "#ffffff" }}>
                Subscribe
              </button>
            </div>
          </form>
        </div>

        {/* Links Columns */}
        {cols.map((c) => (
          <div key={c.title}>
            <p className="eyebrow" style={{ color: "var(--gold)", marginBottom: "20px" }}>
              {c.title}
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {c.links.map(([l, to]) => (
                <li key={l}>
                  <Link to={to} style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", transition: "color 0.15s ease" }}>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Social */}
        <div>
          <p className="eyebrow" style={{ color: "var(--gold)", marginBottom: "20px" }}>Follow</p>
          <div style={{ display: "flex", gap: "16px", color: "rgba(255,255,255,0.8)" }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: "inherit", transition: "color 0.2s" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: "inherit", transition: "color 0.2s" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" style={{ color: "inherit", transition: "color 0.2s" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "24px 0" }}>
        <div
          className="container-luxury"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.6)"
          }}
        >
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={16} color="var(--gold)" /> BIS Hallmarked
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Gem size={16} color="var(--gold)" /> Conflict-Free Diamonds
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={16} color="var(--gold)" /> 256-bit Secure Checkout
            </span>
          </div>
          <p>© {new Date().getFullYear()} Gemora Diam Haute Joaillerie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
