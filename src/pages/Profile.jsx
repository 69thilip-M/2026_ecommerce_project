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

  const getNameFromEmail = (email) => {
    if (!email) return "No Name";
    let namePart = email.split("@")[0];
    namePart = namePart.replace(/[0-9]/g, "");
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
        { method: "POST", body: data }
      );
      const uploadedImage = await res.json();

      if (uploadedImage.secure_url) {
        const photoURL = uploadedImage.secure_url;
        const auth = getAuth();
        await updateProfile(auth.currentUser, { photoURL });
        setUser({ ...user, photoURL });
        alert("✅ Profile picture updated!");
      } else {
        throw new Error(uploadedImage.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Failed to upload image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const ordersRef = doc(db, "orders", user.uid);
        const ordersSnap = await getDoc(ordersRef);

        if (ordersSnap.exists()) {
          const userOrders = ordersSnap.data().data || [];
          userOrders.sort(
            (a, b) => new Date(b.placedAt) - new Date(a.placedAt)
          );
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-orange-50 dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Please log in to view profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-orange-50 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <div className="flex-grow p-6 flex flex-col items-center space-y-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 w-full max-w-2xl transform hover:scale-101 transition-transform duration-300">
          <div className="flex flex-col items-center">
            <div
              onClick={handleImageClick}
              className="relative w-36 h-36 cursor-pointer"
            >
              <img
                src={
                  user.photoURL ||
                  "https://dummyimage.com/150x150/cccccc/000000&text=Profile"
                }
                alt="Profile"
                className={`w-36 h-36 rounded-full border-4 border-orange-600 object-cover shadow-lg ${
                  uploading ? "opacity-50" : "opacity-100"
                }`}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <span className="text-white font-semibold">Uploading...</span>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <h2 className="text-3xl font-bold mt-4 text-gray-800 dark:text-gray-100">
              {user.displayName || getNameFromEmail(user.email)}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{user.email}</p>
          </div>

          <div className="mt-6 bg-orange-50 dark:bg-gray-700 rounded-xl p-5 shadow-inner">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">
              Account Details
            </h3>
            <ul className="space-y-3 text-gray-800 dark:text-gray-200">
              <li>
                <span className="font-semibold">Email:</span> {user.email}
              </li>
              <li>
                <span className="font-semibold">Provider:</span>{" "}
                {user.providerData[0]?.providerId}
              </li>
              <li>
                <span className="font-semibold">First Login:</span>{" "}
                {new Date(user.metadata.creationTime).toLocaleString()}
              </li>
              <li>
                <span className="font-semibold">Last Login:</span>{" "}
                {new Date(user.metadata.lastSignInTime).toLocaleString()}
              </li>
            </ul>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 w-full max-w-3xl space-y-6">
          <h3 className="text-2xl font-bold border-b pb-2 mb-4 text-gray-800 dark:text-gray-100">
            Your Orders
          </h3>

          {orders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              You have no orders yet.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-bold text-lg">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.placedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                    ₹{order.total}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-28 rounded-lg object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                          {item.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Qty: {item.quantity || 1}
                        </p>
                        <p className="font-medium text-orange-600 dark:text-orange-400">
                          ₹{item.price * (item.quantity || 1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
