// src/components/NewProducts.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaCartPlus, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function NewProducts() {
  const [products, setProducts] = useState([]);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "addProducts"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="px-6 bg-orange-100 dark:bg-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-6 ">
        New Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No new products available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Image */}
              <div
                className="cursor-pointer relative"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.category && (
                  <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-5 flex flex-col justify-between h-auto">
                {/* Name */}
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {product.productName}
                </h2>

                {/* ✅ Description (2 lines max) */}
                {product.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <p className="text-orange-700 dark:text-orange-400 font-semibold text-xl mb-3">
                  ₹{product.price}{" "}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / 1kg
                  </span>
                </p>

                {/* Cart button */}
                {isInCart(product.id) ? (
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="w-full mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <FaTrash className="text-lg" /> Remove from Cart
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <FaCartPlus className="text-lg" /> Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default NewProducts;
