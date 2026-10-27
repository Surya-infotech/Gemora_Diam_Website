import { useState } from "react";
import {
  Sparkles,
  Gem,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  Layers,
  Compass,
  Palette,
  Check
} from "lucide-react";
import { useStore } from "../../lib/store";
import atelierImg from "../../assets/atelier.jpg";
import cadSketchImg from "../../assets/custom_cad_sketch.jpg";

const BESPOKE_STEPS = [
  {
    step: "01",
    title: "Dream & Vision",
    desc: "Share your ideas, reference images, preferred diamond cut, metal, and personal story with our design atelier.",
    icon: Compass
  },
  {
    step: "02",
    title: "3D CAD & Renderings",
    desc: "Our master CAD modelers generate photorealistic 3D renders and wax previews to inspect every angle and millimeter.",
    icon: Layers
  },
  {
    step: "03",
    title: "Master Bench Crafting",
    desc: "Hand-cast in certified 100% recycled gold or platinum and micro-set with precision-certified lab-grown diamonds.",
    icon: Palette
  },
  {
    step: "04",
    title: "Grading & Insured Courier",
    desc: "Accompanied by IGI/GIA diamond certificate, luxury bespoke presentation case, and fully insured direct courier.",
    icon: ShieldCheck
  }
];

const validate = (f) => ({
  name: f.name.trim().length < 2 ? "Please enter your full name" : "",
  email: !/^\S+@\S+\.\S+$/.test(f.email) ? "Enter a valid email address" : "",
  message: f.message.trim().length < 10 ? "Please share at least a few details (min 10 characters)" : ""
});

export default function CustomDesignSection() {
  const { generalSettings, submitContactUs, showToast, formatPhoneNumber } = useStore();

  const [activeVisualTab, setActiveVisualTab] = useState("cad"); // 'cad' | 'artisan'
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const errs = validate(f);

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
      setSubmittedSuccess(true);
      setF({ name: "", email: "", message: "" });
      setTouched({});
      if (typeof showToast === "function") {
        showToast("Inquiry Received", "A master jeweler concierge will reply within 4 hours.");
      }
      setTimeout(() => setSubmittedSuccess(false), 7000);
    }
  };

  // WhatsApp concierge prefill link
  const rawPhone = generalSettings?.phone || "+18785452355";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hello Gemora Diam, I am interested in creating a custom bespoke jewelry piece."
  )}`;

  return (
    <section
      id="custom-design-atelier-section"
      aria-label="Custom Jewelry Design Atelier"
      style={{
        backgroundColor: "#FAF8F5",
        padding: "clamp(64px, 7vw, 108px) 0",
        position: "relative",
        borderTop: "1px solid #ECE7DE",
        borderBottom: "1px solid #ECE7DE",
        overflow: "hidden"
      }}
    >
      <style>{`
        .custom-design-input-field {
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
        .custom-design-input-field:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.16);
          background-color: #FFFFFF;
        }
        .custom-design-input-field::placeholder {
          color: #A3A89E;
        }
      `}</style>

      {/* Subtle Background Glows */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, rgba(250, 248, 245, 0) 70%)",
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(85, 104, 50, 0.07) 0%, rgba(250, 248, 245, 0) 70%)",
          pointerEvents: "none"
        }}
      />

      <div className="container-luxury" style={{ maxWidth: "1540px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "860px", margin: "0 auto 52px auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 18px",
              borderRadius: "30px",
              backgroundColor: "rgba(85, 104, 50, 0.08)",
              border: "1px solid rgba(85, 104, 50, 0.18)",
              marginBottom: "16px"
            }}
          >
            <Sparkles size={13} style={{ color: "var(--primary, #556832)" }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--primary, #556832)"
              }}
            >
              BESPOKE ATELIER · ONE-OF-A-KIND HEIRLOOMS
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 3.8vw, 3.2rem)",
              fontWeight: 400,
              color: "#181818",
              lineHeight: 1.18,
              margin: "0 0 16px 0",
              letterSpacing: "-0.01em"
            }}
          >
            Bring Your Custom Vision to Life
          </h2>

          <p
            style={{
              fontSize: "clamp(14px, 1.3vw, 16.5px)",
              color: "rgba(24, 24, 24, 0.7)",
              lineHeight: 1.65,
              margin: 0
            }}
          >
            {generalSettings?.description ||
              "Experience a personalized design session with our master jewelers. From architectural 3D CAD modeling to hand-selected certified lab-grown diamonds, collaborate directly to create an unforgettable bespoke masterpiece."}
          </p>
        </div>

        {/* 4-Step Bespoke Journey Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "56px"
          }}
        >
          {BESPOKE_STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #ECE7DE",
                  padding: "24px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  position: "relative",
                  boxShadow: "0 4px 18px rgba(28, 34, 23, 0.03)",
                  transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "var(--gold, #c5a059)";
                  e.currentTarget.style.boxShadow = "0 10px 28px rgba(28, 34, 23, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#ECE7DE";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(28, 34, 23, 0.03)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(85, 104, 50, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary, #556832)"
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--gold, #c5a059)",
                      letterSpacing: "0.1em"
                    }}
                  >
                    STEP {s.step}
                  </span>
                </div>
                <h4
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.15rem",
                    fontWeight: 500,
                    color: "#181818",
                    margin: 0
                  }}
                >
                  {s.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.84rem",
                    color: "rgba(24, 24, 24, 0.65)",
                    lineHeight: 1.55,
                    margin: 0
                  }}
                >
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Bespoke Workspace: Dual Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))",
            gap: "clamp(28px, 4vw, 48px)",
            alignItems: "start"
          }}
        >
          {/* Left Column: The Atelier Inquiries Form (Exact Match to Contact Page) */}
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
                <Gem size={16} style={{ color: "var(--primary, #556832)" }} />
                <span
                  className="eyebrow"
                  style={{
                    color: "var(--primary, #556832)",
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
                  color: "var(--foreground, #1c2217)",
                  margin: "0 0 6px 0"
                }}
              >
                Send a Studio Inquiry
              </h3>
              <p style={{ fontSize: "0.86rem", color: "var(--muted-foreground, #5e6b54)", margin: 0, lineHeight: 1.5 }}>
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
                      color: "var(--foreground, #1c2217)",
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
                    className="custom-design-input-field"
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
                      color: "var(--foreground, #1c2217)",
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
                    className="custom-design-input-field"
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

              {/* Message */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--foreground, #1c2217)",
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
                  className="custom-design-input-field"
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
                    backgroundColor: "var(--primary, #556832)",
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
                      e.currentTarget.style.backgroundColor = "var(--primary-hover, #435226)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = "var(--primary, #556832)";
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
                  color: "var(--muted-foreground, #5e6b54)",
                  textAlign: "center",
                  margin: "4px 0 0 0",
                  lineHeight: 1.4
                }}
              >
                ✦ Confidential &amp; Non-Disclosure Protected · Zero-Spam Assurance
              </p>
            </form>
          </div>

          {/* Right Column: Atelier Visual Studio & VIP Concierge Access */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Visual Showcase Card with Toggleable Tabs */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "22px",
                border: "1px solid #ECE7DE",
                overflow: "hidden",
                boxShadow: "0 10px 36px rgba(28, 34, 23, 0.05)"
              }}
            >
              {/* Image Tabs (CAD Modeling vs Handcrafted Bench) */}
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#FAF8F5",
                  borderBottom: "1px solid #ECE7DE",
                  padding: "6px"
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveVisualTab("cad")}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: activeVisualTab === "cad" ? "#ffffff" : "transparent",
                    color: activeVisualTab === "cad" ? "var(--primary, #556832)" : "rgba(24, 24, 24, 0.6)",
                    fontWeight: activeVisualTab === "cad" ? 600 : 500,
                    fontSize: "0.80rem",
                    cursor: "pointer",
                    boxShadow: activeVisualTab === "cad" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  ✦ 3D CAD &amp; Technical Blueprint
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVisualTab("artisan")}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: activeVisualTab === "artisan" ? "#ffffff" : "transparent",
                    color: activeVisualTab === "artisan" ? "var(--primary, #556832)" : "rgba(24, 24, 24, 0.6)",
                    fontWeight: activeVisualTab === "artisan" ? 600 : 500,
                    fontSize: "0.80rem",
                    cursor: "pointer",
                    boxShadow: activeVisualTab === "artisan" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  ✦ Master Artisan Bench
                </button>
              </div>

              {/* Visual Display */}
              <div style={{ position: "relative", height: "300px", overflow: "hidden", backgroundColor: "#181818" }}>
                <img
                  src={activeVisualTab === "cad" ? cadSketchImg : atelierImg}
                  alt={activeVisualTab === "cad" ? "3D CAD Jewelry Design Blueprint" : "Master Jeweler Setting Diamond Ring"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.35s ease, transform 0.5s ease"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(17, 22, 17, 0.88) 0%, rgba(17, 22, 17, 0.15) 70%)"
                  }}
                />

                <div style={{ position: "absolute", bottom: "20px", left: "24px", right: "24px" }}>
                  <span
                    style={{
                      color: "#E8D7A7",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.20em",
                      textTransform: "uppercase"
                    }}
                  >
                    {activeVisualTab === "cad" ? "PRECISION 3D CAD DRAFTING" : "SURAT FLAGSHIP ATELIER"}
                  </span>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.45rem",
                      color: "#ffffff",
                      margin: "4px 0 6px 0",
                      fontWeight: 400
                    }}
                  >
                    {activeVisualTab === "cad"
                      ? "Photorealistic 360° Modeling"
                      : "Handcrafted by Master Artisans"}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "rgba(255, 255, 255, 0.82)",
                      margin: 0,
                      lineHeight: 1.45
                    }}
                  >
                    {activeVisualTab === "cad"
                      ? "Approve every millimeter, prong angle, and diamond girdle height with accurate digital renders before casting begins."
                      : "Over two decades of high-jewelry bench craftsmanship, ensuring heirloom-grade durability and extraordinary optical brilliance."}
                  </p>
                </div>
              </div>

              {/* Atelier Pillars & Promises */}
              <div style={{ padding: "24px 28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(85, 104, 50, 0.1)",
                        color: "var(--primary, #556832)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Check size={14} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "0.82rem", color: "#181818" }}>
                        Zero Design Fee
                      </strong>
                      <span style={{ fontSize: "0.75rem", color: "rgba(24, 24, 24, 0.6)" }}>
                        Complimentary 3D CAD preview
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(85, 104, 50, 0.1)",
                        color: "var(--primary, #556832)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Check size={14} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "0.82rem", color: "#181818" }}>
                        Certified Diamonds
                      </strong>
                      <span style={{ fontSize: "0.75rem", color: "rgba(24, 24, 24, 0.6)" }}>
                        IGI &amp; GIA accredited stones
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(85, 104, 50, 0.1)",
                        color: "var(--primary, #556832)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Check size={14} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "0.82rem", color: "#181818" }}>
                        Lifetime Warranty
                      </strong>
                      <span style={{ fontSize: "0.75rem", color: "rgba(24, 24, 24, 0.6)" }}>
                        Annual checks &amp; spa polish
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(85, 104, 50, 0.1)",
                        color: "var(--primary, #556832)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Check size={14} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "0.82rem", color: "#181818" }}>
                        Complimentary Resize
                      </strong>
                      <span style={{ fontSize: "0.75rem", color: "rgba(24, 24, 24, 0.6)" }}>
                        One free resize within 60 days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Channels */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "14px 20px",
                      borderRadius: "10px",
                      backgroundColor: "#25D366",
                      color: "#ffffff",
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(37, 211, 102, 0.25)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#20BA5A")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#25D366")}
                  >
                    <MessageCircle size={18} />
                    <span>Instant WhatsApp Concierge Consultation</span>
                  </a>

                  {rawPhone && (
                    <a
                      href={`tel:${rawPhone}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "13px 20px",
                        borderRadius: "10px",
                        border: "1px solid #ECE7DE",
                        backgroundColor: "#FAF8F5",
                        color: "#181818",
                        fontSize: "0.84rem",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--primary, #556832)";
                        e.currentTarget.style.color = "var(--primary, #556832)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ECE7DE";
                        e.currentTarget.style.color = "#181818";
                      }}
                    >
                      <Phone size={16} />
                      <span>Direct Atelier Line: {formatPhoneNumber ? formatPhoneNumber(rawPhone) : rawPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
