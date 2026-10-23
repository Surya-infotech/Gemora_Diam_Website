import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const DEFAULT_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2000&auto=format&fit=crop",
    tag: "Handcrafted Fine Jewelry",
    headingLine1: "Handcrafted for",
    headingLine2: "your forever",
    desc: "Engagement rings and wedding bands set with certified lab-grown diamonds and finished by hand to be worn for a lifetime.",
    buttonText: "Shop Engagement Rings",
    buttonLink: "/collections?category=Engagement+Rings",
    secondaryButtonText: "Shop Wedding Bands",
    secondaryButtonLink: "/collections?category=Wedding+Bands"
  },
  {
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2000&auto=format&fit=crop",
    tag: "Bespoke Atelier Collection",
    headingLine1: "Pure brilliance.",
    headingLine2: "Zero compromise.",
    desc: "Each diamond is masterfully cut for exceptional fire and set in 100% recycled gold or platinum.",
    buttonText: "Explore Solitaires",
    buttonLink: "/collections",
    secondaryButtonText: "Book an Appointment",
    secondaryButtonLink: "/contact"
  },
  {
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2000&auto=format&fit=crop",
    tag: "The Vows & Beyond",
    headingLine1: "Two rings.",
    headingLine2: "One forever.",
    desc: "Sculpted with continuous brilliance to celebrate your milestone moments and everlasting love.",
    buttonText: "Discover Eternity Bands",
    buttonLink: "/collections?category=Wedding+Bands",
    secondaryButtonText: "Design Your Ring",
    secondaryButtonLink: "/collections"
  }
];

export default function HeroSlider() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
              tag: b.tag || "Atelier Collection",
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
        console.warn("Using curated luxury hero slides:", err);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const prevSlide = () => setActive((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setActive((prev) => (prev + 1) % slides.length);

  const cur = slides[active] || slides[0];
  const cleanTag = cur.tag ? cur.tag.replace(/^[?✦\s]+/, "").trim() : "";

  return (
    <section
      className="hero-slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Collections"
      style={{
        position: "relative",
        height: "clamp(520px, 78vh, 820px)",
        overflow: "hidden",
        backgroundColor: "#11160e"
      }}
    >
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
            objectFit: "cover",
            objectPosition: "center",
            animation: "subtlePulse 8s ease-in-out infinite alternate"
          }}
        />
      )}

      {/* Cinematic Vignette Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(12, 17, 10, 0.25) 0%, rgba(17, 23, 14, 0.6) 45%, rgba(17, 23, 14, 0.92) 100%)"
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
              fontSize: "clamp(2.3rem, 4.6vw, 3.8rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#ffffff",
              margin: "0 0 16px 0",
              letterSpacing: "-0.01em",
              textShadow: "0 2px 24px rgba(0, 0, 0, 0.5)"
            }}
          >
            {cur.headingLine1}{" "}
            {cur.headingLine2 && (
              <em
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--gold-light)"
                }}
              >
                {cur.headingLine2}
              </em>
            )}
          </h1>

          {/* Subtitle Description */}
          {cur.desc && (
            <p
              style={{
                fontSize: "clamp(0.92rem, 1.15vw, 1.05rem)",
                lineHeight: 1.65,
                color: "rgba(255, 255, 255, 0.88)",
                maxWidth: "540px",
                marginBottom: "28px",
                fontWeight: 300,
                textShadow: "0 1px 12px rgba(0, 0, 0, 0.4)"
              }}
            >
              {cur.desc}
            </p>
          )}

          {/* Call To Action Pill Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            {cur.buttonText && (
              <Link
                to={cur.buttonLink || "/collections"}
                className="btn-pill-primary"
                style={{
                  textDecoration: "none"
                }}
              >
                <span>{cur.buttonText}</span>
                <ArrowRight size={15} />
              </Link>
            )}

            {cur.secondaryButtonText && (
              <Link
                to={cur.secondaryButtonLink || "/about"}
                className="btn-pill-ghost-light"
                style={{
                  textDecoration: "none"
                }}
              >
                {cur.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>

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
            onClick={nextSlide}
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

      {/* Progress Bar Pagination Pills */}
      {slides.length > 1 && (
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
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: isActive ? "38px" : "16px",
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: isActive ? "var(--gold)" : "rgba(255, 255, 255, 0.35)",
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  cursor: "pointer",
                  border: "none",
                  padding: 0
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
