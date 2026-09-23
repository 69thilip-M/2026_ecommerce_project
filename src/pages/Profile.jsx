// import { useEffect, useState, useRef } from "react";

// import { getAuth, updateProfile } from "firebase/auth";

// import { db } from "../firebase";

// import { doc, getDoc } from "firebase/firestore";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// function Profile() {
//   const [user, setUser] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const [orders, setOrders] = useState([]);

//   // =========================
//   // GET NAME FROM EMAIL
//   // =========================

//   const getNameFromEmail = (email) => {
//     if (!email) return "No Name";

//     let namePart = email.split("@")[0];

//     namePart = namePart.replace(/[0-9]/g, "");

//     return (
//       namePart.charAt(0).toUpperCase() +
//       namePart.slice(1)
//     );
//   };

//   // =========================
//   // PROFILE IMAGE CLICK
//   // =========================

//   const handleImageClick = () => {
//     if (!uploading) {
//       fileInputRef.current?.click();
//     }
//   };

//   // =========================
//   // IMAGE UPLOAD
//   // =========================

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];

//     if (!file || !user) return;

//     const data = new FormData();

//     data.append("file", file);
//     data.append("upload_preset", "profileImage");

//     try {
//       setUploading(true);

//       const res = await fetch(
//         "https://api.cloudinary.com/v1_1/dvtx9vyr9/image/upload",
//         {
//           method: "POST",
//           body: data,
//         }
//       );

//       const uploadedImage = await res.json();

//       if (uploadedImage.secure_url) {
//         const photoURL = uploadedImage.secure_url;

//         const auth = getAuth();

//         await updateProfile(auth.currentUser, {
//           photoURL: photoURL,
//         });

//         setUser({
//           ...user,
//           photoURL: photoURL,
//         });

//         alert("✅ Profile picture updated!");
//       } else {
//         throw new Error(
//           uploadedImage.error?.message ||
//             "Image upload failed"
//         );
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);

//       alert(
//         "Failed to upload image: " + error.message
//       );
//     } finally {
//       setUploading(false);

//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     }
//   };

//   // =========================
//   // AUTH LISTENER
//   // =========================

//   useEffect(() => {
//     const auth = getAuth();

//     const unsubscribe = auth.onAuthStateChanged(
//       (currentUser) => {
//         if (currentUser) {
//           setUser(currentUser);
//         } else {
//           setUser(null);
//         }
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // =========================
//   // FETCH ORDERS
//   // =========================

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user) return;

//       try {
//         const ordersRef = doc(
//           db,
//           "orders",
//           user.uid
//         );

//         const ordersSnap = await getDoc(ordersRef);

//         if (ordersSnap.exists()) {
//           const userOrders =
//             ordersSnap.data().data || [];

//           userOrders.sort(
//             (a, b) =>
//               new Date(b.placedAt) -
//               new Date(a.placedAt)
//           );

//           setOrders(userOrders);
//         } else {
//           setOrders([]);
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching orders:",
//           error
//         );
//       }
//     };

//     fetchOrders();
//   }, [user]);

//   // =========================
//   // NOT LOGGED IN
//   // =========================

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7fbf4] px-4">
//         <div className="w-full max-w-md rounded-3xl border border-[#dbe8d7] bg-white p-8 text-center shadow-lg">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf5e5]">
//             <span className="text-3xl">🌿</span>
//           </div>

//           <h2 className="text-2xl font-bold text-[#083f26]">
//             Login Required
//           </h2>

//           <p className="mt-2 text-[#718579]">
//             Please log in to view your profile.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const displayName =
//     user.displayName ||
//     getNameFromEmail(user.email);

//   return (
//     <div className="min-h-screen flex flex-col bg-[#f7fbf4] text-[#083f26]">
//       <Navbar />

//       <main className="flex-grow px-3 py-6 sm:px-6 lg:px-8">
//         <div className="mx-auto w-full max-w-6xl">

//           {/* =========================
//               PAGE HEADER
//           ========================= */}

//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-semibold text-[#075c35]">
//                 KMR FRESH
//               </p>

//               <h1 className="mt-1 text-3xl font-extrabold text-[#083f26]">
//                 My Profile
//               </h1>

//               <p className="mt-1 text-sm text-[#718579]">
//                 Manage your account and view your orders
//               </p>
//             </div>

//             <div className="hidden rounded-2xl bg-[#eaf5e5] px-5 py-3 text-center sm:block">
//               <p className="text-xs text-[#718579]">
//                 Total Orders
//               </p>

//               <p className="text-2xl font-extrabold text-[#075c35]">
//                 {orders.length}
//               </p>
//             </div>
//           </div>

//           {/* =========================
//               PROFILE HERO
//           ========================= */}

//           <section className="relative mb-6 overflow-hidden rounded-3xl bg-[#075c35] shadow-xl">

//             {/* Background Decoration */}

//             <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

//             <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/5" />

//             <div className="relative p-6 sm:p-8">

//               <div className="flex flex-col items-center gap-6 sm:flex-row">

//                 {/* PROFILE IMAGE */}

//                 <div className="relative shrink-0">

//                   <div
//                     onClick={handleImageClick}
//                     className={`group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/80 shadow-2xl sm:h-36 sm:w-36 ${
//                       uploading
//                         ? "cursor-wait"
//                         : "cursor-pointer"
//                     }`}
//                   >
//                     <img
//                       src={
//                         user.photoURL ||
//                         "https://dummyimage.com/150x150/cccccc/000000&text=Profile"
//                       }
//                       alt="Profile"
//                       className={`h-full w-full object-cover transition duration-300 group-hover:scale-110 ${
//                         uploading
//                           ? "opacity-40"
//                           : "opacity-100"
//                       }`}
//                     />

//                     {!uploading && (
//                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#083f26]/0 text-white opacity-0 transition-all duration-300 group-hover:bg-[#083f26]/70 group-hover:opacity-100">
//                         <span className="text-2xl">
//                           📷
//                         </span>

//                         <span className="mt-1 text-xs font-bold">
//                           Change Photo
//                         </span>
//                       </div>
//                     )}

//                     {uploading && (
//                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#083f26]/80 text-white">
//                         <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />

//                         <span className="text-xs font-bold">
//                           Uploading...
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* CAMERA BUTTON */}

//                   {!uploading && (
//                     <div className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#075c35] bg-white shadow-lg">
//                       <span className="text-lg">
//                         📷
//                       </span>
//                     </div>
//                   )}

//                   <input
//                     type="file"
//                     accept="image/*"
//                     ref={fileInputRef}
//                     className="hidden"
//                     onChange={handleFileChange}
//                   />
//                 </div>

//                 {/* USER INFORMATION */}

//                 <div className="flex-1 text-center sm:text-left">

//                   <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
//                     <span className="h-2 w-2 rounded-full bg-[#c8f26b]" />
//                     Active Account
//                   </div>

//                   <h2 className="text-3xl font-extrabold text-white">
//                     {displayName}
//                   </h2>

//                   <p className="mt-2 text-sm text-green-100">
//                     {user.email}
//                   </p>

//                   <p className="mt-3 max-w-xl text-sm leading-6 text-green-100">
//                     Welcome back! Manage your account
//                     information and keep track of your
//                     KMR Fresh orders here.
//                   </p>
//                 </div>

//                 {/* VERIFIED */}

//                 <div className="hidden rounded-2xl bg-white/10 px-6 py-5 text-center sm:block">
//                   <div className="text-3xl">
//                     ✓
//                   </div>

//                   <p className="mt-1 text-xs text-green-100">
//                     Account
//                   </p>

//                   <p className="font-bold text-white">
//                     Verified
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* =========================
//               MAIN GRID
//           ========================= */}

//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

//             {/* =========================
//                 ACCOUNT DETAILS
//             ========================= */}

//             <section className="rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-lg lg:col-span-2 sm:p-6">

//               <div className="mb-5 flex items-center gap-3 border-b border-[#dbe8d7] pb-4">

//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5e5] text-xl">
//                   👤
//                 </div>

//                 <div>
//                   <h3 className="text-xl font-bold text-[#083f26]">
//                     Account Details
//                   </h3>

//                   <p className="text-xs text-[#718579]">
//                     Your account information
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//                 {/* EMAIL */}

//                 <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md">

//                   <div className="mb-2 flex items-center gap-2">
//                     <span className="text-lg">
//                       ✉️
//                     </span>

//                     <span className="text-xs font-bold uppercase tracking-wide text-[#718579]">
//                       Email
//                     </span>
//                   </div>

//                   <p className="break-all text-sm font-semibold text-[#083f26]">
//                     {user.email}
//                   </p>
//                 </div>

//                 {/* PROVIDER */}

//                 <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md">

//                   <div className="mb-2 flex items-center gap-2">
//                     <span className="text-lg">
//                       🔐
//                     </span>

//                     <span className="text-xs font-bold uppercase tracking-wide text-[#718579]">
//                       Provider
//                     </span>
//                   </div>

//                   <p className="text-sm font-semibold capitalize text-[#083f26]">
//                     {user.providerData[0]?.providerId ||
//                       "Unknown"}
//                   </p>
//                 </div>

//                 {/* FIRST LOGIN */}

//                 <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md">

//                   <div className="mb-2 flex items-center gap-2">
//                     <span className="text-lg">
//                       📅
//                     </span>

//                     <span className="text-xs font-bold uppercase tracking-wide text-[#718579]">
//                       First Login
//                     </span>
//                   </div>

//                   <p className="text-sm font-semibold text-[#083f26]">
//                     {user.metadata.creationTime
//                       ? new Date(
//                           user.metadata.creationTime
//                         ).toLocaleString()
//                       : "Not available"}
//                   </p>
//                 </div>

//                 {/* LAST LOGIN */}

//                 <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md">

//                   <div className="mb-2 flex items-center gap-2">
//                     <span className="text-lg">
//                       🕐
//                     </span>

//                     <span className="text-xs font-bold uppercase tracking-wide text-[#718579]">
//                       Last Login
//                     </span>
//                   </div>

//                   <p className="text-sm font-semibold text-[#083f26]">
//                     {user.metadata.lastSignInTime
//                       ? new Date(
//                           user.metadata.lastSignInTime
//                         ).toLocaleString()
//                       : "Not available"}
//                   </p>
//                 </div>
//               </div>
//             </section>

//             {/* =========================
//                 ORDER SUMMARY
//             ========================= */}

//             <section className="relative overflow-hidden rounded-3xl bg-[#083f26] p-6 text-white shadow-lg">

//               <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5" />

//               <div className="relative">

//                 <div className="mb-6 flex items-center gap-3">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
//                     🛍️
//                   </div>

//                   <div>
//                     <p className="text-xs text-green-100">
//                       Shopping Activity
//                     </p>

//                     <h3 className="text-lg font-bold">
//                       Order Summary
//                     </h3>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl bg-white/10 p-5">

//                   <p className="text-sm text-green-100">
//                     Total Orders
//                   </p>

//                   <p className="mt-1 text-5xl font-extrabold">
//                     {orders.length}
//                   </p>

//                   <div className="my-5 h-px bg-white/10" />

//                   <div className="flex items-center gap-3">

//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8f26b] text-xl">
//                       🚚
//                     </div>

//                     <div>
//                       <p className="font-bold">
//                         Fresh Delivery
//                       </p>

//                       <p className="text-xs text-green-100">
//                         Your orders are tracked here
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 rounded-2xl border border-white/10 p-4">
//                   <p className="text-xs text-green-100">
//                     KMR Fresh
//                   </p>

//                   <p className="mt-1 text-sm font-semibold">
//                     Fresh products, delivered to you 🌿
//                   </p>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* =========================
//               ORDERS
//           ========================= */}

//           <section className="mt-6 rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-lg sm:p-6">

//             {/* HEADER */}

//             <div className="mb-6 flex flex-col gap-3 border-b border-[#dbe8d7] pb-5 sm:flex-row sm:items-center sm:justify-between">

//               <div className="flex items-center gap-3">

//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf5e5] text-2xl">
//                   📦
//                 </div>

//                 <div>
//                   <h3 className="text-2xl font-extrabold text-[#083f26]">
//                     Your Orders
//                   </h3>

//                   <p className="text-sm text-[#718579]">
//                     Your recent KMR Fresh purchases
//                   </p>
//                 </div>
//               </div>

//               <div className="w-fit rounded-full bg-[#eaf5e5] px-4 py-2 text-xs font-bold text-[#075c35]">
//                 {orders.length}{" "}
//                 {orders.length === 1
//                   ? "Order"
//                   : "Orders"}
//               </div>
//             </div>

//             {/* NO ORDERS */}

//             {orders.length === 0 ? (
//               <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbdcc7] bg-[#f7fbf4] px-5 py-14 text-center">

//                 <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5e5] text-4xl">
//                   🛍️
//                 </div>

//                 <h4 className="text-lg font-bold text-[#083f26]">
//                   No orders yet
//                 </h4>

//                 <p className="mt-2 max-w-md text-sm text-[#718579]">
//                   You haven't placed any orders yet.
//                   Your purchases will appear here once
//                   you place an order.
//                 </p>
//               </div>
//             ) : (

//               <div className="space-y-5">

//                 {orders.map((order) => (

//                   <div
//                     key={order.id}
//                     className="overflow-hidden rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
//                   >

//                     {/* ORDER HEADER */}

//                     <div className="flex flex-col gap-4 border-b border-[#dbe8d7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

//                       <div>
//                         <div className="flex items-center gap-2">

//                           <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf5e5]">
//                             📦
//                           </span>

//                           <p className="text-lg font-bold text-[#083f26]">
//                             Order #{order.id}
//                           </p>
//                         </div>

//                         <p className="mt-2 text-xs text-[#718579]">
//                           Placed on{" "}
//                           {order.placedAt
//                             ? new Date(
//                                 order.placedAt
//                               ).toLocaleString()
//                             : "Date unavailable"}
//                         </p>
//                       </div>

//                       <div className="rounded-xl bg-[#eaf5e5] px-4 py-3 sm:text-right">

//                         <p className="text-xs text-[#718579]">
//                           Order Total
//                         </p>

//                         <p className="text-xl font-extrabold text-[#075c35]">
//                           ₹
//                           {Number(
//                             order.total || 0
//                           ).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>

//                     {/* ORDER ITEMS */}

//                     <div className="p-4 sm:p-5">

//                       <div className="mb-4 flex items-center justify-between">

//                         <p className="text-xs font-bold uppercase tracking-wider text-[#718579]">
//                           Order Items
//                         </p>

//                         <p className="text-xs font-semibold text-[#075c35]">
//                           {order.items?.length || 0}{" "}
//                           {order.items?.length === 1
//                             ? "Item"
//                             : "Items"}
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

//                         {order.items?.map(
//                           (item, idx) => {

//                             const quantity =
//                               item.quantity || 1;

//                             const itemTotal =
//                               Number(
//                                 item.price || 0
//                               ) * quantity;

//                             return (
//                               <div
//                                 key={idx}
//                                 className="flex items-center gap-4 rounded-2xl border border-[#dbe8d7] bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
//                               >

//                                 {/* PRODUCT IMAGE */}

//                                 <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eaf5e5]">

//                                   <img
//                                     src={item.image}
//                                     alt={item.name}
//                                     className="h-full w-full object-cover transition duration-300 hover:scale-105"
//                                   />

//                                 </div>

//                                 {/* PRODUCT DETAILS */}

//                                 <div className="min-w-0 flex-1">

//                                   <p className="truncate text-base font-bold text-[#083f26]">
//                                     {item.name}
//                                   </p>

//                                   <p className="mt-1 text-sm text-[#52665b]">
//                                     Qty:{" "}
//                                     <span className="font-semibold text-[#083f26]">
//                                       {quantity}
//                                     </span>
//                                   </p>

//                                   <p className="mt-2 text-base font-extrabold text-[#075c35]">
//                                     ₹
//                                     {itemTotal.toFixed(
//                                       2
//                                     )}
//                                   </p>
//                                 </div>
//                               </div>
//                             );
//                           }
//                         )}

//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default Profile;

//second design

// import { useEffect, useRef, useState } from "react";
// import { getAuth, updateProfile } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { useCart } from "../context/CartContext";
// import { db } from "../firebase";
// import { useWishlist } from "../utils/shop";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// import {
//   FaUser,
//   FaBoxOpen,
//   FaHeart,
//   FaMapMarkerAlt,
//   FaCog,
//   FaSignOutAlt,
//   FaCamera,
//   FaCheck,
//   FaTruck,
//   FaBox,
//   FaClock,
//   FaShoppingCart,
//   FaTrash,
//   FaArrowRight,
//   FaLeaf,
//   FaCalendarAlt,
//   FaEnvelope,
//   FaShieldAlt,
//   FaChevronRight,
//   FaTimes,
//   FaReceipt,
// } from "react-icons/fa";

// /* =========================================================
//    HELPERS
// ========================================================= */

// const formatPrice = (value) => {
//   return Number(value || 0).toLocaleString("en-IN", {
//     maximumFractionDigits: 2,
//   });
// };

// const getItemImage = (item) => {
//   return item?.image || item?.imageUrl || item?.img || "";
// };

// const getNameFromEmail = (email) => {
//   if (!email) return "No Name";

//   let namePart = email.split("@")[0];

//   namePart = namePart.replace(/[0-9]/g, "");

//   if (!namePart) return "User";

//   return namePart.charAt(0).toUpperCase() + namePart.slice(1);
// };

// /* =========================================================
//    ORDER STATUS
// ========================================================= */

// const ORDER_STEPS = [
//   {
//     key: "placed",
//     label: "Placed",
//     icon: FaReceipt,
//   },
//   {
//     key: "confirmed",
//     label: "Confirmed",
//     icon: FaCheck,
//   },
//   {
//     key: "packed",
//     label: "Packed",
//     icon: FaBox,
//   },
//   {
//     key: "out_for_delivery",
//     label: "Out for Delivery",
//     icon: FaTruck,
//   },
//   {
//     key: "delivered",
//     label: "Delivered",
//     icon: FaCheck,
//   },
// ];

// const normalizeStatus = (status) => {
//   if (!status) return "placed";

//   const value = String(status)
//     .toLowerCase()
//     .trim()
//     .replace(/-/g, "_")
//     .replace(/\s+/g, "_");

//   if (value === "processing" || value === "pending" || value === "placed") {
//     return "placed";
//   }

//   if (value === "confirmed" || value === "accepted") {
//     return "confirmed";
//   }

//   if (value === "packed" || value === "packing") {
//     return "packed";
//   }

//   if (
//     value === "shipped" ||
//     value === "out_for_delivery" ||
//     value === "outfordelivery"
//   ) {
//     return "out_for_delivery";
//   }

//   if (value === "delivered" || value === "completed") {
//     return "delivered";
//   }

//   return "placed";
// };

// const getStatusIndex = (order) => {
//   const status =
//     order?.status || order?.trackingStatus || order?.deliveryStatus || "placed";

//   const normalized = normalizeStatus(status);

//   return ORDER_STEPS.findIndex((step) => step.key === normalized);
// };

// /* =========================================================
//    TRACKING TIMELINE
// ========================================================= */

// function TrackingTimeline({ order }) {
//   const currentIndex = getStatusIndex(order);

//   return (
//     <div className="mt-6 overflow-x-auto pb-2">
//       <div className="min-w-[650px]">
//         <div className="relative flex items-start justify-between">
//           {/* CONNECTING LINE */}

//           <div className="absolute left-[10%] right-[10%] top-5 h-1 rounded-full bg-[#dce8d9]" />

//           <div
//             className="absolute left-[10%] top-5 h-1 rounded-full bg-gradient-to-r from-[#075c35] to-[#9bdd45] transition-all duration-500"
//             style={{
//               width:
//                 currentIndex <= 0
//                   ? "0%"
//                   : `${(currentIndex / (ORDER_STEPS.length - 1)) * 80}%`,
//             }}
//           />

//           {ORDER_STEPS.map((step, index) => {
//             const Icon = step.icon;

//             const completed = index <= currentIndex;
//             const active = index === currentIndex;

//             return (
//               <div
//                 key={step.key}
//                 className="relative z-10 flex w-[20%] flex-col items-center text-center"
//               >
//                 <div
//                   className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-md transition-all duration-300 ${
//                     completed
//                       ? "bg-[#075c35] text-white"
//                       : "bg-[#e3ebe1] text-[#9aa99f]"
//                   } ${active ? "ring-4 ring-[#9bdd45]/30" : ""}`}
//                 >
//                   <Icon className="text-sm" />
//                 </div>

//                 <p
//                   className={`mt-3 text-xs font-bold ${
//                     completed ? "text-[#075c35]" : "text-[#9aa99f]"
//                   }`}
//                 >
//                   {step.label}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    ORDER CARD
// ========================================================= */

// function OrderCard({ order, onTrack }) {
//   const items = order?.items || [];

//   const firstItem = items[0];

//   const itemCount = items.reduce(
//     (total, item) => total + Number(item?.quantity || 1),
//     0,
//   );

//   const total = Number(order?.total || 0);

//   const statusIndex = getStatusIndex(order);

//   const currentStatus = ORDER_STEPS[statusIndex]?.label || "Placed";

//   return (
//     <div className="group overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#075c35]/10">
//       {/* =====================================================
//           ORDER TOP
//       ===================================================== */}

//       <div className="border-b border-[#e5eee2] p-5 sm:p-6">
//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//           {/* LEFT */}

//           <div className="flex min-w-0 items-center gap-4">
//             <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#dbe8d7] bg-[#eaf5e5]">
//               {getItemImage(firstItem) ? (
//                 <img
//                   src={getItemImage(firstItem)}
//                   alt={firstItem?.name || "Product"}
//                   className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//                 />
//               ) : (
//                 <div className="flex h-full w-full items-center justify-center text-2xl text-[#158447]">
//                   <FaLeaf />
//                 </div>
//               )}
//             </div>

//             <div className="min-w-0">
//               <div className="flex flex-wrap items-center gap-2">
//                 <h4 className="text-base font-extrabold text-[#083f26] sm:text-lg">
//                   Order #{order?.id || "N/A"}
//                 </h4>

//                 <span className="rounded-full bg-[#eaf5e5] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#075c35]">
//                   {currentStatus}
//                 </span>
//               </div>

//               <p className="mt-1 text-xs font-medium text-[#718579]">
//                 {order?.placedAt
//                   ? new Date(order.placedAt).toLocaleString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })
//                   : "Date unavailable"}
//               </p>

//               <p className="mt-1 text-xs font-semibold text-[#52665b]">
//                 {itemCount} item
//                 {itemCount !== 1 ? "s" : ""}
//               </p>
//             </div>
//           </div>

//           {/* RIGHT */}

//           <div className="flex items-center justify-between gap-4 lg:justify-end">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
//                 Total Amount
//               </p>

//               <p className="mt-1 text-xl font-extrabold text-[#075c35]">
//                 ₹{formatPrice(total)}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => onTrack(order)}
//               className="inline-flex items-center gap-2 rounded-xl border border-[#b9d8b2] bg-white px-4 py-2.5 text-xs font-extrabold text-[#075c35] transition hover:bg-[#eaf5e5]"
//             >
//               Track Order
//               <FaChevronRight className="text-[10px]" />
//             </button>
//           </div>
//         </div>

//         {/* TRACKING */}

//         <TrackingTimeline order={order} />
//       </div>

//       {/* =====================================================
//           ORDER ITEMS
//       ===================================================== */}

//       <div className="bg-[#f9fcf7] px-5 py-4 sm:px-6">
//         <div className="flex items-center justify-between">
//           <p className="text-xs font-extrabold uppercase tracking-wider text-[#718579]">
//             Order Items
//           </p>

//           <p className="text-xs font-bold text-[#075c35]">
//             {items.length} product
//             {items.length !== 1 ? "s" : ""}
//           </p>
//         </div>

//         <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
//           {items.slice(0, 5).map((item, index) => (
//             <div
//               key={`${item?.id || index}-${index}`}
//               className="flex min-w-[180px] items-center gap-3 rounded-xl border border-[#dbe8d7] bg-white p-2.5"
//             >
//               <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#eaf5e5]">
//                 {getItemImage(item) ? (
//                   <img
//                     src={getItemImage(item)}
//                     alt={item?.name || "Product"}
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-full items-center justify-center text-[#158447]">
//                     <FaLeaf />
//                   </div>
//                 )}
//               </div>

//               <div className="min-w-0">
//                 <p className="truncate text-xs font-bold text-[#083f26]">
//                   {item?.name || "Product"}
//                 </p>

//                 <p className="mt-0.5 text-[11px] text-[#718579]">
//                   Qty: {item?.quantity || 1}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {items.length > 5 && (
//             <div className="flex min-w-[70px] items-center justify-center rounded-xl border border-dashed border-[#cbdcc7] bg-[#f7fbf4] text-xs font-bold text-[#075c35]">
//               +{items.length - 5}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    PROFILE PAGE
// ========================================================= */

// function Profile() {
//   const [user, setUser] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [activeSection, setActiveSection] = useState("orders");

//   const fileInputRef = useRef(null);

//   const { cart, addToCart } = useCart();
//   const wishlist = useWishlist();

//   /* =========================================================
//      AUTH
//   ========================================================= */

//   useEffect(() => {
//     const auth = getAuth();

//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       setUser(currentUser || null);
//     });

//     return () => unsubscribe();
//   }, []);

//   /* =========================================================
//      FETCH ORDERS
//   ========================================================= */

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user) return;

//       try {
//         const ordersRef = doc(db, "orders", user.uid);

//         const ordersSnap = await getDoc(ordersRef);

//         if (ordersSnap.exists()) {
//           const userOrders = ordersSnap.data().data || [];

//           userOrders.sort(
//             (a, b) => new Date(b?.placedAt || 0) - new Date(a?.placedAt || 0),
//           );

//           setOrders(userOrders);
//         } else {
//           setOrders([]);
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);

//         setOrders([]);
//       }
//     };

//     fetchOrders();
//   }, [user]);

//   /* =========================================================
//      PROFILE IMAGE
//   ========================================================= */

//   const handleImageClick = () => {
//     if (!uploading) {
//       fileInputRef.current?.click();
//     }
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];

//     if (!file || !user) return;

//     const data = new FormData();

//     data.append("file", file);
//     data.append("upload_preset", "profileImage");

//     try {
//       setUploading(true);

//       const res = await fetch(
//         "https://api.cloudinary.com/v1_1/dvtx9vyr9/image/upload",
//         {
//           method: "POST",
//           body: data,
//         },
//       );

//       const uploadedImage = await res.json();

//       if (!uploadedImage.secure_url) {
//         throw new Error(uploadedImage.error?.message || "Image upload failed");
//       }

//       const photoURL = uploadedImage.secure_url;

//       const auth = getAuth();

//       await updateProfile(auth.currentUser, {
//         photoURL,
//       });

//       setUser({
//         ...user,
//         photoURL,
//       });

//       alert("✅ Profile picture updated!");
//     } catch (error) {
//       console.error("Upload failed:", error);

//       alert("Failed to upload image: " + error.message);
//     } finally {
//       setUploading(false);

//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     }
//   };

//   /* =========================================================
//      WISHLIST -> CART
//   ========================================================= */

//   const addWishlistItemToCart = (item) => {
//     if (!item) return;

//     addToCart({
//       ...item,
//       weight: 1,
//     });
//   };

//   /* =========================================================
//      REMOVE WISHLIST
//   ========================================================= */

//   const removeWishlistItem = (id) => {
//     wishlist.remove(id);
//   };

//   /* =========================================================
//      LOGOUT
//   ========================================================= */

//   const handleLogout = async () => {
//     try {
//       const auth = getAuth();

//       await auth.signOut();

//       window.location.href = "/login";
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   /* =========================================================
//      NAVIGATION
//   ========================================================= */

//   const scrollToSection = (section) => {
//     setActiveSection(section);

//     const element = document.getElementById(section);

//     if (element) {
//       element.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   /* =========================================================
//      NOT LOGGED IN
//   ========================================================= */

//   if (!user) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#f7fbf4] px-4">
//         <div className="w-full max-w-md rounded-3xl border border-[#dbe8d7] bg-white p-8 text-center shadow-xl">
//           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5e5] text-3xl text-[#158447]">
//             <FaLeaf />
//           </div>

//           <h2 className="mt-5 text-2xl font-extrabold text-[#083f26]">
//             Login Required
//           </h2>

//           <p className="mt-2 text-sm text-[#718579]">
//             Please log in to view your KMR Fresh profile.
//           </p>

//           <button
//             type="button"
//             onClick={() => (window.location.href = "/login")}
//             className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#075c35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0b7040]"
//           >
//             Go to Login
//             <FaArrowRight />
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* =========================================================
//      USER DATA
//   ========================================================= */

//   const displayName = user.displayName || getNameFromEmail(user.email);

//   const totalWishlist = wishlist?.count || wishlist?.items?.length || 0;

//   const totalCartItems = cart.reduce(
//     (total, item) => total + Number(item?.quantity || 1),
//     0,
//   );

//   const deliveredOrders = orders.filter(
//     (order) =>
//       normalizeStatus(
//         order?.status || order?.trackingStatus || order?.deliveryStatus,
//       ) === "delivered",
//   ).length;

//   return (
//     <div className="min-h-screen bg-[#f7fbf4] text-[#083f26]">
//       <Navbar />

//       {/* =====================================================
//           MAIN DASHBOARD
//       ===================================================== */}

//       <main className="mx-auto flex w-full max-w-[1500px] gap-6 px-3 py-5 sm:px-5 lg:px-7">
//         {/* ===================================================
//             LEFT SIDEBAR
//         =================================================== */}

//         <aside className="hidden w-[250px] shrink-0 lg:block">
//           <div className="sticky top-5 overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-sm">
//             {/* PROFILE MINI */}
//             <div className="border-b border-[#e5eee2] px-5 py-7 text-center">
//               <div className="relative mx-auto h-24 w-24">
//                 <button
//                   type="button"
//                   onClick={handleImageClick}
//                   className="group relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#dbe8d7]"
//                 >
//                   <img
//                     src={
//                       user.photoURL ||
//                       "https://dummyimage.com/150x150/cccccc/000000&text=Profile"
//                     }
//                     alt="Profile"
//                     className={`h-full w-full object-cover transition duration-300 group-hover:scale-110 ${
//                       uploading ? "opacity-40" : ""
//                     }`}
//                   />

//                   {!uploading && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-[#083f26]/0 text-white opacity-0 transition-all group-hover:bg-[#083f26]/70 group-hover:opacity-100">
//                       <FaCamera />
//                     </div>
//                   )}

//                   {uploading && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-[#083f26]/80">
//                       <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                     </div>
//                   )}
//                 </button>

//                 <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#075c35] text-xs text-white">
//                   <FaCamera />
//                 </span>
//               </div>

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />

//               <h2 className="mt-4 text-lg font-extrabold text-[#083f26]">
//                 {displayName}
//               </h2>

//               <p className="mt-1 truncate text-xs text-[#718579]">
//                 {user.email}
//               </p>

//               <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#eaf5e5] px-3 py-1 text-[10px] font-extrabold text-[#075c35]">
//                 <span className="h-1.5 w-1.5 rounded-full bg-[#158447]" />
//                 Active Account
//               </div>
//             </div>

//             {/* MENU */}
//             <nav className="p-3">
//               <button
//                 type="button"
//                 onClick={() => scrollToSection("account-details")}
//                 className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
//                   activeSection === "account"
//                     ? "bg-[#075c35] text-white"
//                     : "text-[#234f38] hover:bg-[#eaf5e5]"
//                 }`}
//               >
//                 <FaUser />
//                 Account Details
//               </button>

//               <button
//                 type="button"
//                 onClick={() => scrollToSection("orders")}
//                 className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
//                   activeSection === "orders"
//                     ? "bg-[#075c35] text-white shadow-md"
//                     : "text-[#234f38] hover:bg-[#eaf5e5]"
//                 }`}
//               >
//                 <FaBoxOpen />
//                 <span className="flex-1">Order History & Tracking</span>
//                 <FaChevronRight className="text-xs" />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => scrollToSection("wishlist")}
//                 className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
//                   activeSection === "wishlist"
//                     ? "bg-[#075c35] text-white shadow-md"
//                     : "text-[#234f38] hover:bg-[#eaf5e5]"
//                 }`}
//               >
//                 <FaHeart />
//                 Wishlist
//                 <span className="ml-auto rounded-full bg-[#eaf5e5] px-2 py-0.5 text-[10px] text-[#075c35]">
//                   {totalWishlist}
//                 </span>
//               </button>

//               <div className="my-3 border-t border-[#e5eee2]" />

//               <button
//                 type="button"
//                 className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#234f38] transition hover:bg-[#eaf5e5]"
//               >
//                 <FaMapMarkerAlt />
//                 Address Book
//               </button>

//               <button
//                 type="button"
//                 className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#234f38] transition hover:bg-[#eaf5e5]"
//               >
//                 <FaCog />
//                 Settings
//               </button>

//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
//               >
//                 <FaSignOutAlt />
//                 Log Out
//               </button>
//             </nav>

//             {/* SIDEBAR BANNER */}
//             <div className="m-4 overflow-hidden rounded-2xl border border-[#cfe5c9] bg-gradient-to-br from-[#f4faef] to-[#e7f3e2] p-4">
//               <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#158447] shadow-sm">
//                 <FaLeaf />
//               </div>

//               <h4 className="mt-3 text-sm font-extrabold text-[#075c35]">
//                 Fresh Food
//                 <br />
//                 Better Life
//               </h4>

//               <p className="mt-2 text-[11px] leading-5 text-[#718579]">
//                 Healthy choices for a brighter tomorrow.
//               </p>

//               <div className="mt-3 text-3xl">🥬🍅🥕</div>
//             </div>
//           </div>
//         </aside>

//         {/* ===================================================
//             RIGHT CONTENT
//         =================================================== */}

//         <div className="min-w-0 flex-1">
//           {/* =================================================
//               WELCOME HERO
//           ================================================= */}

//           <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#dbe8d7] bg-gradient-to-br from-[#fbfdf9] via-[#eef7eb] to-[#dff0d7] p-6 shadow-sm sm:p-8">
//             {/* DECORATION */}

//             <div className="pointer-events-none absolute -right-16 -top-20 text-[170px] opacity-10">
//               🌿
//             </div>

//             <div className="pointer-events-none absolute -bottom-16 right-40 text-[100px] opacity-10">
//               🍃
//             </div>

//             <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
//               <div>
//                 <p className="text-sm font-bold text-[#158447]">
//                   Welcome back,
//                 </p>

//                 <h1 className="mt-1 text-3xl font-black tracking-tight text-[#083f26] sm:text-5xl">
//                   {displayName}!
//                 </h1>

//                 <p className="mt-3 max-w-xl text-sm leading-6 text-[#637a6b]">
//                   Here's your account overview, recent activity, orders and
//                   saved products.
//                 </p>
//               </div>

//               {/* STATS */}

//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
//                 <div className="min-w-[125px] rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
//                   <FaBoxOpen className="text-lg text-[#158447]" />

//                   <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#718579]">
//                     Total Orders
//                   </p>

//                   <p className="mt-1 text-xl font-black text-[#083f26]">
//                     {orders.length}
//                   </p>
//                 </div>

//                 <div className="min-w-[125px] rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
//                   <FaHeart className="text-lg text-[#158447]" />

//                   <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#718579]">
//                     Wishlist
//                   </p>

//                   <p className="mt-1 text-xl font-black text-[#083f26]">
//                     {totalWishlist}
//                   </p>
//                 </div>

//                 <div className="min-w-[125px] rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
//                   <FaTruck className="text-lg text-[#158447]" />

//                   <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#718579]">
//                     Delivered
//                   </p>

//                   <p className="mt-1 text-xl font-black text-[#083f26]">
//                     {deliveredOrders}
//                   </p>
//                 </div>

//                 <div className="min-w-[125px] rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
//                   <FaShoppingCart className="text-lg text-[#158447]" />

//                   <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#718579]">
//                     Cart Items
//                   </p>

//                   <p className="mt-1 text-xl font-black text-[#083f26]">
//                     {totalCartItems}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* =================================================
//               ACCOUNT DETAILS
//           ================================================= */}

//           <section
//             id="account-details"
//             className="mb-6 scroll-mt-5 rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-sm sm:p-6"
//           >
//             <div className="mb-5 flex items-center gap-3 border-b border-[#e5eee2] pb-5">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5e5] text-[#158447]">
//                 <FaUser />
//               </div>

//               <div>
//                 <h2 className="text-xl font-extrabold text-[#083f26]">
//                   Account Details
//                 </h2>

//                 <p className="text-xs text-[#718579]">
//                   Your account information
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//               {/* EMAIL */}

//               <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition hover:-translate-y-1 hover:shadow-md">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#158447] shadow-sm">
//                   <FaEnvelope />
//                 </div>

//                 <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#718579]">
//                   Email
//                 </p>

//                 <p className="mt-1 break-all text-sm font-bold text-[#083f26]">
//                   {user.email}
//                 </p>
//               </div>

//               {/* PROVIDER */}

//               <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition hover:-translate-y-1 hover:shadow-md">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#158447] shadow-sm">
//                   <FaShieldAlt />
//                 </div>

//                 <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#718579]">
//                   Provider
//                 </p>

//                 <p className="mt-1 text-sm font-bold capitalize text-[#083f26]">
//                   {user.providerData?.[0]?.providerId || "Unknown"}
//                 </p>
//               </div>

//               {/* JOINED */}

//               <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition hover:-translate-y-1 hover:shadow-md">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#158447] shadow-sm">
//                   <FaCalendarAlt />
//                 </div>

//                 <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#718579]">
//                   Member Since
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-[#083f26]">
//                   {user.metadata?.creationTime
//                     ? new Date(user.metadata.creationTime).toLocaleDateString(
//                         "en-IN",
//                         {
//                           month: "short",
//                           year: "numeric",
//                         },
//                       )
//                     : "Not available"}
//                 </p>
//               </div>

//               {/* LAST LOGIN */}

//               <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition hover:-translate-y-1 hover:shadow-md">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#158447] shadow-sm">
//                   <FaClock />
//                 </div>

//                 <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#718579]">
//                   Last Login
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-[#083f26]">
//                   {user.metadata?.lastSignInTime
//                     ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
//                         "en-IN",
//                       )
//                     : "Not available"}
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* =================================================
//               ORDER HISTORY
//           ================================================= */}

//           <section
//             id="orders"
//             className="mb-6 scroll-mt-5 rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-sm sm:p-6"
//           >
//             {/* HEADER */}

//             <div className="mb-6 flex flex-col gap-4 border-b border-[#e5eee2] pb-5 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#075c35] text-xl text-white shadow-md shadow-[#075c35]/20">
//                   <FaBoxOpen />
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-extrabold text-[#083f26] sm:text-2xl">
//                     Order History & Tracking
//                   </h2>

//                   <p className="mt-1 text-xs text-[#718579] sm:text-sm">
//                     View and track your past orders.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="rounded-full bg-[#eaf5e5] px-4 py-2 text-xs font-extrabold text-[#075c35]">
//                   {orders.length} {orders.length === 1 ? "Order" : "Orders"}
//                 </span>
//               </div>
//             </div>

//             {/* NO ORDERS */}

//             {orders.length === 0 ? (
//               <div className="rounded-3xl border border-dashed border-[#cbdcc7] bg-[#f7fbf4] px-5 py-14 text-center">
//                 <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5e5] text-3xl text-[#158447]">
//                   <FaBoxOpen />
//                 </div>

//                 <h3 className="mt-5 text-xl font-extrabold text-[#083f26]">
//                   No orders yet
//                 </h3>

//                 <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718579]">
//                   You haven't placed any orders yet. Your KMR Fresh purchases
//                   will appear here.
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-5">
//                 {orders.map((order) => (
//                   <OrderCard
//                     key={order.id}
//                     order={order}
//                     onTrack={setSelectedOrder}
//                   />
//                 ))}
//               </div>
//             )}
//           </section>

//           {/* =================================================
//               WISHLIST
//           ================================================= */}

//           <section
//             id="wishlist"
//             className="mb-6 scroll-mt-5 rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-sm sm:p-6"
//           >
//             {/* HEADER */}

//             <div className="mb-6 flex flex-col gap-4 border-b border-[#e5eee2] pb-5 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#075c35] text-xl text-white shadow-md shadow-[#075c35]/20">
//                   <FaHeart />
//                 </div>

//                 <div>
//                   <h2 className="text-xl font-extrabold text-[#083f26] sm:text-2xl">
//                     Wishlist
//                   </h2>

//                   <p className="mt-1 text-xs text-[#718579] sm:text-sm">
//                     Save products for later.
//                   </p>
//                 </div>
//               </div>

//               <div className="rounded-full bg-[#eaf5e5] px-4 py-2 text-xs font-extrabold text-[#075c35]">
//                 {totalWishlist} Saved
//               </div>
//             </div>

//             {/* EMPTY WISHLIST */}

//             {wishlist.items.length === 0 ? (
//               <div className="rounded-3xl border border-dashed border-[#cbdcc7] bg-[#f7fbf4] px-5 py-14 text-center">
//                 <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5e5] text-3xl text-[#158447]">
//                   <FaHeart />
//                 </div>

//                 <h3 className="mt-5 text-xl font-extrabold text-[#083f26]">
//                   Your wishlist is empty
//                 </h3>

//                 <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718579]">
//                   Save your favourite fresh products here and come back whenever
//                   you're ready.
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
//                 {wishlist.items.map((item) => {
//                   const isInCart = cart.some(
//                     (cartItem) => String(cartItem.id) === String(item.id),
//                   );

//                   return (
//                     <div
//                       key={item.id}
//                       className="group overflow-hidden rounded-2xl border border-[#dbe8d7] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#075c35]/10"
//                     >
//                       {/* IMAGE */}

//                       <div className="relative aspect-square overflow-hidden bg-[#f7fbf4] p-3">
//                         {getItemImage(item) ? (
//                           <img
//                             src={getItemImage(item)}
//                             alt={item.name}
//                             className="h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-105"
//                           />
//                         ) : (
//                           <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#eaf5e5] text-4xl text-[#158447]">
//                             <FaLeaf />
//                           </div>
//                         )}

//                         {/* HEART */}

//                         <button
//                           type="button"
//                           onClick={() => removeWishlistItem(item.id)}
//                           aria-label="Remove from wishlist"
//                           className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:scale-110"
//                         >
//                           <FaHeart className="text-sm" />
//                         </button>
//                       </div>

//                       {/* DETAILS */}

//                       <div className="p-3 sm:p-4">
//                         {item.category && (
//                           <p className="truncate text-[9px] font-extrabold uppercase tracking-widest text-[#158447]">
//                             {item.category}
//                           </p>
//                         )}

//                         <h3 className="mt-1 truncate text-sm font-extrabold text-[#083f26]">
//                           {item.name}
//                         </h3>

//                         <p className="mt-1 text-lg font-black text-[#075c35]">
//                           ₹{formatPrice(item.price)}
//                           <span className="ml-1 text-[10px] font-bold text-[#718579]">
//                             / KG
//                           </span>
//                         </p>

//                         <button
//                           type="button"
//                           disabled={isInCart}
//                           onClick={() => addWishlistItemToCart(item)}
//                           className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-extrabold transition ${
//                             isInCart
//                               ? "cursor-default bg-[#eaf5e5] text-[#158447]"
//                               : "bg-gradient-to-r from-[#075c35] to-[#158447] text-white shadow-md shadow-[#075c35]/20 hover:-translate-y-0.5 hover:shadow-lg"
//                           }`}
//                         >
//                           {isInCart ? (
//                             <>
//                               <FaCheck />
//                               In Cart
//                             </>
//                           ) : (
//                             <>
//                               <FaShoppingCart />
//                               Add to Cart
//                             </>
//                           )}
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => removeWishlistItem(item.id)}
//                           className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e1ebe0] bg-white py-2 text-[11px] font-bold text-[#718579] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
//                         >
//                           <FaTrash className="text-[10px]" />
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </section>

//           {/* =================================================
//               BOTTOM BRAND MESSAGE
//           ================================================= */}

//           <div className="mb-6 flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#edf7e9] px-5 py-4 text-center sm:flex-row">
//             <FaLeaf className="text-[#158447]" />

//             <p className="text-xs font-bold text-[#52665b]">
//               Thank you for choosing KMR Fresh
//             </p>

//             <span className="hidden text-[#9bad9f] sm:block">•</span>

//             <p className="text-xs font-bold text-[#718579]">
//               Fresh • Healthy • Local
//             </p>
//           </div>
//         </div>
//       </main>

//       <Footer />

//       {/* =====================================================
//           TRACK ORDER MODAL
//       ===================================================== */}

//       {selectedOrder && (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-[#083f26]/70 px-4 py-6 backdrop-blur-sm"
//           onClick={() => setSelectedOrder(null)}
//         >
//           <div
//             className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* MODAL HEADER */}

//             <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e5eee2] bg-white px-5 py-5 sm:px-7">
//               <div>
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
//                   Order Tracking
//                 </p>

//                 <h3 className="mt-1 text-xl font-extrabold text-[#083f26]">
//                   #{selectedOrder.id}
//                 </h3>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setSelectedOrder(null)}
//                 className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f6ef] text-[#718579] transition hover:bg-red-50 hover:text-red-500"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             {/* MODAL BODY */}

//             <div className="p-5 sm:p-7">
//               <div className="rounded-2xl bg-gradient-to-br from-[#f1f8ed] to-[#e7f3e2] p-5">
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-xs font-bold text-[#718579]">
//                       Current Status
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-[#075c35]">
//                       {ORDER_STEPS[getStatusIndex(selectedOrder)]?.label}
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-white px-5 py-3 text-right shadow-sm">
//                     <p className="text-[10px] font-bold uppercase tracking-wide text-[#718579]">
//                       Order Total
//                     </p>

//                     <p className="text-xl font-black text-[#075c35]">
//                       ₹{formatPrice(selectedOrder.total)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <TrackingTimeline order={selectedOrder} />

//               {/* ORDER DATE */}

//               <div className="mt-7 grid gap-3 sm:grid-cols-2">
//                 <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4">
//                   <p className="text-[10px] font-bold uppercase tracking-wide text-[#718579]">
//                     Order Date
//                   </p>

//                   <p className="mt-1 text-sm font-bold text-[#083f26]">
//                     {selectedOrder.placedAt
//                       ? new Date(selectedOrder.placedAt).toLocaleString("en-IN")
//                       : "Not available"}
//                   </p>
//                 </div>

//                 <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4">
//                   <p className="text-[10px] font-bold uppercase tracking-wide text-[#718579]">
//                     Items
//                   </p>

//                   <p className="mt-1 text-sm font-bold text-[#083f26]">
//                     {selectedOrder.items?.length || 0} product
//                     {selectedOrder.items?.length !== 1 ? "s" : ""}
//                   </p>
//                 </div>
//               </div>

//               {/* PRODUCTS */}

//               <div className="mt-7">
//                 <h4 className="text-base font-extrabold text-[#083f26]">
//                   Order Items
//                 </h4>

//                 <div className="mt-3 space-y-3">
//                   {selectedOrder.items?.map((item, index) => (
//                     <div
//                       key={`${item.id || index}-${index}`}
//                       className="flex items-center gap-4 rounded-2xl border border-[#dbe8d7] p-3"
//                     >
//                       <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#eaf5e5]">
//                         {getItemImage(item) ? (
//                           <img
//                             src={getItemImage(item)}
//                             alt={item.name}
//                             className="h-full w-full object-cover"
//                           />
//                         ) : (
//                           <div className="flex h-full items-center justify-center text-[#158447]">
//                             <FaLeaf />
//                           </div>
//                         )}
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <p className="truncate text-sm font-extrabold text-[#083f26]">
//                           {item.name}
//                         </p>

//                         <p className="mt-1 text-xs text-[#718579]">
//                           Quantity: {item.quantity || 1}
//                         </p>
//                       </div>

//                       <p className="text-sm font-extrabold text-[#075c35]">
//                         ₹
//                         {formatPrice(
//                           item.amount ??
//                             Number(item.price || 0) *
//                               Number(item.quantity || 1),
//                         )}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;

//third design
import { useEffect, useRef, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { useWishlist } from "../utils/shop";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaCamera,
  FaCheck,
  FaTruck,
  FaBox,
  FaClock,
  FaShoppingCart,
  FaTrash,
  FaArrowRight,
  FaLeaf,
  FaCalendarAlt,
  FaEnvelope,
  FaShieldAlt,
  FaChevronRight,
  FaReceipt,
  FaCopy,
  FaTimes,
} from "react-icons/fa";

/* =========================================================
   HELPERS
========================================================= */

const formatPrice = (value) => {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const getItemImage = (item) => {
  return item?.image || item?.imageUrl || item?.img || "";
};

const getNameFromEmail = (email) => {
  if (!email) return "No Name";

  let namePart = email.split("@")[0];

  namePart = namePart.replace(/[0-9]/g, "");

  if (!namePart) return "User";

  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};

// Address saved on an order (from the WhatsApp / checkout flow)
// is rendered as a single readable line.
const getAddressText = (order) => {
  const address = order?.address;

  if (!address) return "Not available";

  const parts = [address.houseNo, address.street, address.city].filter(
    (part) => part && String(part).trim(),
  );

  return parts.length > 0 ? parts.join(", ") : "Not available";
};

// No live courier integration yet, so delivery is estimated as
// 2 days after the order was placed. Swap this out once real
// tracking data is available.
const getEstimatedDelivery = (placedAt) => {
  if (!placedAt) return "Not available";

  const placedDate = new Date(placedAt);

  if (Number.isNaN(placedDate.getTime())) return "Not available";

  const estimated = new Date(placedDate.getTime() + 2 * 24 * 60 * 60 * 1000);

  return estimated.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   ORDER STATUS
========================================================= */

const ORDER_STEPS = [
  {
    key: "placed",
    label: "Placed",
    icon: FaReceipt,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: FaCheck,
  },
  {
    key: "packed",
    label: "Packed",
    icon: FaBox,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    icon: FaTruck,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: FaCheck,
  },
];

const normalizeStatus = (status) => {
  if (!status) return "placed";

  const value = String(status)
    .toLowerCase()
    .trim()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");

  if (value === "processing" || value === "pending" || value === "placed") {
    return "placed";
  }

  if (value === "confirmed" || value === "accepted") {
    return "confirmed";
  }

  if (value === "packed" || value === "packing") {
    return "packed";
  }

  if (
    value === "shipped" ||
    value === "out_for_delivery" ||
    value === "outfordelivery"
  ) {
    return "out_for_delivery";
  }

  if (value === "delivered" || value === "completed") {
    return "delivered";
  }

  return "placed";
};

const getStatusIndex = (order) => {
  const status =
    order?.status || order?.trackingStatus || order?.deliveryStatus || "placed";

  const normalized = normalizeStatus(status);

  return ORDER_STEPS.findIndex((step) => step.key === normalized);
};

/* =========================================================
   TRACKING TIMELINE
========================================================= */

function TrackingTimeline({ order }) {
  const currentIndex = getStatusIndex(order);

  return (
    <div className="mt-6 overflow-x-auto pb-2">
      <div className="min-w-[650px]">
        <div className="relative flex items-start justify-between">
          {/* CONNECTING LINE */}

          <div className="absolute left-[10%] right-[10%] top-5 h-1 rounded-full bg-[#dce8d9]" />

          <div
            className="absolute left-[10%] top-5 h-1 rounded-full bg-gradient-to-r from-[#075c35] to-[#9bdd45] transition-all duration-500"
            style={{
              width:
                currentIndex <= 0
                  ? "0%"
                  : `${(currentIndex / (ORDER_STEPS.length - 1)) * 80}%`,
            }}
          />

          {ORDER_STEPS.map((step, index) => {
            const Icon = step.icon;

            const completed = index <= currentIndex;
            const active = index === currentIndex;

            return (
              <div
                key={step.key}
                className="relative z-10 flex w-[20%] flex-col items-center text-center"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-md transition-all duration-300 ${
                    completed
                      ? "bg-[#075c35] text-white"
                      : "bg-[#e3ebe1] text-[#9aa99f]"
                  } ${active ? "ring-4 ring-[#9bdd45]/30" : ""}`}
                >
                  <Icon className="text-sm" />
                </div>

                <p
                  className={`mt-3 text-xs font-bold ${
                    completed ? "text-[#075c35]" : "text-[#9aa99f]"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER CARD
========================================================= */

function OrderCard({ order, onTrack }) {
  const items = order?.items || [];

  const firstItem = items[0];

  const itemCount = items.reduce(
    (total, item) => total + Number(item?.quantity || 1),
    0,
  );

  const total = Number(order?.total || 0);

  const statusIndex = getStatusIndex(order);

  const currentStatus = ORDER_STEPS[statusIndex]?.label || "Placed";

  return (
    <div className="group overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#075c35]/10">
      {/* =====================================================
          ORDER TOP
      ===================================================== */}

      <div className="border-b border-[#e5eee2] p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#dbe8d7] bg-[#eaf5e5]">
              {getItemImage(firstItem) ? (
                <img
                  src={getItemImage(firstItem)}
                  alt={firstItem?.name || "Product"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl text-[#158447]">
                  <FaLeaf />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-extrabold text-[#083f26] sm:text-lg">
                  Order #{order?.id || "N/A"}
                </h4>

                <span className="rounded-full bg-[#eaf5e5] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#075c35]">
                  {currentStatus}
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-[#718579]">
                {order?.placedAt
                  ? new Date(order.placedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Date unavailable"}
              </p>

              <p className="mt-1 text-xs font-semibold text-[#52665b]">
                {itemCount} item
                {itemCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                Total Amount
              </p>

              <p className="mt-1 text-xl font-extrabold text-[#075c35]">
                ₹{formatPrice(total)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onTrack(order)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#b9d8b2] bg-white px-4 py-2.5 text-xs font-extrabold text-[#075c35] transition hover:bg-[#eaf5e5]"
            >
              Track Order
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ORDER ITEMS
      ===================================================== */}

      <div className="bg-[#f9fcf7] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#718579]">
            Order Items
          </p>

          <p className="text-xs font-bold text-[#075c35]">
            {items.length} product
            {items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.slice(0, 5).map((item, index) => (
            <div
              key={`${item?.id || index}-${index}`}
              className="flex min-w-[180px] items-center gap-3 rounded-xl border border-[#dbe8d7] bg-white p-2.5"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#eaf5e5]">
                {getItemImage(item) ? (
                  <img
                    src={getItemImage(item)}
                    alt={item?.name || "Product"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#158447]">
                    <FaLeaf />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#083f26]">
                  {item?.name || "Product"}
                </p>

                <p className="mt-0.5 text-[11px] text-[#718579]">
                  Qty: {item?.quantity || 1}
                </p>
              </div>
            </div>
          ))}

          {items.length > 5 && (
            <div className="flex min-w-[70px] items-center justify-center rounded-xl border border-dashed border-[#cbdcc7] bg-[#f7fbf4] text-xs font-bold text-[#075c35]">
              +{items.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE PAGE
========================================================= */

function Profile() {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeSection, setActiveSection] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const fileInputRef = useRef(null);

  const { cart, addToCart } = useCart();
  const wishlist = useWishlist();

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, []);

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const ordersRef = doc(db, "orders", user.uid);

        const ordersSnap = await getDoc(ordersRef);

        if (ordersSnap.exists()) {
          const userOrders = ordersSnap.data().data || [];

          userOrders.sort(
            (a, b) => new Date(b?.placedAt || 0) - new Date(a?.placedAt || 0),
          );

          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);

        setOrders([]);
      }
    };

    fetchOrders();
  }, [user]);

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  const handleImageClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "profileImage");

    try {
      setUploading(true);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvtx9vyr9/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const uploadedImage = await res.json();

      if (!uploadedImage.secure_url) {
        throw new Error(uploadedImage.error?.message || "Image upload failed");
      }

      const photoURL = uploadedImage.secure_url;

      const auth = getAuth();

      await updateProfile(auth.currentUser, {
        photoURL,
      });

      setUser({
        ...user,
        photoURL,
      });

      alert("✅ Profile picture updated!");
    } catch (error) {
      console.error("Upload failed:", error);

      alert("Failed to upload image: " + error.message);
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* =========================================================
     WISHLIST -> CART
  ========================================================= */

  const addWishlistItemToCart = (item) => {
    if (!item) return;

    addToCart({
      ...item,
      weight: 1,
    });
  };

  /* =========================================================
     REMOVE WISHLIST
  ========================================================= */

  const removeWishlistItem = (id) => {
    wishlist.remove(id);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      const auth = getAuth();

      await auth.signOut();

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* =========================================================
     COPY ORDER ID (used in the tracking popup)
  ========================================================= */

  const handleCopyOrderId = async (orderId) => {
    if (!orderId) return;

    try {
      await navigator.clipboard.writeText(String(orderId));

      setCopiedOrderId(true);

      setTimeout(() => setCopiedOrderId(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const scrollToSection = (section) => {
    setActiveSection(section);

    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =========================================================
     NOT LOGGED IN
  ========================================================= */

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf4] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#dbe8d7] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5e5] text-3xl text-[#158447]">
            <FaLeaf />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#083f26]">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-[#718579]">
            Please log in to view your KMR Fresh profile.
          </p>

          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#075c35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0b7040]"
          >
            Go to Login
            <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     USER DATA
  ========================================================= */

  const displayName = user.displayName || getNameFromEmail(user.email);

  const totalWishlist = wishlist?.count || wishlist?.items?.length || 0;

  const totalCartItems = cart.reduce(
    (total, item) => total + Number(item?.quantity || 1),
    0,
  );

  const deliveredOrders = orders.filter(
    (order) =>
      normalizeStatus(
        order?.status || order?.trackingStatus || order?.deliveryStatus,
      ) === "delivered",
  ).length;

  return (
    <div className="min-h-screen bg-[#f7fbf4] text-[#083f26]">
      <Navbar />

      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <main className="mx-auto flex w-full max-w-[1500px] gap-6 px-3 py-5 sm:px-5 lg:px-7">
        {/* ===================================================
            LEFT SIDEBAR
        =================================================== */}

        <aside className="hidden w-[250px] shrink-0 lg:block">
          <div className="sticky top-5 overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-sm">
            {/* PROFILE MINI */}
            <div className="border-b border-[#e5eee2] px-5 py-7 text-center">
              <div className="relative mx-auto h-24 w-24">
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="group relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#dbe8d7]"
                >
                  <img
                    src={
                      user.photoURL ||
                      "https://dummyimage.com/150x150/cccccc/000000&text=Profile"
                    }
                    alt="Profile"
                    className={`h-full w-full object-cover transition duration-300 group-hover:scale-110 ${
                      uploading ? "opacity-40" : ""
                    }`}
                  />

                  {!uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#083f26]/0 text-white opacity-0 transition-all group-hover:bg-[#083f26]/70 group-hover:opacity-100">
                      <FaCamera />
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#083f26]/80">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </div>
                  )}
                </button>

                <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#075c35] text-xs text-white">
                  <FaCamera />
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <h2 className="mt-4 text-lg font-extrabold text-[#083f26]">
                {displayName}
              </h2>

              <p className="mt-1 truncate text-xs text-[#718579]">
                {user.email}
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#eaf5e5] px-3 py-1 text-[10px] font-extrabold text-[#075c35]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#158447]" />
                Active Account
              </div>
            </div>

            {/* MENU */}
            <nav className="p-3">
              <button
                type="button"
                onClick={() => scrollToSection("account-details")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeSection === "account"
                    ? "bg-[#075c35] text-white"
                    : "text-[#234f38] hover:bg-[#eaf5e5]"
                }`}
              >
                <FaUser />
                Account Details
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("orders")}
                className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeSection === "orders"
                    ? "bg-[#075c35] text-white shadow-md"
                    : "text-[#234f38] hover:bg-[#eaf5e5]"
                }`}
              >
                <FaBoxOpen />
                <span className="flex-1">Order History & Tracking</span>
                <FaChevronRight className="text-xs" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("wishlist")}
                className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeSection === "wishlist"
                    ? "bg-[#075c35] text-white shadow-md"
                    : "text-[#234f38] hover:bg-[#eaf5e5]"
                }`}
              >
                <FaHeart />
                Wishlist
                <span className="ml-auto rounded-full bg-[#eaf5e5] px-2 py-0.5 text-[10px] text-[#075c35]">
                  {totalWishlist}
                </span>
              </button>

              <div className="my-3 border-t border-[#e5eee2]" />

              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#234f38] transition hover:bg-[#eaf5e5]"
              >
                <FaMapMarkerAlt />
                Address Book
              </button>

              <button
                type="button"
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#234f38] transition hover:bg-[#eaf5e5]"
              >
                <FaCog />
                Settings
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
              >
                <FaSignOutAlt />
                Log Out
              </button>
            </nav>

            {/* SIDEBAR BANNER */}
            <div className="m-4 overflow-hidden rounded-2xl border border-[#cfe5c9] bg-gradient-to-br from-[#f4faef] to-[#e7f3e2] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#158447] shadow-sm">
                <FaLeaf />
              </div>

              <h4 className="mt-3 text-sm font-extrabold text-[#075c35]">
                Fresh Food
                <br />
                Better Life
              </h4>

              <p className="mt-2 text-[11px] leading-5 text-[#718579]">
                Healthy choices for a brighter tomorrow.
              </p>

              <div className="mt-3 text-3xl">🥬🍅🥕</div>
            </div>
          </div>
        </aside>

        {/* ===================================================
            RIGHT CONTENT
        =================================================== */}

        <div className="min-w-0 flex-1">
          {/* =================================================
              WELCOME HERO
          ================================================= */}

          <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#dbe8d7] bg-gradient-to-br from-[#fbfdf9] via-[#eef7eb] to-[#dff0d7] p-6 shadow-sm sm:p-8">
            {/* DECORATION */}

            <div className="pointer-events-none absolute -right-16 -top-20 text-[170px] opacity-10">
              🌿
            </div>

            <div className="pointer-events-none absolute -bottom-16 right-40 text-[100px] opacity-10">
              🍃
            </div>

            <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-bold text-[#158447]">
                  Welcome back,
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight text-[#083f26] sm:text-5xl">
                  {displayName}!
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#637a6b]">
                  Here's your account overview, recent activity, orders and
                  saved products.
                </p>
              </div>

              {/* STATS */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
                <div className="min-w-[125px] rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                  <FaBoxOpen className="text-lg text-[#158447]" />

                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#718579]">
                    Total Orders
                  </p>

                  <p className="mt-1 text-xl font-black text-[#083f26]">
                    {orders.length}
                  </p>
                </div>

                <div className="min-w-[125px] rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                  <FaHeart className="text-lg text-[#158447]" />

                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#718579]">
                    Wishlist
                  </p>

                  <p className="mt-1 text-xl font-black text-[#083f26]">
                    {totalWishlist}
                  </p>
                </div>

                <div className="min-w-[125px] rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                  <FaTruck className="text-lg text-[#158447]" />

                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#718579]">
                    Delivered
                  </p>

                  <p className="mt-1 text-xl font-black text-[#083f26]">
                    {deliveredOrders}
                  </p>
                </div>

                <div className="min-w-[125px] rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                  <FaShoppingCart className="text-lg text-[#158447]" />

                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#718579]">
                    Cart Items
                  </p>

                  <p className="mt-1 text-xl font-black text-[#083f26]">
                    {totalCartItems}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              ACCOUNT DETAILS
          ================================================= */}

          <section
            id="account-details"
            className="mb-6 scroll-mt-5 rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-5 flex items-center gap-3 border-b border-[#e5eee2] pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5e5] text-[#158447]">
                <FaUser />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#083f26]">
                  Account Details
                </h2>

                <p className="text-xs text-[#718579]">
                  Your account information
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* EMAIL */}

              <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#158447] shadow-sm">
                  <FaEnvelope />
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-bold text-[#083f26]">
                  {user.email}
                </p>
              </div>

              {/* PROVIDER */}

              <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#158447] shadow-sm">
                  <FaShieldAlt />
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                  Provider
                </p>

                <p className="mt-1 text-sm font-bold capitalize text-[#083f26]">
                  {user.providerData?.[0]?.providerId || "Unknown"}
                </p>
              </div>

              {/* JOINED */}

              <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#158447] shadow-sm">
                  <FaCalendarAlt />
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                  Member Since
                </p>

                <p className="mt-1 text-sm font-bold text-[#083f26]">
                  {user.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "Not available"}
                </p>
              </div>

              {/* LAST LOGIN */}

              <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#158447] shadow-sm">
                  <FaClock />
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                  Last Login
                </p>

                <p className="mt-1 text-sm font-bold text-[#083f26]">
                  {user.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
                        "en-IN",
                      )
                    : "Not available"}
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              ORDER HISTORY
          ================================================= */}

          <section
            id="orders"
            className="mb-6 scroll-mt-5 rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-sm sm:p-6"
          >
            {/* HEADER */}

            <div className="mb-6 flex flex-col gap-4 border-b border-[#e5eee2] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#075c35] text-xl text-white shadow-md shadow-[#075c35]/20">
                  <FaBoxOpen />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#083f26] sm:text-2xl">
                    Order History & Tracking
                  </h2>

                  <p className="mt-1 text-xs text-[#718579] sm:text-sm">
                    View and track your past orders.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#eaf5e5] px-4 py-2 text-xs font-extrabold text-[#075c35]">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            </div>

            {/* NO ORDERS */}

            {orders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#cbdcc7] bg-[#f7fbf4] px-5 py-14 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5e5] text-3xl text-[#158447]">
                  <FaBoxOpen />
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-[#083f26]">
                  No orders yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718579]">
                  You haven't placed any orders yet. Your KMR Fresh purchases
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onTrack={setSelectedOrder}
                  />
                ))}
              </div>
            )}
          </section>

          {/* =================================================
              WISHLIST
          ================================================= */}

          <section
            id="wishlist"
            className="mb-6 scroll-mt-5 rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-sm sm:p-6"
          >
            {/* HEADER */}

            <div className="mb-6 flex flex-col gap-4 border-b border-[#e5eee2] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#075c35] text-xl text-white shadow-md shadow-[#075c35]/20">
                  <FaHeart />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#083f26] sm:text-2xl">
                    Wishlist
                  </h2>

                  <p className="mt-1 text-xs text-[#718579] sm:text-sm">
                    Save products for later.
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-[#eaf5e5] px-4 py-2 text-xs font-extrabold text-[#075c35]">
                {totalWishlist} Saved
              </div>
            </div>

            {/* EMPTY WISHLIST */}

            {wishlist.items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#cbdcc7] bg-[#f7fbf4] px-5 py-14 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5e5] text-3xl text-[#158447]">
                  <FaHeart />
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-[#083f26]">
                  Your wishlist is empty
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718579]">
                  Save your favourite fresh products here and come back whenever
                  you're ready.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {wishlist.items.map((item) => {
                  const isInCart = cart.some(
                    (cartItem) => String(cartItem.id) === String(item.id),
                  );

                  return (
                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-2xl border border-[#dbe8d7] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#075c35]/10"
                    >
                      {/* IMAGE */}

                      <div className="relative aspect-square overflow-hidden bg-[#f7fbf4] p-3">
                        {getItemImage(item) ? (
                          <img
                            src={getItemImage(item)}
                            alt={item.name}
                            className="h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#eaf5e5] text-4xl text-[#158447]">
                            <FaLeaf />
                          </div>
                        )}

                        {/* HEART */}

                        <button
                          type="button"
                          onClick={() => removeWishlistItem(item.id)}
                          aria-label="Remove from wishlist"
                          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:scale-110"
                        >
                          <FaHeart className="text-sm" />
                        </button>
                      </div>

                      {/* DETAILS */}

                      <div className="p-3 sm:p-4">
                        {item.category && (
                          <p className="truncate text-[9px] font-extrabold uppercase tracking-widest text-[#158447]">
                            {item.category}
                          </p>
                        )}

                        <h3 className="mt-1 truncate text-sm font-extrabold text-[#083f26]">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-lg font-black text-[#075c35]">
                          ₹{formatPrice(item.price)}
                          <span className="ml-1 text-[10px] font-bold text-[#718579]">
                            / KG
                          </span>
                        </p>

                        <button
                          type="button"
                          disabled={isInCart}
                          onClick={() => addWishlistItemToCart(item)}
                          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-extrabold transition ${
                            isInCart
                              ? "cursor-default bg-[#eaf5e5] text-[#158447]"
                              : "bg-gradient-to-r from-[#075c35] to-[#158447] text-white shadow-md shadow-[#075c35]/20 hover:-translate-y-0.5 hover:shadow-lg"
                          }`}
                        >
                          {isInCart ? (
                            <>
                              <FaCheck />
                              In Cart
                            </>
                          ) : (
                            <>
                              <FaShoppingCart />
                              Add to Cart
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeWishlistItem(item.id)}
                          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e1ebe0] bg-white py-2 text-[11px] font-bold text-[#718579] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        >
                          <FaTrash className="text-[10px]" />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* =================================================
              BOTTOM BRAND MESSAGE
          ================================================= */}

          <div className="mb-6 flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#edf7e9] px-5 py-4 text-center sm:flex-row">
            <FaLeaf className="text-[#158447]" />

            <p className="text-xs font-bold text-[#52665b]">
              Thank you for choosing KMR Fresh
            </p>

            <span className="hidden text-[#9bad9f] sm:block">•</span>

            <p className="text-xs font-bold text-[#718579]">
              Fresh • Healthy • Local
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* =====================================================
          TRACK ORDER POPUP
      ===================================================== */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#083f26]/70 px-4 py-6 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e5eee2] bg-white px-5 py-5 sm:px-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                  Order Tracking
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-[#083f26]">
                  #{selectedOrder.id}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f6ef] text-[#718579] transition hover:bg-red-50 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-5 sm:p-7">
              <div className="rounded-2xl bg-gradient-to-br from-[#f1f8ed] to-[#e7f3e2] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#718579]">
                      Current Status
                    </p>

                    <p className="mt-1 text-2xl font-black text-[#075c35]">
                      {ORDER_STEPS[getStatusIndex(selectedOrder)]?.label}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-3 text-right shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#718579]">
                      Order Total
                    </p>

                    <p className="text-xl font-black text-[#075c35]">
                      ₹{formatPrice(selectedOrder.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* ORDER ID / ADDRESS / ESTIMATED DELIVERY */}

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {/* ORDER ID + COPY */}

                <div className="flex items-center justify-between gap-2 rounded-xl border border-[#dbe8d7] bg-[#f7fbf4] px-3.5 py-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                      Order ID
                    </p>

                    <p className="truncate text-xs font-bold text-[#083f26]">
                      {selectedOrder.id || "N/A"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyOrderId(selectedOrder.id)}
                    aria-label="Copy order ID"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#075c35] shadow-sm transition hover:bg-[#eaf5e5]"
                  >
                    {copiedOrderId ? (
                      <FaCheck className="text-xs text-[#158447]" />
                    ) : (
                      <FaCopy className="text-xs" />
                    )}
                  </button>
                </div>

                {/* DELIVERY ADDRESS */}

                <div className="flex items-start gap-2.5 rounded-xl border border-[#dbe8d7] bg-[#f7fbf4] px-3.5 py-3">
                  <FaMapMarkerAlt className="mt-0.5 shrink-0 text-sm text-[#158447]" />

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                      Delivery Address
                    </p>

                    <p
                      className="truncate text-xs font-bold text-[#083f26]"
                      title={getAddressText(selectedOrder)}
                    >
                      {getAddressText(selectedOrder)}
                    </p>
                  </div>
                </div>

                {/* ESTIMATED DELIVERY */}

                <div className="flex items-start gap-2.5 rounded-xl border border-[#dbe8d7] bg-[#f7fbf4] px-3.5 py-3">
                  <FaCalendarAlt className="mt-0.5 shrink-0 text-sm text-[#158447]" />

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#718579]">
                      Estimated Delivery
                    </p>

                    <p className="truncate text-xs font-bold text-[#083f26]">
                      {getEstimatedDelivery(selectedOrder.placedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <TrackingTimeline order={selectedOrder} />

              {/* ORDER DATE */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#718579]">
                    Order Date
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#083f26]">
                    {selectedOrder.placedAt
                      ? new Date(selectedOrder.placedAt).toLocaleString("en-IN")
                      : "Not available"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#718579]">
                    Items
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#083f26]">
                    {selectedOrder.items?.length || 0} product
                    {selectedOrder.items?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* PRODUCTS */}

              <div className="mt-7">
                <h4 className="text-base font-extrabold text-[#083f26]">
                  Order Items
                </h4>

                <div className="mt-3 space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={`${item.id || index}-${index}`}
                      className="flex items-center gap-4 rounded-2xl border border-[#dbe8d7] p-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#eaf5e5]">
                        {getItemImage(item) ? (
                          <img
                            src={getItemImage(item)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#158447]">
                            <FaLeaf />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[#083f26]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-[#718579]">
                          Quantity: {item.quantity || 1}
                        </p>
                      </div>

                      <p className="text-sm font-extrabold text-[#075c35]">
                        ₹
                        {formatPrice(
                          item.amount ??
                            Number(item.price || 0) *
                              Number(item.quantity || 1),
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
