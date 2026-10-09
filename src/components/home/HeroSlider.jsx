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

  return (
    <section
      style={{
        position: "relative",
        height: "88vh",
        minHeight: "620px",
        maxHeight: "860px",
        overflow: "hidden",
        backgroundColor: "#181818"
      }}
    >
      {/* Background Image with smooth fade */}
      {cur.img && (
        <img
          src={cur.img}
          alt={cur.headingLine2 || cur.headingLine1 || "Gemora Diam Banner"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "opacity 0.8s ease-in-out, transform 8s ease-out",
            transform: "scale(1.03)"
          }}
        />
      )}

      {/* Dark Subtle Vignette Gradient Overlay */}
      {hasTextContent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%)"
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
            justifyContent: "space-between"
          }}
        >
          <div style={{ maxWidth: "640px", color: "#ffffff", paddingLeft: "10px" }}>
            {/* Eyebrow */}
            {cur.tag && (
              <span
                style={{
                  fontSize: "0.85rem",
                  letterSpacing: "0.22em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#ffffff",
                  display: "inline-block",
                  marginBottom: "16px"
                }}
              >
                {cur.tag}
              </span>
            )}

            {/* Heading */}
            {(cur.headingLine1 || cur.headingLine2) && (
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  lineHeight: 1.08,
                  color: "#ffffff",
                  margin: "0 0 24px 0",
                  letterSpacing: "0.02em"
                }}
              >
                {cur.headingLine1}
                {cur.headingLine2 ? (
                  <>
                    {" "}
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 400 }}>{cur.headingLine2}</em>
                  </>
                ) : null}
              </h1>
            )}

            {/* Subtitle */}
            {cur.desc && (
              <p
                style={{
                  fontSize: "0.98rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.9)",
                  maxWidth: "520px",
                  marginBottom: "36px"
                }}
              >
                {cur.desc}
              </p>
            )}

            {/* Buttons */}
            {(cur.buttonText || cur.secondaryButtonText) && (
              <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                {cur.buttonText && (
                  <Link
                    to={cur.buttonLink || "/shop"}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "16px 36px",
                      backgroundColor: "rgba(24, 24, 24, 0.9)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.4)",
                      fontSize: "0.82rem",
                      letterSpacing: "0.18em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.borderColor = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(24, 24, 24, 0.9)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                    }}
                  >
                    {cur.buttonText} <ArrowRight size={16} />
                  </Link>
                )}

                {cur.secondaryButtonText && (
                  <Link
                    to={cur.secondaryButtonLink || "/about"}
                    style={{
                      fontSize: "0.82rem",
                      letterSpacing: "0.18em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "#ffffff",
                      textDecoration: "underline",
                      textUnderlineOffset: "6px"
                    }}
                  >
                    {cur.secondaryButtonText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prev / Next Slide Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            style={{
              position: "absolute",
              left: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            style={{
              position: "absolute",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slider Pagination Dots */}
      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px"
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === active ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: i === active ? "var(--primary)" : "rgba(255,255,255,0.5)",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
