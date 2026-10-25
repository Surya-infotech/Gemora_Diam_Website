import { useStore } from "../lib/store";
import { formatPhoneNumber } from "../lib/formatters";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Award,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Gem
} from "lucide-react";
import atelier from "../assets/atelier.jpg";

export default function AboutPage() {
  const { aboutUs, generalSettings, settingsLoading } = useStore();
  const brandName = generalSettings?.softwarename || "GEMORA DIAM";

  const locationString = [
    generalSettings?.address,
    generalSettings?.cityname,
    generalSettings?.statename,
    generalSettings?.countryname
  ].filter(Boolean).join(", ") + (generalSettings?.postalcode ? ` - ${generalSettings.postalcode}` : "");

  const hasHero = Boolean(aboutUs?.heroTitle || aboutUs?.heroDescription || aboutUs?.heroEyebrow);
  const hasPillars = Boolean(
    aboutUs?.commitmentEyebrow ||
    aboutUs?.pillar1Title || aboutUs?.pillar1Description ||
    aboutUs?.pillar2Title || aboutUs?.pillar2Description ||
    aboutUs?.pillar3Title || aboutUs?.pillar3Description
  );
  const hasStudio = Boolean(
    aboutUs?.studioTitle || aboutUs?.studioDescription ||
    aboutUs?.studioEyebrow || aboutUs?.studioImage ||
    aboutUs?.buttonText
  );

  const pillarsList = [
    {
      icon: Sparkles,
      title: aboutUs?.pillar1Title,
      description: aboutUs?.pillar1Description
    },
    {
      icon: Award,
      title: aboutUs?.pillar2Title,
      description: aboutUs?.pillar2Description
    },
    {
      icon: ShieldCheck,
      title: aboutUs?.pillar3Title,
      description: aboutUs?.pillar3Description
    }
  ].filter((p) => p.title || p.description);

  return (
    <div style={{ backgroundColor: "#FAF9F6", color: "var(--foreground)", overflowX: "hidden" }}>
      {/* High-Jewelry Editorial CSS */}
      <style>{`
        .about-pillar-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(197, 160, 89, 0.22);
          border-radius: 16px;
          padding: 36px 30px;
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .about-pillar-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.55);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
        }
        .about-contact-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 10px;
          background-color: #FFFFFF;
          border: 1px solid #ECE7DE;
          transition: all 0.25s ease;
        }
        .about-contact-row:hover {
          border-color: var(--gold);
          transform: translateX(3px);
          box-shadow: 0 4px 14px rgba(28, 34, 23, 0.05);
        }
      `}</style>

      {/* 1. INTRO HERO SECTION: The Atelier Heritage & Vision (Dynamic) */}
      {hasHero && (
        <section
          style={{
            position: "relative",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #ECE7DE",
            padding: "clamp(64px, 8vw, 108px) 24px clamp(50px, 6vw, 84px) 24px",
            textAlign: "center"
          }}
        >
          <div className="container-luxury" style={{ maxWidth: "880px" }}>
            {/* Eyebrow Pill */}
            {aboutUs?.heroEyebrow && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 18px",
                  borderRadius: "30px",
                  backgroundColor: "rgba(85, 104, 50, 0.08)",
                  border: "1px solid rgba(85, 104, 50, 0.22)",
                  marginBottom: "20px"
                }}
              >
                <Sparkles size={14} style={{ color: "var(--primary)" }} />
                <span
                  className="eyebrow"
                  style={{
                    color: "var(--primary)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em"
                  }}
                >
                  {aboutUs.heroEyebrow}
                </span>
              </div>
            )}

            {/* Main Headline */}
            {aboutUs?.heroTitle && (
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.8rem, 5.5vw, 4.4rem)",
                  fontWeight: 400,
                  lineHeight: 1.14,
                  color: "var(--foreground)",
                  margin: "0 auto",
                  letterSpacing: "-0.015em"
                }}
              >
                {aboutUs.heroTitle}
              </h1>
            )}

            {/* Narrative Story Description */}
            {aboutUs?.heroDescription && (
              <p
                style={{
                  fontSize: "clamp(0.96rem, 1.4vw, 1.12rem)",
                  color: "var(--muted-foreground)",
                  maxWidth: "720px",
                  margin: "24px auto 0 auto",
                  lineHeight: 1.75
                }}
              >
                {aboutUs.heroDescription}
              </p>
            )}

            {/* Heritage Credentials Strip */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "clamp(16px, 3vw, 36px)",
                alignItems: "center",
                marginTop: "36px",
                paddingTop: "28px",
                borderTop: "1px solid #EFEAE0",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted-foreground)"
              }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--gold-deep)" }}>✦</span>
                <span>100% Certified Ethical Lab Diamonds</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--gold-deep)" }}>✦</span>
                <span>Master Jeweler Bench Craftsmanship</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--gold-deep)" }}>✦</span>
                <span>Lifetime Studio Provenance</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. PILLARS OF EXCELLENCE: Botanical Luxury Atelier Velvet (Dynamic) */}
      {hasPillars && (
        <section
          style={{
            background: "linear-gradient(180deg, #151D11 0%, #111710 100%)",
            color: "#EDE8DE",
            borderTop: "1px solid rgba(197, 160, 89, 0.25)",
            borderBottom: "1px solid rgba(197, 160, 89, 0.25)",
            padding: "clamp(72px, 8vw, 110px) 0",
            position: "relative"
          }}
        >
          <div className="container-luxury">
            {/* Section Header */}
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              {aboutUs?.commitmentEyebrow && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ color: "#D4AF37", fontSize: "0.85rem" }}>✦</span>
                  <span
                    className="eyebrow"
                    style={{
                      color: "#D4AF37",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.22em"
                    }}
                  >
                    {aboutUs.commitmentEyebrow}
                  </span>
                  <span style={{ color: "#D4AF37", fontSize: "0.85rem" }}>✦</span>
                </div>
              )}

              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 3.6vw, 3rem)",
                  fontWeight: 400,
                  color: "#FFFFFF",
                  margin: 0,
                  letterSpacing: "-0.01em"
                }}
              >
                The Foundations of Craftsmanship Excellence
              </h2>
            </div>

            {/* Pillars 3-Column Luxury Cards Grid */}
            {pillarsList.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                  gap: "clamp(24px, 3.2vw, 36px)"
                }}
              >
                {pillarsList.map((pillar, idx) => {
                  const IconComponent = pillar.icon;
                  const stepNumber = String(idx + 1).padStart(2, "0");

                  return (
                    <div key={idx} className="about-pillar-card">
                      {/* Top Row: Icon Medallion + Step Watermark */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(197, 160, 89, 0.12)",
                            border: "1px solid rgba(197, 160, 89, 0.35)",
                            display: "grid",
                            placeItems: "center",
                            color: "#D4AF37"
                          }}
                        >
                          <IconComponent size={22} strokeWidth={1.7} />
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.3rem",
                            fontWeight: 400,
                            color: "rgba(197, 160, 89, 0.45)",
                            letterSpacing: "0.1em"
                          }}
                        >
                          {stepNumber}
                        </span>
                      </div>

                      {/* Title */}
                      {pillar.title && (
                        <h3
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.55rem",
                            fontWeight: 400,
                            color: "#FFFFFF",
                            margin: "0 0 12px 0",
                            lineHeight: 1.25
                          }}
                        >
                          {pillar.title}
                        </h3>
                      )}

                      {/* Description */}
                      {pillar.description && (
                        <p
                          style={{
                            fontSize: "0.90rem",
                            lineHeight: 1.7,
                            color: "#B4BEAC",
                            margin: 0
                          }}
                        >
                          {pillar.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. STUDIO & SOURCING SPOTLIGHT: Master Atelier Showcase (Dynamic) */}
      {hasStudio && (
        <section style={{ padding: "clamp(76px, 8vw, 114px) 0" }}>
          <div className="container-luxury">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
                gap: "clamp(36px, 5vw, 68px)",
                alignItems: "center"
              }}
            >
              {/* Left Column: Editorial Studio Story */}
              <div>
                {aboutUs?.studioEyebrow && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "5px 14px",
                      borderRadius: "20px",
                      backgroundColor: "rgba(197, 160, 89, 0.12)",
                      border: "1px solid rgba(197, 160, 89, 0.3)",
                      marginBottom: "14px"
                    }}
                  >
                    <Gem size={13} style={{ color: "var(--gold-deep)" }} />
                    <span
                      className="eyebrow"
                      style={{
                        color: "var(--gold-deep)",
                        fontSize: "0.70rem",
                        fontWeight: 700,
                        letterSpacing: "0.20em"
                      }}
                    >
                      {aboutUs.studioEyebrow}
                    </span>
                  </div>
                )}

                {aboutUs?.studioTitle && (
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(2.4rem, 4.2vw, 3.4rem)",
                      marginTop: "6px",
                      lineHeight: 1.18,
                      color: "var(--foreground)",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    {aboutUs.studioTitle}
                  </h2>
                )}

                {aboutUs?.studioDescription && (
                  <p
                    style={{
                      marginTop: "20px",
                      fontSize: "0.98rem",
                      lineHeight: 1.75,
                      color: "var(--muted-foreground)"
                    }}
                  >
                    {aboutUs.studioDescription}
                  </p>
                )}

                {/* Studio Credentials & Contact Rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "28px" }}>
                  {locationString && (
                    <div className="about-contact-row">
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(197, 160, 89, 0.12)",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--gold-deep)",
                          flexShrink: 0
                        }}
                      >
                        <MapPin size={16} />
                      </div>
                      <span style={{ fontSize: "0.90rem", color: "var(--foreground)", fontWeight: 500 }}>
                        {locationString}
                      </span>
                    </div>
                  )}

                  {generalSettings?.phone && (
                    <div className="about-contact-row">
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(85, 104, 50, 0.1)",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--primary)",
                          flexShrink: 0
                        }}
                      >
                        <Phone size={15} />
                      </div>
                      <a
                        href={`tel:${generalSettings.phone.replace(/\s+/g, "")}`}
                        style={{ fontSize: "0.90rem", color: "var(--foreground)", textDecoration: "none", fontWeight: 500 }}
                      >
                        {formatPhoneNumber(generalSettings.phone)}
                      </a>
                    </div>
                  )}

                  {generalSettings?.email && (
                    <div className="about-contact-row">
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(197, 160, 89, 0.12)",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--gold-deep)",
                          flexShrink: 0
                        }}
                      >
                        <Mail size={15} />
                      </div>
                      <a
                        href={`mailto:${generalSettings.email}`}
                        style={{ fontSize: "0.90rem", color: "var(--foreground)", textDecoration: "none", fontWeight: 500 }}
                      >
                        {generalSettings.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Explore Collections CTA Button */}
                {aboutUs?.buttonText && (
                  <div style={{ marginTop: "36px" }}>
                    <Link
                      to={aboutUs.buttonLink || "/collections"}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: "var(--primary)",
                        color: "#FFFFFF",
                        padding: "16px 36px",
                        borderRadius: "10px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        boxShadow: "0 6px 18px rgba(85, 104, 50, 0.28)",
                        transition: "all 0.25s ease",
                        textDecoration: "none"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--primary)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <span>{aboutUs.buttonText}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Column: Master Jeweler Image Frame with Floating Seal */}
              {(aboutUs?.studioImage || atelier) && (
                <div style={{ position: "relative" }}>
                  {/* Decorative Frame Container */}
                  <div
                    style={{
                      padding: "8px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "18px",
                      border: "1px solid #E2DCD1",
                      boxShadow: "0 20px 50px rgba(28, 34, 23, 0.10)"
                    }}
                  >
                    <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden" }}>
                      <img
                        src={aboutUs?.studioImage || atelier}
                        alt={aboutUs?.studioTitle || "Master Studio Craftsmanship"}
                        loading="lazy"
                        style={{
                          width: "100%",
                          maxHeight: "500px",
                          aspectRatio: "4/3",
                          objectFit: "fill",
                          objectPosition: "center",
                          display: "block"
                        }}
                      />
                    </div>
                  </div>

                  {/* Floating Authenticity Seal */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-14px",
                      left: "24px",
                      backgroundColor: "rgba(17, 22, 17, 0.90)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(197, 160, 89, 0.4)",
                      borderRadius: "12px",
                      padding: "12px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      boxShadow: "0 10px 24px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(197, 160, 89, 0.15)",
                        border: "1px solid #D4AF37",
                        display: "grid",
                        placeItems: "center",
                        color: "#D4AF37",
                        flexShrink: 0
                      }}
                    >
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span
                        className="eyebrow"
                        style={{
                          color: "#E8D7A7",
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          display: "block"
                        }}
                      >
                        MASTER WORKSHOP BENCH
                      </span>
                      <strong style={{ fontSize: "0.82rem", color: "#FFFFFF", fontWeight: 500 }}>
                        Surat Flagship Workshop
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. FALLBACK STATE: If nothing configured in Admin Panel */}
      {!hasHero && !hasPillars && !hasStudio && !settingsLoading && (
        <section className="container-luxury" style={{ maxWidth: "860px", padding: "120px 20px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", color: "var(--foreground)" }}>
            {brandName}
          </h2>
          <p style={{ marginTop: "16px", color: "var(--muted-foreground)", fontSize: "1.05rem" }}>
            About Us details will appear here once configured in the Admin Panel.
          </p>
        </section>
      )}
    </div>
  );
}