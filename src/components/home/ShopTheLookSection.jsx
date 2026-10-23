import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../../lib/store";
import SectionHeading from "../SectionHeading";

const CURATED_LOOKS = [
  {
    id: "look-01",
    lookNumber: "01",
    suiteTag: "THE SOLITAIRE SUITE",
    title: "Halo Solitaire & Pavé Band",
    specs: "1.80ct Lab Diamond • Platinum & Rose Gold",
    description: "A brilliant round center diamond crowned by a vintage milgrain halo and diamond-set split shank.",
    price: 2450,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
    hotspot: { top: "56%", left: "50%" },
    piecesCount: "2 Pieces Styled",
    defaultLink: "/collections?category=Engagement+Rings"
  },
  {
    id: "look-02",
    lookNumber: "02",
    suiteTag: "BLUSH RADIANCE",
    title: "Fancy Pink Radiant & Pavé Setting",
    specs: "2.20ct Fancy Vivid • 18K Rose Gold",
    description: "An extraordinary fancy pink radiant diamond with a micro-pavé halo and pavé band in warm rose gold.",
    price: 3200,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=85",
    hotspot: { top: "53%", left: "49%" },
    piecesCount: "2 Pieces Styled",
    defaultLink: "/collections?category=Bridal+Sets"
  },
  {
    id: "look-03",
    lookNumber: "03",
    suiteTag: "ATELIER GALA",
    title: "Emerald Cut Solitaire Pendant",
    specs: "3.00ct Cut Gem • 18K Solid Gold Chain",
    description: "An architectural step-cut diamond pendant suspended on a delicate double-layer artisan link chain.",
    price: 3950,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
    hotspot: { top: "63%", left: "51%" },
    piecesCount: "2 Pieces Styled",
    defaultLink: "/collections?category=Earrings"
  }
];

export default function ShopTheLookSection() {
  const navigate = useNavigate();
  const { products: dynamicProducts, format } = useStore();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Integrate with dynamic products if available
  const looks = CURATED_LOOKS.map((look, idx) => {
    const matchedProduct = dynamicProducts?.[idx];
    const targetLink = (matchedProduct?._id || matchedProduct?.id)
      ? `/product/${matchedProduct._id || matchedProduct.id}`
      : look.defaultLink;
    const displayPrice = matchedProduct?.price ? format(matchedProduct.price) : format(look.price);
    
    return {
      ...look,
      targetLink,
      displayPrice,
      product: matchedProduct
    };
  });

  return (
    <section style={{ padding: "90px 0 110px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Luxury Gold-Lined Section Heading */}
        <SectionHeading
          eyebrow="Atelier Lookbook"
          title="Curated Ensembles"
          description="Discover how our master jewelers layer and harmonize timeless solitaire and bridal pieces."
        />

        {/* 3-Column Luxury Look Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "clamp(20px, 2.5vw, 32px)",
            marginTop: "16px"
          }}
        >
          {looks.map((look, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={look.id}
                onClick={() => navigate(look.targetLink)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: "relative",
                  height: "clamp(490px, 44vw, 600px)",
                  borderRadius: "22px",
                  overflow: "hidden",
                  backgroundColor: "#FAF9F6",
                  border: isHovered ? "1px solid #c5a059" : "1px solid #ebe5da",
                  boxShadow: isHovered
                    ? "0 22px 50px rgba(28, 34, 23, 0.14)"
                    : "0 10px 30px rgba(28, 34, 23, 0.05)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer"
                }}
              >
                {/* Background Editorial Jewelry Photography */}
                <img
                  src={look.image}
                  alt={look.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                />

                {/* Refined Luxury Vignettes (Top & Bottom) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(16, 22, 13, 0.45) 0%, rgba(0,0,0,0) 30%), linear-gradient(0deg, rgba(16, 22, 13, 0.82) 0%, rgba(16, 22, 13, 0.25) 45%, rgba(0,0,0,0) 70%)",
                    pointerEvents: "none"
                  }}
                />



                {/* Bottom Inset Glassmorphic Look Card */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.96)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: "16px",
                    padding: "16px 18px",
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    boxShadow: isHovered
                      ? "0 14px 34px rgba(18, 24, 15, 0.2)"
                      : "0 8px 24px rgba(18, 24, 15, 0.12)",
                    transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                    transition: "all 0.3s ease",
                    zIndex: 2
                  }}
                >
                  {/* Top Row: Suite Category & Price */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.64rem",
                        fontWeight: 700,
                        letterSpacing: "0.20em",
                        textTransform: "uppercase",
                        color: "var(--gold-deep)"
                      }}
                    >
                      {look.suiteTag}
                    </span>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        letterSpacing: "0.02em"
                      }}
                    >
                      {look.displayPrice}
                    </span>
                  </div>

                  {/* Main Title in Luxury Serif */}
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      margin: "0 0 6px 0",
                      lineHeight: 1.25,
                      letterSpacing: "0.01em"
                    }}
                  >
                    {look.title}
                  </h4>

                  {/* Specs & Description */}
                  <p
                    style={{
                      fontSize: "0.74rem",
                      color: "var(--muted-foreground)",
                      margin: "0 0 14px 0",
                      lineHeight: 1.4
                    }}
                  >
                    {look.specs}
                  </p>

                  {/* Bottom Action Row: Call to Action Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "1px solid #ebe5da"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--foreground)",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <Sparkles size={13} style={{ color: "var(--gold-deep)" }} />
                      <span>Bespoke Pairing</span>
                    </span>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: isHovered ? "var(--primary)" : "#f4f1ea",
                        color: isHovered ? "#ffffff" : "var(--primary)",
                        padding: "7px 15px",
                        borderRadius: "50px",
                        fontSize: "0.70rem",
                        fontWeight: 700,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        transition: "all 0.25s ease"
                      }}
                    >
                      <span style={{ color: "inherit", fontWeight: 700 }}>Shop Look</span>
                      <ArrowRight size={12} strokeWidth={2.2} style={{ color: "inherit" }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
