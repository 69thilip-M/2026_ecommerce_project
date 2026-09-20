/* eslint-disable no-unused-vars */

// src/pages/Contact.jsx

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import emailjs from "@emailjs/browser";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

/*
  ADD YOUR IMAGE HERE:
  Save a landscape photo (about 1200 x 900, JPG) as
    src/assets/images/contact-hero.jpg
  (If you use a PNG, just change the extension below.)
*/
// import contactHero from "../assets/images/contact-hero.jpg";
import contactHero from "../assets/images/contact_banner.jpg";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaUser,
  FaEnvelope,
  FaRegCommentDots,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronDown,
  FaHeadset,
  FaLeaf,
  FaPhoneAlt,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";

/* =====================================================
   DATA
===================================================== */

const CONTACT_ROWS = [
  {
    Icon: HiOutlineLocationMarker,
    label: "Visit us",
    lines: [{ text: "123 Green Street, Freshville, India" }],
  },
  {
    Icon: HiOutlinePhone,
    label: "Call us",
    lines: [
      { text: "+91 98765 43210", href: "tel:+919876543210" },
      { text: "+91 91234 56789", href: "tel:+919123456789" },
    ],
  },
  {
    Icon: HiOutlineMail,
    label: "Email us",
    lines: [
      { text: "support@kmrstore.com", href: "mailto:support@kmrstore.com" },
    ],
  },
];

const SOCIALS = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: SiX, label: "X Twitter" },
  { Icon: FaYoutube, label: "YouTube" },
];

const FAQS = [
  {
    q: "How fast is delivery?",
    a: "Hand-picked daily essentials are delivered from your nearest KMR store in about 20–30 minutes.",
  },
  {
    q: "Is delivery free?",
    a: "Yes — orders above ₹1,000 get free delivery.",
  },
  {
    q: "How do I track my order?",
    a: "Your invoice and order updates are available in your account after checkout.",
  },
  {
    q: "Is checkout secure?",
    a: "Address, delivery fee and payment are handled in one secure flow, so you can shop with confidence.",
  },
];

/* Image with a friendly fallback tile */
function Photo({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#eaf5e5] to-[#d6ecce] text-[#158447] ${className}`}
      >
        <FaLeaf className="text-3xl opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* =====================================================
   FORM FIELD
===================================================== */
const inputCls =
  "w-full rounded-xl border border-[#d5e2d1] bg-[#fbfdf9] py-3.5 pl-11 pr-4 text-[15px] text-[#12352a] placeholder-[#829189] outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/15";

function Field({ label, Icon, alignTop, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-[#083f26]">
        {label}
      </span>

      <span className="relative block">
        <Icon
          className={`pointer-events-none absolute left-4 text-[#158447] ${
            alignTop ? "top-4" : "top-1/2 -translate-y-1/2"
          }`}
        />
        {children}
      </span>
    </label>
  );
}

/* =====================================================
   PAGE
===================================================== */
function Contact() {
  const formRef = useRef();
  const reduceMotion = useReducedMotion();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "ok" | "error", text }
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .sendForm(
        "service_lubzihg",
        "template_9zj1pxf",
        formRef.current,
        "jLKuUYxKz8xJweHYf",
      )
      .then(
        () => {
          setStatus({ type: "ok", text: "Message sent successfully!" });
          formRef.current.reset();
        },
        () => {
          setStatus({
            type: "error",
            text: "Failed to send message. Try again.",
          });
        },
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7fbf4] text-[#083f26]">
      <Navbar />

      {/* =========================
          HERO (minimal, light)
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f7fbf4] via-[#eef7eb] to-[#dff0d7]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#9bdd45]/15" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-[#158447]/10" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-14">
          {/* ---------- TEXT ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="mb-5 flex items-center gap-2 text-xs font-medium text-[#718579]">
              <Link to="/home" className="hover:text-[#075c35]">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#075c35]">Contact</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-extrabold tracking-wide text-[#158447] ring-1 ring-[#dbe8d7]">
              <FaHeadset />
              CONTACT KMR FRESH
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#083f26] md:text-5xl">
              We are here to help with your{" "}
              <span className="text-[#158447]">shopping needs.</span>
            </h1>

            <p className="mt-5 max-w-lg leading-relaxed text-[#52665b]">
              Have a question, need help, or want to work together? The KMR
              Fresh team is ready to help quickly and warmly.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#075c35] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#075c35]/25 transition hover:bg-[#0b7040]"
              >
                <FaPhoneAlt className="text-xs" />
                +91 98765 43210
              </a>

              <a
                href="mailto:support@kmrstore.com"
                className="inline-flex items-center gap-2.5 rounded-xl border border-[#c9dcc4] bg-white px-5 py-3 text-sm font-bold text-[#075c35] transition hover:bg-[#eaf5e5]"
              >
                <FaEnvelope className="text-xs" />
                support@kmrstore.com
              </a>
            </div>
          </motion.div>

          {/* ---------- IMAGE ---------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-[#9bdd45]/40" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl shadow-[#075c35]/20">
              <Photo
                src={contactHero}
                alt="KMR Fresh customer support"
                className="h-full w-full object-cover"
              />
            </div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-[#dbe8d7]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf5e5] text-[#158447]">
                <FaHeadset />
              </span>

              <div className="leading-tight">
                <p className="text-sm font-extrabold text-[#083f26]">
                  We're here to help
                </p>
                <p className="text-[11px] text-[#718579]">Say hello 👋</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="flex-grow">
        {/* =========================
            FORM + INFO
        ========================== */}
        <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4">
          <div className="grid overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-xl lg:grid-cols-[1.4fr_1fr]">
            {/* ---------- FORM ---------- */}
            <div className="p-6 sm:p-9">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#075c35]">
                Send us a message
              </h2>

              <p className="mt-1.5 text-sm text-[#718579]">
                Fill in the form and we'll get back to you soon.
              </p>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                <Field label="Your name" Icon={FaUser}>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Your Name"
                    required
                    className={inputCls}
                  />
                </Field>

                <Field label="Email address" Icon={FaEnvelope}>
                  <input
                    type="email"
                    name="user_email"
                    placeholder="you@example.com"
                    required
                    className={inputCls}
                  />
                </Field>

                <Field label="Message" Icon={FaRegCommentDots} alignTop>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Your Message..."
                    required
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#075c35] to-[#158447] py-3.5 font-bold text-white shadow-lg shadow-[#075c35]/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-sm" />
                      Send Message
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="status"
                      className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold ${
                        status.type === "ok"
                          ? "bg-[#eaf5e5] text-[#075c35]"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {status.type === "ok" ? (
                        <FaCheckCircle />
                      ) : (
                        <FaExclamationCircle />
                      )}
                      {status.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* ---------- INFO PANEL ---------- */}
            <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] p-7 text-white sm:p-9">
              <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#9bdd45]/15" />

              <h2 className="relative text-2xl font-extrabold">Get in touch</h2>

              <p className="relative mt-1.5 text-sm text-green-100">
                Reach us any way that suits you.
              </p>

              <ul className="relative mt-7 space-y-5">
                {CONTACT_ROWS.map(({ Icon, label, lines }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-xl text-[#c8f26b]">
                      <Icon />
                    </span>

                    <div className="min-w-0 text-sm">
                      <p className="text-[12px] font-semibold uppercase tracking-wider text-green-100/80">
                        {label}
                      </p>

                      {lines.map((line) =>
                        line.href ? (
                          <a
                            key={line.text}
                            href={line.href}
                            className="block font-semibold transition hover:text-[#c8f26b]"
                          >
                            {line.text}
                          </a>
                        ) : (
                          <p key={line.text} className="font-semibold">
                            {line.text}
                          </p>
                        ),
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="relative mt-8">
                <h3 className="text-sm font-bold">Follow us</h3>

                <div className="mt-3 flex gap-3">
                  {SOCIALS.map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/15 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#075c35]"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FAQ
        ========================== */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <Reveal className="mb-8 text-center">
            <span className="text-xs font-extrabold tracking-[0.18em] text-[#158447]">
              QUICK ANSWERS
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#075c35]">
              Frequently asked questions
            </h2>
          </Reveal>

          <div className="space-y-3">
            {FAQS.map((item, i) => {
              const open = openFaq === i;

              return (
                <Reveal key={item.q} delay={i * 0.05}>
                  <div
                    className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                      open
                        ? "border-[#158447]/50 shadow-md"
                        : "border-[#dbe8d7]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-bold text-[#083f26]">{item.q}</span>

                      <FaChevronDown
                        className={`shrink-0 text-xs text-[#158447] transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-[#52665b]">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
