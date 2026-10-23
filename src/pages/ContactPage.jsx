import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Gem,
  CheckCircle2
} from "lucide-react";
import { useStore } from "../lib/store";
import { formatPhoneNumber } from "../lib/formatters";
import atelier from "../assets/atelier.jpg";

const validate = (f) => ({
  name: f.name.trim().length < 2 ? "Please enter your full name" : "",
  email: !/^\S+@\S+\.\S+$/.test(f.email) ? "Enter a valid email address" : "",
  phone: f.phone && !/^[+\d\s()-]{7,20}$/.test(f.phone) ? "Enter a valid phone number" : "",
  message: f.message.trim().length < 10 ? "Please share at least a few details (min 10 characters)" : "",
});

export default function ContactPage() {
  const { showToast, generalSettings, submitContactUs } = useStore();
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const brandName = generalSettings?.softwarename || "Gemora Diam";
  const errs = validate(f);

  const onFieldChange = (key, val) => {
    setF((prev) => ({ ...prev, [key]: val }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    if (Object.values(errs).some(Boolean)) {
      showToast("Please review the highlighted fields", "error");
      return;
    }
    setIsSubmitting(true);
    const fullMessage = `${f.phone ? `[Phone: ${f.phone}] ` : ""}${f.message}`;
    const res = await submitContactUs({
      name: f.name,
      email: f.email,
      message: fullMessage
    });
    setIsSubmitting(false);
    if (res?.success) {
      setSubmittedSuccess(true);
      setF({ name: "", email: "", phone: "", message: "" });
      setTouched({});
      setTimeout(() => setSubmittedSuccess(false), 7000);
    }
  };

  const addressString = [
    generalSettings?.address,
    generalSettings?.cityname,
    generalSettings?.statename,
    generalSettings?.countryname
  ].filter(Boolean).join(", ") + (generalSettings?.postalcode ? ` - ${generalSettings.postalcode}` : "");

  return (
    <div style={{ backgroundColor: "#FAF9F6", color: "var(--foreground)", minHeight: "100vh" }}>
      {/* High-Jewelry Page CSS */}
      <style>{`
        .contact-input-field {
          width: 100%;
          border: 1px solid #E5DFD5;
          background-color: #FFFFFF;
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 0.90rem;
          color: var(--foreground);
          outline: none;
          font-family: var(--font-sans);
          transition: all 0.25s ease;
        }
        .contact-input-field:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.16);
          background-color: #FFFFFF;
        }
        .contact-input-field::placeholder {
          color: #A3A89E;
        }
        .contact-topic-pill {
          padding: 8px 14px;
          border-radius: 30px;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          border: 1px solid #E2DCD1;
          background-color: #FFFFFF;
          color: var(--foreground);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .contact-topic-pill:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .contact-topic-pill.active {
          background-color: var(--primary);
          border-color: var(--primary);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(85, 104, 50, 0.25);
        }
        .contact-vip-card {
          background-color: #FFFFFF;
          border: 1px solid #EBE5DB;
          border-radius: 12px;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          color: var(--foreground);
          transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .contact-vip-card:hover {
          border-color: var(--gold);
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(28, 34, 23, 0.08);
        }
        .contact-trust-card {
          background-color: #FFFFFF;
          border: 1px solid #EBE5DB;
          border-radius: 14px;
          padding: 24px 22px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          transition: transform 0.25s ease;
        }
        .contact-trust-card:hover {
          transform: translateY(-2px);
          border-color: var(--gold);
        }
      `}</style>

      {/* Hero Header Section */}
      <div
        style={{
          borderBottom: "1px solid #ECE7DE",
          backgroundColor: "#FFFFFF",
          padding: "clamp(48px, 6vw, 76px) 0 clamp(36px, 5vw, 56px) 0"
        }}
      >
        <div className="container-luxury" style={{ maxWidth: "1240px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "30px",
              backgroundColor: "rgba(85, 104, 50, 0.08)",
              border: "1px solid rgba(85, 104, 50, 0.2)",
              marginBottom: "16px"
            }}
          >
            <Sparkles size={14} style={{ color: "var(--primary)" }} />
            <span
              className="eyebrow"
              style={{
                color: "var(--primary)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.20em"
              }}
            >
              PRIVATE CONCIERGE · BESPOKE SHOWROOM
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              color: "var(--foreground)",
              margin: "0 auto",
              letterSpacing: "-0.01em"
            }}
          >
            We're at your service
          </h1>

          <p
            style={{
              fontSize: "clamp(0.92rem, 1.3vw, 1.05rem)",
              color: "var(--muted-foreground)",
              maxWidth: "680px",
              margin: "18px auto 0 auto",
              lineHeight: 1.65
            }}
          >
            Whether commissioning a one-of-a-kind bespoke heirloom, selecting certified lab-grown diamonds, or reserving an intimate showroom viewing, our master jewelers and personal concierges are at your devotion.
          </p>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="container-luxury" style={{ maxWidth: "1240px", paddingTop: "52px", paddingBottom: "70px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "clamp(28px, 4vw, 48px)",
            alignItems: "start"
          }}
        >
          {/* Left Column: The Atelier Inquiries Form */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              border: "1px solid #E8E2D6",
              padding: "clamp(26px, 4vw, 42px)",
              boxShadow: "0 10px 30px rgba(28, 34, 23, 0.04)"
            }}
          >
            <div style={{ marginBottom: "26px" }}>
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
                  fontSize: "1.75rem",
                  fontWeight: 400,
                  color: "var(--foreground)",
                  margin: "0 0 6px 0"
                }}
              >
                Send a Studio Inquiry
              </h3>
              <p style={{ fontSize: "0.86rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5 }}>
                A dedicated private concierge will review your vision and reply within 4 business hours.
              </p>
            </div>

            {/* Inquiries Form */}
            <form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "18px" }}>
                {/* Full Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.76rem",
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
                    className="contact-input-field"
                    style={{
                      borderColor: touched.name && errs.name ? "#d9534f" : undefined
                    }}
                  />
                  {touched.name && errs.name && (
                    <p style={{ color: "#d9534f", fontSize: "0.74rem", marginTop: "5px", margin: "5px 0 0 0" }}>
                      {errs.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.76rem",
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
                    className="contact-input-field"
                    style={{
                      borderColor: touched.email && errs.email ? "#d9534f" : undefined
                    }}
                  />
                  {touched.email && errs.email && (
                    <p style={{ color: "#d9534f", fontSize: "0.74rem", marginTop: "5px", margin: "5px 0 0 0" }}>
                      {errs.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--foreground)",
                    marginBottom: "6px"
                  }}
                >
                  Telephone / WhatsApp <span style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={f.phone}
                  onChange={(e) => onFieldChange("phone", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                  className="contact-input-field"
                  style={{
                    borderColor: touched.phone && errs.phone ? "#d9534f" : undefined
                  }}
                />
                {touched.phone && errs.phone && (
                  <p style={{ color: "#d9534f", fontSize: "0.74rem", marginTop: "5px", margin: "5px 0 0 0" }}>
                    {errs.phone}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.76rem",
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
                  rows={4}
                  placeholder="Share details regarding your preferred diamond shape, carat, setting style, or appointment date..."
                  value={f.message}
                  onChange={(e) => onFieldChange("message", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, message: true }))}
                  className="contact-input-field"
                  style={{
                    borderColor: touched.message && errs.message ? "#d9534f" : undefined,
                    resize: "vertical"
                  }}
                />
                {touched.message && errs.message && (
                  <p style={{ color: "#d9534f", fontSize: "0.74rem", marginTop: "5px", margin: "5px 0 0 0" }}>
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
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    backgroundColor: "var(--primary)",
                    color: "#FFFFFF",
                    padding: "16px 36px",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "0.86rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 18px rgba(85, 104, 50, 0.28)",
                    transition: "all 0.25s ease",
                    width: "100%"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <span>{isSubmitting ? "Sending Inquiry..." : "Send Message"}</span>
                  <ArrowRight size={17} />
                </button>
              </div>

              {submittedSuccess && (
                <div
                  style={{
                    backgroundColor: "#EEF7EE",
                    border: "1px solid #C3E6C3",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#27672B",
                    fontSize: "0.85rem"
                  }}
                >
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                  <span>Your inquiry has been sent. A master concierge will reply promptly.</span>
                </div>
              )}

              <p
                style={{
                  fontSize: "0.76rem",
                  color: "var(--muted-foreground)",
                  textAlign: "center",
                  margin: "4px 0 0 0",
                  lineHeight: 1.4
                }}
              >
                ✦ Confidential &amp; Non-Disclosure Protected · Zero-Spam Assurance
              </p>
            </form>
          </div>

          {/* Right Column: Flagship Salon & VIP Direct Channels */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Flagship Atelier Card with Master Jeweler Header */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "18px",
                border: "1px solid #E8E2D6",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(28, 34, 23, 0.04)"
              }}
            >
              {/* Atelier Visual Banner */}
              <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                <img
                  src={atelier}
                  alt="Gemora Diam Master Jeweler Workshop"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.85)"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(17, 22, 17, 0.85) 0%, rgba(17, 22, 17, 0.2) 100%)"
                  }}
                />
                <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px" }}>
                  <span
                    className="eyebrow"
                    style={{
                      color: "#E8D7A7",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.20em"
                    }}
                  >
                    MASTER WORKSHOP &amp; SHOWROOM
                  </span>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.45rem",
                      color: "#FFFFFF",
                      margin: "2px 0 0 0",
                      fontWeight: 500
                    }}
                  >
                    {generalSettings?.cityname ? `${generalSettings.cityname} Flagship Showroom` : "Surat Flagship Studio"}
                  </h4>
                </div>
              </div>

              {/* Salon Details Body */}
              <div style={{ padding: "26px 28px" }}>
                {generalSettings?.address && (
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(197, 160, 89, 0.12)",
                        border: "1px solid rgba(197, 160, 89, 0.3)",
                        display: "grid",
                        placeItems: "center",
                        color: "var(--gold-deep)",
                        flexShrink: 0,
                        marginTop: "2px"
                      }}
                    >
                      <MapPin size={17} />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                        Showroom Location
                      </span>
                      <p style={{ fontSize: "0.90rem", color: "var(--foreground)", lineHeight: 1.5, margin: "2px 0 0 0", fontWeight: 500 }}>
                        {addressString}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3 VIP Communication Channels */}
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted-foreground)",
                  marginBottom: "12px",
                  fontWeight: 600
                }}
              >
                Direct Concierge Desks
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {/* WhatsApp */}
                {generalSettings?.phone && (
                  <a
                    href={`https://wa.me/${generalSettings.phone.replace(/[^0-9]/g, "")}?text=Hello%20Gemora%20Diam,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20jewelry%20piece.`}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-vip-card"
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(37, 211, 102, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#25D366",
                        marginBottom: "10px"
                      }}
                    >
                      <MessageCircle size={20} />
                    </div>
                    <strong style={{ fontSize: "0.84rem", color: "var(--foreground)", display: "block" }}>
                      WhatsApp
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: "3px" }}>
                      Instant Chat
                    </span>
                  </a>
                )}

                {/* VIP Line */}
                {generalSettings?.phone && (
                  <a
                    href={`tel:${generalSettings.phone.replace(/\s+/g, "")}`}
                    className="contact-vip-card"
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(85, 104, 50, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "var(--primary)",
                        marginBottom: "10px"
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <strong style={{ fontSize: "0.84rem", color: "var(--foreground)", display: "block" }}>
                      VIP Line
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: "3px" }}>
                      Direct Call
                    </span>
                  </a>
                )}

                {/* Email */}
                {generalSettings?.email && (
                  <a
                    href={`mailto:${generalSettings.email}?subject=Bespoke%20Jewelry%20Inquiry%20-%20Gemora%20Diam`}
                    className="contact-vip-card"
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(197, 160, 89, 0.12)",
                        display: "grid",
                        placeItems: "center",
                        color: "var(--gold-deep)",
                        marginBottom: "10px"
                      }}
                    >
                      <Mail size={18} />
                    </div>
                    <strong style={{ fontSize: "0.84rem", color: "var(--foreground)", display: "block" }}>
                      Concierge
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: "3px" }}>
                      Email Desk
                    </span>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* 3 Signature Atelier Experience Privileges */}
        <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid #EBE5DB" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span
              className="eyebrow"
              style={{
                color: "var(--primary)",
                fontSize: "0.70rem",
                fontWeight: 700,
                letterSpacing: "0.22em"
              }}
            >
              BESPOKE COMMITMENTS
            </span>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.8rem",
                fontWeight: 400,
                color: "var(--foreground)",
                margin: "4px 0 0 0"
              }}
            >
              The Studio Experience
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "24px"
            }}
          >
            <div className="contact-trust-card">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(85, 104, 50, 0.1)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--primary)",
                  flexShrink: 0
                }}
              >
                <Gem size={20} />
              </div>
              <div>
                <h5 style={{ fontSize: "0.95rem", fontWeight: 600, margin: "0 0 4px 0" }}>
                  Private 1-on-1 Viewing
                </h5>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5 }}>
                  Inspect loose GIA &amp; IGI certified lab diamonds under 10x gemological loupes in our private VIP showroom suite.
                </p>
              </div>
            </div>

            <div className="contact-trust-card">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(197, 160, 89, 0.12)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--gold-deep)",
                  flexShrink: 0
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h5 style={{ fontSize: "0.95rem", fontWeight: 600, margin: "0 0 4px 0" }}>
                  Bespoke 3D CAD Modeling
                </h5>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5 }}>
                  Collaborate directly with our master bench jewelers to visualize and perfect your custom design before casting.
                </p>
              </div>
            </div>

            <div className="contact-trust-card">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(85, 104, 50, 0.1)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--primary)",
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h5 style={{ fontSize: "0.95rem", fontWeight: 600, margin: "0 0 4px 0" }}>
                  Lifetime Craftsmanship Care
                </h5>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5 }}>
                  Enjoy complimentary ultrasonic spa cleanings, annual prong inspections, and certified authenticity certificates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

