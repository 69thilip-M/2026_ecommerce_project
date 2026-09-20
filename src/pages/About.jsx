/* eslint-disable no-unused-vars */

// src/pages/About.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

import productsData from "./productsData";

/*
  ADD YOUR IMAGE HERE:
  Save a landscape photo (about 1200 x 900, JPG) as
    src/assets/images/about-hero.jpg
  (If you use a PNG, just change the extension below.)
*/
// import aboutHero from "../assets/images/about-hero.jpg";
import aboutHero from "../assets/images/aboutpage_banner.png";
import {
  FaSeedling,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaEye,
  FaBullseye,
  FaCalendarAlt,
  FaShoppingBasket,
  FaStore,
  FaLeaf,
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

/* =====================================================
   DATA
===================================================== */

const TEAM = [
  { name: "Kural", role: "Founder & CEO" },
  { name: "Thilip", role: "Head of Operations" },
  { name: "Narmadha", role: "Customer Relations" },
];

const VALUES = [
  {
    Icon: FaSeedling,
    title: "Farm fresh",
    text: "Products picked from local farms and quality checked by hand.",
  },
  {
    Icon: FaTruck,
    title: "Fast delivery",
    text: "From your nearest KMR store to your door in 20–30 minutes.",
  },
  {
    Icon: FaShieldAlt,
    title: "Secure checkout",
    text: "Address, delivery fee and payment handled safely end to end.",
  },
  {
    Icon: FaHeadset,
    title: "Friendly support",
    text: "A real team that is here whenever you need a hand.",
  },
];

const AVATAR_GRADIENTS = [
  "from-[#06472a] to-[#158447]",
  "from-[#0b7040] to-[#5eaa32]",
  "from-[#0f766e] to-[#14b8a6]",
  "from-[#c2410c] to-[#f59e0b]",
];

// First 2 letters of the name, e.g. "Kural" -> "KU"
const getInitials = (name = "") =>
  (
    Array.from(name.trim().replace(/[^\p{L}\p{N}]/gu, ""))
      .slice(0, 2)
      .join("") || "GU"
  ).toUpperCase();

const getImage = (p) => p.image || p.imageUrl || p.img || "";

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
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* Up to `count` different product photos */
const uniquePhotos = (count = 3) => {
  const seen = new Set();
  const out = [];

  productsData.forEach((p) => {
    const src = getImage(p);
    if (!src || seen.has(src) || out.length >= count) return;
    seen.add(src);
    out.push({ src, name: p.name || p.productName || "Fresh produce" });
  });

  return out;
};

/* =====================================================
   PAGE
===================================================== */

function About() {
  const reduceMotion = useReducedMotion();
  const photos = uniquePhotos(3);

  const stats = [
    { Icon: FaCalendarAlt, value: "2024", label: "Founded" },
    {
      Icon: FaShoppingBasket,
      value: `${productsData.length}+`,
      label: "Fresh products",
    },
    { Icon: FaTruck, value: "20–30", label: "Minutes delivery" },
    { Icon: FaStore, value: "Daily", label: "Fresh stock" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f7fbf4] text-[#083f26]">
      <Navbar />

      {/* =========================
          HERO (minimal, light)
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f7fbf4] via-[#eef7eb] to-[#dff0d7]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#9bdd45]/15" />
        <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-[#158447]/10" />

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
              <span className="text-[#075c35]">About</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-extrabold tracking-wide text-[#158447] ring-1 ring-[#dbe8d7]">
              <FaLeaf />
              ABOUT KMR FRESH
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#083f26] md:text-5xl">
              Fresh shopping from your{" "}
              <span className="text-[#158447]">nearest store.</span>
            </h1>

            <p className="mt-5 max-w-lg leading-relaxed text-[#52665b]">
              KMR Fresh connects you with live inventory at your nearest store.
              Fresh products are ready for collection or fast delivery straight
              from our store.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "Fresh every day",
                "From your nearest store",
                "Fast & reliable",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-sm font-semibold text-[#3c5b48]"
                >
                  <FaCheckCircle className="text-[#158447]" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#075c35] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#075c35]/25 transition hover:bg-[#0b7040]"
              >
                Shop now
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/contact"
                className="rounded-xl border border-[#c9dcc4] bg-white px-6 py-3 text-sm font-bold text-[#075c35] transition hover:bg-[#eaf5e5]"
              >
                Contact us
              </Link>
            </div>
          </motion.div>

          {/* ---------- IMAGE ---------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute -inset-3 -rotate-3 rounded-[2.5rem] bg-[#9bdd45]/40" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl shadow-[#075c35]/20">
              <Photo
                src={aboutHero}
                alt="Fresh produce from KMR Fresh"
                className="h-full w-full object-cover"
              />
            </div>

            {/* floating cards */}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-[#dbe8d7]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf5e5] text-[#158447]">
                <FaCalendarAlt />
              </span>

              <div className="leading-tight">
                <p className="text-sm font-extrabold text-[#083f26]">
                  Since 2024
                </p>
                <p className="text-[11px] text-[#718579]">
                  Serving fresh daily
                </p>
              </div>
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="absolute -right-3 top-8 flex items-center gap-2 rounded-full bg-[#075c35] px-3.5 py-2 text-xs font-bold text-white shadow-lg"
            >
              <FaTruck /> 20–30 min
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="flex-grow">
        {/* =========================
            STATS (overlaps hero)
        ========================== */}
        <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map(({ Icon, value, label }, i) => (
              <Reveal key={label} delay={i * 0.06}>
                <div className="flex items-center gap-3 rounded-2xl border border-[#dbe8d7] bg-white p-4 shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eaf5e5] text-lg text-[#158447]">
                    <Icon />
                  </span>

                  <div>
                    <p className="text-xl font-extrabold leading-none text-[#075c35]">
                      {value}
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-[#718579]">
                      {label}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =========================
            OUR STORY
        ========================== */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <Reveal>
              <span className="text-xs font-extrabold tracking-[0.18em] text-[#158447]">
                OUR STORY
              </span>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#075c35] md:text-4xl">
                Freshness that meets trust
              </h2>

              <div className="mt-5 space-y-4 leading-relaxed text-[#52665b]">
                <p>
                  Welcome to{" "}
                  <span className="font-semibold text-[#075c35]">
                    FreshMart
                  </span>{" "}
                  – your one-stop shop for fresh vegetables, fruits, and organic
                  products. We are committed to delivering the best quality
                  products directly from farms to your doorstep.
                </p>

                <p>
                  Founded in 2024, our mission is to make healthy and organic
                  living accessible to everyone. With a wide range of fresh
                  produce, we ensure that your family enjoys the goodness of
                  nature every day.
                </p>

                <p>
                  Thank you for choosing FreshMart – where freshness meets
                  trust. 🌱
                </p>
              </div>
            </Reveal>

            {/* tidy photo grid */}
            <Reveal delay={0.1}>
              <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
                <Photo
                  src={photos[0]?.src}
                  alt={photos[0]?.name}
                  className="aspect-square w-full rounded-3xl object-cover shadow-md"
                />

                <Photo
                  src={photos[1]?.src}
                  alt={photos[1]?.name}
                  className="aspect-square w-full rounded-3xl object-cover shadow-md"
                />

                <div className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-[#06472a] to-[#158447] p-4 text-center text-white shadow-md">
                  <div>
                    <FaLeaf className="mx-auto mb-2 text-[#c8f26b]" />
                    <p className="text-3xl font-extrabold leading-none">2024</p>
                    <p className="mt-1.5 text-[11px] font-medium text-green-100">
                      Founded for freshness
                    </p>
                  </div>
                </div>

                <Photo
                  src={photos[2]?.src}
                  alt={photos[2]?.name}
                  className="aspect-square w-full rounded-3xl object-cover shadow-md"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================
            VISION & MISSION
        ========================== */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                Icon: FaEye,
                title: "Our Vision",
                text: "To be the most trusted and convenient platform for fresh, healthy, and organic produce, bringing farm-to-table goodness to every home.",
              },
              {
                Icon: FaBullseye,
                title: "Our Mission",
                text: "To provide fresh, high-quality vegetables, fruits, and organic products directly from local farms, ensuring sustainability, health, and customer satisfaction.",
              },
            ].map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-[#dbe8d7] bg-gradient-to-br from-white to-[#eaf5e5] p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#9bdd45]/20" />

                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[#075c35] text-lg text-white shadow-md shadow-[#075c35]/25">
                    <Icon />
                  </span>

                  <h3 className="relative mt-4 text-xl font-extrabold text-[#075c35]">
                    {title}
                  </h3>

                  <p className="relative mt-2 leading-relaxed text-[#52665b]">
                    {text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =========================
            WHY KMR FRESH
        ========================== */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal className="mb-8 text-center">
              <span className="text-xs font-extrabold tracking-[0.18em] text-[#158447]">
                WHY KMR FRESH
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#075c35]">
                Made for everyday freshness
              </h2>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map(({ Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf5e5] text-lg text-[#158447]">
                      <Icon />
                    </span>

                    <h3 className="mt-4 text-base font-extrabold text-[#083f26]">
                      {title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-[#718579]">
                      {text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            TEAM
        ========================== */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <Reveal className="mb-8 text-center">
            <span className="text-xs font-extrabold tracking-[0.18em] text-[#158447]">
              THE PEOPLE
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#075c35]">
              Meet our team
            </h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-3">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <div className="rounded-3xl border border-[#dbe8d7] bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <div
                    className={`mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${
                      AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                    } text-2xl font-extrabold tracking-wide text-white shadow-lg ring-4 ring-[#eaf5e5]`}
                  >
                    {getInitials(member.name)}
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold text-[#083f26]">
                    {member.name}
                  </h3>

                  <p className="text-sm text-[#718579]">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =========================
            LOCATION
        ========================== */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <Reveal className="mb-8 text-center">
            <span className="text-xs font-extrabold tracking-[0.18em] text-[#158447]">
              FIND US
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#075c35]">
              Our location
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-md lg:grid-cols-[minmax(260px,32%)_1fr]">
              {/* info */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] p-7 text-white">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

                <h3 className="relative text-xl font-extrabold">
                  Visit KMR Fresh
                </h3>

                <ul className="relative mt-5 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <FaMapMarkerAlt className="mt-0.5 shrink-0 text-[#c8f26b]" />
                    123 Green Street, Freshville, India
                  </li>

                  <li className="flex items-start gap-3">
                    <FaPhoneAlt className="mt-0.5 shrink-0 text-[#c8f26b]" />
                    <span>
                      +91 98765 43210
                      <br />
                      +91 91234 56789
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <FaEnvelope className="mt-0.5 shrink-0 text-[#c8f26b]" />
                    support@kmrstore.com
                  </li>
                </ul>

                <Link
                  to="/contact"
                  className="group relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#075c35] transition hover:bg-[#eaf5e5]"
                >
                  Contact us
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* map */}
              <iframe
                title="FreshMart Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.4742551580387!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670e943e8c7%3A0x1fbc!2sBangalore!5e0!3m2!1sen!2sin!4v1615189259969!5m2!1sen!2sin"
                width="100%"
                height="400"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full border-0 lg:h-full lg:min-h-[400px]"
              />
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;
