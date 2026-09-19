// src/pages/EditProduct.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "addProducts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          alert("Product not found!");
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "addProducts", id);

      await updateDoc(docRef, product);

      alert("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FBF5] flex items-center justify-center">
        <p className="text-[#075B35] font-semibold text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FBF5] flex flex-col">
      <Navbar />

      {/* ================= MAIN ================= */}
      <div className="flex-grow flex justify-center items-center p-6">
        <div
          className="
            w-full
            max-w-2xl
            bg-white
            p-8
            md:p-10
            rounded-3xl
            shadow-[0_10px_35px_rgba(7,91,53,0.10)]
            border
            border-[#DCE9D8]
          "
        >
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-[#108A48]
                  uppercase
                  tracking-wide
                  mb-1
                "
              >
                Product Management
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  text-[#075B35]
                "
              >
                Edit Product ✏️
              </h2>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/products")}
              className="
                px-4
                py-2
                rounded-xl
                font-semibold
                text-[#075B35]
                bg-[#EEF8EA]
                border
                border-[#DCE9D8]
                hover:bg-[#075B35]
                hover:text-white
                transition-all
                duration-300
              "
            >
              ← Back
            </button>
          </div>

          {/* ================= FORM ================= */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* ================= NAME ================= */}
            <div>
              <label
                className="
                  block
                  text-[#12352A]
                  font-semibold
                  mb-2
                "
              >
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-[#D5E2D1]
                  bg-[#FBFDF9]
                  text-[#12352A]
                  placeholder-[#829189]
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#075B35]
                  focus:ring-2
                  focus:ring-[#9BE22D]
                "
              />
            </div>

            {/* ================= DESCRIPTION ================= */}
            <div>
              <label
                className="
                  block
                  text-[#12352A]
                  font-semibold
                  mb-2
                "
              >
                Description
              </label>

              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Description"
                rows="4"
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-[#D5E2D1]
                  bg-[#FBFDF9]
                  text-[#12352A]
                  placeholder-[#829189]
                  outline-none
                  transition-all
                  duration-200
                  resize-none
                  focus:border-[#075B35]
                  focus:ring-2
                  focus:ring-[#9BE22D]
                "
              />
            </div>

            {/* ================= PRICE ================= */}
            <div>
              <label
                className="
                  block
                  text-[#12352A]
                  font-semibold
                  mb-2
                "
              >
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-[#D5E2D1]
                  bg-[#FBFDF9]
                  text-[#12352A]
                  placeholder-[#829189]
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#075B35]
                  focus:ring-2
                  focus:ring-[#9BE22D]
                "
              />
            </div>

            {/* ================= CATEGORY ================= */}
            <div>
              <label
                className="
                  block
                  text-[#12352A]
                  font-semibold
                  mb-2
                "
              >
                Category
              </label>

              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Category"
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-[#D5E2D1]
                  bg-[#FBFDF9]
                  text-[#12352A]
                  placeholder-[#829189]
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#075B35]
                  focus:ring-2
                  focus:ring-[#9BE22D]
                "
              />
            </div>

            {/* ================= IMAGE URL ================= */}
            <div>
              <label
                className="
                  block
                  text-[#12352A]
                  font-semibold
                  mb-2
                "
              >
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-[#D5E2D1]
                  bg-[#FBFDF9]
                  text-[#12352A]
                  placeholder-[#829189]
                  outline-none
                  transition-all
                  duration-200
                  focus:border-[#075B35]
                  focus:ring-2
                  focus:ring-[#9BE22D]
                "
              />
            </div>

            {/* ================= IMAGE PREVIEW ================= */}
            {product.image && (
              <div
                className="
                  p-4
                  rounded-2xl
                  bg-[#F3F9F0]
                  border
                  border-[#DCE9D8]
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#075B35]
                    mb-3
                  "
                >
                  Image Preview
                </p>

                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    w-full
                    h-48
                    object-cover
                    rounded-xl
                    border
                    border-[#DCE9D8]
                  "
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* ================= SAVE BUTTON ================= */}
            <button
              type="submit"
              className="
                w-full
                bg-[#108A48]
                hover:bg-[#075B35]
                text-white
                py-3
                rounded-xl
                font-semibold
                shadow-md
                hover:shadow-lg
                hover:shadow-[#075B35]/20
                transition-all
                duration-300
              "
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EditProduct;
