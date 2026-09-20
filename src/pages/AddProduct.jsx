// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// import { addDoc, collection } from "firebase/firestore";
// import { db } from "../firebase";

// function AppProduct() {
//   const [productName, setProductName] = useState("");
//   const [category, setCategory] = useState("fruits");
//   const [price, setPrice] = useState(50);
//   const [description, setDescription] = useState("");
//   const [stock, setStock] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // Upload image to Cloudinary
//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     const data = new FormData();

//     data.append("file", file);
//     data.append("upload_preset", "Products");

//     try {
//       setLoading(true);

//       const res = await fetch(
//         "https://api.cloudinary.com/v1_1/dvtx9vyr9/image/upload",
//         {
//           method: "POST",
//           body: data,
//         },
//       );

//       const uploadedImage = await res.json();

//       setImageUrl(uploadedImage.secure_url);

//       setLoading(false);
//     } catch (error) {
//       console.error("❌ Image upload failed:", error);

//       setLoading(false);
//     }
//   };

//   // Handle form submit
//   const handleAddProduct = async (e) => {
//     e.preventDefault();

//     if (!imageUrl) {
//       alert("Please upload a product image first!");
//       return;
//     }

//     try {
//       const product = {
//         productName,
//         category,
//         price,
//         description,
//         stock: Number(stock),
//         image: imageUrl,
//         createdAt: new Date(),
//       };

//       const res = await addDoc(collection(db, "addProducts"), product);

//       alert("✅ Product added successfully!");

//       console.log("Document written with ID: ", res.id);

//       // Reset form
//       setProductName("");
//       setCategory("fruits");
//       setPrice(50);
//       setDescription("");
//       setStock("");
//       setImageUrl("");

//       // Navigate back
//       navigate("/products");
//     } catch (error) {
//       console.error("❌ Error adding product: ", error);

//       alert("Failed to add product");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-[#f7fbf4] text-[#083f26] transition-colors">
//       {/* =========================
//           NAVBAR
//       ========================== */}
//       <Navbar />

//       {/* =========================
//           MAIN CONTENT
//       ========================== */}
//       <div className="flex-grow flex items-center justify-center px-4 py-12">
//         <div
//           className="
//             bg-white
//             border
//             border-[#dbe8d7]
//             p-8
//             rounded-2xl
//             shadow-lg
//             w-full
//             max-w-lg
//             transition-all
//             duration-300
//           "
//         >
//           {/* =========================
//               HEADER
//           ========================== */}
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-[#075c35]">
//               Add New Product 🥦🍎
//             </h1>

//             {/* Back Button */}
//             <button
//               onClick={() => navigate("/products")}
//               className="
//                 px-4
//                 py-2
//                 bg-[#eaf5e5]
//                 hover:bg-[#dcefd5]
//                 text-[#075c35]
//                 border
//                 border-[#dbe8d7]
//                 rounded-lg
//                 font-medium
//                 transition
//               "
//             >
//               ⬅ Back
//             </button>
//           </div>

//           {/* =========================
//               FORM
//           ========================== */}
//           <form className="space-y-5" onSubmit={handleAddProduct}>
//             {/* =========================
//                 PRODUCT NAME
//             ========================== */}
//             <div>
//               <label className="block text-[#083f26] font-semibold mb-2">
//                 Product Name
//               </label>

//               <input
//                 type="text"
//                 placeholder="Enter product name"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 className="
//                   w-full
//                   px-4
//                   py-2
//                   border
//                   border-[#dbe8d7]
//                   rounded-lg
//                   bg-white
//                   text-[#083f26]
//                   placeholder-[#9aa99f]
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-[#158447]
//                   focus:border-[#158447]
//                   transition
//                 "
//                 required
//               />
//             </div>

//             {/* =========================
//                 CATEGORY
//             ========================== */}
//             <div>
//               <label className="block text-[#083f26] font-semibold mb-2">
//                 Category
//               </label>

//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="
//                   w-full
//                   px-4
//                   py-2
//                   border
//                   border-[#dbe8d7]
//                   rounded-lg
//                   bg-white
//                   text-[#083f26]
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-[#158447]
//                   focus:border-[#158447]
//                   transition
//                 "
//               >
//                 <option value="fruits">Fruits</option>
//                 <option value="vegetables">Vegetables</option>
//                 <option value="dairy">Dairy</option>
//                 <option value="others">Others</option>
//               </select>
//             </div>

//             {/* =========================
//                 PRICE
//             ========================== */}
//             <div>
//               <label className="block text-[#083f26] font-semibold mb-2">
//                 Price (₹)
//               </label>

//               <div className="flex items-center gap-4">
//                 <input
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(Number(e.target.value))}
//                   className="
//                     w-24
//                     px-3
//                     py-2
//                     border
//                     border-[#dbe8d7]
//                     rounded-lg
//                     bg-white
//                     text-[#083f26]
//                     focus:outline-none
//                     focus:ring-2
//                     focus:ring-[#158447]
//                     focus:border-[#158447]
//                   "
//                   required
//                 />

//                 <input
//                   type="range"
//                   min="0"
//                   max="1000"
//                   step="10"
//                   value={price}
//                   onChange={(e) => setPrice(Number(e.target.value))}
//                   className="flex-1 accent-[#158447]"
//                 />
//               </div>
//             </div>

//             {/* =========================
//                 DESCRIPTION
//             ========================== */}
//             <div>
//               <label className="block text-[#083f26] font-semibold mb-2">
//                 Description
//               </label>

//               <textarea
//                 placeholder="Enter product description"
//                 rows="3"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="
//                   w-full
//                   px-4
//                   py-2
//                   border
//                   border-[#dbe8d7]
//                   rounded-lg
//                   bg-white
//                   text-[#083f26]
//                   placeholder-[#9aa99f]
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-[#158447]
//                   focus:border-[#158447]
//                   transition
//                   resize-none
//                 "
//                 required
//               ></textarea>
//             </div>

//             {/* =========================
//                 STOCK
//             ========================== */}
//             <div>
//               <label className="block text-[#083f26] font-semibold mb-2">
//                 Stock
//               </label>

//               <input
//                 type="number"
//                 placeholder="Enter available stock"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 className="
//                   w-full
//                   px-4
//                   py-2
//                   border
//                   border-[#dbe8d7]
//                   rounded-lg
//                   bg-white
//                   text-[#083f26]
//                   placeholder-[#9aa99f]
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-[#158447]
//                   focus:border-[#158447]
//                   transition
//                 "
//                 required
//               />
//             </div>

//             {/* =========================
//                 IMAGE UPLOAD
//             ========================== */}
//             <div>
//               <label className="block text-[#083f26] font-semibold mb-2">
//                 Upload Product Image
//               </label>

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="
//                   w-full
//                   px-3
//                   py-2
//                   border
//                   border-[#dbe8d7]
//                   rounded-lg
//                   bg-white
//                   text-[#52665b]
//                   focus:outline-none
//                   focus:ring-2
//                   focus:ring-[#158447]
//                   focus:border-[#158447]
//                   transition
//                 "
//               />

//               {/* Image Preview */}
//               {imageUrl && (
//                 <div className="mt-4">
//                   <p className="text-sm text-[#718579] mb-2">Preview:</p>

//                   <img
//                     src={imageUrl}
//                     alt="Product Preview"
//                     className="
//                       w-32
//                       h-32
//                       object-cover
//                       rounded-lg
//                       border
//                       border-[#dbe8d7]
//                       shadow-sm
//                     "
//                   />
//                 </div>
//               )}
//             </div>

//             {/* =========================
//                 SUBMIT BUTTON
//             ========================== */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="
//                 w-full
//                 bg-[#075c35]
//                 hover:bg-[#0b7040]
//                 disabled:bg-[#9aa99f]
//                 text-white
//                 font-semibold
//                 py-3
//                 rounded-lg
//                 transition
//                 duration-200
//                 shadow-sm
//                 hover:shadow-md
//               "
//             >
//               {loading ? "Uploading..." : "Add Product"}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* =========================
//           FOOTER
//       ========================== */}
//       <Footer />
//     </div>
//   );
// }

// export default AppProduct;

// src/pages/AddProduct.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaLeaf,
  FaCheckCircle,
  FaBoxOpen,
  FaRupeeSign,
  FaTags,
  FaAlignLeft,
  FaWarehouse,
} from "react-icons/fa";

// =========================================================
// ADMIN EMAIL
// Must be the SAME email used in Products.jsx
// =========================================================
const ADMIN_EMAIL = "admin123@gmail.com";

// case-insensitive + trims spaces, so "Admin123@Gmail.com " still matches
const isAdminEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase() === ADMIN_EMAIL.toLowerCase();

function AddProduct() {
  const navigate = useNavigate();
  const { user } = useCart();

  // =========================================================
  // ADMIN CHECK  (same rule as Products.jsx: Edit / Delete)
  // =========================================================
  const currentEmail = user?.email || localStorage.getItem("userEmail");

  const isAdmin =
    isAdminEmail(currentEmail) ||
    user?.role === "admin" ||
    user?.isAdmin === true;

  // =========================================================
  // PRODUCT STATES
  // =========================================================
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("fruits");
  const [price, setPrice] = useState(50);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // BLOCK NON-ADMIN USERS
  // =========================================================
  if (!user && !currentEmail) {
    return (
      <div className="min-h-screen bg-[#f7fbf4] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#dbe8d7] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#eaf5e5] text-3xl text-[#075c35]">
            🔐
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#083f26]">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-[#718579]">
            Please login with your admin account to add products.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] px-5 py-3.5 font-extrabold text-white shadow-lg shadow-[#075c35]/20 transition hover:-translate-y-0.5"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f7fbf4] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-50 text-3xl">
            🚫
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#083f26]">
            Access Denied
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#718579]">
            Only the KMR Fresh administrator can add new products.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 w-full rounded-2xl bg-[#eaf5e5] px-5 py-3.5 font-extrabold text-[#075c35] transition hover:bg-[#dcefd5]"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // CLOUDINARY IMAGE UPLOAD
  // =========================================================
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "Products");

    try {
      setUploading(true);
      setImageUrl("");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dvtx9vyr9/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const uploadedImage = await response.json();

      if (!response.ok || !uploadedImage.secure_url) {
        throw new Error(
          uploadedImage?.error?.message || "Cloudinary upload failed",
        );
      }

      setImageUrl(uploadedImage.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // ADD PRODUCT
  // =========================================================
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      alert("Please enter the product name.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a product description.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (!stock || Number(stock) < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (!imageUrl) {
      alert("Please upload a product image first.");
      return;
    }

    if (uploading) {
      alert("Please wait until the image upload is completed.");
      return;
    }

    try {
      setSaving(true);

      // IMPORTANT:
      // Use "name", not "productName", because the rest
      // of your KMR Fresh app uses item.name.
      const product = {
        name: productName.trim(),
        category,
        price: Number(price),
        description: description.trim(),
        stock: Number(stock),
        image: imageUrl,
        createdAt: new Date(),
      };

      const result = await addDoc(collection(db, "addProducts"), product);

      console.log("Product added with ID:", result.id);

      alert("✅ Product added successfully!");

      // Reset form
      setProductName("");
      setCategory("fruits");
      setPrice(50);
      setDescription("");
      setStock("");
      setImageUrl("");

      // Go back to products
      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="min-h-screen bg-[#f7fbf4] text-[#083f26] flex flex-col">
      <Navbar />

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] text-white">
        {/* Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Decorative circles */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c8f26b]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#9bdd45]/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:px-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-sm">
              <FaLeaf className="text-[#c8f26b]" />
              KMR FRESH · ADMIN
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Add New <span className="text-[#c8f26b]">Product</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
              Add fresh products to your KMR Fresh store with product details,
              pricing, stock and high-quality images.
            </p>
          </div>

          <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-5xl backdrop-blur-sm md:flex">
            🥦
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dbe8d7] bg-white px-4 py-2.5 text-sm font-bold text-[#075c35] shadow-sm transition hover:-translate-x-0.5 hover:bg-[#f1f8ed]"
          >
            <FaArrowLeft className="text-xs" />
            Back to Products
          </button>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* =================================================
              FORM CARD
          ================================================== */}
          <section className="overflow-hidden rounded-[28px] border border-[#dbe8d7] bg-white shadow-xl shadow-[#075c35]/8">
            {/* Card header */}
            <div className="border-b border-[#e4eee1] bg-gradient-to-r from-[#f1f8ed] to-white px-6 py-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#075c35] text-xl text-white shadow-lg shadow-[#075c35]/20">
                  <FaBoxOpen />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#083f26]">
                    Product Information
                  </h2>

                  <p className="mt-1 text-sm text-[#718579]">
                    Enter the details of your new product.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6 p-6 sm:p-8">
              {/* Product name */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#083f26]">
                  <FaBoxOpen className="text-[#158447]" />
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Fresh Red Apples"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-2xl border border-[#dbe8d7] bg-[#fbfdf9] px-4 py-3.5 text-[#083f26] placeholder-[#9aa99f] outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/10"
                  required
                />
              </div>

              {/* Category + stock */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#083f26]">
                    <FaTags className="text-[#158447]" />
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full cursor-pointer rounded-2xl border border-[#dbe8d7] bg-[#fbfdf9] px-4 py-3.5 text-[#083f26] outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/10"
                  >
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#083f26]">
                    <FaWarehouse className="text-[#158447]" />
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Available stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full rounded-2xl border border-[#dbe8d7] bg-[#fbfdf9] px-4 py-3.5 text-[#083f26] placeholder-[#9aa99f] outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/10"
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-extrabold text-[#083f26]">
                    <FaRupeeSign className="text-[#158447]" />
                    Price per KG
                  </label>

                  <span className="rounded-full bg-[#eaf5e5] px-3 py-1 text-sm font-black text-[#075c35]">
                    ₹{price}
                  </span>
                </div>

                <div className="rounded-2xl border border-[#dbe8d7] bg-[#fbfdf9] p-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-28 rounded-xl border border-[#dbe8d7] bg-white px-3 py-2.5 font-bold text-[#083f26] outline-none focus:border-[#158447] focus:ring-4 focus:ring-[#158447]/10"
                      required
                    />

                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="flex-1 accent-[#158447]"
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-[11px] font-semibold text-[#9aa99f]">
                    <span>₹10</span>
                    <span>₹1000</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#083f26]">
                  <FaAlignLeft className="text-[#158447]" />
                  Description
                </label>

                <textarea
                  rows="5"
                  placeholder="Describe freshness, quality, origin, taste, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-[#dbe8d7] bg-[#fbfdf9] px-4 py-3.5 text-[#083f26] placeholder-[#9aa99f] outline-none transition focus:border-[#158447] focus:bg-white focus:ring-4 focus:ring-[#158447]/10"
                  required
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#083f26]">
                  <FaCloudUploadAlt className="text-[#158447]" />
                  Product Image
                </label>

                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbdcc6] bg-[#f7fbf4] px-5 py-8 text-center transition hover:border-[#158447] hover:bg-[#f1f8ed]">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl text-[#158447] shadow-sm transition group-hover:scale-105">
                    <FaCloudUploadAlt />
                  </div>

                  <p className="mt-4 text-sm font-extrabold text-[#083f26]">
                    {uploading
                      ? "Uploading image..."
                      : "Click to upload product image"}
                  </p>

                  <p className="mt-1 text-xs text-[#718579]">
                    PNG, JPG, WEBP · Maximum 5 MB
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Upload status */}
                {uploading && (
                  <div className="mt-3 rounded-xl bg-[#eaf5e5] px-4 py-3 text-sm font-bold text-[#158447]">
                    Uploading your image to Cloudinary...
                  </div>
                )}

                {imageUrl && !uploading && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#cfe4c8] bg-[#f1f8ed] p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#158447]">
                      <FaCheckCircle />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-[#075c35]">
                        Image uploaded successfully
                      </p>

                      <p className="text-xs text-[#718579]">
                        Your product image is ready.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#e4eee1] pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="rounded-2xl border border-[#dbe8d7] bg-[#f1f8ed] px-6 py-3.5 text-sm font-extrabold text-[#075c35] transition hover:bg-[#e3f1df]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading || saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving Product...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* =================================================
              LIVE PREVIEW
          ================================================== */}
          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-[28px] border border-[#dbe8d7] bg-white shadow-xl shadow-[#075c35]/8">
              <div className="bg-gradient-to-br from-[#06472a] to-[#0b7040] px-6 py-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-green-100">
                  Live Preview
                </p>

                <h2 className="mt-1 text-xl font-extrabold">Product Card</h2>
              </div>

              {/* Preview image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f1f8ed] to-[#e5f2df]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Product Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-4xl shadow-sm">
                      🥬
                    </div>

                    <p className="mt-4 text-sm font-bold text-[#718579]">
                      Product image preview
                    </p>
                  </div>
                )}

                {category && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#158447] shadow-sm">
                    {category}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-xl font-extrabold text-[#083f26]">
                  {productName || "Your Product Name"}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#718579]">
                  {description || "Your product description will appear here."}
                </p>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-black text-[#075c35]">
                      ₹{price || 0}
                    </p>

                    <p className="text-xs font-semibold text-[#9aa99f]">
                      per KG
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#eaf5e5] px-3 py-2 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#718579]">
                      Stock
                    </p>

                    <p className="text-sm font-black text-[#158447]">
                      {stock || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#f1f8ed] px-4 py-3 text-xs font-bold text-[#075c35]">
                  <FaLeaf />
                  Fresh & quality checked
                </div>
              </div>
            </div>

            {/* Admin tip */}
            <div className="mt-5 rounded-2xl border border-[#dbe8d7] bg-white p-5">
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eaf5e5] text-[#158447]">
                  💡
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#083f26]">
                    Admin tip
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#718579]">
                    Use clear product names and high-quality images so customers
                    can easily identify your products.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddProduct;
