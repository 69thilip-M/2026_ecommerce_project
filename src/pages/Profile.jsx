
import { useEffect, useState, useRef } from "react";

import { getAuth, updateProfile } from "firebase/auth";

import { db } from "../firebase";

import { doc, getDoc } from "firebase/firestore";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [orders, setOrders] = useState([]);

  // =========================
  // GET NAME FROM EMAIL
  // =========================

  const getNameFromEmail = (email) => {
    if (!email) return "No Name";

    let namePart = email.split("@")[0];

    namePart = namePart.replace(/[0-9]/g, "");

    return (
      namePart.charAt(0).toUpperCase() +
      namePart.slice(1)
    );
  };

  // =========================
  // PROFILE IMAGE CLICK
  // =========================

  const handleImageClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file || !user) return;

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "profileImage");

    try {
      setUploading(true);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvtx9vyr9/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();

      if (uploadedImage.secure_url) {
        const photoURL = uploadedImage.secure_url;

        const auth = getAuth();

        await updateProfile(auth.currentUser, {
          photoURL: photoURL,
        });

        setUser({
          ...user,
          photoURL: photoURL,
        });

        alert("✅ Profile picture updated!");
      } else {
        throw new Error(
          uploadedImage.error?.message ||
            "Image upload failed"
        );
      }
    } catch (error) {
      console.error("Upload failed:", error);

      alert(
        "Failed to upload image: " + error.message
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // =========================
  // AUTH LISTENER
  // =========================

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const ordersRef = doc(
          db,
          "orders",
          user.uid
        );

        const ordersSnap = await getDoc(ordersRef);

        if (ordersSnap.exists()) {
          const userOrders =
            ordersSnap.data().data || [];

          userOrders.sort(
            (a, b) =>
              new Date(b.placedAt) -
              new Date(a.placedAt)
          );

          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error
        );
      }
    };

    fetchOrders();
  }, [user]);

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7fbf4] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#dbe8d7] bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf5e5]">
            <span className="text-3xl">🌿</span>
          </div>

          <h2 className="text-2xl font-bold text-[#083f26]">
            Login Required
          </h2>

          <p className="mt-2 text-[#718579]">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    user.displayName ||
    getNameFromEmail(user.email);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fbf4] text-[#083f26]">
      <Navbar />

      <main className="flex-grow px-3 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#075c35]">
                KMR FRESH
              </p>

              <h1 className="mt-1 text-3xl font-extrabold text-[#083f26]">
                My Profile
              </h1>

              <p className="mt-1 text-sm text-[#718579]">
                Manage your account and view your orders
              </p>
            </div>

            <div className="hidden rounded-2xl bg-[#eaf5e5] px-5 py-3 text-center sm:block">
              <p className="text-xs text-[#718579]">
                Total Orders
              </p>

              <p className="text-2xl font-extrabold text-[#075c35]">
                {orders.length}
              </p>
            </div>
          </div>

          {/* =========================
              PROFILE HERO
          ========================= */}

          <section className="relative mb-6 overflow-hidden rounded-3xl bg-[#075c35] shadow-xl">

            {/* Background Decoration */}

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/5" />

            <div className="relative p-6 sm:p-8">

              <div className="flex flex-col items-center gap-6 sm:flex-row">

                {/* PROFILE IMAGE */}

                <div className="relative shrink-0">

                  <div
                    onClick={handleImageClick}
                    className={`group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/80 shadow-2xl sm:h-36 sm:w-36 ${
                      uploading
                        ? "cursor-wait"
                        : "cursor-pointer"
                    }`}
                  >
                    <img
                      src={
                        user.photoURL ||
                        "https://dummyimage.com/150x150/cccccc/000000&text=Profile"
                      }
                      alt="Profile"
                      className={`h-full w-full object-cover transition duration-300 group-hover:scale-110 ${
                        uploading
                          ? "opacity-40"
                          : "opacity-100"
                      }`}
                    />

                    {!uploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#083f26]/0 text-white opacity-0 transition-all duration-300 group-hover:bg-[#083f26]/70 group-hover:opacity-100">
                        <span className="text-2xl">
                          📷
                        </span>

                        <span className="mt-1 text-xs font-bold">
                          Change Photo
                        </span>
                      </div>
                    )}

                    {uploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#083f26]/80 text-white">
                        <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        <span className="text-xs font-bold">
                          Uploading...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CAMERA BUTTON */}

                  {!uploading && (
                    <div className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#075c35] bg-white shadow-lg">
                      <span className="text-lg">
                        📷
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* USER INFORMATION */}

                <div className="flex-1 text-center sm:text-left">

                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                    <span className="h-2 w-2 rounded-full bg-[#c8f26b]" />
                    Active Account
                  </div>

                  <h2 className="text-3xl font-extrabold text-white">
                    {displayName}
                  </h2>

                  <p className="mt-2 text-sm text-green-100">
                    {user.email}
                  </p>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-green-100">
                    Welcome back! Manage your account
                    information and keep track of your
                    KMR Fresh orders here.
                  </p>
                </div>

                {/* VERIFIED */}

                <div className="hidden rounded-2xl bg-white/10 px-6 py-5 text-center sm:block">
                  <div className="text-3xl">
                    ✓
                  </div>

                  <p className="mt-1 text-xs text-green-100">
                    Account
                  </p>

                  <p className="font-bold text-white">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              MAIN GRID
          ========================= */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* =========================
                ACCOUNT DETAILS
            ========================= */}

            <section className="rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-lg lg:col-span-2 sm:p-6">

              <div className="mb-5 flex items-center gap-3 border-b border-[#dbe8d7] pb-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5e5] text-xl">
                  👤
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#083f26]">
                    Account Details
                  </h3>

                  <p className="text-xs text-[#718579]">
                    Your account information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* EMAIL */}

                <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md">

                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">
                      ✉️
                    </span>

                    <span className="text-xs font-bold uppercase tracking-wide text-[#718579]">
                      Email
                    </span>
                  </div>

                  <p className="break-all text-sm font-semibold text-[#083f26]">
                    {user.email}
                  </p>
                </div>

                {/* PROVIDER */}

                <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md">

                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">
                      🔐
                    </span>

                    <span className="text-xs font-bold uppercase tracking-wide text-[#718579]">
                      Provider
                    </span>
                  </div>

                  <p className="text-sm font-semibold capitalize text-[#083f26]">
                    {user.providerData[0]?.providerId ||
                      "Unknown"}
                  </p>
                </div>

                {/* FIRST LOGIN */}

                <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md">

                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">
                      📅
                    </span>

                    <span className="text-xs font-bold uppercase tracking-wide text-[#718579]">
                      First Login
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#083f26]">
                    {user.metadata.creationTime
                      ? new Date(
                          user.metadata.creationTime
                        ).toLocaleString()
                      : "Not available"}
                  </p>
                </div>

                {/* LAST LOGIN */}

                <div className="rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md">

                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">
                      🕐
                    </span>

                    <span className="text-xs font-bold uppercase tracking-wide text-[#718579]">
                      Last Login
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#083f26]">
                    {user.metadata.lastSignInTime
                      ? new Date(
                          user.metadata.lastSignInTime
                        ).toLocaleString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </section>

            {/* =========================
                ORDER SUMMARY
            ========================= */}

            <section className="relative overflow-hidden rounded-3xl bg-[#083f26] p-6 text-white shadow-lg">

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5" />

              <div className="relative">

                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    🛍️
                  </div>

                  <div>
                    <p className="text-xs text-green-100">
                      Shopping Activity
                    </p>

                    <h3 className="text-lg font-bold">
                      Order Summary
                    </h3>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">

                  <p className="text-sm text-green-100">
                    Total Orders
                  </p>

                  <p className="mt-1 text-5xl font-extrabold">
                    {orders.length}
                  </p>

                  <div className="my-5 h-px bg-white/10" />

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8f26b] text-xl">
                      🚚
                    </div>

                    <div>
                      <p className="font-bold">
                        Fresh Delivery
                      </p>

                      <p className="text-xs text-green-100">
                        Your orders are tracked here
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 p-4">
                  <p className="text-xs text-green-100">
                    KMR Fresh
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Fresh products, delivered to you 🌿
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* =========================
              ORDERS
          ========================= */}

          <section className="mt-6 rounded-3xl border border-[#dbe8d7] bg-white p-5 shadow-lg sm:p-6">

            {/* HEADER */}

            <div className="mb-6 flex flex-col gap-3 border-b border-[#dbe8d7] pb-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf5e5] text-2xl">
                  📦
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-[#083f26]">
                    Your Orders
                  </h3>

                  <p className="text-sm text-[#718579]">
                    Your recent KMR Fresh purchases
                  </p>
                </div>
              </div>

              <div className="w-fit rounded-full bg-[#eaf5e5] px-4 py-2 text-xs font-bold text-[#075c35]">
                {orders.length}{" "}
                {orders.length === 1
                  ? "Order"
                  : "Orders"}
              </div>
            </div>

            {/* NO ORDERS */}

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbdcc7] bg-[#f7fbf4] px-5 py-14 text-center">

                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5e5] text-4xl">
                  🛍️
                </div>

                <h4 className="text-lg font-bold text-[#083f26]">
                  No orders yet
                </h4>

                <p className="mt-2 max-w-md text-sm text-[#718579]">
                  You haven't placed any orders yet.
                  Your purchases will appear here once
                  you place an order.
                </p>
              </div>
            ) : (

              <div className="space-y-5">

                {orders.map((order) => (

                  <div
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-[#dbe8d7] bg-[#f7fbf4] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* ORDER HEADER */}

                    <div className="flex flex-col gap-4 border-b border-[#dbe8d7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <div className="flex items-center gap-2">

                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf5e5]">
                            📦
                          </span>

                          <p className="text-lg font-bold text-[#083f26]">
                            Order #{order.id}
                          </p>
                        </div>

                        <p className="mt-2 text-xs text-[#718579]">
                          Placed on{" "}
                          {order.placedAt
                            ? new Date(
                                order.placedAt
                              ).toLocaleString()
                            : "Date unavailable"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#eaf5e5] px-4 py-3 sm:text-right">

                        <p className="text-xs text-[#718579]">
                          Order Total
                        </p>

                        <p className="text-xl font-extrabold text-[#075c35]">
                          ₹
                          {Number(
                            order.total || 0
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* ORDER ITEMS */}

                    <div className="p-4 sm:p-5">

                      <div className="mb-4 flex items-center justify-between">

                        <p className="text-xs font-bold uppercase tracking-wider text-[#718579]">
                          Order Items
                        </p>

                        <p className="text-xs font-semibold text-[#075c35]">
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1
                            ? "Item"
                            : "Items"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {order.items?.map(
                          (item, idx) => {

                            const quantity =
                              item.quantity || 1;

                            const itemTotal =
                              Number(
                                item.price || 0
                              ) * quantity;

                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-4 rounded-2xl border border-[#dbe8d7] bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                              >

                                {/* PRODUCT IMAGE */}

                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eaf5e5]">

                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                  />

                                </div>

                                {/* PRODUCT DETAILS */}

                                <div className="min-w-0 flex-1">

                                  <p className="truncate text-base font-bold text-[#083f26]">
                                    {item.name}
                                  </p>

                                  <p className="mt-1 text-sm text-[#52665b]">
                                    Qty:{" "}
                                    <span className="font-semibold text-[#083f26]">
                                      {quantity}
                                    </span>
                                  </p>

                                  <p className="mt-2 text-base font-extrabold text-[#075c35]">
                                    ₹
                                    {itemTotal.toFixed(
                                      2
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        )}

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;