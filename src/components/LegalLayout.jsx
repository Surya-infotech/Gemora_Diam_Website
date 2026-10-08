export function LegalLayout({ title, updated, sections, htmlContent }) {
  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Legal Information</p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", margin: "12px 0 6px 0" }}>
        {title}
      </h1>
      {updated && (
        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
          Last updated {updated}
        </p>
      )}

      {htmlContent ? (
        <div
          className="admin-policy-content"
          style={{
            maxWidth: "880px",
            marginTop: "48px",
            lineHeight: 1.85,
            color: "var(--foreground)",
            fontSize: "0.95rem"
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : sections && sections.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "60px",
            marginTop: "60px",
            alignItems: "start"
          }}
        >
          {/* Sticky Table of Contents */}
          <nav style={{ position: "sticky", top: "110px" }}>
            <p className="eyebrow" style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>Contents</p>
            <ol style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px", borderLeft: "1px solid var(--border)" }}>
              {sections.map((s, i) => (
                <li key={s.id || i}>
                  <a
                    href={`#${s.id}`}
                    style={{
                      display: "block",
                      paddingLeft: "16px",
                      marginLeft: "-1px",
                      fontSize: "0.85rem",
                      color: "var(--muted-foreground)",
                      borderLeft: "2px solid transparent",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.color = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.color = "var(--muted-foreground)";
                    }}
                  >
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Legal Text Sections */}
          <div style={{ maxWidth: "780px", display: "flex", flexDirection: "column", gap: "50px", gridColumn: "span 2" }}>
            {sections.map((s, i) => (
              <section key={s.id || i} id={s.id} style={{ scrollMarginTop: "120px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "16px" }}>
                  {i + 1}. {s.title}
                </h2>
                {s.body.map((p, k) => (
                  <p key={k} style={{ fontSize: "0.92rem", lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "14px" }}>
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}