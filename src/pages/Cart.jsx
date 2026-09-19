// /* eslint-disable no-unused-vars */
// // src/pages/Cart.jsx

// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { useCart } from "../context/CartContext";
// import { db } from "../firebase";
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { motion, AnimatePresence } from "framer-motion";

// function Cart() {
//   const { cart, removeFromCart, updateQuantity, clearCart, user } = useCart();

//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [pendingOrder, setPendingOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [address, setAddress] = useState({
//     fullName: "",
//     houseNo: "",
//     street: "",
//     city: "",
//     phone: "",
//   });

//   // Validation form for address
//   const [errors, setErrors] = useState({});

//   const validateAndSubmit = () => {
//     let newErrors = {};

//     if (!address.fullName.trim()) newErrors.fullName = "Full name is required";

//     if (!address.houseNo.trim()) newErrors.houseNo = "House No is required";

//     if (!address.street.trim()) newErrors.street = "Street is required";

//     if (!address.city.trim()) newErrors.city = "City is required";

//     if (!/^\d{10}$/.test(address.phone)) {
//       newErrors.phone = "Enter a valid 10-digit phone number";
//     }

//     setErrors(newErrors);

//     // If no errors, place order
//     if (Object.keys(newErrors).length === 0) {
//       placeOrderWithAddress();
//     }
//   };

//   // Fake loading (initial)
//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1500);

//     return () => clearTimeout(timer);
//   }, []);

//   const totalAmount = cart.reduce(
//     (sum, item) => sum + item.price * (item.quantity || 1),
//     0,
//   );

//   const clearCartSafe = () => {
//     if (typeof clearCart === "function") {
//       clearCart();
//       return;
//     }

//     cart.forEach((i) => removeFromCart(i.id));
//   };

//   const handleOrderNow = () => {
//     if (!cart || cart.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     setShowAddressForm(true);
//   };

//   const placeOrderWithAddress = () => {
//     if (
//       !address.fullName ||
//       !address.houseNo ||
//       !address.street ||
//       !address.city ||
//       !address.phone
//     ) {
//       alert("Please fill all address fields!");
//       return;
//     }

//     const snapshot = {
//       id: Date.now().toString(),
//       items: cart.map((it) => ({ ...it })),
//       total: totalAmount,
//       placedAt: new Date().toISOString(),
//       address: { ...address },
//     };

//     // WhatsApp Message
//     let message = "🛒 Order Details:\n\n";

//     snapshot.items.forEach((item, index) => {
//       message += `${index + 1}. ${item.name} (x${
//         item.quantity || 1
//       }) - ₹${item.price * (item.quantity || 1)}\n`;
//     });

//     message += `\n💰 Total Amount: ₹${snapshot.total}`;
//     message += `\n\n👤 Name: ${address.fullName}`;
//     message += `\n🏠 House No: ${address.houseNo}`;
//     message += `\n📍 Address: ${address.street}, ${address.city}`;
//     message += `\n📞 Phone: ${address.phone}\n\nPlease confirm my order. ✅`;

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappLink = `https://wa.me/918825875206?text=${encodedMessage}`;

//     window.open(whatsappLink, "_blank");

//     setPendingOrder(snapshot);
//     setShowAddressForm(false);
//     setShowSuccess(true);
//   };

//   const handleSuccessOk = async () => {
//     if (!pendingOrder || !user) {
//       setShowSuccess(false);
//       return;
//     }

//     setSaving(true);

//     try {
//       const ordersRef = doc(db, "orders", user.uid);
//       const docSnap = await getDoc(ordersRef);

//       if (docSnap.exists()) {
//         await updateDoc(ordersRef, {
//           data: arrayUnion(pendingOrder),
//         });
//       } else {
//         await setDoc(ordersRef, {
//           data: [pendingOrder],
//         });
//       }

//       clearCartSafe();

//       setPendingOrder(null);
//       setShowSuccess(false);

//       setAddress({
//         fullName: "",
//         houseNo: "",
//         street: "",
//         city: "",
//         phone: "",
//       });

//       setErrors({});
//     } catch (err) {
//       console.error("Error saving order:", err);
//       alert("Failed to save order.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f7fbf4] flex flex-col text-[#083f26] relative">
//       <Navbar />

//       {/* =========================================================
//           CART SECTION
//       ========================================================= */}
//       <div className="flex-grow p-6">
//         <div className="bg-white border border-[#dbe8d7] rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
//           <h1 className="text-2xl font-bold text-[#075c35] mb-6">
//             Shopping Cart
//           </h1>

//           {cart.length === 0 ? (
//             <div className="py-12 text-center">
//               <p className="text-[#718579] text-lg">Your cart is empty.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               {/* =====================================================
//                   CART TABLE
//               ===================================================== */}
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-[#eaf5e5] text-[#075c35] border-b border-[#dbe8d7]">
//                     <th className="p-3 text-left">Item</th>

//                     <th className="p-3 text-center">Quantity</th>

//                     <th className="p-3 text-center">Price</th>

//                     <th className="p-3 text-center">Amount</th>

//                     <th className="p-3 text-center">Remove</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <AnimatePresence>
//                     {cart.map((item) => (
//                       <motion.tr
//                         key={item.id}
//                         layout
//                         initial={{
//                           opacity: 0,
//                           y: 30,
//                         }}
//                         animate={{
//                           opacity: 1,
//                           y: 0,
//                         }}
//                         exit={{
//                           opacity: 0,
//                           y: -30,
//                         }}
//                         className="border-b border-[#dbe8d7] hover:bg-[#f7fbf4] transition"
//                       >
//                         {/* ITEM */}
//                         <td className="p-4 flex items-center gap-4">
//                           <motion.img
//                             src={item.image}
//                             alt={item.name}
//                             className="w-16 h-16 object-cover rounded-lg shadow-sm border border-[#dbe8d7]"
//                             layout
//                           />

//                           <div>
//                             <h2 className="font-semibold text-[#083f26]">
//                               {item.name}
//                             </h2>
//                           </div>
//                         </td>

//                         {/* QUANTITY */}
//                         <td className="p-4 text-center">
//                           <div className="flex justify-center items-center gap-2">
//                             {/* Minus */}
//                             <button
//                               onClick={() =>
//                                 updateQuantity(
//                                   item.id,
//                                   Math.max(1, (item.quantity || 1) - 1),
//                                 )
//                               }
//                               className="w-8 h-8 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-lg font-bold transition"
//                             >
//                               -
//                             </button>

//                             {/* Quantity */}
//                             <span className="px-3 py-1 bg-[#f7fbf4] border border-[#dbe8d7] text-[#083f26] rounded-lg font-medium min-w-[42px]">
//                               {item.quantity || 1}
//                             </span>

//                             {/* Plus */}
//                             <button
//                               onClick={() =>
//                                 updateQuantity(
//                                   item.id,
//                                   (item.quantity || 1) + 1,
//                                 )
//                               }
//                               className="w-8 h-8 bg-[#158447] hover:bg-[#0b7040] text-white rounded-lg font-bold transition"
//                             >
//                               +
//                             </button>
//                           </div>
//                         </td>

//                         {/* PRICE */}
//                         <td className="p-4 text-center text-[#158447] font-medium">
//                           ₹{item.price}
//                         </td>

//                         {/* AMOUNT */}
//                         <td className="p-4 text-center font-semibold text-[#083f26]">
//                           ₹{item.price * (item.quantity || 1)}
//                         </td>

//                         {/* REMOVE */}
//                         <td className="p-4 text-center">
//                           <button
//                             onClick={() => removeFromCart(item.id)}
//                             className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
//                           >
//                             ✕
//                           </button>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </AnimatePresence>
//                 </tbody>
//               </table>

//               {/* =====================================================
//                   TOTAL & ORDER
//               ===================================================== */}
//               <div className="flex justify-between items-center mt-6 gap-4">
//                 <p className="text-lg font-semibold text-[#083f26]">
//                   Total: <span className="text-[#158447]">₹{totalAmount}</span>
//                 </p>

//                 <button
//                   onClick={handleOrderNow}
//                   className="bg-[#075c35] hover:bg-[#0b7040] text-white px-6 py-3 rounded-xl shadow-md font-medium transition duration-200"
//                 >
//                   Order Via WhatsApp →
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <Footer />

//       {/* =========================================================
//           LOADER OVERLAY
//       ========================================================= */}
//       <AnimatePresence>
//         {(loading || saving) && (
//           <motion.div
//             className="fixed inset-0 bg-[#f7fbf4]/90 flex justify-center items-center z-50 backdrop-blur-sm"
//             initial={{
//               opacity: 0,
//             }}
//             animate={{
//               opacity: 1,
//             }}
//             exit={{
//               opacity: 0,
//             }}
//             transition={{
//               duration: 0.25,
//             }}
//           >
//             <div className="flex flex-col items-center">
//               <img
//                 src="https://i.gifer.com/ZZ5H.gif"
//                 alt="Loading..."
//                 className="w-20 h-20 mb-4"
//               />

//               <p className="text-[#52665b] font-medium">
//                 {saving ? "Processing your order..." : "Loading your cart..."}
//               </p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* =========================================================
//           ADDRESS FORM MODAL
//       ========================================================= */}
//       <AnimatePresence>
//         {showAddressForm && (
//           <motion.div
//             className="fixed inset-0 bg-[#083f26]/60 flex justify-center items-center z-50 px-4"
//             initial={{
//               opacity: 0,
//             }}
//             animate={{
//               opacity: 1,
//             }}
//             exit={{
//               opacity: 0,
//             }}
//           >
//             <motion.div
//               className="bg-white border border-[#dbe8d7] rounded-2xl p-6 shadow-xl max-w-sm w-full"
//               initial={{
//                 scale: 0.95,
//                 opacity: 0,
//               }}
//               animate={{
//                 scale: 1,
//                 opacity: 1,
//               }}
//               exit={{
//                 scale: 0.95,
//                 opacity: 0,
//               }}
//             >
//               <h2 className="text-xl font-semibold mb-4 text-[#075c35]">
//                 Enter Delivery Address
//               </h2>

//               {/* Address Form */}
//               {["fullName", "houseNo", "street", "city", "phone"].map(
//                 (field) => (
//                   <div key={field} className="mb-3">
//                     <input
//                       type={field === "phone" ? "tel" : "text"}
//                       placeholder={
//                         field === "fullName"
//                           ? "Full Name"
//                           : field === "houseNo"
//                             ? "House No"
//                             : field === "street"
//                               ? "Street"
//                               : field === "city"
//                                 ? "City"
//                                 : "Phone Number"
//                       }
//                       value={address[field]}
//                       onChange={(e) => {
//                         // Clear error on change
//                         setAddress({
//                           ...address,
//                           [field]: e.target.value,
//                         });

//                         if (errors?.[field]) {
//                           setErrors((prev) => ({
//                             ...prev,
//                             [field]: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full px-3 py-2 border rounded-lg bg-white text-[#083f26] placeholder-[#9aa99f] focus:outline-none focus:ring-2 focus:ring-[#158447] transition ${
//                         errors?.[field]
//                           ? "border-red-500"
//                           : "border-[#dbe8d7] focus:border-[#158447]"
//                       }`}
//                     />

//                     {errors?.[field] && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors[field]}
//                       </p>
//                     )}
//                   </div>
//                 ),
//               )}

//               <div className="flex justify-end gap-4 mt-4">
//                 {/* Cancel */}
//                 <button
//                   onClick={() => setShowAddressForm(false)}
//                   className="px-4 py-2 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-lg font-medium transition"
//                 >
//                   Cancel
//                 </button>

//                 {/* Place Order */}
//                 <button
//                   onClick={validateAndSubmit}
//                   className="px-4 py-2 bg-[#075c35] hover:bg-[#0b7040] text-white rounded-lg font-medium transition"
//                 >
//                   Place Order
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* =========================================================
//           SUCCESS MODAL
//       ========================================================= */}
//       <AnimatePresence>
//         {showSuccess && (
//           <motion.div
//             className="fixed inset-0 bg-[#083f26]/60 flex justify-center items-center z-50 px-4"
//             initial={{
//               opacity: 0,
//             }}
//             animate={{
//               opacity: 1,
//             }}
//             exit={{
//               opacity: 0,
//             }}
//           >
//             <motion.div
//               className="bg-white border border-[#dbe8d7] rounded-2xl p-6 shadow-xl max-w-sm w-full text-center"
//               initial={{
//                 scale: 0.95,
//                 opacity: 0,
//               }}
//               animate={{
//                 scale: 1,
//                 opacity: 1,
//               }}
//               exit={{
//                 scale: 0.95,
//                 opacity: 0,
//               }}
//             >
//               <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#eaf5e5] flex items-center justify-center text-3xl">
//                 ✅
//               </div>

//               <h2 className="text-xl font-semibold mb-4 text-[#075c35]">
//                 Order Placed!
//               </h2>

//               <p className="text-[#718579] mb-6">
//                 Your order has been placed successfully. We’ll contact you soon.
//               </p>

//               <button
//                 onClick={handleSuccessOk}
//                 disabled={saving}
//                 className="px-6 py-2 bg-[#075c35] hover:bg-[#0b7040] disabled:bg-[#9aa99f] text-white rounded-lg font-medium transition"
//               >
//                 {saving ? "Saving..." : "OK"}
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Cart;

/* eslint-disable no-unused-vars */
// src/pages/Cart.jsx

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DeliveryDetailsModal from "../components/DeliveryDetailsModal";
import PaymentModal from "../components/PaymentModal";
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

  /* ---------- NEW: Place Order (details + payment) state ---------- */
  const [showDetails, setShowDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [checkout, setCheckout] = useState(null); // { items, total } snapshot

  const [address, setAddress] = useState({
    fullName: "",
    houseNo: "",
    street: "",
    city: "",
    phone: "",
  });

  // Validation form for address
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
    0,
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

  /* =========================================================
      NEW: PLACE ORDER FLOW
      Place Order -> Delivery details popup -> Payment popup
  ========================================================= */
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

  // "Pay Now" inside the details popup
  const handleDetailsSubmit = (details) => {
    setDeliveryDetails(details);

    // freeze the cart so the amount can't change while paying
    setCheckout({
      items: cart.map((it) => ({ ...it })),
      total: totalAmount,
    });

    setShowDetails(false);
    setShowPayment(true);
  };

  // "Back" / "Change" inside the payment popup
  const handlePaymentBack = () => {
    setShowPayment(false);
    setShowDetails(true);
  };

  // X / outside click on the payment popup (before paying)
  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  // "Done" on the success screen
  const handlePaymentDone = () => {
    setShowPayment(false);
    setCheckout(null);
    setDeliveryDetails(null);
  };

  // Called by PaymentModal after the payment succeeds
  const handlePaymentComplete = async (payment) => {
    if (!user) throw new Error("Please log in to place an order.");

    const order = {
      id: Date.now().toString(),
      items: checkout.items,
      total: checkout.total,
      placedAt: new Date().toISOString(),
      status: "placed",
      payment,
      // same shape as your existing orders, plus the new fields
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
      await updateDoc(ordersRef, { data: arrayUnion(order) });
    } else {
      await setDoc(ordersRef, { data: [order] });
    }

    clearCartSafe();
  };

  /* =========================================================
      EXISTING: WHATSAPP ORDER FLOW (unchanged)
  ========================================================= */
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
      message += `${index + 1}. ${item.name} (x${
        item.quantity || 1
      }) - ₹${item.price * (item.quantity || 1)}\n`;
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
    setShowSuccess(true);
  };

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

  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#f7fbf4] flex flex-col text-[#083f26] relative">
      <Navbar />

      {/* =========================================================
          CART SECTION
      ========================================================= */}
      <div className="flex-grow p-6">
        <div className="bg-white border border-[#dbe8d7] rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-[#075c35] mb-6">
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[#718579] text-lg">Your cart is empty.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* =====================================================
                  CART TABLE
              ===================================================== */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#eaf5e5] text-[#075c35] border-b border-[#dbe8d7]">
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
                        {/* ITEM */}
                        <td className="p-4 flex items-center gap-4">
                          <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm border border-[#dbe8d7]"
                            layout
                          />

                          <div>
                            <h2 className="font-semibold text-[#083f26]">
                              {item.name}
                            </h2>
                          </div>
                        </td>

                        {/* QUANTITY */}
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-2">
                            {/* Minus */}
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, (item.quantity || 1) - 1),
                                )
                              }
                              className="w-8 h-8 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-lg font-bold transition"
                            >
                              -
                            </button>

                            {/* Quantity */}
                            <span className="px-3 py-1 bg-[#f7fbf4] border border-[#dbe8d7] text-[#083f26] rounded-lg font-medium min-w-[42px]">
                              {item.quantity || 1}
                            </span>

                            {/* Plus */}
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.quantity || 1) + 1,
                                )
                              }
                              className="w-8 h-8 bg-[#158447] hover:bg-[#0b7040] text-white rounded-lg font-bold transition"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* PRICE */}
                        <td className="p-4 text-center text-[#158447] font-medium">
                          ₹{item.price}
                        </td>

                        {/* AMOUNT */}
                        <td className="p-4 text-center font-semibold text-[#083f26]">
                          ₹{item.price * (item.quantity || 1)}
                        </td>

                        {/* REMOVE */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                          >
                            ✕
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* =====================================================
                  TOTAL & ORDER BUTTONS
              ===================================================== */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4">
                <p className="text-lg font-semibold text-[#083f26]">
                  Total: <span className="text-[#158447]">₹{totalAmount}</span>
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {/* NEW: Place Order (opens details popup, then payment) */}
                  <button
                    onClick={handlePlaceOrder}
                    className="bg-gradient-to-r from-[#075c35] to-[#158447] hover:-translate-y-0.5 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg font-semibold transition duration-200"
                  >
                    Place Order
                  </button>

                  {/* EXISTING: WhatsApp order */}
                  <button
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
      </div>

      <Footer />

      {/* =========================================================
          NEW: DELIVERY DETAILS POPUP  (Cancel / Pay Now)
      ========================================================= */}
      <DeliveryDetailsModal
        open={showDetails}
        initialValues={deliveryDetails}
        itemCount={itemCount}
        total={totalAmount}
        onCancel={() => setShowDetails(false)}
        onSubmit={handleDetailsSubmit}
      />

      {/* =========================================================
          NEW: PAYMENT POPUP (separate component)
      ========================================================= */}
      <PaymentModal
        open={showPayment}
        amount={checkout?.total ?? 0}
        customer={deliveryDetails}
        onBack={handlePaymentBack}
        onClose={handlePaymentClose}
        onPaymentComplete={handlePaymentComplete}
        onDone={handlePaymentDone}
      />

      {/* =========================================================
          LOADER OVERLAY
      ========================================================= */}
      <AnimatePresence>
        {(loading || saving) && (
          <motion.div
            className="fixed inset-0 bg-[#f7fbf4]/90 flex justify-center items-center z-50 backdrop-blur-sm"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <div className="flex flex-col items-center">
              <img
                src="https://i.gifer.com/ZZ5H.gif"
                alt="Loading..."
                className="w-20 h-20 mb-4"
              />

              <p className="text-[#52665b] font-medium">
                {saving ? "Processing your order..." : "Loading your cart..."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          ADDRESS FORM MODAL (WhatsApp flow)
      ========================================================= */}
      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            className="fixed inset-0 bg-[#083f26]/60 flex justify-center items-center z-50 px-4"
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
              className="bg-white border border-[#dbe8d7] rounded-2xl p-6 shadow-xl max-w-sm w-full"
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
              <h2 className="text-xl font-semibold mb-4 text-[#075c35]">
                Enter Delivery Address
              </h2>

              {/* Address Form */}
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
                        // Clear error on change
                        setAddress({
                          ...address,
                          [field]: e.target.value,
                        });

                        if (errors?.[field]) {
                          setErrors((prev) => ({
                            ...prev,
                            [field]: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg bg-white text-[#083f26] placeholder-[#9aa99f] focus:outline-none focus:ring-2 focus:ring-[#158447] transition ${
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

              <div className="flex justify-end gap-4 mt-4">
                {/* Cancel */}
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 bg-[#eaf5e5] hover:bg-[#dcefd5] text-[#075c35] border border-[#dbe8d7] rounded-lg font-medium transition"
                >
                  Cancel
                </button>

                {/* Place Order */}
                <button
                  onClick={validateAndSubmit}
                  className="px-4 py-2 bg-[#075c35] hover:bg-[#0b7040] text-white rounded-lg font-medium transition"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          SUCCESS MODAL (WhatsApp flow)
      ========================================================= */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-[#083f26]/60 flex justify-center items-center z-50 px-4"
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
              className="bg-white border border-[#dbe8d7] rounded-2xl p-6 shadow-xl max-w-sm w-full text-center"
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#eaf5e5] flex items-center justify-center text-3xl">
                ✅
              </div>

              <h2 className="text-xl font-semibold mb-4 text-[#075c35]">
                Order Placed!
              </h2>

              <p className="text-[#718579] mb-6">
                Your order has been placed successfully. We’ll contact you soon.
              </p>

              <button
                onClick={handleSuccessOk}
                disabled={saving}
                className="px-6 py-2 bg-[#075c35] hover:bg-[#0b7040] disabled:bg-[#9aa99f] text-white rounded-lg font-medium transition"
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
