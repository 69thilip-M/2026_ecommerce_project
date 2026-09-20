// /* eslint-disable no-unused-vars */

// // src/pages/Products.jsx

// import { useState, useEffect, useMemo, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import productsData from "./productsData";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// import {
//   FaCartPlus,
//   FaTrash,
//   FaEdit,
//   FaSearch,
//   FaSlidersH,
//   FaTimes,
//   FaShoppingBasket,
//   FaShoppingCart,
//   FaAppleAlt,
//   FaLeaf,
//   FaDrumstickBite,
//   FaCarrot,
//   FaSeedling,
//   FaCheck,
//   FaPlus,
//   FaMinus,
//   FaChevronLeft,
//   FaChevronRight,
//   FaTruck,
//   FaThLarge,
//   FaHeart,
//   FaRegHeart,
//   FaStar,
//   FaStarHalfAlt,
//   FaRegStar,
//   FaUserCircle,
// } from "react-icons/fa";

// import { useCart } from "../context/CartContext";

// import {
//   collection,
//   getDocs,
//   deleteDoc,
//   doc,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// import { db } from "../firebase";

// import { motion, AnimatePresence } from "framer-motion";

// import {
//   WEIGHT_OPTIONS,
//   formatWeight,
//   loadWeights,
//   saveWeight,
//   removeWeight,
//   useWishlist,
// } from "../utils/shop";

// /* =====================================================
//    CONSTANTS + HELPERS
// ===================================================== */

// const ADMIN_EMAIL = "admin123@gmail.com";

// // 24 = 6 rows of 4 cards (also divisible by 3 and 2)
// const PRODUCTS_PER_PAGE = 24;

// const MAX_QTY = 20;

// /*
//   OPTIONAL:
//   Paste the URL of your own hero photo here.
//   Leave "" to use the automatic collage.
// */
// const HERO_IMAGE = "";

// const normalizeCategory = (value = "") =>
//   value.trim().toLowerCase().replace(/\s+/g, " ");

// const getName = (p) => p.name || p.productName || "";

// const getPrice = (p) => Number(p.price) || 0;

// const getProductImage = (p) => p.image || p.imageUrl || p.img || "";

// const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

// const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// // keeps text to N lines without needing a Tailwind plugin
// const clampLines = (n) => ({
//   display: "-webkit-box",
//   WebkitLineClamp: n,
//   WebkitBoxOrient: "vertical",
//   overflow: "hidden",
// });

// const getTime = (review) => {
//   const value = review?.createdAt;

//   if (!value) return 0;

//   if (typeof value.toMillis === "function") return value.toMillis();

//   if (value instanceof Date) return value.getTime();

//   return 0;
// };

// const formatDate = (review) => {
//   const time = getTime(review);

//   if (!time) return "";

//   return new Date(time).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

// const getCategoryIcon = (name = "") => {
//   const value = name.toLowerCase();

//   if (value.includes("fruit")) {
//     return <FaAppleAlt />;
//   }

//   if (value.includes("vegetable") || value.includes("veg")) {
//     return <FaCarrot />;
//   }

//   if (
//     value.includes("meat") ||
//     value.includes("chicken") ||
//     value.includes("non")
//   ) {
//     return <FaDrumstickBite />;
//   }

//   if (value.includes("leaf") || value.includes("green")) {
//     return <FaLeaf />;
//   }

//   if (value.includes("seed") || value.includes("organic")) {
//     return <FaSeedling />;
//   }

//   return <FaShoppingBasket />;
// };

// /* 1 … 4 5 6 … 10 */

// const getPageList = (current, total) => {
//   if (total <= 7) {
//     return Array.from({ length: total }, (_, i) => i + 1);
//   }

//   const set = new Set([1, total, current - 1, current, current + 1]);

//   const pages = [...set]
//     .filter((p) => p >= 1 && p <= total)
//     .sort((a, b) => a - b);

//   const out = [];

//   pages.forEach((p, i) => {
//     if (i > 0 && p - pages[i - 1] > 1) {
//       out.push(`gap-${p}`);
//     }

//     out.push(p);
//   });

//   return out;
// };

// /* =====================================================
//    PRICE SLIDER CSS
// ===================================================== */

// const RANGE_CSS = `
// .kmr-range {
//   -webkit-appearance: none;
//   appearance: none;
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 24px;
//   margin: 0;
//   background: transparent;
//   pointer-events: none;
// }

// .kmr-range::-webkit-slider-runnable-track {
//   -webkit-appearance: none;
//   background: transparent;
//   height: 24px;
// }

// .kmr-range::-moz-range-track {
//   background: transparent;
//   height: 24px;
// }

// .kmr-range::-webkit-slider-thumb {
//   -webkit-appearance: none;
//   pointer-events: auto;
//   box-sizing: border-box;
//   width: 22px;
//   height: 22px;
//   margin-top: 1px;
//   border-radius: 50%;
//   background: #fff;
//   border: 4px solid #158447;
//   cursor: grab;
//   box-shadow: 0 2px 8px rgba(11, 112, 64, 0.35);
// }

// .kmr-range::-moz-range-thumb {
//   pointer-events: auto;
//   box-sizing: border-box;
//   width: 22px;
//   height: 22px;
//   border-radius: 50%;
//   background: #fff;
//   border: 4px solid #158447;
//   cursor: grab;
//   box-shadow: 0 2px 8px rgba(11, 112, 64, 0.35);
// }

// .kmr-range:focus-visible::-webkit-slider-thumb {
//   box-shadow: 0 0 0 5px rgba(21, 132, 71, 0.25);
// }

// .kmr-range:focus-visible::-moz-range-thumb {
//   box-shadow: 0 0 0 5px rgba(21, 132, 71, 0.25);
// }
// `;

// /* =====================================================
//    PAGE CSS
// ===================================================== */

// const PAGE_CSS = `
// @keyframes kmrFloat {
//   0%,
//   100% {
//     transform: translateY(0);
//   }

//   50% {
//     transform: translateY(-8px);
//   }
// }

// @keyframes kmrFloatSlow {
//   0%,
//   100% {
//     transform: translateY(0);
//   }

//   50% {
//     transform: translateY(-5px);
//   }
// }

// @keyframes kmrSheen {
//   0% {
//     transform: translateX(-130%) skewX(-18deg);
//   }

//   100% {
//     transform: translateX(230%) skewX(-18deg);
//   }
// }

// .kmr-float {
//   animation: kmrFloat 6s ease-in-out infinite;
// }

// .kmr-float-slow {
//   animation: kmrFloatSlow 5s ease-in-out infinite;
// }

// /* light sweep that runs across the card image on hover */
// .kmr-sheen {
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   width: 40%;
//   pointer-events: none;
//   background: linear-gradient(
//     100deg,
//     transparent,
//     rgba(255, 255, 255, 0.45),
//     transparent
//   );
//   transform: translateX(-130%) skewX(-18deg);
// }

// .group:hover .kmr-sheen {
//   animation: kmrSheen 0.9s ease;
// }

// @media (prefers-reduced-motion: reduce) {
//   .kmr-float,
//   .kmr-float-slow,
//   .group:hover .kmr-sheen {
//     animation: none;
//   }
// }
// `;

// /* =====================================================
//    HERO COLLAGE
// ===================================================== */

// const COLLAGE_TILES = [
//   {
//     left: "0%",
//     top: "16%",
//     rot: -6,
//     delay: "0s",
//   },
//   {
//     left: "23%",
//     top: "0%",
//     rot: 4,
//     delay: "0.7s",
//   },
//   {
//     left: "48%",
//     top: "17%",
//     rot: -3,
//     delay: "1.4s",
//   },
//   {
//     left: "72%",
//     top: "2%",
//     rot: 6,
//     delay: "2.1s",
//   },
// ];

// /* =====================================================
//    SAFE IMAGE
// ===================================================== */

// function SafeImage({ src, alt = "", className = "", fallback }) {
//   const [failed, setFailed] = useState(false);

//   useEffect(() => {
//     setFailed(false);
//   }, [src]);

//   if (!src || failed) {
//     return (
//       <div
//         className={`flex items-center justify-center bg-gradient-to-br from-[#eaf5e5] to-[#d6ecce] text-[#158447] ${className}`}
//       >
//         {fallback || <FaLeaf className="text-2xl opacity-70" />}
//       </div>
//     );
//   }

//   return (
//     <img
//       src={src}
//       alt={alt}
//       loading="lazy"
//       onError={() => setFailed(true)}
//       className={className}
//     />
//   );
// }

// /* =====================================================
//    STARS + RATING ROW
// ===================================================== */

// function Stars({ value = 0, className = "text-xs" }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-0.5 text-[#f5a623] ${className}`}
//       aria-hidden="true"
//     >
//       {[1, 2, 3, 4, 5].map((n) =>
//         value >= n ? (
//           <FaStar key={n} />
//         ) : value >= n - 0.5 ? (
//           <FaStarHalfAlt key={n} />
//         ) : (
//           <FaRegStar key={n} className="text-[#c9d8c5]" />
//         ),
//       )}
//     </span>
//   );
// }

// function RatingRow({ stat }) {
//   if (!stat) {
//     return (
//       <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9aa99f]">
//         <Stars value={0} />
//         No reviews yet
//       </span>
//     );
//   }

//   return (
//     <span className="inline-flex items-center gap-1.5">
//       <Stars value={stat.avg} />

//       <span className="text-xs font-extrabold text-[#083f26]">
//         {stat.avg.toFixed(1)}
//       </span>

//       {stat.count > 0 && (
//         <span className="text-[11px] font-semibold text-[#718579]">
//           ({stat.count})
//         </span>
//       )}
//     </span>
//   );
// }

// /* =====================================================
//    PRICE INPUT
// ===================================================== */

// function PriceInput({ label, value, onCommit }) {
//   const [text, setText] = useState(String(value));

//   useEffect(() => {
//     setText(String(value));
//   }, [value]);

//   const commit = () => {
//     if (text.trim() === "") {
//       setText(String(value));
//       return;
//     }

//     const applied = onCommit(Number(text));

//     setText(String(applied ?? value));
//   };

//   return (
//     <label className="block flex-1">
//       <span className="mb-1 block text-[11px] font-semibold text-[#718579]">
//         {label}
//       </span>

//       <span className="relative block">
//         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#158447]">
//           ₹
//         </span>

//         <input
//           inputMode="numeric"
//           value={text}
//           onChange={(e) => setText(e.target.value.replace(/\D/g, ""))}
//           onBlur={commit}
//           onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
//           className="w-full rounded-xl border border-[#dbe8d7] bg-[#fbfdf9] py-2 pl-7 pr-2 text-sm font-semibold text-[#083f26] outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/15"
//         />
//       </span>
//     </label>
//   );
// }

// /* =====================================================
//    WISHLIST HEART BUTTON
// ===================================================== */

// function HeartButton({ active, onClick, className = "" }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-pressed={active}
//       aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
//       className={`grid place-items-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110 hover:bg-white ${className}`}
//     >
//       <motion.span
//         key={active ? "on" : "off"}
//         initial={{ scale: 0.4 }}
//         animate={{ scale: 1 }}
//         transition={{ type: "spring", stiffness: 500, damping: 14 }}
//         className="grid place-items-center"
//       >
//         {active ? (
//           <FaHeart className="text-red-500" />
//         ) : (
//           <FaRegHeart className="text-[#075c35]" />
//         )}
//       </motion.span>
//     </button>
//   );
// }

// /* =====================================================
//    PRODUCT CARD
// ===================================================== */

// function ProductCard({
//   product,
//   index,
//   stat,
//   inCart,
//   qty,
//   weight,
//   wished,
//   isAdmin,
//   onOpen,
//   onQuickAdd,
//   onInc,
//   onDec,
//   onWish,
//   onEdit,
//   onDelete,
// }) {
//   const stop = (fn) => (e) => {
//     e.stopPropagation();
//     fn();
//   };

//   return (
//     <motion.article
//       initial={{
//         opacity: 0,
//         y: 16,
//       }}
//       animate={{
//         opacity: 1,
//         y: 0,
//         transition: {
//           duration: 0.4,
//           delay: Math.min(index, 11) * 0.04,
//         },
//       }}
//       whileHover={{
//         y: -6,
//         transition: {
//           duration: 0.2,
//           delay: 0,
//         },
//       }}
//       role="button"
//       tabIndex={0}
//       aria-label={`View details of ${getName(product)}`}
//       onClick={onOpen}
//       onKeyDown={(e) => {
//         if (e.target !== e.currentTarget) return;

//         if (e.key === "Enter" || e.key === " ") {
//           e.preventDefault();
//           onOpen();
//         }
//       }}
//       className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-white shadow-sm outline-none transition-shadow duration-300 hover:shadow-xl hover:shadow-[#075c35]/15 focus-visible:ring-4 focus-visible:ring-[#9bdd45]/60 ${
//         inCart ? "border-[#158447]/50" : "border-[#dbe8d7]"
//       }`}
//     >
//       {/* IMAGE */}

//       <div className="relative h-36 overflow-hidden bg-[#f4faf1] sm:h-48">
//         <SafeImage
//           src={getProductImage(product)}
//           alt={getName(product)}
//           className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
//         />

//         <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

//         <span className="kmr-sheen" />

//         {product.category && (
//           <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold capitalize text-[#075c35] shadow-sm">
//             {product.category}
//           </span>
//         )}

//         {/* WISHLIST */}

//         <HeartButton
//           active={wished}
//           onClick={stop(onWish)}
//           className="absolute right-3 top-3 h-9 w-9 text-sm"
//         />

//         {/* IN CART BADGE */}

//         {inCart && (
//           <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#075c35] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md">
//             <FaCheck className="text-[8px]" />
//             In cart · {formatWeight(weight)} × {qty}
//           </span>
//         )}

//         {/* QUICK VIEW */}

//         <span className="absolute bottom-3 right-3 hidden translate-y-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold text-[#075c35] opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
//           Quick view
//         </span>
//       </div>

//       {/* CONTENT */}

//       <div className="flex flex-1 flex-col p-3 sm:p-4">
//         <h3 className="truncate text-sm font-extrabold text-[#083f26] sm:text-base">
//           {getName(product)}
//         </h3>

//         <p
//           className="mt-1 min-h-[2.4rem] text-xs leading-relaxed text-[#718579]"
//           style={clampLines(2)}
//         >
//           {product.description || "Fresh and carefully selected"}
//         </p>

//         <div className="mt-2">
//           <RatingRow stat={stat} />
//         </div>

//         {/* PRICE */}

//         <div className="mt-3 flex items-baseline gap-1">
//           <span className="text-lg font-extrabold text-[#075c35] sm:text-xl">
//             {formatINR(getPrice(product))}
//           </span>

//           <span className="text-xs font-semibold text-[#718579]">/ KG</span>
//         </div>

//         {/* ADD <-> STEPPER */}

//         <div className="mt-3">
//           <AnimatePresence mode="wait" initial={false}>
//             {inCart ? (
//               <motion.div
//                 key="stepper"
//                 initial={{
//                   opacity: 0,
//                   scale: 0.95,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   scale: 1,
//                 }}
//                 exit={{
//                   opacity: 0,
//                   scale: 0.95,
//                 }}
//                 transition={{
//                   duration: 0.15,
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex items-center justify-between rounded-2xl bg-[#eaf5e5] p-1 ring-1 ring-[#bcd6b6]"
//               >
//                 <button
//                   type="button"
//                   onClick={stop(onDec)}
//                   aria-label={
//                     qty <= 1 ? "Remove from cart" : "Decrease quantity"
//                   }
//                   className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#075c35] shadow-sm transition hover:bg-[#f7fbf4]"
//                 >
//                   {qty <= 1 ? (
//                     <FaTrash className="text-xs text-red-500" />
//                   ) : (
//                     <FaMinus className="text-xs" />
//                   )}
//                 </button>

//                 <span className="text-sm font-extrabold text-[#06472a]">
//                   {qty}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={stop(onInc)}
//                   aria-label="Increase quantity"
//                   className="grid h-9 w-9 place-items-center rounded-xl bg-[#075c35] text-white transition hover:bg-[#0b7040]"
//                 >
//                   <FaPlus className="text-xs" />
//                 </button>
//               </motion.div>
//             ) : (
//               <motion.button
//                 key="add"
//                 type="button"
//                 initial={{
//                   opacity: 0,
//                   scale: 0.95,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   scale: 1,
//                 }}
//                 exit={{
//                   opacity: 0,
//                   scale: 0.95,
//                 }}
//                 transition={{
//                   duration: 0.15,
//                 }}
//                 whileTap={{
//                   scale: 0.96,
//                 }}
//                 onClick={stop(onQuickAdd)}
//                 aria-label={`Add ${getName(product)} to cart`}
//                 className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] py-2.5 text-sm font-extrabold text-white shadow-md shadow-[#075c35]/25 transition hover:shadow-lg hover:shadow-[#075c35]/30"
//               >
//                 <FaCartPlus />
//                 Add to Cart
//               </motion.button>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* ADMIN BUTTONS */}

//         {isAdmin && (
//           <div className="mt-3 flex gap-1.5 border-t border-[#edf2ea] pt-3">
//             <button
//               type="button"
//               onClick={stop(onEdit)}
//               title="Edit"
//               className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#fff8e5] py-1.5 text-[11px] font-bold text-[#b88e1f] transition hover:bg-[#d4a72c] hover:text-white"
//             >
//               <FaEdit /> Edit
//             </button>

//             <button
//               type="button"
//               onClick={stop(onDelete)}
//               title="Delete"
//               className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 py-1.5 text-[11px] font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
//             >
//               <FaTrash /> Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </motion.article>
//   );
// }

// /* =====================================================
//    PRODUCT DETAILS POPUP
// ===================================================== */

// function ProductModal({
//   product,
//   stat,
//   reviews,
//   inCart,
//   initialQty,
//   initialWeight,
//   wished,
//   user,
//   onClose,
//   onSubmit,
//   onToggleWish,
//   onSubmitReview,
// }) {
//   const [weight, setWeight] = useState(initialWeight);
//   const [qty, setQty] = useState(initialQty);

//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [sending, setSending] = useState(false);
//   const [reviewError, setReviewError] = useState("");

//   const price = getPrice(product);
//   const total = price * weight * qty;

//   // Close with the Escape key
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") onClose();
//     };

//     window.addEventListener("keydown", onKey);

//     return () => window.removeEventListener("keydown", onKey);
//   }, [onClose]);

//   const submitReview = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       setReviewError("Please log in to write a review.");
//       return;
//     }

//     if (!rating) {
//       setReviewError("Please choose a star rating.");
//       return;
//     }

//     setSending(true);
//     setReviewError("");

//     try {
//       await onSubmitReview(product, rating, comment.trim());

//       setRating(0);
//       setHoverRating(0);
//       setComment("");
//     } catch (error) {
//       console.error("Review error:", error);

//       setReviewError("Could not post your review. Please try again.");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//       }}
//       animate={{
//         opacity: 1,
//       }}
//       exit={{
//         opacity: 0,
//       }}
//       onClick={onClose}
//       className="fixed inset-0 z-[10050] flex items-end justify-center bg-[#083f26]/70 backdrop-blur-sm sm:items-center sm:p-6"
//     >
//       <motion.div
//         role="dialog"
//         aria-modal="true"
//         aria-label={`${getName(product)} details`}
//         initial={{
//           opacity: 0,
//           y: 40,
//           scale: 0.97,
//         }}
//         animate={{
//           opacity: 1,
//           y: 0,
//           scale: 1,
//         }}
//         exit={{
//           opacity: 0,
//           y: 40,
//           scale: 0.97,
//         }}
//         transition={{
//           type: "spring",
//           damping: 28,
//           stiffness: 320,
//         }}
//         onClick={(e) => e.stopPropagation()}
//         className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
//       >
//         {/* CLOSE */}

//         <button
//           type="button"
//           onClick={onClose}
//           aria-label="Close"
//           className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#075c35] shadow-md transition hover:rotate-90 hover:bg-[#eaf5e5]"
//         >
//           <FaTimes />
//         </button>

//         {/* SCROLL AREA */}

//         <div className="flex-1 overflow-y-auto">
//           <div className="grid md:grid-cols-[0.9fr_1.1fr]">
//             {/* IMAGE */}

//             <div className="relative h-64 bg-[#f4faf1] md:h-auto md:min-h-[440px]">
//               <SafeImage
//                 src={getProductImage(product)}
//                 alt={getName(product)}
//                 className="h-full w-full object-cover"
//               />

//               <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

//               {product.category && (
//                 <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold capitalize text-[#075c35] shadow-sm">
//                   {product.category}
//                 </span>
//               )}

//               <HeartButton
//                 active={wished}
//                 onClick={onToggleWish}
//                 className="absolute bottom-4 left-4 h-11 w-11 text-lg"
//               />

//               <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#9bdd45] px-3 py-1.5 text-[11px] font-extrabold text-[#06472a] shadow-md">
//                 <FaTruck />
//                 20–30 min delivery
//               </span>
//             </div>

//             {/* DETAILS */}

//             <div className="p-5 sm:p-7">
//               <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#158447]">
//                 {product.category || "Fresh product"}
//               </p>

//               <h2 className="mt-1 pr-10 text-2xl font-extrabold tracking-tight text-[#083f26] sm:text-3xl">
//                 {getName(product)}
//               </h2>

//               <div className="mt-2 flex flex-wrap items-center gap-2">
//                 <RatingRow stat={stat} />

//                 {stat && stat.count > 0 && (
//                   <span className="text-xs text-[#718579]">
//                     {stat.count} review{stat.count !== 1 ? "s" : ""}
//                   </span>
//                 )}
//               </div>

//               <p className="mt-4 text-sm leading-relaxed text-[#52665b]">
//                 {product.description ||
//                   "Fresh and carefully selected, picked this morning and delivered straight to your door."}
//               </p>

//               <div className="mt-4 flex items-baseline gap-1.5">
//                 <span className="text-3xl font-extrabold text-[#075c35]">
//                   {formatINR(price)}
//                 </span>

//                 <span className="text-sm font-semibold text-[#718579]">
//                   per KG
//                 </span>
//               </div>

//               {/* WEIGHT */}

//               <div className="mt-5">
//                 <p className="mb-2 text-sm font-extrabold text-[#083f26]">
//                   Choose weight
//                 </p>

//                 <div className="grid grid-cols-4 gap-2">
//                   {WEIGHT_OPTIONS.map((option) => {
//                     const active = option.value === weight;

//                     return (
//                       <button
//                         key={option.value}
//                         type="button"
//                         onClick={() => setWeight(option.value)}
//                         aria-pressed={active}
//                         className={`rounded-xl border py-2 text-xs font-extrabold transition ${
//                           active
//                             ? "border-[#075c35] bg-[#075c35] text-white shadow-md shadow-[#075c35]/25"
//                             : "border-[#dbe8d7] bg-white text-[#075c35] hover:border-[#158447] hover:bg-[#eaf5e5]"
//                         }`}
//                       >
//                         {option.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* QUANTITY */}

//               <div className="mt-5 flex items-center justify-between gap-4">
//                 <div>
//                   <p className="text-sm font-extrabold text-[#083f26]">
//                     Quantity
//                   </p>

//                   <p className="text-xs text-[#718579]">
//                     Number of {formatWeight(weight)} packs
//                   </p>
//                 </div>

//                 <div className="flex items-center rounded-2xl bg-[#eaf5e5] p-1 ring-1 ring-[#bcd6b6]">
//                   <button
//                     type="button"
//                     onClick={() => setQty((q) => Math.max(1, q - 1))}
//                     disabled={qty <= 1}
//                     aria-label="Decrease quantity"
//                     className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#075c35] shadow-sm transition hover:bg-[#f7fbf4] disabled:opacity-40"
//                   >
//                     <FaMinus className="text-xs" />
//                   </button>

//                   <span className="w-10 text-center text-base font-extrabold text-[#06472a]">
//                     {qty}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
//                     disabled={qty >= MAX_QTY}
//                     aria-label="Increase quantity"
//                     className="grid h-10 w-10 place-items-center rounded-xl bg-[#075c35] text-white transition hover:bg-[#0b7040] disabled:opacity-40"
//                   >
//                     <FaPlus className="text-xs" />
//                   </button>
//                 </div>
//               </div>

//               {/* TOTAL */}

//               <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f1f8ed] px-4 py-3">
//                 <span className="text-xs font-semibold text-[#52665b]">
//                   {formatINR(price)} × {formatWeight(weight)} × {qty}
//                 </span>

//                 <motion.span
//                   key={total}
//                   initial={{ scale: 0.9, opacity: 0.6 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   className="text-xl font-extrabold text-[#075c35]"
//                 >
//                   {formatINR(total)}
//                 </motion.span>
//               </div>
//             </div>
//           </div>

//           {/* REVIEWS */}

//           <div className="border-t border-[#dbe8d7] bg-[#f7fbf4] p-5 sm:p-7">
//             <div className="flex flex-wrap items-end justify-between gap-3">
//               <div>
//                 <h3 className="text-lg font-extrabold text-[#083f26]">
//                   Customer reviews
//                 </h3>

//                 <p className="text-xs text-[#718579]">
//                   Share what you think about this product.
//                 </p>
//               </div>

//               {stat && stat.count > 0 && (
//                 <div className="flex items-center gap-3 rounded-2xl border border-[#dbe8d7] bg-white px-4 py-2">
//                   <span className="text-3xl font-extrabold text-[#075c35]">
//                     {stat.avg.toFixed(1)}
//                   </span>

//                   <div>
//                     <Stars value={stat.avg} className="text-sm" />

//                     <p className="text-[11px] text-[#718579]">
//                       {stat.count} review{stat.count !== 1 ? "s" : ""}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* WRITE A REVIEW */}

//             <form
//               onSubmit={submitReview}
//               className="mt-4 rounded-2xl border border-[#dbe8d7] bg-white p-4"
//             >
//               <p className="text-sm font-extrabold text-[#083f26]">
//                 Write a review
//               </p>

//               <div
//                 className="mt-2 flex items-center gap-1"
//                 onMouseLeave={() => setHoverRating(0)}
//               >
//                 {[1, 2, 3, 4, 5].map((n) => {
//                   const filled = (hoverRating || rating) >= n;

//                   return (
//                     <button
//                       key={n}
//                       type="button"
//                       onClick={() => setRating(n)}
//                       onMouseEnter={() => setHoverRating(n)}
//                       aria-label={`${n} star${n > 1 ? "s" : ""}`}
//                       className={`text-2xl transition hover:scale-125 ${
//                         filled ? "text-[#f5a623]" : "text-[#c9d8c5]"
//                       }`}
//                     >
//                       <FaStar />
//                     </button>
//                   );
//                 })}

//                 {rating > 0 && (
//                   <span className="ml-2 text-xs font-bold text-[#718579]">
//                     {
//                       ["", "Poor", "Fair", "Good", "Very good", "Excellent"][
//                         rating
//                       ]
//                     }
//                   </span>
//                 )}
//               </div>

//               <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 rows={2}
//                 maxLength={400}
//                 placeholder="Tell others about the freshness, quality and taste..."
//                 className="mt-3 w-full resize-none rounded-xl border border-[#dbe8d7] bg-[#fbfdf9] px-3 py-2.5 text-sm outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/15"
//               />

//               <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
//                 <p
//                   className={`text-xs font-semibold ${
//                     reviewError ? "text-red-500" : "text-[#9aa99f]"
//                   }`}
//                 >
//                   {reviewError ||
//                     (user
//                       ? "Your name is shown with the review."
//                       : "Log in to post a review.")}
//                 </p>

//                 <button
//                   type="submit"
//                   disabled={sending}
//                   className="rounded-xl bg-[#075c35] px-5 py-2 text-sm font-extrabold text-white transition hover:bg-[#0b7040] disabled:opacity-60"
//                 >
//                   {sending ? "Posting..." : "Post review"}
//                 </button>
//               </div>
//             </form>

//             {/* REVIEW LIST */}

//             <div className="mt-4 space-y-3">
//               {reviews.length === 0 ? (
//                 <p className="rounded-2xl border border-dashed border-[#c9dcc4] bg-white py-6 text-center text-sm text-[#718579]">
//                   No reviews yet. Be the first to review this product!
//                 </p>
//               ) : (
//                 reviews.slice(0, 6).map((review) => (
//                   <div
//                     key={review.id}
//                     className="rounded-2xl border border-[#dbe8d7] bg-white p-4"
//                   >
//                     <div className="flex items-center gap-3">
//                       <FaUserCircle className="text-3xl text-[#9bc98a]" />

//                       <div className="min-w-0 flex-1">
//                         <p className="truncate text-sm font-extrabold text-[#083f26]">
//                           {review.name || "Customer"}
//                         </p>

//                         <Stars value={Number(review.rating) || 0} />
//                       </div>

//                       <span className="text-[11px] text-[#9aa99f]">
//                         {formatDate(review)}
//                       </span>
//                     </div>

//                     {review.comment && (
//                       <p className="mt-2 text-sm leading-relaxed text-[#52665b]">
//                         {review.comment}
//                       </p>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* FOOTER: CANCEL + ADD TO CART */}

//         <div className="flex shrink-0 items-center gap-3 border-t border-[#dbe8d7] bg-white p-4 sm:px-7">
//           <div className="hidden min-w-0 sm:block">
//             <p className="text-[11px] font-semibold text-[#718579]">Total</p>

//             <p className="text-xl font-extrabold text-[#075c35]">
//               {formatINR(total)}
//             </p>
//           </div>

//           <div className="ml-auto flex flex-1 gap-3 sm:flex-none">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 rounded-2xl border border-[#dbe8d7] bg-white px-6 py-3 text-sm font-extrabold text-[#075c35] transition hover:bg-[#eaf5e5] sm:flex-none"
//             >
//               Cancel
//             </button>

//             <motion.button
//               type="button"
//               whileTap={{ scale: 0.97 }}
//               onClick={() => onSubmit(weight, qty)}
//               className="flex flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition hover:shadow-xl sm:flex-none"
//             >
//               <FaCartPlus />
//               {inCart ? "Update Cart" : "Add to Cart"}
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// /* =====================================================
//    FILTER PANEL
// ===================================================== */

// function FilterPanel({
//   categories,
//   totalCount,
//   category,
//   onCategory,
//   bounds,
//   step,
//   priceMin,
//   priceMax,
//   onPriceChange,
//   cartFilter,
//   onCartFilter,
//   wishOnly,
//   onWishOnly,
//   wishCount,
//   hasActiveFilters,
//   onClear,
//   hideHeader = false,
// }) {
//   const span = Math.max(bounds.max - bounds.min, 1);

//   const leftPct = ((priceMin - bounds.min) / span) * 100;

//   const widthPct = ((priceMax - priceMin) / span) * 100;

//   const mid = (bounds.min + bounds.max) / 2;

//   const commitMin = (n) => {
//     const v = clamp(n, bounds.min, priceMax);

//     onPriceChange(v, priceMax);

//     return v;
//   };

//   const commitMax = (n) => {
//     const v = clamp(n, priceMin, bounds.max);

//     onPriceChange(priceMin, v);

//     return v;
//   };

//   const rows = [
//     {
//       key: "all",
//       name: "All Products",
//       count: totalCount,
//       image: "",
//     },
//     ...categories,
//   ];

//   return (
//     <div className="overflow-hidden rounded-2xl border border-[#dbe8d7] bg-white shadow-sm">
//       <style>{RANGE_CSS}</style>

//       {/* HEADER */}

//       {!hideHeader && (
//         <div className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] px-5 py-4 text-white">
//           <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />

//           <div className="relative flex items-center justify-between">
//             <div>
//               <p className="text-[10px] font-semibold uppercase tracking-widest text-green-100">
//                 Browse
//               </p>

//               <h2 className="text-lg font-extrabold">Shop Filters</h2>
//             </div>

//             <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
//               <FaSlidersH />
//             </span>
//           </div>
//         </div>
//       )}

//       <div className="space-y-6 p-4">
//         {/* CATEGORIES */}

//         <div>
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-extrabold">Categories</h3>

//             <span className="rounded-full bg-[#eaf5e5] px-2 py-0.5 text-[11px] font-bold text-[#075c35]">
//               {categories.length}
//             </span>
//           </div>

//           <div className="space-y-1.5">
//             {rows.map(({ key, name, count, image }) => {
//               const active = category === key;

//               return (
//                 <button
//                   key={key}
//                   type="button"
//                   onClick={() => onCategory(key)}
//                   className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition duration-200 hover:translate-x-0.5 ${
//                     active
//                       ? "bg-[#eaf5e5] ring-1 ring-[#bcd6b6]"
//                       : "hover:bg-[#f4faf1]"
//                   }`}
//                 >
//                   <SafeImage
//                     src={image}
//                     alt={name}
//                     className="h-10 w-10 shrink-0 rounded-lg object-cover"
//                     fallback={
//                       <span className="text-lg">{getCategoryIcon(name)}</span>
//                     }
//                   />

//                   <span
//                     className={`min-w-0 flex-1 truncate text-sm capitalize ${
//                       active
//                         ? "font-extrabold text-[#06472a]"
//                         : "font-semibold text-[#3c5b48]"
//                     }`}
//                   >
//                     {name}
//                   </span>

//                   {active ? (
//                     <span className="grid h-5 w-5 place-items-center rounded-full bg-[#158447] text-[10px] text-white">
//                       <FaCheck />
//                     </span>
//                   ) : (
//                     <span className="text-xs font-bold text-[#718579]">
//                       {count}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* PRICE */}

//         <div className="border-t border-[#edf2ea] pt-5">
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-extrabold">Price range</h3>

//             <span className="text-xs font-extrabold text-[#075c35]">
//               {formatINR(priceMin)} – {formatINR(priceMax)}
//             </span>
//           </div>

//           <div className="relative mx-2 h-6">
//             <div className="absolute top-[10px] h-1 w-full rounded-full bg-[#dbe8d7]" />

//             <div
//               className="absolute top-[10px] h-1 rounded-full bg-gradient-to-r from-[#158447] to-[#9bdd45]"
//               style={{
//                 left: `${leftPct}%`,
//                 width: `${widthPct}%`,
//               }}
//             />

//             <input
//               type="range"
//               className="kmr-range"
//               aria-label="Minimum price"
//               min={bounds.min}
//               max={bounds.max}
//               step={step}
//               value={priceMin}
//               style={{
//                 zIndex: priceMin > mid ? 5 : 3,
//               }}
//               onChange={(e) =>
//                 onPriceChange(
//                   Math.min(Number(e.target.value), priceMax - step),
//                   priceMax,
//                 )
//               }
//             />

//             <input
//               type="range"
//               className="kmr-range"
//               aria-label="Maximum price"
//               min={bounds.min}
//               max={bounds.max}
//               step={step}
//               value={priceMax}
//               style={{
//                 zIndex: 4,
//               }}
//               onChange={(e) =>
//                 onPriceChange(
//                   priceMin,
//                   Math.max(Number(e.target.value), priceMin + step),
//                 )
//               }
//             />
//           </div>

//           <div className="mt-4 flex items-end gap-2">
//             <PriceInput label="Min" value={priceMin} onCommit={commitMin} />

//             <span className="pb-2.5 text-[#9aa99f]">–</span>

//             <PriceInput label="Max" value={priceMax} onCommit={commitMax} />
//           </div>
//         </div>

//         {/* CART STATUS */}

//         <div className="border-t border-[#edf2ea] pt-5">
//           <h3 className="mb-3 text-sm font-extrabold">Cart status</h3>

//           <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#f1f7ee] p-1">
//             {[
//               ["all", "All"],
//               ["cart", "In cart"],
//               ["notCart", "Not in cart"],
//             ].map(([value, label]) => (
//               <button
//                 key={value}
//                 type="button"
//                 onClick={() => onCartFilter(value)}
//                 className={`rounded-lg px-1 py-2 text-[12px] font-bold transition ${
//                   cartFilter === value
//                     ? "bg-white text-[#075c35] shadow-sm"
//                     : "text-[#718579] hover:text-[#075c35]"
//                 }`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* WISHLIST */}

//         <div className="border-t border-[#edf2ea] pt-5">
//           <button
//             type="button"
//             onClick={() => onWishOnly(!wishOnly)}
//             aria-pressed={wishOnly}
//             className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition ${
//               wishOnly
//                 ? "bg-red-50 text-red-500 ring-1 ring-red-200"
//                 : "bg-[#f1f7ee] text-[#3c5b48] hover:bg-[#e8f2e4]"
//             }`}
//           >
//             <span className="flex items-center gap-2">
//               {wishOnly ? <FaHeart /> : <FaRegHeart />}
//               My wishlist
//             </span>

//             <span className="rounded-full bg-white px-2 py-0.5 text-xs">
//               {wishCount}
//             </span>
//           </button>
//         </div>

//         {/* CLEAR */}

//         {hasActiveFilters && (
//           <button
//             type="button"
//             onClick={onClear}
//             className="w-full rounded-xl border border-[#075c35] py-2.5 text-sm font-bold text-[#075c35] transition hover:bg-[#075c35] hover:text-white"
//           >
//             Clear all filters
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// /* =====================================================
//    PAGE
// ===================================================== */

// function Products() {
//   const navigate = useNavigate();

//   const { cart, addToCart, removeFromCart, updateQuantity, user } = useCart();

//   const wishlist = useWishlist();

//   const [allProducts, setAllProducts] = useState(productsData);

//   const [category, setCategory] = useState("all");

//   const [searchTerm, setSearchTerm] = useState("");

//   const [priceRange, setPriceRange] = useState(null);

//   const [cartFilter, setCartFilter] = useState("all");

//   const [wishOnly, setWishOnly] = useState(false);

//   const [sortBy, setSortBy] = useState("default");

//   const [filterOpen, setFilterOpen] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   // product opened in the details popup
//   const [selected, setSelected] = useState(null);

//   // weight (KG) chosen for every cart item: { [id]: 0.5 }
//   const [weights, setWeights] = useState(loadWeights);

//   // all reviews from Firestore
//   const [reviews, setReviews] = useState([]);

//   // small "added to cart" message
//   const [toast, setToast] = useState(null);

//   const toastTimer = useRef(null);

//   const pendingQty = useRef({});

//   const notify = useCallback((message) => {
//     clearTimeout(toastTimer.current);

//     setToast({
//       id: Date.now(),
//       message,
//     });

//     toastTimer.current = setTimeout(() => setToast(null), 2200);
//   }, []);

//   useEffect(() => () => clearTimeout(toastTimer.current), []);

//   /* =====================================================
//      FIRESTORE PRODUCTS
//   ===================================================== */

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "addProducts"));

//         const firebaseProducts = snapshot.docs.map((docItem) => ({
//           id: docItem.id,
//           ...docItem.data(),
//           firebaseProduct: true,
//         }));

//         setAllProducts([...productsData, ...firebaseProducts]);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   /* =====================================================
//      FIRESTORE REVIEWS
//      Collection: productReviews
//      { productId, name, uid, rating, comment, createdAt }
//   ===================================================== */

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "productReviews"));

//         setReviews(
//           snapshot.docs.map((docItem) => ({
//             id: docItem.id,
//             ...docItem.data(),
//           })),
//         );
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//       }
//     };

//     fetchReviews();
//   }, []);

//   const reviewStats = useMemo(() => {
//     const map = new Map();

//     reviews.forEach((review) => {
//       const key = String(review.productId);

//       const entry = map.get(key) || {
//         count: 0,
//         sum: 0,
//       };

//       entry.count += 1;
//       entry.sum += Number(review.rating) || 0;

//       map.set(key, entry);
//     });

//     map.forEach((entry) => {
//       entry.avg = entry.sum / entry.count;
//     });

//     return map;
//   }, [reviews]);

//   // review stats from Firestore, or a "rating" saved on the product itself
//   const getStat = (product) => {
//     const fromReviews = reviewStats.get(String(product.id));

//     if (fromReviews) return fromReviews;

//     if (Number(product.rating) > 0) {
//       return {
//         avg: Number(product.rating),
//         count: Number(product.reviewCount) || 0,
//       };
//     }

//     return null;
//   };

//   const handleSubmitReview = async (product, rating, comment) => {
//     const name =
//       user?.displayName ||
//       (user?.email ? user.email.split("@")[0] : "Customer");

//     const data = {
//       productId: String(product.id),
//       name,
//       uid: user?.uid || null,
//       rating,
//       comment,
//     };

//     const ref = await addDoc(collection(db, "productReviews"), {
//       ...data,
//       createdAt: serverTimestamp(),
//     });

//     setReviews((previous) => [
//       {
//         id: ref.id,
//         ...data,
//         createdAt: new Date(),
//       },
//       ...previous,
//     ]);

//     notify("Thanks for your review!");
//   };

//   /* =====================================================
//      ADMIN
//   ===================================================== */

//   const isAdmin =
//     (user?.email || localStorage.getItem("userEmail")) === ADMIN_EMAIL;

//   /* =====================================================
//      CART
//   ===================================================== */

//   const cartMap = useMemo(() => {
//     const map = new Map();

//     (cart || []).forEach((item) => {
//       map.set(String(item.id), item);
//     });

//     return map;
//   }, [cart]);

//   const isInCart = (productId) => cartMap.has(String(productId));

//   const getQty = (productId) => cartMap.get(String(productId))?.quantity || 1;

//   const getWeight = (productId) =>
//     Number(weights[String(productId)]) ||
//     Number(cartMap.get(String(productId))?.weight) ||
//     1;

//   const setWeightFor = (productId, weight) => {
//     setWeights(saveWeight(productId, weight));
//   };

//   /*
//     When a product is added from the popup with quantity > 1,
//     make sure the cart really ends up with that quantity
//     (works whichever way your CartContext handles addToCart).
//   */
//   useEffect(() => {
//     const pending = pendingQty.current;

//     Object.keys(pending).forEach((id) => {
//       const item = cartMap.get(id);

//       if (!item) return;

//       if ((item.quantity || 1) !== pending[id]) {
//         updateQuantity(item.id, pending[id]);
//       }

//       delete pending[id];
//     });
//   }, [cartMap]);

//   const handleQuickAdd = (product) => {
//     setWeightFor(product.id, 1);

//     addToCart({
//       ...product,
//       weight: 1,
//     });

//     notify(`${getName(product)} added to cart`);
//   };

//   const handleIncrease = (product) => {
//     updateQuantity(product.id, getQty(product.id) + 1);
//   };

//   const handleDecrease = (product) => {
//     const qty = getQty(product.id);

//     if (qty <= 1) {
//       removeFromCart(product.id);

//       setWeights(removeWeight(product.id));
//     } else {
//       updateQuantity(product.id, qty - 1);
//     }
//   };

//   // Add to cart / Update cart from the popup
//   const handleModalSubmit = (product, weight, qty) => {
//     setWeightFor(product.id, weight);

//     if (isInCart(product.id)) {
//       updateQuantity(product.id, qty);

//       notify("Cart updated");
//     } else {
//       pendingQty.current[String(product.id)] = qty;

//       addToCart({
//         ...product,
//         weight,
//         quantity: qty,
//       });

//       notify(`${getName(product)} added to cart`);
//     }

//     setSelected(null);
//   };

//   const handleWish = (product) => {
//     const wasWished = wishlist.has(product.id);

//     wishlist.toggle(product);

//     notify(wasWished ? "Removed from wishlist" : "Saved to your wishlist");
//   };

//   /* =====================================================
//      DELETE
//   ===================================================== */

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this product?")) {
//       return;
//     }

//     try {
//       await deleteDoc(doc(db, "addProducts", id));

//       setAllProducts((prev) => prev.filter((p) => p.id !== id));
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   /* =====================================================
//      CATEGORIES
//   ===================================================== */

//   const categories = useMemo(() => {
//     const map = new Map();

//     allProducts.forEach((product) => {
//       const raw = product.category?.trim();

//       if (!raw) return;

//       const key = normalizeCategory(raw);

//       const entry = map.get(key) || {
//         key,
//         name: raw,
//         count: 0,
//         image: "",
//       };

//       entry.count += 1;

//       if (!entry.image) {
//         entry.image = getProductImage(product);
//       }

//       map.set(key, entry);
//     });

//     return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
//   }, [allProducts]);

//   /* =====================================================
//      PRICE BOUNDS
//   ===================================================== */

//   const { bounds, step } = useMemo(() => {
//     const max = allProducts.reduce((m, p) => Math.max(m, getPrice(p)), 0);

//     const s = max > 1000 ? 50 : max > 300 ? 10 : 5;

//     return {
//       bounds: {
//         min: 0,
//         max: Math.max(s * 2, Math.ceil(max / s) * s),
//       },
//       step: s,
//     };
//   }, [allProducts]);

//   const priceMin = priceRange
//     ? clamp(priceRange[0], bounds.min, bounds.max)
//     : bounds.min;

//   const priceMax = priceRange
//     ? clamp(priceRange[1], bounds.min, bounds.max)
//     : bounds.max;

//   const priceActive = priceMin > bounds.min || priceMax < bounds.max;

//   const handlePriceChange = (min, max) => {
//     setPriceRange(min <= bounds.min && max >= bounds.max ? null : [min, max]);
//   };

//   /* =====================================================
//      FILTER + SORT
//   ===================================================== */

//   const filteredProducts = useMemo(() => {
//     const search = searchTerm.toLowerCase().trim();

//     const list = allProducts.filter((product) => {
//       const productCategory = normalizeCategory(product.category || "");

//       const productName = getName(product).toLowerCase();

//       const productDescription = (product.description || "").toLowerCase();

//       const price = getPrice(product);

//       const matchesCategory =
//         category === "all" || productCategory === category;

//       const matchesSearch =
//         !search ||
//         productName.includes(search) ||
//         productDescription.includes(search) ||
//         productCategory.includes(search);

//       const matchesPrice = price >= priceMin && price <= priceMax;

//       const inCart = cartMap.has(String(product.id));

//       const matchesCart =
//         cartFilter === "all" ||
//         (cartFilter === "cart" && inCart) ||
//         (cartFilter === "notCart" && !inCart);

//       const matchesWish = !wishOnly || wishlist.has(product.id);

//       return (
//         matchesCategory &&
//         matchesSearch &&
//         matchesPrice &&
//         matchesCart &&
//         matchesWish
//       );
//     });

//     return [...list].sort((a, b) => {
//       if (sortBy === "priceLow") {
//         return getPrice(a) - getPrice(b);
//       }

//       if (sortBy === "priceHigh") {
//         return getPrice(b) - getPrice(a);
//       }

//       if (sortBy === "nameAZ") {
//         return getName(a).toLowerCase().localeCompare(getName(b).toLowerCase());
//       }

//       if (sortBy === "nameZA") {
//         return getName(b).toLowerCase().localeCompare(getName(a).toLowerCase());
//       }

//       if (sortBy === "rating") {
//         return (getStat(b)?.avg || 0) - (getStat(a)?.avg || 0);
//       }

//       return 0;
//     });
//   }, [
//     allProducts,
//     category,
//     searchTerm,
//     priceMin,
//     priceMax,
//     cartFilter,
//     wishOnly,
//     wishlist.items,
//     sortBy,
//     cartMap,
//     reviewStats,
//   ]);

//   /* =====================================================
//      PAGINATION
//   ===================================================== */

//   const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

//   const page = Math.min(currentPage, Math.max(totalPages, 1));

//   const startIndex = (page - 1) * PRODUCTS_PER_PAGE;

//   const currentProducts = filteredProducts.slice(
//     startIndex,
//     startIndex + PRODUCTS_PER_PAGE,
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [category, searchTerm, priceRange, cartFilter, wishOnly, sortBy]);

//   const goToPage = (p) => {
//     if (p < 1 || p > totalPages) {
//       return;
//     }

//     setCurrentPage(p);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   /* =====================================================
//      CLEAR
//   ===================================================== */

//   const clearFilters = () => {
//     setCategory("all");
//     setSearchTerm("");
//     setPriceRange(null);
//     setCartFilter("all");
//     setWishOnly(false);
//     setSortBy("default");
//   };

//   const hasActiveFilters =
//     category !== "all" ||
//     searchTerm.trim() !== "" ||
//     priceActive ||
//     cartFilter !== "all" ||
//     wishOnly;

//   const activeCount =
//     (category !== "all" ? 1 : 0) +
//     (searchTerm.trim() ? 1 : 0) +
//     (priceActive ? 1 : 0) +
//     (cartFilter !== "all" ? 1 : 0) +
//     (wishOnly ? 1 : 0);

//   const chips = [];

//   if (category !== "all") {
//     chips.push({
//       id: "cat",
//       label: categories.find((c) => c.key === category)?.name || category,
//       onRemove: () => setCategory("all"),
//     });
//   }

//   if (searchTerm.trim()) {
//     chips.push({
//       id: "q",
//       label: `“${searchTerm.trim()}”`,
//       onRemove: () => setSearchTerm(""),
//     });
//   }

//   if (priceActive) {
//     chips.push({
//       id: "price",
//       label: `${formatINR(priceMin)} – ${formatINR(priceMax)}`,
//       onRemove: () => setPriceRange(null),
//     });
//   }

//   if (cartFilter !== "all") {
//     chips.push({
//       id: "cart",
//       label: cartFilter === "cart" ? "In my cart" : "Not in cart",
//       onRemove: () => setCartFilter("all"),
//     });
//   }

//   if (wishOnly) {
//     chips.push({
//       id: "wish",
//       label: "My wishlist",
//       onRemove: () => setWishOnly(false),
//     });
//   }

//   /* =====================================================
//      SCROLL LOCK (mobile drawer + details popup)
//   ===================================================== */

//   const lockScroll = filterOpen || Boolean(selected);

//   useEffect(() => {
//     if (!lockScroll) {
//       return undefined;
//     }

//     const prev = document.body.style.overflow;

//     document.body.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [lockScroll]);

//   const closeModal = useCallback(() => setSelected(null), []);

//   const panelProps = {
//     categories,
//     totalCount: allProducts.length,
//     category,
//     onCategory: setCategory,
//     bounds,
//     step,
//     priceMin,
//     priceMax,
//     onPriceChange: handlePriceChange,
//     cartFilter,
//     onCartFilter: setCartFilter,
//     wishOnly,
//     onWishOnly: setWishOnly,
//     wishCount: wishlist.count,
//     hasActiveFilters,
//     onClear: clearFilters,
//   };

//   /* =====================================================
//      HERO DATA
//   ===================================================== */

//   const heroPhotos = useMemo(() => {
//     const seen = new Set();
//     const out = [];

//     allProducts.forEach((p) => {
//       const src = getProductImage(p);

//       if (!src || seen.has(src) || out.length >= 4) {
//         return;
//       }

//       seen.add(src);

//       out.push({
//         id: p.id,
//         src,
//         name: getName(p),
//       });
//     });

//     return out;
//   }, [allProducts]);

//   const lowestPrice = useMemo(() => {
//     const prices = allProducts.map(getPrice).filter((n) => n > 0);

//     return prices.length ? Math.min(...prices) : 0;
//   }, [allProducts]);

//   const showingFrom = filteredProducts.length === 0 ? 0 : startIndex + 1;

//   const showingTo = Math.min(
//     startIndex + PRODUCTS_PER_PAGE,
//     filteredProducts.length,
//   );

//   // reviews of the product shown in the popup (newest first)
//   const selectedReviews = useMemo(() => {
//     if (!selected) return [];

//     return reviews
//       .filter((r) => String(r.productId) === String(selected.id))
//       .sort((a, b) => getTime(b) - getTime(a));
//   }, [reviews, selected]);

//   /* =====================================================
//      RETURN
//   ===================================================== */

//   return (
//     <div className="min-h-screen bg-[#f7fbf4] text-[#083f26]">
//       <style>{PAGE_CSS}</style>

//       <Navbar />

//       {/* =================================================
//           HERO
//       ================================================= */}

//       <section className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] text-white">
//         {/* DOT PATTERN */}

//         <div
//           className="pointer-events-none absolute inset-0 opacity-70"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
//             backgroundSize: "22px 22px",
//           }}
//         />

//         <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-white/5" />

//         <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#9bdd45]/15 blur-2xl" />

//         <div className="relative mx-auto grid max-w-[1800px] items-center gap-8 px-4 py-9 sm:px-6 md:grid-cols-[1fr_minmax(300px,46%)] lg:px-8">
//           {/* LEFT */}

//           <motion.div
//             initial={{
//               opacity: 0,
//               y: 16,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             transition={{
//               duration: 0.5,
//             }}
//             className="min-w-0"
//           >
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
//               <FaLeaf />
//               Fresh • Healthy • Organic
//             </div>

//             <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
//               Fresh <span className="text-[#c8f26b]">Products</span>
//             </h1>

//             <p className="mt-3 max-w-md text-sm text-green-100 md:text-base">
//               Hand-picked fruits, vegetables and dairy — delivered straight to
//               your doorstep.
//             </p>

//             {/* STATS */}

//             <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
//               {[
//                 [FaShoppingBasket, `${allProducts.length}+`, "Fresh products"],
//                 [FaThLarge, categories.length, "Categories"],
//                 [FaTruck, "20–30", "Min delivery"],
//               ].map(([Icon, value, label], i) => (
//                 <motion.div
//                   key={label}
//                   initial={{
//                     opacity: 0,
//                     y: 12,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   transition={{
//                     duration: 0.4,
//                     delay: 0.25 + i * 0.08,
//                   }}
//                   className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm sm:px-4"
//                 >
//                   <Icon className="mb-2 text-[#c8f26b]" />

//                   <p className="text-xl font-extrabold leading-none sm:text-2xl">
//                     {value}
//                   </p>

//                   <p className="mt-1 text-[11px] font-medium text-green-100">
//                     {label}
//                   </p>
//                 </motion.div>
//               ))}
//             </div>

//             {/* MOBILE PHOTOS */}

//             {heroPhotos.length > 0 && (
//               <div className="mt-5 flex items-center gap-3 md:hidden">
//                 <div className="flex -space-x-3">
//                   {heroPhotos.map((p) => (
//                     <SafeImage
//                       key={p.id}
//                       src={p.src}
//                       alt={p.name}
//                       className="h-10 w-10 rounded-full border-2 border-[#075c35] object-cover"
//                     />
//                   ))}
//                 </div>

//                 <span className="text-xs font-semibold text-green-100">
//                   Picked fresh this morning
//                 </span>
//               </div>
//             )}
//           </motion.div>

//           {/* RIGHT HERO */}

//           {(HERO_IMAGE || heroPhotos.length > 0) && (
//             <motion.div
//               initial={{
//                 opacity: 0,
//                 scale: 0.96,
//               }}
//               animate={{
//                 opacity: 1,
//                 scale: 1,
//               }}
//               transition={{
//                 duration: 0.6,
//                 delay: 0.1,
//               }}
//               className="relative mx-auto hidden aspect-[600/270] w-full max-w-[620px] md:block"
//             >
//               <div className="absolute inset-x-8 inset-y-6 rounded-full bg-[#9bdd45]/20 blur-2xl" />

//               {HERO_IMAGE ? (
//                 <img
//                   src={HERO_IMAGE}
//                   alt="Fresh groceries"
//                   className="kmr-float relative h-full w-full rounded-[2rem] border-4 border-white/70 object-cover shadow-2xl"
//                 />
//               ) : (
//                 heroPhotos.map((photo, i) => {
//                   const t = COLLAGE_TILES[i];

//                   return (
//                     <div
//                       key={photo.id}
//                       className="absolute w-[27%]"
//                       style={{
//                         left: t.left,
//                         top: t.top,
//                         transform: `rotate(${t.rot}deg)`,
//                       }}
//                     >
//                       <div
//                         className="kmr-float"
//                         style={{
//                           animationDelay: t.delay,
//                         }}
//                       >
//                         <SafeImage
//                           src={photo.src}
//                           alt={photo.name}
//                           className="aspect-[3/4] w-full rounded-[1.6rem] border-4 border-white object-cover shadow-2xl shadow-black/30"
//                         />
//                       </div>
//                     </div>
//                   );
//                 })
//               )}

//               {/* FLOATING CHIP */}

//               <div className="kmr-float-slow absolute left-[2%] top-[2%] z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#075c35] shadow-lg">
//                 <FaLeaf className="text-[#158447]" />
//                 Picked this morning
//               </div>

//               {lowestPrice > 0 && (
//                 <div
//                   className="kmr-float-slow absolute bottom-[2%] right-[3%] z-10 rounded-full bg-[#9bdd45] px-3.5 py-1.5 text-xs font-extrabold text-[#06472a] shadow-lg"
//                   style={{
//                     animationDelay: "1s",
//                   }}
//                 >
//                   From {formatINR(lowestPrice)}
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </div>
//       </section>

//       {/* =================================================
//           MAIN
//       ================================================= */}

//       <main className="mx-auto w-full max-w-[1800px] px-3 py-6 sm:px-4 lg:px-6">
//         {/* MOBILE CATEGORY */}

//         <div className="-mx-3 mb-4 flex gap-2.5 overflow-x-auto px-3 pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           {[
//             {
//               key: "all",
//               name: "All",
//               image: "",
//             },
//             ...categories,
//           ].map(({ key, name, image }) => {
//             const active = category === key;

//             return (
//               <button
//                 key={key}
//                 type="button"
//                 onClick={() => setCategory(key)}
//                 className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-bold capitalize transition ${
//                   active
//                     ? "border-[#075c35] bg-[#075c35] text-white"
//                     : "border-[#dbe8d7] bg-white text-[#075c35]"
//                 }`}
//               >
//                 <SafeImage
//                   src={image}
//                   alt={name}
//                   className="h-8 w-8 rounded-full object-cover"
//                   fallback={
//                     <span className="text-sm">{getCategoryIcon(name)}</span>
//                   }
//                 />

//                 {name}
//               </button>
//             );
//           })}
//         </div>

//         {/* 20% / 80% */}

//         <div className="grid gap-5 lg:grid-cols-[minmax(240px,20%)_1fr]">
//           {/* SIDEBAR */}

//           <aside className="hidden lg:block">
//             <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl">
//               <FilterPanel {...panelProps} />
//             </div>
//           </aside>

//           {/* PRODUCTS */}

//           <section className="min-w-0">
//             {/* SEARCH + SORT + WISHLIST + CART */}

//             <div className="mb-4 rounded-2xl border border-[#dbe8d7] bg-white p-3 shadow-sm">
//               <div className="flex flex-col gap-3 xl:flex-row">
//                 <div className="relative flex-1">
//                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#158447]" />

//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search fresh fruits, vegetables and products..."
//                     className="w-full rounded-xl border border-[#dbe8d7] bg-[#f7fbf4] py-3 pl-11 pr-10 text-sm outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/15"
//                   />

//                   {searchTerm && (
//                     <button
//                       type="button"
//                       onClick={() => setSearchTerm("")}
//                       aria-label="Clear search"
//                       className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#eaf5e5] text-[10px] text-[#075c35]"
//                     >
//                       <FaTimes />
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex flex-wrap gap-3">
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="min-w-0 flex-1 rounded-xl border border-[#dbe8d7] bg-white px-4 py-3 text-sm font-semibold text-[#3c5b48] outline-none transition focus:border-[#158447] focus:ring-4 focus:ring-[#158447]/15 xl:w-52 xl:flex-none"
//                   >
//                     <option value="default">Sort: Featured</option>

//                     <option value="priceLow">Price: Low → High</option>

//                     <option value="priceHigh">Price: High → Low</option>

//                     <option value="rating">Top rated</option>

//                     <option value="nameAZ">Name: A → Z</option>

//                     <option value="nameZA">Name: Z → A</option>
//                   </select>

//                   {/* WISHLIST */}

//                   <button
//                     type="button"
//                     onClick={() => setWishOnly((v) => !v)}
//                     aria-pressed={wishOnly}
//                     className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
//                       wishOnly
//                         ? "border-red-200 bg-red-50 text-red-500"
//                         : "border-[#dbe8d7] bg-white text-[#075c35] hover:bg-[#eaf5e5]"
//                     }`}
//                   >
//                     {wishOnly ? <FaHeart /> : <FaRegHeart />}

//                     <span className="hidden sm:inline">Wishlist</span>

//                     <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-white px-1 text-[11px] shadow-sm">
//                       {wishlist.count}
//                     </span>
//                   </button>

//                   {/* CART */}

//                   <button
//                     type="button"
//                     onClick={() => navigate("/cart")}
//                     className="flex items-center gap-2 rounded-xl bg-[#075c35] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#0b7040]"
//                   >
//                     <FaShoppingCart />

//                     <span className="hidden sm:inline">Cart</span>

//                     <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-[#9bdd45] px-1 text-[11px] text-[#06472a]">
//                       {cart?.length || 0}
//                     </span>
//                   </button>
//                 </div>
//               </div>

//               <div className="mt-3 flex items-center justify-between gap-3 px-1">
//                 <p className="text-xs text-[#718579] sm:text-sm">
//                   Showing{" "}
//                   <span className="font-bold text-[#083f26]">
//                     {showingFrom}–{showingTo}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-bold text-[#083f26]">
//                     {filteredProducts.length}
//                   </span>{" "}
//                   products
//                 </p>

//                 <div className="flex items-center gap-3">
//                   {hasActiveFilters && (
//                     <button
//                       onClick={clearFilters}
//                       className="hidden text-xs font-bold text-[#075c35] hover:underline sm:block"
//                     >
//                       Clear filters
//                     </button>
//                   )}

//                   {/* MOBILE FILTER */}

//                   <button
//                     onClick={() => setFilterOpen(true)}
//                     className="flex items-center gap-2 rounded-lg border border-[#dbe8d7] bg-[#f7fbf4] px-3 py-1.5 text-xs font-bold text-[#075c35] lg:hidden"
//                   >
//                     <FaSlidersH />
//                     Filters
//                     {activeCount > 0 && (
//                       <span className="grid h-4 min-w-[16px] place-items-center rounded-full bg-[#158447] px-1 text-[10px] text-white">
//                         {activeCount}
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* ACTIVE FILTER CHIPS */}

//             {chips.length > 0 && (
//               <div className="mb-4 flex flex-wrap items-center gap-2">
//                 <AnimatePresence initial={false}>
//                   {chips.map((chip) => (
//                     <motion.span
//                       key={chip.id}
//                       initial={{
//                         opacity: 0,
//                         scale: 0.85,
//                       }}
//                       animate={{
//                         opacity: 1,
//                         scale: 1,
//                       }}
//                       exit={{
//                         opacity: 0,
//                         scale: 0.85,
//                       }}
//                       transition={{
//                         duration: 0.15,
//                       }}
//                       className="inline-flex items-center gap-2 rounded-full bg-[#eaf5e5] px-3 py-1.5 text-xs font-bold capitalize text-[#075c35]"
//                     >
//                       {chip.label}

//                       <button
//                         onClick={chip.onRemove}
//                         aria-label={`Remove ${chip.label}`}
//                         className="text-[10px] opacity-70 hover:opacity-100"
//                       >
//                         <FaTimes />
//                       </button>
//                     </motion.span>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* =================================================
//                 PRODUCT GRID  (4 cards in a row on desktop)
//             ================================================= */}

//             {filteredProducts.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-[#c9dcc4] bg-white py-16 text-center">
//                 <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eaf5e5] text-2xl text-[#075c35]">
//                   {wishOnly ? <FaRegHeart /> : <FaSearch />}
//                 </div>

//                 <h2 className="mt-4 text-xl font-extrabold">
//                   {wishOnly ? "Your wishlist is empty" : "No products found"}
//                 </h2>

//                 <p className="mt-2 text-sm text-[#718579]">
//                   {wishOnly
//                     ? "Tap the heart on any product to save it here."
//                     : "Try a different name, or widen the price range."}
//                 </p>

//                 <button
//                   onClick={clearFilters}
//                   className="mt-5 rounded-xl bg-[#075c35] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#083f26]"
//                 >
//                   Clear filters
//                 </button>
//               </div>
//             ) : (
//               <div
//                 key={`${page}-${category}`}
//                 className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5"
//               >
//                 {currentProducts.map((product, index) => (
//                   <ProductCard
//                     key={product.id}
//                     product={product}
//                     index={index}
//                     stat={getStat(product)}
//                     inCart={isInCart(product.id)}
//                     qty={getQty(product.id)}
//                     weight={getWeight(product.id)}
//                     wished={wishlist.has(product.id)}
//                     isAdmin={isAdmin}
//                     onOpen={() => setSelected(product)}
//                     onQuickAdd={() => handleQuickAdd(product)}
//                     onInc={() => handleIncrease(product)}
//                     onDec={() => handleDecrease(product)}
//                     onWish={() => handleWish(product)}
//                     onEdit={() => navigate(`/edit-product/${product.id}`)}
//                     onDelete={() => handleDelete(product.id)}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* =================================================
//                 PAGINATION
//             ================================================= */}

//             {totalPages > 1 && (
//               <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
//                 <button
//                   disabled={page === 1}
//                   onClick={() => goToPage(page - 1)}
//                   className="flex items-center gap-1.5 rounded-lg border border-[#dbe8d7] bg-white px-3 py-2 text-xs font-bold text-[#075c35] transition hover:bg-[#eaf5e5] disabled:opacity-40"
//                 >
//                   <FaChevronLeft className="text-[10px]" />
//                   Prev
//                 </button>

//                 {getPageList(page, totalPages).map((p) =>
//                   typeof p === "string" ? (
//                     <span key={p} className="px-1 text-[#9aa99f]">
//                       …
//                     </span>
//                   ) : (
//                     <button
//                       key={p}
//                       onClick={() => goToPage(p)}
//                       className={`h-9 w-9 rounded-lg text-xs font-bold transition ${
//                         page === p
//                           ? "bg-[#075c35] text-white shadow"
//                           : "border border-[#dbe8d7] bg-white text-[#075c35] hover:bg-[#eaf5e5]"
//                       }`}
//                     >
//                       {p}
//                     </button>
//                   ),
//                 )}

//                 <button
//                   disabled={page === totalPages}
//                   onClick={() => goToPage(page + 1)}
//                   className="flex items-center gap-1.5 rounded-lg border border-[#dbe8d7] bg-white px-3 py-2 text-xs font-bold text-[#075c35] transition hover:bg-[#eaf5e5] disabled:opacity-40"
//                 >
//                   Next
//                   <FaChevronRight className="text-[10px]" />
//                 </button>
//               </div>
//             )}
//           </section>
//         </div>
//       </main>

//       {/* =================================================
//           PRODUCT DETAILS POPUP
//       ================================================= */}

//       <AnimatePresence>
//         {selected && (
//           <ProductModal
//             key={selected.id}
//             product={selected}
//             stat={getStat(selected)}
//             reviews={selectedReviews}
//             inCart={isInCart(selected.id)}
//             initialQty={isInCart(selected.id) ? getQty(selected.id) : 1}
//             initialWeight={getWeight(selected.id)}
//             wished={wishlist.has(selected.id)}
//             user={user}
//             onClose={closeModal}
//             onSubmit={(weight, qty) => handleModalSubmit(selected, weight, qty)}
//             onToggleWish={() => handleWish(selected)}
//             onSubmitReview={handleSubmitReview}
//           />
//         )}
//       </AnimatePresence>

//       {/* =================================================
//           MOBILE FILTER DRAWER
//       ================================================= */}

//       <AnimatePresence>
//         {filterOpen && (
//           <>
//             <motion.div
//               initial={{
//                 opacity: 0,
//               }}
//               animate={{
//                 opacity: 1,
//               }}
//               exit={{
//                 opacity: 0,
//               }}
//               onClick={() => setFilterOpen(false)}
//               className="fixed inset-0 z-[80] bg-black/40"
//             />

//             <motion.div
//               initial={{
//                 x: "-100%",
//               }}
//               animate={{
//                 x: 0,
//               }}
//               exit={{
//                 x: "-100%",
//               }}
//               transition={{
//                 type: "spring",
//                 damping: 30,
//                 stiffness: 320,
//               }}
//               className="fixed bottom-0 left-0 top-0 z-[90] flex w-[88%] max-w-sm flex-col bg-[#f7fbf4]"
//             >
//               <div className="flex shrink-0 items-center justify-between bg-gradient-to-br from-[#06472a] to-[#0b7040] px-5 py-4 text-white">
//                 <div>
//                   <p className="text-[10px] font-semibold uppercase tracking-widest text-green-100">
//                     Refine
//                   </p>

//                   <h2 className="text-lg font-extrabold">Filters</h2>
//                 </div>

//                 <button
//                   onClick={() => setFilterOpen(false)}
//                   aria-label="Close filters"
//                   className="grid h-9 w-9 place-items-center rounded-full bg-white/15"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4">
//                 <FilterPanel {...panelProps} hideHeader />
//               </div>

//               <div className="shrink-0 border-t border-[#dbe8d7] bg-white p-4">
//                 <button
//                   onClick={() => setFilterOpen(false)}
//                   className="w-full rounded-xl bg-[#075c35] py-3 text-sm font-extrabold text-white"
//                 >
//                   Show {filteredProducts.length} products
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* =================================================
//           TOAST
//       ================================================= */}

//       <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[10060] flex justify-center px-4">
//         <AnimatePresence>
//           {toast && (
//             <motion.div
//               key={toast.id}
//               initial={{
//                 opacity: 0,
//                 y: 20,
//                 scale: 0.95,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//                 scale: 1,
//               }}
//               exit={{
//                 opacity: 0,
//                 y: 20,
//                 scale: 0.95,
//               }}
//               className="flex items-center gap-2.5 rounded-full bg-[#06472a] px-5 py-3 text-sm font-bold text-white shadow-2xl"
//             >
//               <span className="grid h-5 w-5 place-items-center rounded-full bg-[#9bdd45] text-[10px] text-[#06472a]">
//                 <FaCheck />
//               </span>

//               {toast.message}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default Products;

/* eslint-disable no-unused-vars */

// src/pages/Products.jsx

/* eslint-disable no-unused-vars */

// src/pages/Products.jsx

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  FaShoppingCart,
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
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUserCircle,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import { motion, AnimatePresence } from "framer-motion";

import {
  WEIGHT_OPTIONS,
  formatWeight,
  loadWeights,
  saveWeight,
  removeWeight,
  useWishlist,
} from "../utils/shop";

/* =====================================================
   CONSTANTS + HELPERS
===================================================== */

const ADMIN_EMAIL = "admin123@gmail.com";

// case-insensitive + trims spaces, so "Admin123@Gmail.com " still matches
const isAdminEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase() === ADMIN_EMAIL.toLowerCase();

// 24 = 6 rows of 4 cards (also divisible by 3 and 2)
const PRODUCTS_PER_PAGE = 24;

const MAX_QTY = 20;

/*
  OPTIONAL:
  Paste the URL of your own hero photo here.
  Leave "" to use the automatic collage.
*/
const HERO_IMAGE = "";

const normalizeCategory = (value = "") =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const getName = (p) => p.name || p.productName || "";

const getPrice = (p) => Number(p.price) || 0;

const getProductImage = (p) => p.image || p.imageUrl || p.img || "";

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// keeps text to N lines without needing a Tailwind plugin
const clampLines = (n) => ({
  display: "-webkit-box",
  WebkitLineClamp: n,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const getTime = (review) => {
  const value = review?.createdAt;

  if (!value) return 0;

  if (typeof value.toMillis === "function") return value.toMillis();

  if (value instanceof Date) return value.getTime();

  return 0;
};

const formatDate = (review) => {
  const time = getTime(review);

  if (!time) return "";

  return new Date(time).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCategoryIcon = (name = "") => {
  const value = name.toLowerCase();

  if (value.includes("fruit")) {
    return <FaAppleAlt />;
  }

  if (value.includes("vegetable") || value.includes("veg")) {
    return <FaCarrot />;
  }

  if (
    value.includes("meat") ||
    value.includes("chicken") ||
    value.includes("non")
  ) {
    return <FaDrumstickBite />;
  }

  if (value.includes("leaf") || value.includes("green")) {
    return <FaLeaf />;
  }

  if (value.includes("seed") || value.includes("organic")) {
    return <FaSeedling />;
  }

  return <FaShoppingBasket />;
};

/* 1 … 4 5 6 … 10 */

const getPageList = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const set = new Set([1, total, current - 1, current, current + 1]);

  const pages = [...set]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];

  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) {
      out.push(`gap-${p}`);
    }

    out.push(p);
  });

  return out;
};

/* =====================================================
   PRICE SLIDER CSS
===================================================== */

const RANGE_CSS = `
.kmr-range {
  -webkit-appearance: none;
  appearance: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 24px;
  margin: 0;
  background: transparent;
  pointer-events: none;
}

.kmr-range::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  background: transparent;
  height: 24px;
}

.kmr-range::-moz-range-track {
  background: transparent;
  height: 24px;
}

.kmr-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #158447;
  cursor: grab;
  box-shadow: 0 2px 8px rgba(11, 112, 64, 0.35);
}

.kmr-range::-moz-range-thumb {
  pointer-events: auto;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #158447;
  cursor: grab;
  box-shadow: 0 2px 8px rgba(11, 112, 64, 0.35);
}

.kmr-range:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 5px rgba(21, 132, 71, 0.25);
}

.kmr-range:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 5px rgba(21, 132, 71, 0.25);
}
`;

/* =====================================================
   PAGE CSS
===================================================== */

const PAGE_CSS = `
@keyframes kmrFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes kmrFloatSlow {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

@keyframes kmrSheen {
  0% {
    transform: translateX(-130%) skewX(-18deg);
  }

  100% {
    transform: translateX(230%) skewX(-18deg);
  }
}

.kmr-float {
  animation: kmrFloat 6s ease-in-out infinite;
}

.kmr-float-slow {
  animation: kmrFloatSlow 5s ease-in-out infinite;
}

/* light sweep that runs across the card image on hover */
.kmr-sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40%;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    transparent,
    rgba(255, 255, 255, 0.45),
    transparent
  );
  transform: translateX(-130%) skewX(-18deg);
}

.group:hover .kmr-sheen {
  animation: kmrSheen 0.9s ease;
}

@media (prefers-reduced-motion: reduce) {
  .kmr-float,
  .kmr-float-slow,
  .group:hover .kmr-sheen {
    animation: none;
  }
}
`;

/* =====================================================
   HERO COLLAGE
===================================================== */

const COLLAGE_TILES = [
  {
    left: "0%",
    top: "16%",
    rot: -6,
    delay: "0s",
  },
  {
    left: "23%",
    top: "0%",
    rot: 4,
    delay: "0.7s",
  },
  {
    left: "48%",
    top: "17%",
    rot: -3,
    delay: "1.4s",
  },
  {
    left: "72%",
    top: "2%",
    rot: 6,
    delay: "2.1s",
  },
];

/* =====================================================
   SAFE IMAGE
===================================================== */

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

/* =====================================================
   STARS + RATING ROW
===================================================== */

function Stars({ value = 0, className = "text-xs" }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[#f5a623] ${className}`}
      aria-hidden="true"
    >
      {[1, 2, 3, 4, 5].map((n) =>
        value >= n ? (
          <FaStar key={n} />
        ) : value >= n - 0.5 ? (
          <FaStarHalfAlt key={n} />
        ) : (
          <FaRegStar key={n} className="text-[#c9d8c5]" />
        ),
      )}
    </span>
  );
}

function RatingRow({ stat }) {
  if (!stat) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9aa99f]">
        <Stars value={0} />
        No reviews yet
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <Stars value={stat.avg} />

      <span className="text-xs font-extrabold text-[#083f26]">
        {stat.avg.toFixed(1)}
      </span>

      {stat.count > 0 && (
        <span className="text-[11px] font-semibold text-[#718579]">
          ({stat.count})
        </span>
      )}
    </span>
  );
}

/* =====================================================
   PRICE INPUT
===================================================== */

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
   WISHLIST HEART BUTTON
===================================================== */

function HeartButton({ active, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`grid place-items-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110 hover:bg-white ${className}`}
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 14 }}
        className="grid place-items-center"
      >
        {active ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-[#075c35]" />
        )}
      </motion.span>
    </button>
  );
}

/* =====================================================
   PRODUCT CARD
===================================================== */

function ProductCard({
  product,
  index,
  stat,
  inCart,
  qty,
  weight,
  wished,
  isAdmin,
  onOpen,
  onQuickAdd,
  onInc,
  onDec,
  onWish,
  onEdit,
  onDelete,
}) {
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          delay: Math.min(index, 11) * 0.04,
        },
      }}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.2,
          delay: 0,
        },
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details of ${getName(product)}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-white shadow-sm outline-none transition-shadow duration-300 hover:shadow-xl hover:shadow-[#075c35]/15 focus-visible:ring-4 focus-visible:ring-[#9bdd45]/60 ${
        inCart ? "border-[#158447]/50" : "border-[#dbe8d7]"
      }`}
    >
      {/* IMAGE */}

      <div className="relative h-36 overflow-hidden bg-[#f4faf1] sm:h-48">
        <SafeImage
          src={getProductImage(product)}
          alt={getName(product)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

        <span className="kmr-sheen" />

        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold capitalize text-[#075c35] shadow-sm">
            {product.category}
          </span>
        )}

        {/* WISHLIST */}

        <HeartButton
          active={wished}
          onClick={stop(onWish)}
          className="absolute right-3 top-3 h-9 w-9 text-sm"
        />

        {/* IN CART BADGE */}

        {inCart && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#075c35] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md">
            <FaCheck className="text-[8px]" />
            In cart · {formatWeight(weight)} × {qty}
          </span>
        )}

        {/* QUICK VIEW */}

        <span className="absolute bottom-3 right-3 hidden translate-y-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold text-[#075c35] opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
          Quick view
        </span>
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="truncate text-sm font-extrabold text-[#083f26] sm:text-base">
          {getName(product)}
        </h3>

        <p
          className="mt-1 min-h-[2.4rem] text-xs leading-relaxed text-[#718579]"
          style={clampLines(2)}
        >
          {product.description || "Fresh and carefully selected"}
        </p>

        <div className="mt-2">
          <RatingRow stat={stat} />
        </div>

        {/* PRICE */}

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-lg font-extrabold text-[#075c35] sm:text-xl">
            {formatINR(getPrice(product))}
          </span>

          <span className="text-xs font-semibold text-[#718579]">/ KG</span>
        </div>

        {/* ADD <-> STEPPER */}

        <div className="mt-3">
          <AnimatePresence mode="wait" initial={false}>
            {inCart ? (
              <motion.div
                key="stepper"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.15,
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between rounded-2xl bg-[#eaf5e5] p-1 ring-1 ring-[#bcd6b6]"
              >
                <button
                  type="button"
                  onClick={stop(onDec)}
                  aria-label={
                    qty <= 1 ? "Remove from cart" : "Decrease quantity"
                  }
                  className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#075c35] shadow-sm transition hover:bg-[#f7fbf4]"
                >
                  {qty <= 1 ? (
                    <FaTrash className="text-xs text-red-500" />
                  ) : (
                    <FaMinus className="text-xs" />
                  )}
                </button>

                <span className="text-sm font-extrabold text-[#06472a]">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={stop(onInc)}
                  aria-label="Increase quantity"
                  className="grid h-9 w-9 place-items-center rounded-xl bg-[#075c35] text-white transition hover:bg-[#0b7040]"
                >
                  <FaPlus className="text-xs" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                type="button"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.15,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                onClick={stop(onQuickAdd)}
                aria-label={`Add ${getName(product)} to cart`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] py-2.5 text-sm font-extrabold text-white shadow-md shadow-[#075c35]/25 transition hover:shadow-lg hover:shadow-[#075c35]/30"
              >
                <FaCartPlus />
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ADMIN BUTTONS */}

        {isAdmin && (
          <div className="mt-3 flex gap-1.5 border-t border-[#edf2ea] pt-3">
            <button
              type="button"
              onClick={stop(onEdit)}
              title="Edit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#fff8e5] py-1.5 text-[11px] font-bold text-[#b88e1f] transition hover:bg-[#d4a72c] hover:text-white"
            >
              <FaEdit /> Edit
            </button>

            <button
              type="button"
              onClick={stop(onDelete)}
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
   PRODUCT DETAILS POPUP
===================================================== */

function ProductModal({
  product,
  stat,
  reviews,
  inCart,
  initialQty,
  initialWeight,
  wished,
  user,
  onClose,
  onSubmit,
  onToggleWish,
  onSubmitReview,
}) {
  const [weight, setWeight] = useState(initialWeight);
  const [qty, setQty] = useState(initialQty);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const price = getPrice(product);
  const total = price * weight * qty;

  // Close with the Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setReviewError("Please log in to write a review.");
      return;
    }

    if (!rating) {
      setReviewError("Please choose a star rating.");
      return;
    }

    setSending(true);
    setReviewError("");

    try {
      await onSubmitReview(product, rating, comment.trim());

      setRating(0);
      setHoverRating(0);
      setComment("");
    } catch (error) {
      console.error("Review error:", error);

      setReviewError("Could not post your review. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
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
      onClick={onClose}
      className="fixed inset-0 z-[10050] flex items-end justify-center bg-[#083f26]/70 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${getName(product)} details`}
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 40,
          scale: 0.97,
        }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 320,
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#075c35] shadow-md transition hover:rotate-90 hover:bg-[#eaf5e5]"
        >
          <FaTimes />
        </button>

        {/* SCROLL AREA */}

        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            {/* IMAGE */}

            <div className="relative h-64 bg-[#f4faf1] md:h-auto md:min-h-[440px]">
              <SafeImage
                src={getProductImage(product)}
                alt={getName(product)}
                className="h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {product.category && (
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold capitalize text-[#075c35] shadow-sm">
                  {product.category}
                </span>
              )}

              <HeartButton
                active={wished}
                onClick={onToggleWish}
                className="absolute bottom-4 left-4 h-11 w-11 text-lg"
              />

              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#9bdd45] px-3 py-1.5 text-[11px] font-extrabold text-[#06472a] shadow-md">
                <FaTruck />
                20–30 min delivery
              </span>
            </div>

            {/* DETAILS */}

            <div className="p-5 sm:p-7">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#158447]">
                {product.category || "Fresh product"}
              </p>

              <h2 className="mt-1 pr-10 text-2xl font-extrabold tracking-tight text-[#083f26] sm:text-3xl">
                {getName(product)}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RatingRow stat={stat} />

                {stat && stat.count > 0 && (
                  <span className="text-xs text-[#718579]">
                    {stat.count} review{stat.count !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#52665b]">
                {product.description ||
                  "Fresh and carefully selected, picked this morning and delivered straight to your door."}
              </p>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#075c35]">
                  {formatINR(price)}
                </span>

                <span className="text-sm font-semibold text-[#718579]">
                  per KG
                </span>
              </div>

              {/* WEIGHT */}

              <div className="mt-5">
                <p className="mb-2 text-sm font-extrabold text-[#083f26]">
                  Choose weight
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {WEIGHT_OPTIONS.map((option) => {
                    const active = option.value === weight;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setWeight(option.value)}
                        aria-pressed={active}
                        className={`rounded-xl border py-2 text-xs font-extrabold transition ${
                          active
                            ? "border-[#075c35] bg-[#075c35] text-white shadow-md shadow-[#075c35]/25"
                            : "border-[#dbe8d7] bg-white text-[#075c35] hover:border-[#158447] hover:bg-[#eaf5e5]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUANTITY */}

              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold text-[#083f26]">
                    Quantity
                  </p>

                  <p className="text-xs text-[#718579]">
                    Number of {formatWeight(weight)} packs
                  </p>
                </div>

                <div className="flex items-center rounded-2xl bg-[#eaf5e5] p-1 ring-1 ring-[#bcd6b6]">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#075c35] shadow-sm transition hover:bg-[#f7fbf4] disabled:opacity-40"
                  >
                    <FaMinus className="text-xs" />
                  </button>

                  <span className="w-10 text-center text-base font-extrabold text-[#06472a]">
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                    disabled={qty >= MAX_QTY}
                    aria-label="Increase quantity"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-[#075c35] text-white transition hover:bg-[#0b7040] disabled:opacity-40"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              {/* TOTAL */}

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f1f8ed] px-4 py-3">
                <span className="text-xs font-semibold text-[#52665b]">
                  {formatINR(price)} × {formatWeight(weight)} × {qty}
                </span>

                <motion.span
                  key={total}
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xl font-extrabold text-[#075c35]"
                >
                  {formatINR(total)}
                </motion.span>
              </div>
            </div>
          </div>

          {/* REVIEWS */}

          <div className="border-t border-[#dbe8d7] bg-[#f7fbf4] p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#083f26]">
                  Customer reviews
                </h3>

                <p className="text-xs text-[#718579]">
                  Share what you think about this product.
                </p>
              </div>

              {stat && stat.count > 0 && (
                <div className="flex items-center gap-3 rounded-2xl border border-[#dbe8d7] bg-white px-4 py-2">
                  <span className="text-3xl font-extrabold text-[#075c35]">
                    {stat.avg.toFixed(1)}
                  </span>

                  <div>
                    <Stars value={stat.avg} className="text-sm" />

                    <p className="text-[11px] text-[#718579]">
                      {stat.count} review{stat.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* WRITE A REVIEW */}

            <form
              onSubmit={submitReview}
              className="mt-4 rounded-2xl border border-[#dbe8d7] bg-white p-4"
            >
              <p className="text-sm font-extrabold text-[#083f26]">
                Write a review
              </p>

              <div
                className="mt-2 flex items-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = (hoverRating || rating) >= n;

                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className={`text-2xl transition hover:scale-125 ${
                        filled ? "text-[#f5a623]" : "text-[#c9d8c5]"
                      }`}
                    >
                      <FaStar />
                    </button>
                  );
                })}

                {rating > 0 && (
                  <span className="ml-2 text-xs font-bold text-[#718579]">
                    {
                      ["", "Poor", "Fair", "Good", "Very good", "Excellent"][
                        rating
                      ]
                    }
                  </span>
                )}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                maxLength={400}
                placeholder="Tell others about the freshness, quality and taste..."
                className="mt-3 w-full resize-none rounded-xl border border-[#dbe8d7] bg-[#fbfdf9] px-3 py-2.5 text-sm outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/15"
              />

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p
                  className={`text-xs font-semibold ${
                    reviewError ? "text-red-500" : "text-[#9aa99f]"
                  }`}
                >
                  {reviewError ||
                    (user
                      ? "Your name is shown with the review."
                      : "Log in to post a review.")}
                </p>

                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-xl bg-[#075c35] px-5 py-2 text-sm font-extrabold text-white transition hover:bg-[#0b7040] disabled:opacity-60"
                >
                  {sending ? "Posting..." : "Post review"}
                </button>
              </div>
            </form>

            {/* REVIEW LIST */}

            <div className="mt-4 space-y-3">
              {reviews.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-[#c9dcc4] bg-white py-6 text-center text-sm text-[#718579]">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                reviews.slice(0, 6).map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-[#dbe8d7] bg-white p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-3xl text-[#9bc98a]" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[#083f26]">
                          {review.name || "Customer"}
                        </p>

                        <Stars value={Number(review.rating) || 0} />
                      </div>

                      <span className="text-[11px] text-[#9aa99f]">
                        {formatDate(review)}
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-sm leading-relaxed text-[#52665b]">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* FOOTER: CANCEL + ADD TO CART */}

        <div className="flex shrink-0 items-center gap-3 border-t border-[#dbe8d7] bg-white p-4 sm:px-7">
          <div className="hidden min-w-0 sm:block">
            <p className="text-[11px] font-semibold text-[#718579]">Total</p>

            <p className="text-xl font-extrabold text-[#075c35]">
              {formatINR(total)}
            </p>
          </div>

          <div className="ml-auto flex flex-1 gap-3 sm:flex-none">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[#dbe8d7] bg-white px-6 py-3 text-sm font-extrabold text-[#075c35] transition hover:bg-[#eaf5e5] sm:flex-none"
            >
              Cancel
            </button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onSubmit(weight, qty)}
              className="flex flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition hover:shadow-xl sm:flex-none"
            >
              <FaCartPlus />
              {inCart ? "Update Cart" : "Add to Cart"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
   FILTER PANEL
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
  wishOnly,
  onWishOnly,
  wishCount,
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
    {
      key: "all",
      name: "All Products",
      count: totalCount,
      image: "",
    },
    ...categories,
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dbe8d7] bg-white shadow-sm">
      <style>{RANGE_CSS}</style>

      {/* HEADER */}

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
        {/* CATEGORIES */}

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

        {/* PRICE */}

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
              style={{
                left: `${leftPct}%`,
                width: `${widthPct}%`,
              }}
            />

            <input
              type="range"
              className="kmr-range"
              aria-label="Minimum price"
              min={bounds.min}
              max={bounds.max}
              step={step}
              value={priceMin}
              style={{
                zIndex: priceMin > mid ? 5 : 3,
              }}
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
              style={{
                zIndex: 4,
              }}
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

        {/* CART STATUS */}

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

        {/* WISHLIST */}

        <div className="border-t border-[#edf2ea] pt-5">
          <button
            type="button"
            onClick={() => onWishOnly(!wishOnly)}
            aria-pressed={wishOnly}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition ${
              wishOnly
                ? "bg-red-50 text-red-500 ring-1 ring-red-200"
                : "bg-[#f1f7ee] text-[#3c5b48] hover:bg-[#e8f2e4]"
            }`}
          >
            <span className="flex items-center gap-2">
              {wishOnly ? <FaHeart /> : <FaRegHeart />}
              My wishlist
            </span>

            <span className="rounded-full bg-white px-2 py-0.5 text-xs">
              {wishCount}
            </span>
          </button>
        </div>

        {/* CLEAR */}

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

  const wishlist = useWishlist();

  const [allProducts, setAllProducts] = useState(productsData);

  const [category, setCategory] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");

  const [priceRange, setPriceRange] = useState(null);

  const [cartFilter, setCartFilter] = useState("all");

  const [wishOnly, setWishOnly] = useState(false);

  const [sortBy, setSortBy] = useState("default");

  const [filterOpen, setFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // product opened in the details popup
  const [selected, setSelected] = useState(null);

  // weight (KG) chosen for every cart item: { [id]: 0.5 }
  const [weights, setWeights] = useState(loadWeights);

  // all reviews from Firestore
  const [reviews, setReviews] = useState([]);

  // small "added to cart" message
  const [toast, setToast] = useState(null);

  const toastTimer = useRef(null);

  const pendingQty = useRef({});

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current);

    setToast({
      id: Date.now(),
      message,
    });

    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* =====================================================
     FIRESTORE PRODUCTS
  ===================================================== */

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

  /* =====================================================
     FIRESTORE REVIEWS
     Collection: productReviews
     { productId, name, uid, rating, comment, createdAt }
  ===================================================== */

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const snapshot = await getDocs(collection(db, "productReviews"));

        setReviews(
          snapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })),
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const reviewStats = useMemo(() => {
    const map = new Map();

    reviews.forEach((review) => {
      const key = String(review.productId);

      const entry = map.get(key) || {
        count: 0,
        sum: 0,
      };

      entry.count += 1;
      entry.sum += Number(review.rating) || 0;

      map.set(key, entry);
    });

    map.forEach((entry) => {
      entry.avg = entry.sum / entry.count;
    });

    return map;
  }, [reviews]);

  // review stats from Firestore, or a "rating" saved on the product itself
  const getStat = (product) => {
    const fromReviews = reviewStats.get(String(product.id));

    if (fromReviews) return fromReviews;

    if (Number(product.rating) > 0) {
      return {
        avg: Number(product.rating),
        count: Number(product.reviewCount) || 0,
      };
    }

    return null;
  };

  const handleSubmitReview = async (product, rating, comment) => {
    const name =
      user?.displayName ||
      (user?.email ? user.email.split("@")[0] : "Customer");

    const data = {
      productId: String(product.id),
      name,
      uid: user?.uid || null,
      rating,
      comment,
    };

    const ref = await addDoc(collection(db, "productReviews"), {
      ...data,
      createdAt: serverTimestamp(),
    });

    setReviews((previous) => [
      {
        id: ref.id,
        ...data,
        createdAt: new Date(),
      },
      ...previous,
    ]);

    notify("Thanks for your review!");
  };

  /* =====================================================
     ADMIN
  ===================================================== */

  const currentEmail = user?.email || localStorage.getItem("userEmail");

  // Same rule drives Edit, Delete and Add Product
  const isAdmin =
    isAdminEmail(currentEmail) ||
    user?.role === "admin" ||
    user?.isAdmin === true;

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  /* =====================================================
     CART
  ===================================================== */

  const cartMap = useMemo(() => {
    const map = new Map();

    (cart || []).forEach((item) => {
      map.set(String(item.id), item);
    });

    return map;
  }, [cart]);

  const isInCart = (productId) => cartMap.has(String(productId));

  const getQty = (productId) => cartMap.get(String(productId))?.quantity || 1;

  const getWeight = (productId) =>
    Number(weights[String(productId)]) ||
    Number(cartMap.get(String(productId))?.weight) ||
    1;

  const setWeightFor = (productId, weight) => {
    setWeights(saveWeight(productId, weight));
  };

  /*
    When a product is added from the popup with quantity > 1,
    make sure the cart really ends up with that quantity
    (works whichever way your CartContext handles addToCart).
  */
  useEffect(() => {
    const pending = pendingQty.current;

    Object.keys(pending).forEach((id) => {
      const item = cartMap.get(id);

      if (!item) return;

      if ((item.quantity || 1) !== pending[id]) {
        updateQuantity(item.id, pending[id]);
      }

      delete pending[id];
    });
  }, [cartMap]);

  const handleQuickAdd = (product) => {
    setWeightFor(product.id, 1);

    addToCart({
      ...product,
      weight: 1,
    });

    notify(`${getName(product)} added to cart`);
  };

  const handleIncrease = (product) => {
    updateQuantity(product.id, getQty(product.id) + 1);
  };

  const handleDecrease = (product) => {
    const qty = getQty(product.id);

    if (qty <= 1) {
      removeFromCart(product.id);

      setWeights(removeWeight(product.id));
    } else {
      updateQuantity(product.id, qty - 1);
    }
  };

  // Add to cart / Update cart from the popup
  const handleModalSubmit = (product, weight, qty) => {
    setWeightFor(product.id, weight);

    if (isInCart(product.id)) {
      updateQuantity(product.id, qty);

      notify("Cart updated");
    } else {
      pendingQty.current[String(product.id)] = qty;

      addToCart({
        ...product,
        weight,
        quantity: qty,
      });

      notify(`${getName(product)} added to cart`);
    }

    setSelected(null);
  };

  const handleWish = (product) => {
    const wasWished = wishlist.has(product.id);

    wishlist.toggle(product);

    notify(wasWished ? "Removed from wishlist" : "Saved to your wishlist");
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "addProducts", id));

      setAllProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = useMemo(() => {
    const map = new Map();

    allProducts.forEach((product) => {
      const raw = product.category?.trim();

      if (!raw) return;

      const key = normalizeCategory(raw);

      const entry = map.get(key) || {
        key,
        name: raw,
        count: 0,
        image: "",
      };

      entry.count += 1;

      if (!entry.image) {
        entry.image = getProductImage(product);
      }

      map.set(key, entry);
    });

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [allProducts]);

  /* =====================================================
     PRICE BOUNDS
  ===================================================== */

  const { bounds, step } = useMemo(() => {
    const max = allProducts.reduce((m, p) => Math.max(m, getPrice(p)), 0);

    const s = max > 1000 ? 50 : max > 300 ? 10 : 5;

    return {
      bounds: {
        min: 0,
        max: Math.max(s * 2, Math.ceil(max / s) * s),
      },
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

  /* =====================================================
     FILTER + SORT
  ===================================================== */

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

      const matchesWish = !wishOnly || wishlist.has(product.id);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice &&
        matchesCart &&
        matchesWish
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === "priceLow") {
        return getPrice(a) - getPrice(b);
      }

      if (sortBy === "priceHigh") {
        return getPrice(b) - getPrice(a);
      }

      if (sortBy === "nameAZ") {
        return getName(a).toLowerCase().localeCompare(getName(b).toLowerCase());
      }

      if (sortBy === "nameZA") {
        return getName(b).toLowerCase().localeCompare(getName(a).toLowerCase());
      }

      if (sortBy === "rating") {
        return (getStat(b)?.avg || 0) - (getStat(a)?.avg || 0);
      }

      return 0;
    });
  }, [
    allProducts,
    category,
    searchTerm,
    priceMin,
    priceMax,
    cartFilter,
    wishOnly,
    wishlist.items,
    sortBy,
    cartMap,
    reviewStats,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const page = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchTerm, priceRange, cartFilter, wishOnly, sortBy]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) {
      return;
    }

    setCurrentPage(p);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const clearFilters = () => {
    setCategory("all");
    setSearchTerm("");
    setPriceRange(null);
    setCartFilter("all");
    setWishOnly(false);
    setSortBy("default");
  };

  const hasActiveFilters =
    category !== "all" ||
    searchTerm.trim() !== "" ||
    priceActive ||
    cartFilter !== "all" ||
    wishOnly;

  const activeCount =
    (category !== "all" ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0) +
    (priceActive ? 1 : 0) +
    (cartFilter !== "all" ? 1 : 0) +
    (wishOnly ? 1 : 0);

  const chips = [];

  if (category !== "all") {
    chips.push({
      id: "cat",
      label: categories.find((c) => c.key === category)?.name || category,
      onRemove: () => setCategory("all"),
    });
  }

  if (searchTerm.trim()) {
    chips.push({
      id: "q",
      label: `“${searchTerm.trim()}”`,
      onRemove: () => setSearchTerm(""),
    });
  }

  if (priceActive) {
    chips.push({
      id: "price",
      label: `${formatINR(priceMin)} – ${formatINR(priceMax)}`,
      onRemove: () => setPriceRange(null),
    });
  }

  if (cartFilter !== "all") {
    chips.push({
      id: "cart",
      label: cartFilter === "cart" ? "In my cart" : "Not in cart",
      onRemove: () => setCartFilter("all"),
    });
  }

  if (wishOnly) {
    chips.push({
      id: "wish",
      label: "My wishlist",
      onRemove: () => setWishOnly(false),
    });
  }

  /* =====================================================
     SCROLL LOCK (mobile drawer + details popup)
  ===================================================== */

  const lockScroll = filterOpen || Boolean(selected);

  useEffect(() => {
    if (!lockScroll) {
      return undefined;
    }

    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [lockScroll]);

  const closeModal = useCallback(() => setSelected(null), []);

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
    wishOnly,
    onWishOnly: setWishOnly,
    wishCount: wishlist.count,
    hasActiveFilters,
    onClear: clearFilters,
  };

  /* =====================================================
     HERO DATA
  ===================================================== */

  const heroPhotos = useMemo(() => {
    const seen = new Set();
    const out = [];

    allProducts.forEach((p) => {
      const src = getProductImage(p);

      if (!src || seen.has(src) || out.length >= 4) {
        return;
      }

      seen.add(src);

      out.push({
        id: p.id,
        src,
        name: getName(p),
      });
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

  // reviews of the product shown in the popup (newest first)
  const selectedReviews = useMemo(() => {
    if (!selected) return [];

    return reviews
      .filter((r) => String(r.productId) === String(selected.id))
      .sort((a, b) => getTime(b) - getTime(a));
  }, [reviews, selected]);

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#f7fbf4] text-[#083f26]">
      <style>{PAGE_CSS}</style>

      <Navbar />

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] text-white">
        {/* DOT PATTERN */}

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
          {/* LEFT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
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

            {/* STATS */}

            <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
              {[
                [FaShoppingBasket, `${allProducts.length}+`, "Fresh products"],
                [FaThLarge, categories.length, "Categories"],
                [FaTruck, "20–30", "Min delivery"],
              ].map(([Icon, value, label], i) => (
                <motion.div
                  key={label}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.25 + i * 0.08,
                  }}
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

            {/* MOBILE PHOTOS */}

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

          {/* RIGHT HERO */}

          {(HERO_IMAGE || heroPhotos.length > 0) && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
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
                        style={{
                          animationDelay: t.delay,
                        }}
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

              {/* FLOATING CHIP */}

              <div className="kmr-float-slow absolute left-[2%] top-[2%] z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#075c35] shadow-lg">
                <FaLeaf className="text-[#158447]" />
                Picked this morning
              </div>

              {lowestPrice > 0 && (
                <div
                  className="kmr-float-slow absolute bottom-[2%] right-[3%] z-10 rounded-full bg-[#9bdd45] px-3.5 py-1.5 text-xs font-extrabold text-[#06472a] shadow-lg"
                  style={{
                    animationDelay: "1s",
                  }}
                >
                  From {formatINR(lowestPrice)}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto w-full max-w-[1800px] px-3 py-6 sm:px-4 lg:px-6">
        {/* MOBILE CATEGORY */}

        <div className="-mx-3 mb-4 flex gap-2.5 overflow-x-auto px-3 pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            {
              key: "all",
              name: "All",
              image: "",
            },
            ...categories,
          ].map(({ key, name, image }) => {
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
          })}
        </div>

        {/* 20% / 80% */}

        <div className="grid gap-5 lg:grid-cols-[minmax(240px,20%)_1fr]">
          {/* SIDEBAR */}

          <aside className="hidden lg:block">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl">
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          {/* PRODUCTS */}

          <section className="min-w-0">
            {/* ADMIN BAR (same admin check as Edit / Delete) */}

            {isAdmin && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#bcd6b6] bg-[#eaf5e5] px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#083f26]">
                    Admin tools
                  </p>

                  <p className="text-xs text-[#52665b]">
                    Add new products here. Use Edit and Delete on each card to
                    manage existing ones.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 rounded-xl bg-[#075c35] px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-[#075c35]/25 transition hover:bg-[#0b7040] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9bdd45]/60"
                >
                  <FaPlus />
                  Add Product
                </button>
              </div>
            )}

            {/* SEARCH + SORT + WISHLIST + CART */}

            <div className="mb-4 rounded-2xl border border-[#dbe8d7] bg-white p-3 shadow-sm">
              <div className="flex flex-col gap-3 xl:flex-row">
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

                <div className="flex flex-wrap gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-[#dbe8d7] bg-white px-4 py-3 text-sm font-semibold text-[#3c5b48] outline-none transition focus:border-[#158447] focus:ring-4 focus:ring-[#158447]/15 xl:w-52 xl:flex-none"
                  >
                    <option value="default">Sort: Featured</option>

                    <option value="priceLow">Price: Low → High</option>

                    <option value="priceHigh">Price: High → Low</option>

                    <option value="rating">Top rated</option>

                    <option value="nameAZ">Name: A → Z</option>

                    <option value="nameZA">Name: Z → A</option>
                  </select>

                  {/* WISHLIST */}

                  <button
                    type="button"
                    onClick={() => setWishOnly((v) => !v)}
                    aria-pressed={wishOnly}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                      wishOnly
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-[#dbe8d7] bg-white text-[#075c35] hover:bg-[#eaf5e5]"
                    }`}
                  >
                    {wishOnly ? <FaHeart /> : <FaRegHeart />}

                    <span className="hidden sm:inline">Wishlist</span>

                    <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-white px-1 text-[11px] shadow-sm">
                      {wishlist.count}
                    </span>
                  </button>

                  {/* CART */}

                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="flex items-center gap-2 rounded-xl bg-[#075c35] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#0b7040]"
                  >
                    <FaShoppingCart />

                    <span className="hidden sm:inline">Cart</span>

                    <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-[#9bdd45] px-1 text-[11px] text-[#06472a]">
                      {cart?.length || 0}
                    </span>
                  </button>
                </div>
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

                  {/* MOBILE FILTER */}

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
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.85,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
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

            {/* =================================================
                PRODUCT GRID  (4 cards in a row on desktop)
            ================================================= */}

            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#c9dcc4] bg-white py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eaf5e5] text-2xl text-[#075c35]">
                  {wishOnly ? <FaRegHeart /> : <FaSearch />}
                </div>

                <h2 className="mt-4 text-xl font-extrabold">
                  {wishOnly ? "Your wishlist is empty" : "No products found"}
                </h2>

                <p className="mt-2 text-sm text-[#718579]">
                  {wishOnly
                    ? "Tap the heart on any product to save it here."
                    : "Try a different name, or widen the price range."}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={clearFilters}
                    className="rounded-xl bg-[#075c35] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#083f26]"
                  >
                    Clear filters
                  </button>

                  {isAdmin && (
                    <button
                      onClick={handleAddProduct}
                      className="flex items-center gap-2 rounded-xl bg-[#9bdd45] px-5 py-2.5 text-sm font-bold text-[#06472a] transition hover:bg-[#8bcd38]"
                    >
                      <FaPlus />
                      Add product
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                key={`${page}-${category}`}
                className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5"
              >
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    stat={getStat(product)}
                    inCart={isInCart(product.id)}
                    qty={getQty(product.id)}
                    weight={getWeight(product.id)}
                    wished={wishlist.has(product.id)}
                    isAdmin={isAdmin}
                    onOpen={() => setSelected(product)}
                    onQuickAdd={() => handleQuickAdd(product)}
                    onInc={() => handleIncrease(product)}
                    onDec={() => handleDecrease(product)}
                    onWish={() => handleWish(product)}
                    onEdit={() => navigate(`/edit-product/${product.id}`)}
                    onDelete={() => handleDelete(product.id)}
                  />
                ))}
              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

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

      {/* =================================================
          PRODUCT DETAILS POPUP
      ================================================= */}

      <AnimatePresence>
        {selected && (
          <ProductModal
            key={selected.id}
            product={selected}
            stat={getStat(selected)}
            reviews={selectedReviews}
            inCart={isInCart(selected.id)}
            initialQty={isInCart(selected.id) ? getQty(selected.id) : 1}
            initialWeight={getWeight(selected.id)}
            wished={wishlist.has(selected.id)}
            user={user}
            onClose={closeModal}
            onSubmit={(weight, qty) => handleModalSubmit(selected, weight, qty)}
            onToggleWish={() => handleWish(selected)}
            onSubmitReview={handleSubmitReview}
          />
        )}
      </AnimatePresence>

      {/* =================================================
          MOBILE FILTER DRAWER
      ================================================= */}

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
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-[80] bg-black/40"
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
                damping: 30,
                stiffness: 320,
              }}
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

      {/* =================================================
          TOAST
      ================================================= */}

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[10060] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.95,
              }}
              className="flex items-center gap-2.5 rounded-full bg-[#06472a] px-5 py-3 text-sm font-bold text-white shadow-2xl"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#9bdd45] text-[10px] text-[#06472a]">
                <FaCheck />
              </span>

              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

export default Products;
