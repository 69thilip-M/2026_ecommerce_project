// src/components/CheckoutSteps.jsx
import { Fragment } from "react";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const STEPS = ["Delivery details", "Payment"];

/** current: 1 = Delivery details, 2 = Payment */
function CheckoutSteps({ current = 1 }) {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold">
      {STEPS.map((label, index) => {
        const n = index + 1;
        const done = current > n;
        const active = current === n;

        return (
          <Fragment key={label}>
            {index > 0 && (
              <span
                className={`h-px w-8 sm:w-12 ${
                  current >= n ? "bg-[#9bdd45]" : "bg-white/30"
                }`}
              />
            )}

            <span className="flex items-center gap-2">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-extrabold ${
                  done || active
                    ? "bg-[#9bdd45] text-[#06472a]"
                    : "border border-white/40 text-white/70"
                }`}
              >
                {done ? <CheckRoundedIcon sx={{ fontSize: 15 }} /> : n}
              </span>

              <span className={done || active ? "text-white" : "text-white/60"}>
                {label}
              </span>
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}

export default CheckoutSteps;
