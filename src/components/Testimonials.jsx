import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";

/* ---------------------------------------------------------
   Avatar helpers
---------------------------------------------------------- */

// First 2 letters of the user's name, e.g. "Karthik Raja" -> "KA"
const getInitials = (name = "") => {
  const clean = String(name)
    .trim()
    .replace(/[^\p{L}\p{N}]/gu, "");
  const letters = Array.from(clean).slice(0, 2).join("");
  return (letters || "GU").toUpperCase(); // "GU" = Guest fallback
};

// Every user always gets the same colour, picked from their name
const AVATAR_GRADIENTS = [
  ["#06472a", "#158447"],
  ["#0b7040", "#5eaa32"],
  ["#158447", "#2f9e5b"],
  ["#0f766e", "#14b8a6"],
  ["#c2410c", "#f59e0b"],
  ["#4d7c0f", "#84cc16"],
];

const getGradient = (name = "") => {
  const sum = Array.from(String(name)).reduce(
    (total, ch) => total + ch.charCodeAt(0),
    0,
  );
  const [from, to] = AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
};

function Avatar({ name, small = false }) {
  return (
    <div
      role="img"
      aria-label={`${name || "Guest"} profile`}
      className={`tm-avatar ${small ? "is-small" : ""}`}
      style={{ background: getGradient(name) }}
    >
      {getInitials(name)}
    </div>
  );
}

/* ---------------------------------------------------------
   Component
---------------------------------------------------------- */
function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(
          collection(db, "testimonials"),
          orderBy("createdAt", "desc"),
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const count = testimonials.length;

  const settings = {
    arrows: false,
    dots: true,
    dotsClass: "tm-dots",
    customPaging: (i) => (
      <button type="button" aria-label={`Go to testimonial ${i + 1}`} />
    ),
    infinite: count > 3,
    autoplay: count > 1,
    autoplaySpeed: 4200,
    pauseOnHover: true,
    speed: 700,
    cssEase: "cubic-bezier(0.22, 1, 0.36, 1)",
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 2, infinite: count > 2 },
      },
      {
        breakpoint: 720,
        settings: { slidesToShow: 1, infinite: count > 1 },
      },
    ],
  };

  return (
    <section className="tm-section" aria-labelledby="testimonials-title">
      {/* decorative background */}
      <span className="tm-blob tm-blob-1" />
      <span className="tm-blob tm-blob-2" />
      <FormatQuoteRoundedIcon className="tm-watermark" />

      <div className="tm-inner">
        {/* ---------- Header ---------- */}
        <div className="tm-header">
          <div className="tm-title">
            <div className="tm-eyebrow">
              <EnergySavingsLeafOutlinedIcon fontSize="small" />
              <span>Customer stories</span>
            </div>

            <h2 id="testimonials-title">What our customers say</h2>

            <p>Real words from people who shop fresh with KMR.</p>

            {count > 0 && (
              <div className="tm-proof">
                <div className="tm-stack">
                  {testimonials.slice(0, 4).map((t) => (
                    <Avatar key={t.id} name={t.name} small />
                  ))}
                </div>

                <span>
                  Loved by <b>{count}</b>{" "}
                  {count === 1 ? "customer" : "customers"}
                </span>
              </div>
            )}
          </div>

          {count > 0 && (
            <div className="tm-nav">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => sliderRef.current?.slickPrev()}
              >
                <ArrowBackRoundedIcon />
              </button>

              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => sliderRef.current?.slickNext()}
              >
                <ArrowForwardRoundedIcon />
              </button>
            </div>
          )}
        </div>

        {/* ---------- Body ---------- */}
        {loading ? (
          <div className="tm-skeleton-row" aria-hidden="true">
            <span className="tm-skeleton" />
            <span className="tm-skeleton" />
            <span className="tm-skeleton" />
          </div>
        ) : count > 0 ? (
          <div className="tm-slider">
            <Slider ref={sliderRef} {...settings}>
              {testimonials.map((t) => {
                const rating = Math.min(
                  5,
                  Math.max(0, Math.round(Number(t.rating) || 0)),
                );

                return (
                  <div key={t.id} className="tm-slide">
                    <article className="tm-card">
                      <div className="tm-top">
                        <span className="tm-quote">
                          <FormatQuoteRoundedIcon />
                        </span>

                        {rating > 0 ? (
                          <span
                            className="tm-stars"
                            aria-label={`${rating} out of 5 stars`}
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <StarRoundedIcon
                                key={n}
                                className={n <= rating ? "on" : ""}
                              />
                            ))}
                          </span>
                        ) : (
                          <span className="tm-chip">
                            <VerifiedRoundedIcon />
                            Happy customer
                          </span>
                        )}
                      </div>

                      <p className="tm-text" title={t.text}>
                        {t.text}
                      </p>

                      <div className="tm-user">
                        <Avatar name={t.name} />

                        <div>
                          <h4>{t.name}</h4>
                          <small>
                            <VerifiedRoundedIcon />
                            KMR Fresh customer
                          </small>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : (
          <div className="tm-empty">
            <FormatQuoteRoundedIcon />
            <h3>No testimonials yet</h3>
            <p>Be the first to share how KMR Fresh worked for you.</p>
          </div>
        )}

        {/* ---------- CTA ---------- */}
        <div className="tm-cta">
          <button type="button" onClick={() => navigate("/add-testimonial")}>
            <RateReviewOutlinedIcon />
            Share your experience
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
