import { useState } from "react";
import { MapPin, Clock, Phone, Mail, MessageCircle, CalendarDays, X, ChevronDown, ChevronUp } from "lucide-react";
import { useStore } from "../lib/store";

const validate = (f) => ({
  name: f.name.trim().length < 2 ? "Please enter your full name" : "",
  email: !/^\S+@\S+\.\S+$/.test(f.email) ? "Enter a valid email address" : "",
  phone: f.phone && !/^[+\d\s()-]{7,20}$/.test(f.phone) ? "Enter a valid phone number" : "",
  reason: !f.reason ? "Please select a reason for inquiry" : "",
  message: f.message.trim().length < 10 ? "Message must be at least 10 characters" : "",
});

export default function ContactPage() {
  const { showToast, generalSettings, submitContactUs, faqs } = useStore();
  const [f, setF] = useState({ name: "", email: "", phone: "", reason: "", message: "" });
  const [touched, setTouched] = useState({});
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const errs = validate(f);

  const onFieldChange = (key, val) => {
    setF((prev) => ({ ...prev, [key]: val }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, reason: true, message: true });
    if (Object.values(errs).some(Boolean)) {
      showToast("Please correct highlighted fields before submitting", "error");
      return;
    }
    setIsSubmitting(true);
    const fullMessage = `${f.reason ? `[${f.reason}] ` : ""}${f.phone ? `Phone: ${f.phone} - ` : ""}${f.message}`;
    const res = await submitContactUs({
      name: f.name,
      email: f.email,
      message: fullMessage
    });
    setIsSubmitting(false);
    if (res.success) {
      setF({ name: "", email: "", phone: "", reason: "", message: "" });
      setTouched({});
    }
  };


  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Client Concierge</p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.8rem, 5vw, 4.2rem)", marginTop: "12px", lineHeight: 1.15 }}>
        We're at your service
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "60px",
          marginTop: "50px",
          alignItems: "start"
        }}
      >
        {/* Left Form */}
        <form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            <div>
              <input
                type="text"
                placeholder="Full name *"
                value={f.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: touched.name && errs.name ? "1px solid #d9534f" : "1px solid var(--border)",
                  backgroundColor: "transparent",
                  padding: "12px 0",
                  fontSize: "0.95rem",
                  color: "var(--foreground)",
                  outline: "none"
                }}
              />
              {touched.name && errs.name && (
                <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "6px" }}>{errs.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email *"
                value={f.email}
                onChange={(e) => onFieldChange("email", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: touched.email && errs.email ? "1px solid #d9534f" : "1px solid var(--border)",
                  backgroundColor: "transparent",
                  padding: "12px 0",
                  fontSize: "0.95rem",
                  color: "var(--foreground)",
                  outline: "none"
                }}
              />
              {touched.email && errs.email && (
                <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "6px" }}>{errs.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={f.phone}
                onChange={(e) => onFieldChange("phone", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: touched.phone && errs.phone ? "1px solid #d9534f" : "1px solid var(--border)",
                  backgroundColor: "transparent",
                  padding: "12px 0",
                  fontSize: "0.95rem",
                  color: "var(--foreground)",
                  outline: "none"
                }}
              />
              {touched.phone && errs.phone && (
                <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "6px" }}>{errs.phone}</p>
              )}
            </div>

            <div>
              <select
                value={f.reason}
                onChange={(e) => onFieldChange("reason", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, reason: true }))}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: touched.reason && errs.reason ? "1px solid #d9534f" : "1px solid var(--border)",
                  backgroundColor: "transparent",
                  padding: "12px 0",
                  fontSize: "0.95rem",
                  color: f.reason ? "var(--foreground)" : "var(--muted-foreground)",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="">Reason for inquiry *</option>
                <option value="Bespoke commission">Bespoke commission</option>
                <option value="Engagement rings">Engagement rings</option>
                <option value="Order support">Order support</option>
                <option value="Repairs & care">Repairs & care</option>
                <option value="Press">Press & Media</option>
              </select>
              {touched.reason && errs.reason && (
                <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "6px" }}>{errs.reason}</p>
              )}
            </div>
          </div>

          <div>
            <textarea
              rows={5}
              placeholder="Your message *"
              value={f.message}
              onChange={(e) => onFieldChange("message", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, message: true }))}
              style={{
                width: "100%",
                border: "none",
                borderBottom: touched.message && errs.message ? "1px solid #d9534f" : "1px solid var(--border)",
                backgroundColor: "transparent",
                padding: "12px 0",
                fontSize: "0.95rem",
                color: "var(--foreground)",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
            {touched.message && errs.message && (
              <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "6px" }}>{errs.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="eyebrow"
            style={{
              alignSelf: "flex-start",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              padding: "16px 36px",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Send Message
          </button>
        </form>

        {/* Right Info Aside */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Atelier / Flagship Card */}
          <div style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)", padding: "32px", borderRadius: "2px" }}>
            <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
              {generalSettings?.cityname ? `${generalSettings.cityname} Flagship Store` : "Flagship Store & Showroom"}
            </p>
            {generalSettings?.address && (
              <p style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginTop: "18px", fontSize: "0.92rem", color: "var(--foreground)" }}>
                <MapPin size={18} style={{ color: "var(--gold-deep)", flexShrink: 0, marginTop: "2px" }} />
                <span>
                  {[generalSettings.address, generalSettings.cityname, generalSettings.statename, generalSettings.countryname].filter(Boolean).join(", ")}
                  {generalSettings.postalcode ? ` - ${generalSettings.postalcode}` : ""}
                </span>
              </p>
            )}
            <p style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginTop: "12px", fontSize: "0.92rem", color: "var(--foreground)" }}>
              <Clock size={18} style={{ color: "var(--gold-deep)", flexShrink: 0, marginTop: "2px" }} />
              <span>Mon – Sat 10:00 – 19:00 · Sun by private appointment</span>
            </p>

            <button
              onClick={() => setBookModalOpen(true)}
              className="eyebrow"
              style={{
                width: "100%",
                marginTop: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                backgroundColor: "var(--gold)",
                color: "#1c2211",
                padding: "14px",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <CalendarDays size={18} />
              Book a Store Appointment
            </button>
          </div>

          {/* Map Preview */}
          {generalSettings?.address && (
            <div style={{ width: "100%", height: "240px", border: "1px solid var(--border)", overflow: "hidden" }}>
              <iframe
                title={`${generalSettings?.softwarename || "Store"} Location Map`}
                style={{ width: "100%", height: "100%", border: "none", filter: "grayscale(85%) contrast(1.1)" }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  [generalSettings.address, generalSettings.cityname, generalSettings.statename, generalSettings.countryname].filter(Boolean).join(", ")
                )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          )}

          {/* Quick Communication Channels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {generalSettings?.phone && (
              <a
                href={`https://wa.me/${generalSettings.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid var(--border)",
                  padding: "16px 8px",
                  fontSize: "0.75rem",
                  color: "var(--foreground)",
                  textAlign: "center",
                  transition: "border-color 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <MessageCircle size={20} style={{ color: "var(--gold-deep)" }} strokeWidth={1.3} />
                <span>WhatsApp</span>
              </a>
            )}

            {generalSettings?.phone && (
              <a
                href={`tel:${generalSettings.phone.replace(/\s+/g, "")}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid var(--border)",
                  padding: "16px 8px",
                  fontSize: "0.75rem",
                  color: "var(--foreground)",
                  textAlign: "center",
                  transition: "border-color 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <Phone size={20} style={{ color: "var(--gold-deep)" }} strokeWidth={1.3} />
                <span>VIP Line</span>
              </a>
            )}

            {generalSettings?.email && (
              <a
                href={`mailto:${generalSettings.email}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid var(--border)",
                  padding: "16px 8px",
                  fontSize: "0.75rem",
                  color: "var(--foreground)",
                  textAlign: "center",
                  transition: "border-color 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <Mail size={20} style={{ color: "var(--gold-deep)" }} strokeWidth={1.3} />
                <span>Email</span>
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Frequently Asked Questions (from Admin Panel) */}
      {faqs && faqs.length > 0 && (
        <section style={{ marginTop: "100px", borderTop: "1px solid var(--border)", paddingTop: "70px" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <p className="eyebrow" style={{ color: "var(--gold-deep)", textAlign: "center" }}>
              Common Inquiries
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
                textAlign: "center",
                marginTop: "10px",
                marginBottom: "48px"
              }}
            >
              Frequently Asked Questions
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.faqid || faq._id || idx}
                    style={{
                      border: "1px solid var(--border)",
                      backgroundColor: isOpen ? "var(--muted)" : "transparent",
                      borderRadius: "2px",
                      overflow: "hidden",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        color: "var(--foreground)",
                        gap: "16px"
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "1.15rem",
                          fontWeight: 500
                        }}
                      >
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={20} style={{ color: "var(--primary)", flexShrink: 0 }} />
                      ) : (
                        <ChevronDown size={20} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                      )}
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          padding: "0 24px 24px 24px",
                          fontSize: "0.92rem",
                          lineHeight: 1.8,
                          color: "var(--muted-foreground)",
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
          </div>
        </section>
      )}

      {/* Booking Dialog Modal */}

      {bookModalOpen && (
        <BookingDialog
          onClose={() => setBookModalOpen(false)}
          onSuccess={(date, time) => {
            showToast(`Appointment requested for ${date} at ${time}. Our team will confirm shortly.`, "success");
            setBookModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function BookingDialog({ onClose, onSuccess }) {
  const { generalSettings } = useStore();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const slots = ["10:30", "12:00", "14:00", "15:30", "17:00"];

  // Generate next 14 available days (skipping Sundays)
  const availableDates = [];
  const today = new Date();
  for (let i = 1; i <= 21 && availableDates.length < 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) {
      // not Sunday
      availableDates.push({
        iso: d.toISOString().split("T")[0],
        display: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      });
    }
  }

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    const match = availableDates.find((d) => d.iso === selectedDate);
    onSuccess(match ? match.display : selectedDate, selectedSlot);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          padding: "36px",
          position: "relative",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: "var(--muted-foreground)",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Store Consultation</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginTop: "6px" }}>
          Book an Appointment
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "6px" }}>
          {generalSettings?.description || "Reserve dedicated time with our jewelry specialists for a personalized consultation."}
        </p>

        {/* Date Selection */}
        <div style={{ marginTop: "24px" }}>
          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "10px" }}>
            Select Preferred Date
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "8px",
              maxHeight: "160px",
              overflowY: "auto",
              paddingRight: "4px"
            }}
          >
            {availableDates.map((item) => (
              <button
                key={item.iso}
                type="button"
                onClick={() => setSelectedDate(item.iso)}
                style={{
                  border: selectedDate === item.iso ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: selectedDate === item.iso ? "var(--primary)" : "transparent",
                  color: selectedDate === item.iso ? "var(--primary-foreground)" : "var(--foreground)",
                  padding: "8px 10px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s ease"
                }}
              >
                {item.display}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Selection */}
        <div style={{ marginTop: "24px" }}>
          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "10px" }}>
            Select Time Slot
          </label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSlot(s)}
                style={{
                  border: selectedSlot === s ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: selectedSlot === s ? "var(--primary)" : "transparent",
                  color: selectedSlot === s ? "var(--primary-foreground)" : "var(--foreground)",
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={!selectedDate || !selectedSlot}
          onClick={handleConfirm}
          className="eyebrow"
          style={{
            width: "100%",
            marginTop: "32px",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: "16px",
            border: "none",
            cursor: !selectedDate || !selectedSlot ? "not-allowed" : "pointer",
            opacity: !selectedDate || !selectedSlot ? 0.4 : 1,
            transition: "opacity 0.2s ease"
          }}
        >
          Confirm Appointment Request
        </button>
      </div>
    </div>
  );
}
