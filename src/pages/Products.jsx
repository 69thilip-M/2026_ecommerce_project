
/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "./productsData";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  FaCartPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSlidersH,
  FaShoppingBasket,
  FaAppleAlt,
  FaLeaf,
  FaDrumstickBite,
  FaCarrot,
  FaSeedling,
  FaCheck,
  FaChevronRight,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

import { motion, AnimatePresence } from "framer-motion";

function Products() {
  const navigate = useNavigate();

  const {
    cart,
    addToCart,
    removeFromCart,
  } = useCart();

  const [allProducts, setAllProducts] = useState(productsData);

  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [priceRange, setPriceRange] = useState(5000);

  const [cartFilter, setCartFilter] = useState("all");

  const [sortBy, setSortBy] = useState("default");

  const [filterOpen, setFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 15;

  const ADMIN_EMAIL = "admin123@gmail.com";

  /* ==========================================
     FETCH FIRESTORE PRODUCTS
  ========================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "addProducts")
        );

        const firebaseProducts = snapshot.docs.map(
          (docItem) => ({
            id: docItem.id,
            ...docItem.data(),
            firebaseProduct: true,
          })
        );

        setAllProducts([
          ...productsData,
          ...firebaseProducts,
        ]);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );
      }
    };

    fetchProducts();
  }, []);

  /* ==========================================
     ADMIN
  ========================================== */

  const isAdmin =
    localStorage.getItem("userEmail") ===
    ADMIN_EMAIL;

  /* ==========================================
     CART CHECK
  ========================================== */

  const isInCart = (productId) => {
    return cart?.some(
      (item) =>
        String(item.id) === String(productId)
    );
  };

  /* ==========================================
     CART HANDLER
  ========================================== */

  const handleCart = (product) => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  /* ==========================================
     DELETE
  ========================================== */

  const handleDelete = async (id) => {
    try {
      await deleteDoc(
        doc(db, "addProducts", id)
      );

      setAllProducts((prev) =>
        prev.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );
    }
  };

  /* ==========================================
     UNIQUE CATEGORIES
     FIXES DUPLICATES
  ========================================== */

  const categoryMap = {};

  allProducts.forEach((product) => {
    const rawCategory =
      product.category?.trim();

    if (!rawCategory) return;

    const normalizedCategory =
      rawCategory
        .toLowerCase()
        .replace(/\s+/g, " ");

    if (!categoryMap[normalizedCategory]) {
      categoryMap[normalizedCategory] =
        rawCategory;
    }
  });

  const uniqueCategories =
    Object.entries(categoryMap).map(
      ([key, name]) => ({
        key,
        name,
      })
    );

  /* ==========================================
     CATEGORY ICON
  ========================================== */

  const getCategoryIcon = (name) => {
    const value =
      name.toLowerCase();

    if (value.includes("fruit")) {
      return <FaAppleAlt />;
    }

    if (
      value.includes("vegetable") ||
      value.includes("veg")
    ) {
      return <FaCarrot />;
    }

    if (
      value.includes("meat") ||
      value.includes("chicken") ||
      value.includes("non")
    ) {
      return <FaDrumstickBite />;
    }

    if (
      value.includes("leaf") ||
      value.includes("green")
    ) {
      return <FaLeaf />;
    }

    if (
      value.includes("seed") ||
      value.includes("organic")
    ) {
      return <FaSeedling />;
    }

    return <FaShoppingBasket />;
  };

  /* ==========================================
     CATEGORY COUNT
  ========================================== */

  const getCategoryCount = (key) => {
    return allProducts.filter(
      (product) => {
        const productCategory =
          product.category
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

        return (
          productCategory === key
        );
      }
    ).length;
  };

  /* ==========================================
     FILTER
  ========================================== */

  let filteredProducts =
    allProducts.filter((product) => {
      const productCategory =
        product.category
          ?.trim()
          .toLowerCase()
          .replace(/\s+/g, " ") || "";

      const productName = (
        product.name ||
        product.productName ||
        ""
      ).toLowerCase();

      const productDescription =
        product.description?.toLowerCase() ||
        "";

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const productPrice =
        Number(product.price) || 0;

      const matchesCategory =
        category === "all" ||
        productCategory === category;

      const matchesSearch =
        productName.includes(search) ||
        productDescription.includes(search) ||
        productCategory.includes(search);

      const matchesMinPrice =
        minPrice === "" ||
        productPrice >=
          Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" ||
        productPrice <=
          Number(maxPrice);

      const matchesRange =
        productPrice <=
        Number(priceRange);

      const matchesCart =
        cartFilter === "all" ||
        (cartFilter === "cart" &&
          isInCart(product.id)) ||
        (cartFilter === "notCart" &&
          !isInCart(product.id));

      return (
        matchesCategory &&
        matchesSearch &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRange &&
        matchesCart
      );
    });

  /* ==========================================
     SORT
  ========================================== */

  filteredProducts =
    [...filteredProducts].sort(
      (a, b) => {
        const priceA =
          Number(a.price) || 0;

        const priceB =
          Number(b.price) || 0;

        const nameA = (
          a.name ||
          a.productName ||
          ""
        ).toLowerCase();

        const nameB = (
          b.name ||
          b.productName ||
          ""
        ).toLowerCase();

        if (sortBy === "priceLow") {
          return priceA - priceB;
        }

        if (sortBy === "priceHigh") {
          return priceB - priceA;
        }

        if (sortBy === "nameAZ") {
          return nameA.localeCompare(
            nameB
          );
        }

        if (sortBy === "nameZA") {
          return nameB.localeCompare(
            nameA
          );
        }

        return 0;
      }
    );

  /* ==========================================
     PAGINATION
  ========================================== */

  const totalPages =
    Math.ceil(
      filteredProducts.length /
        productsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex +
        productsPerPage
    );

  /* ==========================================
     RESET PAGE
  ========================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    category,
    searchTerm,
    minPrice,
    maxPrice,
    priceRange,
    cartFilter,
    sortBy,
  ]);

  /* ==========================================
     CLEAR FILTERS
  ========================================== */

  const clearFilters = () => {
    setCategory("all");
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setPriceRange(5000);
    setCartFilter("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    category !== "all" ||
    searchTerm !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    priceRange !== 5000 ||
    cartFilter !== "all" ||
    sortBy !== "default";

  /* ==========================================
     IMAGE
  ========================================== */

  const getProductImage = (product) => {
    return (
      product.image ||
      product.imageUrl ||
      product.img ||
      "https://via.placeholder.com/500x400?text=Fresh+Product"
    );
  };

  return (
    <div className="min-h-screen bg-[#f7fbf4] text-[#083f26]">

      <Navbar />

      {/* ========================================
          HERO
      ======================================== */}

      <section className="bg-[#075c35] text-white">

        <div className="w-full px-4 sm:px-5 lg:px-6 py-9">

          <div className="flex items-center justify-between">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-3">
                <FaLeaf />
                Fresh • Healthy • Organic
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold">
                Fresh Products
              </h1>

              <p className="text-green-100 mt-2 text-sm md:text-base">
                Freshness delivered straight to your
                doorstep.
              </p>

            </div>

            <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white/10 items-center justify-center">
              <FaShoppingBasket className="text-3xl" />
            </div>

          </div>

        </div>

      </section>

      {/* ========================================
          MAIN FULL WIDTH
      ======================================== */}

      <main className="w-full px-3 sm:px-4 lg:px-5 py-6">

        {/* MOBILE FILTER */}

        <div className="lg:hidden mb-4">

          <button
            onClick={() =>
              setFilterOpen(true)
            }
            className="w-full bg-white border border-[#dbe8d7] rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
          >

            <span className="flex items-center gap-2 font-bold text-[#075c35]">
              <FaSlidersH />
              Filters & Categories
            </span>

            <FaFilter />

          </button>

        </div>

        <div className="flex gap-5">

          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside className="hidden lg:block w-[18%] shrink-0">

            <div className="sticky top-24">

              <div className="bg-white border border-[#dbe8d7] rounded-2xl shadow-sm overflow-hidden">

                {/* SIDEBAR HEADER */}

                <div className="bg-[#075c35] text-white px-4 py-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-green-100">
                        Browse
                      </p>

                      <h2 className="text-lg font-extrabold">
                        Shop Filters
                      </h2>
                    </div>

                    <FaSlidersH />

                  </div>

                </div>

                <div className="p-4">

                  {/* CATEGORIES */}

                  <div>

                    <div className="flex items-center justify-between mb-3">

                      <h3 className="font-extrabold text-sm">
                        Categories
                      </h3>

                      <span className="text-xs text-[#718579]">
                        {uniqueCategories.length}
                      </span>

                    </div>

                    <div className="space-y-1.5">

                      {/* ALL */}

                      <button
                        onClick={() =>
                          setCategory("all")
                        }
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                          category === "all"
                            ? "bg-[#eaf5e5] text-[#075c35]"
                            : "hover:bg-[#f7fbf4] text-[#52665b]"
                        }`}
                      >

                        <span className="flex items-center gap-2 text-sm font-semibold">

                          <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <FaShoppingBasket />
                          </span>

                          All Products

                        </span>

                        <span className="text-xs font-bold">
                          {allProducts.length}
                        </span>

                      </button>

                      {/* UNIQUE */}

                      {uniqueCategories.map(
                        ({ key, name }) => {

                          const active =
                            category === key;

                          return (
                            <button
                              key={key}
                              onClick={() =>
                                setCategory(key)
                              }
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                                active
                                  ? "bg-[#eaf5e5] text-[#075c35]"
                                  : "hover:bg-[#f7fbf4] text-[#52665b]"
                              }`}
                            >

                              <span className="flex items-center gap-2 text-sm font-semibold min-w-0">

                                <span className="w-8 h-8 shrink-0 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                  {getCategoryIcon(
                                    name
                                  )}
                                </span>

                                <span className="truncate capitalize">
                                  {name}
                                </span>

                              </span>

                              <span className="text-xs font-bold">
                                {getCategoryCount(
                                  key
                                )}
                              </span>

                            </button>
                          );
                        }
                      )}

                    </div>

                  </div>

                  {/* DIVIDER */}

                  <div className="border-t border-[#edf2ea] my-5" />

                  {/* PRICE */}

                  <div>

                    <div className="flex justify-between items-center mb-3">

                      <h3 className="font-extrabold text-sm">
                        Price
                      </h3>

                      <span className="text-xs font-bold text-[#075c35]">
                        ₹{priceRange}
                      </span>

                    </div>

                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={priceRange}
                      onChange={(e) =>
                        setPriceRange(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full accent-[#075c35]"
                    />

                    <div className="grid grid-cols-2 gap-2 mt-3">

                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(
                            e.target.value
                          )
                        }
                        className="w-full px-2.5 py-2 rounded-lg border border-[#dbe8d7] text-sm outline-none focus:border-[#075c35]"
                      />

                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(
                            e.target.value
                          )
                        }
                        className="w-full px-2.5 py-2 rounded-lg border border-[#dbe8d7] text-sm outline-none focus:border-[#075c35]"
                      />

                    </div>

                  </div>

                  {/* DIVIDER */}

                  <div className="border-t border-[#edf2ea] my-5" />

                  {/* CART */}

                  <div>

                    <h3 className="font-extrabold text-sm mb-3">
                      Cart Status
                    </h3>

                    <div className="space-y-1">

                      {[
                        ["all", "All Products"],
                        ["cart", "In My Cart"],
                        ["notCart", "Not In Cart"],
                      ].map(
                        ([value, label]) => (

                          <button
                            key={value}
                            onClick={() =>
                              setCartFilter(
                                value
                              )
                            }
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                              cartFilter ===
                              value
                                ? "bg-[#eaf5e5] text-[#075c35]"
                                : "text-[#52665b] hover:bg-[#f7fbf4]"
                            }`}
                          >
                            {label}
                          </button>

                        )
                      )}

                    </div>

                  </div>

                  {/* CLEAR */}

                  {hasActiveFilters && (
                    <button
                      onClick={
                        clearFilters
                      }
                      className="w-full mt-5 py-2.5 rounded-xl border border-[#075c35] text-[#075c35] text-sm font-bold hover:bg-[#075c35] hover:text-white transition"
                    >
                      Clear All Filters
                    </button>
                  )}

                </div>

              </div>

            </div>

          </aside>

          {/* =====================================
              PRODUCT SECTION
          ===================================== */}

          <section className="w-full lg:w-[82%]">

            {/* SEARCH BAR */}

            <div className="bg-white border border-[#dbe8d7] rounded-2xl p-3 mb-5 shadow-sm">

              <div className="flex flex-col md:flex-row gap-3">

                <div className="relative flex-1">

                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718579]" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search fresh fruits, vegetables and products..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f7fbf4] border border-[#dbe8d7] outline-none focus:border-[#075c35] text-sm"
                  />

                </div>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  className="md:w-48 px-4 py-3 rounded-xl border border-[#dbe8d7] outline-none text-sm font-semibold text-[#52665b]"
                >

                  <option value="default">
                    Sort: Featured
                  </option>

                  <option value="priceLow">
                    Price: Low → High
                  </option>

                  <option value="priceHigh">
                    Price: High → Low
                  </option>

                  <option value="nameAZ">
                    Name: A → Z
                  </option>

                  <option value="nameZA">
                    Name: Z → A
                  </option>

                </select>

              </div>

              <div className="flex items-center justify-between mt-3 px-1">

                <p className="text-xs sm:text-sm text-[#718579]">
                  <span className="font-bold text-[#083f26]">
                    {filteredProducts.length}
                  </span>{" "}
                  products found
                </p>

                {hasActiveFilters && (
                  <button
                    onClick={
                      clearFilters
                    }
                    className="text-xs font-bold text-[#075c35] hover:underline"
                  >
                    Clear filters
                  </button>
                )}

              </div>

            </div>

            {/* ACTIVE CATEGORY */}

            {category !== "all" && (
              <div className="flex items-center gap-2 mb-4 text-sm">

                <span className="text-[#718579]">
                  Category:
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf5e5] text-[#075c35] font-bold capitalize">
                  {category}

                  <button
                    onClick={() =>
                      setCategory("all")
                    }
                  >
                    <FaTimes />
                  </button>

                </span>

              </div>
            )}

            {/* =====================================
                PRODUCTS
            ===================================== */}

            {filteredProducts.length ===
            0 ? (

              <div className="bg-white border border-[#dbe8d7] rounded-2xl py-16 text-center">

                <div className="w-16 h-16 mx-auto rounded-full bg-[#eaf5e5] flex items-center justify-center text-[#075c35] text-2xl">
                  <FaSearch />
                </div>

                <h2 className="text-xl font-extrabold mt-4">
                  No products found
                </h2>

                <p className="text-sm text-[#718579] mt-2">
                  Try changing your search
                  or filters.
                </p>

                <button
                  onClick={
                    clearFilters
                  }
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#075c35] text-white font-bold text-sm"
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4">

                <AnimatePresence mode="popLayout">

                  {currentProducts.map(
                    (product, index) => {

                      const inCart =
                        isInCart(
                          product.id
                        );

                      return (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            duration: 0.25,
                            delay:
                              index * 0.025,
                          }}
                          className="group bg-white rounded-2xl border border-[#dbe8d7] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >

                          {/* IMAGE */}

                          <div className="relative h-48 overflow-hidden bg-[#f1f7ee]">

                            <img
                              src={getProductImage(
                                product
                              )}
                              alt={
                                product.name ||
                                product.productName
                              }
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* DARK GRADIENT */}

                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                            {/* CATEGORY */}

                            {product.category && (
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[#075c35] text-[10px] font-extrabold shadow-sm capitalize">
                                {product.category}
                              </span>
                            )}

                            {/* CART */}

                            {inCart && (
                              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#075c35] text-white flex items-center justify-center shadow-lg">
                                <FaCheck className="text-xs" />
                              </div>
                            )}

                          </div>

                          {/* CARD CONTENT */}

                          <div className="p-4">

                            {/* NAME */}

                            <h3 className="font-extrabold text-base text-[#083f26] truncate">
                              {product.name ||
                                product.productName}
                            </h3>

                            {/* DESCRIPTION */}

                            <p className="text-xs text-[#718579] mt-1.5 line-clamp-2 min-h-[32px]">
                              {product.description ||
                                "Fresh and carefully selected for you."}
                            </p>

                            {/* PRICE */}

                            <div className="flex items-end justify-between mt-3">

                              <div>

                                <span className="text-[10px] uppercase tracking-wide text-[#718579]">
                                  Price
                                </span>

                                <div className="flex items-baseline gap-1">

                                  <span className="text-xl font-extrabold text-[#075c35]">
                                    ₹
                                    {Number(
                                      product.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>

                                  {product.quantity && (
                                    <span className="text-[10px] text-[#718579]">
                                      /{" "}
                                      {
                                        product.quantity
                                      }
                                    </span>
                                  )}

                                </div>

                              </div>

                              <div className="w-8 h-8 rounded-lg bg-[#f1f7ee] text-[#075c35] flex items-center justify-center">
                                <FaLeaf className="text-xs" />
                              </div>

                            </div>

                            {/* ACTION */}

                            <div className="flex gap-2 mt-4">

                              <button
                                onClick={() =>
                                  handleCart(
                                    product
                                  )
                                }
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                                  inCart
                                    ? "bg-[#eaf5e5] text-[#075c35] border border-[#bcd6b6]"
                                    : "bg-[#075c35] text-white hover:bg-[#083f26]"
                                }`}
                              >

                                <FaCartPlus />

                                {inCart
                                  ? "Remove"
                                  : "Add to Cart"}

                              </button>

                              {isAdmin && (
                                <>
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/edit-product/${product.id}`
                                      )
                                    }
                                    className="w-10 rounded-xl bg-[#fff8e5] text-[#b88e1f] flex items-center justify-center hover:bg-[#d4a72c] hover:text-white transition"
                                    title="Edit"
                                  >
                                    <FaEdit className="text-xs" />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        product.id
                                      )
                                    }
                                    className="w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                                    title="Delete"
                                  >
                                    <FaTrash className="text-xs" />
                                  </button>
                                </>
                              )}

                            </div>

                          </div>

                        </motion.div>
                      );
                    }
                  )}

                </AnimatePresence>

              </div>

            )}

            {/* =====================================
                PAGINATION
            ===================================== */}

            {totalPages > 1 && (

              <div className="flex justify-center items-center gap-1.5 mt-8">

                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage - 1
                    )
                  }
                  className="px-3 py-2 rounded-lg border border-[#dbe8d7] bg-white text-[#075c35] text-xs font-bold disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (

                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    className={`w-9 h-9 rounded-lg text-xs font-bold ${
                      currentPage === page
                        ? "bg-[#075c35] text-white"
                        : "bg-white border border-[#dbe8d7] text-[#075c35]"
                    }`}
                  >
                    {page}
                  </button>

                ))}

                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage + 1
                    )
                  }
                  className="px-3 py-2 rounded-lg border border-[#dbe8d7] bg-white text-[#075c35] text-xs font-bold disabled:opacity-40"
                >
                  Next
                </button>

              </div>

            )}

          </section>

        </div>

      </main>

      {/* ========================================
          MOBILE FILTER DRAWER
      ======================================== */}

      <AnimatePresence>

        {filterOpen && (

          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setFilterOpen(false)
              }
              className="fixed inset-0 bg-black/40 z-40"
            />

            <motion.div
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                damping: 25,
              }}
              className="fixed top-0 left-0 bottom-0 w-[88%] max-w-sm bg-white z-50 overflow-y-auto"
            >

              <div className="sticky top-0 bg-[#075c35] text-white px-5 py-4 flex items-center justify-between">

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-green-100">
                    Refine
                  </p>

                  <h2 className="font-extrabold text-lg">
                    Filters
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setFilterOpen(false)
                  }
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <FaTimes />
                </button>

              </div>

              <div className="p-5">

                <h3 className="font-extrabold mb-3">
                  Categories
                </h3>

                <div className="space-y-2">

                  <button
                    onClick={() => {
                      setCategory(
                        "all"
                      );
                      setFilterOpen(
                        false
                      );
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl ${
                      category === "all"
                        ? "bg-[#eaf5e5] text-[#075c35]"
                        : "bg-[#f7fbf4] text-[#52665b]"
                    }`}
                  >

                    <span className="flex items-center gap-3 font-semibold">

                      <FaShoppingBasket />

                      All Products

                    </span>

                    <span className="text-xs font-bold">
                      {allProducts.length}
                    </span>

                  </button>

                  {uniqueCategories.map(
                    ({
                      key,
                      name,
                    }) => (

                      <button
                        key={key}
                        onClick={() => {
                          setCategory(
                            key
                          );
                          setFilterOpen(
                            false
                          );
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl ${
                          category === key
                            ? "bg-[#eaf5e5] text-[#075c35]"
                            : "bg-[#f7fbf4] text-[#52665b]"
                        }`}
                      >

                        <span className="flex items-center gap-3 font-semibold">

                          {getCategoryIcon(
                            name
                          )}

                          <span className="capitalize">
                            {name}
                          </span>

                        </span>

                        <span className="text-xs font-bold">
                          {getCategoryCount(
                            key
                          )}
                        </span>

                      </button>

                    )
                  )}

                </div>

                <div className="border-t border-[#edf2ea] my-7 pt-7">

                  <h3 className="font-extrabold mb-3">
                    Price
                  </h3>

                  <div className="flex justify-between text-sm font-bold text-[#075c35] mb-3">

                    <span>₹0</span>

                    <span>
                      ₹{priceRange}
                    </span>

                  </div>

                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={priceRange}
                    onChange={(e) =>
                      setPriceRange(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full accent-[#075c35]"
                  />

                </div>

                <button
                  onClick={clearFilters}
                  className="w-full py-3 rounded-xl border border-[#075c35] text-[#075c35] font-bold"
                >
                  Clear Filters
                </button>

              </div>

            </motion.div>

          </>

        )}

      </AnimatePresence>

      <Footer />

    </div>
  );
}

export default Products;
