import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, Star, X } from "lucide-react";

const DEFAULT_COUPLE_DATA = {
  headerEyebrow: "Real Love Stories",
  headerTitle: "Loved by couples",
  headerDescription: "Proposals, promises, and the rings that made them. In their own words.",
  ratingScore: "5.0",
  reviewCountText: "from 120+ verified reviews",
  stories: [
    {
      storyId: "s1",
      coupleName: "Meera & Arjun",
      location: "Udaipur, India",
      storySnippet: "Our day was so special, filled with family and so much love. Arjun surprised me by the lake where we had our first date with the most radiant custom solitaire ring...",
      fullStory: "Our day was so special, filled with family and so much love. Arjun surprised me by the lake where we had our first date with the most radiant custom solitaire ring. The team at Gemora Diam helped him select a certified lab-grown diamond that captured every beam of sunlight.",
      coupleImage: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1200&auto=format&fit=crop",
      ringTitle: "Custom Oval Solitaire in 18k Yellow Gold"
    },
    {
      storyId: "s2",
      coupleName: "Ananya & Rohan",
      location: "Shimla, India",
      storySnippet: "We got engaged on a mountain trip we'd been planning for years. Rohan proposed right as the sun broke over the pine ridges with a hidden halo diamond band...",
      fullStory: "We got engaged on a mountain trip we'd been planning for years. Rohan proposed right as the sun broke over the pine ridges with a hidden halo diamond band. The ring was beyond everything I had dreamed of—the diamond fire is magical in every light.",
      coupleImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
      ringTitle: "The Hidden Halo Round Brilliant Ring"
    },
    {
      storyId: "s3",
      coupleName: "Priya & Karan",
      location: "Mumbai, India",
      storySnippet: "Our families flew in from three different cities to celebrate with us. It was the most beautiful chaos we could have asked for, sealed with bespoke eternity bands...",
      fullStory: "Our families flew in from three different cities to celebrate with us. It was the most beautiful chaos we could have asked for, sealed with bespoke eternity bands that fit together flawlessly. The craftsmanship is pure perfection.",
      coupleImage: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
      ringTitle: "Pavé Band & Cushion Cut Centerpiece"
    },
    {
      storyId: "s4",
      coupleName: "Siddharth & Rhea",
      location: "Jaipur, India",
      storySnippet: "He proposed at sunset during our trip to the pink city. The emerald-cut lab diamond ring was breathtaking against the golden palace walls...",
      fullStory: "He proposed at sunset during our trip to the pink city. The emerald-cut lab diamond ring was breathtaking against the golden palace walls. Choosing ethical lab diamonds meant we got twice the carat size with zero ethical compromise.",
      coupleImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
      ringTitle: "The Emerald Cut Heritage Solitaire"
    }
  ],
  reviews: [
    {
      reviewId: "r1",
      clientName: "Priya S.",
      location: "Verified Client",
      quote: "Gemora Diam made it so effortless to customize and select the dream ring for my fiancé. If you're hesitant to shop for fine jewelry online, don't be! The diamond brilliance is extraordinary.",
      rating: 5
    },
    {
      reviewId: "r2",
      clientName: "Arjun K.",
      location: "Verified Client",
      quote: "100% recommend. I searched fine jewelry houses for months before discovering Gemora Diam. The custom ring builder allowed me to pick the exact stone shape and carat weight. Outstanding service!",
      rating: 5
    },
    {
      reviewId: "r3",
      clientName: "Meera V.",
      location: "Verified Client",
      quote: "The interactive 3D shape dial made it so easy to envision the ring on my hand before ordering. The bespoke package arrived overnight with full certification documents. Truly royal experience.",
      rating: 5
    },
    {
      reviewId: "r4",
      clientName: "Rohan D.",
      location: "Verified Client",
      quote: "Exceptional craftsmanship and attentive concierge care from consultation to delivery. The finished engagement ring took my partner's breath away. Thank you Gemora Diam!",
      rating: 5
    }
  ]
};

export default function LovedByCouplesSection() {
  const [sectionData, setSectionData] = useState(DEFAULT_COUPLE_DATA);
  const [loading, setLoading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  const carouselRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadSection = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) return;
        const res = await fetch(`${backendUrl}/Support/GetActiveCoupleSection`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && data.status !== false && (data.stories?.length || data.reviews?.length)) {
            setSectionData(data);
          }
        }
      } catch (err) {
        console.warn("Using curated couple love stories:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSection();
    return () => {
      isMounted = false;
    };
  }, []);

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
        {/* Section Header matching Tesora */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "36px"
          }}
        >
          {/* Left Column: Eyebrow, Title & Subtitle */}
          <div style={{ maxWidth: "640px" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#8d8070",
                margin: "0 0 10px 0"
              }}
            >
              {sectionData.headerEyebrow || "Real Love Stories"}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 3.2vw, 2.75rem)",
                fontWeight: 400,
                color: "#181818",
                lineHeight: 1.15,
                margin: "0 0 12px 0"
              }}
            >
              {sectionData.headerTitle || "Loved by couples"}
            </h2>
            <p
              style={{
                fontSize: "clamp(13px, 1.2vw, 15px)",
                color: "rgba(24, 24, 24, 0.65)",
                lineHeight: 1.55,
                margin: 0
              }}
            >
              {sectionData.headerDescription || "Proposals, promises, and the rings that made them. In their own words."}
            </p>
          </div>

          {/* Right Column: Rating score + Stars & Review Count + Carousel Navigation Arrows */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              flexWrap: "wrap"
            }}
          >
            {/* Rating summary */}
            {(sectionData.ratingScore || sectionData.reviewCountText) && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.1rem",
                    fontWeight: 500,
                    color: "#181818",
                    lineHeight: 1
                  }}
                >
                  {sectionData.ratingScore || "5.0"}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", gap: "2px", color: "var(--gold, #d4af37)" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="var(--gold, #d4af37)" color="var(--gold, #d4af37)" />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "0.74rem",
                      color: "rgba(24, 24, 24, 0.58)",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {sectionData.reviewCountText || "from 5 verified reviews"}
                  </span>
                </div>
              </div>
            )}

            {/* Carousel Navigation Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                aria-label="Previous story"
                onClick={() => scrollByDirection(-1)}
                disabled={!canScrollLeft}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: canScrollLeft ? "1px solid rgba(24, 24, 24, 0.25)" : "1px solid rgba(24, 24, 24, 0.12)",
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
                <ArrowLeft size={18} strokeWidth={1.7} />
              </button>

              <button
                type="button"
                aria-label="Next story"
                onClick={() => scrollByDirection(1)}
                disabled={!canScrollRight}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: canScrollRight ? "1px solid rgba(24, 24, 24, 0.25)" : "1px solid rgba(24, 24, 24, 0.12)",
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
                <ArrowRight size={18} strokeWidth={1.7} />
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
