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

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#5a2600] overflow-x-hidden">
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

              <img
                src={bannerHome}
                alt="A colourful selection of fresh fruit and vegetables"
              />

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
          <div>
            <EnergySavingsLeafOutlinedIcon />

            <span>
              <b>Picked today</b>
              <small>Quality checked by hand</small>
            </span>
          </div>

          <div>
            <LocalShippingOutlinedIcon />

            <span>
              <b>Fast local delivery</b>
              <small>From your nearest KMR store</small>
            </span>
          </div>

          <div>
            <VerifiedUserOutlinedIcon />

            <span>
              <b>Easy, secure payments</b>
              <small>Shop with confidence</small>
            </span>
          </div>
        </section>

        {/* =========================
            PRODUCTS SECTION
        ========================== */}
        <section className="fresh-products">
          <div className="section-heading">
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
            {productsData.slice(0, 4).map((product) => (
              <article
                key={product.id}
                className="fresh-product-card"
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
          <div className="delivery-offer">
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
            {[
              [
                "Choose your location",
                "We'll match you to your nearest KMR store.",
              ],
              [
                "Add to cart",
                "Quick add, offers, and your order total are ready to review.",
              ],
              [
                "Check out securely",
                "Address, delivery fee, and payment are handled end to end.",
              ],
              [
                "Track your order",
                "Your invoice and order updates are available in your account.",
              ],
            ].map(([title, text], index) => (
              <article key={title}>
                <b>{index + 1}</b>

                <h3>{title}</h3>

                <p>{text}</p>
              </article>
            ))}
          </div>

          {/* VOUCHER CALLOUT */}
          <div className="voucher-callout">
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
          <div className="service-row">
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
        <Newsletter />

        {/* =========================
            TESTIMONIALS
        ========================== */}
        <Testimonials />
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <Footer />
    </div>
  );
}

export default Home;
