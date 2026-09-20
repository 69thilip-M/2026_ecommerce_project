/* eslint-disable no-unused-vars */
// src/pages/Products.jsx

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "./productsData";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  FaCartPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaShoppingBasket,
  FaAppleAlt,
  FaLeaf,
  FaDrumstickBite,
  FaCarrot,
  FaSeedling,
  FaCheck,
  FaPlus,
  FaMinus,
  FaChevronLeft,
  FaChevronRight,
  FaTruck,
  FaThLarge,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import { db } from "../firebase";

import { motion, AnimatePresence } from "framer-motion";

/* =====================================================
   CONSTANTS + HELPERS
===================================================== */

const ADMIN_EMAIL = "admin123@gmail.com";
const PRODUCTS_PER_PAGE = 24; // divides evenly into 2, 3, 4 and 6 columns

/*
  OPTIONAL: paste the URL of your own hero photo here (a wide, bright
  photo of fresh produce looks best). Leave "" to use the automatic
  collage made from your product photos.
*/
const HERO_IMAGE = "";

const normalizeCategory = (value = "") =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const getName = (p) => p.name || p.productName || "";

const getPrice = (p) => Number(p.price) || 0;

const getProductImage = (p) => p.image || p.imageUrl || p.img || "";

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const getCategoryIcon = (name = "") => {
  const value = name.toLowerCase();

  if (value.includes("fruit")) return <FaAppleAlt />;
  if (value.includes("vegetable") || value.includes("veg")) return <FaCarrot />;
  if (
    value.includes("meat") ||
    value.includes("chicken") ||
    value.includes("non")
  )
    return <FaDrumstickBite />;
  if (value.includes("leaf") || value.includes("green")) return <FaLeaf />;
  if (value.includes("seed") || value.includes("organic"))
    return <FaSeedling />;

  return <FaShoppingBasket />;
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

/* Styles for the two-handle price slider */
const RANGE_CSS = `
.kmr-range{-webkit-appearance:none;appearance:none;position:absolute;left:0;top:0;width:100%;height:24px;margin:0;background:transparent;pointer-events:none;}
.kmr-range::-webkit-slider-runnable-track{-webkit-appearance:none;background:transparent;height:24px;}
.kmr-range::-moz-range-track{background:transparent;height:24px;}
.kmr-range::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:auto;box-sizing:border-box;width:22px;height:22px;margin-top:1px;border-radius:50%;background:#fff;border:4px solid #158447;cursor:grab;box-shadow:0 2px 8px rgba(11,112,64,.35);}
.kmr-range::-moz-range-thumb{pointer-events:auto;box-sizing:border-box;width:22px;height:22px;border-radius:50%;background:#fff;border:4px solid #158447;cursor:grab;box-shadow:0 2px 8px rgba(11,112,64,.35);}
.kmr-range:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 5px rgba(21,132,71,.25);}
.kmr-range:focus-visible::-moz-range-thumb{box-shadow:0 0 0 5px rgba(21,132,71,.25);}
`;

/* Page-level styles (gentle floating motion for the hero) */
const PAGE_CSS = `
@keyframes kmrFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes kmrFloatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.kmr-float{animation:kmrFloat 6s ease-in-out infinite}
.kmr-float-slow{animation:kmrFloatSlow 5s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.kmr-float,.kmr-float-slow{animation:none}}
`;

/* Fan layout for the hero photo collage */
const COLLAGE_TILES = [
  { left: "0%", top: "16%", rot: -6, delay: "0s" },
  { left: "23%", top: "0%", rot: 4, delay: "0.7s" },
  { left: "48%", top: "17%", rot: -3, delay: "1.4s" },
  { left: "72%", top: "2%", rot: 6, delay: "2.1s" },
];

/* =====================================================
   SMALL COMPONENTS
===================================================== */

/* Image with a friendly fallback (no more broken-image icons) */
function SafeImage({ src, alt = "", className = "", fallback }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#eaf5e5] to-[#d6ecce] text-[#158447] ${className}`}
      >
        {fallback || <FaLeaf className="text-2xl opacity-70" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* Price text box: commits on blur / Enter */
function PriceInput({ label, value, onCommit }) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = () => {
    if (text.trim() === "") {
      setText(String(value));
      return;
    }
    const applied = onCommit(Number(text));
    setText(String(applied ?? value));
  };

  return (
    <label className="block flex-1">
      <span className="mb-1 block text-[11px] font-semibold text-[#718579]">
        {label}
      </span>

      <span className="relative block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#158447]">
          ₹
        </span>

        <input
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value.replace(/\D/g, ""))}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className="w-full rounded-xl border border-[#dbe8d7] bg-[#fbfdf9] py-2 pl-7 pr-2 text-sm font-semibold text-[#083f26] outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/15"
        />
      </span>
    </label>
  );
}

/* =====================================================
   PRODUCT CARD (compact)
===================================================== */

function ProductCard({
  product,
  index,
  inCart,
  qty,
  isAdmin,
  onAdd,
  onInc,
  onDec,
  onEdit,
  onDelete,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, delay: Math.min(index, 11) * 0.035 },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
      className={`group flex flex-col rounded-2xl border bg-white p-2.5 shadow-sm transition-shadow duration-200 hover:shadow-lg ${
        inCart
          ? "border-[#158447]/50 ring-1 ring-[#158447]/25"
          : "border-[#dbe8d7]"
      }`}
    >
      {/* IMAGE */}
      <div className="relative h-28 overflow-hidden rounded-xl bg-[#f4faf1] sm:h-32">
        <SafeImage
          src={getProductImage(product)}
          alt={getName(product)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.category && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-extrabold capitalize text-[#075c35] shadow-sm">
            {product.category}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col px-1 pt-2.5">
        <h3 className="truncate text-sm font-extrabold text-[#083f26]">
          {getName(product)}
        </h3>

        <p className="mt-0.5 truncate text-[11px] text-[#718579]">
          {product.description || "Fresh and carefully selected"}
        </p>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-base font-extrabold text-[#075c35]">
              {formatINR(getPrice(product))}
            </span>

            {product.quantity && (
              <span className="ml-1 text-[10px] text-[#718579]">
                / {product.quantity}
              </span>
            )}
          </div>

          {/* ADD  <->  STEPPER */}
          <AnimatePresence mode="wait" initial={false}>
            {inCart ? (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex items-center rounded-full bg-[#eaf5e5] p-0.5 ring-1 ring-[#bcd6b6]"
              >
                <button
                  onClick={onDec}
                  aria-label={
                    qty <= 1 ? "Remove from cart" : "Decrease quantity"
                  }
                  className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#075c35] shadow-sm transition hover:bg-[#f7fbf4]"
                >
                  {qty <= 1 ? (
                    <FaTrash className="text-[10px] text-red-500" />
                  ) : (
                    <FaMinus className="text-[10px]" />
                  )}
                </button>

                <span className="w-6 text-center text-xs font-extrabold text-[#06472a]">
                  {qty}
                </span>

                <button
                  onClick={onInc}
                  aria-label="Increase quantity"
                  className="grid h-7 w-7 place-items-center rounded-full bg-[#075c35] text-white transition hover:bg-[#0b7040]"
                >
                  <FaPlus className="text-[10px]" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onAdd}
                aria-label="Add to cart"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#075c35] text-white shadow-md shadow-[#075c35]/25 transition-colors hover:bg-[#0b7040]"
              >
                <FaPlus className="text-xs" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {isAdmin && (
          <div className="mt-2.5 flex gap-1.5 border-t border-[#edf2ea] pt-2.5">
            <button
              onClick={onEdit}
              title="Edit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#fff8e5] py-1.5 text-[11px] font-bold text-[#b88e1f] transition hover:bg-[#d4a72c] hover:text-white"
            >
              <FaEdit /> Edit
            </button>

            <button
              onClick={onDelete}
              title="Delete"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 py-1.5 text-[11px] font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* =====================================================
   FILTER PANEL (used in the sidebar AND the mobile drawer)
===================================================== */

function FilterPanel({
  categories,
  totalCount,
  category,
  onCategory,
  bounds,
  step,
  priceMin,
  priceMax,
  onPriceChange,
  cartFilter,
  onCartFilter,
  hasActiveFilters,
  onClear,
  hideHeader = false,
}) {
  const span = Math.max(bounds.max - bounds.min, 1);
  const leftPct = ((priceMin - bounds.min) / span) * 100;
  const widthPct = ((priceMax - priceMin) / span) * 100;
  const mid = (bounds.min + bounds.max) / 2;

  const commitMin = (n) => {
    const v = clamp(n, bounds.min, priceMax);
    onPriceChange(v, priceMax);
    return v;
  };

  const commitMax = (n) => {
    const v = clamp(n, priceMin, bounds.max);
    onPriceChange(priceMin, v);
    return v;
  };

  const rows = [
    { key: "all", name: "All Products", count: totalCount, image: "" },
    ...categories,
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dbe8d7] bg-white shadow-sm">
      <style>{RANGE_CSS}</style>

      {/* ---------- HEADER ---------- */}
      {!hideHeader && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] px-5 py-4 text-white">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-green-100">
                Browse
              </p>
              <h2 className="text-lg font-extrabold">Shop Filters</h2>
            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
              <FaSlidersH />
            </span>
          </div>
        </div>
      )}

      <div className="space-y-6 p-4">
        {/* ---------- CATEGORIES ---------- */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold">Categories</h3>
            <span className="rounded-full bg-[#eaf5e5] px-2 py-0.5 text-[11px] font-bold text-[#075c35]">
              {categories.length}
            </span>
          </div>

          <div className="space-y-1.5">
            {rows.map(({ key, name, count, image }) => {
              const active = category === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onCategory(key)}
                  className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition duration-200 hover:translate-x-0.5 ${
                    active
                      ? "bg-[#eaf5e5] ring-1 ring-[#bcd6b6]"
                      : "hover:bg-[#f4faf1]"
                  }`}
                >
                  <SafeImage
                    src={image}
                    alt={name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    fallback={
                      <span className="text-lg">{getCategoryIcon(name)}</span>
                    }
                  />

                  <span
                    className={`min-w-0 flex-1 truncate text-sm capitalize ${
                      active
                        ? "font-extrabold text-[#06472a]"
                        : "font-semibold text-[#3c5b48]"
                    }`}
                  >
                    {name}
                  </span>

                  {active ? (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#158447] text-[10px] text-white">
                      <FaCheck />
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#718579]">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- PRICE ---------- */}
        <div className="border-t border-[#edf2ea] pt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold">Price range</h3>
            <span className="text-xs font-extrabold text-[#075c35]">
              {formatINR(priceMin)} – {formatINR(priceMax)}
            </span>
          </div>

          <div className="relative mx-2 h-6">
            <div className="absolute top-[10px] h-1 w-full rounded-full bg-[#dbe8d7]" />

            <div
              className="absolute top-[10px] h-1 rounded-full bg-gradient-to-r from-[#158447] to-[#9bdd45]"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            />

            <input
              type="range"
              className="kmr-range"
              aria-label="Minimum price"
              min={bounds.min}
              max={bounds.max}
              step={step}
              value={priceMin}
              style={{ zIndex: priceMin > mid ? 5 : 3 }}
              onChange={(e) =>
                onPriceChange(
                  Math.min(Number(e.target.value), priceMax - step),
                  priceMax,
                )
              }
            />

            <input
              type="range"
              className="kmr-range"
              aria-label="Maximum price"
              min={bounds.min}
              max={bounds.max}
              step={step}
              value={priceMax}
              style={{ zIndex: 4 }}
              onChange={(e) =>
                onPriceChange(
                  priceMin,
                  Math.max(Number(e.target.value), priceMin + step),
                )
              }
            />
          </div>

          <div className="mt-4 flex items-end gap-2">
            <PriceInput label="Min" value={priceMin} onCommit={commitMin} />
            <span className="pb-2.5 text-[#9aa99f]">–</span>
            <PriceInput label="Max" value={priceMax} onCommit={commitMax} />
          </div>
        </div>

        {/* ---------- CART STATUS ---------- */}
        <div className="border-t border-[#edf2ea] pt-5">
          <h3 className="mb-3 text-sm font-extrabold">Cart status</h3>

          <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#f1f7ee] p-1">
            {[
              ["all", "All"],
              ["cart", "In cart"],
              ["notCart", "Not in cart"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onCartFilter(value)}
                className={`rounded-lg px-1 py-2 text-[12px] font-bold transition ${
                  cartFilter === value
                    ? "bg-white text-[#075c35] shadow-sm"
                    : "text-[#718579] hover:text-[#075c35]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- CLEAR ---------- */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-xl border border-[#075c35] py-2.5 text-sm font-bold text-[#075c35] transition hover:bg-[#075c35] hover:text-white"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   PAGE
===================================================== */

function Products() {
  const navigate = useNavigate();

  const { cart, addToCart, removeFromCart, updateQuantity, user } = useCart();

  const [allProducts, setAllProducts] = useState(productsData);

  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(null); // null = full range
  const [cartFilter, setCartFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- Firestore products ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "addProducts"));

        const firebaseProducts = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
          firebaseProduct: true,
        }));

        setAllProducts([...productsData, ...firebaseProducts]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  /* ---------- Admin ---------- */
  const isAdmin =
    (user?.email || localStorage.getItem("userEmail")) === ADMIN_EMAIL;

  /* ---------- Cart ---------- */
  const cartMap = useMemo(() => {
    const map = new Map();
    (cart || []).forEach((item) => map.set(String(item.id), item));
    return map;
  }, [cart]);

  const isInCart = (productId) => cartMap.has(String(productId));

  const getQty = (productId) => cartMap.get(String(productId))?.quantity || 1;

  const handleIncrease = (product) =>
    updateQuantity(product.id, getQty(product.id) + 1);

  const handleDecrease = (product) => {
    const qty = getQty(product.id);
    if (qty <= 1) removeFromCart(product.id);
    else updateQuantity(product.id, qty - 1);
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteDoc(doc(db, "addProducts", id));
      setAllProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* ---------- Categories (unique, with counts + a photo) ---------- */
  const categories = useMemo(() => {
    const map = new Map();

    allProducts.forEach((product) => {
      const raw = product.category?.trim();
      if (!raw) return;

      const key = normalizeCategory(raw);
      const entry = map.get(key) || { key, name: raw, count: 0, image: "" };

      entry.count += 1;
      if (!entry.image) entry.image = getProductImage(product);

      map.set(key, entry);
    });

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [allProducts]);

  /* ---------- Price bounds (from real data) ---------- */
  const { bounds, step } = useMemo(() => {
    const max = allProducts.reduce((m, p) => Math.max(m, getPrice(p)), 0);
    const s = max > 1000 ? 50 : max > 300 ? 10 : 5;

    return {
      bounds: { min: 0, max: Math.max(s * 2, Math.ceil(max / s) * s) },
      step: s,
    };
  }, [allProducts]);

  const priceMin = priceRange
    ? clamp(priceRange[0], bounds.min, bounds.max)
    : bounds.min;
  const priceMax = priceRange
    ? clamp(priceRange[1], bounds.min, bounds.max)
    : bounds.max;

  const priceActive = priceMin > bounds.min || priceMax < bounds.max;

  const handlePriceChange = (min, max) => {
    setPriceRange(min <= bounds.min && max >= bounds.max ? null : [min, max]);
  };

  /* ---------- Filter + sort ---------- */
  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const list = allProducts.filter((product) => {
      const productCategory = normalizeCategory(product.category || "");
      const productName = getName(product).toLowerCase();
      const productDescription = (product.description || "").toLowerCase();
      const price = getPrice(product);

      const matchesCategory =
        category === "all" || productCategory === category;

      const matchesSearch =
        !search ||
        productName.includes(search) ||
        productDescription.includes(search) ||
        productCategory.includes(search);

      const matchesPrice = price >= priceMin && price <= priceMax;

      const inCart = cartMap.has(String(product.id));
      const matchesCart =
        cartFilter === "all" ||
        (cartFilter === "cart" && inCart) ||
        (cartFilter === "notCart" && !inCart);

      return matchesCategory && matchesSearch && matchesPrice && matchesCart;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "priceLow") return getPrice(a) - getPrice(b);
      if (sortBy === "priceHigh") return getPrice(b) - getPrice(a);
      if (sortBy === "nameAZ")
        return getName(a).toLowerCase().localeCompare(getName(b).toLowerCase());
      if (sortBy === "nameZA")
        return getName(b).toLowerCase().localeCompare(getName(a).toLowerCase());
      return 0;
    });
  }, [
    allProducts,
    category,
    searchTerm,
    priceMin,
    priceMax,
    cartFilter,
    sortBy,
    cartMap,
  ]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchTerm, priceRange, cartFilter, sortBy]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- Clear ---------- */
  const clearFilters = () => {
    setCategory("all");
    setSearchTerm("");
    setPriceRange(null);
    setCartFilter("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    category !== "all" ||
    searchTerm.trim() !== "" ||
    priceActive ||
    cartFilter !== "all";

  const activeCount =
    (category !== "all" ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0) +
    (priceActive ? 1 : 0) +
    (cartFilter !== "all" ? 1 : 0);

  const chips = [];
  if (category !== "all")
    chips.push({
      id: "cat",
      label: categories.find((c) => c.key === category)?.name || category,
      onRemove: () => setCategory("all"),
    });
  if (searchTerm.trim())
    chips.push({
      id: "q",
      label: `“${searchTerm.trim()}”`,
      onRemove: () => setSearchTerm(""),
    });
  if (priceActive)
    chips.push({
      id: "price",
      label: `${formatINR(priceMin)} – ${formatINR(priceMax)}`,
      onRemove: () => setPriceRange(null),
    });
  if (cartFilter !== "all")
    chips.push({
      id: "cart",
      label: cartFilter === "cart" ? "In my cart" : "Not in cart",
      onRemove: () => setCartFilter("all"),
    });

  /* ---------- Lock page scroll when the mobile drawer is open ---------- */
  useEffect(() => {
    if (!filterOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filterOpen]);

  const panelProps = {
    categories,
    totalCount: allProducts.length,
    category,
    onCategory: setCategory,
    bounds,
    step,
    priceMin,
    priceMax,
    onPriceChange: handlePriceChange,
    cartFilter,
    onCartFilter: setCartFilter,
    hasActiveFilters,
    onClear: clearFilters,
  };

  /* ---------- Hero data ---------- */
  const heroPhotos = useMemo(() => {
    const seen = new Set();
    const out = [];

    allProducts.forEach((p) => {
      const src = getProductImage(p);
      if (!src || seen.has(src) || out.length >= 4) return;
      seen.add(src);
      out.push({ id: p.id, src, name: getName(p) });
    });

    return out;
  }, [allProducts]);

  const lowestPrice = useMemo(() => {
    const prices = allProducts.map(getPrice).filter((n) => n > 0);
    return prices.length ? Math.min(...prices) : 0;
  }, [allProducts]);

  const showingFrom = filteredProducts.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(
    startIndex + PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );

  return (
    <div className="min-h-screen bg-[#f7fbf4] text-[#083f26]">
      <style>{PAGE_CSS}</style>

      <Navbar />

      {/* ========================================
          HERO
      ======================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] text-white">
        {/* soft dot pattern + glows */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#9bdd45]/15 blur-2xl" />

        <div className="relative mx-auto grid max-w-[1800px] items-center gap-8 px-4 py-9 sm:px-6 md:grid-cols-[1fr_minmax(300px,46%)] lg:px-8">
          {/* ---------- LEFT: text + stats ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-0"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <FaLeaf />
              Fresh • Healthy • Organic
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              Fresh <span className="text-[#c8f26b]">Products</span>
            </h1>

            <p className="mt-3 max-w-md text-sm text-green-100 md:text-base">
              Hand-picked fruits, vegetables and dairy — delivered straight to
              your doorstep.
            </p>

            {/* stats */}
            <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
              {[
                [FaShoppingBasket, `${allProducts.length}+`, "Fresh products"],
                [FaThLarge, categories.length, "Categories"],
                [FaTruck, "20–30", "Min delivery"],
              ].map(([Icon, value, label], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                  className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm sm:px-4"
                >
                  <Icon className="mb-2 text-[#c8f26b]" />
                  <p className="text-xl font-extrabold leading-none sm:text-2xl">
                    {value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-green-100">
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* mobile: small photo stack */}
            {heroPhotos.length > 0 && (
              <div className="mt-5 flex items-center gap-3 md:hidden">
                <div className="flex -space-x-3">
                  {heroPhotos.map((p) => (
                    <SafeImage
                      key={p.id}
                      src={p.src}
                      alt={p.name}
                      className="h-10 w-10 rounded-full border-2 border-[#075c35] object-cover"
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-green-100">
                  Picked fresh this morning
                </span>
              </div>
            )}
          </motion.div>

          {/* ---------- RIGHT: photo collage / hero image ---------- */}
          {(HERO_IMAGE || heroPhotos.length > 0) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative mx-auto hidden aspect-[600/270] w-full max-w-[620px] md:block"
            >
              <div className="absolute inset-x-8 inset-y-6 rounded-full bg-[#9bdd45]/20 blur-2xl" />

              {HERO_IMAGE ? (
                <img
                  src={HERO_IMAGE}
                  alt="Fresh groceries"
                  className="kmr-float relative h-full w-full rounded-[2rem] border-4 border-white/70 object-cover shadow-2xl"
                />
              ) : (
                heroPhotos.map((photo, i) => {
                  const t = COLLAGE_TILES[i];

                  return (
                    <div
                      key={photo.id}
                      className="absolute w-[27%]"
                      style={{
                        left: t.left,
                        top: t.top,
                        transform: `rotate(${t.rot}deg)`,
                      }}
                    >
                      <div
                        className="kmr-float"
                        style={{ animationDelay: t.delay }}
                      >
                        <SafeImage
                          src={photo.src}
                          alt={photo.name}
                          className="aspect-[3/4] w-full rounded-[1.6rem] border-4 border-white object-cover shadow-2xl shadow-black/30"
                        />
                      </div>
                    </div>
                  );
                })
              )}

              {/* floating chips */}
              <div className="kmr-float-slow absolute left-[2%] top-[2%] z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#075c35] shadow-lg">
                <FaLeaf className="text-[#158447]" />
                Picked this morning
              </div>

              {lowestPrice > 0 && (
                <div
                  className="kmr-float-slow absolute bottom-[2%] right-[3%] z-10 rounded-full bg-[#9bdd45] px-3.5 py-1.5 text-xs font-extrabold text-[#06472a] shadow-lg"
                  style={{ animationDelay: "1s" }}
                >
                  From {formatINR(lowestPrice)}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ========================================
          MAIN
      ======================================== */}
      <main className="mx-auto w-full max-w-[1800px] px-3 py-6 sm:px-4 lg:px-6">
        {/* MOBILE: category chips with photos */}
        <div className="-mx-3 mb-4 flex gap-2.5 overflow-x-auto px-3 pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[{ key: "all", name: "All", image: "" }, ...categories].map(
            ({ key, name, image }) => {
              const active = category === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-bold capitalize transition ${
                    active
                      ? "border-[#075c35] bg-[#075c35] text-white"
                      : "border-[#dbe8d7] bg-white text-[#075c35]"
                  }`}
                >
                  <SafeImage
                    src={image}
                    alt={name}
                    className="h-8 w-8 rounded-full object-cover"
                    fallback={
                      <span className="text-sm">{getCategoryIcon(name)}</span>
                    }
                  />
                  {name}
                </button>
              );
            },
          )}
        </div>

        {/* 20% / 80% layout */}
        <div className="grid gap-5 lg:grid-cols-[minmax(240px,20%)_1fr]">
          {/* =====================================
              SIDEBAR (20%)
          ===================================== */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl">
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          {/* =====================================
              PRODUCTS (80%)
          ===================================== */}
          <section className="min-w-0">
            {/* SEARCH + SORT */}
            <div className="mb-4 rounded-2xl border border-[#dbe8d7] bg-white p-3 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#158447]" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search fresh fruits, vegetables and products..."
                    className="w-full rounded-xl border border-[#dbe8d7] bg-[#f7fbf4] py-3 pl-11 pr-10 text-sm outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/15"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#eaf5e5] text-[10px] text-[#075c35]"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-[#dbe8d7] bg-white px-4 py-3 text-sm font-semibold text-[#3c5b48] outline-none transition focus:border-[#158447] focus:ring-4 focus:ring-[#158447]/15 md:w-52"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="priceLow">Price: Low → High</option>
                  <option value="priceHigh">Price: High → Low</option>
                  <option value="nameAZ">Name: A → Z</option>
                  <option value="nameZA">Name: Z → A</option>
                </select>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 px-1">
                <p className="text-xs text-[#718579] sm:text-sm">
                  Showing{" "}
                  <span className="font-bold text-[#083f26]">
                    {showingFrom}–{showingTo}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#083f26]">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>

                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="hidden text-xs font-bold text-[#075c35] hover:underline sm:block"
                    >
                      Clear filters
                    </button>
                  )}

                  {/* mobile filter button */}
                  <button
                    onClick={() => setFilterOpen(true)}
                    className="flex items-center gap-2 rounded-lg border border-[#dbe8d7] bg-[#f7fbf4] px-3 py-1.5 text-xs font-bold text-[#075c35] lg:hidden"
                  >
                    <FaSlidersH />
                    Filters
                    {activeCount > 0 && (
                      <span className="grid h-4 min-w-[16px] place-items-center rounded-full bg-[#158447] px-1 text-[10px] text-white">
                        {activeCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIVE FILTER CHIPS */}
            {chips.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <AnimatePresence initial={false}>
                  {chips.map((chip) => (
                    <motion.span
                      key={chip.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#eaf5e5] px-3 py-1.5 text-xs font-bold capitalize text-[#075c35]"
                    >
                      {chip.label}

                      <button
                        onClick={chip.onRemove}
                        aria-label={`Remove ${chip.label}`}
                        className="text-[10px] opacity-70 hover:opacity-100"
                      >
                        <FaTimes />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* =====================================
                PRODUCT GRID
            ===================================== */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#c9dcc4] bg-white py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eaf5e5] text-2xl text-[#075c35]">
                  <FaSearch />
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-[#718579]">
                  Try a different name, or widen the price range.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-[#075c35] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#083f26]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                key={`${page}-${category}`}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
              >
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    inCart={isInCart(product.id)}
                    qty={getQty(product.id)}
                    isAdmin={isAdmin}
                    onAdd={() => addToCart(product)}
                    onInc={() => handleIncrease(product)}
                    onDec={() => handleDecrease(product)}
                    onEdit={() => navigate(`/edit-product/${product.id}`)}
                    onDelete={() => handleDelete(product.id)}
                  />
                ))}
              </div>
            )}

            {/* =====================================
                PAGINATION
            ===================================== */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-[80] bg-black/40"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="fixed bottom-0 left-0 top-0 z-[90] flex w-[88%] max-w-sm flex-col bg-[#f7fbf4]"
            >
              <div className="flex shrink-0 items-center justify-between bg-gradient-to-br from-[#06472a] to-[#0b7040] px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-green-100">
                    Refine
                  </p>
                  <h2 className="text-lg font-extrabold">Filters</h2>
                </div>

                <button
                  onClick={() => setFilterOpen(false)}
                  aria-label="Close filters"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/15"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <FilterPanel {...panelProps} hideHeader />
              </div>

              <div className="shrink-0 border-t border-[#dbe8d7] bg-white p-4">
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full rounded-xl bg-[#075c35] py-3 text-sm font-extrabold text-white"
                >
                  Show {filteredProducts.length} products
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
