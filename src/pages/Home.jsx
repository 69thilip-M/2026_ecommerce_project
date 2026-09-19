/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import Testimonials from "../components/Testimonials";

import productsData from "./productsData";

import bannerHome from "../assets/images/banner-home.jpg";

import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

function Home() {
  const navigate = useNavigate();

  // Scroll reveal
  useEffect(() => {
    const items = document.querySelectorAll(".fresh-home .reveal");

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Feature cards
  const features = [
    {
      Icon: EnergySavingsLeafOutlinedIcon,
      title: "Picked today",
      text: "Quality checked by hand",
    },
    {
      Icon: LocalShippingOutlinedIcon,
      title: "Fast local delivery",
      text: "From your nearest KMR store",
    },
    {
      Icon: VerifiedUserOutlinedIcon,
      title: "Easy, secure payments",
      text: "Shop with confidence",
    },
  ];

  // How it works
  const howItWorks = [
    {
      title: "Choose your location",
      text: "We'll match you to your nearest KMR store.",
    },
    {
      title: "Add to cart",
      text: "Quick add, offers, and your order total are ready to review.",
    },
    {
      title: "Check out securely",
      text: "Address, delivery fee, and payment are handled end to end.",
    },
    {
      title: "Track your order",
      text: "Your invoice and order updates are available in your account.",
    },
  ];

  return (
    <div className="fresh-home min-h-screen bg-[#f7fbf4] text-[#083f26] overflow-x-hidden">
      <Navbar />

      <main>
        {/* =========================
            HERO SECTION
        ========================== */}

        <section className="fresh-hero-wrap">
          <div className="fresh-hero">
            <div className="fresh-copy">
              <div className="eyebrow">
                <EnergySavingsLeafOutlinedIcon fontSize="small" />

                <span>
                  <b>FRESH CHECK</b>
                  <small>Selected this morning</small>
                </span>
              </div>

              <h1>
                Fresh groceries
                <br />
                from
                <br />
                your <em>nearest store.</em>
              </h1>

              <p>
                Hand-picked daily essentials, delivered to your door in 20–30
                minutes.
              </p>

              <div className="trust-row">
                <span>
                  <EnergySavingsLeafOutlinedIcon />
                  Fresh every day
                </span>

                <span>
                  <LocationOnOutlinedIcon />
                  Nearest store
                </span>

                <span>
                  <VerifiedUserOutlinedIcon />
                  Secure checkout
                </span>
              </div>

              <div className="hero-cta">
                <button onClick={() => navigate("/products")}>
                  Shop now
                  <ArrowForwardRoundedIcon />
                </button>

                <button
                  className="secondary"
                  onClick={() => navigate("/about")}
                >
                  Use my location
                </button>
              </div>
            </div>

            <div className="fresh-visual">
              <div className="visual-note">
                <EnergySavingsLeafOutlinedIcon fontSize="small" />

                <span>
                  <b>Fresh Check</b>
                  <small>Picked locally</small>
                </span>
              </div>

              {/* Photo fitted inside an animated circle */}
              <div className="hero-circle-wrap">
                <span className="hero-halo" />
                <span className="hero-ring" />

                <div className="hero-circle">
                  <img
                    src={bannerHome}
                    alt="A colourful selection of fresh fruit and vegetables"
                  />
                </div>
              </div>

              <div className="delivery-note">
                <LocalShippingOutlinedIcon />
                <b>20–30 min</b>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FEATURE STRIP
        ========================== */}

        <section className="fresh-feature-strip">
          {features.map(({ Icon, title, text }, index) => (
            <div
              key={title}
              className="reveal"
              style={{
                "--d": `${index * 0.12}s`,
              }}
            >
              <Icon />

              <span>
                <b>{title}</b>
                <small>{text}</small>
              </span>
            </div>
          ))}
        </section>

        {/* =========================
            PRODUCTS SECTION
        ========================== */}

        <section className="fresh-products">
          <div className="section-heading reveal">
            <div>
              <span>SHOP THE DAY'S BEST</span>
              <h2>Fresh picks for you</h2>
            </div>

            <button onClick={() => navigate("/products")}>
              View catalog
              <ArrowForwardRoundedIcon />
            </button>
          </div>

          <div className="product-grid">
            {productsData.slice(0, 4).map((product, index) => (
              <article
                key={product.id}
                className="fresh-product-card reveal"
                style={{
                  "--d": `${index * 0.1}s`,
                }}
                onClick={() => navigate("/products")}
              >
                <img src={product.image} alt={product.name} />

                <div>
                  <small>{product.category}</small>

                  <h3>{product.name}</h3>

                  <b>₹{product.price}</b>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =========================
            STORE SECTIONS
        ========================== */}

        <section className="store-sections">
          {/* OFFER SECTION */}

          <div className="delivery-offer reveal">
            <div className="offer-copy">
              <span>TODAY'S OFFER</span>

              <h2>
                Free delivery on
                <br />
                orders above <strong>₹1,000</strong>
              </h2>

              <p>Enjoy fast delivery and great offers from KMR Fresh.</p>

              <div>
                <b>
                  <BoltOutlinedIcon />
                  Active flash sale
                </b>

                <b>
                  <EnergySavingsLeafOutlinedIcon />
                  Morning-fresh stock
                </b>

                <b>
                  <VerifiedUserOutlinedIcon />
                  Secure checkout
                </b>
              </div>

              <button onClick={() => navigate("/products")}>
                Shop now
                <ArrowForwardRoundedIcon />
              </button>
            </div>

            <div className="offer-art">
              <div className="free-tag">
                FREE
                <br />
                DELIVERY
              </div>

              <img src={bannerHome} alt="Fresh groceries ready for delivery" />
            </div>
          </div>

          {/* HOW IT WORKS */}

          <div className="how-it-works">
            {howItWorks.map(({ title, text }, index) => (
              <article
                key={title}
                className="reveal"
                style={{
                  "--d": `${index * 0.1}s`,
                }}
              >
                <b>{index + 1}</b>

                <h3>{title}</h3>

                <p>{text}</p>
              </article>
            ))}
          </div>

          {/* VOUCHER CALLOUT */}

          <div className="voucher-callout reveal">
            <div>
              <span>KMR FRESH ONLINE</span>

              <h2>Fresh offers straight from your favorite store.</h2>

              <p>
                Save KMR Fresh to your home screen for a faster grocery
                experience.
              </p>
            </div>

            <button onClick={() => navigate("/products")}>
              View offers
              <ArrowForwardRoundedIcon />
            </button>
          </div>

          {/* SERVICE ROW */}

          <div className="service-row reveal">
            <div>
              <VerifiedUserOutlinedIcon />

              <span>
                <b>Curated products</b>
                <small>Quality checked by our store</small>
              </span>
            </div>

            <div>
              <LocalShippingOutlinedIcon />

              <span>
                <b>Fast delivery</b>
                <small>Freshness to your door</small>
              </span>
            </div>

            <div>
              <LockOutlinedIcon />

              <span>
                <b>Secure transactions</b>
                <small>Protected payments</small>
              </span>
            </div>

            <div>
              <HeadsetMicOutlinedIcon />

              <span>
                <b>Customer support</b>
                <small>Here when you need us</small>
              </span>
            </div>
          </div>
        </section>

        {/* =========================
            NEWSLETTER
        ========================== */}

        <div className="reveal">
          <Newsletter />
        </div>

        {/* =========================
            TESTIMONIALS
        ========================== */}

        <div className="reveal">
          <Testimonials />
        </div>
      </main>

      {/* =========================
          FOOTER
      ========================== */}

      <Footer />
    </div>
  );
}

export default Home;
