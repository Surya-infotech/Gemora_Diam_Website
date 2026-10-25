import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  ShieldCheck,
  Truck,
  Award,
  Lock,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useStore } from "../lib/store";
import { formatPhoneNumber } from "../lib/formatters";
import { slugifyPolicy } from "../lib/slugify";

import visaSvg from "../assets/vemus/payment_visa.svg";
import masterSvg from "../assets/vemus/payment_master.svg";
import amexSvg from "../assets/vemus/payment_am-ex.svg";

// High-end SVG Icons for Social Media Platforms with Crisp Geometry
function SocialIcon({ platform }) {
  const p = (platform || "").toLowerCase();
  if (p.includes("insta")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (p.includes("face") || p.includes("fb")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
      </svg>
    );
  }
  if (p.includes("link")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (p.includes("whats") || p.includes("wa")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    );
  }
  return <Sparkles size={16} strokeWidth={1.8} />;
}

// 4 Signature Atelier Guarantees
const ATELIER_PROMISES = [
  {
    icon: Truck,
    title: "Complimentary Insured Courier",
    desc: "Discreet tamper-evident packaging with direct signed delivery worldwide."
  },
  {
    icon: Sparkles,
    title: "100% Certified Lab Diamonds",
    desc: "IGI & GIA certified stones created with zero-carbon ethical integrity."
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Warranty",
    desc: "Complimentary ultrasonic spa cleaning, annual prong checks & polish."
  },
  {
    icon: Award,
    title: "Personal Jewelry Concierge",
    desc: "Private consultations with master jewelers in person or virtually."
  }
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const { notify, generalSettings, socialMedia, categories, subscribeNewsletter, policies } = useStore();

  const brandName = generalSettings?.softwarename || "GEMORA DIAM";

  // Policies purely from store (backend dynamic policies)
  const displayedPolicies = (policies || [])
    .filter((p) => p && p.policyname && p.status !== false)
    .map((p) => [p.policyname, `/${slugifyPolicy(p.policyname)}`]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      notify("Email Required", "Please enter a valid email address to join our VIP Circle.");
      return;
    }
    setSubscribing(true);
    try {
      const res = await subscribeNewsletter(email);
      setSubscribing(false);
      if (res?.ok || res?.success) {
        setSubscribedSuccess(true);
        notify(
          `Welcome to ${brandName}`,
          "You have been granted exclusive access to our private collection releases."
        );
        setEmail("");
        setTimeout(() => setSubscribedSuccess(false), 5000);
      } else {
        notify("VIP Circle", res?.message || "Your private subscription has been noted.");
        setEmail("");
      }
    } catch {
      setSubscribing(false);
      notify("VIP Circle", "Thank you for expressing your interest in Gemora Diam.");
      setEmail("");
    }
  };

  // Curated category links strip purely from backend categories
  const navCategories = categories && categories.length > 0
    ? [
        { label: "ALL BESPOKE COLLECTIONS", to: "/collections" },
        ...categories.slice(0, 6).map((c) => ({
          label: (c.categoryname || "").toUpperCase(),
          to: `/collections?category=${encodeURIComponent(c.categoryname)}`
        }))
      ]
    : [];

  return (
    <footer
      className="gemora-luxury-footer"
      style={{
        backgroundColor: "#111611",
        color: "#EDE8DE",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(197, 160, 89, 0.3)"
      }}
    >
      {/* Embedded High-Jewelry Styling System */}
      <style>{`
        .gemora-luxury-footer a {
          color: inherit;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .footer-nav-link:hover {
          color: #D4AF37 !important;
          transform: translateX(3px);
        }
        .footer-category-link {
          position: relative;
          color: #D4D8CF;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color 0.25s ease;
          padding: 4px 0;
        }
        .footer-category-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0%;
          height: 1px;
          background-color: #D4AF37;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .footer-category-link:hover {
          color: #FFFFFF !important;
        }
        .footer-category-link:hover::after {
          width: 100%;
        }
        .footer-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(197, 160, 89, 0.3);
          background-color: rgba(255, 255, 255, 0.04);
          color: #EDE8DE;
          display: grid;
          place-items: center;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .footer-social-btn:hover {
          background-color: #556832;
          border-color: #D4AF37;
          color: #FFFFFF;
          transform: translateY(-3px);
          box-shadow: 0 8px 18px rgba(85, 104, 50, 0.4);
        }
        .footer-trust-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .footer-trust-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(197, 160, 89, 0.3);
          transform: translateY(-2px);
        }
        .footer-newsletter-wrap:focus-within {
          border-color: #D4AF37 !important;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.18) !important;
        }
      `}</style>

      {/* 1. PRE-FOOTER: Atelier Privileges & Trust Guarantees */}
      <div
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "#141B13",
          padding: "clamp(28px, 4vw, 42px) 0"
        }}
      >
        <div className="container-luxury">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
              gap: "20px"
            }}
          >
            {ATELIER_PROMISES.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="footer-trust-card">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(197, 160, 89, 0.12)",
                      border: "1px solid rgba(197, 160, 89, 0.35)",
                      display: "grid",
                      placeItems: "center",
                      color: "#D4AF37",
                      flexShrink: 0
                    }}
                  >
                    <IconComp size={20} strokeWidth={1.7} />
                  </div>
                  <div>
                    <h5
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.86rem",
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                        color: "#FFFFFF",
                        margin: "0 0 3px 0"
                      }}
                    >
                      {item.title}
                    </h5>
                    <p
                      style={{
                        fontSize: "0.76rem",
                        color: "#9EA695",
                        margin: 0,
                        lineHeight: 1.45
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. CATEGORY CURATION STRIP: Haute Joaillerie Nav Ribbon */}
      {navCategories.length > 0 && (
        <div
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            backgroundColor: "#101510",
            padding: "16px 0"
          }}
        >
          <div
            className="container-luxury"
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "clamp(16px, 2.8vw, 32px)",
              alignItems: "center"
            }}
          >
            {navCategories.map((cat, idx) => (
              <div key={cat.label} style={{ display: "inline-flex", alignItems: "center", gap: "clamp(16px, 2.8vw, 32px)" }}>
                <Link to={cat.to} className="footer-category-link">
                  {cat.label}
                </Link>
                {idx < navCategories.length - 1 && (
                  <span style={{ color: "rgba(197, 160, 89, 0.4)", fontSize: "0.6rem" }}>✦</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN FOOTER: 5 Editorial Columns */}
      <div
        className="container-luxury"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: "clamp(32px, 4.5vw, 56px)",
          paddingTop: "clamp(48px, 6vw, 76px)",
          paddingBottom: "clamp(40px, 5vw, 64px)"
        }}
      >
        {/* Col 1: The Atelier Circle & Private Newsletter (Wider Column) */}
        <div style={{ gridColumn: "span 1", maxWidth: "340px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <span style={{ color: "#D4AF37", fontSize: "0.9rem" }}>✦</span>
            <span
              className="eyebrow"
              style={{
                color: "#D4AF37",
                fontSize: "0.70rem",
                fontWeight: 700,
                letterSpacing: "0.22em"
              }}
            >
              {brandName ? `THE ${brandName.toUpperCase()} CIRCLE` : "THE VIP CIRCLE"}
            </span>
          </div>

          <h4
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.55rem",
              fontWeight: 400,
              color: "#FFFFFF",
              margin: "0 0 12px 0",
              lineHeight: 1.25,
              letterSpacing: "-0.01em"
            }}
          >
            Bespoke Access &amp; Privileges
          </h4>

          <p
            style={{
              fontSize: "0.84rem",
              color: "#A4AD9B",
              lineHeight: 1.65,
              margin: "0 0 20px 0"
            }}
          >
            Receive private showroom invitations, fine jewelry collection debuts, and bespoke commission opportunities.
          </p>

          {/* Newsletter Input Box */}
          <form onSubmit={handleSubscribe}>
            <div
              className="footer-newsletter-wrap"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(197, 160, 89, 0.35)",
                borderRadius: "30px",
                padding: "5px 6px 5px 18px",
                transition: "all 0.25s ease"
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                aria-label="Email address for newsletter"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "0.84rem",
                  background: "transparent",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sans)"
                }}
              />
              <button
                type="submit"
                aria-label="Subscribe to VIP updates"
                disabled={subscribing}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#556832",
                  color: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  cursor: subscribing ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  border: "none",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D4AF37";
                  e.currentTarget.style.color = "#111611";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#556832";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {subscribedSuccess && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", color: "#A3D9A5", fontSize: "0.78rem" }}>
              <CheckCircle2 size={14} />
              <span>You are now on our private bespoke client roster.</span>
            </div>
          )}

          {/* Luxury Social Icons */}
          {socialMedia && socialMedia.length > 0 && (
            <div style={{ marginTop: "26px" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#7D8775",
                  marginBottom: "12px",
                  fontWeight: 600
                }}
              >
                Connect With Us
              </span>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {socialMedia.map((net, idx) => (
                  <a
                    key={net._id || idx}
                    href={net.url}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn"
                    title={net.platform || "Social Channel"}
                    aria-label={net.platform || "Social Link"}
                  >
                    <SocialIcon platform={net.platform} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Col 2: The Atelier & Salon */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
            <span style={{ color: "#D4AF37", fontSize: "0.8rem" }}>✦</span>
            <h4
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.32rem",
                color: "#FFFFFF",
                fontWeight: 400,
                margin: 0,
                letterSpacing: "0.02em"
              }}
            >
              The Studio
            </h4>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {generalSettings?.address && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(197, 160, 89, 0.12)",
                    display: "grid",
                    placeItems: "center",
                    color: "#D4AF37",
                    marginTop: "2px",
                    flexShrink: 0
                  }}
                >
                  <MapPin size={14} />
                </div>
                <p style={{ fontSize: "0.84rem", color: "#B8C1B0", lineHeight: 1.6, margin: 0 }}>
                  <strong style={{ color: "#FFFFFF", display: "block", fontWeight: 600 }}>Master Workshop &amp; Showroom</strong>
                  {generalSettings.address}, {generalSettings.cityname}
                  <br />
                  {generalSettings.statename}, {generalSettings.countryname}
                  {generalSettings.postalcode ? ` - ${generalSettings.postalcode}` : ""}
                </p>
              </div>
            )}

            {generalSettings?.phone && (
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(197, 160, 89, 0.12)",
                    display: "grid",
                    placeItems: "center",
                    color: "#D4AF37",
                    flexShrink: 0
                  }}
                >
                  <Phone size={13} />
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.70rem", color: "#7D8775", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Private Concierge
                  </span>
                  <a
                    href={`tel:${generalSettings.phone.replace(/\s+/g, "")}`}
                    className="footer-nav-link"
                    style={{ fontSize: "0.85rem", color: "#EDE8DE", fontWeight: 500 }}
                  >
                    {formatPhoneNumber(generalSettings.phone)}
                  </a>
                </div>
              </div>
            )}

            {generalSettings?.email && (
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(197, 160, 89, 0.12)",
                    display: "grid",
                    placeItems: "center",
                    color: "#D4AF37",
                    flexShrink: 0
                  }}
                >
                  <Mail size={13} />
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.70rem", color: "#7D8775", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Client Inquiries
                  </span>
                  <a
                    href={`mailto:${generalSettings.email}`}
                    className="footer-nav-link"
                    style={{ fontSize: "0.85rem", color: "#EDE8DE", fontWeight: 500 }}
                  >
                    {generalSettings.email}
                  </a>
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: "6px",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px dashed rgba(197, 160, 89, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Clock size={13} style={{ color: "#D4AF37" }} />
              <span style={{ fontSize: "0.74rem", color: "#A4AD9B" }}>
                Showroom Viewings By Appointment
              </span>
            </div>
          </div>
        </div>

        {/* Col 3: Client Services */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
            <span style={{ color: "#D4AF37", fontSize: "0.8rem" }}>✦</span>
            <h4
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.32rem",
                color: "#FFFFFF",
                fontWeight: 400,
                margin: 0,
                letterSpacing: "0.02em"
              }}
            >
              Client Services
            </h4>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "13px" }}>
            {[
              ["Frequently Asked Questions", "/faq"],
              ["Book Private Consultation", "/contact"],
              ["Bespoke Commission Journey", "/about"],
              ["Track Order Status", "/orders"],
              ["Diamond Education & Carat Guide", "/about"]
            ].map(([label, to]) => (
              <li key={label}>
                <Link
                  to={to}
                  className="footer-nav-link"
                  style={{
                    fontSize: "0.85rem",
                    color: "#A8B2A0",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span style={{ opacity: 0.4, fontSize: "0.6rem" }}>›</span>
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Our Commitments (Policies) */}
        {displayedPolicies.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
              <span style={{ color: "#D4AF37", fontSize: "0.8rem" }}>✦</span>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.32rem",
                  color: "#FFFFFF",
                  fontWeight: 400,
                  margin: 0,
                  letterSpacing: "0.02em"
                }}
              >
                Our Commitments
              </h4>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "13px" }}>
              {displayedPolicies.map(([label, to]) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="footer-nav-link"
                    style={{
                      fontSize: "0.85rem",
                      color: "#A8B2A0",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span style={{ opacity: 0.4, fontSize: "0.6rem" }}>›</span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Col 5: The Maison */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
            <span style={{ color: "#D4AF37", fontSize: "0.8rem" }}>✦</span>
            <h4
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.32rem",
                color: "#FFFFFF",
                fontWeight: 400,
                margin: 0,
                letterSpacing: "0.02em"
              }}
            >
              The Brand
            </h4>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "13px" }}>
            {[
              ["Our Heritage & Craftsmanship", "/about"],
              ["Ethical Lab Diamond Manifesto", "/about"],
              ["All Fine Jewelry Collections", "/collections"],
              ["Contact & Showroom Appointments", "/contact"],
              ["Customer Care Portal", "/orders"]
            ].map(([label, to]) => (
              <li key={label}>
                <Link
                  to={to}
                  className="footer-nav-link"
                  style={{
                    fontSize: "0.85rem",
                    color: "#A8B2A0",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span style={{ opacity: 0.4, fontSize: "0.6rem" }}>›</span>
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. BOTTOM BAR: Legal Copyright, Master Atelier Tag & Encrypted Payment Trust Badges */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "24px 0",
          backgroundColor: "#0B0F0B"
        }}
      >
        <div
          className="container-luxury"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            fontSize: "0.78rem",
            color: "#838D7B"
          }}
        >
          {/* Left: Copyright */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p style={{ margin: 0, color: "#9EA797" }}>
              {generalSettings?.copyright || `© ${new Date().getFullYear()} ${brandName}. All Rights Reserved.`}
            </p>
            <span style={{ fontSize: "0.70rem", color: "#616A5A", letterSpacing: "0.06em" }}>
              Luxury &amp; Sustainable Fine Jewelry Studio
            </span>
          </div>

          {/* Center: Atelier Heritage Tagline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.72rem",
              color: "#9EA797",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            <span style={{ color: "#D4AF37" }}>✦</span>
            <span>Handcrafted With Master Precision · Ethical Lab Diamonds</span>
            <span style={{ color: "#D4AF37" }}>✦</span>
          </div>

          {/* Right: Certified Encrypted Payment Trust */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.70rem",
                color: "#9EA797",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginRight: "4px"
              }}
            >
              <Lock size={12} style={{ color: "#D4AF37" }} />
              <span>256-Bit SSL Secured</span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center"
              }}
            >
              {[
                { src: visaSvg, alt: "Visa Payment" },
                { src: masterSvg, alt: "Mastercard Payment" },
                { src: amexSvg, alt: "American Express Payment" }
              ].map((badge) => (
                <div
                  key={badge.alt}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "4px",
                    padding: "3px 8px",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                    transition: "transform 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <img
                    src={badge.src}
                    alt={badge.alt}
                    style={{ height: "16px", width: "auto", objectFit: "contain", display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
