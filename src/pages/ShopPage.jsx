import { useSearchParams, Link } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../lib/products";
import { ProductCard } from "../components/ProductCard";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || null;
  const high = searchParams.get("high") === "true";

  const list = PRODUCTS.filter((p) => {
    if (high) return p.highJewelry;
    if (category) return p.category === category;
    return true;
  });

  const title = high ? "High Jewelry" : category ?? "All Jewelry";

  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>The Collection</p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.8rem, 5vw, 4.4rem)", marginTop: "12px", lineHeight: 1.1 }}>
        {title}
      </h1>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "24px",
          marginTop: "36px"
        }}
      >
        <Link
          to="/shop"
          className="eyebrow"
          style={{
            border: "1px solid",
            borderColor: !category && !high ? "var(--primary)" : "var(--border)",
            backgroundColor: !category && !high ? "var(--primary)" : "transparent",
            color: !category && !high ? "var(--primary-foreground)" : "var(--foreground)",
            padding: "10px 18px",
            borderRadius: "2px",
            transition: "all 0.15s ease"
          }}
        >
          All
        </Link>

        {CATEGORIES.map((c) => (
          <Link
            key={c}
            to={`/shop?category=${encodeURIComponent(c)}`}
            className="eyebrow"
            style={{
              border: "1px solid",
              borderColor: category === c ? "var(--primary)" : "var(--border)",
              backgroundColor: category === c ? "var(--primary)" : "transparent",
              color: category === c ? "var(--primary-foreground)" : "var(--foreground)",
              padding: "10px 18px",
              borderRadius: "2px",
              transition: "all 0.15s ease"
            }}
          >
            {c}
          </Link>
        ))}

        <Link
          to="/shop?high=true"
          className="eyebrow"
          style={{
            border: "1px solid",
            borderColor: high ? "var(--primary)" : "var(--border)",
            backgroundColor: high ? "var(--primary)" : "transparent",
            color: high ? "var(--primary-foreground)" : "var(--foreground)",
            padding: "10px 18px",
            borderRadius: "2px",
            transition: "all 0.15s ease"
          }}
        >
          High Jewelry
        </Link>
      </div>

      <p style={{ marginTop: "24px", fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
        {list.length} pieces available
      </p>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "40px 24px",
          marginTop: "24px"
        }}
      >
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
