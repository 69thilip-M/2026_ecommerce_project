/* eslint-disable no-unused-vars */

// src/pages/BlogDetails.jsx

import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import blogData from "../data/blogData";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Photo } from "../components/PageHero";

import {
  FaCalendarAlt,
  FaRegClock,
  FaArrowLeft,
  FaArrowRight,
  FaLink,
  FaCheck,
  FaBookOpen,
} from "react-icons/fa";

/* =====================================================
   HELPERS
===================================================== */

const AVATAR_GRADIENTS = [
  "from-[#06472a] to-[#158447]",
  "from-[#0b7040] to-[#5eaa32]",
  "from-[#0f766e] to-[#14b8a6]",
  "from-[#c2410c] to-[#f59e0b]",
  "from-[#4d7c0f] to-[#84cc16]",
];

const getInitials = (name = "") =>
  (
    Array.from(name.trim().replace(/[^\p{L}\p{N}]/gu, ""))
      .slice(0, 2)
      .join("") || "KM"
  ).toUpperCase();

const getGradient = (name = "") => {
  const sum = Array.from(String(name)).reduce(
    (total, ch) => total + ch.charCodeAt(0),
    0,
  );
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
};

const readTime = (blog) => {
  const text = blog.fullContent || blog.description || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

/* =====================================================
   PAGE
===================================================== */

function BlogDetails() {
  const { id } = useParams();

  const blog = blogData.find((item) => item.id === parseInt(id));

  const barRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // start each article at the top
  useEffect(() => {
    window.scrollTo(0, 0);
    setCopied(false);
  }, [id]);

  // reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(progress, 1)})`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Could not copy link:", error);
    }
  };

  /* =========================
     BLOG NOT FOUND
  ========================== */
  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7fbf4]">
        <Navbar />

        <div className="flex flex-grow items-center justify-center px-4 py-20">
          <div className="max-w-md rounded-3xl border border-[#dbe8d7] bg-white p-10 text-center shadow-lg">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eaf5e5] text-2xl text-[#075c35]">
              <FaBookOpen />
            </div>

            <h1 className="mt-5 text-2xl font-extrabold text-[#083f26]">
              Blog not found
            </h1>

            <p className="mt-2 text-[#718579]">
              The article you're looking for doesn't exist or was moved.
            </p>

            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#075c35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b7040]"
            >
              <FaArrowLeft className="text-xs" />
              Back to Blogs
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const index = blogData.findIndex((item) => item.id === blog.id);
  const prev = index > 0 ? blogData[index - 1] : null;
  const next = index < blogData.length - 1 ? blogData[index + 1] : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#f7fbf4] text-[#083f26]">
      {/* reading progress */}
      <div className="fixed left-0 right-0 top-0 z-[100] h-1 bg-transparent">
        <div
          ref={barRef}
          className="h-full origin-left bg-gradient-to-r from-[#158447] to-[#9bdd45]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <Navbar />

      {/* =========================
          IMAGE HEADER
      ========================== */}
      <header className="relative h-[300px] overflow-hidden bg-[#06472a] md:h-[420px]">
        <Photo
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#06301d] via-[#06301d]/65 to-[#06301d]/20" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto flex h-full max-w-3xl flex-col justify-end px-5 pb-16 text-white"
        >
          <nav className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-green-100/90">
            <Link to="/blog" className="hover:text-white">
              Blogs
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-white">{blog.title}</span>
          </nav>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {blog.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-green-100">
            <span className="flex items-center gap-2">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${getGradient(
                  blog.author,
                )} text-[10px] font-extrabold text-white ring-2 ring-white/40`}
              >
                {getInitials(blog.author)}
              </span>
              {blog.author}
            </span>

            <span className="flex items-center gap-1.5">
              <FaCalendarAlt /> {blog.date}
            </span>

            <span className="flex items-center gap-1.5">
              <FaRegClock /> {readTime(blog)} min read
            </span>
          </div>
        </motion.div>
      </header>

      {/* =========================
          ARTICLE
      ========================== */}
      <main className="relative z-10 mx-auto -mt-10 w-full max-w-3xl flex-grow px-4 pb-16">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-[#dbe8d7] bg-white p-6 shadow-xl sm:p-10"
        >
          {blog.description && (
            <p className="border-l-4 border-[#9bdd45] pl-4 text-lg font-medium leading-relaxed text-[#075c35]">
              {blog.description}
            </p>
          )}

          <div className="mt-7 whitespace-pre-line text-[17px] leading-8 text-[#3c5b48]">
            {blog.fullContent}
          </div>

          {/* author + share */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#edf2ea] pt-6">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${getGradient(
                  blog.author,
                )} text-base font-extrabold text-white shadow ring-4 ring-[#eaf5e5]`}
              >
                {getInitials(blog.author)}
              </span>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#718579]">
                  Written by
                </p>
                <p className="font-extrabold text-[#083f26]">{blog.author}</p>
              </div>
            </div>

            <button
              onClick={copyLink}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                copied
                  ? "border-[#158447] bg-[#eaf5e5] text-[#075c35]"
                  : "border-[#dbe8d7] bg-white text-[#075c35] hover:bg-[#eaf5e5]"
              }`}
            >
              {copied ? <FaCheck /> : <FaLink />}
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </motion.article>

        {/* prev / next */}
        {(prev || next) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/blog/${prev.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-[#dbe8d7] bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Photo
                  src={prev.image}
                  alt={prev.title}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />

                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#158447]">
                    <FaArrowLeft className="text-[9px] transition-transform group-hover:-translate-x-1" />
                    Previous
                  </p>
                  <p className="line-clamp-2 text-sm font-bold text-[#083f26]">
                    {prev.title}
                  </p>
                </div>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                to={`/blog/${next.id}`}
                className="group flex items-center justify-end gap-4 rounded-2xl border border-[#dbe8d7] bg-white p-3 text-right shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="flex items-center justify-end gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#158447]">
                    Next
                    <FaArrowRight className="text-[9px] transition-transform group-hover:translate-x-1" />
                  </p>
                  <p className="line-clamp-2 text-sm font-bold text-[#083f26]">
                    {next.title}
                  </p>
                </div>

                <Photo
                  src={next.image}
                  alt={next.title}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}

        {/* back */}
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#075c35] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#075c35]/20 transition hover:bg-[#0b7040]"
          >
            <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" />
            Back to Blogs
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BlogDetails;
