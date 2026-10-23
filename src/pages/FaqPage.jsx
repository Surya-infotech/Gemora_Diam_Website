import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
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
  const [fetchedFaqs, setFetchedFaqs] = useState([]);
  const [loading, setLoading] = useState(() => !storeFaqs || storeFaqs.length === 0);
  const [userSelectedType, setUserSelectedType] = useState("");
  const [openId, setOpenId] = useState(null);

  const faqs = storeFaqs && storeFaqs.length > 0 ? storeFaqs : fetchedFaqs;

  // Load from backend if store hasn't populated yet
  useEffect(() => {
    if (!storeFaqs || storeFaqs.length === 0) {
      const url = import.meta.env.VITE_BACKEND_URL;
      fetch(`${url}/Support/GetActiveFAQs`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          const list = Array.isArray(data) ? data : data ? [data] : [];
          setFetchedFaqs(list);
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

  // Derive active type without cascading effect
  const activeType = useMemo(() => {
    if (userSelectedType && faqTypes.some((t) => t.toLowerCase() === userSelectedType.toLowerCase())) {
      return userSelectedType;
    }
    return faqTypes[0] || "";
  }, [userSelectedType, faqTypes]);

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
    <div style={{ backgroundColor: "#FAF9F6", minHeight: "100vh", color: "var(--foreground)" }}>
      <div className="container-luxury" style={{ maxWidth: "860px", paddingTop: "clamp(54px, 7vw, 84px)", paddingBottom: "110px" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "42px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(85, 104, 50, 0.08)",
              border: "1px solid rgba(85, 104, 50, 0.2)",
              marginBottom: "18px"
            }}
          >
            <Sparkles size={13} style={{ color: "var(--primary)" }} />
            <span
              className="eyebrow"
              style={{
                color: "var(--primary)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.20em"
              }}
            >
              HELP &amp; SUPPORT
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 4.6vw, 3.6rem)",
              fontWeight: 500,
              color: "var(--foreground)",
              lineHeight: 1.15,
              margin: "0 0 16px 0",
              letterSpacing: "-0.015em"
            }}
          >
            Frequently Asked Questions
          </h1>

          <p
            style={{
              fontSize: "clamp(0.92rem, 1.3vw, 1.05rem)",
              color: "var(--muted-foreground)",
              maxWidth: "620px",
              margin: "0 auto",
              lineHeight: 1.65
            }}
          >
            Find quick answers to common questions about our certified lab grown diamonds, custom creations, shipping, and care.
          </p>
        </div>

        {loading && faqs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 0", color: "var(--muted-foreground)" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid #EDE8DE",
                borderTopColor: "var(--primary)",
                margin: "0 auto 16px",
                animation: "spin 0.9s linear infinite"
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: "0.92rem" }}>Loading questions...</p>
          </div>
        ) : faqTypes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #EDE8DE"
            }}
          >
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem", margin: 0 }}>
              No FAQ questions available at this moment.
            </p>
          </div>
        ) : (
          <>
            {/* FAQ Type Tabs */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "38px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "#FAF9F6",
                  border: "1px solid #EDE8DE",
                  borderRadius: "999px",
                  padding: "5px",
                  gap: "4px",
                  flexWrap: "wrap",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)"
                }}
              >
                {faqTypes.map((type) => {
                  const isActive = activeType.toLowerCase() === type.toLowerCase();
                  const typeCount = faqs.filter(
                    (f) => f && f.status !== false && (f.faqtype || "General").trim().toLowerCase() === type.toLowerCase()
                  ).length;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setUserSelectedType(type);
                        setOpenId(null);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "9px 22px",
                        borderRadius: "999px",
                        border: isActive ? "1px solid rgba(85, 104, 50, 0.25)" : "1px solid transparent",
                        backgroundColor: isActive ? "#ffffff" : "transparent",
                        color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.86rem",
                        letterSpacing: "0.02em",
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                        boxShadow: isActive ? "0 2px 10px rgba(85, 104, 50, 0.08)" : "none"
                      }}
                    >
                      <span>{formatTabLabel(type)}</span>
                      {typeCount > 0 && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            padding: "2px 7px",
                            borderRadius: "999px",
                            backgroundColor: isActive ? "rgba(85, 104, 50, 0.12)" : "rgba(0, 0, 0, 0.05)",
                            color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                            fontWeight: 600
                          }}
                        >
                          {typeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accordion Questions List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentFaqs.map((faq, idx) => {
                const id = faq.faqid || faq._id || idx;
                const isOpen = openId === id;

                return (
                  <div
                    key={id}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "14px",
                      border: isOpen ? "1.5px solid var(--primary)" : "1px solid #EDE8DE",
                      boxShadow: isOpen
                        ? "0 8px 24px rgba(85, 104, 50, 0.08)"
                        : "0 2px 6px rgba(0, 0, 0, 0.02)",
                      overflow: "hidden",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
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
                        padding: "20px 24px",
                        background: isOpen ? "linear-gradient(180deg, #FAF9F6 0%, #FFFFFF 100%)" : "transparent",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        gap: "18px",
                        transition: "background 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "0.86rem",
                            color: isOpen ? "var(--primary)" : "var(--gold-deep)",
                            fontWeight: 700,
                            marginTop: "3px",
                            flexShrink: 0
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.15rem",
                            fontWeight: 600,
                            color: isOpen ? "var(--primary)" : "var(--foreground)",
                            lineHeight: 1.45,
                            transition: "color 0.2s ease"
                          }}
                        >
                          {faq.question}
                        </span>
                      </div>

                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: isOpen ? "var(--primary)" : "#FAF9F6",
                          border: isOpen ? "1px solid var(--primary)" : "1px solid #EDE8DE",
                          color: isOpen ? "#ffffff" : "var(--muted-foreground)",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          transition: "all 0.25s ease"
                        }}
                      >
                        <ChevronDown
                          size={16}
                          strokeWidth={2}
                          style={{
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          padding: "0 24px 22px 24px",
                          borderTop: "1px solid #F2EEE6"
                        }}
                      >
                        <div
                          style={{
                            paddingTop: "16px",
                            paddingLeft: "32px",
                            fontSize: "0.94rem",
                            lineHeight: 1.8,
                            color: "#4A5243",
                            whiteSpace: "pre-line"
                          }}
                        >
                          {faq.answer}
                        </div>
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
            marginTop: "64px",
            textAlign: "center",
            padding: "40px 28px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
            border: "1px solid #EDE8DE",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)"
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "rgba(85, 104, 50, 0.09)",
              border: "1px solid rgba(85, 104, 50, 0.2)",
              display: "grid",
              placeItems: "center",
              color: "var(--primary)",
              margin: "0 auto 16px"
            }}
          >
            <MessageCircle size={22} strokeWidth={1.8} />
          </div>

          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.65rem",
              fontWeight: 600,
              margin: "0 0 8px 0",
              color: "var(--foreground)",
              letterSpacing: "-0.01em"
            }}
          >
            Still have questions?
          </h3>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--muted-foreground)",
              maxWidth: "500px",
              margin: "0 auto 22px",
              lineHeight: 1.6
            }}
          >
            Can&apos;t find what you&apos;re looking for? Please contact our friendly concierge specialists.
          </p>

          <Link
            to="/contact"
            className="eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              padding: "13px 30px",
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              fontWeight: 700,
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(85, 104, 50, 0.25)",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-hover)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(85, 104, 50, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(85, 104, 50, 0.25)";
            }}
          >
            <span>Contact Concierge</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}