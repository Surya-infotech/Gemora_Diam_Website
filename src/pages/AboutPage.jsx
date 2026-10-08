import { useStore } from "../lib/store";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Award, Sparkles, ShieldCheck } from "lucide-react";
import atelier from "../assets/atelier.jpg";
import { images } from "../lib/products";

export default function AboutPage() {
  const { generalSettings } = useStore();
  const brandName = generalSettings?.softwarename || "GEMORA DIAM";
  const locationString = [
    generalSettings?.address,
    generalSettings?.cityname,
    generalSettings?.statename,
    generalSettings?.countryname
  ].filter(Boolean).join(", ");

  return (
    <div>
      {/* Intro Header */}
      <section className="container-luxury" style={{ maxWidth: "860px", padding: "100px 20px 70px", textAlign: "center" }}>
        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Our Heritage &amp; Vision</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.8rem, 6vw, 4.6rem)", lineHeight: 1.15, marginTop: "16px" }}>
          Crafting Timeless <em style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>Brilliance</em>
        </h1>
        <p style={{ marginTop: "24px", fontSize: "1.05rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
          {generalSettings?.description || `${brandName} is dedicated to creating exquisite, ethically crafted lab grown diamond jewelry and bespoke fine pieces made to celebrate your most cherished moments.`}
        </p>
      </section>

      {/* Pillars of Excellence */}
      <section style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", padding: "90px 0" }}>
        <div className="container-luxury">
          <p className="eyebrow" style={{ color: "var(--gold)", opacity: 0.9 }}>Our Commitment</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "48px",
              marginTop: "40px"
            }}
          >
            <div style={{ borderLeft: "1px solid rgba(197, 160, 89, 0.4)", paddingLeft: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", color: "var(--gold)" }}>
                <Sparkles size={22} />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", margin: 0 }}>
                  Artisanal Precision
                </h3>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, opacity: 0.9 }}>
                Every piece is meticulously handcrafted by experienced diamond artisans, ensuring flawless cut, symmetry, and brilliance.
              </p>
            </div>

            <div style={{ borderLeft: "1px solid rgba(197, 160, 89, 0.4)", paddingLeft: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", color: "var(--gold)" }}>
                <Award size={22} />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", margin: 0 }}>
                  Certified Quality
                </h3>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, opacity: 0.9 }}>
                We use strictly certified conflict-free diamonds and high-purity precious metals, backed by complete transparency and certification.
              </p>
            </div>

            <div style={{ borderLeft: "1px solid rgba(197, 160, 89, 0.4)", paddingLeft: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", color: "var(--gold)" }}>
                <ShieldCheck size={22} />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", margin: 0 }}>
                  Lifetime Care
                </h3>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, opacity: 0.9 }}>
                Our relationship doesn't end at delivery. We stand behind every creation with lifetime craftsmanship guarantee and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio & Sourcing Spotlight */}
      <section className="container-luxury" style={{ padding: "100px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "60px",
            alignItems: "center"
          }}
        >
          <div>
            <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Fine Jewelry Studio</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 4vw, 3.4rem)", marginTop: "16px", lineHeight: 1.2 }}>
              {brandName} Studio &amp; Showroom
            </h2>
            <p style={{ marginTop: "20px", fontSize: "0.98rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
              From initial sketch and 3D modeling to stone setting and final inspection, our team handles each commission with utmost dedication to perfection.
            </p>

            {locationString && (
              <p style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginTop: "24px", fontSize: "0.95rem", color: "var(--foreground)" }}>
                <MapPin size={20} style={{ color: "var(--gold-deep)", flexShrink: 0, marginTop: "2px" }} />
                <span>{locationString}</span>
              </p>
            )}

            {generalSettings?.phone && (
              <p style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "14px", fontSize: "0.95rem" }}>
                <Phone size={18} style={{ color: "var(--gold-deep)", flexShrink: 0 }} />
                <a href={`tel:${generalSettings.phone.replace(/\s+/g, "")}`} style={{ color: "var(--foreground)", textDecoration: "none" }}>
                  {generalSettings.phone}
                </a>
              </p>
            )}

            {generalSettings?.email && (
              <p style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "14px", fontSize: "0.95rem" }}>
                <Mail size={18} style={{ color: "var(--gold-deep)", flexShrink: 0 }} />
                <a href={`mailto:${generalSettings.email}`} style={{ color: "var(--foreground)", textDecoration: "none" }}>
                  {generalSettings.email}
                </a>
              </p>
            )}

            <div style={{ marginTop: "36px" }}>
              <Link
                to="/shop"
                className="eyebrow"
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  padding: "16px 36px",
                  borderRadius: "2px"
                }}
              >
                Explore Collections
              </Link>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <img
              src={atelier}
              alt={`${brandName} studio craftsmanship`}
              loading="lazy"
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: "2px" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
