import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useState } from "react";
import { app } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { GiFruitBowl } from "react-icons/gi"; // 🍎 Fruit Bowl Icon
import kmrlogo from "../assets/images/kmrlogo.png"; // ✅ Import your logo

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const auth = getAuth(app);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setPopup({
        show: true,
        message: "✅ Signup successful! Welcome to Fresh Market!",
        type: "success",
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setPopup({ show: true, message: "❌ " + err.message, type: "error" });
    }
  };

  // google signup
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setPopup({
        show: true,
        message: "✅ Google signup successful!",
        type: "success",
      });
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      setPopup({ show: true, message: "❌ " + err.message, type: "error" });
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-contain bg-no-repeat bg-center relative"
      style={{ backgroundImage: `url(${kmrlogo})` }} // ✅ full logo visible
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/20 backdrop-blur-lg p-8 shadow-xl border border-white/30 z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <GiFruitBowl className="text-4xl text-yellow-300" />
          <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-lg">
            Create Your Account
          </h2>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-white/30 bg-white/20 p-3 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-300"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-white/30 bg-white/20 p-3 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-300"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-lime-500 to-orange-600 p-3 font-semibold text-white shadow-md hover:scale-105 transition-transform duration-300"
          >
            Sign up
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <div className="h-px w-1/4 bg-white/40"></div>
          <span className="mx-2 text-white">OR</span>
          <div className="h-px w-1/4 bg-white/40"></div>
        </div>

        {/* ✅ Google Signup */}
        <button
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-white text-gray-700 p-3 font-semibold shadow-md hover:scale-105 transition-transform duration-300"
          onClick={handleGoogleSignup}
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-white">
          Already have an account?
          <Link
            to="/"
            className="ml-1 text-yellow-300 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* ✅ Popup */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div
            className={`p-6 rounded-xl shadow-xl text-center ${
              popup.type === "success" ? "bg-orange-100" : "bg-red-100"
            }`}
          >
            <p
              className={`text-lg font-semibold ${
                popup.type === "success" ? "text-orange-700" : "text-red-700"
              }`}
            >
              {popup.message}
            </p>
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
