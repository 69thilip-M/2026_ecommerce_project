import { useRef, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import bannerHome from "../assets/images/banner-home.jpg";
import emailjs from "@emailjs/browser";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { SiX } from "react-icons/si";

import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";

function Contact() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_lubzihg",
        "template_9zj1pxf",
        formRef.current,
        "jLKuUYxKz8xJweHYf",
      )
      .then(
        () => {
          setStatus("✅ Message sent successfully!");
          formRef.current.reset();
        },
        () => {
          setStatus("❌ Failed to send message. Try again.");
        },
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBF5]">
      <Navbar />

      <main className="flex-grow py-12 px-5">
        {/* ================= HERO ================= */}
        <section className="page-hero contact-page-hero">
          <div>
            <span
              className="
                text-[#075B35]
                font-bold
                tracking-wider
              "
            >
              CONTACT MARKET SNAP
            </span>

            <h1 className="text-[#12352A]">
              We are here to
              <br />
              help with your
              <br />
              shopping needs.
            </h1>

            <p className="text-[#52665D]">
              Have a question, need help, or want to work together? The Market
              Snap team is ready to help quickly and warmly.
            </p>
          </div>

          <div className="page-hero-art">
            <img src={bannerHome} alt="Fresh groceries from Market Snap" />

            <strong
              className="
                bg-[#075B35]
                text-white
              "
            >
              We're here to help
            </strong>
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section>
          <div
            className="
              max-w-6xl
              mx-auto
              grid
              md:grid-cols-2
              gap-12
              bg-white
              shadow-[0_10px_35px_rgba(7,91,53,0.08)]
              rounded-3xl
              p-8
              border
              border-[#DCE9D8]
            "
          >
            {/* ================= CONTACT FORM ================= */}
            <div className="px-4 md:px-6">
              <h2
                className="
                  text-4xl
                  font-bold
                  text-[#075B35]
                  mb-6
                "
              >
                Contact Us
              </h2>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your Name"
                  required
                  className="
                    w-full
                    p-4
                    rounded-xl
                    border
                    border-[#D5E2D1]
                    bg-[#FBFDF9]
                    text-[#12352A]
                    placeholder-[#829189]
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-[#9BE22D]
                    focus:border-[#075B35]
                  "
                />

                {/* Email */}
                <input
                  type="email"
                  name="user_email"
                  placeholder="you@example.com"
                  required
                  className="
                    w-full
                    p-4
                    rounded-xl
                    border
                    border-[#D5E2D1]
                    bg-[#FBFDF9]
                    text-[#12352A]
                    placeholder-[#829189]
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-[#9BE22D]
                    focus:border-[#075B35]
                  "
                />

                {/* Message */}
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Your Message..."
                  required
                  className="
                    w-full
                    p-4
                    rounded-xl
                    border
                    border-[#D5E2D1]
                    bg-[#FBFDF9]
                    text-[#12352A]
                    placeholder-[#829189]
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-[#9BE22D]
                    focus:border-[#075B35]
                    resize-none
                  "
                ></textarea>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full
                    py-3
                    rounded-xl
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    ${
                      loading
                        ? "bg-[#7BA98F] cursor-not-allowed"
                        : "bg-[#108A48] hover:bg-[#075B35] hover:shadow-lg hover:shadow-[#075B35]/20"
                    }
                  `}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>

                {/* Status */}
                {status && (
                  <p
                    className="
                      text-center
                      mt-4
                      font-medium
                      text-[#075B35]
                    "
                  >
                    {status}
                  </p>
                )}
              </form>
            </div>

            {/* ================= CONTACT INFO ================= */}
            <div
              className="
                px-8
                md:px-12
                flex
                flex-col
                justify-center
                space-y-6
                border-l
                border-[#DCE9D8]
              "
            >
              <h2
                className="
                  text-4xl
                  font-bold
                  text-[#075B35]
                  mb-4
                "
              >
                Get in Touch
              </h2>

              {/* Address */}
              <div className="flex items-start gap-3">
                <HiOutlineLocationMarker
                  className="
                    text-2xl
                    text-[#108A48]
                    flex-shrink-0
                  "
                />

                <p className="text-[#12352A]">
                  123 Green Street, Freshville, India
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <HiOutlinePhone
                  className="
                    text-2xl
                    text-[#108A48]
                    flex-shrink-0
                  "
                />

                <div className="text-[#12352A]">
                  <p>+91 98765 43210</p>
                  <p>+91 91234 56789</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <HiOutlineMail
                  className="
                    text-2xl
                    text-[#108A48]
                    flex-shrink-0
                  "
                />

                <p className="text-[#12352A]">support@kmrstore.com</p>
              </div>

              {/* Follow Us */}
              <div>
                <h3
                  className="
                    text-lg
                    font-semibold
                    text-[#12352A]
                    mb-3
                  "
                >
                  Follow Us
                </h3>

                <div
                  className="
                    flex
                    gap-3
                  "
                >
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      bg-[#EEF8EA]
                      text-[#075B35]
                      hover:bg-[#075B35]
                      hover:text-white
                      transition
                    "
                  >
                    <FaFacebookF />
                  </a>

                  <a
                    href="#"
                    aria-label="Instagram"
                    className="
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      bg-[#EEF8EA]
                      text-[#075B35]
                      hover:bg-[#075B35]
                      hover:text-white
                      transition
                    "
                  >
                    <FaInstagram />
                  </a>

                  <a
                    href="#"
                    aria-label="X Twitter"
                    className="
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      bg-[#EEF8EA]
                      text-[#075B35]
                      hover:bg-[#075B35]
                      hover:text-white
                      transition
                    "
                  >
                    <SiX />
                  </a>

                  <a
                    href="#"
                    aria-label="YouTube"
                    className="
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      bg-[#EEF8EA]
                      text-[#075B35]
                      hover:bg-[#075B35]
                      hover:text-white
                      transition
                    "
                  >
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
