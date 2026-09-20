/* eslint-disable no-unused-vars */
// src/pages/AddTestimonial.jsx

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaStar,
  FaTimes,
  FaQuoteLeft,
  FaLeaf,
  FaPaperPlane,
  FaUser,
  FaCheck,
  FaLock,
} from "react-icons/fa";

/* =====================================================
   SETTINGS
===================================================== */

// Where to go after closing / submitting
const HOME_ROUTE = "/home";

// Where the "Log in" button goes if the user is not signed in
const LOGIN_ROUTE = "/login";

const MAX_LENGTH = 300;

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/* =====================================================
   AVATAR HELPERS (same colours as the testimonial cards)
===================================================== */

const getInitials = (name = "") => {
  const clean = String(name)
    .trim()
    .replace(/[^\p{L}\p{N}]/gu, "");

  const letters = Array.from(clean).slice(0, 2).join("");

  return (letters || "GU").toUpperCase();
};

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

const inputCls = (error) =>
  `w-full rounded-xl border bg-[#fbfdf9] py-3 text-[15px] text-[#083f26] placeholder-[#9aa99f] outline-none transition focus:bg-white focus:ring-4 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-[#dbe8d7] focus:border-[#158447] focus:ring-[#158447]/15"
  }`;

/* =====================================================
   SMALL PIECES
===================================================== */

function FieldError({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="alert"
          className="mt-1.5 text-[12.5px] font-medium text-red-500"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Stars({ value }) {
  return (
    <span className="inline-flex gap-0.5 text-sm" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar
          key={n}
          className={n <= value ? "text-[#f5a623]" : "text-[#d6e4d1]"}
        />
      ))}
    </span>
  );
}

/* Live preview of how the testimonial will look */

function Preview({ name, text, rating }) {
  const shownName = name.trim() || "Your name";

  return (
    <div className="relative rounded-2xl border border-[#dbe8d7] bg-white p-5 shadow-lg shadow-[#075c35]/10">
      <span className="absolute -top-3 left-5 rounded-full bg-[#9bdd45] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#06472a]">
        Live preview
      </span>

      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf5e5] text-[#158447]">
          <FaQuoteLeft />
        </span>

        <Stars value={rating} />
      </div>

      <p
        className={`mt-3 min-h-[3.6rem] text-sm leading-relaxed ${
          text.trim() ? "text-[#41584b]" : "text-[#9aa99f]"
        }`}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text.trim() || "Your comment will appear here as you type…"}
      </p>

      <div className="mt-4 flex items-center gap-3 border-t border-dashed border-[#d3e3cf] pt-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold text-white"
          style={{ background: getGradient(shownName) }}
        >
          {getInitials(shownName)}
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[#083f26]">
            {shownName}
          </p>

          <p className="text-[11px] text-[#718579]">KMR Fresh customer</p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   PAGE
===================================================== */

function AddTestimonial() {
  const navigate = useNavigate();

  const auth = getAuth();

  const [user, setUser] = useState(auth.currentUser);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | success

  const redirectTimer = useRef(null);

  const saving = status === "saving";

  // keep the logged-in user up to date (auth may load after the page)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
    });

    return unsubscribe;
  }, [auth]);

  // pre-fill the name from the account
  useEffect(() => {
    if (user?.displayName) {
      setName((previous) => previous || user.displayName);
    }
  }, [user]);

  // close with Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) navigate(-1);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, saving]);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const validate = () => {
    const e = {};

    if (name.trim().length < 2) {
      e.name = "Please enter your name";
    }

    if (!rating) {
      e.rating = "Please choose a star rating";
    }

    if (text.trim().length < 10) {
      e.text = "Please write at least 10 characters";
    }

    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setFormError("");

    if (!user) {
      setFormError("You must be logged in to add a testimonial.");

      return;
    }

    const found = validate();

    setErrors(found);

    if (Object.keys(found).length > 0) {
      return;
    }

    setStatus("saving");

    try {
      await addDoc(collection(db, "testimonials"), {
        name: name.trim(),
        text: text.trim(),
        rating,
        userId: user.uid,
        createdAt: new Date(),
      });

      setStatus("success");

      redirectTimer.current = setTimeout(() => navigate(HOME_ROUTE), 2200);
    } catch (error) {
      console.error("Error adding testimonial:", error);

      setStatus("idle");

      setFormError("Failed to add testimonial. Please try again.");
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] px-4 py-10">
      {/* BACKGROUND DECORATION */}

      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/5" />

      <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-[#9bdd45]/15 blur-2xl" />

      {/* CARD */}

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="testimonial-title"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[0.85fr_1.15fr]"
      >
        {/* CLOSE */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={saving}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-[#eaf5e5] text-[#075c35] transition hover:rotate-90 hover:bg-[#dcefd5] disabled:opacity-50"
        >
          <FaTimes />
        </button>

        {/* ---------------- LEFT PANEL ---------------- */}

        <div className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-gradient-to-br from-[#eaf5e5] to-[#f7fbf4] p-8 md:flex">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#b8dc8a]/30" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe8d7] bg-white px-3 py-1.5 text-xs font-extrabold text-[#158447]">
              <FaLeaf />
              Customer stories
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#083f26]">
              Tell us how <span className="text-[#158447]">fresh</span> it felt.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#637a6b]">
              Your words help other families choose the best for their kitchen —
              and help us keep improving.
            </p>
          </div>

          <div className="relative">
            <Preview name={name} text={text} rating={rating} />
          </div>
        </div>

        {/* ---------------- RIGHT: FORM ---------------- */}

        <div className="relative p-6 sm:p-9">
          <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              /* ---------- SUCCESS ---------- */

              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
              >
                <motion.div
                  className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#075c35] to-[#158447] shadow-xl shadow-[#075c35]/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                >
                  <svg viewBox="0 0 52 52" className="h-12 w-12">
                    <motion.path
                      d="M13 27l9 9 17-19"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                    />
                  </svg>
                </motion.div>

                <h2 className="mt-6 text-2xl font-extrabold text-[#083f26]">
                  Thank you, {name.trim().split(" ")[0]}!
                </h2>

                <p className="mt-2 max-w-xs text-sm text-[#718579]">
                  Your testimonial has been added. Taking you back to the home
                  page…
                </p>

                <button
                  type="button"
                  onClick={() => navigate(HOME_ROUTE)}
                  className="mt-6 rounded-xl bg-[#075c35] px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#0b7040]"
                >
                  Go now
                </button>
              </motion.div>
            ) : (
              /* ---------- FORM ---------- */

              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1
                  id="testimonial-title"
                  className="pr-10 text-2xl font-extrabold tracking-tight text-[#083f26]"
                >
                  Add your testimonial
                </h1>

                <p className="mt-1 text-sm text-[#718579]">
                  It only takes a minute.
                </p>

                {/* NOT LOGGED IN */}

                {!user && (
                  <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#f0dfae] bg-[#fff8e5] p-4">
                    <FaLock className="shrink-0 text-lg text-[#b88e1f]" />

                    <p className="flex-1 text-sm font-semibold text-[#8a6a14]">
                      Log in to share your experience.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(LOGIN_ROUTE)}
                      className="rounded-lg bg-[#b88e1f] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#9c7717]"
                    >
                      Log in
                    </button>
                  </div>
                )}

                {/* NAME */}

                <div className="mt-6">
                  <label
                    htmlFor="t-name"
                    className="mb-1.5 block text-[13px] font-bold text-[#083f26]"
                  >
                    Your name
                  </label>

                  <div className="relative">
                    <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#158447]" />

                    <input
                      id="t-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);

                        setErrors((p) => ({ ...p, name: undefined }));
                      }}
                      maxLength={40}
                      placeholder="e.g. Karthik Raja"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      className={`${inputCls(errors.name)} pl-11 pr-4`}
                    />
                  </div>

                  <FieldError message={errors.name} />
                </div>

                {/* RATING */}

                <div className="mt-5">
                  <p className="mb-1.5 text-[13px] font-bold text-[#083f26]">
                    How was your experience?
                  </p>

                  <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <motion.button
                        key={n}
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          setRating(n);

                          setErrors((p) => ({ ...p, rating: undefined }));
                        }}
                        onMouseEnter={() => setHoverRating(n)}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        aria-pressed={rating === n}
                        className={`p-1 text-3xl transition-all duration-150 hover:scale-125 ${
                          activeRating >= n
                            ? "text-[#f5a623] drop-shadow-sm"
                            : "text-[#d6e4d1]"
                        }`}
                      >
                        <FaStar />
                      </motion.button>
                    ))}

                    <AnimatePresence mode="wait">
                      {activeRating > 0 && (
                        <motion.span
                          key={activeRating}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="ml-3 rounded-full bg-[#eaf5e5] px-3 py-1 text-xs font-extrabold text-[#075c35]"
                        >
                          {RATING_LABELS[activeRating]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <FieldError message={errors.rating} />
                </div>

                {/* COMMENT */}

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="t-text"
                      className="text-[13px] font-bold text-[#083f26]"
                    >
                      Your comment
                    </label>

                    <span
                      className={`text-[11px] font-semibold ${
                        text.length > MAX_LENGTH - 30
                          ? "text-[#c2410c]"
                          : "text-[#9aa99f]"
                      }`}
                    >
                      {text.length}/{MAX_LENGTH}
                    </span>
                  </div>

                  <textarea
                    id="t-text"
                    rows={4}
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value.slice(0, MAX_LENGTH));

                      setErrors((p) => ({ ...p, text: undefined }));
                    }}
                    placeholder="How were the freshness, quality and delivery?"
                    aria-invalid={Boolean(errors.text)}
                    className={`${inputCls(errors.text)} resize-none px-4`}
                  />

                  <FieldError message={errors.text} />
                </div>

                {/* FORM ERROR */}

                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                      className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                    >
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* BUTTONS */}

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={saving}
                    className="rounded-xl border border-[#dbe8d7] bg-white px-6 py-3 text-sm font-extrabold text-[#075c35] transition hover:bg-[#eaf5e5] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075c35] to-[#158447] px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition hover:shadow-xl disabled:cursor-wait disabled:opacity-80"
                  >
                    {saving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Submit testimonial
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default AddTestimonial;
