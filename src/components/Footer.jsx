import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  CreditCard,
  RotateCcw,
  Headphones,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Sparkles
} from "lucide-react";
import { useStore } from "../lib/store";
import { slugifyPolicy } from "../lib/slugify";

import visaSvg from "../assets/vemus/payment_visa.svg";
import masterSvg from "../assets/vemus/payment_master.svg";
import amexSvg from "../assets/vemus/payment_am-ex.svg";

// High-end SVG Icons for Social Media Platforms
function SocialIcon({ platform }) {
  const p = (platform || "").toLowerCase();
  if (p.includes("insta")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (p.includes("face") || p.includes("fb")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (p.includes("twit") || p.includes("x")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (p.includes("pin")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.97-.11-2.47.02-3.53.12-.97.79-5.78.79-5.78s-.2-.4-.2-1c0-1.4.81-2.45 1.83-2.45.86 0 1.28.65 1.28 1.42 0 .87-.55 2.16-.84 3.36-.24 1 .5 1.82 1.48 1.82 1.78 0 3.15-1.88 3.15-4.58 0-2.4-1.72-4.07-4.18-4.07-2.85 0-4.52 2.14-4.52 4.35 0 .86.33 1.79.74 2.3.08.1.09.19.07.29-.08.32-.26 1.05-.29 1.2-.05.2-.17.25-.38.15-1.42-.66-2.3-2.73-2.3-4.4 0-3.58 2.6-6.87 7.5-6.87 3.94 0 7 2.8 7 6.55 0 3.91-2.46 7.06-5.88 7.06-1.15 0-2.23-.6-2.6-1.3l-.71 2.7c-.26 1-.95 2.25-1.42 3A12 12 0 1 0 12 0z" />
      </svg>
    );
  }
  if (p.includes("you")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
      </svg>
    );
  }
  if (p.includes("link")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  return <Sparkles size={16} strokeWidth={1.6} />;
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { notify, generalSettings, socialMedia, categories, subscribeNewsletter, policies } = useStore();

  const policyItems = (policies || [])
    .filter((p) => p && p.policyname && p.status !== false)
    .map((p) => [p.policyname, `/${slugifyPolicy(p.policyname)}`]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      notify("Email Required", "Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    const res = await subscribeNewsletter(email);
    setSubscribing(false);
    if (res?.ok || res?.success) {
      notify(generalSettings?.softwarename ? `Welcome to ${generalSettings.softwarename}` : "Thank you for subscribing!", "You're now on our exclusive bespoke client list.");
      setEmail("");
    } else {
      notify("Subscription status", res?.message || "Email submitted successfully.");
      setEmail("");
    }
  };

  const navCategories = categories && categories.length > 0
    ? [
      { label: "ALL JEWELRY", to: "/shop" },
      ...categories.map((c) => ({
        label: (c.categoryname || "").toUpperCase(),
        to: `/shop?category=${encodeURIComponent(c.categoryname)}`
      }))
    ]
    : [
      { label: "ALL JEWELRY", to: "/shop" }
    ];

  return (
    <footer style={{ backgroundColor: "#ffffff", color: "var(--foreground)" }}>
      {/* 1. Value Badges Bar - Warm Ivory Luxury Finish */}
      <div style={{ backgroundColor: "#FAF8F5", borderTop: "1px solid #EAE5D8", borderBottom: "1px solid #EAE5D8", padding: "40px 0" }}>
        <div
          className="container-luxury"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "32px",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-soft)",
                border: "1px solid rgba(85, 104, 50, 0.25)",
                display: "grid",
                placeItems: "center",
                color: "var(--primary)",
                flexShrink: 0
              }}
            >
              <Truck size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, fontFamily: "var(--font-serif)" }}>
                Complimentary Shipping
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: "3px 0 0 0" }}>
                Insured express global delivery
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-soft)",
                border: "1px solid rgba(85, 104, 50, 0.25)",
                display: "grid",
                placeItems: "center",
                color: "var(--primary)",
                flexShrink: 0
              }}
            >
              <CreditCard size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, fontFamily: "var(--font-serif)" }}>
                Flexible Payment
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: "3px 0 0 0" }}>
                Secure encrypted checkout
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-soft)",
                border: "1px solid rgba(85, 104, 50, 0.25)",
                display: "grid",
                placeItems: "center",
                color: "var(--primary)",
                flexShrink: 0
              }}
            >
              <RotateCcw size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, fontFamily: "var(--font-serif)" }}>
                30-Day Returns
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: "3px 0 0 0" }}>
                Effortless return &amp; exchange
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-soft)",
                border: "1px solid rgba(85, 104, 50, 0.25)",
                display: "grid",
                placeItems: "center",
                color: "var(--primary)",
                flexShrink: 0
              }}
            >
              <Headphones size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, fontFamily: "var(--font-serif)" }}>
                Private Concierge
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: "3px 0 0 0" }}>
                Dedicated fine jewelry experts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Navigation Links Strip */}
      <div style={{ borderBottom: "1px solid #EDE8DE", padding: "20px 0", backgroundColor: "#ffffff" }}>
        <div
          className="container-luxury"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "28px",
            alignItems: "center"
          }}
        >
          {navCategories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="eyebrow"
              style={{
                fontSize: "0.74rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: "var(--foreground)",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--foreground)")}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Main Footer 5 Columns */}
      <div
        className="container-luxury"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "42px",
          paddingTop: "70px",
          paddingBottom: "60px"
        }}
      >
        {/* Col 1: Join the Atelier Circle */}
        <div style={{ maxWidth: "320px" }}>
          <span
            className="eyebrow"
            style={{
              color: "var(--primary)",
              letterSpacing: "0.22em",
              display: "block",
              marginBottom: "8px"
            }}
          >
            {generalSettings?.softwarename ? `The ${generalSettings.softwarename} Circle` : "The Gemora Circle"}
          </span>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 400, margin: 0, lineHeight: 1.25 }}>
            Bespoke Access &amp; Privileges
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginTop: "12px" }}>
            Receive priority invitations to high jewelry collections, private salon viewing, and bespoke offers.
          </p>

          <form onSubmit={handleSubscribe} style={{ marginTop: "22px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1.5px solid var(--foreground)",
                paddingBottom: "8px",
                transition: "border-color 0.2s"
              }}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "0.85rem",
                  background: "transparent",
                  color: "var(--foreground)"
                }}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={subscribing}
                style={{
                  color: "var(--primary)",
                  opacity: subscribing ? 0.6 : 1,
                  cursor: subscribing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px"
                }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Luxury Social Icons */}
          {socialMedia && socialMedia.length > 0 && (
            <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
              {socialMedia.map((net, idx) => (
                <a
                  key={net._id || idx}
                  href={net.url}
                  target="_blank"
                  rel="noreferrer"
                  title={net.platform || "Social"}
                  aria-label={net.platform || "Social Link"}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "1px solid #dcd6c8",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--foreground)",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                    backgroundColor: "#faf8f5"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#dcd6c8";
                    e.currentTarget.style.backgroundColor = "#faf8f5";
                    e.currentTarget.style.color = "var(--foreground)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <SocialIcon platform={net.platform} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Col 2: Find Us */}
        <div>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", letterSpacing: "0.04em", marginBottom: "18px" }}>
            The Atelier
          </h4>
          {generalSettings?.address && (
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "14px" }}>
              <MapPin size={16} style={{ color: "var(--primary)", marginTop: "3px", flexShrink: 0 }} />
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: 0 }}>
                {generalSettings.address}, {generalSettings.cityname}
                <br />
                {generalSettings.statename}, {generalSettings.countryname}{generalSettings.postalcode ? ` - ${generalSettings.postalcode}` : ""}
              </p>
            </div>
          )}
          {generalSettings?.phone && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
              <Phone size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <a
                href={`tel:${generalSettings.phone.replace(/\s+/g, "")}`}
                style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
              >
                {generalSettings.phone}
              </a>
            </div>
          )}
          {generalSettings?.email && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Mail size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <a
                href={`mailto:${generalSettings.email}`}
                style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
              >
                {generalSettings.email}
              </a>
            </div>
          )}
        </div>

        {/* Col 3: Concierge & Help */}
        <div>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", letterSpacing: "0.04em", marginBottom: "18px" }}>
            Client Services
          </h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              ["Frequently Asked Questions", "/faq"],
              ["Book Private Consultation", "/contact"],
              ["Track Your Order", "/orders"],
              ["Diamond Education", "/about"]
            ].map(([label, to]) => (
              <li key={label}>
                <Link
                  to={to}
                  style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--muted-foreground)")}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Policies */}
        {policyItems.length > 0 && (
          <div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", letterSpacing: "0.04em", marginBottom: "18px" }}>
              Our Promises
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {policyItems.map(([label, to]) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                    onMouseLeave={(e) => (e.target.style.color = "var(--muted-foreground)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Col 5: About Us */}
        <div>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", letterSpacing: "0.04em", marginBottom: "18px" }}>
            The Maison
          </h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              ["Our Heritage & Story", "/about"],
              ["Contact & Appointments", "/contact"],
              ["All Fine Jewelry", "/shop"]
            ].map(([label, to]) => (
              <li key={label}>
                <Link
                  to={to}
                  style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--muted-foreground)")}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Bottom Bar: Copyright & Verified Payment Badges */}
      <div style={{ borderTop: "1px solid #EDE8DE", padding: "24px 0", backgroundColor: "#FAF9F6" }}>
        <div
          className="container-luxury"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
            fontSize: "0.78rem",
            color: "var(--muted-foreground)"
          }}
        >
          <p style={{ margin: 0 }}>
            {generalSettings?.copyright || `© ${new Date().getFullYear()} ${generalSettings?.softwarename || "Gemora Diam"}. All Rights Reserved.`}
          </p>

          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#888" }}>
              Secured Payments
            </span>
            <img src={visaSvg} alt="Visa" style={{ height: "20px", objectFit: "contain", opacity: 0.85 }} />
            <img src={masterSvg} alt="Mastercard" style={{ height: "20px", objectFit: "contain", opacity: 0.85 }} />
            <img src={amexSvg} alt="Amex" style={{ height: "20px", objectFit: "contain", opacity: 0.85 }} />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
