import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import SectionHeading from "../SectionHeading";

const STYLES = [
  {
    id: "solitaire",
    name: "Solitaire",
    desc: "The timeless purity of a single certified diamond",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    link: "/collections?style=Solitaire"
  },
  {
    id: "halo",
    name: "Halo",
    desc: "A luminous circle of pavé stones magnifying your center diamond",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    link: "/collections?style=Halo"
  },
  {
    id: "pave",
    name: "Pavé",
    desc: "A shimmering ribbon of micro-diamonds along the band",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    link: "/collections?style=Pave"
  },
  {
    id: "vintage",
    name: "Vintage",
    desc: "Intricate milgrain filigree and romantic heirloom silhouettes",
    img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
    link: "/collections?style=Vintage"
  },
  {
    id: "side-stones",
    name: "Side Stones",
    desc: "Tapered baguettes and round accents framing the center gem",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    link: "/collections?style=Side+Stones"
  },
  {
    id: "three-stone",
    name: "Three Stone",
    desc: "Representing your past, present, and eternal future together",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
    link: "/collections?style=Three+Stone"
  },
  {
    id: "nature",
    name: "Nature Inspired",
    desc: "Organic floral curves, leaf prongs, and botanical vines",
    img: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=800&auto=format&fit=crop",
    link: "/collections?style=Nature+Inspired"
  }
];

export default function ThePromiseAndVowSection() {
  const [activeStyleIdx, setActiveStyleIdx] = useState(2); // default to Pave
  const [isHovered, setIsHovered] = useState(false);

  const prevStyle = () => {
    setActiveStyleIdx((prev) => (prev === 0 ? STYLES.length - 1 : prev - 1));
  };

  const nextStyle = () => {
    setActiveStyleIdx((prev) => (prev + 1) % STYLES.length);
  };

  const activeStyle = STYLES[activeStyleIdx];

  return (
    <section
      aria-label="The Promise and The Vow"
      style={{
        backgroundColor: "#ffffff",
        padding: "clamp(48px, 6vw, 84px) 0 clamp(32px, 5vw, 64px) 0"
      }}
    >
      <div className="container-luxury">
        {/* Section Header */}
        <SectionHeading
          eyebrow="The Promise & The Vow"
          title={<>Two rings. <em style={{ fontStyle: "italic", color: "var(--gold)" }}>One</em> forever.</>}
          description="From the moment you ask to the day you say “I do,” find the handcrafted rings that tell your story."
        />

        {/* 2-Column Asymmetric Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(16px, 2.5vw, 28px)"
          }}
          className="promise-vow-grid"
        >
          {/* LEFT LARGE CARD: Wedding Bands (5fr) */}
          <Link
            to="/collections?category=Wedding+Bands"
            className="luxury-card"
            style={{
              display: "block",
              minHeight: "clamp(380px, 50vw, 560px)",
              textDecoration: "none",
              position: "relative"
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop"
              alt="Couple exchanging wedding bands"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 55%",
                transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* Gradient Dark Vignette */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(20, 27, 17, 0.2) 0%, rgba(20, 27, 17, 0.6) 40%, rgba(20, 27, 17, 0.95) 100%)",
                pointerEvents: "none"
              }}
            />

            {/* Inset Gold Hairline Border (Tesora Signature) */}
            <div
              style={{
                position: "absolute",
                inset: "clamp(12px, 2vw, 18px)",
                border: "1px solid rgba(197, 160, 89, 0.35)",
                borderRadius: "12px",
                pointerEvents: "none",
                transition: "border-color 0.4s ease"
              }}
            />

            {/* Shimmer sweep effect */}
            <div className="shimmer-sweep" />

            {/* Text Content Block */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "clamp(24px, 4vw, 44px)",
                color: "#ffffff",
                zIndex: 2
              }}
            >
              <p
                className="eyebrow"
                style={{
                  color: "var(--gold-light)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.72rem",
                  letterSpacing: "0.26em",
                  marginBottom: "8px"
                }}
              >
                <span style={{ width: "20px", height: "1px", backgroundColor: "var(--gold-light)" }} />
                The Vows
              </p>

              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.9rem, 3.4vw, 3rem)",
                  fontWeight: 400,
                  margin: "0 0 6px 0",
                  lineHeight: 1.1,
                  textShadow: "0 2px 14px rgba(0,0,0,0.5)"
                }}
              >
                Wedding Bands
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(0.95rem, 1.25vw, 1.15rem)",
                  color: "rgba(255, 255, 255, 0.88)",
                  margin: "0 0 20px 0"
                }}
              >
                The bands that seal the answer
              </p>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.74rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#ffffff",
                  borderBottom: "1.5px solid var(--gold)",
                  paddingBottom: "4px"
                }}
              >
                Shop Now <ArrowRight size={14} style={{ color: "var(--gold)" }} />
              </span>
            </div>
          </Link>

          {/* RIGHT COLUMN (7fr): Top Engagement Rings + Bottom Shop By Style */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2.5vw, 24px)" }}>
            {/* Top Engagement Rings Card */}
            <Link
              to="/collections?category=Engagement+Rings"
              className="luxury-card"
              style={{
                display: "block",
                minHeight: "clamp(260px, 28vw, 340px)",
                textDecoration: "none",
                position: "relative"
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1600&auto=format&fit=crop"
                alt="Couple holding hands with diamond engagement ring"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "55% center",
                  transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(20, 27, 17, 0.2) 0%, rgba(20, 27, 17, 0.6) 40%, rgba(20, 27, 17, 0.95) 100%)",
                  pointerEvents: "none"
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: "clamp(12px, 2vw, 18px)",
                  border: "1px solid rgba(197, 160, 89, 0.35)",
                  borderRadius: "12px",
                  pointerEvents: "none"
                }}
              />

              <div className="shimmer-sweep" />

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "clamp(20px, 3.5vw, 36px)",
                  color: "#ffffff",
                  zIndex: 2
                }}
              >
                <p
                  className="eyebrow"
                  style={{
                    color: "var(--gold-light)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.72rem",
                    letterSpacing: "0.26em",
                    marginBottom: "6px"
                  }}
                >
                  <span style={{ width: "20px", height: "1px", backgroundColor: "var(--gold-light)" }} />
                  The Proposal
                </p>

                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.7rem, 2.8vw, 2.6rem)",
                    fontWeight: 400,
                    margin: "0 0 4px 0",
                    lineHeight: 1.1
                  }}
                >
                  Engagement Rings
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)",
                    color: "rgba(255, 255, 255, 0.88)",
                    margin: "0 0 16px 0"
                  }}
                >
                  The ring that asks the question
                </p>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.74rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#ffffff",
                    borderBottom: "1.5px solid var(--gold)",
                    paddingBottom: "3px"
                  }}
                >
                  Shop Now <ArrowRight size={14} style={{ color: "var(--gold)" }} />
                </span>
              </div>
            </Link>

            {/* Bottom Card: "Shop by style" 3D Focal Dial */}
            <div
              style={{
                backgroundColor: "#FAF9F6",
                borderRadius: "16px",
                border: "1px solid #EAE3D5",
                padding: "clamp(18px, 2.5vw, 26px) clamp(16px, 2.5vw, 24px)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.03)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <p
                  className="eyebrow"
                  style={{
                    color: "var(--primary)",
                    letterSpacing: "0.24em",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    margin: 0
                  }}
                >
                  SHOP BY STYLE
                </p>

                {/* Left / Right Carousel Buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={prevStyle}
                    aria-label="Previous Style"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "1px solid #DDD6C8",
                      backgroundColor: "#ffffff",
                      color: "var(--foreground)",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.color = "var(--foreground)";
                      e.currentTarget.style.borderColor = "#DDD6C8";
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={nextStyle}
                    aria-label="Next Style"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "1px solid #DDD6C8",
                      backgroundColor: "#ffffff",
                      color: "var(--foreground)",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.color = "var(--foreground)";
                      e.currentTarget.style.borderColor = "#DDD6C8";
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Styles Horizontal Thumbnail Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "clamp(8px, 1.8vw, 16px)",
                  overflowX: "auto",
                  padding: "10px 0"
                }}
                className="no-scrollbar"
              >
                {STYLES.map((style, idx) => {
                  const isCurrent = idx === activeStyleIdx;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setActiveStyleIdx(idx)}
                      aria-label={`Select ${style.name}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                        transform: isCurrent ? "scale(1.08)" : "scale(0.92)",
                        opacity: isCurrent ? 1 : 0.65,
                        flexShrink: 0
                      }}
                    >
                      <div
                        style={{
                          width: isCurrent ? "64px" : "48px",
                          height: isCurrent ? "64px" : "48px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: isCurrent ? "2px solid var(--primary)" : "1.5px solid #DDD6C8",
                          boxShadow: isCurrent ? "0 4px 14px rgba(85, 104, 50, 0.25)" : "none",
                          transition: "all 0.3s ease",
                          backgroundColor: "#ffffff"
                        }}
                      >
                        <img
                          src={style.img}
                          alt={style.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? "var(--primary)" : "var(--muted-foreground)",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {style.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Style Info & Direct Shop CTA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid #EAE3D5",
                  paddingTop: "14px",
                  marginTop: "8px",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      margin: 0
                    }}
                  >
                    {activeStyle.name} Style
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: "2px 0 0 0" }}>
                    {activeStyle.desc}
                  </p>
                </div>

                <Link
                  to={activeStyle.link}
                  className="eyebrow"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    padding: "8px 18px",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    transition: "all 0.25s ease",
                    boxShadow: "0 2px 8px rgba(85, 104, 50, 0.3)"
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
                  <span>Explore {activeStyle.name}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .promise-vow-grid {
            grid-template-columns: 5fr 7fr !important;
          }
        }
      `}</style>
    </section>
  );
}
