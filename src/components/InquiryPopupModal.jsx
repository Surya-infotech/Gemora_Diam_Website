import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X, Gem, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { useStore } from "../lib/store";

const validate = (f) => ({
  name: f.name.trim().length < 2 ? "Please enter your full name" : "",
  email: !/^\S+@\S+\.\S+$/.test(f.email) ? "Enter a valid email address" : "",
  message: f.message.trim().length < 10 ? "Please share at least a few details (min 10 characters)" : ""
});

export default function InquiryPopupModal() {
  const { submitContactUs, showToast } = useStore();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const errs = validate(f);

  // 2 Minutes delay (120,000 ms) for new users arriving on the site
  useEffect(() => {
    // Check if the user already submitted an inquiry in the past
    const hasSubmitted = localStorage.getItem("gemora_inquiry_submitted");
    if (hasSubmitted) return;

    // Check if the user dismissed the modal in this session
    const hasDismissed = sessionStorage.getItem("gemora_inquiry_dismissed");
    if (hasDismissed) return;

    // Track first visit time in this session
    const visitKey = "gemora_visit_started_at";
    let startTime = sessionStorage.getItem(visitKey);
    if (!startTime) {
      startTime = Date.now().toString();
      sessionStorage.setItem(visitKey, startTime);
    }

    const elapsed = Date.now() - parseInt(startTime, 10);
    const TWO_MINUTES_MS = 2 * 60 * 1000; // 120,000 ms
    const remainingDelay = Math.max(0, TWO_MINUTES_MS - elapsed);

    const timer = setTimeout(() => {
      // Re-check dismiss/submitted status before showing
      if (
        !sessionStorage.getItem("gemora_inquiry_dismissed") &&
        !localStorage.getItem("gemora_inquiry_submitted") &&
        window.location.pathname !== "/contact"
      ) {
        setIsOpen(true);
      }
    }, remainingDelay);

    // Provide testing utility in window for instant preview / verification
    window.openInquiryModal = () => setIsOpen(true);

    return () => clearTimeout(timer);
  }, []);

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("gemora_inquiry_dismissed", "true");
  };

  const onFieldChange = (key, val) => {
    setF((prev) => ({ ...prev, [key]: val }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (Object.values(errs).some(Boolean)) {
      if (typeof showToast === "function") {
        showToast("Please review the highlighted fields", "error");
      }
      return;
    }

    setIsSubmitting(true);
    const res = await submitContactUs({
      name: f.name.trim(),
      email: f.email.trim(),
      message: f.message.trim()
    });
    setIsSubmitting(false);

    if (res?.success) {
      setIsSuccess(true);
      localStorage.setItem("gemora_inquiry_submitted", "true");
      setF({ name: "", email: "", message: "" });
      setTouched({});
      setTimeout(() => {
        handleClose();
      }, 4500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "rgba(18, 26, 15, 0.68)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
        animation: "modalBackdropFade 0.25s ease-out"
      }}
      onClick={handleClose}
    >
      <style>{`
        @keyframes modalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalCardScale {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .inquiry-modal-input {
          width: 100%;
          border: 1px solid #E5DFD5;
          background-color: #FFFFFF;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 0.88rem;
          color: var(--foreground);
          outline: none;
          font-family: var(--font-sans);
          transition: all 0.22s ease;
          box-sizing: border-box;
        }
        .inquiry-modal-input:focus {
          border-color: var(--gold, #C5A059);
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.16);
          background-color: #FFFFFF;
        }
        .inquiry-modal-input::placeholder {
          color: #A3A89E;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E8E2D6",
          width: "100%",
          maxWidth: "540px",
          padding: "clamp(24px, 4vw, 36px)",
          boxShadow: "0 25px 60px -12px rgba(18, 26, 15, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.4) inset",
          animation: "modalCardScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxBox: "border-box",
          maxHeight: "92vh",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close inquiry modal"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid #EAE5DA",
            backgroundColor: "#FAF9F6",
            color: "var(--foreground)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-soft, #f0ece1)";
            e.currentTarget.style.borderColor = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FAF9F6";
            e.currentTarget.style.borderColor = "#EAE5DA";
          }}
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        {isSuccess ? (
          /* Success Confirmation View */
          <div style={{ textAlign: "center", padding: "24px 8px 16px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(85, 104, 50, 0.12)",
                color: "var(--primary)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 18px auto"
              }}
            >
              <CheckCircle2 size={36} strokeWidth={2} />
            </div>

            <span
              className="eyebrow"
              style={{
                color: "var(--primary)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.20em",
                display: "block",
                marginBottom: "8px"
              }}
            >
              INQUIRY RECEIVED
            </span>

            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.75rem",
                fontWeight: 500,
                color: "var(--foreground)",
                margin: "0 0 12px 0"
              }}
            >
              Thank You for Your Vision
            </h3>

            <p
              style={{
                fontSize: "0.92rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.6,
                maxWidth: "420px",
                margin: "0 auto 24px auto"
              }}
            >
              A dedicated Gemora private concierge has received your request and will review your vision within 4 business hours.
            </p>

            <button
              type="button"
              onClick={handleClose}
              style={{
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50px",
                padding: "12px 32px",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.10em",
                cursor: "pointer",
                textTransform: "uppercase"
              }}
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          /* Form Section matching Contact Page */
          <>
            <div style={{ marginBottom: "22px", paddingRight: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <Gem size={16} style={{ color: "var(--primary)" }} />
                <span
                  className="eyebrow"
                  style={{
                    color: "var(--primary)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em"
                  }}
                >
                  DIRECT STUDIO INQUIRY
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.5rem, 3vw, 1.85rem)",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  margin: "0 0 6px 0",
                  lineHeight: 1.2
                }}
              >
                Send a Studio Inquiry
              </h3>
              <p style={{ fontSize: "0.84rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5 }}>
                A dedicated private concierge will review your vision and reply within 4 business hours.
              </p>
            </div>

            <form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                {/* Full Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "6px"
                    }}
                  >
                    Full Name <span style={{ color: "#d9534f" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={f.name}
                    onChange={(e) => onFieldChange("name", e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                    className="inquiry-modal-input"
                    style={{
                      borderColor: touched.name && errs.name ? "#d9534f" : undefined
                    }}
                  />
                  {touched.name && errs.name && (
                    <p style={{ color: "#d9534f", fontSize: "0.72rem", marginTop: "4px", margin: "4px 0 0 0" }}>
                      {errs.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                      marginBottom: "6px"
                    }}
                  >
                    Email Address <span style={{ color: "#d9534f" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. eleanor@gemora.com"
                    value={f.email}
                    onChange={(e) => onFieldChange("email", e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                    className="inquiry-modal-input"
                    style={{
                      borderColor: touched.email && errs.email ? "#d9534f" : undefined
                    }}
                  />
                  {touched.email && errs.email && (
                    <p style={{ color: "#d9534f", fontSize: "0.72rem", marginTop: "4px", margin: "4px 0 0 0" }}>
                      {errs.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Inquiry Message */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--foreground)",
                    marginBottom: "6px"
                  }}
                >
                  Your Vision / Inquiry <span style={{ color: "#d9534f" }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details regarding your preferred diamond shape, carat, setting style, or appointment date..."
                  value={f.message}
                  onChange={(e) => onFieldChange("message", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, message: true }))}
                  className="inquiry-modal-input"
                  style={{
                    borderColor: touched.message && errs.message ? "#d9534f" : undefined,
                    resize: "vertical",
                    minHeight: "85px"
                  }}
                />
                {touched.message && errs.message && (
                  <p style={{ color: "#d9534f", fontSize: "0.72rem", marginTop: "4px", margin: "4px 0 0 0" }}>
                    {errs.message}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div style={{ marginTop: "4px" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    backgroundColor: isSubmitting ? "#8B9582" : "var(--primary, #3E4F2B)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    padding: "13px 24px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 18px rgba(45, 60, 26, 0.22)",
                    transition: "all 0.25s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(45, 60, 26, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(45, 60, 26, 0.22)";
                  }}
                >
                  <span>{isSubmitting ? "Submitting Inquiry..." : "Send Message"}</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Confidentiality Assurance Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "0.72rem",
                  color: "var(--muted-foreground)",
                  textAlign: "center",
                  marginTop: "2px"
                }}
              >
                <span>✦ Confidential &amp; Non-Disclosure Protected · Zero-Spam Assurance</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
