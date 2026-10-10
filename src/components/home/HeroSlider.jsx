import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) return;
        const res = await fetch(`${backendUrl}/Support/GetActiveBanners`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((b) => ({
              img: b.image || "",
              tag: b.tag || "",
              headingLine1: b.headingLine1 || b.title || "",
              headingLine2: b.headingLine2 || "",
              desc: b.description || "",
              buttonText: b.buttonText || "",
              buttonLink: b.buttonLink || "/shop",
              secondaryButtonText: b.secondaryButtonText || "",
              secondaryButtonLink: b.secondaryButtonLink || "/about"
            }));
            setSlides(mapped);
          } else {
            setSlides([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const prevSlide = () => setActive((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setActive((prev) => (prev + 1) % slides.length);

  const cur = slides[active] || slides[0];
  const hasTextContent = Boolean(
    cur.tag || cur.headingLine1 || cur.headingLine2 || cur.desc || cur.buttonText || cur.secondaryButtonText
  );
  const cleanTag = cur.tag ? cur.tag.replace(/^[?✦\s]+/, "").trim() : "";

  return (
    <section className="hero-slider-section">
      {/* Background Image with slow cinematic zoom */}
      {cur.img && (
        <img
          key={cur.img + active}
          src={cur.img}
          alt={cur.headingLine2 || cur.headingLine1 || "Gemora Diam Banner"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
              objectFit: "fill",
            objectPosition: "center",
            animation: "subtlePulse 8s ease-in-out infinite alternate"
          }}
        />
      )}

      {/* Cinematic Vignette Gradient Overlay */}
      {hasTextContent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(16, 23, 13, 0.82) 0%, rgba(16, 23, 13, 0.45) 55%, rgba(10, 14, 8, 0.3) 100%)"
          }}
        />
      )}

      {/* Content Container */}
      {hasTextContent && (
        <div
          className="container-luxury"
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            zIndex: 2
          }}
        >
          <div className="hero-slider-text-box">
            {/* Eyebrow */}
            {cleanTag && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.78rem",
                  letterSpacing: "0.24em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--gold-light)",
                  marginBottom: "14px",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(4px)",
                  padding: "6px 14px",
                  borderRadius: "2px",
                  border: "1px solid rgba(197, 160, 89, 0.35)"
                }}
              >
                <span>✦</span>
                <span>{cleanTag}</span>
              </div>
            )}

            {/* Heading */}
            {(cur.headingLine1 || cur.headingLine2) && (
              <h1 className="hero-slider-heading">
                {cur.headingLine1 && (
                  <span style={{ display: "block" }}>{cur.headingLine1}</span>
                )}
                {cur.headingLine2 ? (
                  <em className="hero-slider-heading-line2">
                    {cur.headingLine2}
                  </em>
                ) : null}
              </h1>
            )}

            {/* Subtitle Description */}
            {cur.desc && (
              <p className="hero-slider-desc">
                {cur.desc}
              </p>
            )}

            {/* Call To Action Buttons */}
            {(cur.buttonText || cur.secondaryButtonText) && (
              <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                {cur.buttonText && (
                  <Link
                    to={cur.buttonLink || "/shop"}
                    className="eyebrow"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 32px",
                      backgroundColor: "var(--primary)",
                      color: "#ffffff",
                      border: "1px solid rgba(197, 160, 89, 0.5)",
                      fontSize: "0.8rem",
                      letterSpacing: "0.2em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
                      transition: "all 0.25s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.35)";
                    }}
                  >
                    <span>{cur.buttonText}</span>
                    <ArrowRight size={16} />
                  </Link>
                )}

                {cur.secondaryButtonText && (
                  <Link
                    to={cur.secondaryButtonLink || "/about"}
                    className="eyebrow"
                    style={{
                      fontSize: "0.8rem",
                      letterSpacing: "0.2em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "#ffffff",
                      textDecoration: "underline",
                      textUnderlineOffset: "6px",
                      textDecorationColor: "var(--gold-light)",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
                  >
                    {cur.secondaryButtonText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prev / Next Slide Chevrons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hero-nav-arrow"
            style={{
              position: "absolute",
              left: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "rgba(22, 30, 18, 0.45)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              zIndex: 3
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(22, 30, 18, 0.45)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hero-nav-arrow"
            style={{
              position: "absolute",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "rgba(22, 30, 18, 0.45)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              zIndex: 3
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(22, 30, 18, 0.45)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slider Pagination Pills */}
      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            zIndex: 3
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === active ? "32px" : "10px",
                height: "6px",
                borderRadius: "3px",
                backgroundColor: i === active ? "var(--gold)" : "rgba(255, 255, 255, 0.4)",
                transition: "all 0.35s ease",
                cursor: "pointer"
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
