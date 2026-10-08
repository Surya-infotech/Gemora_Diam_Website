import { useSearchParams, Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../lib/store";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || null;
  const high = searchParams.get("high") === "true";
  const search = searchParams.get("search")?.toLowerCase().trim() || null;

  const { products, categories, productsLoading } = useStore();

  // Only use dynamic products from Admin Panel
  const allProducts = products || [];

  // Active categories from Admin Panel
  const activeCategories = (categories || []).map((c) => c.categoryname).filter(Boolean);

  const list = allProducts.filter((p) => {
    if (search) {
      const match =
        (p.name || "").toLowerCase().includes(search) ||
        (p.category || "").toLowerCase().includes(search) ||
        (p.description || "").toLowerCase().includes(search) ||
        (p.sku || "").toLowerCase().includes(search);
      if (!match) return false;
    }
    if (high) return p.highJewelry;
    if (category) {
      return (
        (p.category || "").toLowerCase() === category.toLowerCase() ||
        String(p.categoryid) === String(category)
      );
    }
    return true;
  });

  const title = search
    ? `Search: "${searchParams.get("search")}"`
    : high
      ? "High Jewelry"
      : category ?? "All Jewelry";

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
            borderColor: !category && !high && !search ? "var(--primary)" : "var(--border)",
            backgroundColor: !category && !high && !search ? "var(--primary)" : "transparent",
            color: !category && !high && !search ? "var(--primary-foreground)" : "var(--foreground)",
            padding: "10px 18px",
            borderRadius: "2px",
            transition: "all 0.15s ease"
          }}
        >
          All
        </Link>

        {activeCategories.map((c) => (
          <Link
            key={c}
            to={`/shop?category=${encodeURIComponent(c)}`}
            className="eyebrow"
            style={{
              border: "1px solid",
              borderColor: category?.toLowerCase() === c.toLowerCase() ? "var(--primary)" : "var(--border)",
              backgroundColor: category?.toLowerCase() === c.toLowerCase() ? "var(--primary)" : "transparent",
              color: category?.toLowerCase() === c.toLowerCase() ? "var(--primary-foreground)" : "var(--foreground)",
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
        {productsLoading ? "Loading collection..." : `${list.length} pieces available`}
      </p>

      {/* Grid */}
      {list.length === 0 ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted-foreground)" }}>
          <p style={{ fontSize: "1.1rem" }}>No pieces found in this category.</p>
          <Link
            to="/shop"
            style={{
              marginTop: "16px",
              display: "inline-block",
              color: "var(--primary)",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}
          >
            Browse all jewelry
          </Link>
        </div>
      ) : (
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
      )}
    </div>
  );
}