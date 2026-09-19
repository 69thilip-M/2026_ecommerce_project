/* eslint-disable no-unused-vars */
// src/components/PaymentModal.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CheckoutSteps from "./CheckoutSteps";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

/* ---------------------------------------------------------
   Helpers
---------------------------------------------------------- */
const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const METHODS = [
  {
    id: "upi",
    label: "UPI",
    hint: "GPay · PhonePe · Paytm",
    Icon: AccountBalanceWalletOutlinedIcon,
  },
  {
    id: "card",
    label: "Card",
    hint: "Debit / Credit",
    Icon: CreditCardOutlinedIcon,
  },
  {
    id: "cod",
    label: "Cash",
    hint: "Pay on delivery",
    Icon: CurrencyRupeeRoundedIcon,
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
  `w-full rounded-xl border bg-[#fbfdf9] px-3.5 py-2.5 text-[15px] text-[#083f26] placeholder-[#9aa99f] outline-none transition focus:bg-white focus:ring-4 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-[#dbe8d7] focus:border-[#158447] focus:ring-[#158447]/15"
  }`;

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

function Label({ children }) {
  return (
    <span className="mb-1.5 block text-[13px] font-semibold text-[#083f26]">
      {children}
    </span>
  );
}

/* ---------------------------------------------------------
   Live card preview
---------------------------------------------------------- */
function CardPreview({ number, name, expiry }) {
  const digits = number.replace(/\s/g, "");
  const brand = detectBrand(digits);
  const masked = (digits + "•".repeat(16)).slice(0, 16);
  const shown = masked.replace(/(.{4})/g, "$1 ").trim();

  return (
    <div className="relative mb-5 h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-[#06472a] via-[#0b7040] to-[#5eaa32] p-5 text-white shadow-lg shadow-[#075c35]/25">
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

/* ---------------------------------------------------------
   Success screen
---------------------------------------------------------- */
function SuccessView({ result, amount, customer, onDone }) {
  const paid = result.status === "paid";
  const methodLabel = METHODS.find((m) => m.id === result.method)?.label;

  const rows = [
    ["Reference", result.reference],
    ["Payment", paid ? `${methodLabel} · Paid` : "Cash on delivery"],
    ["Amount", formatINR(amount)],
    ["Deliver to", `${customer.fullName}, ${customer.city}`],
  ];

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#0b7040] to-[#158447] px-6 pb-8 pt-10 text-center">
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -right-8 h-40 w-40 rounded-full bg-[#9bdd45]/20" />

        <motion.div
          className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-white shadow-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          <svg viewBox="0 0 52 52" className="h-11 w-11">
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

        <h3 className="relative mt-5 text-2xl font-extrabold text-white">
          Order placed!
        </h3>
        <p className="relative mt-1 text-sm text-white/80">
          {paid
            ? "Payment received. Thank you for shopping with us."
            : "Please keep cash ready when your order arrives."}
        </p>
      </div>

      <div className="px-6 py-6">
        <div className="rounded-2xl border border-dashed border-[#c9dcc4] bg-[#f7fbf4] p-4">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-start justify-between gap-4 py-1.5 text-sm"
            >
              <span className="text-[#718579]">{label}</span>
              <span className="text-right font-semibold text-[#083f26]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onDone}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#075c35] to-[#158447] px-5 py-3 text-[15px] font-bold text-white shadow-lg shadow-[#075c35]/25 transition hover:-translate-y-0.5"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   The payment sheet (mounted fresh each time it opens)
---------------------------------------------------------- */
function PaymentSheet({
  amount,
  customer,
  onBack,
  onClose,
  onPaymentComplete,
  onDone,
}) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | processing | success
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const busy = status === "processing";
  const digits = card.number.replace(/\s/g, "");

  // lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Esc closes (but never while paying)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape" || busy) return;
      if (status === "success") onDone();
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, status, onClose, onDone]);

  const clearError = (key) => setErrors((p) => ({ ...p, [key]: undefined }));

  const validate = () => {
    const e = {};

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

      if (card.name.trim().length < 2) e.name = "Enter the name on your card";

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
      if (card.cvv.length !== cvvLen) e.cvv = `${cvvLen}-digit CVV`;
    }

    return e;
  };

  const handlePay = async () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("processing");
    setErrorMsg("");

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
        amount,
        paidAt: new Date().toISOString(),
        ...(method === "upi" && { upiId: upiId.trim() }),
        // Never store the full card number or CVV — only the last 4 digits.
        ...(method === "card" && {
          cardLast4: digits.slice(-4),
          cardBrand: detectBrand(digits) || "Card",
        }),
      };

      await onPaymentComplete(payment);

      setResult(payment);
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setErrorMsg(err?.message || "Payment failed. Please try again.");
    }
  };

  const payLabel = method === "cod" ? "Confirm order" : `Pay ${formatINR(amount)}`;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#062b1a]/60 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={() => status === "idle" && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        className="relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {status === "success" ? (
          <SuccessView
            result={result}
            amount={amount}
            customer={customer}
            onDone={onDone}
          />
        ) : (
          <>
            {/* ---------------- HEADER ---------------- */}
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#06472a] via-[#0b7040] to-[#158447] px-6 pb-6 pt-5 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-16 right-16 h-36 w-36 rounded-full bg-[#9bdd45]/20" />

              <div className="relative flex items-center justify-between">
                <button
                  type="button"
                  onClick={onBack}
                  disabled={busy}
                  className="flex items-center gap-1 rounded-full bg-white/15 py-1.5 pl-2 pr-3 text-[13px] font-semibold transition hover:bg-white/25 disabled:opacity-50"
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 17 }} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/15 transition hover:rotate-90 hover:bg-white/25 disabled:opacity-50"
                >
                  <CloseRoundedIcon sx={{ fontSize: 20 }} />
                </button>
              </div>

              <div className="relative mt-4">
                <CheckoutSteps current={2} />
              </div>

              <div className="relative mt-4 flex items-end justify-between gap-4">
                <div>
                  <h2
                    id="payment-title"
                    className="text-sm font-semibold text-white/80"
                  >
                    Amount to pay
                  </h2>
                  <p className="text-4xl font-extrabold tracking-tight">
                    {formatINR(amount)}
                  </p>
                </div>

                <span className="mb-1 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold">
                  <LockOutlinedIcon sx={{ fontSize: 15 }} />
                  Secure checkout
                </span>
              </div>
            </div>

            {/* ---------------- BODY ---------------- */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {/* Deliver-to strip */}
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#dbe8d7] bg-[#f7fbf4] px-3.5 py-2.5">
                <HomeOutlinedIcon className="text-[#158447]" />
                <div className="min-w-0 flex-1 text-[13px] leading-tight">
                  <p className="truncate font-bold text-[#083f26]">
                    Deliver to {customer.fullName}
                  </p>
                  <p className="truncate text-[#718579]">
                    {customer.address1}, {customer.address2}, {customer.city} –{" "}
                    {customer.pincode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onBack}
                  disabled={busy}
                  className="text-[13px] font-bold text-[#158447] hover:underline disabled:opacity-50"
                >
                  Change
                </button>
              </div>

              {/* Method tabs */}
              <div className="grid grid-cols-3 gap-2.5">
                {METHODS.map(({ id, label, hint, Icon }) => {
                  const active = method === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setMethod(id);
                        setErrors({});
                        setErrorMsg("");
                      }}
                      className={`rounded-2xl border px-2 py-3 text-center transition ${
                        active
                          ? "border-[#158447] bg-[#eaf5e5] shadow-md shadow-[#075c35]/10"
                          : "border-[#dbe8d7] bg-white hover:border-[#9bd449]"
                      }`}
                    >
                      <Icon
                        className={active ? "text-[#0b7040]" : "text-[#7a9583]"}
                      />
                      <p
                        className={`mt-1 text-sm font-extrabold ${
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

              {/* Method form */}
              <div className="mt-5">
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
                      <div>
                        <label className="block">
                          <Label>UPI ID</Label>
                          <input
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              clearError("upiId");
                            }}
                            placeholder="yourname@okaxis"
                            autoComplete="off"
                            className={inputCls(errors.upiId)}
                          />
                          <FieldError message={errors.upiId} />
                        </label>

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
                          You'll get a payment request in your UPI app. Approve
                          it to complete the order.
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

                        <div className="space-y-4">
                          <label className="block">
                            <Label>Card number</Label>
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
                              className={`${inputCls(errors.number)} font-mono tracking-wider`}
                            />
                            <FieldError message={errors.number} />
                          </label>

                          <label className="block">
                            <Label>Name on card</Label>
                            <input
                              autoComplete="cc-name"
                              value={card.name}
                              onChange={(e) => {
                                setCard({ ...card, name: e.target.value });
                                clearError("name");
                              }}
                              placeholder="As printed on the card"
                              className={inputCls(errors.name)}
                            />
                            <FieldError message={errors.name} />
                          </label>

                          <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                              <Label>Expiry</Label>
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
                                className={inputCls(errors.expiry)}
                              />
                              <FieldError message={errors.expiry} />
                            </label>

                            <label className="block">
                              <Label>CVV</Label>
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
                                className={inputCls(errors.cvv)}
                              />
                              <FieldError message={errors.cvv} />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------- COD ---------- */}
                    {method === "cod" && (
                      <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4">
                        <div className="flex items-start gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eaf5e5] text-[#158447]">
                            <LocalShippingOutlinedIcon />
                          </span>
                          <div className="text-sm">
                            <p className="font-bold text-[#083f26]">
                              Pay when it arrives
                            </p>
                            <p className="mt-1 text-[#718579]">
                              Keep {formatINR(amount)} ready in cash. Our
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

              {/* Payment error */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ---------------- FOOTER ---------------- */}
            <div className="shrink-0 border-t border-[#e6efe2] bg-white px-6 py-4">
              <button
                type="button"
                onClick={handlePay}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075c35] to-[#158447] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#075c35]/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LockOutlinedIcon sx={{ fontSize: 18 }} />
                {payLabel}
              </button>

              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[12px] text-[#718579]">
                <VerifiedUserOutlinedIcon sx={{ fontSize: 14 }} />
                Card details are never saved on our servers
              </p>
            </div>

            {/* ---------------- PROCESSING OVERLAY ---------------- */}
            <AnimatePresence>
              {busy && (
                <motion.div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#dcefd5] border-t-[#158447]" />
                  <p className="mt-5 text-lg font-extrabold text-[#075c35]">
                    Processing payment…
                  </p>
                  <p className="mt-1 text-sm text-[#718579]">
                    Please don't close this window.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------
   Public component
---------------------------------------------------------- */
function PaymentModal({
  open,
  amount,
  customer,
  onBack,
  onClose,
  onPaymentComplete,
  onDone,
}) {
  return (
    <AnimatePresence>
      {open && customer && (
        <PaymentSheet
          key="payment-sheet"
          amount={amount}
          customer={customer}
          onBack={onBack}
          onClose={onClose}
          onPaymentComplete={onPaymentComplete}
          onDone={onDone}
        />
      )}
    </AnimatePresence>
  );
}

export default PaymentModal;