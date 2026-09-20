// src/utils/shop.js
//
// Shared helpers used by Products.jsx and Cart.jsx
//  - weight options + formatters
//  - remembers the KG chosen for every cart item (localStorage)
//  - wishlist hook (localStorage)

import { useCallback, useEffect, useState } from "react";

/* =====================================================
   WEIGHT OPTIONS + FORMATTERS
===================================================== */

export const WEIGHT_OPTIONS = [
  { value: 0.25, label: "250 g" },
  { value: 0.5, label: "500 g" },
  { value: 0.75, label: "750 g" },
  { value: 1, label: "1 KG" },
  { value: 1.5, label: "1.5 KG" },
  { value: 2, label: "2 KG" },
  { value: 2.5, label: "2.5 KG" },
  { value: 3, label: "3 KG" },
];

export const formatWeight = (weight) => {
  const w = Number(weight) || 1;

  if (w < 1) {
    return `${Math.round(w * 1000)} g`;
  }

  return `${w} KG`;
};

export const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN");

/* =====================================================
   SAFE LOCALSTORAGE
===================================================== */

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked or full – ignore */
  }
};

/* =====================================================
   CART WEIGHTS  { [productId]: 0.5 | 1 | 2 ... }
===================================================== */

const WEIGHTS_KEY = "kmr_cart_weights";

export const loadWeights = () => read(WEIGHTS_KEY, {});

export const saveWeight = (id, weight) => {
  const all = loadWeights();

  all[String(id)] = Number(weight) || 1;

  write(WEIGHTS_KEY, all);

  return all;
};

export const removeWeight = (id) => {
  const all = loadWeights();

  delete all[String(id)];

  write(WEIGHTS_KEY, all);

  return all;
};

export const clearWeights = () => {
  write(WEIGHTS_KEY, {});

  return {};
};

/* =====================================================
   WISHLIST
   Stores a small snapshot of each product, so the Cart
   page can show wishlist items without loading Firestore.
===================================================== */

const WISHLIST_KEY = "kmr_wishlist";

const toSnapshot = (product) => ({
  id: product.id,
  name: product.name || product.productName || "",
  price: Number(product.price) || 0,
  image: product.image || product.imageUrl || product.img || "",
  category: product.category || "",
  description: product.description || "",
});

export function useWishlist() {
  const [items, setItems] = useState(() => read(WISHLIST_KEY, []));

  useEffect(() => {
    write(WISHLIST_KEY, items);
  }, [items]);

  const has = useCallback(
    (id) => items.some((item) => String(item.id) === String(id)),
    [items],
  );

  const toggle = useCallback((product) => {
    setItems((previous) => {
      const exists = previous.some(
        (item) => String(item.id) === String(product.id),
      );

      return exists
        ? previous.filter((item) => String(item.id) !== String(product.id))
        : [toSnapshot(product), ...previous];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((previous) =>
      previous.filter((item) => String(item.id) !== String(id)),
    );
  }, []);

  return {
    items,
    count: items.length,
    has,
    toggle,
    remove,
  };
}
