// src/context/CartContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { db } from "../firebase";

import { doc, getDoc, setDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  const auth = getAuth();

  // =========================================================
  // TRACK USER LOGIN / LOGOUT
  // =========================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setIsAuthReady(true);

      // Reset cart loading state whenever user changes
      setIsCartLoaded(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // =========================================================
  // FETCH USER-SPECIFIC CART
  // =========================================================

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const cartRef = doc(db, "carts", user.uid);

          const cartSnap = await getDoc(cartRef);

          if (cartSnap.exists()) {
            setCart(cartSnap.data().items || []);
          } else {
            setCart([]);
          }
        } catch (error) {
          console.error("❌ Error fetching cart:", error);

          setCart([]);
        }

        setIsCartLoaded(true);
      } else {
        // Clear cart when logged out
        setCart([]);

        setIsCartLoaded(false);
      }
    };

    if (isAuthReady) {
      fetchCart();
    }
  }, [user, isAuthReady]);

  // =========================================================
  // SAVE CART TO FIRESTORE
  // =========================================================

  useEffect(() => {
    const saveCart = async () => {
      if (user && isCartLoaded) {
        try {
          const cartRef = doc(db, "carts", user.uid);

          await setDoc(cartRef, {
            items: cart,
          });
        } catch (error) {
          console.error("❌ Error saving cart:", error);
        }
      }
    };

    saveCart();
  }, [cart, user, isCartLoaded]);

  // =========================================================
  // ADD ITEM TO CART
  // =========================================================

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item,
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, quantity),
            }
          : item,
      ),
    );
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // =========================================================
  // CLEAR ENTIRE CART
  // =========================================================

  const clearCart = () => {
    setCart([]);
  };

  // =========================================================
  // CHECK IF PRODUCT IS IN CART
  // =========================================================

  const isInCart = (id) => {
    return cart.some((item) => item.id === id);
  };

  // =========================================================
  // CONTEXT
  // =========================================================

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isInCart,
        user,
        isAuthReady,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
