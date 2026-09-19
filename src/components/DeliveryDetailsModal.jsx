// src/components/DeliveryDetailsModal.jsx
import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import CheckoutSteps from "../components/CheckoutSteps";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const EMPTY = {
  fullName: "",
  mobile: "",
  altPhone: "",
  address1: "",
  address2: "",
  city: "",
  pincode: "",
  instructions: "",
};

const MAX_NOTE = 200;

const onlyDigits = (max) => (value) => value.replace(/\D/g, "").slice(0, max);

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const inputCls = (error) =>
  `w-full rounded-xl border bg-[#fbfdf9] py-2.5 pl-10 pr-3.5 text-[15px] text-[#083f26] placeholder-[#9aa99f] outline-none transition focus:bg-white focus:ring-4 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-[#dbe8d7] focus:border-[#158447] focus:ring-[#158447]/15"
  }`;

function validate(v) {
  const e = {};

  if (v.fullName.trim().length < 2) e.fullName = "Please enter your full name";
  if (!/^[6-9]\d{9}$/.test(v.mobile))
    e.mobile = "Enter a valid 10-digit mobile number";
  if (v.altPhone && !/^\d{10}$/.test(v.altPhone))
    e.altPhone = "Enter a valid 10-digit number";
  if (!v.address1.trim()) e.address1 = "Address line 1 is required";
  if (!v.address2.trim()) e.address2 = "Street / area is required";
  if (!v.city.trim()) e.city = "City is required";
  if (!/^\d{6}$/.test(v.pincode)) e.pincode = "Enter a 6-digit pincode";

  return e;
}

/* ---------------------------------------------------------
   Small field wrapper: label + icon + animated error text
---------------------------------------------------------- */
function Field({ label, icon: Icon, error, optional, alignTop, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#083f26]">
        {label}
        {optional && (
          <span className="text-[11px] font-medium text-[#8a9d90]">
            (optional)
          </span>
        )}
      </span>

      <span className="relative block">
        {Icon && (
          <Icon
            className={`pointer-events-none absolute left-3 text-[#158447] ${
              alignTop ? "top-3" : "top-[11px]"
            }`}
            sx={{ fontSize: 20 }}
          />
        )}
        {children}
      </span>

      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 block text-[12.5px] font-medium text-red-500"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

/* ---------------------------------------------------------
   The actual popup (mounted fresh each time it opens)
---------------------------------------------------------- */
function DetailsSheet({ initialValues, itemCount, total, onCancel, onSubmit }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // close on Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const set = (name, transform) => (e) => {
    const value = transform ? transform(e.target.value) : e.target.value;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      address1: values.address1.trim(),
      address2: values.address2.trim(),
      city: values.city.trim(),
      instructions: values.instructions.trim(),
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#062b1a]/60 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onCancel}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-title"
        className="flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ---------------- HEADER ---------------- */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#06472a] via-[#0b7040] to-[#158447] px-6 pb-6 pt-5 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-16 h-36 w-36 rounded-full bg-[#9bdd45]/20" />

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition hover:rotate-90 hover:bg-white/25"
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </button>

          <CheckoutSteps current={1} />

          <h2
            id="delivery-title"
            className="relative mt-4 text-2xl font-extrabold tracking-tight"
          >
            Delivery details
          </h2>
          <p className="relative mt-1 text-sm text-white/80">
            Tell us where to deliver your order.
          </p>

          <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 17 }} />
            {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
            <span className="text-[#d5f36b]">{formatINR(total)}</span>
          </div>
        </div>

        {/* ---------------- FORM ---------------- */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <Field
              label="Full name"
              icon={PersonOutlineRoundedIcon}
              error={errors.fullName}
            >
              <input
                name="fullName"
                value={values.fullName}
                onChange={set("fullName")}
                placeholder="e.g. Karthik Raja"
                autoComplete="name"
                className={inputCls(errors.fullName)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Mobile number"
                icon={SmartphoneRoundedIcon}
                error={errors.mobile}
              >
                <input
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  value={values.mobile}
                  onChange={set("mobile", onlyDigits(10))}
                  placeholder="10-digit mobile"
                  autoComplete="tel"
                  className={inputCls(errors.mobile)}
                />
              </Field>

              <Field
                label="Alternate phone"
                icon={CallOutlinedIcon}
                error={errors.altPhone}
                optional
              >
                <input
                  name="altPhone"
                  type="tel"
                  inputMode="numeric"
                  value={values.altPhone}
                  onChange={set("altPhone", onlyDigits(10))}
                  placeholder="Another number"
                  className={inputCls(errors.altPhone)}
                />
              </Field>
            </div>

            <Field
              label="Address line 1"
              icon={HomeOutlinedIcon}
              error={errors.address1}
            >
              <input
                name="address1"
                value={values.address1}
                onChange={set("address1")}
                placeholder="House / flat no., building name"
                autoComplete="address-line1"
                className={inputCls(errors.address1)}
              />
            </Field>

            <Field
              label="Address line 2"
              icon={LocationOnOutlinedIcon}
              error={errors.address2}
            >
              <input
                name="address2"
                value={values.address2}
                onChange={set("address2")}
                placeholder="Street, area, landmark"
                autoComplete="address-line2"
                className={inputCls(errors.address2)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="City"
                icon={LocationCityOutlinedIcon}
                error={errors.city}
              >
                <input
                  name="city"
                  value={values.city}
                  onChange={set("city")}
                  placeholder="City"
                  autoComplete="address-level2"
                  className={inputCls(errors.city)}
                />
              </Field>

              <Field
                label="Pincode"
                icon={PinDropOutlinedIcon}
                error={errors.pincode}
              >
                <input
                  name="pincode"
                  inputMode="numeric"
                  value={values.pincode}
                  onChange={set("pincode", onlyDigits(6))}
                  placeholder="6-digit pincode"
                  autoComplete="postal-code"
                  className={inputCls(errors.pincode)}
                />
              </Field>
            </div>

            <Field
              label="Delivery instructions"
              icon={NotesOutlinedIcon}
              optional
              alignTop
            >
              <textarea
                name="instructions"
                rows={3}
                maxLength={MAX_NOTE}
                value={values.instructions}
                onChange={set("instructions")}
                placeholder="e.g. Call before arriving, leave with security…"
                className={`${inputCls(false)} resize-none`}
              />
              <span className="mt-1 block text-right text-[11px] text-[#8a9d90]">
                {values.instructions.length}/{MAX_NOTE}
              </span>
            </Field>
          </div>

          {/* ---------------- FOOTER ---------------- */}
          <div className="flex shrink-0 gap-3 border-t border-[#e6efe2] bg-white px-6 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-[#d3e3cf] bg-white px-5 py-3 text-[15px] font-bold text-[#075c35] transition hover:bg-[#f1f8ed] sm:flex-none sm:px-8"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075c35] to-[#158447] px-5 py-3 text-[15px] font-bold text-white shadow-lg shadow-[#075c35]/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              <LockOutlinedIcon sx={{ fontSize: 18 }} />
              Pay Now
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------
   Public component
---------------------------------------------------------- */
function DeliveryDetailsModal({
  open,
  initialValues,
  itemCount,
  total,
  onCancel,
  onSubmit,
}) {
  return (
    <AnimatePresence>
      {open && (
        <DetailsSheet
          key="delivery-details"
          initialValues={initialValues}
          itemCount={itemCount}
          total={total}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      )}
    </AnimatePresence>
  );
}

export default DeliveryDetailsModal;
