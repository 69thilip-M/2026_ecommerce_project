import { useState } from "react";

import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const perks = [
  { Icon: LocalOfferOutlinedIcon, text: "10% off your first order" },
  { Icon: BoltOutlinedIcon, text: "Early flash-sale alerts" },
  { Icon: EnergySavingsLeafOutlinedIcon, text: "Seasonal fresh picks" },
];

function Newsletter() {
  const [email, setEmail] = useState("");
  // idle | error | loading | success
  const [status, setStatus] = useState("idle");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // TODO: replace this timeout with your real subscribe API call.
    setTimeout(() => {
      setStatus("success");
    }, 900);
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
    if (status === "error") setStatus("idle");
  };

  const reset = () => {
    setEmail("");
    setStatus("idle");
  };

  return (
    <section className="nl-wrap" aria-labelledby="newsletter-title">
      <div className="nl-card">
        <span className="nl-blob nl-blob-1" />
        <span className="nl-blob nl-blob-2" />

        {/* ---------- Left: copy + form ---------- */}
        <div className="nl-copy">
          <div className="nl-eyebrow">
            <MailOutlineRoundedIcon fontSize="small" />
            <span>KMR Fresh Letter</span>
          </div>

          <h2 id="newsletter-title">
            Get fresh deals <em>before</em> everyone else.
          </h2>

          <p>
            One short email a week with new arrivals, flash sales and a little
            something off your first order.
          </p>

          <ul className="nl-perks">
            {perks.map(({ Icon, text }) => (
              <li key={text}>
                <Icon />
                {text}
              </li>
            ))}
          </ul>

          {status === "success" ? (
            <div className="nl-success" role="status">
              <span className="nl-success-icon">
                <CheckRoundedIcon />
              </span>

              <div>
                <b>You're on the list!</b>
                <small>
                  We'll send fresh offers to <strong>{email}</strong>
                </small>
              </div>

              <button type="button" onClick={reset}>
                Use another email
              </button>
            </div>
          ) : (
            <>
              <form
                className={`nl-form ${status === "error" ? "has-error" : ""}`}
                onSubmit={handleSubmit}
                noValidate
              >
                <MailOutlineRoundedIcon />

                <input
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  aria-invalid={status === "error"}
                  autoComplete="email"
                />

                <button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <span className="nl-spinner" />
                      Joining
                    </>
                  ) : (
                    <>
                      Subscribe
                      <SendRoundedIcon />
                    </>
                  )}
                </button>
              </form>

              <small
                className={`nl-note ${status === "error" ? "is-error" : ""}`}
                role={status === "error" ? "alert" : undefined}
              >
                {status === "error"
                  ? "Enter a valid email address, like name@example.com."
                  : "No spam. Unsubscribe anytime."}
              </small>
            </>
          )}
        </div>

        {/* ---------- Right: animated visual ---------- */}
        <div className="nl-visual" aria-hidden="true">
          <div className="nl-orb-wrap">
            <span className="nl-ripple" />
            <span className="nl-ripple r2" />
            <span className="nl-ring" />

            <div className="nl-orb">
              <MailOutlineRoundedIcon />
            </div>
          </div>

          <div className="nl-chip c1">
            <LocalOfferOutlinedIcon />
            10% off
          </div>

          <div className="nl-chip c2">
            <NotificationsActiveOutlinedIcon />
            Weekly deals
          </div>

          <div className="nl-chip c3">
            <EnergySavingsLeafOutlinedIcon />
            Always fresh
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
