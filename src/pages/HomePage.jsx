import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Eye,
  ShoppingBag,
  Repeat,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  X,
  Quote
} from "lucide-react";
import { useStore } from "../lib/store";


import promo1 from "../assets/vemus/collections_promo-1.jpg";
import promo2 from "../assets/vemus/collections_promo-2.jpg";
import promo3 from "../assets/vemus/collections_promo-3.jpg";

import banner5 from "../assets/vemus/banner_banner-5.jpg";
import banner6 from "../assets/vemus/banner_banner-6.jpg";

import p52 from "../assets/vemus/products_product-52.jpg";
import p53 from "../assets/vemus/products_product-53.jpg";
import p66 from "../assets/vemus/products_product-66.jpg";
import p67 from "../assets/vemus/products_product-67.jpg";
import p68 from "../assets/vemus/products_product-68.jpg";

import tes4 from "../assets/vemus/testimonial_tes-4.jpg";
import tes5 from "../assets/vemus/testimonial_tes-5.jpg";
import avt1 from "../assets/vemus/avatar_avt-1.jpg";
import avt2 from "../assets/vemus/avatar_avt-2.jpg";

import gal1 from "../assets/vemus/gallery_gallery-1.jpg";
import gal2 from "../assets/vemus/gallery_gallery-2.jpg";
import gal3 from "../assets/vemus/gallery_gallery-3.jpg";
import gal4 from "../assets/vemus/gallery_gallery-4.jpg";
import gal5 from "../assets/vemus/gallery_gallery-5.jpg";
import gal6 from "../assets/vemus/gallery_gallery-6.jpg";

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#181818", overflowX: "hidden" }}>
      {/* 1. Hero Section Slider */}
      <HeroSlider onQuickView={setQuickViewProduct} />

      {/* 2. Three Circular Promo Cards */}
      <CircularCategories />

      {/* 3. Best Seller Section with Tab Filter */}
      <BestSellerSection onQuickView={setQuickViewProduct} />

      {/* 4. Split Collection Banners: The Modern Bride & The Art of Stack */}
      <SplitCollectionBanners />

      {/* 5. Infinite Outline Typography Marquee */}
      <OutlineMarquee />

      {/* 6. Shop The Look Section with Hotspots */}
      <ShopTheLookSection onQuickView={setQuickViewProduct} />

      {/* 7. Testimonials / Editorial Reviews */}
      <TestimonialsSection onQuickView={setQuickViewProduct} />

      {/* 8. Just For You Curated 6-Tile Gallery */}
      <JustForYouGallery />

      {/* 9. Newsletter 15% Off Banner */}
      <NewsletterBanner />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            width: "44px",
            height: "44px",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            color: "var(--primary)",
            border: "1px solid #e0d7c3",
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            zIndex: 99,
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.color = "var(--primary)";
          }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

/* =========================================================================
   1. HERO SLIDER
   ========================================================================= */
function HeroSlider() {
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

/* =========================================================================
   2. THREE CIRCULAR CATEGORY PROMO CARDS
   ========================================================================= */
function CircularCategories() {
  const { categories } = useStore();

  const defaultCards = [
    {
      img: promo1,
      title: "Timeless Classics",
      desc: "Elegant designs that never go out of style, perfect for every occasion.",
      link: "/shop?category=Rings"
    },
    {
      img: promo2,
      title: "Modern Luxe",
      desc: "Chic and contemporary pieces for the trendsetters of today",
      link: "/shop?category=Necklaces"
    },
    {
      img: promo3,
      title: "Special Moments",
      desc: "Exquisite jewelry to celebrate love, commitment, and life’s milestones.",
      link: "/shop?category=Bracelets"
    }
  ];

  const cards =
    categories && categories.length > 0
      ? categories.map((c, i) => ({
          img: c.image || c.categoryimage || (i % 3 === 0 ? promo1 : i % 3 === 1 ? promo2 : promo3),
          title: c.categoryname,
          desc: c.description || `Exquisite handcrafted ${c.categoryname.toLowerCase()} sculpted with certified Kimberley diamonds and solid gold.`,
          link: `/shop?category=${encodeURIComponent(c.categoryname)}`
        }))
      : defaultCards;

  return (
    <section style={{ padding: "80px 0 60px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "36px",
            width: "100%"
          }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                borderRadius: "50%",
                border: "1px solid #e8e3d6",
                padding: "48px 36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                maxWidth: "360px",
                aspectRatio: "1/1",
                justifyContent: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
                backgroundColor: "#fcfbfa",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(174,135,62,0.12)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e8e3d6";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Pill-shaped thumbnail image */}
              <div
                style={{
                  width: "110px",
                  height: "64px",
                  borderRadius: "32px",
                  overflow: "hidden",
                  marginBottom: "18px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  flexShrink: 0
                }}
              >
                <img
                  src={c.img}
                  alt={c.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.65rem",
                  color: "var(--primary)",
                  marginBottom: "10px",
                  fontWeight: 500,
                  lineHeight: 1.2
                }}
              >
                {c.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "#666666",
                  lineHeight: 1.55,
                  maxWidth: "240px",
                  marginBottom: "20px"
                }}
              >
                {c.desc}
              </p>

              {/* Link */}
              <Link
                to={c.link}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#181818",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  textDecoration: "none"
                }}
              >
                SHOP NOW <ArrowUpRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   3. BEST SELLER SECTION WITH TAB FILTERS
   ========================================================================= */
function BestSellerSection({ onQuickView }) {
  const [activeTab, setActiveTab] = useState("all");
  const {
    addToCart,
    toggleWishlist,
    wishlist,
    notify,
    format,
    products: dynamicProducts,
    categories: dynamicCategories
  } = useStore();

  // Only use products from backend
  const products = dynamicProducts || [];

  const categoryTabs = [
    { id: "all", label: "all" },
    ...(dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories.map((c) => ({
          id: (c.categoryname || "").toLowerCase(),
          label: (c.categoryname || "").toLowerCase()
        }))
      : [])
  ];

  const filtered =
    activeTab === "all"
      ? products
      : products.filter(
          (p) =>
            (p.category || "").toLowerCase() === activeTab.toLowerCase() ||
            String(p.categoryid || "") === String(activeTab)
        );

  return (
    <section style={{ padding: "50px 0 90px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            textAlign: "center",
            marginBottom: "28px",
            fontWeight: 400
          }}
        >
          Best Seller
        </h2>

        {/* Category Tabs */}
        {categoryTabs.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              marginBottom: "48px",
              borderBottom: "1px solid #ebebeb",
              paddingBottom: "12px",
              flexWrap: "wrap"
            }}
          >
            {categoryTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  fontSize: "0.85rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: activeTab === t.id ? "var(--primary)" : "#777777",
                  borderBottom: activeTab === t.id ? "2px solid var(--primary)" : "none",
                  paddingBottom: "12px",
                  marginBottom: "-13px",
                  transition: "all 0.2s",
                  background: "none",
                  cursor: "pointer"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 320px))",
            gap: "28px",
            justifyContent: "flex-start"
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
                color: "#888888"
              }}
            >
              <p style={{ fontSize: "1rem" }}>No pieces found in this collection.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isLiked = wishlist.includes(item.id);

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "transform 0.3s ease"
                }}
              >
                {/* Product Image Frame */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1/1",
                    backgroundColor: "#f7f7f7",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  className="product-card-hover"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: "transform 0.5s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />

                  {/* Hover Quick Action Buttons */}
                  <div
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      zIndex: 2
                    }}
                  >
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      aria-label="Wishlist"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        color: isLiked ? "var(--primary)" : "#333",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                    >
                      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                    </button>

                    <button
                      onClick={() => onQuickView(item)}
                      aria-label="Quick View"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        color: "#333",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => {
                        addToCart(item.id, item.metals?.[0] || "18k Yellow Gold");
                      }}
                      aria-label="Add to Cart"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        color: "#333",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                    >
                      <ShoppingBag size={16} />
                    </button>

                    <button
                      onClick={() => notify("Compare", `Added ${item.name} to comparison list`)}
                      aria-label="Compare"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        color: "#333",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.2s"
                      }}
                    >
                      <Repeat size={16} />
                    </button>
                  </div>

                  {/* Bottom Image Badge Bar */}
                  {item.badgeType === "sizes" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#c7c7c7",
                        color: "#181818",
                        fontSize: "0.76rem",
                        padding: "6px 12px",
                        textAlign: "center",
                        fontWeight: 500
                      }}
                    >
                      {item.badgeText}
                    </div>
                  )}

                  {item.badgeType === "countdown" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#ffffff",
                        border: "1px solid var(--border)",
                        color: "var(--primary)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        padding: "6px 16px",
                        borderRadius: "2px",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                      }}
                    >
                      {item.badgeText}
                    </div>
                  )}

                  {item.badgeType === "flash" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#8C763B",
                        color: "#ffffff",
                        fontSize: "0.75rem",
                        padding: "7px 12px",
                        textAlign: "center",
                        fontWeight: 600,
                        letterSpacing: "0.04em"
                      }}
                    >
                      {item.badgeText}
                    </div>
                  )}

                  {item.badgeType === "notify" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#1F1F1F",
                        color: "#ffffff",
                        fontSize: "0.78rem",
                        padding: "8px 12px",
                        textAlign: "center",
                        fontWeight: 500,
                        cursor: "pointer"
                      }}
                      onClick={() => notify("Notification Saved", "We will alert you once back in stock!")}
                    >
                      {item.badgeText}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ paddingTop: "14px" }}>
                  <h4
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 400,
                      lineHeight: 1.4,
                      color: "#181818",
                      marginBottom: "6px",
                      cursor: "pointer"
                    }}
                    onClick={() => onQuickView(item)}
                  >
                    {item.name}
                  </h4>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   4. SPLIT COLLECTION BANNERS: THE MODERN BRIDE & THE ART OF STACK
   ========================================================================= */
function SplitCollectionBanners() {
  return (
    <section style={{ backgroundColor: "#ffffff", margin: "20px 0" }}>
      {/* Banner 1: The Modern Bride Collection */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          alignItems: "center"
        }}
      >
        <div style={{ height: "100%", minHeight: "440px", overflow: "hidden" }}>
          <img
            src={banner5}
            alt="The Modern Bride Collection"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{ padding: "60px clamp(24px, 6vw, 90px)" }}>
          <span
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--primary)",
              display: "inline-block",
              marginBottom: "16px"
            }}
          >
            OURS STORY
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              lineHeight: 1.15,
              fontWeight: 400,
              marginBottom: "20px"
            }}
          >
            The Modern Bride Collection
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "#666666",
              maxWidth: "480px",
              marginBottom: "32px"
            }}
          >
            Redefining bridal elegance with contemporary designs that radiate sophistication. Celebrate your big day with jewelry as unique as your love story.
          </p>
          <Link
            to="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--primary)"
            }}
          >
            SHOP NOW <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Banner 2: The Art of Stack Collection */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          alignItems: "center"
        }}
      >
        <div style={{ padding: "60px clamp(24px, 6vw, 90px)", order: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              lineHeight: 1.15,
              fontWeight: 400,
              marginBottom: "20px"
            }}
          >
            The Art of <br />Stack Collection
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "#666666",
              maxWidth: "480px",
              marginBottom: "32px"
            }}
          >
            Express your individuality with stackable rings, bracelets, and necklaces. Mix, match, and layer to create a style that's entirely your own.
          </p>
          <Link
            to="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--primary)"
            }}
          >
            SHOP NOW <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ height: "100%", minHeight: "440px", overflow: "hidden", order: 2 }}>
          <img
            src={banner6}
            alt="The Art of Stack Collection"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   5. INFINITE OUTLINE TYPOGRAPHY MARQUEE
   ========================================================================= */
function OutlineMarquee() {
  return (
    <div
      style={{
        borderTop: "1px solid #ebebeb",
        borderBottom: "1px solid #ebebeb",
        padding: "24px 0",
        overflow: "hidden",
        backgroundColor: "#faf9f7"
      }}
    >
      <div className="animate-marquee" style={{ display: "inline-flex", alignItems: "center", gap: "50px" }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            WebkitTextStroke: "1px #555555",
            color: "transparent",
            letterSpacing: "0.08em"
          }}
        >
          NOW, PAY LATER
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            color: "#333333",
            letterSpacing: "0.08em"
          }}
        >
          APPLE PAY
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            WebkitTextStroke: "1px #555555",
            color: "transparent",
            letterSpacing: "0.08em"
          }}
        >
          SHOP NOW
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            color: "#333333",
            letterSpacing: "0.08em"
          }}
        >
          FREE SHIPPING
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            WebkitTextStroke: "1px #555555",
            color: "transparent",
            letterSpacing: "0.08em"
          }}
        >
          100% CERTIFIED
        </span>
        <span style={{ color: "var(--gold)", fontSize: "1.6rem" }}>✦</span>
      </div>
    </div>
  );
}

/* =========================================================================
   6. SHOP THE LOOK SECTION
   ========================================================================= */
function ShopTheLookSection({ onQuickView }) {
  const { format } = useStore();
  const looks = [
    {
      img: gal1,
      hotspot: { top: "68%", left: "52%" },
      product: {
        id: "tapered-huggie-earrings",
        name: "Tapered Huggie Earrings",
        price: 1799,
        oldPrice: 2899,
        image: p66,
        desc: "Sculpted tapered huggies adorned with pavé diamonds in solid yellow gold."
      }
    },
    {
      img: gal2,
      hotspot: { top: "50%", left: "48%" },
      product: {
        id: "april-birthstone-chain-necklace",
        name: "April Birthstone Chain Necklace",
        price: 2399,
        oldPrice: 3499,
        image: p67,
        desc: "April birthstone chain necklace featuring a luminous round brilliant diamond pendant."
      }
    },
    {
      img: gal3,
      hotspot: { top: "54%", left: "74%" },
      product: {
        id: "nura-round-pearl-ring",
        name: "Nura Round Pearl Ring",
        price: 2499,
        oldPrice: 2899,
        image: p68,
        desc: "Freshwater luminous pearl crowned with sparkling diamonds in a modern platinum band."
      }
    }
  ];

  return (
    <section style={{ padding: "80px 0 90px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            textAlign: "center",
            marginBottom: "44px",
            fontWeight: 400
          }}
        >
          Shop the Look
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px"
          }}
        >
          {looks.map((item, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                height: "520px",
                overflow: "hidden",
                borderRadius: "2px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)"
              }}
            >
              {/* Main Model Image */}
              <img
                src={item.img}
                alt={item.product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {/* Interactive Pulsing Hotspot Pin */}
              <div
                className="hotspot-pin"
                onClick={() => onQuickView(item.product)}
                style={{
                  position: "absolute",
                  top: item.hotspot.top,
                  left: item.hotspot.left,
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border: "2px solid var(--primary)",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--primary)" }} />
              </div>

              {/* Floating Bottom Pill Product Card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "4px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "2px",
                      objectFit: "cover",
                      backgroundColor: "#f5f5f5",
                      flexShrink: 0
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <h5
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {item.product.name}
                    </h5>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#181818" }}>
                        {format(item.product.price)}
                      </span>
                      {item.product.oldPrice && (
                        <span style={{ fontSize: "0.78rem", color: "#888", textDecoration: "line-through" }}>
                          {format(item.product.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onQuickView(item.product)}
                  aria-label="Quick View"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid #d5c8b2",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--primary)",
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   7. TESTIMONIAL / EDITORIAL REVIEWS
   ========================================================================= */
function TestimonialsSection({ onQuickView }) {
  const { format } = useStore();
  const reviews = [
    {
      title: "RECOMMEND!",
      quote:
        "“THE QUALITY OF THE JEWELRY EXCEEDED MY EXPECTATIONS. EVERY PIECE FEELS PREMIUM, AND THE DESIGNS ARE SO TRENDY. I'M OBSESSED WITH MY NEW JEWELRY ADDITIONS!”",
      author: "PATRICK JOHN",
      avatar: avt1,
      modelImg: tes4,
      product: {
        id: "crystal-birthstone-charm",
        name: "Crystal Birthstone Eternity Circle Charm",
        price: 2499,
        image: p53,
        desc: "Handcrafted crystal birthstone pendant set in fine sterling & white gold."
      }
    },
    {
      title: "LOVE IT!",
      quote:
        "“I WAS BLOWN AWAY BY THE QUALITY OF THESE HANDCRAFTED PIECES. EVERY ITEM FEELS LUXURIOUS AND THE STYLES ARE INCREDIBLY MODERN. I CAN’T GET ENOUGH OF MY NEW FINDS!”",
      author: "EMILY TRAN",
      avatar: avt2,
      modelImg: tes5,
      product: {
        id: "twisted-pearl-ring",
        name: "Twisted Gold Statement Pearl Ring",
        price: 2499,
        image: p52,
        desc: "Architectural twisted 18k gold band holding a natural white pearl."
      }
    }
  ];

  const [active, setActive] = useState(0);
  const cur = reviews[active];

  return (
    <section style={{ backgroundColor: "#FAF9F6", padding: "80px 0" }}>
      <div className="container-luxury">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "50px",
            alignItems: "center"
          }}
        >
          {/* Left: Model image with floating product badge */}
          <div style={{ position: "relative", minHeight: "440px", overflow: "hidden", borderRadius: "2px" }}>
            <img
              src={cur.modelImg}
              alt={cur.author}
              style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "440px" }}
            />

            {/* Floating Product Badge on Image */}
            <div
              onClick={() => onQuickView(cur.product)}
              style={{
                position: "absolute",
                bottom: "28px",
                left: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                padding: "12px 18px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                cursor: "pointer",
                maxWidth: "320px"
              }}
            >
              <img
                src={cur.product.image}
                alt={cur.product.name}
                style={{ width: "48px", height: "48px", objectFit: "cover", backgroundColor: "#f5f5f5" }}
              />
              <div style={{ minWidth: 0 }}>
                <h5 style={{ fontSize: "0.85rem", fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                  {cur.product.name}
                </h5>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--primary)" }}>
                  {format(cur.product.price)}
                </span>
              </div>
              <ArrowRight size={18} style={{ color: "#181818" }} />
            </div>
          </div>

          {/* Right: Editorial quote */}
          <div style={{ padding: "20px 10px" }}>
            {/* Quote icon */}
            <Quote size={40} style={{ color: "#d2b984", marginBottom: "20px" }} />

            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                color: "var(--primary)",
                letterSpacing: "0.04em",
                fontWeight: 500,
                margin: "0 0 24px 0"
              }}
            >
              {cur.title}
            </h2>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "#444444",
                fontWeight: 400,
                marginBottom: "36px"
              }}
            >
              {cur.quote}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
              <img
                src={cur.avatar}
                alt={cur.author}
                style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {cur.author}
              </span>
            </div>

            {/* Pagination Dots */}
            <div style={{ display: "flex", gap: "10px" }}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  style={{
                    width: i === active ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: i === active ? "#181818" : "#ccc",
                    transition: "all 0.3s ease"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   8. JUST FOR YOU CURATED 6-TILE GALLERY
   ========================================================================= */
function JustForYouGallery() {
  const tiles = [
    { img: gal1, title: "Golden Glow Essentials", desc: "Discover jewelry that defines every moment." },
    { img: gal2, title: "Timeless Beauty Collection", desc: "Adorn yourself with elegance that lasts a lifetime." },
    { img: gal3, title: "Radiant Spark Jewelry", desc: "Jewelry that mirrors your inner brilliance." },
    { img: gal4, title: "Luxe Grace Designs", desc: "Celebrate life’s sparkle with every piece you wear." },
    { img: gal5, title: "Shine Within You", desc: "Designs that embrace beauty, forever." },
    { img: gal6, title: "Elegant Moments Only", desc: "Let every gem tell your story." }
  ];

  return (
    <section style={{ padding: "80px 0 0 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            textAlign: "center",
            marginBottom: "40px",
            fontWeight: 400
          }}
        >
          Just For You
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2px",
          width: "100%"
        }}
      >
        {tiles.map((t, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              height: "360px",
              overflow: "hidden",
              cursor: "pointer"
            }}
          >
            <img
              src={t.img}
              alt={t.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* Hover overlay with Title & Shop Now */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#ffffff",
                padding: "24px",
                opacity: 0,
                transition: "opacity 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "#ffffff", marginBottom: "6px" }}>
                {t.title}
              </h4>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", marginBottom: "16px", maxWidth: "240px" }}>
                {t.desc}
              </p>
              <Link
                to="/shop"
                style={{
                  fontSize: "0.76rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#ffffff",
                  borderBottom: "1.5px solid #ffffff",
                  paddingBottom: "4px"
                }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   9. NEWSLETTER 15% OFF BANNER
   ========================================================================= */
function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const { subscribeNewsletter, notify } = useStore();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      notify("Invalid Email", "Please enter a valid email address");
      return;
    }
    const res = await subscribeNewsletter(email);
    if (res.success) {
      setEmail("");
    }
  };

  return (
    <section style={{ padding: "80px 20px", textAlign: "center", backgroundColor: "#ffffff" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            fontWeight: 400,
            marginBottom: "12px"
          }}
        >
          Get 15% Off Your First Order
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#666666", lineHeight: 1.6, marginBottom: "32px" }}>
          Join us today and enjoy 15% off your first order. Discover timeless elegance at irresistible prices!
        </p>

        <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0", maxWidth: "480px", margin: "0 auto", border: "1px solid #dcdcdc" }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            style={{
              flex: 1,
              padding: "16px 20px",
              border: "none",
              outline: "none",
              fontSize: "0.88rem",
              backgroundColor: "#ffffff"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "16px 24px",
              backgroundColor: "#181818",
              color: "#ffffff",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#181818")}
          >
            SIGN UP NOW <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </section>
  );
}

/* =========================================================================
   10. INTERACTIVE QUICK VIEW MODAL
   ========================================================================= */
function QuickViewModal({ product, onClose }) {
  const { addToCart, notify, format, generalSettings } = useStore();
  const [qty, setQty] = useState(1);
  const [metal, setMetal] = useState(product?.metals?.[0] || "18k Yellow Gold");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease-out"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          maxWidth: "860px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "4px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "36px",
          padding: "36px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: "18px", right: "18px", color: "#181818", background: "none", border: "none", cursor: "pointer" }}
        >
          <X size={22} />
        </button>

        {/* Left: Product Image */}
        <div style={{ backgroundColor: "#f8f8f8", borderRadius: "2px", overflow: "hidden", display: "grid", placeItems: "center" }}>
          <img src={product.image} alt={product.name} style={{ width: "100%", maxHeight: "380px", objectFit: "contain" }} />
        </div>

        {/* Right: Info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600 }}>
            {generalSettings?.softwarename || "Gemora Diam"} Haute Joaillerie
          </span>

          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: "8px 0 14px 0", lineHeight: 1.3 }}>
            {product.name}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} fill="var(--gold)" stroke="var(--gold)" />
            ))}
            <span style={{ fontSize: "0.8rem", color: "#777", marginLeft: "6px" }}>(24 reviews)</span>
          </div>

          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--primary)", marginBottom: "16px" }}>
            {format(product.price)}
          </div>

          <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.6, marginBottom: "24px" }}>
            {product.desc || "Exquisitely hand-set in 18k solid gold alloys with conflict-free diamonds and GIA documentation."}
          </p>

          {/* Metal Choice */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
              Metal: {metal}
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              {["18k Yellow Gold", "Rose Gold", "Platinum"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMetal(m)}
                  style={{
                    padding: "6px 14px",
                    border: metal === m ? "1.5px solid var(--primary)" : "1px solid #ddd",
                    fontSize: "0.8rem",
                    borderRadius: "2px",
                    backgroundColor: metal === m ? "var(--primary-soft)" : "transparent"
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "2px" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: "10px 14px" }}>
                -
              </button>
              <span style={{ padding: "10px 14px", fontWeight: 600, fontSize: "0.9rem" }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={{ padding: "10px 14px" }}>
                +
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, qty, metal);
                notify("Added to Bag", `${qty}x ${product.name}`);
                onClose();
              }}
              style={{
                flex: 1,
                padding: "14px 28px",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                borderRadius: "2px",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
            >
              Add To Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}