import { useEffect } from "react";
import { useSearchParams, useParams, Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../lib/store";
import { slugify } from "../lib/slugify";

function normalizeStyleName(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[-_]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\brings\b/g, "ring")
    .replace(/\bbands\b/g, "band")
    .replace(/\bhalos\b/g, "halo")
    .trim();
}

function normalizeShapeName(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[-_]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\bcuts?\b/g, "")
    .replace(/\bdiamonds?\b/g, "")
    .trim();
}

export default function CollectionsPage({ slugOverride = null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const navigate = useNavigate();
  const { products, categories, menus, productsLoading } = useStore();

  const rawSlug = (slugOverride || routeParams.slug || "").trim().toLowerCase().replace(/^\//, "");
  const slug = rawSlug.replace(/^collections?\//, "");

  // 1. Resolve filters and title from clean slug or query params
  let category = searchParams.get("category") || null;
  let search = searchParams.get("search")?.toLowerCase().trim() || null;
  let shape = searchParams.get("shape")?.trim() || null;
  let style = searchParams.get("style")?.trim() || null;
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

    const matchedMenu = (menus || []).find((m) => getCleanSlug(m.slug || m.title) === slug);
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
        const found = allItems.find((it) => {
          const itemClean = getCleanSlug(it.slug);
          return itemClean === slug || normalizeStyleName(itemClean) === normalizeStyleName(slug);
        });
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

  // Normalize style array
  const resolvedStyleArr = style
    ? (Array.isArray(style)
      ? style
      : String(style).split(",").map((s) => s.trim())
    ).filter(Boolean)
    : null;

  // Normalize shape array
  const resolvedShapeArr = shape
    ? (Array.isArray(shape)
      ? shape
      : String(shape).split(",").map((s) => s.trim())
    ).filter(Boolean)
    : null;

  // 2. Filter products based on resolved parameters
  const list = allProducts.filter((p) => {
    if (search) {
      const sLower = String(search).toLowerCase().trim();
      const match =
        (p.name || "").toLowerCase().includes(sLower) ||
        (p.category || "").toLowerCase().includes(sLower) ||
        (p.description || "").toLowerCase().includes(sLower) ||
        (p.subcategory || "").toLowerCase().includes(sLower) ||
        (p.sku || "").toLowerCase().includes(sLower);
      if (!match) return false;
    }

    if (category) {
      const catTrim = String(category).trim().toLowerCase();
      const normCat = catTrim.replace(/s\b/g, "");
      const prodCat = String(p.category || "").trim().toLowerCase().replace(/s\b/g, "");
      const matchName =
        prodCat === normCat ||
        (normCat.includes("ring") && prodCat.includes("ring")) ||
        (normCat.includes("bridal") && prodCat.includes("bridal")) ||
        (normCat.includes("bracelet") && prodCat.includes("bracelet")) ||
        (normCat.includes("earing") && prodCat.includes("earing")) ||
        (normCat.includes("earring") && prodCat.includes("earring")) ||
        (normCat.includes("pendant") && prodCat.includes("pendant"));
      const matchId = p.categoryid && String(p.categoryid) === String(category);
      if (!matchName && !matchId) return false;
    }

    if (resolvedShapeArr && resolvedShapeArr.length > 0) {
      const normalizedShapes = resolvedShapeArr
        .map((s) => normalizeShapeName(s))
        .filter(Boolean);

      const prodShapes = (p.shapes || [])
        .map((s) => normalizeShapeName(typeof s === "object" ? s.shapename : s))
        .filter(Boolean);

      let matchShape = false;
      if (prodShapes.length > 0) {
        matchShape = normalizedShapes.some((sh) =>
          prodShapes.some((ps) => ps === sh || ps.replace(/\s+/g, "") === sh.replace(/\s+/g, ""))
        );
      } else {
        const normName = normalizeShapeName(p.name);
        matchShape = normalizedShapes.some((sh) => {
          const escaped = sh.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const reg = new RegExp(`(^|\\b)${escaped}(\\b|$)`, "i");
          return reg.test(normName);
        });
      }
      if (!matchShape) return false;
    }

    if (resolvedStyleArr && resolvedStyleArr.length > 0) {
      const normalizedStyles = resolvedStyleArr
        .map((s) => normalizeStyleName(s))
        .filter(Boolean);

      const prodStyles = (p.styles || [])
        .map((s) => normalizeStyleName(typeof s === "object" ? s.stylename : s))
        .filter(Boolean);

      let matchStyle = false;
      if (prodStyles.length > 0) {
        // Strict match against product's configured styles from admin panel
        matchStyle = normalizedStyles.some((st) => prodStyles.includes(st));
      } else {
        // Fallback only if product has NO styles configured in admin:
        const normName = normalizeStyleName(p.name);
        matchStyle = normalizedStyles.some((st) => {
          const escaped = st.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const reg = new RegExp(`(^|\\b)${escaped}(\\b|$)`, "i");
          return reg.test(normName);
        });
      }
      if (!matchStyle) return false;
    }

    if (resolvedAttributeFilters && resolvedAttributeFilters.length > 0) {
      for (const rf of resolvedAttributeFilters) {
        if (!rf.values || rf.values.length === 0) continue;
        const type = (rf.type || "").toLowerCase().trim();
        const vals = rf.values.map((v) => String(v).toLowerCase().trim());

        let matches;
        if (type.includes("clarity")) {
          matches = (p.clarities || []).some((c) =>
            vals.includes(String(c).toLowerCase().trim())
          );
        } else if (type.includes("metal")) {
          matches = (p.metals || []).some((m) =>
            vals.some((v) => {
              const mNorm = String(m).toLowerCase().trim();
              return mNorm === v || mNorm.replace(/\s+/g, "") === v.replace(/\s+/g, "");
            })
          );
        } else if (type.includes("stone")) {
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
    else if (resolvedShapeArr && resolvedShapeArr.length > 0) title = `${resolvedShapeArr[0].charAt(0).toUpperCase() + resolvedShapeArr[0].slice(1)} Cut Diamonds`;
    else if (resolvedStyleArr && resolvedStyleArr.length > 0) title = `${resolvedStyleArr[0].charAt(0).toUpperCase() + resolvedStyleArr[0].slice(1)} Style`;
    else if (featured === "bestseller") title = "Best Sellers";
    else if (featured === "new") title = "New Arrivals";
  }

  const handleRemoveFilter = (filterKey) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextParams.has(filterKey)) {
      nextParams.delete(filterKey);
      setSearchParams(nextParams);
    } else {
      // If this filter was resolved from the URL slug, navigate to base collections page
      navigate("/collection");
    }
  };

  useEffect(() => {
    document.title = `${title} | Gemora Diam Fine Jewelry`;
  }, [title]);

  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "120px" }}>
      {/* Page Header */}
      <div style={{ maxWidth: "700px" }}>
        <p
          className="eyebrow"
          style={{
            color: "var(--gold-deep)",
            marginBottom: "8px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase"
          }}
        >
          <span style={{ height: "1px", width: "20px", backgroundColor: "var(--gold)" }} />
          The Collection Archive
          <span style={{ height: "1px", width: "20px", backgroundColor: "var(--gold)" }} />
        </p>
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
        {((resolvedShapeArr && resolvedShapeArr.length > 0) || (resolvedStyleArr && resolvedStyleArr.length > 0) || featured || category || search || (resolvedAttributeFilters && resolvedAttributeFilters.length > 0)) && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px", alignItems: "center" }}>
            <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)", fontWeight: 600 }}>
              Active Filter:
            </span>
            {category && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Category: {category}
                <button onClick={() => handleRemoveFilter("category")} aria-label="Remove category filter" style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {resolvedShapeArr && resolvedShapeArr.length > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Shape: {resolvedShapeArr.join(", ")}
                <button onClick={() => handleRemoveFilter("shape")} aria-label="Remove shape filter" style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {resolvedStyleArr && resolvedStyleArr.length > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Style: {resolvedStyleArr.join(", ")}
                <button onClick={() => handleRemoveFilter("style")} aria-label="Remove style filter" style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {resolvedAttributeFilters && resolvedAttributeFilters.map((rf, rIdx) => (
              <span key={rIdx} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600, textTransform: "capitalize" }}>
                {rf.type}: {Array.isArray(rf.values) ? rf.values.join(", ") : rf.values}
                <button onClick={() => handleRemoveFilter(rf.type)} aria-label={`Remove ${rf.type} filter`} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            ))}
            {featured && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Featured: {featured}
                <button onClick={() => handleRemoveFilter("featured")} aria-label="Remove featured filter" style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            {search && !slug && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f2eee6", padding: "4px 10px", borderRadius: "50px", fontSize: "0.78rem", fontWeight: 600 }}>
                Keyword: "{search}"
                <button onClick={() => handleRemoveFilter("search")} aria-label="Remove search filter" style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><X size={13} /></button>
              </span>
            )}
            <Link to="/collection" style={{ fontSize: "0.74rem", color: "var(--primary)", textDecoration: "underline", marginLeft: "4px" }}>
              Clear All
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Tabs Bar matching Home Page BestSeller section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #ebe5da",
          marginTop: "clamp(24px, 4vw, 36px)",
          marginBottom: "32px",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >
        {/* Category Tabs */}
        <div
          className="no-scrollbar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {/* All Pieces Tab */}
          {(() => {
            const isAllActive = !category && !search && !slug;
            return (
              <Link
                to="/collection"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.85rem",
                  fontWeight: isAllActive ? 600 : 400,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isAllActive ? "#1a1a1a" : "#777777",
                  textDecoration: "none",
                  padding: "0 0 12px 0",
                  borderBottom: isAllActive ? "2px solid #1a1a1a" : "2px solid transparent",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!isAllActive) e.currentTarget.style.color = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                  if (!isAllActive) e.currentTarget.style.color = "#777777";
                }}
              >
                All Pieces
              </Link>
            );
          })()}

          {/* Dynamic Active Categories */}
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
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.85rem",
                  fontWeight: isSelected ? 600 : 400,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isSelected ? "#1a1a1a" : "#777777",
                  textDecoration: "none",
                  padding: "0 0 12px 0",
                  borderBottom: isSelected ? "2px solid #1a1a1a" : "2px solid transparent",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.color = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.color = "#777777";
                }}
              >
                {catName}
              </Link>
            );
          })}
        </div>

        {/* Piece Count Indicator */}
        <div
          style={{
            fontSize: "0.80rem",
            color: "var(--muted-foreground)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            paddingBottom: "12px",
            whiteSpace: "nowrap"
          }}
        >
          {productsLoading ? "Loading collection..." : `${list.length} ${list.length === 1 ? "piece" : "pieces"} available`}
        </div>
      </div>

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
              borderRadius: "4px",
              letterSpacing: "0.16em",
              textDecoration: "none"
            }}
          >
            Browse all collections
          </Link>
        </div>
      ) : (
        <div className="bestseller-grid">
          {list.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}