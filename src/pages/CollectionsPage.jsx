import { useEffect } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import { X } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../lib/store";
import { slugify } from "../lib/slugify";

export default function CollectionsPage({ slugOverride = null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const { products, categories, menus, productsLoading } = useStore();

  const rawSlug = (slugOverride || routeParams.slug || "").trim().toLowerCase().replace(/^\//, "");
  const slug = rawSlug.replace(/^collections?\//, "");

  // 1. Resolve filters and title from clean slug or query params
  let category = searchParams.get("category") || null;
  let search = searchParams.get("search")?.toLowerCase().trim() || null;
  let shape = searchParams.get("shape")?.toLowerCase().trim() || null;
  let style = searchParams.get("style")?.toLowerCase().trim() || null;
  let featured = searchParams.get("featured")?.toLowerCase().trim() || null;
  let customTitle = null;
  let resolvedAttributeFilters = [];

  const clarityParam = searchParams.get("clarity")?.trim();
  if (clarityParam) {
    resolvedAttributeFilters.push({ type: "clarity", values: [clarityParam] });
  }
  const metalParam = searchParams.get("metal")?.trim();
  if (metalParam) {
    resolvedAttributeFilters.push({ type: "metal", values: [metalParam] });
  }
  const stoneParam = searchParams.get("stone")?.trim();
  if (stoneParam) {
    resolvedAttributeFilters.push({ type: "stone", values: [stoneParam] });
  }

  // Active categories from Admin Panel
  const allProducts = products || [];
  const activeCategories = (categories || []).filter(
    (c) => c && (c.categoryname || typeof c === "string")
  );

  if (slug && slug !== "collections" && slug !== "collection") {
    // A. Check if slug matches any Menu Tab in backend menus
    const getCleanSlug = (s) => {
      const val = s && typeof s === "object" ? (s.value || s.label || s.slug || "") : (s || "");
      return String(val).toLowerCase().replace(/^\//, "").replace(/^collections?\//, "");
    };

    const matchedMenu = (menus || []).find((m) => getCleanSlug(m.slug) === slug);
    if (matchedMenu) {
      const titleStr = typeof matchedMenu.title === "object" ? (matchedMenu.title?.value || matchedMenu.title?.label || "") : (matchedMenu.title || "");
      customTitle = titleStr;
      category = titleStr;
    }

    // B. Check if slug matches any item inside menus (Column 1, 2, or 3)
    if (!customTitle) {
      for (const m of (menus || [])) {
        const allItems = [
          ...(m.column1?.items || []),
          ...(m.column2?.items || []),
          ...(m.column3?.items || [])
        ];
        const found = allItems.find((it) => getCleanSlug(it.slug) === slug);
        if (found) {
          const rawLabel = typeof found.label === "object" ? (found.label?.value || found.label?.label || "") : String(found.label || "");
          customTitle = rawLabel;
          const rawFType = typeof found.filterType === "object" ? (found.filterType?.value || found.filterType?.label || "") : (found.filterType || "style");
          const fType = String(rawFType).toLowerCase().replace(/[^a-z]/g, "");
          let rawVal = found.filterValue;
          if (rawVal && typeof rawVal === "object" && !Array.isArray(rawVal)) {
            rawVal = rawVal.value || rawVal.label || "";
          }
          const fVals = Array.isArray(rawVal)
            ? rawVal.map((v) => (typeof v === "object" ? v?.value || v?.label || "" : String(v || ""))).filter(Boolean)
            : (typeof rawVal === "string" && rawVal.trim()
                ? rawVal.split(",").map((s) => s.trim()).filter(Boolean)
                : (rawVal ? [String(rawVal)] : (rawLabel ? [rawLabel] : [])));

          if (fType === "style") {
            style = fVals.length > 0 ? fVals : (rawLabel || null);
          } else if (fType === "shape") {
            const rawShape = typeof found.shape === "object" ? (found.shape?.value || found.shape?.label || "") : (found.shape || "");
            shape = fVals.length > 0 ? fVals : (rawShape ? [String(rawShape)] : (rawLabel ? [rawLabel] : null));
          } else if (fType === "category") {
            category = fVals.length > 0 ? fVals[0] : (rawLabel || null);
          } else if (fType === "subcategory" || fType === "search") {
            search = fVals.length > 0 ? fVals.join(" ").toLowerCase() : (rawLabel ? rawLabel.toLowerCase() : null);
          } else if (fType === "featured") {
            featured = fVals[0] || "bestseller";
          } else {
            // General attribute filter (metal, diamondsize, clarity, color, stone, etc.)
            resolvedAttributeFilters.push({ type: fType, values: fVals });
          }
          break;
        }
      }
    }

    // C. Check if slug matches an active Category
    if (!customTitle) {
      const foundCat = activeCategories.find((c) => {
        const cName = typeof c === "string" ? c : c.categoryname;
        return slugify(cName).replace(/^collections?\//, "") === slug;
      });
      if (foundCat) {
        const catName = typeof foundCat === "string" ? foundCat : foundCat.categoryname;
        category = catName;
        customTitle = catName;
      }
    }

    // D. Check if slug matches known diamond shapes
    if (!customTitle) {
      const knownShapes = ["round", "emerald", "oval", "cushion", "princess", "pear", "radiant", "marquise", "heart", "asscher", "baguette"];
      const matchedShape = knownShapes.find((s) => slug.includes(s));
      if (matchedShape) {
        shape = matchedShape;
        customTitle = `${matchedShape.charAt(0).toUpperCase() + matchedShape.slice(1)} Cut Diamonds`;
      }
    }

    // E. Fallback title formatting if still not resolved
    if (!customTitle) {
      customTitle = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      // Try search match
      const stripped = customTitle.replace(/ Rings| Bands| Diamonds| Collection| Jewelry/gi, "").trim().toLowerCase();
      if (stripped) {
        search = stripped;
      }
    }
  }

  // 2. Filter products based on resolved parameters
  const list = allProducts.filter((p) => {
    if (search) {
      const match =
        (p.name || "").toLowerCase().includes(search) ||
        (p.category || "").toLowerCase().includes(search) ||
        (p.description || "").toLowerCase().includes(search) ||
        (p.subcategory || "").toLowerCase().includes(search) ||
        (p.sku || "").toLowerCase().includes(search);
      if (!match) return false;
    }
    if (category) {
      const catTrim = category.trim().toLowerCase();
      const matchName =
        (p.category || "").trim().toLowerCase() === catTrim ||
        (catTrim.includes("ring") && (p.category || "").toLowerCase().includes("ring")) ||
        (catTrim.includes("bridal") && (p.category || "").toLowerCase().includes("bridal")) ||
        (catTrim.includes("bracelets") && (p.category || "").toLowerCase().includes("bracelets")) ||
        (catTrim.includes("earrings") && (p.category || "").toLowerCase().includes("earrings"));
      const matchId = p.categoryid && String(p.categoryid) === String(category);
      if (!matchName && !matchId) return false;
    }
    if (shape) {
      const shapeArr = Array.isArray(shape) ? shape.map((s) => String(s).toLowerCase()) : [String(shape).toLowerCase()];
      const matchShape = shapeArr.some((sh) =>
        (p.shapes || []).some((s) => String(s).toLowerCase().includes(sh) || sh.includes(String(s).toLowerCase())) ||
        (p.name || "").toLowerCase().includes(sh) ||
        (p.description || "").toLowerCase().includes(sh)
      );
      if (!matchShape) return false;
    }
    if (style) {
      const styleArr = Array.isArray(style) ? style.map((s) => String(s).toLowerCase()) : [String(style).toLowerCase()];
      const matchStyle = styleArr.some((st) =>
        (p.styles || []).some((s) => String(s).toLowerCase().includes(st) || st.includes(String(s).toLowerCase())) ||
        (p.name || "").toLowerCase().includes(st) ||
        (p.description || "").toLowerCase().includes(st)
      );
      if (!matchStyle) return false;
    }
    if (resolvedAttributeFilters && resolvedAttributeFilters.length > 0) {
      for (const rf of resolvedAttributeFilters) {
        if (!rf.values || rf.values.length === 0) continue;
        const type = (rf.type || "").toLowerCase().trim();
        const vals = rf.values.map((v) => String(v).toLowerCase().trim());

        let matches = false;
        if (type.includes("clarity")) {
          // Exact match on clarity name (e.g. "vs1" must not match "vvs1")
          matches = (p.clarities || []).some((c) =>
            vals.includes(String(c).toLowerCase().trim())
          );
        } else if (type.includes("metal")) {
          // Match metal name exactly or normalized
          matches = (p.metals || []).some((m) =>
            vals.some((v) => {
              const mNorm = String(m).toLowerCase().trim();
              return mNorm === v || mNorm.replace(/\s+/g, "") === v.replace(/\s+/g, "");
            })
          );
        } else if (type.includes("stone")) {
          // Match stone name exactly
          matches = (p.stones || []).some((s) =>
            vals.includes(String(s).toLowerCase().trim())
          );
        } else if (type.includes("diamondcolor") || type === "color") {
          matches =
            (p.diamondColors || []).some((c) => vals.includes(String(c).toLowerCase().trim())) ||
            (p.bandColors || []).some((c) => vals.includes(String(c).toLowerCase().trim()));
        } else if (type.includes("bandcolor")) {
          matches = (p.bandColors || []).some((c) =>
            vals.includes(String(c).toLowerCase().trim())
          );
        } else if (type.includes("size") || type.includes("ringsize")) {
          matches = (p.ringSizes || []).some((s) =>
            vals.includes(String(s).toLowerCase().trim())
          );
        } else {
          // Fallback exact word/token matching rather than loose substring match
          const jsonStr = JSON.stringify(p);
          matches = vals.some((v) => {
            const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const reg = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, "i");
            return reg.test(jsonStr);
          });
        }
        if (!matches) return false;
      }
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

  const displayTitle = customTitle || (currentCategoryObj
    ? (typeof currentCategoryObj === "string" ? currentCategoryObj : currentCategoryObj.categoryname)
    : category || "All Collections");

  let title = displayTitle;
  if (!customTitle) {
    if (searchParams.get("search")) title = `Search: "${searchParams.get("search")}"`;
    else if (shape) title = `${shape.charAt(0).toUpperCase() + shape.slice(1)} Cut Diamonds`;
    else if (style) title = `${style.charAt(0).toUpperCase() + style.slice(1)} Style`;
    else if (featured === "bestseller") title = "Atelier Best Sellers";
    else if (featured === "new") title = "New Atelier Arrivals";
  }

  useEffect(() => {
    document.title = `${title} | Gemora Diam Haute Joaillerie`;
  }, [title]);

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
        {(shape || style || featured || category || search || (resolvedAttributeFilters && resolvedAttributeFilters.length > 0)) && (
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
                Shape: {Array.isArray(shape) ? shape.join(", ") : shape}
                <button onClick={() => { searchParams.delete("shape"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {style && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Style: {Array.isArray(style) ? style.join(", ") : style}
                <button onClick={() => { searchParams.delete("style"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {resolvedAttributeFilters && resolvedAttributeFilters.map((rf, rIdx) => (
              <span key={rIdx} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600, textTransform: "capitalize" }}>
                {rf.type}: {Array.isArray(rf.values) ? rf.values.join(", ") : rf.values}
              </span>
            ))}
            {featured && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Featured: {featured}
                <button onClick={() => { searchParams.delete("featured"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {search && !slug && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Keyword: "{search}"
                <button onClick={() => { searchParams.delete("search"); setSearchParams(searchParams); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            <Link to="/collection" style={{ fontSize: "0.74rem", color: "var(--primary)", textDecoration: "underline", marginLeft: "4px" }}>
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
          to="/collection"
          className="eyebrow"
          style={{
            border: "1px solid",
            borderColor: !category && !search && !slug ? "var(--primary)" : "#E5DFD3",
            backgroundColor: !category && !search && !slug ? "var(--primary)" : "#FAF8F5",
            color: !category && !search && !slug ? "#ffffff" : "var(--foreground)",
            padding: "10px 22px",
            borderRadius: "50px",
            fontSize: "0.76rem",
            letterSpacing: "0.16em",
            transition: "all 0.25s ease",
            boxShadow: !category && !search && !slug ? "0 4px 14px rgba(85, 104, 50, 0.25)" : "none"
          }}
        >
          All Pieces
        </Link>

        {activeCategories.map((c) => {
          const catName = typeof c === "string" ? c : c.categoryname;
          const isSelected =
            (category &&
              (category.trim().toLowerCase() === catName.trim().toLowerCase() ||
                (c.categoryid && String(c.categoryid) === String(category)) ||
                (c._id && String(c._id) === String(category)))) ||
            slug === slugify(catName);

          const cleanCatSlug = `/collection/${slugify(catName)}`;

          return (
            <Link
              key={c._id || c.categoryid || catName}
              to={cleanCatSlug}
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
            to="/collection"
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