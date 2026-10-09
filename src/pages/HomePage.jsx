import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import {
  HeroSlider,
  CircularCategories,
  BestSellerSection,
  SplitCollectionBanners,
  OutlineMarquee,
  ShopTheLookSection,
  JustForYouGallery
} from "../components/home";

export default function HomePage() {
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
      <HeroSlider />

      {/* 2. Three Circular Promo Cards */}
      <CircularCategories />

      {/* 3. Best Seller Section with Tab Filter */}
      <BestSellerSection />

      {/* 4. Split Collection Banners */}
      <SplitCollectionBanners />

      {/* 5. Infinite Outline Typography Marquee */}
      <OutlineMarquee />

      {/* 6. Shop The Look Section */}
      <ShopTheLookSection />

      {/* 7. Just For You Curated 6-Tile Gallery */}
      <JustForYouGallery />

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
