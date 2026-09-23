// // src/pages/Cart.jsx

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// import CheckoutStepper from "../components/CheckoutStepper";

// import { useCart } from "../context/CartContext";

// import { db } from "../firebase";
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

// // eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from "framer-motion";

// import {
//   FaTrash,
//   FaPlus,
//   FaMinus,
//   FaCheck,
//   FaLeaf,
//   FaLock,
//   FaTruck,
//   FaHeart,
//   FaShoppingBasket,
//   FaShoppingCart,
//   FaWhatsapp,
//   FaArrowRight,
//   FaArrowLeft,
// } from "react-icons/fa";

// import {
//   WEIGHT_OPTIONS,
//   formatWeight,
//   formatPrice,
//   loadWeights,
//   saveWeight,
//   removeWeight,
//   clearWeights,
//   useWishlist,
// } from "../utils/shop";

// // Orders above this amount get free delivery (same offer as the home page)
// const FREE_DELIVERY_MIN = 1000;

// const getItemImage = (item) => item.image || item.imageUrl || item.img || "";

// // =========================================================
// // PRODUCT THUMBNAIL (with fallback)
// // =========================================================

// function Thumb({ src, alt, className = "" }) {
//   const [failed, setFailed] = useState(false);

//   useEffect(() => {
//     setFailed(false);
//   }, [src]);

//   if (!src || failed) {
//     return (
//       <div
//         className={`grid place-items-center bg-gradient-to-br from-[#eaf5e5] to-[#d6ecce] text-[#158447] ${className}`}
//       >
//         <FaLeaf className="text-xl opacity-70" />
//       </div>
//     );
//   }

//   return (
//     <img
//       src={src}
//       alt={alt}
//       onError={() => setFailed(true)}
//       className={`object-cover ${className}`}
//     />
//   );
// }

// function Cart() {
//   const navigate = useNavigate();

//   const { cart, addToCart, removeFromCart, updateQuantity, clearCart, user } =
//     useCart();

//   const wishlist = useWishlist();

//   // =========================================================
//   // MODAL STATES
//   // =========================================================

//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const [saving, setSaving] = useState(false);
//   const [pendingOrder, setPendingOrder] = useState(null);

//   // =========================================================
//   // WEIGHT STATE
//   //
//   // Each cart item has its own weight.
//   // The weight chosen on the Products page is remembered in
//   // localStorage, so it is picked up here automatically.
//   // Default = 1 KG
//   // =========================================================

//   const [itemWeights, setItemWeights] = useState(() => {
//     const saved = loadWeights();

//     const initialWeights = {};

//     cart.forEach((item) => {
//       initialWeights[item.id] =
//         Number(saved[String(item.id)]) || Number(item.weight) || 1;
//     });

//     return initialWeights;
//   });

//   // =========================================================
//   // KEEP WEIGHTS IN SYNC WITH CART
//   // =========================================================

//   useEffect(() => {
//     setItemWeights((previous) => {
//       const saved = loadWeights();

//       const updated = { ...previous };

//       cart.forEach((item) => {
//         if (!updated[item.id]) {
//           updated[item.id] =
//             Number(saved[String(item.id)]) || Number(item.weight) || 1;
//         }
//       });

//       return updated;
//     });
//   }, [cart]);

//   // =========================================================
//   // UPDATE WEIGHT
//   // =========================================================

//   const updateWeight = (itemId, weight) => {
//     const value = Number(weight);

//     setItemWeights((previous) => ({
//       ...previous,
//       [itemId]: value,
//     }));

//     saveWeight(itemId, value);
//   };

//   // =========================================================
//   // GET ITEM WEIGHT
//   // =========================================================

//   const getItemWeight = (item) => {
//     return Number(itemWeights[item.id] || item.weight || 1);
//   };

//   // =========================================================
//   // GET SINGLE ITEM TOTAL
//   //
//   // item.price = price for 1 KG
//   //
//   // Example:
//   // price = ₹200
//   // weight = 0.5
//   // quantity = 2
//   //
//   // total = 200 × 0.5 × 2
//   //       = ₹200
//   // =========================================================

//   const getItemTotal = (item) => {
//     const weight = getItemWeight(item);
//     const quantity = item.quantity || 1;

//     return Number(item.price || 0) * weight * quantity;
//   };

//   // =========================================================
//   // TOTAL AMOUNT
//   // =========================================================

//   const totalAmount = cart.reduce((sum, item) => {
//     return sum + getItemTotal(item);
//   }, 0);

//   // =========================================================
//   // TOTAL QUANTITY
//   // =========================================================

//   const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

//   // free delivery progress
//   const remainingForFree = Math.max(FREE_DELIVERY_MIN - totalAmount, 0);

//   const freeProgress = Math.min(totalAmount / FREE_DELIVERY_MIN, 1) * 100;

//   // =========================================================
//   // LOCK BACKGROUND SCROLL
//   //
//   // This works for:
//   // WhatsApp address popup
//   // Success popup
//   // =========================================================

//   const modalOpen = showAddressForm || showSuccess;

//   useEffect(() => {
//     if (!modalOpen) {
//       return undefined;
//     }

//     const previousOverflow = document.body.style.overflow;
//     const previousPaddingRight = document.body.style.paddingRight;

//     // Prevent background scrolling
//     document.body.style.overflow = "hidden";

//     // Prevent small layout jump caused by scrollbar disappearing
//     const scrollbarWidth =
//       window.innerWidth - document.documentElement.clientWidth;

//     if (scrollbarWidth > 0) {
//       document.body.style.paddingRight = `${scrollbarWidth}px`;
//     }

//     return () => {
//       document.body.style.overflow = previousOverflow;
//       document.body.style.paddingRight = previousPaddingRight;
//     };
//   }, [modalOpen]);

//   // =========================================================
//   // REMOVE ITEM
//   // =========================================================

//   const handleRemove = (itemId) => {
//     removeFromCart(itemId);
//     removeWeight(itemId);
//   };

//   // =========================================================
//   // CLEAR CART
//   // =========================================================

//   const clearCartSafe = () => {
//     if (typeof clearCart === "function") {
//       clearCart();
//     } else {
//       cart.forEach((item) => {
//         removeFromCart(item.id);
//       });
//     }

//     clearWeights();
//   };

//   // =========================================================
//   // WISHLIST -> CART
//   // =========================================================

//   const cartIds = new Set(cart.map((item) => String(item.id)));

//   const addWishlistItemToCart = (item) => {
//     saveWeight(item.id, 1);

//     addToCart({
//       ...item,
//       weight: 1,
//     });
//   };

//   // =========================================================
//   // WHATSAPP ADDRESS
//   // =========================================================

//   const [address, setAddress] = useState({
//     fullName: "",
//     houseNo: "",
//     street: "",
//     city: "",
//     phone: "",
//   });

//   const [errors, setErrors] = useState({});

//   // =========================================================
//   // WHATSAPP ADDRESS VALIDATION
//   // =========================================================

//   const validateAndSubmit = () => {
//     const newErrors = {};

//     if (!address.fullName.trim()) {
//       newErrors.fullName = "Full name is required";
//     }

//     if (!address.houseNo.trim()) {
//       newErrors.houseNo = "House No is required";
//     }

//     if (!address.street.trim()) {
//       newErrors.street = "Street is required";
//     }

//     if (!address.city.trim()) {
//       newErrors.city = "City is required";
//     }

//     if (!/^\d{10}$/.test(address.phone)) {
//       newErrors.phone = "Enter a valid 10-digit phone number";
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       placeOrderWithAddress();
//     }
//   };

//   // =========================================================
//   // WHATSAPP ORDER
//   // =========================================================

//   const handleOrderNow = () => {
//     if (!cart || cart.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     setShowAddressForm(true);
//   };

//   // =========================================================
//   // CREATE WHATSAPP ORDER
//   // =========================================================

//   const placeOrderWithAddress = () => {
//     if (
//       !address.fullName ||
//       !address.houseNo ||
//       !address.street ||
//       !address.city ||
//       !address.phone
//     ) {
//       alert("Please fill all address fields!");
//       return;
//     }

//     const snapshot = {
//       id: Date.now().toString(),

//       items: cart.map((item) => {
//         const weight = getItemWeight(item);
//         const quantity = item.quantity || 1;
//         const unitPrice = Number(item.price || 0);

//         return {
//           ...item,

//           weight,
//           weightLabel: formatWeight(weight),

//           quantity,

//           unitPrice,

//           amount: unitPrice * weight * quantity,
//         };
//       }),

//       total: totalAmount,

//       placedAt: new Date().toISOString(),

//       address: {
//         ...address,
//       },
//     };

//     // =======================================================
//     // WHATSAPP MESSAGE
//     // =======================================================

//     let message = "🛒 Order Details:\n\n";

//     snapshot.items.forEach((item, index) => {
//       message += `${index + 1}. ${item.name}\n`;

//       message += `   Weight: ${item.weightLabel}\n`;

//       message += `   Quantity: ${item.quantity}\n`;

//       message += `   Price: ₹${formatPrice(item.unitPrice)}/KG\n`;

//       message += `   Amount: ₹${formatPrice(item.amount)}\n\n`;
//     });

//     message += `💰 Total Amount: ₹${formatPrice(snapshot.total)}`;

//     message += `\n\n👤 Name: ${address.fullName}`;

//     message += `\n🏠 House No: ${address.houseNo}`;

//     message += `\n📍 Address: ${address.street}, ${address.city}`;

//     message += `\n📞 Phone: ${address.phone}`;

//     message += "\n\nPlease confirm my order. ✅";

//     const encodedMessage = encodeURIComponent(message);

//     const whatsappLink = `https://wa.me/918825875206?text=${encodedMessage}`;

//     window.open(whatsappLink, "_blank");

//     setPendingOrder(snapshot);

//     setShowAddressForm(false);

//     setShowSuccess(true);
//   };

//   // =========================================================
//   // SAVE WHATSAPP ORDER
//   // =========================================================

//   const handleSuccessOk = async () => {
//     if (!pendingOrder || !user) {
//       setShowSuccess(false);
//       return;
//     }

//     setSaving(true);

//     try {
//       const ordersRef = doc(db, "orders", user.uid);

//       const docSnap = await getDoc(ordersRef);

//       if (docSnap.exists()) {
//         await updateDoc(ordersRef, {
//           data: arrayUnion(pendingOrder),
//         });
//       } else {
//         await setDoc(ordersRef, {
//           data: [pendingOrder],
//         });
//       }

//       clearCartSafe();

//       setPendingOrder(null);

//       setShowSuccess(false);

//       setAddress({
//         fullName: "",
//         houseNo: "",
//         street: "",
//         city: "",
//         phone: "",
//       });

//       setErrors({});
//     } catch (err) {
//       console.error("Error saving order:", err);

//       alert("Failed to save order.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================================================
//   // CHECKOUT
//   //
//   // Opens the full Checkout page (shipping + payment).
//   // The KG chosen for every item is already saved in
//   // localStorage, so the Checkout page picks it up.
//   // =========================================================

//   const handlePlaceOrder = () => {
//     if (!cart || cart.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     if (!user) {
//       alert("Please log in to place an order.");
//       return;
//     }

//     navigate("/checkout");
//   };

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div className="min-h-screen bg-[#f7fbf4] flex flex-col text-[#083f26] relative overflow-x-hidden">
//       <Navbar />

//       {/* =====================================================
//           HEADER BAND
//       ===================================================== */}

//       <section className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] text-white">
//         <div
//           className="pointer-events-none absolute inset-0 opacity-70"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
//             backgroundSize: "22px 22px",
//           }}
//         />

//         <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#9bdd45]/15 blur-2xl" />

//         <div className="relative mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 py-9 sm:px-6 lg:px-10">
//           <motion.div
//             initial={{ opacity: 0, y: 14 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.45 }}
//           >
//             <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
//               <FaShoppingBasket />
//               Your basket
//             </p>

//             <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
//               Shopping <span className="text-[#c8f26b]">Cart</span>
//             </h1>

//             <p className="mt-2 text-sm text-green-100">
//               Select your preferred weight and quantity.
//             </p>
//           </motion.div>

//           {cart.length > 0 && (
//             <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
//               <p className="text-[11px] font-medium text-green-100">
//                 {itemCount} item{itemCount !== 1 ? "s" : ""} · Total
//               </p>

//               <p className="text-2xl font-extrabold">
//                 ₹{formatPrice(totalAmount)}
//               </p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* =====================================================
//           CART SECTION
//       ===================================================== */}

//       <main className="page-content mx-auto w-full max-w-[1400px] flex-grow px-4 py-8 sm:px-6 lg:px-10">
//         {/* STEPPER */}

//         <CheckoutStepper current={1} />

//         {cart.length === 0 ? (
//           /* =================================================
//               EMPTY CART
//           ================================================= */

//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mt-8 rounded-3xl border border-dashed border-[#c9dcc4] bg-white px-6 py-16 text-center"
//           >
//             <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#eaf5e5] text-4xl text-[#158447]">
//               <FaShoppingBasket />
//             </div>

//             <h2 className="mt-5 text-2xl font-extrabold text-[#083f26]">
//               Your cart is empty
//             </h2>

//             <p className="mx-auto mt-2 max-w-sm text-sm text-[#718579]">
//               Looks like you haven't added anything yet. Fresh fruits and
//               vegetables are waiting for you.
//             </p>

//             <button
//               type="button"
//               onClick={() => navigate("/products")}
//               className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition hover:-translate-y-0.5"
//             >
//               Browse products
//               <FaArrowRight />
//             </button>
//           </motion.div>
//         ) : (
//           <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_390px]">
//             {/* =================================================
//                 ITEMS
//             ================================================= */}

//             <div>
//               <div className="mb-4 flex items-center justify-between">
//                 <h2 className="text-xl font-extrabold text-[#083f26]">
//                   Selected items
//                   <span className="ml-2 rounded-full bg-[#eaf5e5] px-2.5 py-0.5 text-xs font-bold text-[#075c35]">
//                     {cart.length}
//                   </span>
//                 </h2>

//                 <button
//                   type="button"
//                   onClick={() => navigate("/products")}
//                   className="inline-flex items-center gap-2 text-sm font-bold text-[#075c35] hover:underline"
//                 >
//                   <FaArrowLeft className="text-xs" />
//                   Continue shopping
//                 </button>
//               </div>

//               <ul className="space-y-4">
//                 <AnimatePresence initial={false}>
//                   {cart.map((item) => {
//                     const weight = getItemWeight(item);

//                     const quantity = item.quantity || 1;

//                     const itemTotal = getItemTotal(item);

//                     return (
//                       <motion.li
//                         key={item.id}
//                         layout
//                         initial={{
//                           opacity: 0,
//                           y: 24,
//                         }}
//                         animate={{
//                           opacity: 1,
//                           y: 0,
//                         }}
//                         exit={{
//                           opacity: 0,
//                           x: -40,
//                         }}
//                         transition={{
//                           duration: 0.3,
//                         }}
//                         className="group rounded-3xl border border-[#dbe8d7] bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-[#075c35]/10 sm:p-5"
//                       >
//                         <div className="flex gap-4">
//                           {/* IMAGE */}

//                           <Thumb
//                             src={getItemImage(item)}
//                             alt={item.name}
//                             className="h-24 w-24 shrink-0 rounded-2xl border border-[#dbe8d7] sm:h-28 sm:w-28"
//                           />

//                           <div className="flex min-w-0 flex-1 flex-col">
//                             {/* NAME + REMOVE */}

//                             <div className="flex items-start justify-between gap-3">
//                               <div className="min-w-0">
//                                 <h3 className="truncate text-base font-extrabold text-[#083f26] sm:text-lg">
//                                   {item.name}
//                                 </h3>

//                                 <p className="mt-0.5 text-xs text-[#718579]">
//                                   ₹{formatPrice(item.price)} per KG
//                                 </p>

//                                 {item.category && (
//                                   <span className="mt-1.5 inline-block rounded-full bg-[#eaf5e5] px-2.5 py-0.5 text-[10px] font-extrabold capitalize text-[#158447]">
//                                     {item.category}
//                                   </span>
//                                 )}
//                               </div>

//                               <button
//                                 type="button"
//                                 onClick={() => handleRemove(item.id)}
//                                 aria-label={`Remove ${item.name}`}
//                                 className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-sm text-red-500 transition hover:bg-red-500 hover:text-white"
//                               >
//                                 <FaTrash />
//                               </button>
//                             </div>

//                             {/* CONTROLS + AMOUNT */}

//                             <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
//                               <div className="flex flex-wrap items-end gap-4">
//                                 {/* WEIGHT */}

//                                 <label className="block">
//                                   <span className="mb-1 block text-[11px] font-bold text-[#718579]">
//                                     Weight
//                                   </span>

//                                   <select
//                                     value={weight}
//                                     onChange={(e) =>
//                                       updateWeight(item.id, e.target.value)
//                                     }
//                                     className="min-w-[105px] cursor-pointer rounded-xl border border-[#dbe8d7] bg-[#fbfdf9] px-3 py-2.5 text-sm font-bold text-[#075c35] outline-none transition focus:border-[#158447] focus:ring-4 focus:ring-[#158447]/15"
//                                   >
//                                     {WEIGHT_OPTIONS.map((option) => (
//                                       <option
//                                         key={option.value}
//                                         value={option.value}
//                                       >
//                                         {option.label}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </label>

//                                 {/* QUANTITY */}

//                                 <div>
//                                   <span className="mb-1 block text-[11px] font-bold text-[#718579]">
//                                     Quantity
//                                   </span>

//                                   <div className="flex items-center rounded-xl bg-[#eaf5e5] p-1 ring-1 ring-[#bcd6b6]">
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         updateQuantity(
//                                           item.id,
//                                           Math.max(1, quantity - 1),
//                                         )
//                                       }
//                                       disabled={quantity <= 1}
//                                       aria-label="Decrease quantity"
//                                       className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#075c35] shadow-sm transition hover:bg-[#f7fbf4] disabled:opacity-40"
//                                     >
//                                       <FaMinus className="text-[10px]" />
//                                     </button>

//                                     <span className="w-9 text-center text-sm font-extrabold text-[#06472a]">
//                                       {quantity}
//                                     </span>

//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         updateQuantity(item.id, quantity + 1)
//                                       }
//                                       aria-label="Increase quantity"
//                                       className="grid h-8 w-8 place-items-center rounded-lg bg-[#075c35] text-white transition hover:bg-[#0b7040]"
//                                     >
//                                       <FaPlus className="text-[10px]" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* AMOUNT */}

//                               <div className="text-right">
//                                 <motion.p
//                                   key={itemTotal}
//                                   initial={{ scale: 0.92, opacity: 0.6 }}
//                                   animate={{ scale: 1, opacity: 1 }}
//                                   className="text-xl font-extrabold text-[#075c35]"
//                                 >
//                                   ₹{formatPrice(itemTotal)}
//                                 </motion.p>

//                                 <p className="text-[11px] text-[#718579]">
//                                   {formatWeight(weight)} × {quantity}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.li>
//                     );
//                   })}
//                 </AnimatePresence>
//               </ul>
//             </div>

//             {/* =================================================
//                 ORDER SUMMARY
//             ================================================= */}

//             <aside className="lg:sticky lg:top-6">
//               <div className="overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-lg shadow-[#075c35]/10">
//                 <div className="bg-gradient-to-br from-[#06472a] to-[#0b7040] px-6 py-4 text-white">
//                   <h2 className="text-lg font-extrabold">Order summary</h2>

//                   <p className="text-xs text-green-100">
//                     Weight and quantity are included in the total.
//                   </p>
//                 </div>

//                 <div className="space-y-4 p-6">
//                   {/* FREE DELIVERY BAR */}

//                   <div className="rounded-2xl bg-[#f1f8ed] p-4">
//                     <div className="flex items-center gap-2 text-sm font-bold text-[#075c35]">
//                       <FaTruck />

//                       {remainingForFree > 0
//                         ? `Add ₹${formatPrice(remainingForFree)} more for free delivery`
//                         : "You've unlocked free delivery!"}
//                     </div>

//                     <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#dbe8d7]">
//                       <motion.div
//                         className="h-full rounded-full bg-gradient-to-r from-[#158447] to-[#9bdd45]"
//                         initial={false}
//                         animate={{
//                           width: `${freeProgress}%`,
//                         }}
//                         transition={{
//                           duration: 0.5,
//                           ease: "easeOut",
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {/* LINES */}

//                   <div className="space-y-2.5 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-[#718579]">Items</span>

//                       <span className="font-bold text-[#083f26]">
//                         {itemCount}
//                       </span>
//                     </div>

//                     <div className="flex justify-between">
//                       <span className="text-[#718579]">Subtotal</span>

//                       <span className="font-bold text-[#083f26]">
//                         ₹{formatPrice(totalAmount)}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex items-end justify-between border-t border-dashed border-[#d3e3cf] pt-4">
//                     <span className="text-base font-extrabold text-[#083f26]">
//                       Total
//                     </span>

//                     <motion.span
//                       key={totalAmount}
//                       initial={{ scale: 0.92, opacity: 0.6 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       className="text-3xl font-extrabold text-[#075c35]"
//                     >
//                       ₹{formatPrice(totalAmount)}
//                     </motion.span>
//                   </div>

//                   {/* PLACE ORDER */}

//                   <button
//                     type="button"
//                     onClick={handlePlaceOrder}
//                     className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] py-3.5 text-base font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
//                   >
//                     Checkout
//                     <FaArrowRight />
//                   </button>

//                   {/* WHATSAPP ORDER */}

//                   <button
//                     type="button"
//                     onClick={handleOrderNow}
//                     className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#075c35] bg-white py-3 text-sm font-bold text-[#075c35] transition duration-200 hover:bg-[#f1f8ed]"
//                   >
//                     <FaWhatsapp className="text-lg text-[#25d366]" />
//                     Order Via WhatsApp
//                   </button>

//                   <p className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#9aa99f]">
//                     <FaLock />
//                     Secure checkout · Protected payments
//                   </p>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         )}

//         {/* =====================================================
//             WISHLIST
//         ===================================================== */}

//         {wishlist.items.length > 0 && (
//           <section className="mt-12">
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="flex items-center gap-2 text-xl font-extrabold text-[#083f26]">
//                 <FaHeart className="text-red-500" />
//                 Saved in your wishlist
//                 <span className="rounded-full bg-[#eaf5e5] px-2.5 py-0.5 text-xs font-bold text-[#075c35]">
//                   {wishlist.count}
//                 </span>
//               </h2>
//             </div>

//             <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5">
//               {wishlist.items.map((item, index) => {
//                 const inCart = cartIds.has(String(item.id));

//                 return (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, y: 14 }}
//                     animate={{
//                       opacity: 1,
//                       y: 0,
//                       transition: {
//                         delay: Math.min(index, 7) * 0.05,
//                       },
//                     }}
//                     className="group flex flex-col overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#075c35]/10"
//                   >
//                     <div className="relative h-32 overflow-hidden sm:h-40">
//                       <Thumb
//                         src={item.image}
//                         alt={item.name}
//                         className="h-full w-full transition-transform duration-500 group-hover:scale-105"
//                       />

//                       <button
//                         type="button"
//                         onClick={() => wishlist.remove(item.id)}
//                         aria-label="Remove from wishlist"
//                         className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-red-500 shadow-md transition hover:scale-110"
//                       >
//                         <FaHeart />
//                       </button>
//                     </div>

//                     <div className="flex flex-1 flex-col p-3 sm:p-4">
//                       {item.category && (
//                         <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#158447]">
//                           {item.category}
//                         </span>
//                       )}

//                       <h3 className="truncate text-sm font-extrabold text-[#083f26] sm:text-base">
//                         {item.name}
//                       </h3>

//                       <p className="mt-1 text-lg font-extrabold text-[#075c35]">
//                         ₹{formatPrice(item.price)}
//                         <span className="ml-1 text-xs font-semibold text-[#718579]">
//                           / KG
//                         </span>
//                       </p>

//                       <button
//                         type="button"
//                         disabled={inCart}
//                         onClick={() => addWishlistItemToCart(item)}
//                         className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-extrabold transition ${
//                           inCart
//                             ? "cursor-default bg-[#eaf5e5] text-[#158447]"
//                             : "bg-gradient-to-r from-[#075c35] to-[#158447] text-white shadow-md shadow-[#075c35]/25 hover:shadow-lg"
//                         }`}
//                       >
//                         {inCart ? (
//                           <>
//                             <FaCheck /> In cart
//                           </>
//                         ) : (
//                           <>
//                             <FaShoppingCart /> Add to Cart
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </section>
//         )}
//       </main>

//       <Footer />

//       {/* =========================================================
//           WHATSAPP ADDRESS FORM MODAL
//       ========================================================= */}

//       <AnimatePresence>
//         {showAddressForm && (
//           <motion.div
//             className="fixed inset-0 z-[10050] bg-[#083f26]/70 backdrop-blur-sm flex justify-center items-center px-4 py-6"
//             initial={{
//               opacity: 0,
//             }}
//             animate={{
//               opacity: 1,
//             }}
//             exit={{
//               opacity: 0,
//             }}
//           >
//             <motion.div
//               className="bg-white border border-[#dbe8d7] rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
//               initial={{
//                 scale: 0.95,
//                 opacity: 0,
//                 y: 20,
//               }}
//               animate={{
//                 scale: 1,
//                 opacity: 1,
//                 y: 0,
//               }}
//               exit={{
//                 scale: 0.95,
//                 opacity: 0,
//                 y: 20,
//               }}
//             >
//               <div className="mb-5">
//                 <h2 className="text-2xl font-extrabold text-[#075c35]">
//                   Enter Delivery Address
//                 </h2>

//                 <p className="text-sm text-[#718579] mt-1">
//                   Enter your delivery details to continue with WhatsApp
//                   ordering.
//                 </p>
//               </div>

//               {/* ADDRESS FORM */}

//               {["fullName", "houseNo", "street", "city", "phone"].map(
//                 (field) => (
//                   <div key={field} className="mb-4">
//                     <input
//                       type={field === "phone" ? "tel" : "text"}
//                       placeholder={
//                         field === "fullName"
//                           ? "Full Name"
//                           : field === "houseNo"
//                             ? "House No"
//                             : field === "street"
//                               ? "Street"
//                               : field === "city"
//                                 ? "City"
//                                 : "Phone Number"
//                       }
//                       value={address[field]}
//                       onChange={(e) => {
//                         setAddress({
//                           ...address,
//                           [field]:
//                             field === "phone"
//                               ? e.target.value.replace(/\D/g, "").slice(0, 10)
//                               : e.target.value,
//                         });

//                         if (errors?.[field]) {
//                           setErrors((prev) => ({
//                             ...prev,
//                             [field]: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full px-4 py-3 border rounded-xl bg-white text-[#083f26] placeholder-[#9aa99f] focus:outline-none focus:ring-2 focus:ring-[#158447] transition ${
//                         errors?.[field]
//                           ? "border-red-500"
//                           : "border-[#dbe8d7] focus:border-[#158447]"
//                       }`}
//                     />

//                     {errors?.[field] && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors[field]}
//                       </p>
//                     )}
//                   </div>
//                 ),
//               )}

//               {/* BUTTONS */}

//               <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddressForm(false)}
//                   className="px-5 py-3 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-xl font-medium transition"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   onClick={validateAndSubmit}
//                   className="px-5 py-3 bg-[#075c35] hover:bg-[#0b7040] text-white rounded-xl font-semibold transition"
//                 >
//                   Continue to WhatsApp
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* =========================================================
//           WHATSAPP SUCCESS MODAL
//       ========================================================= */}

//       <AnimatePresence>
//         {showSuccess && (
//           <motion.div
//             className="fixed inset-0 z-[10050] bg-[#083f26]/70 backdrop-blur-sm flex justify-center items-center px-4 py-6"
//             initial={{
//               opacity: 0,
//             }}
//             animate={{
//               opacity: 1,
//             }}
//             exit={{
//               opacity: 0,
//             }}
//           >
//             <motion.div
//               className="bg-white border border-[#dbe8d7] rounded-3xl p-7 shadow-2xl max-w-md w-full text-center"
//               initial={{
//                 scale: 0.95,
//                 opacity: 0,
//               }}
//               animate={{
//                 scale: 1,
//                 opacity: 1,
//               }}
//               exit={{
//                 scale: 0.95,
//                 opacity: 0,
//               }}
//             >
//               <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#eaf5e5] flex items-center justify-center text-4xl">
//                 ✅
//               </div>

//               <h2 className="text-2xl font-extrabold mb-3 text-[#075c35]">
//                 Order Placed!
//               </h2>

//               <p className="text-[#718579] mb-6">
//                 Your order has been placed successfully. We’ll contact you soon.
//               </p>

//               {pendingOrder && (
//                 <div className="mb-5 rounded-xl bg-[#f7fbf4] border border-[#dbe8d7] p-4 text-left">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[#718579]">Items</span>

//                     <span className="font-semibold text-[#083f26]">
//                       {pendingOrder.items.length}
//                     </span>
//                   </div>

//                   <div className="flex justify-between text-sm mt-2">
//                     <span className="text-[#718579]">Total</span>

//                     <span className="font-bold text-[#158447]">
//                       ₹{formatPrice(pendingOrder.total)}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="button"
//                 onClick={handleSuccessOk}
//                 disabled={saving}
//                 className="w-full px-6 py-3 bg-[#075c35] hover:bg-[#0b7040] disabled:bg-[#9aa99f] text-white rounded-xl font-semibold transition"
//               >
//                 {saving ? "Saving..." : "OK"}
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Cart;

// src/pages/Cart.jsx

//second design

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import CheckoutStepper from "../components/CheckoutStepper";

import { useCart } from "../context/CartContext";

import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaCheck,
  FaLeaf,
  FaLock,
  FaTruck,
  FaHeart,
  FaShoppingBasket,
  FaShoppingCart,
  FaWhatsapp,
  FaArrowRight,
  FaArrowLeft,
  FaSignInAlt,
  FaTimes,
} from "react-icons/fa";

import {
  WEIGHT_OPTIONS,
  formatWeight,
  formatPrice,
  loadWeights,
  saveWeight,
  removeWeight,
  clearWeights,
  useWishlist,
} from "../utils/shop";

// Orders above this amount get free delivery (same offer as the home page)
const FREE_DELIVERY_MIN = 1000;

const getItemImage = (item) => item.image || item.imageUrl || item.img || "";

// =========================================================
// PRODUCT THUMBNAIL (with fallback)
// =========================================================

function Thumb({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-[#eaf5e5] to-[#d6ecce] text-[#158447] ${className}`}
      >
        <FaLeaf className="text-xl opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

function Cart() {
  const navigate = useNavigate();

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, user } =
    useCart();

  const wishlist = useWishlist();

  // =========================================================
  // MODAL STATES
  // =========================================================

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [saving, setSaving] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  // =========================================================
  // WEIGHT STATE
  //
  // Each cart item has its own weight.
  // The weight chosen on the Products page is remembered in
  // localStorage, so it is picked up here automatically.
  // Default = 1 KG
  // =========================================================

  const [itemWeights, setItemWeights] = useState(() => {
    const saved = loadWeights();

    const initialWeights = {};

    cart.forEach((item) => {
      initialWeights[item.id] =
        Number(saved[String(item.id)]) || Number(item.weight) || 1;
    });

    return initialWeights;
  });

  // =========================================================
  // KEEP WEIGHTS IN SYNC WITH CART
  // =========================================================

  useEffect(() => {
    setItemWeights((previous) => {
      const saved = loadWeights();

      const updated = { ...previous };

      cart.forEach((item) => {
        if (!updated[item.id]) {
          updated[item.id] =
            Number(saved[String(item.id)]) || Number(item.weight) || 1;
        }
      });

      return updated;
    });
  }, [cart]);

  // =========================================================
  // UPDATE WEIGHT
  // =========================================================

  const updateWeight = (itemId, weight) => {
    const value = Number(weight);

    setItemWeights((previous) => ({
      ...previous,
      [itemId]: value,
    }));

    saveWeight(itemId, value);
  };

  // =========================================================
  // GET ITEM WEIGHT
  // =========================================================

  const getItemWeight = (item) => {
    return Number(itemWeights[item.id] || item.weight || 1);
  };

  // =========================================================
  // GET SINGLE ITEM TOTAL
  //
  // item.price = price for 1 KG
  //
  // Example:
  // price = ₹200
  // weight = 0.5
  // quantity = 2
  //
  // total = 200 × 0.5 × 2
  //       = ₹200
  // =========================================================

  const getItemTotal = (item) => {
    const weight = getItemWeight(item);
    const quantity = item.quantity || 1;

    return Number(item.price || 0) * weight * quantity;
  };

  // =========================================================
  // TOTAL AMOUNT
  // =========================================================

  const totalAmount = cart.reduce((sum, item) => {
    return sum + getItemTotal(item);
  }, 0);

  // =========================================================
  // TOTAL QUANTITY
  // =========================================================

  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // free delivery progress
  const remainingForFree = Math.max(FREE_DELIVERY_MIN - totalAmount, 0);

  const freeProgress = Math.min(totalAmount / FREE_DELIVERY_MIN, 1) * 100;

  // =========================================================
  // LOCK BACKGROUND SCROLL
  //
  // This works for:
  // WhatsApp address popup
  // Success popup
  // Login-required popup
  // =========================================================

  const modalOpen = showAddressForm || showSuccess || showLoginPrompt;

  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    // Prevent small layout jump caused by scrollbar disappearing
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [modalOpen]);

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    removeWeight(itemId);
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCartSafe = () => {
    if (typeof clearCart === "function") {
      clearCart();
    } else {
      cart.forEach((item) => {
        removeFromCart(item.id);
      });
    }

    clearWeights();
  };

  // =========================================================
  // WISHLIST -> CART
  // =========================================================

  const cartIds = new Set(cart.map((item) => String(item.id)));

  const addWishlistItemToCart = (item) => {
    saveWeight(item.id, 1);

    addToCart({
      ...item,
      weight: 1,
    });
  };

  // =========================================================
  // WHATSAPP ADDRESS
  // =========================================================

  const [address, setAddress] = useState({
    fullName: "",
    houseNo: "",
    street: "",
    city: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // =========================================================
  // WHATSAPP ADDRESS VALIDATION
  // =========================================================

  const validateAndSubmit = () => {
    const newErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!address.houseNo.trim()) {
      newErrors.houseNo = "House No is required";
    }

    if (!address.street.trim()) {
      newErrors.street = "Street is required";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!/^\d{10}$/.test(address.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      placeOrderWithAddress();
    }
  };

  // =========================================================
  // WHATSAPP ORDER
  // =========================================================

  const handleOrderNow = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setShowAddressForm(true);
  };

  // =========================================================
  // CREATE WHATSAPP ORDER
  // =========================================================

  const placeOrderWithAddress = () => {
    if (
      !address.fullName ||
      !address.houseNo ||
      !address.street ||
      !address.city ||
      !address.phone
    ) {
      alert("Please fill all address fields!");
      return;
    }

    const snapshot = {
      id: Date.now().toString(),

      items: cart.map((item) => {
        const weight = getItemWeight(item);
        const quantity = item.quantity || 1;
        const unitPrice = Number(item.price || 0);

        return {
          ...item,

          weight,
          weightLabel: formatWeight(weight),

          quantity,

          unitPrice,

          amount: unitPrice * weight * quantity,
        };
      }),

      total: totalAmount,

      placedAt: new Date().toISOString(),

      address: {
        ...address,
      },
    };

    // =======================================================
    // WHATSAPP MESSAGE
    // =======================================================

    let message = "🛒 Order Details:\n\n";

    snapshot.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;

      message += `   Weight: ${item.weightLabel}\n`;

      message += `   Quantity: ${item.quantity}\n`;

      message += `   Price: ₹${formatPrice(item.unitPrice)}/KG\n`;

      message += `   Amount: ₹${formatPrice(item.amount)}\n\n`;
    });

    message += `💰 Total Amount: ₹${formatPrice(snapshot.total)}`;

    message += `\n\n👤 Name: ${address.fullName}`;

    message += `\n🏠 House No: ${address.houseNo}`;

    message += `\n📍 Address: ${address.street}, ${address.city}`;

    message += `\n📞 Phone: ${address.phone}`;

    message += "\n\nPlease confirm my order. ✅";

    const encodedMessage = encodeURIComponent(message);

    const whatsappLink = `https://wa.me/918825875206?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");

    setPendingOrder(snapshot);

    setShowAddressForm(false);

    setShowSuccess(true);
  };

  // =========================================================
  // SAVE WHATSAPP ORDER
  // =========================================================

  const handleSuccessOk = async () => {
    if (!pendingOrder || !user) {
      setShowSuccess(false);
      return;
    }

    setSaving(true);

    try {
      const ordersRef = doc(db, "orders", user.uid);

      const docSnap = await getDoc(ordersRef);

      if (docSnap.exists()) {
        await updateDoc(ordersRef, {
          data: arrayUnion(pendingOrder),
        });
      } else {
        await setDoc(ordersRef, {
          data: [pendingOrder],
        });
      }

      clearCartSafe();

      setPendingOrder(null);

      setShowSuccess(false);

      setAddress({
        fullName: "",
        houseNo: "",
        street: "",
        city: "",
        phone: "",
      });

      setErrors({});
    } catch (err) {
      console.error("Error saving order:", err);

      alert("Failed to save order.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CHECKOUT
  //
  // Opens the full Checkout page (shipping + payment).
  // The KG chosen for every item is already saved in
  // localStorage, so the Checkout page picks it up.
  //
  // If the user is not logged in, a popup is shown instead of
  // silently blocking them, with a direct path to the login page.
  // =========================================================

  const handlePlaceOrder = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    navigate("/checkout");
  };

  // =========================================================
  // LOGIN PROMPT ACTIONS
  // =========================================================

  const handleGoToLogin = () => {
    setShowLoginPrompt(false);

    // Pass the intended destination so the login page can redirect
    // back to checkout once the user signs in.
    navigate("/login", { state: { redirectTo: "/checkout" } });
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7fbf4] flex flex-col text-[#083f26] relative overflow-x-hidden">
      <Navbar />

      {/* =====================================================
          HEADER BAND
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#9bdd45]/15 blur-2xl" />

        <div className="relative mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 py-9 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <FaShoppingBasket />
              Your basket
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Shopping <span className="text-[#c8f26b]">Cart</span>
            </h1>

            <p className="mt-2 text-sm text-green-100">
              Select your preferred weight and quantity.
            </p>
          </motion.div>

          {cart.length > 0 && (
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-medium text-green-100">
                {itemCount} item{itemCount !== 1 ? "s" : ""} · Total
              </p>

              <p className="text-2xl font-extrabold">
                ₹{formatPrice(totalAmount)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CART SECTION
      ===================================================== */}

      <main className="page-content mx-auto w-full max-w-[1400px] flex-grow px-4 py-8 sm:px-6 lg:px-10">
        {/* STEPPER */}

        <CheckoutStepper current={1} />

        {/* =====================================================
            WISHLIST — compact horizontal strip
            Moved up from the bottom of the page so it's visible
            without scrolling past the whole cart, and kept as a
            single scrollable row instead of a tall grid.
        ===================================================== */}

        {wishlist.items.length > 0 && (
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#083f26] sm:text-base">
                <FaHeart className="text-red-500" />
                Saved in your wishlist
                <span className="rounded-full bg-[#eaf5e5] px-2.5 py-0.5 text-[11px] font-bold text-[#075c35]">
                  {wishlist.count}
                </span>
              </h2>
            </div>

            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {wishlist.items.map((item) => {
                const inCart = cartIds.has(String(item.id));

                return (
                  <div
                    key={item.id}
                    className="group relative flex w-[150px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#dbe8d7] bg-white shadow-sm transition duration-300 hover:shadow-md hover:shadow-[#075c35]/10 sm:w-[170px]"
                  >
                    <div className="relative h-24 overflow-hidden sm:h-28">
                      <Thumb
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                      />

                      <button
                        type="button"
                        onClick={() => wishlist.remove(item.id)}
                        aria-label="Remove from wishlist"
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-xs text-red-500 shadow-md transition hover:scale-110"
                      >
                        <FaHeart />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col p-2.5">
                      <h3 className="truncate text-xs font-extrabold text-[#083f26] sm:text-sm">
                        {item.name}
                      </h3>

                      <p className="mt-0.5 text-sm font-extrabold text-[#075c35]">
                        ₹{formatPrice(item.price)}
                        <span className="ml-1 text-[10px] font-semibold text-[#718579]">
                          / KG
                        </span>
                      </p>

                      <button
                        type="button"
                        disabled={inCart}
                        onClick={() => addWishlistItemToCart(item)}
                        className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-extrabold transition ${
                          inCart
                            ? "cursor-default bg-[#eaf5e5] text-[#158447]"
                            : "bg-gradient-to-r from-[#075c35] to-[#158447] text-white shadow-sm shadow-[#075c35]/25 hover:shadow-md"
                        }`}
                      >
                        {inCart ? (
                          <>
                            <FaCheck /> In cart
                          </>
                        ) : (
                          <>
                            <FaShoppingCart /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {cart.length === 0 ? (
          /* =================================================
              EMPTY CART
          ================================================= */

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-3xl border border-dashed border-[#c9dcc4] bg-white px-6 py-16 text-center"
          >
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#eaf5e5] text-4xl text-[#158447]">
              <FaShoppingBasket />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-[#083f26]">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-[#718579]">
              Looks like you haven't added anything yet. Fresh fruits and
              vegetables are waiting for you.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition hover:-translate-y-0.5"
            >
              Browse products
              <FaArrowRight />
            </button>
          </motion.div>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_390px]">
            {/* =================================================
                ITEMS
            ================================================= */}

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#083f26]">
                  Selected items
                  <span className="ml-2 rounded-full bg-[#eaf5e5] px-2.5 py-0.5 text-xs font-bold text-[#075c35]">
                    {cart.length}
                  </span>
                </h2>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#075c35] hover:underline"
                >
                  <FaArrowLeft className="text-xs" />
                  Continue shopping
                </button>
              </div>

              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {cart.map((item) => {
                    const weight = getItemWeight(item);

                    const quantity = item.quantity || 1;

                    const itemTotal = getItemTotal(item);

                    return (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{
                          opacity: 0,
                          y: 24,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: -40,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                        className="group rounded-3xl border border-[#dbe8d7] bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-[#075c35]/10 sm:p-5"
                      >
                        <div className="flex gap-4">
                          {/* IMAGE */}

                          <Thumb
                            src={getItemImage(item)}
                            alt={item.name}
                            className="h-24 w-24 shrink-0 rounded-2xl border border-[#dbe8d7] sm:h-28 sm:w-28"
                          />

                          <div className="flex min-w-0 flex-1 flex-col">
                            {/* NAME + REMOVE */}

                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-base font-extrabold text-[#083f26] sm:text-lg">
                                  {item.name}
                                </h3>

                                <p className="mt-0.5 text-xs text-[#718579]">
                                  ₹{formatPrice(item.price)} per KG
                                </p>

                                {item.category && (
                                  <span className="mt-1.5 inline-block rounded-full bg-[#eaf5e5] px-2.5 py-0.5 text-[10px] font-extrabold capitalize text-[#158447]">
                                    {item.category}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemove(item.id)}
                                aria-label={`Remove ${item.name}`}
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-sm text-red-500 transition hover:bg-red-500 hover:text-white"
                              >
                                <FaTrash />
                              </button>
                            </div>

                            {/* CONTROLS + AMOUNT */}

                            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                              <div className="flex flex-wrap items-end gap-4">
                                {/* WEIGHT */}

                                <label className="block">
                                  <span className="mb-1 block text-[11px] font-bold text-[#718579]">
                                    Weight
                                  </span>

                                  <select
                                    value={weight}
                                    onChange={(e) =>
                                      updateWeight(item.id, e.target.value)
                                    }
                                    className="min-w-[105px] cursor-pointer rounded-xl border border-[#dbe8d7] bg-[#fbfdf9] px-3 py-2.5 text-sm font-bold text-[#075c35] outline-none transition focus:border-[#158447] focus:ring-4 focus:ring-[#158447]/15"
                                  >
                                    {WEIGHT_OPTIONS.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </label>

                                {/* QUANTITY */}

                                <div>
                                  <span className="mb-1 block text-[11px] font-bold text-[#718579]">
                                    Quantity
                                  </span>

                                  <div className="flex items-center rounded-xl bg-[#eaf5e5] p-1 ring-1 ring-[#bcd6b6]">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          Math.max(1, quantity - 1),
                                        )
                                      }
                                      disabled={quantity <= 1}
                                      aria-label="Decrease quantity"
                                      className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#075c35] shadow-sm transition hover:bg-[#f7fbf4] disabled:opacity-40"
                                    >
                                      <FaMinus className="text-[10px]" />
                                    </button>

                                    <span className="w-9 text-center text-sm font-extrabold text-[#06472a]">
                                      {quantity}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(item.id, quantity + 1)
                                      }
                                      aria-label="Increase quantity"
                                      className="grid h-8 w-8 place-items-center rounded-lg bg-[#075c35] text-white transition hover:bg-[#0b7040]"
                                    >
                                      <FaPlus className="text-[10px]" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* AMOUNT */}

                              <div className="text-right">
                                <motion.p
                                  key={itemTotal}
                                  initial={{ scale: 0.92, opacity: 0.6 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="text-xl font-extrabold text-[#075c35]"
                                >
                                  ₹{formatPrice(itemTotal)}
                                </motion.p>

                                <p className="text-[11px] text-[#718579]">
                                  {formatWeight(weight)} × {quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <aside className="lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-lg shadow-[#075c35]/10">
                <div className="bg-gradient-to-br from-[#06472a] to-[#0b7040] px-6 py-4 text-white">
                  <h2 className="text-lg font-extrabold">Order summary</h2>

                  <p className="text-xs text-green-100">
                    Weight and quantity are included in the total.
                  </p>
                </div>

                <div className="space-y-4 p-6">
                  {/* FREE DELIVERY BAR */}

                  <div className="rounded-2xl bg-[#f1f8ed] p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#075c35]">
                      <FaTruck />

                      {remainingForFree > 0
                        ? `Add ₹${formatPrice(remainingForFree)} more for free delivery`
                        : "You've unlocked free delivery!"}
                    </div>

                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#dbe8d7]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#158447] to-[#9bdd45]"
                        initial={false}
                        animate={{
                          width: `${freeProgress}%`,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>

                  {/* LINES */}

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#718579]">Items</span>

                      <span className="font-bold text-[#083f26]">
                        {itemCount}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#718579]">Subtotal</span>

                      <span className="font-bold text-[#083f26]">
                        ₹{formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-dashed border-[#d3e3cf] pt-4">
                    <span className="text-base font-extrabold text-[#083f26]">
                      Total
                    </span>

                    <motion.span
                      key={totalAmount}
                      initial={{ scale: 0.92, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-extrabold text-[#075c35]"
                    >
                      ₹{formatPrice(totalAmount)}
                    </motion.span>
                  </div>

                  {/* PLACE ORDER */}

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] py-3.5 text-base font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Checkout
                    <FaArrowRight />
                  </button>

                  {/* WHATSAPP ORDER */}

                  <button
                    type="button"
                    onClick={handleOrderNow}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#075c35] bg-white py-3 text-sm font-bold text-[#075c35] transition duration-200 hover:bg-[#f1f8ed]"
                  >
                    <FaWhatsapp className="text-lg text-[#25d366]" />
                    Order Via WhatsApp
                  </button>

                  <p className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#9aa99f]">
                    <FaLock />
                    Secure checkout · Protected payments
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />

      {/* =========================================================
          WHATSAPP ADDRESS FORM MODAL
      ========================================================= */}

      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            className="fixed inset-0 z-[10050] bg-[#083f26]/70 backdrop-blur-sm flex justify-center items-center px-4 py-6"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <motion.div
              className="bg-white border border-[#dbe8d7] rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
            >
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-[#075c35]">
                  Enter Delivery Address
                </h2>

                <p className="text-sm text-[#718579] mt-1">
                  Enter your delivery details to continue with WhatsApp
                  ordering.
                </p>
              </div>

              {/* ADDRESS FORM */}

              {["fullName", "houseNo", "street", "city", "phone"].map(
                (field) => (
                  <div key={field} className="mb-4">
                    <input
                      type={field === "phone" ? "tel" : "text"}
                      placeholder={
                        field === "fullName"
                          ? "Full Name"
                          : field === "houseNo"
                            ? "House No"
                            : field === "street"
                              ? "Street"
                              : field === "city"
                                ? "City"
                                : "Phone Number"
                      }
                      value={address[field]}
                      onChange={(e) => {
                        setAddress({
                          ...address,
                          [field]:
                            field === "phone"
                              ? e.target.value.replace(/\D/g, "").slice(0, 10)
                              : e.target.value,
                        });

                        if (errors?.[field]) {
                          setErrors((prev) => ({
                            ...prev,
                            [field]: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl bg-white text-[#083f26] placeholder-[#9aa99f] focus:outline-none focus:ring-2 focus:ring-[#158447] transition ${
                        errors?.[field]
                          ? "border-red-500"
                          : "border-[#dbe8d7] focus:border-[#158447]"
                      }`}
                    />

                    {errors?.[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ),
              )}

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-5 py-3 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-xl font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={validateAndSubmit}
                  className="px-5 py-3 bg-[#075c35] hover:bg-[#0b7040] text-white rounded-xl font-semibold transition"
                >
                  Continue to WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          WHATSAPP SUCCESS MODAL
      ========================================================= */}

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-[10050] bg-[#083f26]/70 backdrop-blur-sm flex justify-center items-center px-4 py-6"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <motion.div
              className="bg-white border border-[#dbe8d7] rounded-3xl p-7 shadow-2xl max-w-md w-full text-center"
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#eaf5e5] flex items-center justify-center text-4xl">
                ✅
              </div>

              <h2 className="text-2xl font-extrabold mb-3 text-[#075c35]">
                Order Placed!
              </h2>

              <p className="text-[#718579] mb-6">
                Your order has been placed successfully. We’ll contact you soon.
              </p>

              {pendingOrder && (
                <div className="mb-5 rounded-xl bg-[#f7fbf4] border border-[#dbe8d7] p-4 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#718579]">Items</span>

                    <span className="font-semibold text-[#083f26]">
                      {pendingOrder.items.length}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-[#718579]">Total</span>

                    <span className="font-bold text-[#158447]">
                      ₹{formatPrice(pendingOrder.total)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSuccessOk}
                disabled={saving}
                className="w-full px-6 py-3 bg-[#075c35] hover:bg-[#0b7040] disabled:bg-[#9aa99f] text-white rounded-xl font-semibold transition"
              >
                {saving ? "Saving..." : "OK"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          LOGIN REQUIRED MODAL
          Shown when a guest clicks "Checkout". Gives them a clear
          Cancel / Login choice instead of a plain browser alert.
      ========================================================= */}

      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="fixed inset-0 z-[10050] bg-[#083f26]/70 backdrop-blur-sm flex justify-center items-center px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              className="relative bg-white border border-[#dbe8d7] rounded-3xl p-7 shadow-2xl max-w-sm w-full text-center"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#9aa99f] transition hover:bg-[#eaf5e5] hover:text-[#075c35]"
              >
                <FaTimes />
              </button>

              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#eaf5e5] flex items-center justify-center text-3xl text-[#158447]">
                <FaSignInAlt />
              </div>

              <h2 className="text-xl font-extrabold mb-2 text-[#075c35]">
                Please log in to continue
              </h2>

              <p className="text-sm text-[#718579] mb-6">
                You need to be logged in to checkout. Log in to continue with
                your order, or cancel and keep browsing.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 px-5 py-3 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-xl font-bold transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleGoToLogin}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#075c35] hover:bg-[#0b7040] text-white rounded-xl font-bold transition"
                >
                  <FaSignInAlt className="text-sm" />
                  Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Cart;
