import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useStore } from "../lib/store";

function formatTabLabel(type) {
  if (!type) return "General";
  return type
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function FaqPage() {
  const { faqs: storeFaqs } = useStore();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("");
  const [openId, setOpenId] = useState(null);

  // Load from store or fetch from backend
  useEffect(() => {
    if (storeFaqs && storeFaqs.length > 0) {
      setFaqs(storeFaqs);
    } else {
      setLoading(true);
      const url = import.meta.env.VITE_BACKEND_URL;
      fetch(`${url}/Support/GetActiveFAQs`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          const list = Array.isArray(data) ? data : data ? [data] : [];
          setFaqs(list);
        })
        .catch((err) => console.warn("Failed to fetch FAQs:", err))
        .finally(() => setLoading(false));
    }
  }, [storeFaqs]);

  // Extract distinct faqtypes preserving order
  const faqTypes = useMemo(() => {
    const types = [];
    const seen = new Set();
    const activeFaqs = faqs.filter((f) => f && f.status !== false);
    activeFaqs.forEach((f) => {
      const type = (f.faqtype || "General").trim();
      const lower = type.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        types.push(type);
      }
    });
    return types;
  }, [faqs]);

  // Default active tab to the first category
  useEffect(() => {
    if (faqTypes.length > 0 && (!activeType || !faqTypes.some((t) => t.toLowerCase() === activeType.toLowerCase()))) {
      setActiveType(faqTypes[0]);
    }
  }, [faqTypes, activeType]);

  // Filter FAQs for current activeType
  const currentFaqs = useMemo(() => {
    if (!activeType) return [];
    return faqs.filter((f) => {
      if (!f || f.status === false) return false;
      const type = (f.faqtype || "General").trim().toLowerCase();
      return type === activeType.toLowerCase();
    });
  }, [faqs, activeType]);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container-luxury" style={{ maxWidth: "880px", paddingTop: "60px", paddingBottom: "110px" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "44px" }}>
        <p className="eyebrow" style={{ color: "var(--gold-deep)", marginBottom: "10px" }}>
          Help &amp; Support
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.3rem, 4.5vw, 3.4rem)",
            margin: "0 0 14px 0",
            letterSpacing: "-0.01em"
          }}
        >
          Frequently Asked Questions
        </h1>
        <p style={{ color: "#666", fontSize: "0.95rem", maxWidth: "560px", margin: "0 auto" }}>
          Find quick answers to common questions about our certified lab grown diamonds, custom creations, shipping, and care.
        </p>
      </div>

      {loading && faqs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          Loading questions...
        </div>
      ) : faqTypes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <p>No FAQ questions available at this moment.</p>
        </div>
      ) : (
        <>
          {/* FAQ Type Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "36px",
              flexWrap: "wrap",
              borderBottom: "1px solid #eae6df",
              paddingBottom: "4px",
              marginBottom: "36px"
            }}
          >
            {faqTypes.map((type) => {
              const isActive = activeType.toLowerCase() === type.toLowerCase();
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveType(type);
                    setOpenId(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px 4px 16px 4px",
                    fontSize: "1.02rem",
                    letterSpacing: "0.02em",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--primary)" : "#666",
                    borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                    marginBottom: "-5px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#666";
                  }}
                >
                  {formatTabLabel(type)}
                </button>
              );
            })}
          </div>

          {/* Accordion Questions List */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {currentFaqs.map((faq, idx) => {
              const id = faq.faqid || faq._id || idx;
              const isOpen = openId === id;
              return (
                <div
                  key={id}
                  style={{
                    borderBottom: "1px solid #ebebeb",
                    transition: "all 0.2s ease"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "24px 0",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      gap: "20px"
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.18rem",
                        fontWeight: 500,
                        color: "#181818",
                        lineHeight: 1.45
                      }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      strokeWidth={1.5}
                      style={{
                        color: isOpen ? "var(--primary)" : "#888",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease, color 0.2s ease",
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        paddingBottom: "24px",
                        fontSize: "0.95rem",
                        lineHeight: 1.85,
                        color: "#555",
                        whiteSpace: "pre-line"
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Still Have Questions Box */}
      <div
        style={{
          marginTop: "70px",
          textAlign: "center",
          padding: "36px 24px",
          backgroundColor: "#fbf9f6",
          border: "1px solid #f0ece3",
          borderRadius: "3px"
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.35rem",
            marginBottom: "8px",
            color: "#181818"
          }}
        >
          Still have questions?
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "22px", maxWidth: "520px", margin: "0 auto 22px" }}>
          Can&apos;t find what you&apos;re looking for? Please contact our friendly concierge specialists.
        </p>
        <Link
          to="/contact"
          className="eyebrow"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            fontSize: "0.82rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            textDecoration: "none",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Contact Concierge
        </Link>
      </div>
    </div>
  );
}