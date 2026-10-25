import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import HeroSlider from "../components/home/HeroSlider";
import ShopByShapeSection from "../components/home/ShopByShapeSection";
import BestSellerSection from "../components/home/BestSellerSection";
import CircularCategories from "../components/home/CircularCategories";
import SplitCollectionBanners from "../components/home/SplitCollectionBanners";
import OutlineMarquee from "../components/home/OutlineMarquee";
import ShopTheLookSection from "../components/home/ShopTheLookSection";
import LovedByCouplesSection from "../components/home/LovedByCouplesSection";

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
      {/* 1. Hero Section Slider with Editorial Presentation */}
      <HeroSlider />

      {/* 2. Shop By Shape Interactive Dial & 3-Step Ring Builder */}
      <ShopByShapeSection />

      {/* 4. Best Seller Section with Tab Filter & Shop All Rings Link */}
      <BestSellerSection />

      {/* 5. Signature Collections (Circular Medallion Curations) */}
      <CircularCategories />

      {/* 6. Split Collection Banners (Dynamic if configured) */}
      <SplitCollectionBanners />

      {/* 7. Infinite Outline Typography Marquee */}
      <OutlineMarquee />

      {/* 8. Shop The Look Curated Ensembles */}
      <ShopTheLookSection />

      {/* 9. Loved by couples (Real Love Stories & Client Reviews Carousel) */}
      <LovedByCouplesSection />



      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: "clamp(16px, 3vw, 28px)",
            right: "clamp(16px, 3vw, 28px)",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            color: "var(--primary)",
            border: "1px solid #e0d7c3",
            boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
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