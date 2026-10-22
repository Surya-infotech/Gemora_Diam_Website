import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, Star, X } from "lucide-react";

export default function LovedByCouplesSection() {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  const carouselRef = useRef(null);

  useEffect(() => {
    fetchActiveSection();
  }, []);

  const fetchActiveSection = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${backendUrl}/Support/GetActiveCoupleSection`);
      const data = await res.json();
      if (res.ok && data && data.status !== false) {
        setSectionData(data);
      } else {
        setSectionData(null);
      }
    } catch (err) {
      console.error("Error loading Loved by Couples section:", err);
      setSectionData(null);
    } finally {
      setLoading(false);
    }
  };

  const checkScroll = useCallback(() => {
    const el = carouselRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, sectionData]);

  const scrollByDirection = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const firstChild = el.children[0];
    const secondChild = el.children[1];
    const cardWidth = secondChild
      ? secondChild.offsetLeft - firstChild.offsetLeft
      : firstChild.offsetWidth;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  if (loading || !sectionData) {
    return null;
  }

  const stories = Array.isArray(sectionData.stories) ? sectionData.stories : [];
  const reviews = Array.isArray(sectionData.reviews) ? sectionData.reviews : [];

  if (stories.length === 0 && reviews.length === 0) {
    return null;
  }

  // Interleave stories and reviews alternating: Story -> Review -> Story -> Review...
  const combinedCards = [];
  const maxItems = Math.max(stories.length, reviews.length);
  for (let i = 0; i < maxItems; i++) {
    if (stories[i]) {
      combinedCards.push({
        type: "story",
        key: `story-${stories[i]._id || stories[i].storyId || i}`,
        data: stories[i]
      });
    }
    if (reviews[i]) {
      combinedCards.push({
        type: "review",
        key: `review-${reviews[i]._id || reviews[i].reviewId || i}`,
        data: reviews[i]
      });
    }
  }

  return (
    <section
      id="loved-by-couples-section"
      aria-label="Real Love Stories"
      style={{
        backgroundColor: "#fcfbf9",
        padding: "80px 0 90px 0",
        position: "relative",
        borderTop: "1px solid #f0ede6"
      }}
    >
      <div className="container-luxury" style={{ maxWidth: "1540px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "32px"
          }}
        >
          {/* Header Left: Eyebrow + Title + Description */}
          <div style={{ maxWidth: "600px" }}>
            {sectionData.headerEyebrow && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--primary, #556832)",
                  display: "block",
                  marginBottom: "8px"
                }}
              >
                {sectionData.headerEyebrow}
              </span>
            )}
            {sectionData.headerTitle && (
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 3.6vw, 2.9rem)",
                  fontWeight: 400,
                  color: "#181818",
                  lineHeight: 1.15,
                  margin: "0 0 10px 0"
                }}
              >
                {sectionData.headerTitle}
              </h2>
            )}
            {sectionData.headerDescription && (
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(24, 24, 24, 0.65)",
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                {sectionData.headerDescription}
              </p>
            )}
          </div>

          {/* Header Right: Rating and Navigation Arrows */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px"
            }}
          >
            {/* Rating Box */}
            {(sectionData.ratingScore || sectionData.reviewCountText) && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {sectionData.ratingScore && (
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "2.4rem",
                      fontWeight: 400,
                      lineHeight: 1,
                      color: "#181818"
                    }}
                  >
                    {sectionData.ratingScore}
                  </span>
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "2px", color: "#c5a059" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#c5a059" color="#c5a059" />
                    ))}
                  </div>
                  {sectionData.reviewCountText && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "rgba(24, 24, 24, 0.55)",
                        marginTop: "3px"
                      }}
                    >
                      {sectionData.reviewCountText}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Slider Controls */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                aria-label="Previous story"
                onClick={() => scrollByDirection(-1)}
                disabled={!canScrollLeft}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: canScrollLeft ? "1px solid rgba(24, 24, 24, 0.25)" : "1px solid rgba(24, 24, 24, 0.1)",
                  backgroundColor: "transparent",
                  color: canScrollLeft ? "#181818" : "rgba(24, 24, 24, 0.25)",
                  display: "grid",
                  placeItems: "center",
                  cursor: canScrollLeft ? "pointer" : "not-allowed",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  if (canScrollLeft) {
                    e.currentTarget.style.backgroundColor = "#181818";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "#181818";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canScrollLeft) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#181818";
                    e.currentTarget.style.borderColor = "rgba(24, 24, 24, 0.25)";
                  }
                }}
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                aria-label="Next story"
                onClick={() => scrollByDirection(1)}
                disabled={!canScrollRight}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: canScrollRight ? "1px solid rgba(24, 24, 24, 0.25)" : "1px solid rgba(24, 24, 24, 0.1)",
                  backgroundColor: "transparent",
                  color: canScrollRight ? "#181818" : "rgba(24, 24, 24, 0.25)",
                  display: "grid",
                  placeItems: "center",
                  cursor: canScrollRight ? "pointer" : "not-allowed",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={(e) => {
                  if (canScrollRight) {
                    e.currentTarget.style.backgroundColor = "#181818";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "#181818";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canScrollRight) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#181818";
                    e.currentTarget.style.borderColor = "rgba(24, 24, 24, 0.25)";
                  }
                }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            padding: "10px 0 24px 0",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          className="no-scrollbar"
        >
          {combinedCards.map((item) => {
            if (item.type === "story") {
              const story = item.data;
              return (
                <div
                  key={item.key}
                  style={{
                    flex: "0 0 320px",
                    scrollSnapAlign: "start",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid #ebe8e1",
                    boxShadow: "0 4px 18px rgba(0, 0, 0, 0.03)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedStory(story)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.08)";
                    const img = e.currentTarget.querySelector(".couple-photo");
                    if (img) img.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 18px rgba(0, 0, 0, 0.03)";
                    const img = e.currentTarget.querySelector(".couple-photo");
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  {/* Photo Container */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "4 / 3",
                      overflow: "hidden",
                      backgroundColor: "#f4f1ea"
                    }}
                  >
                    {story.image && (
                      <img
                        src={story.image}
                        alt={story.names || "Couple"}
                        className="couple-photo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                      />
                    )}
                    {/* Real Story Badge */}
                    {story.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.94)",
                          backdropFilter: "blur(6px)",
                          color: "#181818",
                          fontSize: "9.5px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                          padding: "4px 12px",
                          borderRadius: "999px"
                        }}
                      >
                        {story.badge}
                      </span>
                    )}
                  </div>

                  {/* Story Text Box */}
                  <div
                    style={{
                      padding: "22px 22px 20px 22px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1
                    }}
                  >
                    {story.location && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "rgba(24, 24, 24, 0.48)",
                          marginBottom: "4px"
                        }}
                      >
                        {story.location}
                      </span>
                    )}
                    {story.names && (
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "1.25rem",
                          fontWeight: 500,
                          color: "#181818",
                          margin: "0 0 10px 0"
                        }}
                      >
                        {story.names}
                      </h3>
                    )}
                    {story.excerpt && (
                      <p
                        style={{
                          fontSize: "0.88rem",
                          color: "rgba(24, 24, 24, 0.68)",
                          lineHeight: 1.6,
                          margin: 0,
                          flexGrow: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontWeight: 300
                        }}
                      >
                        &ldquo;{story.excerpt}&rdquo;
                      </p>
                    )}

                    <div
                      style={{
                        marginTop: "18px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#181818"
                      }}
                    >
                      <span>Read their story</span>
                      <span style={{ fontSize: "13px" }}>&rarr;</span>
                    </div>
                  </div>
                </div>
              );
            } else {
              // Review Card (Dark Luxury Charcoal Card)
              const review = item.data;
              return (
                <div
                  key={item.key}
                  style={{
                    flex: "0 0 320px",
                    scrollSnapAlign: "start",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#1c140c",
                    borderRadius: "18px",
                    padding: "26px",
                    color: "#ffffff",
                    position: "relative",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
                  }}
                >
                  {/* Large Gold Quote Icon */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                      width: "36px",
                      height: "36px",
                      color: "rgba(212, 175, 55, 0.4)",
                      marginBottom: "14px"
                    }}
                  >
                    <path d="M9.4 5C5.6 6.4 3 9.8 3 14.2V19h7v-6H6.6c.1-2.4 1.4-4 3.4-4.9L9.4 5Zm10 0c-3.8 1.4-6.4 4.8-6.4 9.2V19h7v-6h-3.4c.1-2.4 1.4-4 3.4-4.9L19.4 5Z" />
                  </svg>

                  {/* Testimonial Quote */}
                  {review.quote && (
                    <blockquote
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.08rem",
                        lineHeight: 1.55,
                        color: "rgba(255, 255, 255, 0.92)",
                        margin: 0,
                        flexGrow: 1,
                        fontStyle: "italic",
                        fontWeight: 300
                      }}
                    >
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                  )}

                  {/* Bottom Author Row */}
                  <div
                    style={{
                      marginTop: "22px",
                      paddingTop: "16px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      {review.name && (
                        <span
                          style={{
                            display: "block",
                            fontFamily: "var(--font-serif)",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: "#ffffff"
                          }}
                        >
                          {review.name}
                        </span>
                      )}
                      {review.badge && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 600,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "#d4af37"
                          }}
                        >
                          {review.badge}
                        </span>
                      )}
                    </div>

                    {/* Gold Rating Stars */}
                    {review.rating > 0 && (
                      <div style={{ display: "flex", gap: "2px", color: "#d4af37" }}>
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="#d4af37" color="#d4af37" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Story Details Modal */}
      {selectedStory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setSelectedStory(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div style={{ position: "relative", width: "100%", height: "300px" }}>
              {selectedStory.image && (
                <img
                  src={selectedStory.image}
                  alt={selectedStory.names || "Couple"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                aria-label="Close modal"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#ffffff",
                  border: "none",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
              >
                <X size={18} />
              </button>
              {selectedStory.badge && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    color: "#181818",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    padding: "5px 14px",
                    borderRadius: "999px"
                  }}
                >
                  {selectedStory.badge}
                </span>
              )}
            </div>

            {/* Modal Body */}
            <div style={{ padding: "32px" }}>
              {selectedStory.location && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "var(--primary, #556832)"
                  }}
                >
                  {selectedStory.location}
                </span>
              )}
              {selectedStory.names && (
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.9rem",
                    fontWeight: 400,
                    color: "#181818",
                    margin: "6px 0 16px 0"
                  }}
                >
                  {selectedStory.names}
                </h3>
              )}

              {selectedStory.ringName && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 16px",
                    backgroundColor: "#f9f8f5",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "0.88rem",
                    color: "rgba(24, 24, 24, 0.8)"
                  }}
                >
                  <strong style={{ color: "#181818" }}>The Ring:</strong>
                  <span>{selectedStory.ringName}</span>
                  {selectedStory.proposalDate && (
                    <>
                      <span>&bull;</span>
                      <span>{selectedStory.proposalDate}</span>
                    </>
                  )}
                </div>
              )}

              {selectedStory.excerpt && (
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "rgba(24, 24, 24, 0.8)",
                    fontWeight: 300,
                    margin: 0
                  }}
                >
                  {selectedStory.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
