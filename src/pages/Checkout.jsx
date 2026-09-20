/* eslint-disable no-unused-vars */
// src/pages/Checkout.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutStepper from "../components/CheckoutStepper";

import { useCart } from "../context/CartContext";

import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaLock,
  FaTruck,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMobileAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaLeaf,
  FaShoppingBasket,
  FaUserCircle,
} from "react-icons/fa";

import {
  formatWeight,
  formatPrice,
  loadWeights,
  clearWeights,
} from "../utils/shop";

/* =====================================================
   SETTINGS
===================================================== */

// Change this if your "My orders" page lives on another route
const ORDERS_ROUTE = "/orders";

// Orders above this amount get free delivery (same offer as the home page)
const FREE_DELIVERY_MIN = 1000;

// last used delivery address is remembered on this device
const ADDRESS_KEY = "kmr_delivery_details";

/* =====================================================
   HELPERS
===================================================== */

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const getItemImage = (item) => item.image || item.imageUrl || item.img || "";

const readSavedAddress = () => {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const METHODS = [
  {
    id: "upi",
    label: "UPI",
    hint: "GPay · PhonePe · Paytm",
    Icon: FaMobileAlt,
  },
  {
    id: "card",
    label: "Card",
    hint: "Debit / Credit",
    Icon: FaCreditCard,
  },
  {
    id: "cod",
    label: "Cash",
    hint: "Pay on delivery",
    Icon: FaMoneyBillWave,
  },
];

const UPI_HANDLES = [
  ["GPay", "@okaxis"],
  ["PhonePe", "@ybl"],
  ["Paytm", "@paytm"],
];

const isAmex = (digits) => /^3[47]/.test(digits);

const detectBrand = (digits) => {
  if (/^4/.test(digits)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (isAmex(digits)) return "AMEX";
  if (/^(60|65|81|82|508)/.test(digits)) return "RuPay";
  return "";
};

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);

  if (isAmex(digits)) {
    const d = digits.slice(0, 15);

    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }

  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (value) => {
  const d = value.replace(/\D/g, "").slice(0, 4);

  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const luhnValid = (num) => {
  let sum = 0;
  let alt = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);

    if (alt) {
      n *= 2;

      if (n > 9) n -= 9;
    }

    sum += n;
    alt = !alt;
  }

  return sum % 10 === 0;
};

const inputCls = (error) =>
  `w-full rounded-xl border bg-[#fbfdf9] px-4 py-3 text-[15px] text-[#083f26] placeholder-[#9aa99f] outline-none transition focus:bg-white focus:ring-4 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-[#dbe8d7] focus:border-[#158447] focus:ring-[#158447]/15"
  }`;

/* =====================================================
   SMALL UI PIECES
===================================================== */

function FieldError({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1 block text-[12.5px] font-medium text-red-500"
        >
          {message}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function Field({ label, error, optional, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center justify-between text-[13px] font-bold text-[#083f26]">
        {label}

        {optional && (
          <span className="text-[11px] font-semibold text-[#9aa99f]">
            Optional
          </span>
        )}
      </span>

      {children}

      <FieldError message={error} />
    </label>
  );
}

function SectionCard({ number, title, subtitle, icon: Icon, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-sm"
    >
      <div className="flex items-center gap-4 border-b border-[#edf2ea] bg-gradient-to-r from-[#f4faf1] to-white px-5 py-4 sm:px-7">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#075c35] to-[#158447] text-base font-extrabold text-white shadow-md shadow-[#075c35]/25">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-[#083f26]">{title}</h2>

          <p className="text-xs text-[#718579]">{subtitle}</p>
        </div>

        <Icon className="hidden text-2xl text-[#9bc98a] sm:block" />
      </div>

      <div className="p-5 sm:p-7">{children}</div>
    </motion.section>
  );
}

/* Live card preview */

function CardPreview({ number, name, expiry }) {
  const digits = number.replace(/\s/g, "");
  const brand = detectBrand(digits);
  const masked = (digits + "•".repeat(16)).slice(0, 16);
  const shown = masked.replace(/(.{4})/g, "$1 ").trim();

  return (
    <div className="relative mb-5 h-44 max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-[#06472a] via-[#0b7040] to-[#5eaa32] p-5 text-white shadow-lg shadow-[#075c35]/25">
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />

      <div className="pointer-events-none absolute -bottom-14 left-10 h-36 w-36 rounded-full bg-[#9bdd45]/25" />

      <div className="relative flex items-start justify-between">
        <div className="h-8 w-11 rounded-md bg-gradient-to-br from-[#f4e3a1] to-[#d4b45a]" />

        <span className="text-sm font-extrabold italic tracking-wide">
          {brand || "CARD"}
        </span>
      </div>

      <p className="relative mt-5 font-mono text-[19px] tracking-[0.18em]">
        {shown}
      </p>

      <div className="relative mt-4 flex items-end justify-between text-[11px] uppercase tracking-wider text-white/85">
        <div className="min-w-0">
          <p className="text-[9px] text-white/60">Card holder</p>

          <p className="max-w-[190px] truncate text-[13px] font-semibold">
            {name || "Your name"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-white/60">Expires</p>

          <p className="text-[13px] font-semibold">{expiry || "MM/YY"}</p>
        </div>
      </div>
    </div>
  );
}

function Thumb({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-[#eaf5e5] to-[#d6ecce] text-[#158447] ${className}`}
      >
        <FaLeaf className="opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

/* =====================================================
   ORDER CONFIRMATION
===================================================== */

function Confirmation({ placed, onShop, onOrders }) {
  const { order, payment } = placed;

  const paid = payment.status === "paid";

  const methodLabel = METHODS.find((m) => m.id === payment.method)?.label;

  const rows = [
    ["Order ID", `#${order.id}`],
    ["Payment", paid ? `${methodLabel} · Paid` : "Cash on delivery"],
    ["Amount", formatINR(order.total)],
    ["Deliver to", `${order.address.fullName}, ${order.address.city}`],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-xl shadow-[#075c35]/10"
    >
      {/* HERO */}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#0b7040] to-[#158447] px-6 pb-9 pt-11 text-center">
        <div className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute -bottom-16 -right-8 h-44 w-44 rounded-full bg-[#9bdd45]/20" />

        <motion.div
          className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-white shadow-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          <svg viewBox="0 0 52 52" className="h-12 w-12">
            <motion.path
              d="M13 27l9 9 17-19"
              fill="none"
              stroke="#158447"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        <h2 className="relative mt-5 text-3xl font-extrabold text-white">
          Order placed!
        </h2>

        <p className="relative mt-2 text-sm text-white/85">
          {paid
            ? "Payment received. Thank you for shopping with KMR Fresh."
            : "Please keep cash ready when your order arrives."}
        </p>

        <p className="relative mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <FaTruck />
          Arriving in 20–30 minutes
        </p>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
        {/* DETAILS */}

        <div>
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-[#158447]">
            Order details
          </h3>

          <div className="rounded-2xl border border-dashed border-[#c9dcc4] bg-[#f7fbf4] p-4">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 py-1.5 text-sm"
              >
                <span className="text-[#718579]">{label}</span>

                <span className="break-all text-right font-semibold text-[#083f26]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ITEMS */}

        <div>
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-[#158447]">
            Items ({order.items.length})
          </h3>

          <ul className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <Thumb
                  src={getItemImage(item)}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-xl border border-[#dbe8d7]"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#083f26]">
                    {item.name}
                  </p>

                  <p className="text-xs text-[#718579]">
                    {item.weightLabel} × {item.quantity}
                  </p>
                </div>

                <span className="text-sm font-extrabold text-[#075c35]">
                  {formatINR(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BUTTONS */}

      <div className="flex flex-col gap-3 border-t border-[#edf2ea] bg-[#fbfdf9] p-6 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onShop}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition hover:-translate-y-0.5"
        >
          Continue shopping
          <FaArrowRight />
        </button>

        <button
          type="button"
          onClick={onOrders}
          className="rounded-2xl border border-[#075c35] bg-white px-7 py-3.5 text-sm font-extrabold text-[#075c35] transition hover:bg-[#f1f8ed]"
        >
          View my orders
        </button>
      </div>
    </motion.div>
  );
}

/* =====================================================
   PAGE
===================================================== */

function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart, removeFromCart, user } = useCart();

  /* ---------------- shipping ---------------- */

  const [form, setForm] = useState(() => ({
    fullName: user?.displayName || "",
    mobile: "",
    altPhone: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    instructions: "",
    ...readSavedAddress(),
  }));

  /* ---------------- payment ---------------- */

  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  /* ---------------- flow ---------------- */

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | processing | success
  const [errorMsg, setErrorMsg] = useState("");
  const [placed, setPlaced] = useState(null);

  const busy = status === "processing";

  const digits = card.number.replace(/\s/g, "");

  // the KG chosen on the Products / Cart page
  const [weights] = useState(loadWeights);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // lock page scroll while payment is processing
  useEffect(() => {
    if (!busy) return undefined;

    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [busy]);

  /* =====================================================
     ORDER LINES + TOTAL
  ===================================================== */

  const lines = useMemo(
    () =>
      cart.map((item) => {
        const weight =
          Number(weights[String(item.id)]) || Number(item.weight) || 1;

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
    [cart, weights],
  );

  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const remainingForFree = Math.max(FREE_DELIVERY_MIN - total, 0);

  const freeProgress = Math.min(total / FREE_DELIVERY_MIN, 1) * 100;

  /* =====================================================
     FORM HELPERS
  ===================================================== */

  const clearError = (key) => setErrors((p) => ({ ...p, [key]: undefined }));

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    clearError(key);
  };

  const validate = () => {
    const e = {};

    /* ----- shipping ----- */

    if (form.fullName.trim().length < 2) {
      e.fullName = "Enter your full name";
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      e.mobile = "Enter a valid 10-digit mobile number";
    }

    if (form.altPhone && !/^\d{10}$/.test(form.altPhone)) {
      e.altPhone = "Enter a valid 10-digit number";
    }

    if (!form.address1.trim()) {
      e.address1 = "House / flat number is required";
    }

    if (!form.address2.trim()) {
      e.address2 = "Street or area is required";
    }

    if (!form.city.trim()) {
      e.city = "City is required";
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      e.pincode = "Enter a 6-digit pincode";
    }

    /* ----- payment ----- */

    if (method === "upi") {
      if (!/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
        e.upiId = "Enter a valid UPI ID, e.g. name@okaxis";
      }
    }

    if (method === "card") {
      const len = isAmex(digits) ? 15 : 16;

      if (digits.length !== len || !luhnValid(digits)) {
        e.number = "Enter a valid card number";
      }

      if (card.name.trim().length < 2) {
        e.cardName = "Enter the name on your card";
      }

      const m = card.expiry.match(/^(\d{2})\/(\d{2})$/);

      if (!m) {
        e.expiry = "Use MM/YY";
      } else {
        const month = Number(m[1]);
        const year = 2000 + Number(m[2]);
        const now = new Date();

        const expired =
          year < now.getFullYear() ||
          (year === now.getFullYear() && month < now.getMonth() + 1);

        if (month < 1 || month > 12) e.expiry = "Invalid month";
        else if (expired) e.expiry = "Card has expired";
      }

      const cvvLen = isAmex(digits) ? 4 : 3;

      if (card.cvv.length !== cvvLen) {
        e.cvv = `${cvvLen}-digit CVV`;
      }
    }

    return e;
  };

  const focusFirstError = () => {
    setTimeout(() => {
      const el = document.querySelector('[aria-invalid="true"]');

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        el.focus?.({ preventScroll: true });
      }
    }, 60);
  };

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const clearCartSafe = () => {
    if (typeof clearCart === "function") {
      clearCart();
    } else {
      cart.forEach((item) => removeFromCart(item.id));
    }

    clearWeights();
  };

  const handlePlaceOrder = async () => {
    if (busy) return;

    setErrorMsg("");

    if (!user) {
      setErrorMsg("Please log in to place your order.");

      return;
    }

    if (lines.length === 0) {
      return;
    }

    const found = validate();

    setErrors(found);

    if (Object.keys(found).length > 0) {
      focusFirstError();

      return;
    }

    setStatus("processing");

    try {
      /* ------------------------------------------------------------
         PLUG YOUR REAL PAYMENT GATEWAY IN HERE (Razorpay, Cashfree…)
         Create the order on your server, open the gateway checkout,
         and continue only when it reports success.
         For now the payment is simulated with a 2 second wait.
      ------------------------------------------------------------ */

      await new Promise((resolve) => setTimeout(resolve, 2200));

      const payment = {
        method,
        status: method === "cod" ? "pending" : "paid",
        reference: `${method === "cod" ? "COD" : "PAY"}_${Date.now()}`,
        amount: total,
        paidAt: new Date().toISOString(),

        ...(method === "upi" && { upiId: upiId.trim() }),

        // Never store the full card number or CVV — only the last 4 digits.
        ...(method === "card" && {
          cardLast4: digits.slice(-4),
          cardBrand: detectBrand(digits) || "Card",
        }),
      };

      const order = {
        id: Date.now().toString(),

        items: lines,

        total,

        placedAt: new Date().toISOString(),

        status: "placed",

        payment,

        address: {
          fullName: form.fullName.trim(),

          houseNo: form.address1.trim(),

          street: form.address2.trim(),

          city: form.city.trim(),

          pincode: form.pincode,

          phone: form.mobile,

          altPhone: form.altPhone || "",

          instructions: form.instructions.trim(),
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

      // remember the address for next time
      try {
        localStorage.setItem(
          ADDRESS_KEY,
          JSON.stringify({
            ...form,
            instructions: "",
          }),
        );
      } catch {
        /* ignore */
      }

      setPlaced({
        order,
        payment,
      });

      clearCartSafe();

      setStatus("success");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Order error:", error);

      setStatus("idle");

      setErrorMsg(error?.message || "Payment failed. Please try again.");
    }
  };

  const payLabel =
    method === "cod" ? "Confirm order" : `Pay ${formatINR(total)}`;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f7fbf4] text-[#083f26]">
      <Navbar />

      {/* =================================================
          HEADER BAND
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#9bdd45]/15 blur-2xl" />

        <div className="relative mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 py-9 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <FaLock />
              Secure checkout
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Complete your <span className="text-[#c8f26b]">order</span>
            </h1>

            <p className="mt-2 text-sm text-green-100">
              Add your delivery address, choose how to pay, and you're done.
            </p>
          </motion.div>

          {status !== "success" && lines.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur-sm transition hover:bg-white/20"
            >
              <FaArrowLeft className="text-xs" />
              Back to cart
            </button>
          )}
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto w-full max-w-[1400px] flex-grow px-4 py-8 pb-32 sm:px-6 lg:px-10 lg:pb-12">
        <CheckoutStepper current={status === "success" ? 3 : 2} />

        {status === "success" && placed ? (
          /* ---------------- CONFIRMATION ---------------- */

          <Confirmation
            placed={placed}
            onShop={() => navigate("/products")}
            onOrders={() => navigate(ORDERS_ROUTE)}
          />
        ) : lines.length === 0 ? (
          /* ---------------- EMPTY ---------------- */

          <div className="mt-8 rounded-3xl border border-dashed border-[#c9dcc4] bg-white px-6 py-16 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#eaf5e5] text-4xl text-[#158447]">
              <FaShoppingBasket />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold">
              Nothing to check out yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-[#718579]">
              Your cart is empty. Add some fresh products and come back here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition hover:-translate-y-0.5"
            >
              Browse products
              <FaArrowRight />
            </button>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_400px]">
            {/* =============================================
                LEFT: SHIPPING + PAYMENT
            ============================================= */}

            <div className="space-y-6">
              {/* ---------- 1. SHIPPING ---------- */}

              <SectionCard
                number="1"
                title="Delivery address"
                subtitle="Where should we bring your fresh groceries?"
                icon={FaMapMarkerAlt}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    error={errors.fullName}
                    className="sm:col-span-2"
                  >
                    <input
                      value={form.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.fullName)}
                      className={inputCls(errors.fullName)}
                    />
                  </Field>

                  <Field label="Mobile number" error={errors.mobile}>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={form.mobile}
                      onChange={(e) =>
                        setField(
                          "mobile",
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.mobile)}
                      className={inputCls(errors.mobile)}
                    />
                  </Field>

                  <Field
                    label="Alternate number"
                    optional
                    error={errors.altPhone}
                  >
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={form.altPhone}
                      onChange={(e) =>
                        setField(
                          "altPhone",
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="Another contact number"
                      aria-invalid={Boolean(errors.altPhone)}
                      className={inputCls(errors.altPhone)}
                    />
                  </Field>

                  <Field
                    label="House / flat no. & building"
                    error={errors.address1}
                    className="sm:col-span-2"
                  >
                    <input
                      value={form.address1}
                      onChange={(e) => setField("address1", e.target.value)}
                      placeholder="e.g. 12B, Green Park Apartments"
                      autoComplete="address-line1"
                      aria-invalid={Boolean(errors.address1)}
                      className={inputCls(errors.address1)}
                    />
                  </Field>

                  <Field
                    label="Street, area & landmark"
                    error={errors.address2}
                    className="sm:col-span-2"
                  >
                    <input
                      value={form.address2}
                      onChange={(e) => setField("address2", e.target.value)}
                      placeholder="e.g. Anna Nagar, near the bus stop"
                      autoComplete="address-line2"
                      aria-invalid={Boolean(errors.address2)}
                      className={inputCls(errors.address2)}
                    />
                  </Field>

                  <Field label="City" error={errors.city}>
                    <input
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="City"
                      autoComplete="address-level2"
                      aria-invalid={Boolean(errors.city)}
                      className={inputCls(errors.city)}
                    />
                  </Field>

                  <Field label="Pincode" error={errors.pincode}>
                    <input
                      inputMode="numeric"
                      value={form.pincode}
                      onChange={(e) =>
                        setField(
                          "pincode",
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="6-digit pincode"
                      autoComplete="postal-code"
                      aria-invalid={Boolean(errors.pincode)}
                      className={inputCls(errors.pincode)}
                    />
                  </Field>

                  <Field
                    label="Delivery instructions"
                    optional
                    className="sm:col-span-2"
                  >
                    <textarea
                      rows={2}
                      value={form.instructions}
                      onChange={(e) => setField("instructions", e.target.value)}
                      placeholder="Gate code, best time to call, leave at door…"
                      className={`${inputCls(false)} resize-none`}
                    />
                  </Field>
                </div>
              </SectionCard>

              {/* ---------- 2. PAYMENT ---------- */}

              <SectionCard
                number="2"
                title="Payment method"
                subtitle="Choose how you'd like to pay."
                icon={FaCreditCard}
              >
                {/* METHOD TILES */}

                <div className="grid grid-cols-3 gap-3">
                  {METHODS.map(({ id, label, hint, Icon }) => {
                    const active = method === id;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setMethod(id);
                          setErrors((prev) => ({
                            ...prev,
                            upiId: undefined,
                            number: undefined,
                            cardName: undefined,
                            expiry: undefined,
                            cvv: undefined,
                          }));
                          setErrorMsg("");
                        }}
                        aria-pressed={active}
                        className={`relative rounded-2xl border px-2 py-4 text-center transition ${
                          active
                            ? "border-[#158447] bg-[#eaf5e5] shadow-md shadow-[#075c35]/10"
                            : "border-[#dbe8d7] bg-white hover:border-[#9bd449]"
                        }`}
                      >
                        {active && (
                          <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[#158447] text-[9px] text-white">
                            <FaCheck />
                          </span>
                        )}

                        <Icon
                          className={`mx-auto text-2xl ${
                            active ? "text-[#0b7040]" : "text-[#7a9583]"
                          }`}
                        />

                        <p
                          className={`mt-2 text-sm font-extrabold ${
                            active ? "text-[#06472a]" : "text-[#3c5b48]"
                          }`}
                        >
                          {label}
                        </p>

                        <p className="mt-0.5 text-[10.5px] leading-tight text-[#718579]">
                          {hint}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* METHOD FORM */}

                <div className="mt-6">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={method}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                    >
                      {/* ---------- UPI ---------- */}

                      {method === "upi" && (
                        <div className="max-w-lg">
                          <Field label="UPI ID" error={errors.upiId}>
                            <input
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);

                                clearError("upiId");
                              }}
                              placeholder="yourname@okaxis"
                              autoComplete="off"
                              aria-invalid={Boolean(errors.upiId)}
                              className={inputCls(errors.upiId)}
                            />
                          </Field>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {UPI_HANDLES.map(([app, handle]) => (
                              <button
                                key={handle}
                                type="button"
                                onClick={() => {
                                  setUpiId(`${upiId.split("@")[0]}${handle}`);

                                  clearError("upiId");
                                }}
                                className="rounded-full border border-[#d3e3cf] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#075c35] transition hover:bg-[#eaf5e5]"
                              >
                                {app}{" "}
                                <span className="font-medium text-[#718579]">
                                  {handle}
                                </span>
                              </button>
                            ))}
                          </div>

                          <p className="mt-3 text-[12.5px] text-[#718579]">
                            You'll get a payment request in your UPI app.
                            Approve it to complete the order.
                          </p>
                        </div>
                      )}

                      {/* ---------- CARD ---------- */}

                      {method === "card" && (
                        <div>
                          <CardPreview
                            number={card.number}
                            name={card.name}
                            expiry={card.expiry}
                          />

                          <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                            <Field
                              label="Card number"
                              error={errors.number}
                              className="sm:col-span-2"
                            >
                              <input
                                inputMode="numeric"
                                autoComplete="cc-number"
                                value={card.number}
                                onChange={(e) => {
                                  setCard({
                                    ...card,
                                    number: formatCardNumber(e.target.value),
                                  });

                                  clearError("number");
                                }}
                                placeholder="1234 5678 9012 3456"
                                aria-invalid={Boolean(errors.number)}
                                className={`${inputCls(errors.number)} font-mono tracking-wider`}
                              />
                            </Field>

                            <Field
                              label="Name on card"
                              error={errors.cardName}
                              className="sm:col-span-2"
                            >
                              <input
                                autoComplete="cc-name"
                                value={card.name}
                                onChange={(e) => {
                                  setCard({ ...card, name: e.target.value });

                                  clearError("cardName");
                                }}
                                placeholder="As printed on the card"
                                aria-invalid={Boolean(errors.cardName)}
                                className={inputCls(errors.cardName)}
                              />
                            </Field>

                            <Field label="Expiry" error={errors.expiry}>
                              <input
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                value={card.expiry}
                                onChange={(e) => {
                                  setCard({
                                    ...card,
                                    expiry: formatExpiry(e.target.value),
                                  });

                                  clearError("expiry");
                                }}
                                placeholder="MM/YY"
                                aria-invalid={Boolean(errors.expiry)}
                                className={inputCls(errors.expiry)}
                              />
                            </Field>

                            <Field label="CVV" error={errors.cvv}>
                              <input
                                type="password"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                value={card.cvv}
                                onChange={(e) => {
                                  setCard({
                                    ...card,
                                    cvv: e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 4),
                                  });

                                  clearError("cvv");
                                }}
                                placeholder="•••"
                                aria-invalid={Boolean(errors.cvv)}
                                className={inputCls(errors.cvv)}
                              />
                            </Field>
                          </div>
                        </div>
                      )}

                      {/* ---------- COD ---------- */}

                      {method === "cod" && (
                        <div className="max-w-lg rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4">
                          <div className="flex items-start gap-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf5e5] text-lg text-[#158447]">
                              <FaTruck />
                            </span>

                            <div className="text-sm">
                              <p className="font-bold text-[#083f26]">
                                Pay when it arrives
                              </p>

                              <p className="mt-1 text-[#718579]">
                                Keep {formatINR(total)} ready in cash. Our
                                delivery partner will hand over your order and
                                collect the payment.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p className="mt-6 flex items-center gap-2 text-[12px] text-[#718579]">
                  <FaShieldAlt className="text-[#158447]" />
                  Card details are never saved on our servers.
                </p>
              </SectionCard>
            </div>

            {/* =============================================
                RIGHT: ORDER SUMMARY
            ============================================= */}

            <aside className="lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-3xl border border-[#dbe8d7] bg-white shadow-lg shadow-[#075c35]/10">
                <div className="bg-gradient-to-br from-[#06472a] to-[#0b7040] px-6 py-4 text-white">
                  <h2 className="text-lg font-extrabold">Order summary</h2>

                  <p className="text-xs text-green-100">
                    {itemCount} item{itemCount !== 1 ? "s" : ""} in your order
                  </p>
                </div>

                <div className="space-y-4 p-6">
                  {/* ITEMS */}

                  <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
                    {lines.map((line) => (
                      <li key={line.id} className="flex items-center gap-3">
                        <Thumb
                          src={getItemImage(line)}
                          alt={line.name}
                          className="h-14 w-14 shrink-0 rounded-xl border border-[#dbe8d7]"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#083f26]">
                            {line.name}
                          </p>

                          <p className="text-xs text-[#718579]">
                            {line.weightLabel} × {line.quantity}
                          </p>
                        </div>

                        <span className="text-sm font-extrabold text-[#075c35]">
                          {formatINR(line.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* FREE DELIVERY BAR */}

                  <div className="rounded-2xl bg-[#f1f8ed] p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#075c35]">
                      <FaTruck />

                      {remainingForFree > 0
                        ? `Add ₹${formatPrice(remainingForFree)} more for free delivery`
                        : "You've unlocked free delivery!"}
                    </div>

                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#dbe8d7]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#158447] to-[#9bdd45]"
                        initial={false}
                        animate={{ width: `${freeProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* TOTALS */}

                  <div className="space-y-2.5 border-t border-dashed border-[#d3e3cf] pt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#718579]">Subtotal</span>

                      <span className="font-bold text-[#083f26]">
                        {formatINR(total)}
                      </span>
                    </div>

                    <div className="flex items-end justify-between pt-1">
                      <span className="text-base font-extrabold">Total</span>

                      <span className="text-3xl font-extrabold text-[#075c35]">
                        {formatINR(total)}
                      </span>
                    </div>
                  </div>

                  {/* ERROR */}

                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!user && (
                    <p className="flex items-center gap-2 rounded-xl bg-[#fff8e5] px-4 py-3 text-xs font-semibold text-[#b88e1f]">
                      <FaUserCircle className="text-base" />
                      Log in to place your order.
                    </p>
                  )}

                  {/* PAY */}

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={busy}
                    className="hidden w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] py-4 text-base font-extrabold text-white shadow-lg shadow-[#075c35]/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 lg:flex"
                  >
                    <FaLock className="text-sm" />
                    {payLabel}
                  </button>

                  <p className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#9aa99f]">
                    <FaLock />
                    Secure checkout · Protected payments
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* =================================================
          MOBILE PAY BAR
      ================================================= */}

      {status !== "success" && lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[#dbe8d7] bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(7,92,53,0.12)] lg:hidden">
          <div>
            <p className="text-[11px] font-semibold text-[#718579]">Total</p>

            <p className="text-xl font-extrabold text-[#075c35]">
              {formatINR(total)}
            </p>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#075c35] to-[#158447] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#075c35]/25 disabled:opacity-70"
          >
            <FaLock className="text-xs" />
            {payLabel}
          </button>
        </div>
      )}

      <Footer />

      {/* =================================================
          PROCESSING OVERLAY
      ================================================= */}

      <AnimatePresence>
        {busy && (
          <motion.div
            className="fixed inset-0 z-[10050] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#dcefd5] border-t-[#158447]" />

            <p className="mt-6 text-xl font-extrabold text-[#075c35]">
              Processing your order…
            </p>

            <p className="mt-1 text-sm text-[#718579]">
              Please don't close or refresh this page.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Checkout;
