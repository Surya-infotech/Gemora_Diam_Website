import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useStore } from "../../lib/store";

function getMetalColor(metalName = "") {
  const norm = String(metalName).toLowerCase();
  if (norm.includes("rose")) return "#e8a896";
  if (norm.includes("yellow") || norm.includes("gold")) {
    if (norm.includes("white")) return "#e0e2e5";
    return "#e5c158";
  }
  if (norm.includes("platinum")) return "#cbd3db";
  if (norm.includes("white") || norm.includes("silver")) return "#e0e2e5";
  return "#e5c158";
}

function formatCategoryTitle(cat = "") {
  const norm = cat.trim();
  const lower = norm.toLowerCase();
  if (lower === "ring") return "Rings";
  if (lower === "bracelet") return "Bracelets";
  if (lower === "earings" || lower === "earing" || lower === "earring") return "Earrings";
  if (lower === "pendant") return "Pendants";
  if (lower === "bridal sets" || lower === "bridal set") return "Bridal Sets";
  if (lower.endsWith("s")) return norm;
  return `${norm}s`;
}

function ProductCard({
  item,
  isLiked,
  onToggleWishlist,
  selectedMetal,
  onSelectMetal,
  currentPrice,
  format,
  onNavigate
}) {
  const rawMetals = item.metals || [];
  const metals = rawMetals.map((m) => {
    if (typeof m === "object" && m !== null) {
      return {
        name: m.name || m.metalname || "",
        color: m.color || getMetalColor(m.name || m.metalname)
      };
    }
    return { name: String(m), color: getMetalColor(m) };
  });

  const activeMetal = selectedMetal || metals[0]?.name || "";
  const itemImage = item.image || item.galleryImages?.[0] || item.gallery?.[0] || "";

  return (
    <div
      onClick={onNavigate}
      className="bestseller-card"
      style={{
        flex: "0 0 clamp(240px, 22vw, 280px)",
        width: "clamp(240px, 22vw, 280px)",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #ebe5da",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "pointer",
        position: "relative"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 14px 34px rgba(28, 34, 23, 0.08)";
        e.currentTarget.style.borderColor = "#dcd4c7";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#ebe5da";
      }}
    >
      {/* Product Image Stage */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          backgroundColor: "#f8f7f4",
          overflow: "hidden"
        }}
      >
        {itemImage ? (
          <img
            src={itemImage}
            alt={item.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              objectPosition: "center",
              display: "block",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              color: "#bbb",
              fontSize: "12px"
            }}
          >
            No Image
          </div>
        )}

        {/* Top-Right: Circular Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(item.id);
          }}
          aria-label="Toggle wishlist"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 2,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(220, 215, 205, 0.6)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "grid",
            placeItems: "center",
            color: isLiked ? "var(--primary)" : "var(--foreground)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)")}
        >
          <Heart size={14} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>

        {/* Bottom-Right: Subtle Gold Atelier Watermark Monogram */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 36 36"
          fill="none"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "12px",
            zIndex: 1,
            opacity: 0.35,
            color: "var(--gold)",
            pointerEvents: "none"
          }}
        >
          <path
            d="M18 3L32 10.5V19C32 26.5 25.5 32.5 18 34.5C10.5 32.5 4 26.5 4 19V10.5L18 3Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M18 8L26 14L18 29L10 14L18 8Z" stroke="currentColor" strokeWidth="1" />
          <path d="M10 14H26M18 8V29" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Product Meta & Swatches */}
      <div style={{ padding: "14px 14px 16px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Row 1: Title */}
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.84rem",
            fontWeight: 500,
            lineHeight: 1.35,
            color: "#1a1a1a",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.3em",
            width: "100%"
          }}
        >
          {item.name}
        </h3>

        {/* Row 2: Price dynamically updated by selected metal & Circular Swatches */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8px",
            gap: "6px"
          }}
        >
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#222222",
              transition: "color 0.2s ease",
              whiteSpace: "nowrap"
            }}
          >
            {format ? format(currentPrice) : `$${currentPrice?.toLocaleString()}`}
          </div>

          {/* Circular Metal Color Swatches */}
          {metals.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                flexShrink: 0
              }}
            >
              {metals.map((metal) => {
                const isSelected = activeMetal === metal.name;
                return (
                  <button
                    key={metal.name}
                    type="button"
                    className="swatch-dot"
                    title={metal.name}
                    onClick={(e) => onSelectMetal(item.id, metal.name, e)}
                    style={{
                      width: "10px",
                      height: "10px",
                      minWidth: "10px",
                      minHeight: "10px",
                      maxWidth: "10px",
                      maxHeight: "10px",
                      borderRadius: "50%",
                      backgroundColor: metal.color,
                      border: "none",
                      padding: 0,
                      margin: 0,
                      cursor: "pointer",
                      outline: "none",
                      flexShrink: 0,
                      boxShadow: isSelected
                        ? "0 0 0 1.5px #ffffff, 0 0 0 2.5px var(--primary)"
                        : "none",
                      transition: "transform 0.15s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryHorizontalRow({
  categoryName,
  items,
  wishlist,
  toggleWishlist,
  selectedMetals,
  handleMetalSelect,
  getItemPrice,
  format,
  navigate
}) {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items, checkScroll]);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const container = rowRef.current;
    const cards = container.querySelectorAll(".bestseller-card");
    
    // Determine card step (card width + gap)
    let cardStep = 280;
    if (cards && cards.length >= 2) {
      const rect0 = cards[0].getBoundingClientRect();
      const rect1 = cards[1].getBoundingClientRect();
      cardStep = rect1.left - rect0.left;
    } else if (cards && cards.length === 1) {
      cardStep = cards[0].getBoundingClientRect().width + 18;
    }

    // Scroll by visible cards count (or at least 1 card)
    const visibleCount = Math.max(1, Math.floor(container.clientWidth / cardStep));
    const scrollDistance = cardStep * visibleCount;

    if (direction === "left") {
      if (container.scrollLeft <= scrollDistance * 1.15) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollDistance, behavior: "smooth" });
      }
    } else {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft + scrollDistance >= maxScroll - 30) {
        container.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollDistance, behavior: "smooth" });
      }
    }
    setTimeout(checkScroll, 400);
  };

  const categoryLink = `/collections?category=${encodeURIComponent(categoryName)}`;
  const displayTitle = formatCategoryTitle(categoryName);

  return (
    <div style={{ marginBottom: "clamp(36px, 4.5vw, 56px)" }}>
      {/* Category Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px"
        }}
      >
        {/* Left: Category Title & Count */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(1.15rem, 2vw, 1.55rem)",
              fontWeight: 600,
              color: "var(--foreground)",
              letterSpacing: "0.01em",
              margin: 0
            }}
          >
            {displayTitle}
          </h3>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--primary)",
              letterSpacing: "0.06em",
              backgroundColor: "var(--primary-soft)",
              padding: "2px 8px",
              borderRadius: "50px"
            }}
          >
            {items.length} {items.length === 1 ? "Piece" : "Pieces"}
          </span>
        </div>

        {/* Right: "Shop All" link */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link
            to={categoryLink}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--foreground)",
              textDecoration: "none",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
          >
            <span>Shop all {displayTitle.toLowerCase()}</span>
            <ArrowRight size={13} strokeWidth={2} style={{ color: "var(--primary)" }} />
          </Link>
        </div>
      </div>

      {/* Horizontal Carousel with Floating Left & Right Arrows */}
      <div style={{ position: "relative" }} className="category-carousel-wrapper">
        {/* Left Floating Arrow Button - only rendered when content can scroll left */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label={`Scroll ${categoryName} left`}
            style={{
              position: "absolute",
              left: "-18px",
              top: "42%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #d4ccbd",
              boxShadow: "0 4px 18px rgba(28, 34, 23, 0.16)",
              backdropFilter: "blur(4px)",
              color: "var(--foreground)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(85, 104, 50, 0.32)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
              e.currentTarget.style.color = "var(--foreground)";
              e.currentTarget.style.borderColor = "#d4ccbd";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 18px rgba(28, 34, 23, 0.16)";
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>
        )}

        {/* Right Floating Arrow Button - only rendered when content can scroll right */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label={`Scroll ${categoryName} right`}
            style={{
              position: "absolute",
              right: "-18px",
              top: "42%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #d4ccbd",
              boxShadow: "0 4px 18px rgba(28, 34, 23, 0.16)",
              backdropFilter: "blur(4px)",
              color: "var(--foreground)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(85, 104, 50, 0.32)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
              e.currentTarget.style.color = "var(--foreground)";
              e.currentTarget.style.borderColor = "#d4ccbd";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 18px rgba(28, 34, 23, 0.16)";
            }}
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>
        )}

        {/* Horizontal Scrolling Track for Items */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: "clamp(14px, 1.8vw, 22px)",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: "12px",
            scrollPaddingRight: "12px",
            WebkitOverflowScrolling: "touch",
            padding: "8px 12px 18px 12px"
          }}
        >
          {items.map((item) => {
            const isLiked = wishlist.includes(item.id);
            const rawMetals = item.metals || [];
            const metals = rawMetals.map((m) => {
              if (typeof m === "object" && m !== null) {
                return { name: m.name || m.metalname || "", color: m.color || getMetalColor(m.name || m.metalname) };
              }
              return { name: String(m), color: getMetalColor(m) };
            });
            const activeMetal = selectedMetals[item.id] || metals[0]?.name || "";
            const currentPrice = getItemPrice
              ? getItemPrice(item, activeMetal)
              : (item.price || 0);

            return (
              <ProductCard
                key={item.id}
                item={item}
                isLiked={isLiked}
                onToggleWishlist={toggleWishlist}
                selectedMetal={activeMetal}
                onSelectMetal={handleMetalSelect}
                currentPrice={currentPrice}
                format={format}
                onNavigate={() => navigate(item.link || `/product/${item.id || item._id}` || `/collections`)}
              />
            );
          })}

          {/* Explore All Category Card */}
          <div
            onClick={() => navigate(categoryLink)}
            style={{
              flex: "0 0 clamp(200px, 18vw, 240px)",
              width: "clamp(200px, 18vw, 240px)",
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: "#FAF9F6",
              borderRadius: "14px",
              border: "1.5px dashed #DCD5C7",
              padding: "24px 20px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              minHeight: "280px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-soft)";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FAF9F6";
              e.currentTarget.style.borderColor = "#DCD5C7";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                marginBottom: "16px",
                color: "var(--primary)"
              }}
            >
              <Sparkles size={20} strokeWidth={1.8} />
            </div>
            <p
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--gold-deep)",
                margin: "0 0 6px 0"
              }}
            >
              Explore More
            </p>
            <h4
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "var(--foreground)",
                margin: "0 0 8px 0"
              }}
            >
              View All {displayTitle}
            </h4>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--muted-foreground)",
                margin: "0 0 16px 0"
              }}
            >
              Browse {items.length} bespoke pieces
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.74rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "var(--primary)"
              }}
            >
              <span>View All</span>
              <ArrowRight size={13} strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BestSellerSection() {
  const navigate = useNavigate();
  const [selectedMetals, setSelectedMetals] = useState({});
  const { products, categories, productsLoading, wishlist, toggleWishlist, format, getItemPrice } = useStore();

  const handleMetalSelect = (itemId, metalName, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMetals((prev) => ({ ...prev, [itemId]: metalName }));
  };

  // Derive dynamic categories with products from database
  const categoriesWithProducts = (categories || [])
    .map((c) => c.categoryname || c.name || c.title)
    .filter(Boolean)
    .filter((catName) =>
      (products || []).some((p) => p.category?.toLowerCase() === catName.toLowerCase())
    );

  const extraProductCategories = Array.from(
    new Set(
      (products || [])
        .map((p) => p.category)
        .filter(Boolean)
        .filter(
          (pCat) =>
            !categoriesWithProducts.some(
              (c) => c.toLowerCase() === pCat.toLowerCase()
            )
        )
    )
  );

  const dynamicTabs = [...categoriesWithProducts, ...extraProductCategories];

  // If no dynamic products exist in the database, cleanly do not render default mock data
  if (!productsLoading && (!products || products.length === 0 || dynamicTabs.length === 0)) {
    return null;
  }

  return (
    <section style={{ padding: "clamp(40px, 5vw, 70px) 0 clamp(50px, 6vw, 90px) 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Category-Wise Separate Lists with Horizontal Scrolling */}
        {dynamicTabs.map((cat) => {
          const catItems = (products || []).filter(
            (p) => p.category?.toLowerCase() === cat.toLowerCase()
          );

          if (catItems.length === 0) return null;

          return (
            <CategoryHorizontalRow
              key={cat}
              categoryName={cat}
              items={catItems}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              selectedMetals={selectedMetals}
              handleMetalSelect={handleMetalSelect}
              getItemPrice={getItemPrice}
              format={format}
              navigate={navigate}
            />
          );
        })}
      </div>
    </section>
  );
}