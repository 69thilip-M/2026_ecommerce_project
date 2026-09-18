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
        "jLKuUYxKz8xJweHYf"
      )
      .then(
        () => {
          setStatus("✅ Message sent successfully!");
          formRef.current.reset();
        },
        () => {
          setStatus("❌ Failed to send message. Try again.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-50 dark:bg-gray-900"><Navbar /><main className="flex-grow py-12 px-5"><section className="page-hero contact-page-hero"><div><span>CONTACT KMR FRESH</span><h1>We are here to<br />help with your<br />shopping needs.</h1><p>Have a question, need help, or want to work together? The KMR Fresh team is ready to help quickly and warmly.</p></div><div className="page-hero-art"><img src={bannerHome} alt="Fresh groceries from KMR Fresh" /><strong>We're here to help</strong></div></section>
    <section>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8">
        {/* Left: Contact Form (less padding) */}
        <div className="px-4 md:px-6">
          <h2 className="text-4xl font-bold text-orange-700 dark:text-orange-400 mb-6">
            Contact Us
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="user_name"
              placeholder="Your Name"
              required
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <input
              type="email"
              name="user_email"
              placeholder="you@example.com"
              required
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Your Message..."
              required
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
            ></textarea>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                loading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <p className="text-center mt-4 font-medium text-orange-700 dark:text-orange-400">
                {status}
              </p>
            )}
          </form>
        </div>

        {/* Right: Contact Info (more padding + dividing line) */}
        <div className="px-8 md:px-12 flex flex-col justify-center space-y-6 border-l border-gray-300 dark:border-gray-600">
          <h2 className="text-4xl font-bold text-orange-700 dark:text-orange-400 mb-4">
            Get in Touch
          </h2>

          <div className="flex items-start gap-3">
            <HiOutlineLocationMarker className="text-2xl text-orange-600 dark:text-orange-400" />
            <p className="text-gray-800 dark:text-gray-200">
              123 Green Street, Freshville, India
            </p>
          </div>

          <div className="flex items-start gap-3">
            <HiOutlinePhone className="text-2xl text-orange-600 dark:text-orange-400" />
            <div className="text-gray-800 dark:text-gray-200">
              <p>+91 98765 43210</p>
              <p>+91 91234 56789</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <HiOutlineMail className="text-2xl text-orange-600 dark:text-orange-400" />
            <p className="text-gray-800 dark:text-gray-200">
              support@kmrstore.com
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Follow Us
            </h3>
            <div className="flex gap-4 text-2xl text-orange-600 dark:text-orange-400">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-orange-700"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-orange-700"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="X Twitter"
                className="hover:text-orange-700"
              >
                <SiX />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-orange-700">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section></main><Footer /></div>
  );
}

export default Contact;
