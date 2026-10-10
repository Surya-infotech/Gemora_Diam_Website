import { useSearchParams, Link } from "react-router-dom";
import { X } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../lib/store";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || null;
  const search = searchParams.get("search")?.toLowerCase().trim() || null;
  const shape = searchParams.get("shape")?.toLowerCase().trim() || null;
  const style = searchParams.get("style")?.toLowerCase().trim() || null;
  const featured = searchParams.get("featured")?.toLowerCase().trim() || null;

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
      const matchName = (p.category || "").trim().toLowerCase() === catTrim ||
        (catTrim.includes("ring") && (p.category || "").toLowerCase().includes("ring")) ||
        (catTrim.includes("bridal") && (p.category || "").toLowerCase().includes("bridal"));
      const matchId = p.categoryid && String(p.categoryid) === String(category);
      if (!matchName && !matchId) return false;
    }
    if (shape) {
      const matchShape =
        (p.shapes || []).some((s) => s.toLowerCase().includes(shape) || shape.includes(s.toLowerCase())) ||
        (p.name || "").toLowerCase().includes(shape) ||
        (p.description || "").toLowerCase().includes(shape);
      if (!matchShape) return false;
    }
    if (style) {
      const matchStyle =
        (p.styles || []).some((s) => s.toLowerCase().includes(style) || style.includes(s.toLowerCase())) ||
        (p.name || "").toLowerCase().includes(style) ||
        (p.description || "").toLowerCase().includes(style);
      if (!matchStyle) return false;
    }
    if (featured === "bestseller" && !p.bestseller) {
      return false;
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
    : category || "All Collections";

  let title = displayTitle;
  if (search) title = `Search: "${searchParams.get("search")}"`;
  else if (shape) title = `${shape.charAt(0).toUpperCase() + shape.slice(1)} Cut Diamonds`;
  else if (style) title = `${style.charAt(0).toUpperCase() + style.slice(1)} Style`;
  else if (featured === "bestseller") title = "Atelier Best Sellers";
  else if (featured === "new") title = "New Atelier Arrivals";

  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "120px" }}>
      {/* Page Header */}
      <div style={{ maxWidth: "700px" }}>
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
          <span>THE ATELIER ARCHIVE</span>
          <span>✦</span>
        </span>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
            marginTop: "12px",
            lineHeight: 1.1,
            fontWeight: 400
          }}
        >
          {title}
        </h1>
        {currentCategoryObj && typeof currentCategoryObj === "object" && currentCategoryObj.description?.trim() ? (
          <p style={{ marginTop: "12px", fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            {currentCategoryObj.description.trim()}
          </p>
        ) : null}

        {/* Active Filter Chips */}
        {(shape || style || featured || category || search) && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px", alignItems: "center" }}>
            <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)", fontWeight: 600 }}>
              Active Filter:
            </span>
            {category && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Category: {category}
                <button onClick={() => { searchParams.delete("category"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {shape && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Shape: {shape}
                <button onClick={() => { searchParams.delete("shape"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {style && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Style: {style}
                <button onClick={() => { searchParams.delete("style"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {featured && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Featured: {featured}
                <button onClick={() => { searchParams.delete("featured"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {search && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Keyword: "{search}"
                <button onClick={() => { searchParams.delete("search"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            <Link to="/collections" style={{ fontSize: "0.74rem", color: "var(--primary)", textDecoration: "underline", marginLeft: "4px" }}>
              Clear All
            </Link>
          </div>
        )}
      </div>

      {/* Filter Tabs Bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          borderBottom: "1px solid #EDE8DE",
          paddingBottom: "24px",
          marginTop: "40px"
        }}
      >
        <Link
          to="/collections"
          className="eyebrow"
          style={{
            border: "1px solid",
            borderColor: !category && !search ? "var(--primary)" : "#E5DFD3",
            backgroundColor: !category && !search ? "var(--primary)" : "#FAF8F5",
            color: !category && !search ? "#ffffff" : "var(--foreground)",
            padding: "10px 22px",
            borderRadius: "50px",
            fontSize: "0.76rem",
            letterSpacing: "0.16em",
            transition: "all 0.25s ease",
            boxShadow: !category && !search ? "0 4px 14px rgba(85, 104, 50, 0.25)" : "none"
          }}
        >
          All Pieces
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
              to={`/collections?category=${encodeURIComponent(catName)}`}
              className="eyebrow"
              style={{
                border: "1px solid",
                borderColor: isSelected ? "var(--primary)" : "#E5DFD3",
                backgroundColor: isSelected ? "var(--primary)" : "#FAF8F5",
                color: isSelected ? "#ffffff" : "var(--foreground)",
                padding: "10px 22px",
                borderRadius: "50px",
                fontSize: "0.76rem",
                letterSpacing: "0.16em",
                transition: "all 0.25s ease",
                boxShadow: isSelected ? "0 4px 14px rgba(85, 104, 50, 0.25)" : "none"
              }}
            >
              {catName}
            </Link>
          );
        })}
      </div>

      {/* Piece Count Indicator */}
      <p style={{ marginTop: "24px", fontSize: "0.84rem", color: "var(--muted-foreground)" }}>
        {productsLoading ? "Loading collection..." : `${list.length} ${list.length === 1 ? "piece" : "pieces"} available`}
      </p>

      {/* Product Grid */}
      {list.length === 0 ? (
        <div style={{ padding: "80px 0", textAlign: "center", color: "var(--muted-foreground)" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--foreground)" }}>
            No pieces found in this collection
          </p>
          <Link
            to="/collections"
            className="eyebrow"
            style={{
              marginTop: "20px",
              display: "inline-block",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "2px",
              letterSpacing: "0.16em"
            }}
          >
            Browse all collections
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
            gap: "clamp(24px, 3vw, 36px) clamp(16px, 2vw, 28px)",
            marginTop: "28px"
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