import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "../../lib/store";

export default function CircularCategories() {
  const { categories } = useStore();

  if (!categories || categories.length === 0) {
    return null;
  }

  const cards = categories.map((c, i) => ({
    id: c._id || c.categoryid || i,
    img: c.image || c.categoryimage || "",
    title: c.categoryname,
    desc: c.description && c.description.trim(),
    link: `/collections?category=${encodeURIComponent(c.categoryname)}`
  }));

  return (
    <section style={{ padding: "90px 0 80px 0", backgroundColor: "#ffffff" }}>
      <div className="container-luxury">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 56px auto" }}>
          <span
            className="eyebrow"
            style={{
              color: "var(--primary)",
              letterSpacing: "0.26em",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>✦</span>
            <span>ATELIER CURATIONS</span>
            <span>✦</span>
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 4.2vw, 3.2rem)",
              fontWeight: 400,
              marginTop: "12px",
              lineHeight: 1.15
            }}
          >
            Signature Collections
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", marginTop: "12px", lineHeight: 1.6 }}>
            Explore masterfully sculpted designs crafted with ethical lab-grown diamonds and recycled precious metals.
          </p>
        </div>

        {/* Collection Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "clamp(20px, 3vw, 36px)",
            justifyContent: "center"
          }}
        >
          {cards.map((c, i) => (
            <Link
              key={c.id || i}
              to={c.link}
              style={{
                position: "relative",
                backgroundColor: "#FAF9F6",
                borderRadius: "6px",
                border: "1px solid #EAE4D7",
                padding: "48px 32px 36px 32px",
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
                  width: "190px",
                  height: "190px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "28px",
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
                      objectFit: "fill",
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
                  fontSize: "1.75rem",
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
