// src/pages/EditProduct.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EditProduct() {
  const { id } = useParams(); // product ID from URL
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch product by ID
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

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle save
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
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center p-6">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          {/* ✅ Header with title + Back button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              Edit Product ✏️
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg font-medium transition"
            >
              ⬅ Back
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full px-4 py-2 rounded-lg border border-orange-400 bg-white dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full px-4 py-2 rounded-lg border border-orange-400 bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full px-4 py-2 rounded-lg border border-orange-400 bg-white dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full px-4 py-2 rounded-lg border border-orange-400 bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full px-4 py-2 rounded-lg border border-orange-400 bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium shadow-md transition"
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
