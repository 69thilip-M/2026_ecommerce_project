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
    <section className="px-6 py-8 bg-[#f7fbf4] text-[#083f26] transition-colors duration-300">
      {/* =========================
          SECTION TITLE
      ========================== */}

      <h2 className="text-3xl font-bold text-[#075c35] mb-6">New Products</h2>

      {/* =========================
          EMPTY STATE
      ========================== */}

      {products.length === 0 ? (
        <p className="text-center text-[#718579] py-10">
          No new products available yet.
        </p>
      ) : (
        /* =========================
           PRODUCT GRID
        ========================== */

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#dbe8d7] rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* =========================
                  PRODUCT IMAGE
              ========================== */}

              <div
                className="cursor-pointer relative"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />

                {/* Category */}

                {product.category && (
                  <span className="absolute top-2 right-2 bg-[#075c35] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {product.category}
                  </span>
                )}
              </div>

              {/* =========================
                  PRODUCT DETAILS
              ========================== */}

              <div className="p-5 flex flex-col justify-between h-auto">
                {/* Product Name */}

                <h2 className="text-lg font-bold text-[#083f26] mb-2">
                  {product.productName}
                </h2>

                {/* Description */}

                {product.description && (
                  <p className="text-sm text-[#52665b] mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Price */}

                <p className="text-[#075c35] font-semibold text-xl mb-3">
                  ₹{product.price}{" "}
                  <span className="text-sm text-[#718579]">/ 1kg</span>
                </p>

                {/* =========================
                    CART BUTTON
                ========================== */}

                {isInCart(product.id) ? (
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="w-full mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <FaTrash className="text-lg" />
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-auto flex items-center justify-center gap-2 bg-[#075c35] hover:bg-[#083f26] text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
                  >
                    <FaCartPlus className="text-lg" />
                    Add to Cart
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
