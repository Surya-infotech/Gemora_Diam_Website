import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import SectionHeading from "../SectionHeading";

export default function ThePromiseAndVowSection() {
  const [data, setData] = useState(null);
  const [activeStyleIdx, setActiveStyleIdx] = useState(0);
  const stylesRowRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSection = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) return;
        const res = await fetch(`${backendUrl}/Support/GetActivePromiseSection`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json) {
            setData(json);
          }
        }
      } catch (err) {
        console.warn("Failed to load Promise & Vow section:", err);
      }
    };
    fetchSection();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pure dynamic styles from backend
  const styles = Array.isArray(data?.styles) ? data.styles : [];
  const hasStyles = styles.length > 0;
  const safeIdx = hasStyles ? Math.min(Math.max(0, activeStyleIdx), styles.length - 1) : 0;
  const activeStyle = hasStyles ? styles[safeIdx] : null;

  // Auto-scroll active style thumbnail into view
  useEffect(() => {
    if (!stylesRowRef.current || !hasStyles) return;
    const activeEl = stylesRowRef.current.children?.[safeIdx];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }, [safeIdx, hasStyles]);

  if (!data) {
    return null;
  }

  // If Super Admin has not entered any content yet, cleanly return null
  const hasAnyContent = Boolean(
    data.headerTitle ||
    data.headerEyebrow ||
    data.vowsTitle ||
    data.vowsImage ||
    data.proposalTitle ||
    data.proposalImage ||
    hasStyles
  );

  if (!hasAnyContent) {
    return null;
  }

  const prevStyle = () => {
    if (!hasStyles) return;
    setActiveStyleIdx((prev) => (prev === 0 ? styles.length - 1 : prev - 1));
  };

  const nextStyle = () => {
    if (!hasStyles) return;
    setActiveStyleIdx((prev) => (prev + 1) % styles.length);
  };

  // Dynamic Header Content
  const headerEyebrow = data.headerEyebrow || "";
  const headerTitle = data.headerTitle || "";
  const headerHighlight = data.headerHighlightText || "";
  const headerDescription = data.headerDescription || "";

  const renderTitle = () => {
    if (!headerTitle) return null;
    if (!headerHighlight || !headerTitle.toLowerCase().includes(headerHighlight.toLowerCase())) {
      return headerTitle;
    }
    const idx = headerTitle.toLowerCase().indexOf(headerHighlight.toLowerCase());
    const before = headerTitle.slice(0, idx);
    const word = headerTitle.slice(idx, idx + headerHighlight.length);
    const after = headerTitle.slice(idx + headerHighlight.length);
    return (
      <>
        {before}
        <em style={{ fontStyle: "italic", color: "var(--gold)" }}>{word}</em>
        {after}
      </>
    );
  };

  // Dynamic Left Card: The Vows (Wedding Bands)
  const vowsEyebrow = data.vowsEyebrow || "";
  const vowsTitle = data.vowsTitle || "";
  const vowsSubtitle = data.vowsSubtitle || "";
  const vowsImage = data.vowsImage || "";
  const vowsButtonText = data.vowsButtonText || "";
  const vowsButtonLink = data.vowsButtonLink || "/collections";

  // Dynamic Right Top Card: The Proposal (Engagement Rings)
  const proposalEyebrow = data.proposalEyebrow || "";
  const proposalTitle = data.proposalTitle || "";
  const proposalSubtitle = data.proposalSubtitle || "";
  const proposalImage = data.proposalImage || "";
  const proposalButtonText = data.proposalButtonText || "";
  const proposalButtonLink = data.proposalButtonLink || "/collections";

  // Dynamic Right Bottom Box: Shop By Style
  const styleSectionTitle = data.styleSectionTitle || "";

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
        {(headerEyebrow || headerTitle || headerDescription) && (
          <SectionHeading
            eyebrow={headerEyebrow}
            title={renderTitle()}
            description={headerDescription}
          />
        )}

        {/* 2-Column Asymmetric Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(16px, 2.5vw, 28px)"
          }}
          className="promise-vow-grid"
        >
          {/* LEFT LARGE CARD: The Vows / Wedding Bands (5fr) */}
          <Link
            to={vowsButtonLink}
            className="promise-vow-card-left luxury-card"
            style={{
              display: "block",
              textDecoration: "none",
              position: "relative"
            }}
          >
            {vowsImage && (
              <img
                src={vowsImage}
                alt={vowsTitle}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 32%",
                  transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            )}

            {/* Gradient Dark Vignette - refined so image stays vibrant and text is crystal clear */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(12, 17, 10, 0.08) 0%, rgba(12, 17, 10, 0.35) 45%, rgba(12, 17, 10, 0.92) 100%)",
                pointerEvents: "none"
              }}
            />

            {/* Inset Gold Hairline Border (Signature Tesora/Gemora Styling) */}
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
                padding: "clamp(22px, 3.8vw, 38px)",
                color: "#ffffff",
                zIndex: 2
              }}
            >
              {vowsEyebrow && (
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
                  {vowsEyebrow}
                </p>
              )}

              {vowsTitle && (
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.75rem, 3.2vw, 2.8rem)",
                    fontWeight: 400,
                    color: "#ffffff",
                    margin: "0 0 6px 0",
                    lineHeight: 1.15,
                    textShadow: "0 2px 14px rgba(0,0,0,0.5)"
                  }}
                >
                  {vowsTitle}
                </h3>
              )}

              {vowsSubtitle && (
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "clamp(0.88rem, 1.2vw, 1.05rem)",
                    color: "rgba(255, 255, 255, 0.88)",
                    margin: "0 0 16px 0"
                  }}
                >
                  {vowsSubtitle}
                </p>
              )}

              {vowsButtonText && (
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
                  {vowsButtonText} <ArrowRight size={14} style={{ color: "var(--gold)" }} />
                </span>
              )}
            </div>
          </Link>

          {/* RIGHT COLUMN (7fr): Top Engagement Rings + Bottom Shop By Style */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2.5vw, 24px)" }}>
            {/* Top Engagement Rings Card */}
            <Link
              to={proposalButtonLink}
              className="promise-vow-card-right luxury-card"
              style={{
                display: "block",
                textDecoration: "none",
                position: "relative"
              }}
            >
              {proposalImage && (
                <img
                  src={proposalImage}
                  alt={proposalTitle}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                    transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(12, 17, 10, 0.08) 0%, rgba(12, 17, 10, 0.35) 45%, rgba(12, 17, 10, 0.92) 100%)",
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
                  padding: "clamp(22px, 3.8vw, 38px)",
                  color: "#ffffff",
                  zIndex: 2
                }}
              >
                {proposalEyebrow && (
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
                    {proposalEyebrow}
                  </p>
                )}

                {proposalTitle && (
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.75rem, 3.2vw, 2.8rem)",
                      fontWeight: 400,
                      color: "#ffffff",
                      margin: "0 0 6px 0",
                      lineHeight: 1.15,
                      textShadow: "0 2px 14px rgba(0,0,0,0.5)"
                    }}
                  >
                    {proposalTitle}
                  </h3>
                )}

                {proposalSubtitle && (
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: "clamp(0.88rem, 1.2vw, 1.05rem)",
                      color: "rgba(255, 255, 255, 0.88)",
                      margin: "0 0 16px 0"
                    }}
                  >
                    {proposalSubtitle}
                  </p>
                )}

                {proposalButtonText && (
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
                    {proposalButtonText} <ArrowRight size={14} style={{ color: "var(--gold)" }} />
                  </span>
                )}
              </div>
            </Link>

            {/* Bottom Card: "Shop by style" 3D Focal Dial (Only rendered if styles exist) */}
            {hasStyles && activeStyle && (
              <div
                className="promise-vow-style-card"
                style={{
                  backgroundColor: "#FAF9F6",
                  borderRadius: "16px",
                  border: "1px solid #EAE3D5",
                  padding: "clamp(16px, 2.5vw, 24px)",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                  overflow: "hidden"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", gap: "10px" }}>
                  {styleSectionTitle ? (
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
                      {styleSectionTitle}
                    </p>
                  ) : <div />}

                  {/* Left / Right Carousel Buttons */}
                  {styles.length > 1 && (
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={prevStyle}
                        aria-label="Previous Style"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "1px solid #DDD6C8",
                          backgroundColor: "#ffffff",
                          color: "var(--foreground)",
                          display: "grid",
                          placeItems: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          padding: 0,
                          flexShrink: 0
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
                        type="button"
                        onClick={nextStyle}
                        aria-label="Next Style"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "1px solid #DDD6C8",
                          backgroundColor: "#ffffff",
                          color: "var(--foreground)",
                          display: "grid",
                          placeItems: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          padding: 0,
                          flexShrink: 0
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
                  )}
                </div>

                {/* Styles Horizontal Thumbnail Row with smooth touch scrolling */}
                <div
                  ref={stylesRowRef}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "clamp(10px, 2.2vw, 18px)",
                    overflowX: "auto",
                    padding: "10px 4px",
                    scrollBehavior: "smooth"
                  }}
                  className="no-scrollbar"
                >
                  {styles.map((style, idx) => {
                    const isCurrent = idx === safeIdx;
                    const styleKey = style.styleId || style.id || style.name || idx;
                    return (
                      <button
                        key={styleKey}
                        type="button"
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
                            width: isCurrent ? "60px" : "48px",
                            height: isCurrent ? "60px" : "48px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: isCurrent ? "2px solid var(--primary)" : "1.5px solid #DDD6C8",
                            boxShadow: isCurrent ? "0 4px 14px rgba(85, 104, 50, 0.25)" : "none",
                            transition: "all 0.3s ease",
                            backgroundColor: "#ffffff"
                          }}
                        >
                          {style.img ? (
                            <img
                              src={style.img}
                              alt={style.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                              }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", backgroundColor: "#EAE3D5" }} />
                          )}
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

                {/* Active Style Info & Direct Shop CTA - responsive wrapped */}
                <div
                  className="promise-vow-style-footer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid #EAE3D5",
                    paddingTop: "14px",
                    marginTop: "8px",
                    gap: "12px"
                  }}
                >
                  <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                    {activeStyle.name && (
                      <h4
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "1.12rem",
                          fontWeight: 600,
                          color: "var(--foreground)",
                          margin: 0
                        }}
                      >
                        {activeStyle.name} Style
                      </h4>
                    )}
                    {activeStyle.desc && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--muted-foreground)",
                          margin: "3px 0 0 0",
                          lineHeight: 1.4
                        }}
                      >
                        {activeStyle.desc}
                      </p>
                    )}
                  </div>

                  <Link
                    to={activeStyle.link || `/collections?style=${encodeURIComponent(activeStyle.name || "")}`}
                    className="eyebrow promise-vow-explore-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      backgroundColor: "var(--primary)",
                      color: "#ffffff",
                      padding: "8px 18px",
                      borderRadius: "999px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      transition: "all 0.25s ease",
                      boxShadow: "0 2px 8px rgba(85, 104, 50, 0.3)",
                      textDecoration: "none",
                      flexShrink: 0,
                      whiteSpace: "nowrap"
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
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .promise-vow-grid {
            grid-template-columns: 5fr 7fr !important;
          }
        }
        @media (max-width: 580px) {
          .promise-vow-style-footer {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .promise-vow-explore-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 10px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
