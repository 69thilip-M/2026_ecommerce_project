import { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
        <Slider {...settings}>
          {testimonials.map((t) => (
            <div key={t.id} className="px-4">
              <div className="bg-white border border-[#dbe8d7] shadow-lg rounded-2xl p-6 h-40 flex flex-col justify-center transition hover:shadow-xl">
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
