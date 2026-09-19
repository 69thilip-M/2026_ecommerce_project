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

  const productsPerPage = 12;

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
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7fbf4]">
        <p className="text-[#075c35] font-semibold">Loading...</p>
      </div>
    );
  }

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
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
    <div className="min-h-screen bg-[#f7fbf4] flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="p-6 flex-grow max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#075c35] text-center md:text-left">
            Our Products
          </h1>

          {user?.email === "admin123@gmail.com" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/add-product")}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-[#075c35] hover:bg-[#083f26] text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              <FaPlus />
              Add Product
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {["all", "Fruits", "Vegetables", "dairy"].map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  category.toLowerCase() === cat.toLowerCase()
                    ? "bg-[#075c35] text-white shadow-md"
                    : "bg-white text-[#075c35] border border-[#dbe8d7] hover:bg-[#eaf5e5]"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64 px-4 py-2 rounded-lg border border-[#dbe8d7] bg-white text-[#083f26] placeholder-[#718579] focus:outline-none focus:ring-2 focus:ring-[#075c35] focus:border-[#075c35] transition"
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
                    exit={{
                      opacity: 0,
                      y: 50,
                      scale: 0.95,
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white border border-[#dbe8d7] rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name || product.productName}
                        className="w-full h-48 object-cover"
                      />

                      {product.category && (
                        <span className="absolute top-2 right-2 bg-[#075c35] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="p-5 flex flex-col justify-between h-auto">
                      <h2 className="text-lg font-bold text-[#083f26] mb-2">
                        {product.name || product.productName}
                      </h2>

                      {product.description && (
                        <p className="text-sm text-[#52665b] mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Price */}
                      <p className="text-[#075c35] font-semibold text-xl mb-3">
                        ₹{product.price}{" "}
                        <span className="text-sm text-[#718579]">/ 1kg</span>
                      </p>

                      {/* Admin Buttons */}
                      {user?.email === "admin123@gmail.com" ? (
                        <div className="flex gap-3 mb-3">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              navigate(`/edit-product/${product.id}`)
                            }
                            className="flex-1 flex items-center justify-center gap-2 bg-[#d4a72c] hover:bg-[#b88e1f] text-white px-4 py-2 rounded-lg font-medium transition"
                          >
                            <FaEdit />
                            Edit
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                          >
                            <FaTrash />
                            Delete
                          </motion.button>
                        </div>
                      ) : isInCart(product.id) ? (
                        /* Remove From Cart */
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeFromCart(product.id)}
                          className="w-full mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          <FaTrash />
                          Remove from Cart
                        </motion.button>
                      ) : (
                        /* Add To Cart */
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(product)}
                          className="w-full mt-auto flex items-center justify-center gap-2 bg-[#075c35] hover:bg-[#083f26] text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          <FaCartPlus />
                          Add to Cart
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 1
                    ? "bg-[#dbe8d7] text-[#718579] cursor-not-allowed"
                    : "bg-[#075c35] hover:bg-[#083f26] text-white"
                }`}
              >
                Previous
              </button>

              <span className="text-lg font-medium text-[#52665b]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === totalPages
                    ? "bg-[#dbe8d7] text-[#718579] cursor-not-allowed"
                    : "bg-[#075c35] hover:bg-[#083f26] text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-[#52665b] mt-10">
            No products found for "{searchTerm}"
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Products;
