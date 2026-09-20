import { NavLink, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";

import { getAuth, signOut } from "firebase/auth";

import { useCart } from "../context/CartContext";

import { useTheme } from "../context/ThemeContext";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

function Navbar() {
  const navigate = useNavigate();

  const { cart, user } = useCart();

  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [query, setQuery] = useState("");

  const profileRef = useRef(null);

  // =========================
  // CART ITEM COUNT
  // =========================

  const totalItems = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  // =========================
  // NAVIGATION LINKS
  // =========================

  const links = [
    ["Home", "/home"],
    ["Catalog", "/products"],
    ["About", "/about"],
    ["Contact", "/contact"],
    ["Blog", "/blog"],
  ];

  // =========================
  // CLOSE PROFILE DROPDOWN
  // =========================

  useEffect(() => {
    const close = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  // =========================
  // SEARCH
  // =========================

  const submitSearch = (event) => {
    event.preventDefault();

    navigate("/products", {
      state: {
        search: query,
      },
    });
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    try {
      await signOut(getAuth());

      setProfileOpen(false);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fresh-header">
      {/* =========================
          OFFER BAR
      ========================= */}

      <div className="fresh-offer">
        <span className="offer-pill">Fresh morning sale</span>

        <span>Selected orders from Rs 100,000 get free delivery</span>

        <button type="button" onClick={() => navigate("/products")}>
          View offers
        </button>
      </div>

      {/* =========================
          MAIN NAVBAR
      ========================= */}

      <div className="fresh-mainbar">
        {/* LOGO */}

        <NavLink to="/home" className="fresh-brand">
          KMR <span>FRESH</span>
        </NavLink>

        {/* SEARCH */}

        <form className="fresh-search" onSubmit={submitSearch}>
          <SearchRoundedIcon fontSize="small" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fruit, vegetables, dairy, offers..."
          />

          <button type="submit">Search</button>
        </form>

        {/* ACTIONS */}

        <div className="fresh-actions">
          {/* LOCATION */}

          <button className="location-button" type="button">
            <LocationOnOutlinedIcon fontSize="small" />
            KMR Store
          </button>

          {/* LOGIN */}

          {!user && (
            <button
              className="login-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Login
            </button>
          )}

          {/* =========================
              CART
          ========================= */}

          <button
            className="cart-button"
            type="button"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCartOutlinedIcon fontSize="small" />

            <span>Cart</span>

            <b>{totalItems}</b>
          </button>

          {/* =========================
              PROFILE
          ========================= */}

          {user && (
            <div className="profile-menu" ref={profileRef}>
              <button
                className="profile-button"
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Open account menu"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" />
                ) : (
                  <AccountCircleOutlinedIcon />
                )}
              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="profile-dropdown">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                  >
                    Profile details
                  </button>

                  <button
                    onClick={() => {
                      toggleTheme();
                      setProfileOpen(false);
                    }}
                  >
                    {theme === "light" ? "Dark theme" : "Light theme"}
                  </button>

                  <button className="logout" onClick={logout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU */}

        <button
          className="fresh-menu"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
        </button>
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className={`fresh-nav ${menuOpen ? "is-open" : ""}`}>
        {links.map(([label, path]) => (
          <NavLink key={path} to={path} onClick={() => setMenuOpen(false)}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
