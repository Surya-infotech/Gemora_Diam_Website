export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  maxWidth = "560px",
  tag: Tag = "h2",
  style = {},
  className = "",
  children = null
}) {
  const isCenter = align === "center";

  return (
    <div
      className={className}
      style={{
        textAlign: align,
        marginBottom: "40px",
        padding: "0 16px",
        ...(isCenter ? { maxWidth: "720px", margin: "0 auto 40px auto" } : {}),
        ...style
      }}
    >
      {eyebrow && (
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
          {eyebrow}
          <span style={{ height: "1px", width: "20px", backgroundColor: "var(--gold)" }} />
        </p>
      )}

      {title && (
        <Tag
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 3.8vw, 3rem)",
            fontWeight: 500,
            color: "#181818",
            lineHeight: 1.15,
            margin: "4px 0 12px 0"
          }}
        >
          {title}
        </Tag>
      )}

      {description && (
        <p
          style={{
            fontSize: "clamp(13px, 1.4vw, 15px)",
            color: "#666666",
            maxWidth: maxWidth || "560px",
            margin: isCenter ? "0 auto" : "0",
            lineHeight: 1.6
          }}
        >
          {description}
        </p>
      )}

      {children && (
        <div style={{ marginTop: "16px" }}>
          {children}
        </div>
      )}
    </div>
  );
}
