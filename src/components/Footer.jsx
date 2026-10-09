import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  CreditCard,
  RotateCcw,
  Headphones,
  ArrowRight
} from "lucide-react";
import { useStore } from "../lib/store";
import { slugifyPolicy } from "../pages/PolicyPage";

import visaSvg from "../assets/vemus/payment_visa.svg";
import masterSvg from "../assets/vemus/payment_master.svg";
import amexSvg from "../assets/vemus/payment_am-ex.svg";

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
    ? [
      { label: "ALL JEWELRY", to: "/shop" },
      ...categories.map((c) => ({
        label: c.categoryname.toUpperCase(),
        to: `/shop?category=${encodeURIComponent(c.categoryname)}`
      }))
    ]
    : [
      { label: "ALL JEWELRY", to: "/shop" }
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

      {/* 3. Main Footer 5 Columns */}
      <div
        className="container-luxury"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "36px",
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
          <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.6, marginTop: "12px" }}>
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
              <button type="submit" aria-label="Subscribe" disabled={subscribing} style={{ color: "var(--primary)", opacity: subscribing ? 0.6 : 1, cursor: subscribing ? "not-allowed" : "pointer" }}>
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

        {/* Col 4: Policies */}
        {policyItems.length > 0 && (
          <div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", marginBottom: "20px" }}>
              POLICIES
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {policyItems.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize: "0.85rem", color: "#666", transition: "color 0.2s" }} onMouseEnter={(e) => (e.target.style.color = "var(--primary)")} onMouseLeave={(e) => (e.target.style.color = "#666")}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Col 5: About Us */}
        <div>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", marginBottom: "20px" }}>
            ABOUT US
          </h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              ["Our Story", "/about"],
              ["Contact Us", "/contact"]
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
            <img src={amexSvg} alt="Amex" style={{ height: "22px", objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
