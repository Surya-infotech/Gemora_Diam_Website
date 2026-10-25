import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Gesture tracking refs
  const startX = useRef(0);
  const startY = useRef(0);
  const currentDeltaX = useRef(0);
  const dragStartTime = useRef(0);
  const hasMovedEnough = useRef(false);
  const isHorizontalGesture = useRef(null);
  const isPointerActive = useRef(false);
  const lastWheelTime = useRef(0);
  const autoPlayTimer = useRef(null);

  // Fetch banners from backend only
  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) return;
        const res = await fetch(`${backendUrl}/Support/GetActiveBanners`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.value)
              ? data.value
              : [];
          if (isMounted && list.length > 0) {
            const mapped = list.map((b) => ({
              img: b.image || "",
              tag: b.tag || "Signature Collection",
              headingLine1: b.headingLine1 || b.title || "",
              headingLine2: b.headingLine2 || "",
              desc: b.description || "",
              buttonText: b.buttonText || "Explore Collection",
              buttonLink: b.buttonLink || "/collections",
              secondaryButtonText: b.secondaryButtonText || "",
              secondaryButtonLink: b.secondaryButtonLink || "/about"
            }));
            setSlides(mapped);
          }
        }
      } catch (err) {
        console.warn("Error fetching hero slides:", err);
      }
    };

    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = slides.length;

  const prevSlide = useCallback(() => {
    setActive((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const nextSlide = useCallback(() => {
    setActive((prev) => (prev + 1) % total);
  }, [total]);

  // Auto-play timer
  useEffect(() => {
    if (total <= 1 || isPaused || isDragging) return;
    autoPlayTimer.current = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 6500);
    return () => clearInterval(autoPlayTimer.current);
  }, [total, isPaused, isDragging]);

  // Touch Handlers for mobile swipe & scroll
  const handleTouchStart = (e) => {
    if (total <= 1) return;
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    currentDeltaX.current = 0;
    dragStartTime.current = Date.now();
    hasMovedEnough.current = false;
    isHorizontalGesture.current = null;
    isPointerActive.current = true;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isPointerActive.current || total <= 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;

    // Detect if movement is primarily horizontal or vertical
    if (isHorizontalGesture.current === null) {
      if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
        if (Math.abs(dy) >= Math.abs(dx)) {
          // Primarily vertical scroll: let standard page scroll take over
          isHorizontalGesture.current = false;
          isPointerActive.current = false;
          setIsDragging(false);
          setDragOffset(0);
          return;
        } else {
          isHorizontalGesture.current = true;
        }
      }
    }

    if (isHorizontalGesture.current) {
      if (e.cancelable) e.preventDefault();
      currentDeltaX.current = dx;
      if (Math.abs(dx) > 10) {
        hasMovedEnough.current = true;
      }
      let offset = dx;
      if ((active === 0 && dx > 0) || (active === total - 1 && dx < 0)) {
        offset = dx * 0.38;
      }
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!isPointerActive.current) return;
    isPointerActive.current = false;
    setIsDragging(false);

    const dx = currentDeltaX.current;
    const duration = Math.max(1, Date.now() - dragStartTime.current);
    const velocity = Math.abs(dx) / duration;
    const swipeThreshold = 45;

    if (dx < -swipeThreshold || (dx < -15 && velocity > 0.3)) {
      nextSlide();
    } else if (dx > swipeThreshold || (dx > 15 && velocity > 0.3)) {
      prevSlide();
    }
    setDragOffset(0);
    currentDeltaX.current = 0;
  };

  // Mouse Drag Handlers (for DevTools mobile mode and desktop mouse swipe)
  const handleMouseDown = (e) => {
    if (e.button !== 0 || total <= 1) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    currentDeltaX.current = 0;
    dragStartTime.current = Date.now();
    hasMovedEnough.current = false;
    isHorizontalGesture.current = true;
    isPointerActive.current = true;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isPointerActive.current || !isHorizontalGesture.current) return;
    const dx = e.clientX - startX.current;
    currentDeltaX.current = dx;
    if (Math.abs(dx) > 8) {
      hasMovedEnough.current = true;
    }
    let offset = dx;
    if ((active === 0 && dx > 0) || (active === total - 1 && dx < 0)) {
      offset = dx * 0.38;
    }
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isPointerActive.current) return;
    isPointerActive.current = false;
    setIsDragging(false);

    const dx = currentDeltaX.current;
    const duration = Math.max(1, Date.now() - dragStartTime.current);
    const velocity = Math.abs(dx) / duration;
    const swipeThreshold = 45;

    if (dx < -swipeThreshold || (dx < -15 && velocity > 0.3)) {
      nextSlide();
    } else if (dx > swipeThreshold || (dx > 15 && velocity > 0.3)) {
      prevSlide();
    }
    setDragOffset(0);
    currentDeltaX.current = 0;
  };

  // Wheel & trackpad scroll detection ("scroll the banner")
  const handleWheel = (e) => {
    if (total <= 1) return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 18;
    const isShiftScroll = e.shiftKey && Math.abs(e.deltaY) > 18;

    if (isHorizontal || isShiftScroll) {
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      const now = Date.now();
      if (now - lastWheelTime.current > 420) {
        lastWheelTime.current = now;
        if (delta > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
  };

  // Prevent link click when dragged
  const handleLinkClick = (e) => {
    if (hasMovedEnough.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section
      className="hero-slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        if (isPointerActive.current) handleMouseUp();
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      aria-label="Featured Collections"
      style={{
        position: "relative",
        height: "clamp(520px, 78vh, 820px)",
        overflow: "hidden",
        backgroundColor: "#11160e",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: isDragging ? "none" : "auto",
        WebkitUserSelect: isDragging ? "none" : "auto",
        touchAction: "pan-y"
      }}
    >
      {/* Sliding Track for banner slides */}
      <div
        className="hero-slider-track"
        style={{
          display: "flex",
          width: `${total * 100}%`,
          height: "100%",
          transform: `translateX(calc(-${(active * 100) / total}% + ${dragOffset}px))`,
          transition: isDragging ? "none" : "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform"
        }}
      >
        {slides.map((s, idx) => {
          const isCurrent = idx === active;
          const cleanTag = s?.tag ? s.tag.replace(/^[?✦\s]+/, "").trim() : "";

          return (
            <div
              key={idx}
              className="hero-slide-pane"
              style={{
                position: "relative",
                width: `${100 / total}%`,
                height: "100%",
                flexShrink: 0,
                overflow: "hidden"
              }}
            >
              {/* Background Image with slow cinematic zoom */}
              {s.img && (
                <img
                  src={s.img}
                  alt={s.headingLine2 || s.headingLine1 || "Gemora Diam Banner"}
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    objectPosition: "center",
                    pointerEvents: "none",
                    transform: isCurrent ? "scale(1.03)" : "scale(1)",
                    transition: "transform 8s ease-out"
                  }}
                />
              )}

              {/* Cinematic Vignette Gradient Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(12, 17, 10, 0.25) 0%, rgba(17, 23, 14, 0.6) 45%, rgba(17, 23, 14, 0.92) 100%)",
                  pointerEvents: "none"
                }}
              />

              {/* Content Container */}
              <div
                className="container-luxury"
                style={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  zIndex: 2,
                  paddingTop: "20px",
                  paddingBottom: "60px"
                }}
              >
                <div style={{ maxWidth: "680px", color: "#ffffff" }}>
                  {/* Eyebrow */}
                  {cleanTag && (
                    <p
                      className="eyebrow"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.74rem",
                        letterSpacing: "0.28em",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        color: "var(--gold-light)",
                        marginBottom: "16px"
                      }}
                    >
                      <span style={{ width: "24px", height: "1px", backgroundColor: "var(--gold)" }} />
                      {cleanTag}
                    </p>
                  )}

                  {/* Heading with Italic Champagne Accent */}
                  <h1
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.85rem, 5vw, 3.8rem)",
                      fontWeight: 400,
                      lineHeight: 1.14,
                      color: "#ffffff",
                      margin: "0 0 16px 0",
                      letterSpacing: "-0.01em",
                      textShadow: "0 2px 24px rgba(0, 0, 0, 0.5)"
                    }}
                  >
                    {s.headingLine1}{" "}
                    {s.headingLine2 && (
                      <em
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontStyle: "italic",
                          fontWeight: 400,
                          color: "var(--gold-light)"
                        }}
                      >
                        {s.headingLine2}
                      </em>
                    )}
                  </h1>

                  {/* Subtitle Description */}
                  {s.desc && (
                    <p
                      style={{
                        fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)",
                        lineHeight: 1.65,
                        color: "rgba(255, 255, 255, 0.88)",
                        maxWidth: "540px",
                        marginBottom: "28px",
                        fontWeight: 300,
                        textShadow: "0 1px 12px rgba(0, 0, 0, 0.4)"
                      }}
                    >
                      {s.desc}
                    </p>
                  )}

                  {/* Call To Action Pill Buttons */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {s.buttonText && (
                      <Link
                        to={s.buttonLink || "/collections"}
                        onClick={handleLinkClick}
                        className="btn-pill-primary"
                        style={{
                          textDecoration: "none"
                        }}
                      >
                        <span>{s.buttonText}</span>
                        <ArrowRight size={15} />
                      </Link>
                    )}

                    {s.secondaryButtonText && (
                      <Link
                        to={s.secondaryButtonLink || "/about"}
                        onClick={handleLinkClick}
                        className="btn-pill-ghost-light"
                        style={{
                          textDecoration: "none"
                        }}
                      >
                        {s.secondaryButtonText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Slide Chevrons */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous Slide"
            className="hero-nav-arrow"
            style={{
              position: "absolute",
              left: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(18, 25, 15, 0.45)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.25s",
              zIndex: 3
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(18, 25, 15, 0.45)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next Slide"
            className="hero-nav-arrow"
            style={{
              position: "absolute",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(18, 25, 15, 0.45)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.25s",
              zIndex: 3
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(18, 25, 15, 0.45)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
            }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Slide Indicator Buttons (Clean design, proper sizing, no square boxes) */}
      {total > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 3
          }}
        >
          {slides.map((_, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  border: "none",
                  background: "transparent",
                  padding: "8px 3px",
                  margin: 0,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "none"
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: isActive ? "38px" : "16px",
                    height: "3px",
                    borderRadius: "2px",
                    backgroundColor: isActive ? "var(--gold)" : "rgba(255, 255, 255, 0.35)",
                    boxShadow: isActive ? "0 0 8px rgba(212, 175, 55, 0.6)" : "none",
                    transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}