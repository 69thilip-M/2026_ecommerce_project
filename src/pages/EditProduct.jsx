// src/pages/EditProduct.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaArrowLeft,
  FaCheck,
  FaCloudUploadAlt,
  FaEdit,
  FaImage,
  FaLeaf,
  FaRupeeSign,
  FaTag,
  FaBoxOpen,
  FaSave,
  FaTimes,
} from "react-icons/fa";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "addProducts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setProduct({
            name: data.name || data.productName || "",
            description: data.description || "",
            price: data.price ?? "",
            category: data.category || "",
            image: data.image || "",
            stock: data.stock ?? "",
          });
        } else {
          alert("Product not found!");
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load product.");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SAVE PRODUCT =================
  const handleSave = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!product.category.trim()) {
      alert("Please enter a category.");
      return;
    }

    if (!product.price || Number(product.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);

      const docRef = doc(db, "addProducts", id);

      await updateDoc(docRef, {
        name: product.name.trim(),
        description: product.description.trim(),
        price: Number(product.price),
        category: product.category.trim(),
        image: product.image.trim(),
        stock: product.stock === "" ? 0 : Number(product.stock),
      });

      alert("Product updated successfully! 🎉");

      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FBF5] flex flex-col">
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 h-14 w-14 rounded-full border-4 border-[#DCE9D8] border-t-[#108A48] animate-spin" />

            <h2 className="text-xl font-bold text-[#075B35]">
              Loading product...
            </h2>

            <p className="mt-1 text-sm text-[#718579]">
              Preparing your product details
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FBF5] text-[#12352A]">
      <Navbar />

      {/* =====================================================
          PAGE HERO
      ===================================================== */}
      <section className="relative overflow-hidden border-b border-[#DCE9D8] bg-gradient-to-br from-[#075B35] via-[#087341] to-[#108A48]">
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#9BE22D]/15 blur-2xl" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#9BE22D]/30 bg-[#9BE22D]/10 px-4 py-2 text-sm font-semibold text-[#DDF7B7]">
                <FaLeaf />
                KMR Fresh Product Management
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Edit Product
                <span className="ml-2 text-[#C8F26B]">✦</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                Update your product information, pricing, stock and presentation
                before publishing it to your store.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#075B35]"
            >
              <FaArrowLeft />
              Back to Products
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <form onSubmit={handleSave}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            {/* =================================================
                LEFT - FORM
            ================================================= */}
            <div className="rounded-[2rem] border border-[#DCE9D8] bg-white p-5 shadow-[0_20px_60px_rgba(7,91,53,0.08)] sm:p-8">
              {/* Section heading */}
              <div className="mb-8 flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EAF5E5] text-xl text-[#108A48]">
                  <FaEdit />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#075B35]">
                    Product Information
                  </h2>

                  <p className="mt-1 text-sm text-[#718579]">
                    Keep your product details clear and customer-friendly.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* ================= NAME ================= */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#12352A]">
                    <FaLeaf className="text-[#108A48]" />
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Example: Fresh Red Apples"
                    required
                    className="w-full rounded-2xl border border-[#D5E2D1] bg-[#FBFDF9] px-4 py-3.5 text-[#12352A] outline-none transition-all duration-200 placeholder:text-[#9AA79F] focus:border-[#108A48] focus:bg-white focus:ring-4 focus:ring-[#9BE22D]/20"
                  />
                </div>

                {/* ================= DESCRIPTION ================= */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#12352A]">
                      <FaEdit className="text-[#108A48]" />
                      Description
                    </label>

                    <span className="text-xs font-medium text-[#8A9990]">
                      {product.description.length}/500
                    </span>
                  </div>

                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    maxLength={500}
                    rows={5}
                    placeholder="Write a short and attractive description..."
                    className="w-full resize-none rounded-2xl border border-[#D5E2D1] bg-[#FBFDF9] px-4 py-3.5 text-[#12352A] outline-none transition-all duration-200 placeholder:text-[#9AA79F] focus:border-[#108A48] focus:bg-white focus:ring-4 focus:ring-[#9BE22D]/20"
                  />
                </div>

                {/* ================= PRICE + STOCK ================= */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* PRICE */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#12352A]">
                      <FaRupeeSign className="text-[#108A48]" />
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#108A48]">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        required
                        className="w-full rounded-2xl border border-[#D5E2D1] bg-[#FBFDF9] py-3.5 pl-9 pr-4 text-[#12352A] outline-none transition-all duration-200 placeholder:text-[#9AA79F] focus:border-[#108A48] focus:bg-white focus:ring-4 focus:ring-[#9BE22D]/20"
                      />
                    </div>
                  </div>

                  {/* STOCK */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#12352A]">
                      <FaBoxOpen className="text-[#108A48]" />
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={product.stock}
                      onChange={handleChange}
                      min="0"
                      placeholder="Available quantity"
                      className="w-full rounded-2xl border border-[#D5E2D1] bg-[#FBFDF9] px-4 py-3.5 text-[#12352A] outline-none transition-all duration-200 placeholder:text-[#9AA79F] focus:border-[#108A48] focus:bg-white focus:ring-4 focus:ring-[#9BE22D]/20"
                    />
                  </div>
                </div>

                {/* ================= CATEGORY ================= */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#12352A]">
                    <FaTag className="text-[#108A48]" />
                    Category
                  </label>

                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full cursor-pointer appearance-none rounded-2xl border border-[#D5E2D1] bg-[#FBFDF9] px-4 py-3.5 text-[#12352A] outline-none transition-all duration-200 focus:border-[#108A48] focus:bg-white focus:ring-4 focus:ring-[#9BE22D]/20"
                  >
                    <option value="">Select category</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy</option>
                    <option value="bakery">Bakery</option>
                    <option value="beverages">Beverages</option>
                    <option value="snacks">Snacks</option>
                    <option value="groceries">Groceries</option>
                    <option value="organic">Organic</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* ================= IMAGE URL ================= */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#12352A]">
                    <FaImage className="text-[#108A48]" />
                    Product Image URL
                  </label>

                  <div className="relative">
                    <FaCloudUploadAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#108A48]" />

                    <input
                      type="text"
                      name="image"
                      value={product.image}
                      onChange={handleChange}
                      placeholder="https://example.com/product-image.jpg"
                      className="w-full rounded-2xl border border-[#D5E2D1] bg-[#FBFDF9] py-3.5 pl-11 pr-4 text-sm text-[#12352A] outline-none transition-all duration-200 placeholder:text-[#9AA79F] focus:border-[#108A48] focus:bg-white focus:ring-4 focus:ring-[#9BE22D]/20"
                    />
                  </div>

                  <p className="mt-2 text-xs text-[#829189]">
                    Use a direct image URL. The preview updates automatically.
                  </p>
                </div>
              </div>

              {/* ================= ACTION BUTTONS ================= */}
              <div className="mt-9 grid gap-3 border-t border-[#E5EEE1] pt-7 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D5E2D1] bg-[#F3F9F0] px-5 py-3.5 font-bold text-[#075B35] transition-all duration-300 hover:border-[#108A48] hover:bg-[#EAF5E5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#108A48] px-5 py-3.5 font-bold text-white shadow-[0_10px_25px_rgba(16,138,72,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#075B35] hover:shadow-[0_14px_30px_rgba(7,91,53,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                RIGHT - LIVE PREVIEW
            ================================================= */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="overflow-hidden rounded-[2rem] border border-[#DCE9D8] bg-white shadow-[0_20px_60px_rgba(7,91,53,0.08)]">
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-[#075B35] to-[#108A48] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8F26B]">
                        Live Preview
                      </p>

                      <h3 className="mt-1 text-xl font-extrabold text-white">
                        Store Product Card
                      </h3>
                    </div>

                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#C8F26B]">
                      <FaLeaf />
                    </div>
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative m-5 overflow-hidden rounded-3xl bg-[#F1F8ED]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name || "Product preview"}
                      className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement.querySelector(
                          ".image-fallback",
                        ).style.display = "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className={`image-fallback ${
                      product.image ? "hidden" : "flex"
                    } h-64 w-full flex-col items-center justify-center text-[#8A9990]`}
                  >
                    <FaImage className="mb-3 text-5xl" />

                    <p className="text-sm font-semibold">
                      Product image preview
                    </p>

                    <p className="mt-1 text-xs">
                      Add an image URL to preview it
                    </p>
                  </div>

                  {/* Category badge */}
                  {product.category && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold capitalize text-[#075B35] shadow-sm backdrop-blur">
                      {product.category}
                    </span>
                  )}

                  {/* Fresh badge */}
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#C8F26B] px-3 py-1.5 text-xs font-extrabold text-[#06472A] shadow-sm">
                    <FaCheck />
                    Fresh
                  </span>
                </div>

                {/* Product Details */}
                <div className="px-6 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-extrabold text-[#075B35]">
                        {product.name || "Your Product Name"}
                      </h4>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#718579]">
                        {product.description ||
                          "Your product description will appear here."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#E5EEE1] pt-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#829189]">
                        Price
                      </p>

                      <p className="mt-1 text-2xl font-black text-[#108A48]">
                        ₹
                        {product.price
                          ? Number(product.price).toLocaleString("en-IN")
                          : "0"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#829189]">
                        Stock
                      </p>

                      <p className="mt-1 font-extrabold text-[#075B35]">
                        {product.stock === ""
                          ? "0"
                          : Number(product.stock).toLocaleString("en-IN")}{" "}
                        units
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#EAF5E5] py-3 font-bold text-[#075B35]"
                  >
                    <FaBoxOpen />
                    Product Ready
                  </button>
                </div>
              </div>

              {/* Tips Card */}
              <div className="mt-5 rounded-3xl border border-[#DCE9D8] bg-[#F1F8ED] p-5">
                <div className="flex gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#C8F26B] text-[#075B35]">
                    <FaLeaf />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#075B35]">
                      KMR Fresh Tip
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-[#718579]">
                      Use a clear product image and a short description to make
                      your grocery products easier for customers to understand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default EditProduct;
