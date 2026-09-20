// src/components/CheckoutStepper.jsx
//
// Cart -> Checkout progress indicator, shared by Cart.jsx and Checkout.jsx
//   current = 1  ->  Cart is active
//   current = 2  ->  Checkout is active (Cart is done)
//   current = 3  ->  everything is done (order placed)

import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaShoppingCart, FaCreditCard, FaCheck } from "react-icons/fa";

const STEPS = [
  {
    title: "Cart",
    text: "Review selected items before checkout.",
    icon: FaShoppingCart,
  },
  {
    title: "Checkout",
    text: "Shipping, payment, and order confirmation.",
    icon: FaCreditCard,
  },
];

function CheckoutStepper({ current = 1 }) {
  return (
    <ol className="grid items-stretch gap-3 sm:grid-cols-[1fr_72px_1fr] sm:gap-0">
      {STEPS.map((step, index) => {
        const number = index + 1;
        const done = current > number;
        const active = current === number;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.title}>
            {index === 1 && (
              <li
                aria-hidden="true"
                className="hidden items-center px-2 sm:flex"
              >
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#dbe8d7]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#158447] to-[#9bdd45]"
                    initial={false}
                    animate={{
                      width: current > 1 ? "100%" : "0%",
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </li>
            )}

            <li
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                active
                  ? "border-[#158447] bg-white shadow-lg shadow-[#075c35]/10 ring-4 ring-[#158447]/10"
                  : done
                    ? "border-[#bcd6b6] bg-[#eaf5e5]"
                    : "border-[#dbe8d7] bg-white/70"
              }`}
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-br from-[#075c35] to-[#158447] text-white shadow-md shadow-[#075c35]/30"
                    : done
                      ? "bg-[#158447] text-white"
                      : "bg-[#eaf5e5] text-[#158447]"
                }`}
              >
                {done ? <FaCheck /> : <Icon />}
              </span>

              <div className="min-w-0">
                <p
                  className={`text-[11px] font-extrabold uppercase tracking-widest ${
                    active || done ? "text-[#158447]" : "text-[#9aa99f]"
                  }`}
                >
                  Step {number}
                </p>

                <h2
                  className={`text-lg font-extrabold leading-tight ${
                    active || done ? "text-[#083f26]" : "text-[#718579]"
                  }`}
                >
                  {step.title}
                </h2>

                <p className="text-xs leading-snug text-[#718579]">
                  {step.text}
                </p>
              </div>
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
}

export default CheckoutStepper;
