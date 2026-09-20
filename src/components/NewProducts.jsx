// src/components/NewProducts.jsx

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaCartPlus, FaTrash, FaLeaf, FaArrowRight } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function NewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, removeFromCart, isInCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const querySnapshot = await getDocs(collection(db, "addProducts"));

        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleCartClick = (e, product) => {
    e.stopPropagation();

    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <section className="relative bg-[#f7fbf4] px-5 py-14 sm:px-8 lg:px-12 overflow-hidden">
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#dcefcf] opacity-60 blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 -left-28 h-64 w-64 rounded-full bg-[#eaf5e5] opacity-70 blur-3xl pointer-events-none" />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative max-w-[1250px] mx-auto">
        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-9">
          <div>
            {/* Small label */}

            <div className="inline-flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eaf5e5] text-[#158447]">
                <FaLeaf className="text-sm" />
              </span>

              <span className="text-xs font-extrabold tracking-[1.5px] uppercase text-[#158447]">
                Freshly Added
              </span>
            </div>

            {/* Heading */}

            <h2 className="text-3xl sm:text-4xl font-black tracking-[-1px] text-[#083f26]">
              New Products
            </h2>

            {/* Underline */}

            <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-[#158447] to-[#9bdd45]" />

            {/* Description */}

            <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-[#718579]">
              Discover our latest fresh picks, carefully selected to bring
              quality and freshness straight to your home.
            </p>
          </div>

          {/* View all button */}

          {products.length > 0 && (
            <button
              onClick={() => navigate("/products")}
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2
                self-start
                sm:self-auto
                rounded-xl
                border
                border-[#d3e3cf]
                bg-white
                px-5
                py-3
                text-sm
                font-extrabold
                text-[#075c35]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#f1f8ed]
                hover:shadow-lg
              "
            >
              View All
              <FaArrowRight
                className="
                  text-xs
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          )}
        </div>

        {/* =====================================================
            LOADING STATE
        ====================================================== */}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#dbe8d7]
                  bg-white
                  shadow-sm
                "
              >
                {/* Image skeleton */}

                <div className="h-56 bg-gradient-to-r from-[#eef7eb] via-[#f7fbf4] to-[#eef7eb] animate-pulse" />

                {/* Content skeleton */}

                <div className="p-5 space-y-4">
                  <div className="h-3 w-20 rounded-full bg-[#eaf5e5] animate-pulse" />

                  <div className="h-5 w-3/4 rounded-full bg-[#eaf5e5] animate-pulse" />

                  <div className="h-4 w-full rounded-full bg-[#f1f6ef] animate-pulse" />

                  <div className="h-4 w-2/3 rounded-full bg-[#f1f6ef] animate-pulse" />

                  <div className="flex items-center justify-between pt-3">
                    <div className="h-7 w-20 rounded-full bg-[#eaf5e5] animate-pulse" />

                    <div className="h-11 w-11 rounded-xl bg-[#eaf5e5] animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {!loading && products.length === 0 && (
          <div
            className="
              flex
              min-h-[330px]
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border
              border-[#dbe8d7]
              bg-white
              px-6
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mb-5
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-[#eaf5e5]
                text-[#158447]
              "
            >
              <FaLeaf className="text-3xl" />
            </div>

            <h3 className="text-xl font-extrabold text-[#083f26]">
              No new products yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#718579]">
              New fresh products will appear here as soon as they are added to
              our store.
            </p>
          </div>
        )}

        {/* =====================================================
            PRODUCT GRID
        ====================================================== */}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const productName =
                product.productName || product.name || "Fresh Product";

              const productDescription =
                product.description ||
                "Fresh quality product selected for you.";

              const productImage =
                product.image ||
                "https://via.placeholder.com/600x500?text=Fresh+Product";

              const productPrice = product.price || 0;

              const inCart = isInCart(product.id);

              return (
                <article
                  key={product.id}
                  className="
                    group
                    relative
                    flex
                    flex-col
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-[#dbe8d7]
                    bg-white
                    shadow-[0_8px_22px_rgba(11,112,64,0.06)]
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-[#bfe09a]
                    hover:shadow-[0_24px_42px_rgba(7,92,53,0.18)]
                  "
                >
                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================== */}

                  <div
                    className="
                      relative
                      h-[220px]
                      cursor-pointer
                      overflow-hidden
                      bg-[#eef7eb]
                    "
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={productImage}
                      alt={productName}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-110
                      "
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/600x500?text=Fresh+Product";
                      }}
                    />

                    {/* Image overlay */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#06472a33]
                        via-transparent
                        to-[#06472a12]
                        pointer-events-none
                      "
                    />

                    {/* Shine effect */}

                    <div
                      className="
                        absolute
                        inset-0
                        -translate-x-full
                        bg-gradient-to-r
                        from-transparent
                        via-white/30
                        to-transparent
                        transition-transform
                        duration-1000
                        group-hover:translate-x-full
                        pointer-events-none
                      "
                    />

                    {/* New badge */}

                    <div
                      className="
                        absolute
                        left-3
                        top-3
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-white/70
                        bg-white/95
                        px-3
                        py-1.5
                        text-[11px]
                        font-extrabold
                        text-[#0b7040]
                        shadow-sm
                        backdrop-blur-md
                      "
                    >
                      <FaLeaf className="text-[10px]" />
                      NEW
                    </div>

                    {/* Category badge */}

                    {product.category && (
                      <span
                        className="
                          absolute
                          right-3
                          top-3
                          rounded-full
                          bg-[#0b7040]
                          px-3
                          py-1.5
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-wide
                          text-white
                          shadow-md
                        "
                      >
                        {product.category}
                      </span>
                    )}

                    {/* View product */}

                    <div
                      className="
                        absolute
                        bottom-3
                        left-1/2
                        -translate-x-1/2
                        translate-y-3
                        rounded-full
                        bg-white/95
                        px-4
                        py-2
                        text-xs
                        font-bold
                        text-[#075c35]
                        opacity-0
                        shadow-lg
                        transition-all
                        duration-300
                        group-hover:translate-y-0
                        group-hover:opacity-100
                      "
                    >
                      View Product
                    </div>
                  </div>

                  {/* =================================================
                      PRODUCT DETAILS
                  ================================================== */}

                  <div className="flex flex-1 flex-col p-5">
                    {/* Category */}

                    {product.category && (
                      <span className="mb-1 text-[10px] font-extrabold uppercase tracking-[1.2px] text-[#158447]">
                        {product.category}
                      </span>
                    )}

                    {/* Product name */}

                    <h3
                      className="
                        line-clamp-1
                        text-[18px]
                        font-extrabold
                        tracking-[-0.3px]
                        text-[#083f26]
                        transition-colors
                        duration-200
                        group-hover:text-[#0b7040]
                      "
                    >
                      {productName}
                    </h3>

                    {/* Description */}

                    <p
                      className="
                        mt-2
                        line-clamp-2
                        min-h-[42px]
                        text-[13px]
                        leading-5
                        text-[#718579]
                      "
                    >
                      {productDescription}
                    </p>

                    {/* Bottom section */}

                    <div className="mt-auto pt-5">
                      <div className="flex items-end justify-between gap-3">
                        {/* Price */}

                        <div>
                          <span className="block text-[11px] font-semibold text-[#718579]">
                            Fresh price
                          </span>

                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-[23px] font-black tracking-[-0.5px] text-[#0b7040]">
                              ₹{productPrice}
                            </span>

                            <span className="text-xs font-semibold text-[#718579]">
                              / 1kg
                            </span>
                          </div>
                        </div>

                        {/* Cart button */}

                        <button
                          type="button"
                          aria-label={
                            inCart
                              ? `Remove ${productName} from cart`
                              : `Add ${productName} to cart`
                          }
                          onClick={(e) => handleCartClick(e, product)}
                          className={`
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-[14px]
                            transition-all
                            duration-300
                            ${
                              inCart
                                ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                                : "bg-[#eaf5e5] text-[#0b7040] hover:bg-[#0b7040] hover:text-white"
                            }
                            hover:scale-105
                            hover:shadow-lg
                          `}
                        >
                          {inCart ? (
                            <FaTrash className="text-base" />
                          ) : (
                            <FaCartPlus className="text-base" />
                          )}
                        </button>
                      </div>

                      {/* Full-width cart status */}

                      <div
                        className={`
                          mt-4
                          rounded-xl
                          px-3
                          py-2
                          text-center
                          text-xs
                          font-bold
                          transition-all
                          duration-300
                          ${
                            inCart
                              ? "bg-[#fff0ed] text-[#d6453d]"
                              : "bg-[#f1f8ed] text-[#158447]"
                          }
                        `}
                      >
                        {inCart
                          ? "✓ Added to your cart"
                          : "Fresh • Quality • Delivered"}
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      BOTTOM GREEN ACCENT
                  ================================================== */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-1
                      w-full
                      origin-left
                      scale-x-0
                      bg-gradient-to-r
                      from-[#158447]
                      to-[#9bdd45]
                      transition-transform
                      duration-500
                      group-hover:scale-x-100
                    "
                  />
                </article>
              );
            })}
          </div>
        )}

        {/* =====================================================
            BOTTOM VIEW ALL
        ====================================================== */}

        {!loading && products.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate("/products")}
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-2xl
                bg-[#0b7040]
                px-7
                py-3.5
                text-sm
                font-extrabold
                text-white
                shadow-[0_12px_25px_rgba(7,92,53,0.20)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#075c35]
                hover:shadow-[0_18px_30px_rgba(7,92,53,0.28)]
              "
            >
              Explore All Products
              <FaArrowRight
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default NewProducts;
