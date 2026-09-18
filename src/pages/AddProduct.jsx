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

  // 👉 Upload image to Cloudinary
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
        }
      );
      const uploadedImage = await res.json();
      setImageUrl(uploadedImage.secure_url);
      setLoading(false);
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      setLoading(false);
    }
  };

  // 👉 Handle form submit
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

      // reset form
      setProductName("");
      setCategory("fruits");
      setPrice(50);
      setDescription("");
      setStock("");
      setImageUrl("");

      // navigate back after adding product
      navigate("/products");
    } catch (error) {
      console.error("❌ Error adding product: ", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-orange-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              Add New Product 🥦🍎
            </h1>
            {/* ✅ Back Button */}
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg font-medium transition"
            >
              ⬅ Back
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleAddProduct}>
            {/* Product Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Price (₹)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="flex-1 accent-orange-600"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              ></textarea>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Stock
              </label>
              <input
                type="number"
                placeholder="Enter available stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Upload Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {imageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Preview:
                  </p>
                  <img
                    src={imageUrl}
                    alt="Product Preview"
                    className="w-32 h-32 object-cover rounded-lg border dark:border-gray-600"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Uploading..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AppProduct;
