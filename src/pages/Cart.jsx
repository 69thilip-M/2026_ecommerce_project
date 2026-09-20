// src/pages/Cart.jsx

import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import DeliveryDetailsModal from "../components/DeliveryDetailsModal";
import PaymentModal from "../components/PaymentModal";

import { useCart } from "../context/CartContext";

import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// =========================================================
// WEIGHT OPTIONS
// =========================================================

const WEIGHT_OPTIONS = [
  {
    value: 0.25,
    label: "250 g",
  },
  {
    value: 0.5,
    label: "500 g",
  },
  {
    value: 0.75,
    label: "750 g",
  },
  {
    value: 1,
    label: "1 KG",
  },
  {
    value: 1.5,
    label: "1.5 KG",
  },
  {
    value: 2,
    label: "2 KG",
  },
  {
    value: 2.5,
    label: "2.5 KG",
  },
  {
    value: 3,
    label: "3 KG",
  },
];

// =========================================================
// FORMAT WEIGHT
// =========================================================

const formatWeight = (weight) => {
  if (weight < 1) {
    return `${weight * 1000} g`;
  }

  return `${weight} KG`;
};

// =========================================================
// FORMAT PRICE
// =========================================================

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("en-IN");
};

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, user } = useCart();

  // =========================================================
  // MODAL STATES
  // =========================================================

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [saving, setSaving] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  // =========================================================
  // CHECKOUT FLOW
  // =========================================================

  const [showDetails, setShowDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [checkout, setCheckout] = useState(null);

  // =========================================================
  // WEIGHT STATE
  //
  // Each cart item gets its own weight.
  // Default = 1 KG
  // =========================================================

  const [itemWeights, setItemWeights] = useState(() => {
    const initialWeights = {};

    cart.forEach((item) => {
      initialWeights[item.id] = item.weight || 1;
    });

    return initialWeights;
  });

  // =========================================================
  // KEEP WEIGHTS IN SYNC WITH CART
  // =========================================================

  useEffect(() => {
    setItemWeights((previous) => {
      const updated = { ...previous };

      cart.forEach((item) => {
        if (!updated[item.id]) {
          updated[item.id] = item.weight || 1;
        }
      });

      return updated;
    });
  }, [cart]);

  // =========================================================
  // UPDATE WEIGHT
  // =========================================================

  const updateWeight = (itemId, weight) => {
    setItemWeights((previous) => ({
      ...previous,
      [itemId]: Number(weight),
    }));
  };

  // =========================================================
  // GET ITEM WEIGHT
  // =========================================================

  const getItemWeight = (item) => {
    return Number(itemWeights[item.id] || item.weight || 1);
  };

  // =========================================================
  // GET SINGLE ITEM TOTAL
  //
  // item.price = price for 1 KG
  //
  // Example:
  // price = ₹200
  // weight = 0.5
  // quantity = 2
  //
  // total = 200 × 0.5 × 2
  //       = ₹200
  // =========================================================

  const getItemTotal = (item) => {
    const weight = getItemWeight(item);
    const quantity = item.quantity || 1;

    return Number(item.price || 0) * weight * quantity;
  };

  // =========================================================
  // TOTAL AMOUNT
  // =========================================================

  const totalAmount = cart.reduce((sum, item) => {
    return sum + getItemTotal(item);
  }, 0);

  // =========================================================
  // TOTAL QUANTITY
  // =========================================================

  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // =========================================================
  // LOCK BACKGROUND SCROLL
  //
  // This works for:
  // Delivery popup
  // Payment popup
  // WhatsApp address popup
  // Success popup
  // =========================================================

  const modalOpen =
    showDetails || showPayment || showAddressForm || showSuccess;

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    // Prevent small layout jump caused by scrollbar disappearing
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [modalOpen]);

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCartSafe = () => {
    if (typeof clearCart === "function") {
      clearCart();
      return;
    }

    cart.forEach((item) => {
      removeFromCart(item.id);
    });
  };

  // =========================================================
  // WHATSAPP ADDRESS
  // =========================================================

  const [address, setAddress] = useState({
    fullName: "",
    houseNo: "",
    street: "",
    city: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // =========================================================
  // WHATSAPP ADDRESS VALIDATION
  // =========================================================

  const validateAndSubmit = () => {
    const newErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!address.houseNo.trim()) {
      newErrors.houseNo = "House No is required";
    }

    if (!address.street.trim()) {
      newErrors.street = "Street is required";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!/^\d{10}$/.test(address.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      placeOrderWithAddress();
    }
  };

  // =========================================================
  // WHATSAPP ORDER
  // =========================================================

  const handleOrderNow = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setShowAddressForm(true);
  };

  // =========================================================
  // CREATE WHATSAPP ORDER
  // =========================================================

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

      items: cart.map((item) => {
        const weight = getItemWeight(item);
        const quantity = item.quantity || 1;
        const unitPrice = Number(item.price || 0);

        return {
          ...item,

          weight,
          weightLabel: formatWeight(weight),

          quantity,

          unitPrice,

          amount: unitPrice * weight * quantity,
        };
      }),

      total: totalAmount,

      placedAt: new Date().toISOString(),

      address: {
        ...address,
      },
    };

    // =======================================================
    // WHATSAPP MESSAGE
    // =======================================================

    let message = "🛒 Order Details:\n\n";

    snapshot.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;

      message += `   Weight: ${item.weightLabel}\n`;

      message += `   Quantity: ${item.quantity}\n`;

      message += `   Price: ₹${formatPrice(item.unitPrice)}/KG\n`;

      message += `   Amount: ₹${formatPrice(item.amount)}\n\n`;
    });

    message += `💰 Total Amount: ₹${formatPrice(snapshot.total)}`;

    message += `\n\n👤 Name: ${address.fullName}`;

    message += `\n🏠 House No: ${address.houseNo}`;

    message += `\n📍 Address: ${address.street}, ${address.city}`;

    message += `\n📞 Phone: ${address.phone}`;

    message += "\n\nPlease confirm my order. ✅";

    const encodedMessage = encodeURIComponent(message);

    const whatsappLink = `https://wa.me/918825875206?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");

    setPendingOrder(snapshot);

    setShowAddressForm(false);

    setShowSuccess(true);
  };

  // =========================================================
  // SAVE WHATSAPP ORDER
  // =========================================================

  const handleSuccessOk = async () => {
    if (!pendingOrder || !user) {
      setShowSuccess(false);
      return;
    }

    setSaving(true);

    try {
      const ordersRef = doc(db, "orders", user.uid);

      const docSnap = await getDoc(ordersRef);

      if (docSnap.exists()) {
        await updateDoc(ordersRef, {
          data: arrayUnion(pendingOrder),
        });
      } else {
        await setDoc(ordersRef, {
          data: [pendingOrder],
        });
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
      setSaving(false);
    }
  };

  // =========================================================
  // PLACE ORDER
  //
  // Delivery Details -> Payment
  // =========================================================

  const handlePlaceOrder = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    setShowDetails(true);
  };

  // =========================================================
  // DELIVERY DETAILS SUBMIT
  // =========================================================

  const handleDetailsSubmit = (details) => {
    setDeliveryDetails(details);

    // Freeze cart + weight snapshot
    setCheckout({
      items: cart.map((item) => {
        const weight = getItemWeight(item);
        const quantity = item.quantity || 1;
        const unitPrice = Number(item.price || 0);

        return {
          ...item,

          weight,
          weightLabel: formatWeight(weight),

          quantity,

          unitPrice,

          amount: unitPrice * weight * quantity,
        };
      }),

      total: totalAmount,
    });

    setShowDetails(false);

    setShowPayment(true);
  };

  // =========================================================
  // PAYMENT BACK
  // =========================================================

  const handlePaymentBack = () => {
    setShowPayment(false);

    setShowDetails(true);
  };

  // =========================================================
  // PAYMENT CLOSE
  // =========================================================

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  // =========================================================
  // PAYMENT DONE
  // =========================================================

  const handlePaymentDone = () => {
    setShowPayment(false);

    setCheckout(null);

    setDeliveryDetails(null);
  };

  // =========================================================
  // PAYMENT COMPLETE
  // =========================================================

  const handlePaymentComplete = async (payment) => {
    if (!user) {
      throw new Error("Please log in to place an order.");
    }

    if (!checkout || !deliveryDetails) {
      throw new Error("Order details are missing.");
    }

    const order = {
      id: Date.now().toString(),

      items: checkout.items,

      total: checkout.total,

      placedAt: new Date().toISOString(),

      status: "placed",

      payment,

      address: {
        fullName: deliveryDetails.fullName,

        houseNo: deliveryDetails.address1,

        street: deliveryDetails.address2,

        city: deliveryDetails.city,

        pincode: deliveryDetails.pincode,

        phone: deliveryDetails.mobile,

        altPhone: deliveryDetails.altPhone || "",

        instructions: deliveryDetails.instructions || "",
      },
    };

    const ordersRef = doc(db, "orders", user.uid);

    const docSnap = await getDoc(ordersRef);

    if (docSnap.exists()) {
      await updateDoc(ordersRef, {
        data: arrayUnion(order),
      });
    } else {
      await setDoc(ordersRef, {
        data: [order],
      });
    }

    clearCartSafe();
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7fbf4] flex flex-col text-[#083f26] relative overflow-x-hidden">
      <Navbar />

      {/* =====================================================
          CART SECTION
      ===================================================== */}

      <main className="page-content flex-grow px-4 py-20 sm:px-6 lg:px-10">
        <div className="bg-white border border-[#dbe8d7] rounded-2xl shadow-lg p-4 sm:p-6 max-w-6xl mx-auto">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#075c35]">
                Shopping Cart
              </h1>

              <p className="text-sm text-[#718579] mt-1">
                Select your preferred weight and quantity.
              </p>
            </div>

            {cart.length > 0 && (
              <div className="text-sm font-semibold text-[#158447]">
                {itemCount} item
                {itemCount !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[#718579] text-lg">Your cart is empty.</p>
            </div>
          ) : (
            <div>
              {/* =================================================
                  CART TABLE
              ================================================= */}

              <div className="overflow-x-auto rounded-xl border border-[#dbe8d7]">
                <table className="w-full border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-[#eaf5e5] text-[#075c35] border-b border-[#dbe8d7]">
                      <th className="p-3 text-left">Item</th>

                      <th className="p-3 text-center">KG</th>

                      <th className="p-3 text-center">Quantity</th>

                      <th className="p-3 text-center">Price / KG</th>

                      <th className="p-3 text-center">Amount</th>

                      <th className="p-3 text-center">Remove</th>
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence>
                      {cart.map((item) => {
                        const weight = getItemWeight(item);

                        const quantity = item.quantity || 1;

                        const itemTotal = getItemTotal(item);

                        return (
                          <motion.tr
                            key={item.id}
                            layout
                            initial={{
                              opacity: 0,
                              y: 30,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -30,
                            }}
                            className="border-b border-[#dbe8d7] hover:bg-[#f7fbf4] transition"
                          >
                            {/* =========================
                                ITEM
                            ========================== */}

                            <td className="p-4">
                              <div className="flex items-center gap-4 min-w-[220px]">
                                <motion.img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow-sm border border-[#dbe8d7] flex-shrink-0"
                                  layout
                                />

                                <div>
                                  <h2 className="font-semibold text-[#083f26]">
                                    {item.name}
                                  </h2>

                                  <p className="text-xs text-[#718579] mt-1">
                                    ₹{formatPrice(item.price)} per KG
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* =========================
                                KG / WEIGHT
                            ========================== */}

                            <td className="p-4 text-center">
                              <select
                                value={weight}
                                onChange={(e) =>
                                  updateWeight(item.id, Number(e.target.value))
                                }
                                className="min-w-[105px] px-3 py-2.5 bg-white border border-[#dbe8d7] rounded-lg text-[#075c35] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#158447] focus:border-[#158447] cursor-pointer"
                              >
                                {WEIGHT_OPTIONS.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* =========================
                                QUANTITY
                            ========================== */}

                            <td className="p-4 text-center">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      Math.max(1, quantity - 1),
                                    )
                                  }
                                  className="w-8 h-8 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-lg font-bold transition"
                                >
                                  -
                                </button>

                                <span className="px-3 py-1 bg-[#f7fbf4] border border-[#dbe8d7] text-[#083f26] rounded-lg font-medium min-w-[42px]">
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, quantity + 1)
                                  }
                                  className="w-8 h-8 bg-[#158447] hover:bg-[#0b7040] text-white rounded-lg font-bold transition"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* =========================
                                PRICE PER KG
                            ========================== */}

                            <td className="p-4 text-center text-[#158447] font-medium">
                              ₹{formatPrice(item.price)}
                            </td>

                            {/* =========================
                                AMOUNT
                            ========================== */}

                            <td className="p-4 text-center">
                              <div className="font-semibold text-[#083f26]">
                                ₹{formatPrice(itemTotal)}
                              </div>

                              <div className="text-xs text-[#718579] mt-1">
                                {formatWeight(weight)} × {quantity}
                              </div>
                            </td>

                            {/* =========================
                                REMOVE
                            ========================== */}

                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                              >
                                ✕
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  TOTAL & ORDER BUTTONS
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4">
                <div>
                  <p className="text-lg font-semibold text-[#083f26]">
                    Total:{" "}
                    <span className="text-[#158447]">
                      ₹{formatPrice(totalAmount)}
                    </span>
                  </p>

                  <p className="text-xs text-[#718579] mt-1">
                    Weight and quantity are included in the total.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* PLACE ORDER */}

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="bg-gradient-to-r from-[#075c35] to-[#158447] hover:-translate-y-0.5 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg font-semibold transition duration-200"
                  >
                    Place Order
                  </button>

                  {/* WHATSAPP ORDER */}

                  <button
                    type="button"
                    onClick={handleOrderNow}
                    className="bg-white hover:bg-[#f1f8ed] text-[#075c35] border border-[#075c35] px-6 py-3 rounded-xl font-medium transition duration-200"
                  >
                    Order Via WhatsApp →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* =========================================================
          DELIVERY DETAILS POPUP

          IMPORTANT:
          Wrapper z-index is higher than navbar.
      ========================================================= */}

      <div className="relative z-[10050]">
        <DeliveryDetailsModal
          open={showDetails}
          initialValues={deliveryDetails}
          itemCount={itemCount}
          total={totalAmount}
          onCancel={() => setShowDetails(false)}
          onSubmit={handleDetailsSubmit}
        />
      </div>

      {/* =========================================================
          PAYMENT POPUP
      ========================================================= */}

      <div className="relative z-[10050]">
        <PaymentModal
          open={showPayment}
          amount={checkout?.total ?? 0}
          customer={deliveryDetails}
          onBack={handlePaymentBack}
          onClose={handlePaymentClose}
          onPaymentComplete={handlePaymentComplete}
          onDone={handlePaymentDone}
        />
      </div>

      {/* =========================================================
          WHATSAPP ADDRESS FORM MODAL
      ========================================================= */}

      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            className="fixed inset-0 z-[10050] bg-[#083f26]/70 backdrop-blur-sm flex justify-center items-center px-4 py-6"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <motion.div
              className="bg-white border border-[#dbe8d7] rounded-2xl p-6 sm:p-7 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
            >
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-[#075c35]">
                  Enter Delivery Address
                </h2>

                <p className="text-sm text-[#718579] mt-1">
                  Enter your delivery details to continue with WhatsApp
                  ordering.
                </p>
              </div>

              {/* ADDRESS FORM */}

              {["fullName", "houseNo", "street", "city", "phone"].map(
                (field) => (
                  <div key={field} className="mb-4">
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
                        setAddress({
                          ...address,
                          [field]:
                            field === "phone"
                              ? e.target.value.replace(/\D/g, "").slice(0, 10)
                              : e.target.value,
                        });

                        if (errors?.[field]) {
                          setErrors((prev) => ({
                            ...prev,
                            [field]: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl bg-white text-[#083f26] placeholder-[#9aa99f] focus:outline-none focus:ring-2 focus:ring-[#158447] transition ${
                        errors?.[field]
                          ? "border-red-500"
                          : "border-[#dbe8d7] focus:border-[#158447]"
                      }`}
                    />

                    {errors?.[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ),
              )}

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-5 py-3 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-xl font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={validateAndSubmit}
                  className="px-5 py-3 bg-[#075c35] hover:bg-[#0b7040] text-white rounded-xl font-semibold transition"
                >
                  Continue to WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          WHATSAPP SUCCESS MODAL
      ========================================================= */}

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-[10050] bg-[#083f26]/70 backdrop-blur-sm flex justify-center items-center px-4 py-6"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <motion.div
              className="bg-white border border-[#dbe8d7] rounded-2xl p-7 shadow-2xl max-w-md w-full text-center"
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#eaf5e5] flex items-center justify-center text-4xl">
                ✅
              </div>

              <h2 className="text-2xl font-bold mb-3 text-[#075c35]">
                Order Placed!
              </h2>

              <p className="text-[#718579] mb-6">
                Your order has been placed successfully. We’ll contact you soon.
              </p>

              {pendingOrder && (
                <div className="mb-5 rounded-xl bg-[#f7fbf4] border border-[#dbe8d7] p-4 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#718579]">Items</span>

                    <span className="font-semibold text-[#083f26]">
                      {pendingOrder.items.length}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-[#718579]">Total</span>

                    <span className="font-bold text-[#158447]">
                      ₹{formatPrice(pendingOrder.total)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSuccessOk}
                disabled={saving}
                className="w-full px-6 py-3 bg-[#075c35] hover:bg-[#0b7040] disabled:bg-[#9aa99f] text-white rounded-xl font-semibold transition"
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
