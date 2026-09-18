/* eslint-disable no-unused-vars */
// src/pages/Cart.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, user } = useCart();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    fullName: "",
    houseNo: "",
    street: "",
    city: "",
    phone: "",
  });

  // validation form for address
  const [errors, setErrors] = useState({});

  const validateAndSubmit = () => {
    let newErrors = {};

    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.houseNo.trim()) newErrors.houseNo = "House No is required";
    if (!address.street.trim()) newErrors.street = "Street is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!/^\d{10}$/.test(address.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);

    // If no errors, place order
    if (Object.keys(newErrors).length === 0) {
      placeOrderWithAddress();
    }
  };

  // Fake loading (initial)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const clearCartSafe = () => {
    if (typeof clearCart === "function") {
      clearCart();
      return;
    }
    cart.forEach((i) => removeFromCart(i.id));
  };

  const handleOrderNow = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowAddressForm(true);
  };

  const placeOrderWithAddress = () => {
    if (
      !address.fullName ||
      !address.houseNo ||
      !address.street ||
      !address.city ||
      !address.phone
    ) {
      alert("Please fill all address fields!");
      return;
    }

    const snapshot = {
      id: Date.now().toString(),
      items: cart.map((it) => ({ ...it })),
      total: totalAmount,
      placedAt: new Date().toISOString(),
      address: { ...address },
    };

    // WhatsApp Message
    let message = "🛒 Order Details:\n\n";
    snapshot.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.quantity || 1}) - ₹${
        item.price * (item.quantity || 1)
      }\n`;
    });
    message += `\n💰 Total Amount: ₹${snapshot.total}`;
    message += `\n\n👤 Name: ${address.fullName}`;
    message += `\n🏠 House No: ${address.houseNo}`;
    message += `\n📍 Address: ${address.street}, ${address.city}`;
    message += `\n📞 Phone: ${address.phone}\n\nPlease confirm my order. ✅`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/918825875206?text=${encodedMessage}`;
    window.open(whatsappLink, "_blank");

    setPendingOrder(snapshot);
    setShowAddressForm(false);
    setShowSuccess(true); // show the success modal next
  };

  const handleSuccessOk = async () => {
    if (!pendingOrder || !user) {
      setShowSuccess(false);
      return;
    }

    setSaving(true); // <-- overlay will appear while saving

    try {
      const ordersRef = doc(db, "orders", user.uid);
      const docSnap = await getDoc(ordersRef);

      if (docSnap.exists()) {
        await updateDoc(ordersRef, {
          data: arrayUnion(pendingOrder),
        });
      } else {
        await setDoc(ordersRef, { data: [pendingOrder] });
      }

      clearCartSafe();
      setPendingOrder(null);
      setShowSuccess(false);
      setAddress({
        fullName: "",
        houseNo: "",
        street: "",
        city: "",
        phone: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Failed to save order.");
    } finally {
      setSaving(false); // <-- hide overlay when done
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-gray-100 relative">
      <Navbar />

      {/* Cart Section */}
      <div className="flex-grow p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Your cart is empty.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-center">Price</th>
                    <th className="p-3 text-center">Amount</th>
                    <th className="p-3 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="border-b border-gray-200 dark:border-gray-600"
                      >
                        <td className="p-4 flex items-center gap-4">
                          <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg shadow"
                            layout
                          />
                          <div>
                            <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                              {item.name}
                            </h2>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, (item.quantity || 1) - 1)
                                )
                              }
                              className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-center text-orange-600 dark:text-orange-400 font-medium">
                          ₹{item.price}
                        </td>
                        <td className="p-4 text-center font-semibold">
                          ₹{item.price * (item.quantity || 1)}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                          >
                            ✕
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* Total & Order */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-lg font-semibold">
                  Total:{" "}
                  <span className="text-orange-600 dark:text-orange-400">
                    ₹{totalAmount}
                  </span>
                </p>
                <button
                  onClick={handleOrderNow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md font-medium"
                >
                  Order Now →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Loader Overlay (shows while initial loading or while saving to Firestore) */}
      <AnimatePresence>
        {(loading || saving) && (
          <motion.div
            className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex justify-center items-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col items-center">
              {/* you can replace this GIF URL with your own spinner if needed */}
              <img
                src="https://i.gifer.com/ZZ5H.gif"
                alt="Loading..."
                className="w-20 h-20 mb-4"
              />
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {saving ? "Processing your order..." : "Loading your cart..."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Form Modal */}
      <AnimatePresence>
        {showAddressForm && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Enter Delivery Address
              </h2>

              {/* Address Form with Validation */}
              {["fullName", "houseNo", "street", "city", "phone"].map(
                (field) => (
                  <div key={field} className="mb-3">
                    <input
                      type={field === "phone" ? "tel" : "text"}
                      placeholder={
                        field === "fullName"
                          ? "Full Name"
                          : field === "houseNo"
                          ? "House No"
                          : field === "street"
                          ? "Street"
                          : field === "city"
                          ? "City"
                          : "Phone Number"
                      }
                      value={address[field]}
                      onChange={(e) => {
                        // clear error on change for that field
                        setAddress({ ...address, [field]: e.target.value });
                        if (errors?.[field]) {
                          setErrors((prev) => ({
                            ...prev,
                            [field]: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                        errors?.[field] ? "border-red-500" : ""
                      }`}
                    />
                    {errors?.[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                )
              )}

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={validateAndSubmit}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
              <h2 className="text-xl font-semibold mb-4 text-orange-600">
                ✅ Order Placed!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your order has been placed successfully. We’ll contact you soon.
              </p>
              <button
                onClick={handleSuccessOk}
                disabled={saving}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                {saving ? "Saving..." : "OK"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Cart;
