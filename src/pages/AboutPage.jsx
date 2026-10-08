import { useState } from "react";
import atelier from "../assets/atelier.jpg";
import { images } from "../lib/products";

const MILESTONES = [
  { y: "1987", t: "The first atelier", d: "Élise Moreau opens a two-bench workshop on Rue de la Paix, Paris, hand-forging bespoke solitaire rings for European collectors." },
  { y: "1998", t: "The Éternelle ring", d: "Our signature four-claw solitaire is born and immediately becomes an internationally revered modern classic." },
  { y: "2009", t: "Ethical pledge", d: "GEMORA DIAM commits to 100% Kimberley Process–certified, traceable stones and certified conflict-free mines." },
  { y: "2016", t: "London & New York", d: "Flagship salons open on Bond Street and Madison Avenue, bringing Parisian high jewelry to transatlantic patrons." },
  { y: "2021", t: "Recycled gold", d: "Every single gram of GEMORA DIAM gold is refined from reclaimed sources, reducing mining carbon footprints by over 90%." },
  { y: "2026", t: "Global maison", d: "Twelve boutiques across four continents, yet one solitary, meticulous atelier philosophy at heart." },
];

export default function AboutPage() {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Intro Header */}
      <section className="container-luxury" style={{ maxWidth: "860px", padding: "100px 20px 80px", textAlign: "center" }}>
        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Our Story</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.8rem, 6vw, 4.8rem)", lineHeight: 1.15, marginTop: "16px" }}>
          Jewelry that outlives <em style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>us all</em>
        </h1>
        <p style={{ marginTop: "28px", fontSize: "1.05rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
          GEMORA DIAM began with a simple conviction: that a piece of jewelry should hold a memory for a hundred years. Our vision is to make heirlooms with an uncompromising conscience — beautiful, honest, and enduring.
        </p>
      </section>

      {/* Manifesto in Primary Luxury Green (#556832) */}
      <section style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", padding: "100px 0" }}>
        <div className="container-luxury">
          <p className="eyebrow" style={{ color: "var(--gold)", opacity: 0.9 }}>Manifesto</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "48px",
              marginTop: "40px"
            }}
          >
            {[
              ["We draw by hand.", "Every design starts as a pencil sketch, never an algorithmic template or generic mold."],
              ["We set by hand.", "One dedicated master jeweler sees each individual piece through from initial wax to final lustrous polish."],
              ["We stand behind it.", "A lifetime atelier guarantee, complimentary prong checkups and cleaning — because true heirlooms are forever."]
            ].map(([t, d]) => (
              <div key={t} style={{ borderLeft: "1px solid rgba(197, 160, 89, 0.4)", paddingLeft: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--gold)", marginBottom: "14px" }}>
                  {t}
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.7, opacity: 0.85 }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="container-luxury" style={{ padding: "100px 20px" }}>
        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Milestones</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 4vw, 3.4rem)", marginTop: "12px" }}>
          From Paris to the world
        </h2>

        {/* Year Selector Tabs */}
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            borderBottom: "1px solid var(--border)",
            marginTop: "48px",
            gap: "16px",
            scrollbarWidth: "none"
          }}
        >
          {MILESTONES.map((m, i) => (
            <button
              key={m.y}
              onClick={() => setActive(i)}
              style={{
                background: "none",
                border: "none",
                borderBottom: active === i ? "2px solid var(--gold)" : "2px solid transparent",
                paddingBottom: "16px",
                fontFamily: "var(--font-serif)",
                fontSize: "1.8rem",
                color: active === i ? "var(--foreground)" : "var(--muted-foreground)",
                cursor: "pointer",
                paddingLeft: "12px",
                paddingRight: "24px",
                transition: "all 0.2s ease"
              }}
            >
              {m.y}
            </button>
          ))}
        </div>

        {/* Active Milestone Card */}
        <div
          key={active}
          style={{
            marginTop: "40px",
            maxWidth: "680px",
            padding: "24px 0",
            animation: "fadeIn 0.4s ease"
          }}
        >
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", marginBottom: "14px", color: "var(--foreground)" }}>
            {MILESTONES[active].t}
          </h3>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
            {MILESTONES[active].d}
          </p>
        </div>
      </section>

      {/* Sustainability & Ethical Sourcing */}
      <section style={{ backgroundColor: "var(--secondary)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <div style={{ padding: "80px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Sustainability & Ethical Sourcing</p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 4vw, 3.2rem)", marginTop: "16px", marginBottom: "36px" }}>
            Beauty without compromise
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "32px" }}>
            {[
              ["Kimberley Process compliance", "Every natural diamond is certified conflict-free and completely traceable to its ethical mine of origin."],
              ["100% recycled gold", "Our gold is refined strictly from reclaimed sources, reducing carbon output and avoiding invasive new open-pit mining."],
              ["Conflict-free gemstones", "Sapphires, Colombian emeralds, and Burmese rubies are curated strictly from audited, fair-labor artisanal partners."]
            ].map(([t, d]) => (
              <li key={t} style={{ borderLeft: "2px solid var(--gold)", paddingLeft: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "8px" }}>{t}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <img
            src={images.lifestyle}
            alt="GEMORA DIAM jewelry worn"
            loading="lazy"
            style={{ width: "100%", height: "100%", minHeight: "440px", objectFit: "cover", display: "block" }}
          />
        </div>
      </section>

      {/* Master Jeweler Spotlight */}
      <section className="container-luxury" style={{ padding: "100px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "60px",
            alignItems: "center"
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={atelier}
              alt="Master jeweler Julien Moreau at work"
              loading="lazy"
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: "2px" }}
            />
          </div>
          <div>
            <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Master Jeweler Spotlight</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.6rem, 4vw, 3.6rem)", marginTop: "16px" }}>
              Julien Moreau
            </h2>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.25rem", color: "var(--muted-foreground)", marginTop: "8px" }}>
              Head of Atelier — 31 years at the bench
            </p>
            <p style={{ marginTop: "24px", fontSize: "0.98rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
              The founder's grandson, Julien trained under the elite Compagnons du Devoir before returning to lead the family atelier on Rue de la Paix. He personally inspects every high jewelry setting before it leaves Paris.
            </p>
            <blockquote
              style={{
                marginTop: "36px",
                borderLeft: "2px solid var(--gold)",
                paddingLeft: "24px",
                fontFamily: "var(--font-serif)",
                fontSize: "1.6rem",
                fontStyle: "italic",
                lineHeight: 1.5,
                color: "var(--foreground)"
              }}
            >
              "A stone already knows its shape. My job is to listen."
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  );
}
