import React, { useState } from "react";
import { Link } from "react-router-dom";
import blogData from "../data/blogData";
import Navbar from "../components/Navbar";   // ✅ Import Navbar
import Footer from "../components/Footer";   // ✅ Import Footer

function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Calculate indices
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogData.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(blogData.length / postsPerPage);

  return (
    <>
      {/* ✅ Navbar at the top */}
      <Navbar />

      <section className="px-4 py-12 md:px-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/home" className="hover:underline">
            Home
          </Link>{" "}
          / Blogs
        </div>

        <h1 className="text-4xl font-bold text-orange-700 dark:text-orange-400 mb-10">
          Blogs
        </h1>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {currentPosts.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {blog.date} | {blog.author}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-3">
                  {blog.description}
                </p>
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      {/* ✅ Footer at the bottom */}
      <Footer />
    </>
  );
}

export default Blog;
