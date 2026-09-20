/* eslint-disable no-unused-vars */

// src/pages/Blog.jsx

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import blogData from "../data/blogData";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero, { pickHeroPhotos, Photo } from "../components/PageHero";

import {
  FaSearch,
  FaTimes,
  FaCalendarAlt,
  FaRegClock,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaBookOpen,
} from "react-icons/fa";

/* =====================================================
   HELPERS
===================================================== */

const POSTS_PER_PAGE = 6;

const AVATAR_GRADIENTS = [
  "from-[#06472a] to-[#158447]",
  "from-[#0b7040] to-[#5eaa32]",
  "from-[#0f766e] to-[#14b8a6]",
  "from-[#c2410c] to-[#f59e0b]",
  "from-[#4d7c0f] to-[#84cc16]",
];

// First 2 letters of the author's name
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

// 1 … 4 5 6 … 10
const getPageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const set = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...set]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });

  return out;
};

/* Small author avatar + meta line */
function Meta({ blog, light = false }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs ${
        light ? "text-green-100" : "text-[#718579]"
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${getGradient(
            blog.author,
          )} text-[10px] font-extrabold text-white`}
        >
          {getInitials(blog.author)}
        </span>
        <span className="font-semibold">{blog.author}</span>
      </span>

      <span className="flex items-center gap-1.5">
        <FaCalendarAlt /> {blog.date}
      </span>

      <span className="flex items-center gap-1.5">
        <FaRegClock /> {readTime(blog)} min read
      </span>
    </div>
  );
}

/* =====================================================
   CARDS
===================================================== */

function FeaturedPost({ blog }) {
  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group grid overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-md transition duration-200 hover:shadow-xl md:grid-cols-2"
    >
      <div className="relative h-64 overflow-hidden md:h-full md:min-h-[300px]">
        <Photo
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-[#c8f26b] px-3 py-1 text-[11px] font-extrabold tracking-wide text-[#06472a] shadow">
          LATEST
        </span>
      </div>

      <div className="flex flex-col justify-center p-6 md:p-10">
        <Meta blog={blog} />

        <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-[#083f26] md:text-3xl">
          {blog.title}
        </h2>

        <p className="mt-3 line-clamp-3 leading-relaxed text-[#52665b]">
          {blog.description}
        </p>

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#158447] transition group-hover:text-[#075c35]">
          Read article
          <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function PostCard({ blog, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, delay: Math.min(index, 5) * 0.05 },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#dbe8d7] bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
    >
      <Link to={`/blog/${blog.id}`} className="flex flex-1 flex-col">
        <div className="relative h-48 overflow-hidden bg-[#f4faf1]">
          <Photo
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-3 text-[11px] font-semibold text-[#718579]">
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-[#158447]" /> {blog.date}
            </span>

            <span className="flex items-center gap-1.5">
              <FaRegClock className="text-[#158447]" /> {readTime(blog)} min
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-[#083f26]">
            {blog.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#52665b]">
            {blog.description}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-[#edf2ea] pt-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-[#3c5b48]">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${getGradient(
                  blog.author,
                )} text-[10px] font-extrabold text-white`}
              >
                {getInitials(blog.author)}
              </span>
              {blog.author}
            </span>

            <span className="flex items-center gap-1.5 text-xs font-bold text-[#158447] transition group-hover:text-[#075c35]">
              Read more
              <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* =====================================================
   PAGE
===================================================== */

function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const searching = query.trim() !== "";

  const photos = pickHeroPhotos(
    blogData.map((b) => ({ src: b.image, name: b.title })),
    4,
  );

  // Latest post is featured (only when not searching)
  const featured = !searching ? blogData[0] : null;

  const list = useMemo(() => {
    if (searching) {
      const q = query.toLowerCase().trim();

      return blogData.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(q) ||
          (b.description || "").toLowerCase().includes(q) ||
          (b.author || "").toLowerCase().includes(q),
      );
    }

    return blogData.slice(1);
  }, [query, searching]);

  const totalPages = Math.ceil(list.length / POSTS_PER_PAGE);
  const page = Math.min(currentPage, Math.max(totalPages, 1));

  const currentPosts = list.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7fbf4] text-[#083f26]">
      <Navbar />

      {/* =========================
          HERO
      ========================== */}
      <PageHero
        badge="KMR FRESH BLOG"
        BadgeIcon={FaBookOpen}
        crumbs={[{ label: "Home", to: "/home" }, { label: "Blogs" }]}
        title={
          <>
            Fresh ideas, tips &amp;{" "}
            <span className="text-[#c8f26b]">healthy living.</span>
          </>
        }
        subtitle="Stories, seasonal tips and simple ideas to help you eat fresh and live well."
        photos={photos}
        chipA="Fresh reads"
        chipB={`${blogData.length} articles`}
      />

      {/* =========================
          BLOG SECTION
      ========================== */}
      <main className="mx-auto w-full max-w-6xl flex-grow px-4 pb-16">
        {/* search */}
        <div className="relative z-10 -mt-9 mb-8">
          <div className="relative rounded-2xl border border-[#dbe8d7] bg-white p-2.5 shadow-lg">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#158447]" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles by title, topic or author..."
              className="w-full rounded-xl bg-[#f7fbf4] py-3 pl-11 pr-11 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-[#158447]/15"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-6 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#eaf5e5] text-[10px] text-[#075c35]"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* featured */}
        {featured && page === 1 && (
          <div className="mb-8">
            <FeaturedPost blog={featured} />
          </div>
        )}

        {/* section title */}
        {list.length > 0 && (
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#075c35]">
              {searching ? "Search results" : "More articles"}
            </h2>

            <span className="text-sm text-[#718579]">
              {list.length} {list.length === 1 ? "article" : "articles"}
            </span>
          </div>
        )}

        {/* grid / empty */}
        {list.length === 0 && !featured ? (
          <div className="rounded-2xl border border-dashed border-[#c9dcc4] bg-white py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eaf5e5] text-2xl text-[#075c35]">
              <FaSearch />
            </div>

            <h3 className="mt-4 text-xl font-extrabold">No articles found</h3>

            <p className="mt-2 text-sm text-[#718579]">
              Try a different word or clear your search.
            </p>

            <button
              onClick={() => setQuery("")}
              className="mt-5 rounded-xl bg-[#075c35] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#083f26]"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div
            key={`${page}-${query}`}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {currentPosts.map((blog, index) => (
              <PostCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
              className="flex items-center gap-1.5 rounded-lg border border-[#dbe8d7] bg-white px-3 py-2 text-xs font-bold text-[#075c35] transition hover:bg-[#eaf5e5] disabled:opacity-40"
            >
              <FaChevronLeft className="text-[10px]" />
              Prev
            </button>

            {getPageList(page, totalPages).map((p) =>
              typeof p === "string" ? (
                <span key={p} className="px-1 text-[#9aa99f]">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-9 w-9 rounded-lg text-xs font-bold transition ${
                    page === p
                      ? "bg-[#075c35] text-white shadow"
                      : "border border-[#dbe8d7] bg-white text-[#075c35] hover:bg-[#eaf5e5]"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
              className="flex items-center gap-1.5 rounded-lg border border-[#dbe8d7] bg-white px-3 py-2 text-xs font-bold text-[#075c35] transition hover:bg-[#eaf5e5] disabled:opacity-40"
            >
              Next
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Blog;
