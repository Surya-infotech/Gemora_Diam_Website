import { useStore } from "../lib/store";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Award, Sparkles, ShieldCheck } from "lucide-react";
import atelier from "../assets/atelier.jpg";

export default function AboutPage() {
  const { aboutUs, generalSettings, settingsLoading } = useStore();
  const brandName = generalSettings?.softwarename || "GEMORA DIAM";
  const locationString = [
    generalSettings?.address,
    generalSettings?.cityname,
    generalSettings?.statename,
    generalSettings?.countryname
  ].filter(Boolean).join(", ");

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
    <div>
      {/* 1. Intro Hero Section (Dynamic from Backend) */}
      {hasHero && (
        <section className="container-luxury" style={{ maxWidth: "860px", padding: "100px 20px 70px", textAlign: "center" }}>
          {aboutUs?.heroEyebrow && (
            <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
              {aboutUs.heroEyebrow}
            </p>
          )}
          {aboutUs?.heroTitle && (
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.8rem, 6vw, 4.6rem)", lineHeight: 1.15, marginTop: "16px" }}>
              {aboutUs.heroTitle}
            </h1>
          )}
          {aboutUs?.heroDescription && (
            <p style={{ marginTop: "24px", fontSize: "1.05rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
              {aboutUs.heroDescription}
            </p>
          )}
        </section>
      )}

      {/* 2. Pillars of Excellence / Commitment (Dynamic from Backend) */}
      {hasPillars && (
        <section style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", padding: "90px 0" }}>
          <div className="container-luxury">
            {aboutUs?.commitmentEyebrow && (
              <p className="eyebrow" style={{ color: "var(--gold)", opacity: 0.9 }}>
                {aboutUs.commitmentEyebrow}
              </p>
            )}
            {pillarsList.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "48px",
                  marginTop: "40px"
                }}
              >
                {pillarsList.map((pillar, idx) => {
                  const IconComponent = pillar.icon;
                  return (
                    <div key={idx} style={{ borderLeft: "1px solid rgba(197, 160, 89, 0.4)", paddingLeft: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", color: "var(--gold)" }}>
                        <IconComponent size={22} />
                        {pillar.title && (
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", margin: 0 }}>
                            {pillar.title}
                          </h3>
                        )}
                      </div>
                      {pillar.description && (
                        <p style={{ fontSize: "0.95rem", lineHeight: 1.7, opacity: 0.9 }}>
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

      {/* 3. Studio & Sourcing Spotlight (Dynamic from Backend) */}
      {hasStudio && (
        <section className="container-luxury" style={{ padding: "100px 20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "clamp(28px, 4vw, 60px)",
              alignItems: "center"
            }}
          >
            <div>
              {aboutUs?.studioEyebrow && (
                <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
                  {aboutUs.studioEyebrow}
                </p>
              )}
              {aboutUs?.studioTitle && (
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 4vw, 3.4rem)", marginTop: "16px", lineHeight: 1.2 }}>
                  {aboutUs.studioTitle}
                </h2>
              )}
              {aboutUs?.studioDescription && (
                <p style={{ marginTop: "20px", fontSize: "0.98rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
                  {aboutUs.studioDescription}
                </p>
              )}

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

              {aboutUs?.buttonText && (
                <div style={{ marginTop: "36px" }}>
                  <Link
                    to={aboutUs.buttonLink || "/shop"}
                    className="eyebrow"
                    style={{
                      display: "inline-block",
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      padding: "16px 36px",
                      borderRadius: "2px"
                    }}
                  >
                    {aboutUs.buttonText}
                  </Link>
                </div>
              )}
            </div>

            {(aboutUs?.studioImage || atelier) && (
              <div style={{ position: "relative" }}>
                <img
                  src={aboutUs?.studioImage || atelier}
                  alt={aboutUs?.studioTitle || "Studio Craftsmanship"}
                  loading="lazy"
                  style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: "2px" }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Fallback state if nothing has been configured yet in Admin Panel */}
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