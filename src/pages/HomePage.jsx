import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Gem, Leaf, ShieldCheck, Sparkles, Star, Check } from "lucide-react";
import hero from "../assets/hero.jpg";
import atelier from "../assets/atelier.jpg";
import { PRODUCTS, images, getProduct } from "../lib/products";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../lib/store";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Collections />
      <BestSellers />
      <Craft />
      <Press />
      <Lookbook />
    </main>
  );
}

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        height: "88vh",
        minHeight: "560px",
        overflow: "hidden",
        backgroundColor: "var(--obsidian)"
      }}
    >
      <img
        src={hero}
        alt="Gemora Diam fine jewelry on silk"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(24,31,19,0.85) 0%, rgba(24,31,19,0.4) 50%, transparent 100%)"
        }}
      />

      <div
        className="container-luxury"
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div style={{ maxWidth: "620px", color: "#ffffff" }}>
          <p className="eyebrow" style={{ color: "var(--gold)" }}>
            Haute Joaillerie Atelier &bull; Since 1987
          </p>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.8rem, 5.5vw, 4.6rem)",
              lineHeight: 1.1,
              marginTop: "16px",
              marginBottom: "20px",
              color: "#ffffff"
            }}
          >
            Heirloom jewelry for <em>generations</em> to come
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.8)",
              marginBottom: "36px"
            }}
          >
            Discover the timeless radiance of ethical diamonds and bespoke high jewelry, handcrafted in our atelier with uncompromising brilliance.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              to="/shop"
              className="eyebrow"
              style={{
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "2px",
                boxShadow: "0 4px 20px rgba(85, 104, 50, 0.4)",
                transition: "transform 0.2s ease"
              }}
            >
              Discover the Collection
            </Link>

            <Link
              to="/contact"
              className="eyebrow"
              style={{
                border: "1px solid rgba(255,255,255,0.7)",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "2px",
                transition: "all 0.2s ease"
              }}
            >
              Book an Appointment
            </Link>
          </div>

          {/* Quick Metrics */}
          <div
            style={{
              display: "flex",
              gap: "36px",
              marginTop: "50px",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: "24px"
            }}
          >
            <div>
              <strong style={{ fontSize: "1.2rem", display: "block" }}>100%</strong>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Conflict-Free
              </span>
            </div>
            <div>
              <strong style={{ fontSize: "1.2rem", display: "block" }}>120+ hrs</strong>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Per Masterpiece
              </span>
            </div>
            <div>
              <strong style={{ fontSize: "1.2rem", display: "block" }}>GIA / IGI</strong>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Master Grading
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "24px",
        marginBottom: "48px"
      }}
    >
      <div>
        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>{eyebrow}</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 4vw, 3.4rem)", marginTop: "10px", lineHeight: 1.15 }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Collections() {
  const tiles = [
    { name: "Rings", img: images.ring, span: "2 / span 2" },
    { name: "Necklaces", img: images.necklace },
    { name: "Earrings", img: images.earrings },
    { name: "Bracelets", img: images.bracelet },
    { name: "Bespoke Solitaires", img: images.solitaire }
  ];

  return (
    <section className="container-luxury" style={{ paddingTop: "100px" }}>
      <SectionHead eyebrow="Curated Collections" title="Find your signature" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px"
        }}
      >
        {tiles.map((t, idx) => (
          <Link
            key={t.name}
            to={`/shop?category=${encodeURIComponent(t.name)}`}
            style={{
              position: "relative",
              overflow: "hidden",
              height: idx === 0 ? "460px" : "360px",
              backgroundColor: "var(--muted)",
              display: "block"
            }}
          >
            <img
              src={t.img}
              alt={t.name}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 1.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, transparent 40%, rgba(24,31,19,0.75) 100%)"
              }}
            />

            <div style={{ position: "absolute", bottom: "24px", left: "24px", color: "var(--ivory)" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.85rem", margin: 0 }}>{t.name}</h3>
              <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "8px", opacity: 0.9 }}>
                Discover <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BestSellers() {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 360, behavior: "smooth" });

  return (
    <section className="container-luxury" style={{ paddingTop: "110px" }}>
      <SectionHead eyebrow="Most Coveted" title="Best Sellers">
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            aria-label="Previous"
            onClick={() => scroll(-1)}
            style={{
              width: "44px",
              height: "44px",
              border: "1px solid var(--border)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            <ArrowLeft size={16} strokeWidth={1.4} />
          </button>
          <button
            aria-label="Next"
            onClick={() => scroll(1)}
            style={{
              width: "44px",
              height: "44px",
              border: "1px solid var(--border)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            <ArrowRight size={16} strokeWidth={1.4} />
          </button>
        </div>
      </SectionHead>

      <div
        ref={ref}
        style={{
          display: "flex",
          gap: "24px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: "16px",
          scrollbarWidth: "none"
        }}
      >
        {PRODUCTS.slice(0, 9).map((p) => (
          <div key={p.id} style={{ width: "320px", flexShrink: 0, scrollSnapAlign: "start" }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Craft() {
  const pillars = [
    { icon: Sparkles, t: "Artisan Craftsmanship", d: "Over 120 hours of meticulous handwork in every high jewelry piece." },
    { icon: Leaf, t: "Ethical Sourcing", d: "100% recycled gold and fully traceable, conflict-free gemstones." },
    { icon: Gem, t: "Certified Diamonds", d: "Every stone graded by the Gemological Institute of America (GIA)." },
    { icon: ShieldCheck, t: "Lifetime Guarantee", d: "Complimentary ultrasonic cleaning, resizing and repairs, forever." }
  ];

  return (
    <section
      style={{
        marginTop: "110px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        backgroundColor: "var(--secondary)"
      }}
    >
      <img
        src={atelier}
        alt="Master jeweler setting a diamond"
        loading="lazy"
        style={{ width: "100%", maxHeight: "760px", objectFit: "cover" }}
      />

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 40px" }}>
        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
          Heritage &bull; Since 1987
        </p>

        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", marginTop: "14px", lineHeight: 1.15 }}>
          The hand behind <em>every</em> facet
        </h2>

        <p style={{ marginTop: "24px", maxWidth: "520px", fontSize: "0.92rem", lineHeight: 1.8, color: "var(--muted-foreground)" }}>
          In our atelier, twelve master jewelers carry forward techniques passed down across generations — from meticulous wax carving to the final mirror hand polish under stereoscopic microscopes.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "36px", marginTop: "44px" }}>
          {pillars.map(({ icon: I, t, d }) => (
            <div key={t}>
              <I size={24} color="var(--primary)" strokeWidth={1.4} />
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginTop: "12px", marginBottom: "8px" }}>
                {t}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                {d}
              </p>
            </div>
          ))}
        </div>

        <Link
          to="/about"
          className="eyebrow"
          style={{
            alignSelf: "flex-start",
            marginTop: "44px",
            borderBottom: "1px solid var(--foreground)",
            paddingBottom: "4px"
          }}
        >
          Our Story &rarr;
        </Link>
      </div>
    </section>
  );
}

function Press() {
  const press = ["VOGUE", "Harper's BAZAAR", "ELLE", "TATLER", "Vanity Fair"];
  const reviews = [
    {
      q: "The Éternelle ring is even more breathtaking in person. The concierge team made the entire acquisition effortless.",
      n: "James R., New York"
    },
    {
      q: "I've collected fine jewelry for 20 years. Gemora's optical finishing rivals the grand maisons of Place Vendôme.",
      n: "Priya M., Mumbai"
    },
    {
      q: "My Riviera bracelet arrived beautifully packaged, insured, and with a hand-signed GIA certificate dossier.",
      n: "Charlotte D., London"
    }
  ];

  return (
    <section className="container-luxury" style={{ paddingTop: "110px" }}>
      {/* Logos Strip */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-around",
          gap: "32px",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "36px 0",
          fontFamily: "var(--font-serif)",
          fontSize: "1.8rem",
          letterSpacing: "0.2em",
          color: "var(--muted-foreground)"
        }}
      >
        {press.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>

      {/* Quote */}
      <blockquote style={{ maxWidth: "760px", margin: "70px auto 0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontStyle: "italic", lineHeight: 1.4 }}>
          "Gemora Diam is quietly redefining modern heirloom jewelry — restrained, radiant and impeccably made."
        </p>
        <footer className="eyebrow" style={{ color: "var(--gold-deep)", marginTop: "24px" }}>
          — Vogue
        </footer>
      </blockquote>

      {/* Reviews Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginTop: "70px"
        }}
      >
        {reviews.map((r) => (
          <div
            key={r.n}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              padding: "32px",
              boxShadow: "var(--shadow-soft)"
            }}
          >
            <div style={{ display: "flex", gap: "4px", color: "var(--gold)", marginBottom: "16px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--foreground)" }}>
              "{r.q}"
            </p>
            <p className="eyebrow" style={{ marginTop: "24px", color: "var(--muted-foreground)" }}>
              {r.n} &bull; Verified Collector
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Lookbook() {
  const { addToCart, format } = useStore();
  const [activePopover, setActivePopover] = useState(null);

  const looks = [
    { img: images.lifestyle, id: "stacking-trio" },
    { img: images.necklace, id: "verdant-drop" },
    { img: images.bracelet, id: "riviera-tennis" },
    { img: images.earrings, id: "perle-lumiere" },
    { img: images.solitaire, id: "oceane-sapphire" },
    { img: images.ring, id: "eternelle-solitaire" }
  ];

  return (
    <section className="container-luxury" style={{ paddingTop: "110px" }}>
      <SectionHead eyebrow="@gemoradiam" title="The Lookbook" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px"
        }}
      >
        {looks.map((l, i) => {
          const p = getProduct(l.id);
          if (!p) return null;

          return (
            <div
              key={i}
              style={{
                position: "relative",
                aspectRatio: "1/1",
                overflow: "hidden",
                backgroundColor: "var(--muted)"
              }}
            >
              <img
                src={l.img}
                alt={p.name}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.7s ease"
                }}
              />

              <button
                onClick={() => setActivePopover(activePopover === i ? null : i)}
                className="eyebrow glass"
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  padding: "8px 12px",
                  fontSize: "0.62rem",
                  borderRadius: "2px",
                  cursor: "pointer",
                  color: "var(--foreground)"
                }}
              >
                Shop the Look
              </button>

              {activePopover === i && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "48px",
                    left: "12px",
                    right: "12px",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    padding: "16px",
                    boxShadow: "var(--shadow-soft)",
                    zIndex: 20
                  }}
                >
                  <p className="font-serif" style={{ fontSize: "1.1rem", margin: 0 }}>{p.name}</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: "4px 0 10px 0" }}>{format(p.price)}</p>
                  <button
                    onClick={() => {
                      addToCart(p.id, "18k Yellow Gold");
                      setActivePopover(null);
                    }}
                    className="eyebrow"
                    style={{
                      width: "100%",
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      padding: "10px",
                      borderRadius: "2px"
                    }}
                  >
                    Add to Bag
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
