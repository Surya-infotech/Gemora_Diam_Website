import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const BRILLIANCE_SCORE = {
  "Very High": 5,
  "High": 4,
  "Medium": 3
};

// Luxury 4-prong ring band mounting SVG
function GoldProngsMount() {
  const pathD = "M16 49 C62 49 98 43 122 42 L178 42 C202 43 238 49 284 49 A11 11 0 0 1 284 71 C238 71 202 77 178 78 L122 78 C98 77 62 71 16 71 A11 11 0 0 1 16 49 Z";

  return (
    <svg viewBox="0 0 300 120" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} aria-hidden="true">
      <defs>
        <linearGradient id="prongs-band-x" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a5a1e" />
          <stop offset="0.18" stopColor="#d6ad55" />
          <stop offset="0.34" stopColor="#fff3cf" />
          <stop offset="0.5" stopColor="#e2bf6c" />
          <stop offset="0.78" stopColor="#b08433" />
          <stop offset="1" stopColor="#5e4416" />
        </linearGradient>
        <linearGradient id="prongs-band-y" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2b1d08" stopOpacity="0.55" />
          <stop offset="0.16" stopColor="#2b1d08" stopOpacity="0.12" />
          <stop offset="0.36" stopColor="#2b1d08" stopOpacity="0" />
          <stop offset="0.64" stopColor="#2b1d08" stopOpacity="0" />
          <stop offset="0.84" stopColor="#2b1d08" stopOpacity="0.12" />
          <stop offset="1" stopColor="#2b1d08" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="prongs-collar" cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fbecc0" />
          <stop offset="0.55" stopColor="#d6ad55" />
          <stop offset="1" stopColor="#7a5a1e" />
        </radialGradient>
        <filter id="prongs-soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <path d={pathD} transform="translate(4, 8)" fill="#3c280f" opacity="0.22" filter="url(#prongs-soft)" />
      <path d={pathD} fill="url(#prongs-band-x)" />
      <path d={pathD} fill="url(#prongs-band-y)" />
      <path
        d="M30 52.5 C70 52.5 102 46.5 124 45.5 L176 45.5 C198 46.5 230 52.5 270 52.5"
        fill="none"
        stroke="#fffaf0"
        strokeOpacity="0.85"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="150" cy="60" r="27" fill="url(#prongs-collar)" />
    </svg>
  );
}

// Precise Diamond Shape Outline Vector SVGs for Dial Ticks
function DiamondVectorIcon({ shape, size = 22, color = "#c5a059" }) {
  const norm = (shape || "").toLowerCase();

  if (norm.includes("round")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <circle cx="12" cy="12" r="9" />
        <polygon points="12,4 19,12 12,20 5,12" strokeWidth="0.8" />
        <line x1="7" y1="7" x2="17" y2="17" strokeWidth="0.8" />
        <line x1="7" y1="17" x2="17" y2="7" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("oval")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <ellipse cx="12" cy="12" rx="7" ry="9.5" />
        <polygon points="12,3 17,12 12,21 7,12" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("cushion")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <polygon points="12,5 19,12 12,19 5,12" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("pear")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <path d="M12 3 C16 9 19 14 19 17 A7 7 0 0 1 5 17 C5 14 8 9 12 3 Z" />
        <polygon points="12,7 16,16 8,16" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("emerald")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <polygon points="6,3 18,3 21,6 21,18 18,21 6,21 3,18 3,6" />
        <polygon points="8,6 16,6 18,8 18,16 16,18 8,18 6,16 6,8" strokeWidth="0.8" />
        <rect x="10" y="8" width="4" height="8" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("princess")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <rect x="4" y="4" width="16" height="16" rx="0.5" />
        <polygon points="12,4 20,12 12,20 4,12" strokeWidth="0.8" />
        <line x1="4" y1="4" x2="20" y2="20" strokeWidth="0.8" />
        <line x1="4" y1="20" x2="20" y2="4" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("radiant")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <polygon points="6,4 18,4 20,6 20,18 18,20 6,20 4,18 4,6" />
        <polygon points="12,6 17,12 12,18 7,12" strokeWidth="0.8" />
        <line x1="4" y1="6" x2="20" y2="18" strokeWidth="0.7" />
        <line x1="4" y1="18" x2="20" y2="6" strokeWidth="0.7" />
      </svg>
    );
  }
  if (norm.includes("marquise")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <path d="M12 2 C18 7 21 12 12 22 C3 12 6 7 12 2 Z" />
        <polygon points="12,6 16,12 12,18 8,12" strokeWidth="0.8" />
      </svg>
    );
  }
  if (norm.includes("asscher")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
        <polygon points="7,4 17,4 20,7 20,17 17,20 7,20 4,17 4,7" />
        <polygon points="9,6 15,6 17,8 17,16 15,18 9,18 7,16 7,8" strokeWidth="0.8" />
        <rect x="9.5" y="9.5" width="5" height="5" strokeWidth="0.8" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3">
      <polygon points="6,3 18,3 22,9 12,21 2,9" />
      <polygon points="12,3 17,9 12,21 7,9" strokeWidth="0.8" />
      <line x1="2" y1="9" x2="22" y2="9" strokeWidth="0.8" />
    </svg>
  );
}

export default function ShopByShapeSection() {
  const [data, setData] = useState(null);
  const [activeState, setActiveState] = useState({ index: 0, rotation: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [sparkleKey, setSparkleKey] = useState(0);

  const containerRef = useRef(null);

  // Fetch dynamic section data & images strictly from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchSection = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) return;
        const res = await fetch(`${backendUrl}/Support/GetActiveShapeSection`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json && json.status !== false && Array.isArray(json.shapes) && json.shapes.length > 0) {
            setData(json);
          }
        }
      } catch (err) {
        console.warn("Error fetching shape section from backend:", err);
      }
    };
    fetchSection();
    return () => {
      isMounted = false;
    };
  }, []);

  const shapes = data?.shapes || [];
  const count = shapes.length;
  const stepAngle = count > 0 ? 360 / count : 36;
  const activeShape = shapes[activeState.index] || shapes[0] || null;
  const brillianceScore = activeShape ? (BRILLIANCE_SCORE[activeShape.brilliance] || 5) : 5;

  // Rotate dial to a specific shape index
  const selectShape = useCallback(
    (targetIndex) => {
      if (count === 0) return;
      setSparkleKey((prev) => prev + 1);
      setActiveState((prev) => {
        let diff = ((targetIndex - prev.index) % count + count) % count;
        if (diff > count / 2) diff -= count;
        return {
          index: targetIndex,
          rotation: prev.rotation - diff * stepAngle
        };
      });
    },
    [count, stepAngle]
  );

  const nextShape = useCallback(() => {
    if (count <= 1) return;
    selectShape((activeState.index + 1) % count);
  }, [activeState.index, count, selectShape]);

  const prevShape = useCallback(() => {
    if (count <= 1) return;
    selectShape((activeState.index - 1 + count) % count);
  }, [activeState.index, count, selectShape]);

  // Autoplay rotation every 6 seconds when not hovered
  useEffect(() => {
    if (isHovered || count <= 1) return;
    const interval = setInterval(() => {
      nextShape();
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, count, nextShape]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextShape();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevShape();
    }
  };

  // Guard check: ensure we have at least one active shape
  if (!data || shapes.length === 0 || !activeShape) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        backgroundColor: "#ffffff",
        padding: "60px 0 80px 0",
        outline: "none"
      }}
    >
      <div className="container-luxury">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "40px", padding: "0 16px" }}>
          {data.headerEyebrow && (
            <p
              className="eyebrow"
              style={{
                color: "var(--gold-deep)",
                marginBottom: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ height: "1px", width: "20px", backgroundColor: "var(--gold)" }} />
              {data.headerEyebrow}
              <span style={{ height: "1px", width: "20px", backgroundColor: "var(--gold)" }} />
            </p>
          )}
          {data.headerTitle && (
            <h2
              style={{
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                fontWeight: 500,
                color: "#181818",
                lineHeight: 1.15,
                margin: "4px 0 12px 0"
              }}
            >
              {data.headerTitle}
            </h2>
          )}
          {data.headerDescription && (
            <p
              style={{
                fontSize: "clamp(13px, 1.4vw, 15px)",
                color: "#666666",
                maxWidth: "560px",
                margin: "0 auto",
                lineHeight: 1.6
              }}
            >
              {data.headerDescription}
            </p>
          )}
        </div>

        {/* Main Sand Container */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "relative",
            backgroundColor: "#f5f0e8",
            backgroundImage: "linear-gradient(135deg, #fbf8f3 0%, #f1e8da 45%, #e8dcce 100%)",
            borderRadius: "28px",
            padding: "clamp(16px, 3.5vw, 42px)",
            boxShadow: "0 10px 35px rgba(60, 40, 15, 0.08)",
            border: "1px solid rgba(220, 205, 185, 0.6)",
            overflow: "hidden"
          }}
        >
          {/* Subtle Ambient Radial Light Overlays */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-80px",
              left: "-80px",
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212, 175, 95, 0.28), transparent 65%)",
              pointerEvents: "none",
              zIndex: 0
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-120px",
              left: "15%",
              width: "460px",
              height: "460px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(180, 138, 70, 0.18), transparent 65%)",
              pointerEvents: "none",
              zIndex: 0
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              alignItems: "center",
              gap: "clamp(24px, 3.5vw, 48px)"
            }}
            className="shape-section-grid"
          >
            {/* COLUMN 1: "Design your ring" Workflow & CTA */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {data.designEyebrow && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--gold-deep)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    marginBottom: "8px"
                  }}
                >
                  <span style={{ display: "inline-block", width: "20px", height: "1px", backgroundColor: "var(--gold)" }} />
                  {data.designEyebrow}
                  <span style={{ display: "inline-block", width: "20px", height: "1px", backgroundColor: "var(--gold)" }} />
                </div>
              )}

              <h3
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.6rem)",
                  fontWeight: 500,
                  color: "#181818",
                  lineHeight: 1.1,
                  margin: "4px 0 12px 0"
                }}
              >
                {data.designTitle}
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#555555",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                  maxWidth: "420px"
                }}
              >
                {data.designDescription}
              </p>

              {/* 3 Step Cards */}
              {(data.step1Title || data.step2Title || data.step3Title) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                    marginBottom: "28px"
                  }}
                  className="shape-steps-grid"
                >
                  {/* Step 1 */}
                  {data.step1Title && (
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "14px",
                        padding: "14px 12px",
                        boxShadow: "0 2px 8px rgba(60, 40, 15, 0.05)",
                        border: "1px solid rgba(225, 210, 190, 0.5)",
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 18px rgba(60, 40, 15, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(60, 40, 15, 0.05)";
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "2.5px",
                          background: "linear-gradient(to right, var(--gold), transparent)"
                        }}
                      />
                      {data.step1Num && (
                        <span
                          style={{
                            display: "block",
                            fontFamily: "var(--font-serif)",
                            fontSize: "17px",
                            fontWeight: 700,
                            color: "var(--gold-deep)"
                          }}
                        >
                          {data.step1Num}
                        </span>
                      )}
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#181818",
                          lineHeight: 1.25,
                          marginTop: "2px"
                        }}
                      >
                        {data.step1Title}
                      </span>
                      {data.step1Desc && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#666666",
                            lineHeight: 1.4,
                            marginTop: "6px",
                            margin: 0
                          }}
                        >
                          {data.step1Desc}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Step 2 */}
                  {data.step2Title && (
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "14px",
                        padding: "14px 12px",
                        boxShadow: "0 2px 8px rgba(60, 40, 15, 0.05)",
                        border: "1px solid rgba(225, 210, 190, 0.5)",
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 18px rgba(60, 40, 15, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(60, 40, 15, 0.05)";
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "2.5px",
                          background: "linear-gradient(to right, var(--gold), transparent)"
                        }}
                      />
                      {data.step2Num && (
                        <span
                          style={{
                            display: "block",
                            fontFamily: "var(--font-serif)",
                            fontSize: "17px",
                            fontWeight: 700,
                            color: "var(--gold-deep)"
                          }}
                        >
                          {data.step2Num}
                        </span>
                      )}
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#181818",
                          lineHeight: 1.25,
                          marginTop: "2px"
                        }}
                      >
                        {data.step2Title}
                      </span>
                      {data.step2Desc && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#666666",
                            lineHeight: 1.4,
                            marginTop: "6px",
                            margin: 0
                          }}
                        >
                          {data.step2Desc}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Step 3 */}
                  {data.step3Title && (
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "14px",
                        padding: "14px 12px",
                        boxShadow: "0 2px 8px rgba(60, 40, 15, 0.05)",
                        border: "1px solid rgba(225, 210, 190, 0.5)",
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 18px rgba(60, 40, 15, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(60, 40, 15, 0.05)";
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "2.5px",
                          background: "linear-gradient(to right, var(--gold), transparent)"
                        }}
                      />
                      {data.step3Num && (
                        <span
                          style={{
                            display: "block",
                            fontFamily: "var(--font-serif)",
                            fontSize: "17px",
                            fontWeight: 700,
                            color: "var(--gold-deep)"
                          }}
                        >
                          {data.step3Num}
                        </span>
                      )}
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#181818",
                          lineHeight: 1.25,
                          marginTop: "2px"
                        }}
                      >
                        {data.step3Title}
                      </span>
                      {data.step3Desc && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#666666",
                            lineHeight: 1.4,
                            marginTop: "6px",
                            margin: 0
                          }}
                        >
                          {data.step3Desc}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {(data.primaryBtnText || data.secondaryBtnText) && (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {data.primaryBtnText && (
                    <Link
                      to={data.primaryBtnLink || "/collections"}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "var(--primary)",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "12px 24px",
                        borderRadius: "999px",
                        boxShadow: "0 4px 14px rgba(85, 104, 50, 0.35)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                        e.currentTarget.style.transform = "translateY(-1.5px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--primary)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {data.primaryBtnText}
                      <ArrowRight size={14} />
                    </Link>
                  )}

                  {data.secondaryBtnText && (
                    <Link
                      to={data.secondaryBtnLink || "/contact"}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "transparent",
                        color: "#181818",
                        border: "1px solid rgba(24, 24, 24, 0.4)",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "12px 24px",
                        borderRadius: "999px",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#181818";
                        e.currentTarget.style.backgroundColor = "#181818";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(24, 24, 24, 0.4)";
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#181818";
                      }}
                    >
                      {data.secondaryBtnText}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* COLUMN 2: Interactive Shape Selector Dial Wheel */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                minHeight: "440px"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "min(360px, calc(100vw - 64px), 100%)",
                  height: "min(360px, calc(100vw - 64px), 100%)",
                  aspectRatio: "1 / 1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* 1. Outer White Circle Disk */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 18px 45px -10px rgba(60, 40, 15, 0.22)",
                    border: "1px solid rgba(212, 175, 95, 0.25)"
                  }}
                />

                {/* 2. Inner Cutout Circle */}
                <div
                  style={{
                    position: "absolute",
                    width: "66%",
                    height: "66%",
                    borderRadius: "50%",
                    backgroundColor: "#faf7f2",
                    boxShadow: "inset 0 3px 14px rgba(60, 40, 15, 0.08)",
                    border: "1px solid rgba(212, 175, 95, 0.3)",
                    zIndex: 1
                  }}
                />

                {/* 3. Rotating Dial containing SVG tick marks and backend shapes */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `rotate(${activeState.rotation}deg)`,
                    transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
                    pointerEvents: "none"
                  }}
                >
                  {/* Luxury SVG Ticks around circumference */}
                  <svg
                    viewBox="0 0 100 100"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                    aria-hidden="true"
                  >
                    {Array.from({ length: 60 }).map((_, a) => {
                      const deg = 6 * a;
                      const isMain = deg % stepAngle === 0;
                      const rad = (deg * Math.PI) / 180;
                      const r1 = isMain ? 47.0 : 48.3;
                      const r2 = 49.3;
                      return (
                        <line
                          key={a}
                          x1={(50 + r1 * Math.cos(rad)).toFixed(3)}
                          y1={(50 + r1 * Math.sin(rad)).toFixed(3)}
                          x2={(50 + r2 * Math.cos(rad)).toFixed(3)}
                          y2={(50 + r2 * Math.sin(rad)).toFixed(3)}
                          stroke={isMain ? "var(--gold)" : "rgba(24, 24, 24, 0.18)"}
                          strokeWidth={isMain ? "0.45" : "0.2"}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>

                  {/* Diamond Shape Icons placed around dial rim (All URLs from backend) */}
                  {shapes.map((s, idx) => {
                    const isSelected = idx === activeState.index;
                    const rad = (idx * stepAngle * Math.PI) / 180;
                    const rDistPercent = 41.5;
                    const cosVal = Math.cos(rad);
                    const sinVal = Math.sin(rad);

                    return (
                      <div
                        key={s._id || s.shapeid || idx}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: `translate(-50%, -50%) translate(${cosVal * rDistPercent * 3.9}px, ${sinVal * rDistPercent * 3.9}px)`,
                          pointerEvents: "auto",
                          zIndex: 4
                        }}
                      >
                        {/* Counter-rotate icon so diamond cut stays upright */}
                        <div
                          style={{
                            transform: `rotate(${-activeState.rotation}deg)`,
                            transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)"
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => selectShape(idx)}
                            aria-label={`Select ${s.name}`}
                            title={s.name}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              background: isSelected ? "transparent" : "#ffffff",
                              border: isSelected ? "none" : "1px solid rgba(220, 200, 175, 0.6)",
                              boxShadow: isSelected ? "none" : "0 2px 6px rgba(0,0,0,0.06)",
                              opacity: isSelected ? 0 : 1,
                              transform: isSelected ? "scale(0.5)" : "scale(1)",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              padding: "4px"
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.transform = "scale(1.18)";
                                e.currentTarget.style.borderColor = "var(--gold)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.borderColor = "rgba(220, 200, 175, 0.6)";
                              }
                            }}
                          >
                            {s.shapeIcon ? (
                              <img
                                src={s.shapeIcon}
                                alt={s.name}
                                style={{ width: "24px", height: "24px", objectFit: "contain" }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <DiamondVectorIcon shape={s.name} size={22} color="#c5a059" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 4. Active Shape Ring Prongs Graphic at 3 o'clock position */}
                <div
                  style={{
                    position: "absolute",
                    right: "-12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "72px",
                    height: "32px",
                    zIndex: 6,
                    pointerEvents: "none"
                  }}
                >
                  <GoldProngsMount />

                  {/* Active diamond seated on prongs with sparkle */}
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "36px",
                      height: "36px",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    {activeShape.shapeIcon ? (
                      <img
                        key={`${activeShape.shapeid || activeShape.name}-active`}
                        src={activeShape.shapeIcon}
                        alt={activeShape.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "contain",
                          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
                          animation: "shapeGleam 0.6s ease-out"
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <DiamondVectorIcon shape={activeShape.name} size={30} color="#d4af37" />
                    )}

                    {/* Sparkle Burst animation */}
                    <div
                      key={`sparkle-${sparkleKey}`}
                      style={{
                        position: "absolute",
                        inset: "-6px",
                        pointerEvents: "none",
                        animation: "sparkleBurst 0.7s ease-out forwards"
                      }}
                    >
                      <Sparkles
                        size={18}
                        style={{
                          color: "var(--gold)",
                          position: "absolute",
                          top: "-4px",
                          right: "-4px"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Center Information Display */}
                <div
                  style={{
                    position: "absolute",
                    zIndex: 5,
                    width: "56%",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "auto",
                    padding: "0 8px"
                  }}
                >
                  <h4
                    key={`${activeShape.shapeid || activeShape.name}-name`}
                    style={{
                      fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)",
                      fontFamily: "var(--font-serif)",
                      fontWeight: 600,
                      color: "#181818",
                      lineHeight: 1.1,
                      margin: "0 0 2px 0",
                      animation: "fadeInUp 0.35s ease-out"
                    }}
                  >
                    {activeShape.name}
                  </h4>

                  {activeShape.tagline && (
                    <p
                      key={`${activeShape.shapeid || activeShape.name}-tagline`}
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "12px",
                        color: "#555555",
                        margin: "0 0 8px 0",
                        lineHeight: 1.3,
                        animation: "fadeInUp 0.4s ease-out"
                      }}
                    >
                      {activeShape.tagline}
                    </p>
                  )}

                  {activeShape.description && (
                    <p
                      key={`${activeShape.shapeid || activeShape.name}-desc`}
                      style={{
                        fontSize: "11px",
                        color: "#666666",
                        lineHeight: 1.35,
                        margin: "0 0 10px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {activeShape.description}
                    </p>
                  )}

                  {/* Specifications (Best For | Brilliance) */}
                  {(activeShape.bestFor || activeShape.brilliance) && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "14px",
                        marginBottom: "12px",
                        textAlign: "left"
                      }}
                    >
                      {activeShape.bestFor && (
                        <div>
                          <span
                            style={{
                              fontSize: "8.5px",
                              fontWeight: 700,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--gold-deep)",
                              display: "block"
                            }}
                          >
                            BEST FOR
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#181818",
                              fontFamily: "var(--font-serif)",
                              display: "block",
                              lineHeight: 1.2
                            }}
                          >
                            {activeShape.bestFor}
                          </span>
                        </div>
                      )}

                      {activeShape.bestFor && activeShape.brilliance && (
                        <div style={{ width: "1px", height: "20px", backgroundColor: "rgba(0,0,0,0.12)" }} />
                      )}

                      {activeShape.brilliance && (
                        <div>
                          <span
                            style={{
                              fontSize: "8.5px",
                              fontWeight: 700,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--gold-deep)",
                              display: "block"
                            }}
                          >
                            BRILLIANCE
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#181818",
                              fontFamily: "var(--font-serif)",
                              display: "block",
                              lineHeight: 1.2
                            }}
                          >
                            {activeShape.brilliance}
                          </span>
                          {/* 5-pip brilliance meter */}
                          <div style={{ display: "flex", gap: "2px", marginTop: "2px", width: "48px" }}>
                            {[1, 2, 3, 4, 5].map((pip) => (
                              <div
                                key={pip}
                                style={{
                                  flex: 1,
                                  height: "2px",
                                  borderRadius: "2px",
                                  backgroundColor: pip <= brillianceScore ? "var(--gold-deep)" : "rgba(0,0,0,0.18)"
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Center Controls: [<] [ SHOP NOW -> ] [>] */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={prevShape}
                      aria-label="Previous diamond shape"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: "1px solid rgba(0,0,0,0.2)",
                        display: "grid",
                        placeItems: "center",
                        color: "#181818",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#181818";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.color = "#181818";
                      }}
                    >
                      <ChevronLeft size={14} />
                    </button>

                    <Link
                      to={activeShape.buttonLink || `/collections?shape=${activeShape.shapeid || activeShape.name.toLowerCase()}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#181818",
                        color: "#ffffff",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "6px 14px",
                        borderRadius: "999px",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--gold-deep)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#181818";
                      }}
                    >
                      SHOP NOW
                      <ArrowRight size={11} />
                    </Link>

                    <button
                      type="button"
                      onClick={nextShape}
                      aria-label="Next diamond shape"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: "1px solid rgba(0,0,0,0.2)",
                        display: "grid",
                        placeItems: "center",
                        color: "#181818",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#181818";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.color = "#181818";
                      }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Right Showcase Card (Model Hand Ring Photo from backend) */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  backgroundColor: "#ffffff",
                  borderRadius: "22px",
                  padding: "16px",
                  boxShadow: "0 18px 45px -12px rgba(60, 40, 15, 0.18)",
                  border: "1px solid rgba(220, 200, 175, 0.45)",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 24px 50px -12px rgba(60, 40, 15, 0.24)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 18px 45px -12px rgba(60, 40, 15, 0.18)";
                }}
              >
                {/* Photo container with zoom on hover */}
                <Link
                  to={activeShape.buttonLink || `/collections?shape=${activeShape.shapeid || activeShape.name.toLowerCase()}`}
                  style={{
                    display: "block",
                    aspectRatio: "1/1",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "#f5f0e8",
                    position: "relative"
                  }}
                >
                  {activeShape.showcaseImage ? (
                    <img
                      key={activeShape.showcaseImage}
                      src={activeShape.showcaseImage}
                      alt={activeShape.showcaseTitle || `${activeShape.name} Diamond Ring`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                        transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                        animation: "fadeIn 0.4s ease-out"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#999", fontSize: "12px" }}>
                      No image available
                    </div>
                  )}
                </Link>

                {/* Card Footer details */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "14px",
                    padding: "0 4px"
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--gold-deep)"
                      }}
                    >
                      {activeShape.name.toUpperCase()} CUT
                    </span>
                    <h5
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#181818",
                        margin: "2px 0 0 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                      title={activeShape.showcaseTitle || activeShape.name}
                    >
                      {activeShape.showcaseTitle || activeShape.name}
                    </h5>
                  </div>

                  <Link
                    to={activeShape.buttonLink || `/collections?shape=${activeShape.shapeid || activeShape.name.toLowerCase()}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "var(--primary)",
                      color: "#ffffff",
                      fontSize: "9.5px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "8px 16px",
                      borderRadius: "999px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(85, 104, 50, 0.3)",
                      transition: "all 0.3s ease"
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
                    SHOP {activeShape.name.toUpperCase()}
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shapeGleam {
          0% {
            opacity: 0;
            transform: scale(0.6) rotate(-15deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes sparkleBurst {
          0% {
            transform: scale(0.4) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: scale(1.4) rotate(90deg);
            opacity: 0;
          }
        }

        @media (max-width: 1200px) and (min-width: 992px) {
          .shape-steps-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }
        }

        @media (max-width: 991px) {
          .shape-steps-grid {
            grid-template-columns: 1fr !important;
          }
          .shape-section-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
