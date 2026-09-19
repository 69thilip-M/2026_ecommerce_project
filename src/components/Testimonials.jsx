import { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

// Every user always gets the same color, picked from their name
const AVATAR_GRADIENTS = [
  "from-[#06472a] to-[#158447]",
  "from-[#0b7040] to-[#5eaa32]",
  "from-[#158447] to-[#2f9e5b]",
  "from-[#0f766e] to-[#14b8a6]",
  "from-[#c2410c] to-[#f59e0b]",
  "from-[#4d7c0f] to-[#84cc16]",
];

const getGradient = (name = "") => {
  const sum = Array.from(String(name)).reduce(
    (total, ch) => total + ch.charCodeAt(0),
    0,
  );
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
};

function Avatar({ name }) {
  return (
    <div className="relative mx-auto mb-4 w-max">
      <div
        role="img"
        aria-label={`${name || "Guest"} profile`}
        className={`grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${getGradient(
          name,
        )} text-xl font-extrabold tracking-wide text-white shadow-lg ring-4 ring-[#eaf5e5] transition-transform duration-300 group-hover:scale-110`}
      >
        {getInitials(name)}
      </div>

      {/* small quote badge */}
      <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-[#dbe8d7] bg-white text-base font-black leading-none text-[#158447] shadow">
        “
      </span>
    </div>
  );
}

/* ---------------------------------------------------------
   Component
---------------------------------------------------------- */
function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
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
      }
    };

    fetchTestimonials();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-[#f7fbf4] py-16 px-6 text-center transition-colors duration-300">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-[#075c35] mb-8">
        🌟 What Our Customers Say 🌟
      </h2>

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        // makes every card in the row the same height
        <div className="[&_.slick-track]:flex [&_.slick-slide]:!h-auto [&_.slick-slide>div]:h-full">
          <Slider {...settings}>
            {testimonials.map((t) => (
              <div key={t.id} className="h-full px-4 py-2">
                <div className="group flex h-full min-h-[230px] flex-col items-center justify-center rounded-2xl border border-[#dbe8d7] bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {/* Profile icon: first 2 letters of the name */}
                  <Avatar name={t.name} />

                  {/* Testimonial Text */}
                  <p className="text-[#52665b] italic leading-relaxed">
                    “{t.text}”
                  </p>

                  {/* Customer Name */}
                  <h4 className="mt-4 font-semibold text-[#075c35]">
                    – {t.name}
                  </h4>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p className="text-[#52665b]">No testimonials yet.</p>
      )}

      {/* Add Testimonial Button */}
      <button
        onClick={() => navigate("/add-testimonial")}
        className="mt-16 px-6 py-2 bg-[#075c35] hover:bg-[#083f26] text-white rounded-lg font-semibold transition duration-300"
      >
        Add Testimonial
      </button>
    </div>
  );
}

export default Testimonials;
