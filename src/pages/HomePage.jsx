import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Eye,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  X
} from "lucide-react";
import { useStore } from "../lib/store";


import promo1 from "../assets/vemus/collections_promo-1.jpg";
import promo2 from "../assets/vemus/collections_promo-2.jpg";
import promo3 from "../assets/vemus/collections_promo-3.jpg";

import banner5 from "../assets/vemus/banner_banner-5.jpg";
import banner6 from "../assets/vemus/banner_banner-6.jpg";


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

      {/* 6. Shop The Look Section */}
      <ShopTheLookSection onQuickView={setQuickViewProduct} />


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

  if (!categories || categories.length === 0) {
    return null;
  }

  const cards = categories.map((c, i) => ({
    img: c.image || c.categoryimage || (i % 3 === 0 ? promo1 : i % 3 === 1 ? promo2 : promo3),
    title: c.categoryname,
    desc: c.description || `Handcrafted ${c.categoryname.toLowerCase()} sculpted with certified conflict-free diamonds and gold.`,
    link: `/shop?category=${encodeURIComponent(c.categoryname)}`
  }));

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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(item.id);
                        }}
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
                          addToCart(item.id, item.metals?.[0] || "", item.ringSizes?.[0] || "", "", item.price);
                          notify("Added to Bag", `1x ${item.name} (${format(item.price)})`);
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
                    </div>
                  </div>

                  {/* Item Details According to Backend */}
                  <div style={{ paddingTop: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#888888", fontWeight: 600 }}>
                        {item.category || "Jewelry"} {item.sku ? `• ${item.sku}` : ""}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        lineHeight: 1.3,
                        color: "#181818",
                        margin: "2px 0 0 0",
                        cursor: "pointer",
                        fontFamily: "var(--font-serif)"
                      }}
                      onClick={() => onQuickView(item)}
                    >
                      {item.name}
                    </h4>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                      <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--primary)" }}>
                        {format(item.price)}
                      </span>
                      {item.metals && item.metals.length > 0 && (
                        <span style={{ fontSize: "0.74rem", color: "#777777" }}>
                          {item.metals.length} {item.metals.length === 1 ? "metal" : "metals"}
                        </span>
                      )}
                    </div>
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
   4. SPLIT COLLECTION BANNERS (FROM BACKEND CATEGORIES)
   ========================================================================= */
function SplitCollectionBanners() {
  const { categories, products } = useStore();

  if (!categories || categories.length < 2) {
    return null;
  }

  const cat1 = categories[0];
  const cat2 = categories[1];
  const prod1 = products?.find((p) => (p.category || "").toLowerCase() === cat1.categoryname?.toLowerCase());
  const prod2 = products?.find((p) => (p.category || "").toLowerCase() === cat2.categoryname?.toLowerCase());
  const img1 = cat1.image || prod1?.image || banner5;
  const img2 = cat2.image || prod2?.image || banner6;

  return (
    <section style={{ backgroundColor: "#ffffff", margin: "20px 0" }}>
      {/* Banner 1: Backend Category 1 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          alignItems: "center"
        }}
      >
        <div style={{ height: "100%", minHeight: "440px", overflow: "hidden" }}>
          <img
            src={img1}
            alt={cat1.categoryname}
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
            FEATURED COLLECTION
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
            {cat1.categoryname} Collection
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
            {cat1.description || `Explore our signature handcrafted ${cat1.categoryname.toLowerCase()} pieces designed for elegance and timeless charm.`}
          </p>
          <Link
            to={`/shop?category=${encodeURIComponent(cat1.categoryname)}`}
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

      {/* Banner 2: Backend Category 2 */}
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
            {cat2.categoryname} Collection
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
            {cat2.description || `Celebrate special moments with our exquisite ${cat2.categoryname.toLowerCase()} sculpted with certified stones.`}
          </p>
          <Link
            to={`/shop?category=${encodeURIComponent(cat2.categoryname)}`}
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
            src={img2}
            alt={cat2.categoryname}
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
  const { products: dynamicProducts } = useStore();

  const products = dynamicProducts || [];
  const looks = products
    .filter((item) => item.image || item.galleryImages?.[0])
    .slice(0, 3)
    .map((item) => ({
      img: item.galleryImages?.[0] || item.image,
      product: item
    }));

  if (looks.length === 0) {
    return null;
  }

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
            gridTemplateColumns:
              looks.length === 1
                ? "minmax(320px, 440px)"
                : looks.length === 2
                  ? "repeat(auto-fit, minmax(320px, 480px))"
                  : "repeat(auto-fit, minmax(300px, 1fr))",
            justifyContent: "center",
            gap: "28px"
          }}
        >
          {looks.map((item, idx) => (
            <div
              key={item.product?.id || idx}
              style={{
                position: "relative",
                height: "520px",
                overflow: "hidden",
                borderRadius: "2px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                backgroundColor: "#f7f7f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {/* Main Model / Product Look Image */}
              <img
                src={item.img}
                alt={item.product?.name || "Product"}
                onClick={() => onQuickView && onQuickView(item.product)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                  transition: "transform 0.5s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />

              {/* Floating Bottom Pill Product Card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.94)",
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, cursor: "pointer" }}
                  onClick={() => onQuickView && onQuickView(item.product)}
                >
                  <img
                    src={item.product?.image || item.img}
                    alt={item.product?.name || ""}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "2px",
                      objectFit: "contain",
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
                      {item.product?.name}
                    </h5>
                  </div>
                </div>

                <button
                  onClick={() => onQuickView && onQuickView(item.product)}
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
                    transition: "all 0.2s",
                    backgroundColor: "transparent"
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
   7. JUST FOR YOU CURATED GALLERY (FROM BACKEND PRODUCTS)
   ========================================================================= */
function JustForYouGallery() {
  const { products } = useStore();
  const navigate = useNavigate();

  // Dynamically build tiles from backend products and their uploaded gallery images
  const dynamicTiles = useMemo(() => {
    if (!products || products.length === 0) return [];

    const list = [];
    // 1. First add each active backend product's main image
    products.forEach((p) => {
      if (p.image) {
        list.push({
          id: p.id,
          product: p,
          img: p.image,
          title: p.name || "Handcrafted Jewelry",
          desc: p.description?.trim() || `${p.category || "Fine Jewelry"} Collection`,
          link: `/product/${p.id}`
        });
      }
    });

    // 2. If fewer than 6, supplement with gallery images of backend products
    if (list.length < 6) {
      products.forEach((p) => {
        if (Array.isArray(p.galleryImages)) {
          p.galleryImages.forEach((gImg, idx) => {
            if (list.length < 6 && gImg && gImg !== p.image) {
              list.push({
                id: `${p.id}-gal-${idx}`,
                product: p,
                img: gImg,
                title: p.name || "Exclusive Detail",
                desc: `${p.category || "Fine Jewelry"} Detail`,
                link: `/product/${p.id}`
              });
            }
          });
        }
      });
    }

    return list.slice(0, 6);
  }, [products]);

  if (!dynamicTiles || dynamicTiles.length === 0) {
    return null;
  }

  const tiles = dynamicTiles;

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
            key={t.id || idx}
            onClick={() => {
              if (t.link) navigate(t.link);
            }}
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
                backgroundColor: "rgba(0,0,0,0.45)",
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
                to={t.link || "/shop"}
                onClick={(e) => e.stopPropagation()}
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
  const { addToCart, notify, format, getItemPrice, generalSettings } = useStore();
  const [qty, setQty] = useState(1);
  const availableMetals = product?.metals || [];
  const [metal, setMetal] = useState(availableMetals[0] || "");
  const [ringSize, setRingSize] = useState(product?.ringSizes?.[0] || "");

  const matchedPricing = useMemo(() => {
    if (product?.pricing?.priceType === "metal_with_stone_diamond_carat") {
      return (
        product.pricing.metalWithStoneDiamondCaratPrices?.find(
          (m) => (m.metalname || "").toLowerCase() === (metal || "").toLowerCase()
        ) || product.pricing.metalWithStoneDiamondCaratPrices?.[0]
      );
    }
    return null;
  }, [product, metal]);

  const activeCaratPrices = matchedPricing?.caratPrices || [];
  const [selectedCarat, setSelectedCarat] = useState("");
  const carat =
    activeCaratPrices.length > 0
      ? activeCaratPrices.some((c) => c.diamondsize === selectedCarat)
        ? selectedCarat
        : activeCaratPrices[0]?.diamondsize || ""
      : "";

  const currentPrice = getItemPrice(product, metal, carat);

  const allMedia = useMemo(() => {
    const list = [];
    if (product?.image) list.push({ type: "image", url: product.image });
    if (Array.isArray(product?.galleryImages)) {
      product.galleryImages.forEach((url) => {
        if (url && url !== product.image) list.push({ type: "image", url });
      });
    }
    if (product?.video) list.push({ type: "video", url: product.video });
    return list;
  }, [product]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

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
          maxWidth: "880px",
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
          style={{ position: "absolute", top: "18px", right: "18px", color: "#181818", background: "none", border: "none", cursor: "pointer", zIndex: 10 }}
        >
          <X size={22} />
        </button>

        {/* Left: Product Image & Gallery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ backgroundColor: "#f8f8f8", borderRadius: "2px", overflow: "hidden", display: "grid", placeItems: "center", minHeight: "340px", maxHeight: "380px" }}>
            {allMedia[activeMediaIndex]?.type === "video" ? (
              <video
                src={allMedia[activeMediaIndex].url}
                controls
                autoPlay
                muted
                style={{ width: "100%", maxHeight: "380px", objectFit: "contain" }}
              />
            ) : (
              <img
                src={allMedia[activeMediaIndex]?.url || product.image}
                alt={product.name}
                style={{ width: "100%", maxHeight: "380px", objectFit: "contain" }}
              />
            )}
          </div>

          {allMedia.length > 1 && (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {allMedia.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  style={{
                    width: "54px",
                    height: "54px",
                    flexShrink: 0,
                    borderRadius: "2px",
                    border: activeMediaIndex === idx ? "2px solid var(--primary)" : "1px solid #ddd",
                    padding: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5"
                  }}
                >
                  {m.type === "video" ? (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: "0.68rem", fontWeight: 700, backgroundColor: "#222", color: "#fff" }}>
                      PLAY
                    </div>
                  ) : (
                    <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600 }}>
            {product.category || (generalSettings?.softwarename || "Gemora Diam")}{product.subcategory ? ` • ${product.subcategory}` : ""} {product.sku ? `• SKU: ${product.sku}` : ""}
          </span>

          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: "8px 0 12px 0", lineHeight: 1.3 }}>
            {product.name}
          </h3>

          <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--primary)", marginBottom: "16px" }}>
            {format(currentPrice)}
          </div>

          {product.description ? (
            <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.6, marginBottom: "20px" }}>
              {product.description}
            </p>
          ) : null}

          {/* Stone Information for Selected Metal if available */}
          {matchedPricing?.stonename && (
            <div style={{ marginBottom: "14px", fontSize: "0.82rem", color: "#444" }}>
              <span style={{ fontWeight: 600 }}>Stone:</span> {matchedPricing.stonename}
              {matchedPricing.stonePricingType === "fixed" && " • Fixed Price"}
            </div>
          )}

          {/* Diamond Carat Sizes from Backend */}
          {activeCaratPrices.length > 0 && (
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                Diamond Size
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {activeCaratPrices.map((cp) => (
                  <button
                    key={cp.diamondsize}
                    onClick={() => setSelectedCarat(cp.diamondsize)}
                    style={{
                      padding: "6px 12px",
                      border: carat === cp.diamondsize ? "1.5px solid var(--primary)" : "1px solid #ddd",
                      fontSize: "0.8rem",
                      borderRadius: "2px",
                      backgroundColor: carat === cp.diamondsize ? "var(--primary-soft)" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    {cp.diamondsize} ({format(cp.price)})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metal Choice from Backend */}
          {availableMetals.length > 0 && (
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                Metal: {metal}
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {availableMetals.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetal(m)}
                    style={{
                      padding: "6px 14px",
                      border: metal === m ? "1.5px solid var(--primary)" : "1px solid #ddd",
                      fontSize: "0.8rem",
                      borderRadius: "2px",
                      backgroundColor: metal === m ? "var(--primary-soft)" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ring Sizes from Backend */}
          {product.ringSizes && product.ringSizes.length > 0 && (
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                Ring Size
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.ringSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setRingSize(s)}
                    style={{
                      padding: "4px 10px",
                      border: ringSize === s ? "1.5px solid var(--primary)" : "1px solid #ddd",
                      fontSize: "0.8rem",
                      borderRadius: "2px",
                      backgroundColor: ringSize === s ? "var(--primary-soft)" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Backend Attributes Badges */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
            {product.shapes?.map((sh) => (
              <span key={sh} style={{ fontSize: "0.75rem", backgroundColor: "#f5f5f5", padding: "4px 8px", borderRadius: "2px" }}>
                Shape: {sh}
              </span>
            ))}
            {product.clarities?.map((cl) => (
              <span key={cl} style={{ fontSize: "0.75rem", backgroundColor: "#f5f5f5", padding: "4px 8px", borderRadius: "2px" }}>
                Clarity: {cl}
              </span>
            ))}
            {product.stones?.map((st) => (
              <span key={st} style={{ fontSize: "0.75rem", backgroundColor: "#f5f5f5", padding: "4px 8px", borderRadius: "2px" }}>
                Stone: {st}
              </span>
            ))}
            {product.diamondColors?.map((dc) => (
              <span key={dc} style={{ fontSize: "0.75rem", backgroundColor: "#f5f5f5", padding: "4px 8px", borderRadius: "2px" }}>
                Color: {dc}
              </span>
            ))}
            {product.styles?.map((sy) => (
              <span key={sy} style={{ fontSize: "0.75rem", backgroundColor: "#f5f5f5", padding: "4px 8px", borderRadius: "2px" }}>
                Style: {sy}
              </span>
            ))}
          </div>

          {/* Quantity & Add to Cart */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "2px" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: "10px 14px", cursor: "pointer", background: "none", border: "none" }}>
                -
              </button>
              <span style={{ padding: "10px 14px", fontWeight: 600, fontSize: "0.9rem" }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={{ padding: "10px 14px", cursor: "pointer", background: "none", border: "none" }}>
                +
              </button>
            </div>

            <button
              onClick={() => {
                for (let i = 0; i < qty; i++) {
                  addToCart(product.id, metal, ringSize, carat, currentPrice);
                }
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
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
            >
              Add To Bag • {format(currentPrice * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}