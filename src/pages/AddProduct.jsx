import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function AppProduct() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("fruits");
  const [price, setPrice] = useState(50);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Upload image to Cloudinary
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "Products");

    try {
      setLoading(true);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvtx9vyr9/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const uploadedImage = await res.json();

      setImageUrl(uploadedImage.secure_url);

      setLoading(false);
    } catch (error) {
      console.error("❌ Image upload failed:", error);

      setLoading(false);
    }
  };

  // Handle form submit
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      alert("Please upload a product image first!");
      return;
    }

    try {
      const product = {
        productName,
        category,
        price,
        description,
        stock: Number(stock),
        image: imageUrl,
        createdAt: new Date(),
      };

      const res = await addDoc(collection(db, "addProducts"), product);

      alert("✅ Product added successfully!");

      console.log("Document written with ID: ", res.id);

      // Reset form
      setProductName("");
      setCategory("fruits");
      setPrice(50);
      setDescription("");
      setStock("");
      setImageUrl("");

      // Navigate back
      navigate("/products");
    } catch (error) {
      console.error("❌ Error adding product: ", error);

      alert("Failed to add product");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7fbf4] text-[#083f26] transition-colors">
      {/* =========================
          NAVBAR
      ========================== */}
      <Navbar />

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div
          className="
            bg-white
            border
            border-[#dbe8d7]
            p-8
            rounded-2xl
            shadow-lg
            w-full
            max-w-lg
            transition-all
            duration-300
          "
        >
          {/* =========================
              HEADER
          ========================== */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#075c35]">
              Add New Product 🥦🍎
            </h1>

            {/* Back Button */}
            <button
              onClick={() => navigate("/products")}
              className="
                px-4
                py-2
                bg-[#eaf5e5]
                hover:bg-[#dcefd5]
                text-[#075c35]
                border
                border-[#dbe8d7]
                rounded-lg
                font-medium
                transition
              "
            >
              ⬅ Back
            </button>
          </div>

          {/* =========================
              FORM
          ========================== */}
          <form className="space-y-5" onSubmit={handleAddProduct}>
            {/* =========================
                PRODUCT NAME
            ========================== */}
            <div>
              <label className="block text-[#083f26] font-semibold mb-2">
                Product Name
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="
                  w-full
                  px-4
                  py-2
                  border
                  border-[#dbe8d7]
                  rounded-lg
                  bg-white
                  text-[#083f26]
                  placeholder-[#9aa99f]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#158447]
                  focus:border-[#158447]
                  transition
                "
                required
              />
            </div>

            {/* =========================
                CATEGORY
            ========================== */}
            <div>
              <label className="block text-[#083f26] font-semibold mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                  w-full
                  px-4
                  py-2
                  border
                  border-[#dbe8d7]
                  rounded-lg
                  bg-white
                  text-[#083f26]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#158447]
                  focus:border-[#158447]
                  transition
                "
              >
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* =========================
                PRICE
            ========================== */}
            <div>
              <label className="block text-[#083f26] font-semibold mb-2">
                Price (₹)
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="
                    w-24
                    px-3
                    py-2
                    border
                    border-[#dbe8d7]
                    rounded-lg
                    bg-white
                    text-[#083f26]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#158447]
                    focus:border-[#158447]
                  "
                  required
                />

                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="flex-1 accent-[#158447]"
                />
              </div>
            </div>

            {/* =========================
                DESCRIPTION
            ========================== */}
            <div>
              <label className="block text-[#083f26] font-semibold mb-2">
                Description
              </label>

              <textarea
                placeholder="Enter product description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  w-full
                  px-4
                  py-2
                  border
                  border-[#dbe8d7]
                  rounded-lg
                  bg-white
                  text-[#083f26]
                  placeholder-[#9aa99f]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#158447]
                  focus:border-[#158447]
                  transition
                  resize-none
                "
                required
              ></textarea>
            </div>

            {/* =========================
                STOCK
            ========================== */}
            <div>
              <label className="block text-[#083f26] font-semibold mb-2">
                Stock
              </label>

              <input
                type="number"
                placeholder="Enter available stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="
                  w-full
                  px-4
                  py-2
                  border
                  border-[#dbe8d7]
                  rounded-lg
                  bg-white
                  text-[#083f26]
                  placeholder-[#9aa99f]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#158447]
                  focus:border-[#158447]
                  transition
                "
                required
              />
            </div>

            {/* =========================
                IMAGE UPLOAD
            ========================== */}
            <div>
              <label className="block text-[#083f26] font-semibold mb-2">
                Upload Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="
                  w-full
                  px-3
                  py-2
                  border
                  border-[#dbe8d7]
                  rounded-lg
                  bg-white
                  text-[#52665b]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#158447]
                  focus:border-[#158447]
                  transition
                "
              />

              {/* Image Preview */}
              {imageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-[#718579] mb-2">Preview:</p>

                  <img
                    src={imageUrl}
                    alt="Product Preview"
                    className="
                      w-32
                      h-32
                      object-cover
                      rounded-lg
                      border
                      border-[#dbe8d7]
                      shadow-sm
                    "
                  />
                </div>
              )}
            </div>

            {/* =========================
                SUBMIT BUTTON
            ========================== */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[#075c35]
                hover:bg-[#0b7040]
                disabled:bg-[#9aa99f]
                text-white
                font-semibold
                py-3
                rounded-lg
                transition
                duration-200
                shadow-sm
                hover:shadow-md
              "
            >
              {loading ? "Uploading..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>

      {/* =========================
          FOOTER
      ========================== */}
      <Footer />
    </div>
  );
}

export default AppProduct;
