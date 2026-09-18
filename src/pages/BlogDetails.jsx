import { useParams } from "react-router-dom";
import blogData from "../data/blogData";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function BlogDetails() {
  const { id } = useParams();
  const blog = blogData.find((item) => item.id === parseInt(id));

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="px-4 py-20 text-center bg-white dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Blog not found.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="px-4 py-12 md:px-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/blog" className="hover:underline cursor-pointer">
            / Blogs /
          </Link>
          {blog.title}
        </div>

        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-orange-700 dark:text-orange-400 mb-6">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {blog.date} | {blog.author}
        </p>

        {/* Image */}
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-xl shadow-md mb-8"
        />

        {/* Full Content */}
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {blog.fullContent}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default BlogDetails;
