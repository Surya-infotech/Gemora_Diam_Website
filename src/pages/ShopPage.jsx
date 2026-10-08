import { useSearchParams, Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../lib/store";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || null;
  const search = searchParams.get("search")?.toLowerCase().trim() || null;

  const { products, categories, productsLoading } = useStore();

  // Only use dynamic products from Admin Panel
  const allProducts = products || [];

  // Active categories from Admin Panel
  const activeCategories = (categories || []).filter(
    (c) => c && (c.categoryname || typeof c === "string")
  );

  const list = allProducts.filter((p) => {
    if (search) {
      const match =
        (p.name || "").toLowerCase().includes(search) ||
        (p.category || "").toLowerCase().includes(search) ||
        (p.description || "").toLowerCase().includes(search) ||
        (p.sku || "").toLowerCase().includes(search);
      if (!match) return false;
    }
    if (category) {
      const catTrim = category.trim().toLowerCase();
      const matchName = (p.category || "").trim().toLowerCase() === catTrim;
      const matchId = p.categoryid && String(p.categoryid) === String(category);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  const currentCategoryObj = activeCategories.find((c) => {
    const cName = typeof c === "string" ? c : c.categoryname;
    return (
      cName?.trim().toLowerCase() === category?.trim().toLowerCase() ||
      (c.categoryid && String(c.categoryid) === String(category)) ||
      (c._id && String(c._id) === String(category))
    );
  });
  const displayTitle = currentCategoryObj
    ? (typeof currentCategoryObj === "string" ? currentCategoryObj : currentCategoryObj.categoryname)
    : category || "All Jewelry";

  const title = search ? `Search: "${searchParams.get("search")}"` : displayTitle;

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
            borderColor: !category && !search ? "var(--primary)" : "var(--border)",
            backgroundColor: !category && !search ? "var(--primary)" : "transparent",
            color: !category && !search ? "var(--primary-foreground)" : "var(--foreground)",
            padding: "10px 18px",
            borderRadius: "2px",
            transition: "all 0.15s ease"
          }}
        >
          All
        </Link>

        {activeCategories.map((c) => {
          const catName = typeof c === "string" ? c : c.categoryname;
          const isSelected =
            category &&
            (category.trim().toLowerCase() === catName.trim().toLowerCase() ||
              (c.categoryid && String(c.categoryid) === String(category)) ||
              (c._id && String(c._id) === String(category)));

          return (
            <Link
              key={c._id || c.categoryid || catName}
              to={`/shop?category=${encodeURIComponent(catName)}`}
              className="eyebrow"
              style={{
                border: "1px solid",
                borderColor: isSelected ? "var(--primary)" : "var(--border)",
                backgroundColor: isSelected ? "var(--primary)" : "transparent",
                color: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
                padding: "10px 18px",
                borderRadius: "2px",
                transition: "all 0.15s ease"
              }}
            >
              {catName}
            </Link>
          );
        })}
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