/* eslint-disable no-unused-vars */
// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "./productsData";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCartPlus, FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";

function Products() {
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState(productsData);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Show 12 products per page

  const { addToCart, removeFromCart, isInCart, user, isAuthReady } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "addProducts"));
        const firebaseProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllProducts([...productsData, ...firebaseProducts]);
      } catch (error) {
        console.error("Error fetching Firebase products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "addProducts", id));
      setAllProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = allProducts.filter((product) => {
    const productCategory = (product.category || "").toLowerCase();
    const selectedCategory = category.toLowerCase();
    const matchesCategory =
      selectedCategory === "all" || productCategory === selectedCategory;
    const productName =
      product.name?.toLowerCase() || product.productName?.toLowerCase() || "";
    const matchesSearch = productName.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <div className="p-6 flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-400 text-center md:text-left">
            Our Products
          </h1>
          {user?.email === "admin123@gmail.com" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/add-product")}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg"
            >
              <FaPlus /> Add Product
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-3">
            {["all", "Fruits", "Vegetables", "dairy"].map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1); // reset to page 1 on category change
                }}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  category.toLowerCase() === cat.toLowerCase()
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-orange-700 dark:text-orange-300 border border-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
            className="w-full md:w-64 px-4 py-2 rounded-lg border border-orange-400 dark:border-orange-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Product Cards */}
        {currentProducts.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name || product.productName}
                        className="w-full h-48 object-cover"
                      />
                      {product.category && (
                        <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {product.category}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col justify-between h-auto">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {product.name || product.productName}
                      </h2>

                      {product.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <p className="text-orange-700 dark:text-orange-400 font-semibold text-xl mb-3">
                        ₹{product.price}{" "}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          / 1kg
                        </span>
                      </p>

                      {user?.email === "admin123@gmail.com" ? (
                        <div className="flex gap-3 mb-3">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              navigate(`/edit-product/${product.id}`)
                            }
                            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition"
                          >
                            <FaEdit /> Edit
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                          >
                            <FaTrash /> Delete
                          </motion.button>
                        </div>
                      ) : isInCart(product.id) ? (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeFromCart(product.id)}
                          className="w-full mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          <FaTrash /> Remove from Cart
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(product)}
                          className="w-full mt-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          <FaCartPlus /> Add to Cart
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }`}
              >
                Previous
              </button>

              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-10">
            No products found for "{searchTerm}"
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Products;
