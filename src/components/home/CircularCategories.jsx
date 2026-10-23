import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "../../lib/store";
import SectionHeading from "../SectionHeading";

const DEFAULT_CATEGORIES = [
  {
    id: "cat-1",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    title: "Engagement Rings",
    desc: "Solitaire, halo, and bespoke engagement rings handcrafted with certified lab diamonds.",
    link: "/collections?category=Engagement+Rings"
  },
  {
    id: "cat-2",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    title: "Wedding Bands",
    desc: "Timeless eternity bands and bridal rings sculpted in recycled 18k gold and platinum.",
    link: "/collections?category=Wedding+Bands"
  },
  {
    id: "cat-3",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    title: "Fine Jewelry",
    desc: "Tennis bracelets, diamond pendant necklaces, and heirloom earrings for every milestone.",
    link: "/collections"
  }
];

export default function CircularCategories() {
  const { categories } = useStore();

  const cards = (categories && categories.length > 0)
    ? categories.map((c, i) => ({
      id: c._id || c.categoryid || i,
      img: c.image || c.categoryimage || "",
      title: c.categoryname,
      desc: c.description && c.description.trim(),
      link: `/collections?category=${encodeURIComponent(c.categoryname)}`
    }))
    : DEFAULT_CATEGORIES;

  return (
    <section style={{ padding: "90px 0 80px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Section Header */}
        <SectionHeading
          eyebrow="Atelier Curations"
          title="Signature Collections"
          description="Explore masterfully sculpted designs crafted with ethical lab-grown diamonds and recycled precious metals."
        />

        {/* Collection Cards Grid */}
        <div className="categories-balanced-grid">
          {cards.map((c, i) => (
            <Link
              key={c.id || i}
              to={c.link}
              style={{
                position: "relative",
                backgroundColor: "#FAF9F6",
                borderRadius: "6px",
                border: "1px solid #EAE4D7",
                padding: "clamp(28px, 4vw, 48px) clamp(16px, 3vw, 32px) clamp(24px, 3vw, 36px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                textDecoration: "none",
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 45px rgba(85, 104, 50, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#EAE4D7";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)";
              }}
            >
              {/* Luxury Circular Medallion Portal */}
              <div
                style={{
                  position: "relative",
                  width: "clamp(130px, 16vw, 190px)",
                  height: "clamp(130px, 16vw, 190px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "clamp(16px, 3vw, 28px)",
                  boxShadow: "0 0 0 4px #FAF9F6, 0 0 0 6px rgba(197, 160, 89, 0.4), 0 10px 25px rgba(0,0,0,0.08)",
                  backgroundColor: "#ffffff",
                  flexShrink: 0
                }}
              >
                {c.img ? (
                  <img
                    src={c.img}
                    alt={c.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F4F0E8",
                      color: "var(--primary)",
                      fontFamily: "var(--font-serif)",
                      fontSize: "2.2rem",
                      fontWeight: 500
                    }}
                  >
                    {c.title ? c.title.charAt(0).toUpperCase() : "✦"}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.3rem, 2.2vw, 1.75rem)",
                  color: "var(--foreground)",
                  marginBottom: "10px",
                  fontWeight: 500,
                  lineHeight: 1.2
                }}
              >
                {c.title}
              </h3>

              {/* Description */}
              {c.desc ? (
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.6,
                    maxWidth: "280px",
                    marginBottom: "24px"
                  }}
                >
                  {c.desc}
                </p>
              ) : null}

              {/* Call to action */}
              <div
                className="eyebrow"
                style={{
                  marginTop: "auto",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  color: "var(--primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderBottom: "1.5px solid var(--primary)",
                  paddingBottom: "3px"
                }}
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowUpRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
