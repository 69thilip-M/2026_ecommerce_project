import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

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

  const profileRef = useRef(null);

  // =====================================================
  // CART ITEM COUNT
  // =====================================================

  const totalItems = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  // =====================================================
  // NAVIGATION LINKS
  // =====================================================

  const links = [
    ["Home", "/home"],
    ["Catalog", "/products"],
    ["About", "/about"],
    ["Contact", "/contact"],
    ["Blog", "/blog"],
  ];

  // =====================================================
  // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    try {
      await signOut(getAuth());

      setProfileOpen(false);
      setMenuOpen(false);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="fresh-header">
      {/* =================================================
          OFFER BAR
      ================================================== */}

      <div className="fresh-offer">
        <span className="offer-pill">Fresh morning sale</span>

        <span className="offer-text">
          Selected orders from Rs 100,000 get free delivery
        </span>

        <button type="button" onClick={() => navigate("/products")}>
          View offers
        </button>
      </div>

      {/* =================================================
          MAIN NAVBAR
      ================================================== */}

      <div className="fresh-mainbar">
        {/* =================================================
            LEFT - LOGO
        ================================================== */}

        <NavLink to="/home" className="fresh-brand" onClick={closeMenu}>
          KMR <span>FRESH</span>
        </NavLink>

        {/* =================================================
            CENTER - NAVIGATION
        ================================================== */}

        <nav className={`fresh-nav ${menuOpen ? "is-open" : ""}`}>
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* =================================================
            RIGHT - ACTIONS
        ================================================== */}

        <div className="fresh-actions">
          {/* LOCATION */}

          <button className="location-button" type="button">
            <LocationOnOutlinedIcon fontSize="small" />

            <span>KMR Store</span>
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

          {/* CART */}

          <button
            className="cart-button"
            type="button"
            onClick={() => {
              navigate("/cart");
              closeMenu();
            }}
          >
            <ShoppingCartOutlinedIcon fontSize="small" />

            <span className="cart-label">Cart</span>

            <b>{totalItems}</b>
          </button>

          {/* PROFILE */}

          {user && (
            <div className="profile-menu" ref={profileRef}>
              <button
                className="profile-button"
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Open account menu"
                aria-expanded={profileOpen}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" />
                ) : (
                  <AccountCircleOutlinedIcon />
                )}
              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="profile-dropdown">
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                  >
                    Profile details
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setProfileOpen(false);
                    }}
                  >
                    {theme === "light" ? "Dark theme" : "Light theme"}
                  </button>

                  <button type="button" className="logout" onClick={logout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <button
          className="fresh-menu"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
