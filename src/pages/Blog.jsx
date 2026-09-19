import React, { useState } from "react";
import { Link } from "react-router-dom";

import blogData from "../data/blogData";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Blog() {
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;

  // Calculate indices
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = blogData.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(blogData.length / postsPerPage);

  return (
    <div className="min-h-screen bg-[#f7fbf4] text-[#083f26] flex flex-col">
      {/* =========================
          NAVBAR
      ========================== */}
      <Navbar />

      {/* =========================
          BLOG SECTION
      ========================== */}
      <section className="px-4 py-12 md:px-16 bg-[#f7fbf4] flex-grow">
        {/* Breadcrumb */}
        <div className="text-sm text-[#718579] mb-6">
          <Link
            to="/home"
            className="text-[#075c35] hover:text-[#158447] hover:underline transition"
          >
            Home
          </Link>{" "}
          / Blogs
        </div>

        {/* Page Heading */}
        <h1 className="text-4xl font-bold text-[#075c35] mb-10">Blogs</h1>

        {/* =========================
            BLOG CARDS
        ========================== */}
        <div className="grid md:grid-cols-2 gap-8">
          {currentPosts.map((blog) => (
            <div
              key={blog.id}
              className="
                bg-white
                border border-[#dbe8d7]
                rounded-xl
                shadow-md
                overflow-hidden
                transition
                duration-300
                hover:shadow-lg
                hover:-translate-y-1
              "
            >
              {/* Blog Image */}
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />

              {/* Blog Content */}
              <div className="p-6">
                {/* Blog Title */}
                <h2 className="text-xl font-semibold text-[#083f26] mb-2">
                  {blog.title}
                </h2>

                {/* Date & Author */}
                <p className="text-sm text-[#718579] mb-3">
                  {blog.date} | {blog.author}
                </p>

                {/* Description */}
                <p className="text-[#52665b] text-base mb-4 leading-relaxed">
                  {blog.description}
                </p>

                {/* Read More */}
                <Link
                  to={`/blog/${blog.id}`}
                  className="
                    inline-flex
                    items-center
                    font-medium
                    text-[#158447]
                    hover:text-[#075c35]
                    hover:underline
                    transition
                  "
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* =========================
            PAGINATION
        ========================== */}
        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`
                  px-4
                  py-2
                  rounded-lg
                  font-medium
                  transition
                  duration-200
                  ${
                    currentPage === i + 1
                      ? "bg-[#075c35] text-white shadow-md"
                      : "bg-[#eaf5e5] text-[#075c35] border border-[#dbe8d7] hover:bg-[#dcefd5]"
                  }
                `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <Footer />
    </div>
  );
}

export default Blog;
