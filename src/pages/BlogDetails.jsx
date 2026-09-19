import { useParams, Link } from "react-router-dom";

import blogData from "../data/blogData";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BlogDetails() {
  const { id } = useParams();

  const blog = blogData.find((item) => item.id === parseInt(id));

  // =========================
  // BLOG NOT FOUND
  // =========================
  if (!blog) {
    return (
      <div className="min-h-screen bg-[#f7fbf4] flex flex-col">
        <Navbar />

        <div className="flex-grow px-4 py-20 text-center bg-[#f7fbf4]">
          <p className="text-[#52665b] text-lg">Blog not found.</p>

          <Link
            to="/blog"
            className="
              inline-block
              mt-6
              px-5
              py-2
              bg-[#075c35]
              hover:bg-[#0b7040]
              text-white
              rounded-lg
              transition
            "
          >
            Back to Blogs
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fbf4] text-[#083f26] flex flex-col">
      {/* =========================
          NAVBAR
      ========================== */}
      <Navbar />

      {/* =========================
          BLOG DETAILS
      ========================== */}
      <section className="px-4 py-12 md:px-16 bg-[#f7fbf4] flex-grow">
        {/* =========================
            BREADCRUMB
        ========================== */}
        <div className="text-sm text-[#718579] mb-6">
          <Link
            to="/blog"
            className="
              text-[#075c35]
              hover:text-[#158447]
              hover:underline
              cursor-pointer
              transition
            "
          >
            Blogs
          </Link>

          <span className="mx-2">/</span>

          <span>{blog.title}</span>
        </div>

        {/* =========================
            BLOG TITLE
        ========================== */}
        <h1
          className="
          text-4xl
          font-bold
          text-[#075c35]
          mb-6
        "
        >
          {blog.title}
        </h1>

        {/* =========================
            META INFORMATION
        ========================== */}
        <p
          className="
          text-sm
          text-[#718579]
          mb-6
        "
        >
          {blog.date} | {blog.author}
        </p>

        {/* =========================
            BLOG IMAGE
        ========================== */}
        <img
          src={blog.image}
          alt={blog.title}
          className="
            w-full
            h-80
            object-cover
            rounded-xl
            shadow-md
            border
            border-[#dbe8d7]
            mb-8
          "
        />

        {/* =========================
            BLOG CONTENT
        ========================== */}
        <div
          className="
          max-w-none
          text-[#52665b]
          leading-relaxed
          whitespace-pre-line
        "
        >
          {blog.fullContent}
        </div>

        {/* =========================
            BACK TO BLOGS
        ========================== */}
        <div className="mt-10">
          <Link
            to="/blog"
            className="
              inline-flex
              items-center
              px-5
              py-3
              bg-[#075c35]
              hover:bg-[#0b7040]
              text-white
              font-medium
              rounded-lg
              transition
              duration-200
              shadow-sm
              hover:shadow-md
            "
          >
            ← Back to Blogs
          </Link>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <Footer />
    </div>
  );
}

export default BlogDetails;
