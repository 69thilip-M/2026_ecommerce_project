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
import { GiFruitBowl } from "react-icons/gi";
import kmrlogo from "../assets/images/kmrlogo.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const auth = getAuth(app);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Signup
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
      setPopup({
        show: true,
        message: "❌ " + err.message,
        type: "error",
      });
    }
  };

  // Google Signup
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
      setPopup({
        show: true,
        message: "❌ " + err.message,
        type: "error",
      });
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#f7fbf4] bg-contain bg-no-repeat bg-center relative px-4"
      style={{ backgroundImage: `url(${kmrlogo})` }}
    >
      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-[#083f26]/70"></div>

      {/* Register Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#f7fbf4]/95 backdrop-blur-lg p-8 shadow-2xl border border-[#dbe8d7] z-10">
        {/* Heading */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <GiFruitBowl className="text-4xl text-[#075c35]" />

          <h2 className="text-3xl font-extrabold text-center text-[#075c35]">
            Create Your Account
          </h2>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-[#dbe8d7] bg-white p-3 text-[#083f26] placeholder-[#718579] outline-none focus:ring-2 focus:ring-[#075c35] focus:border-[#075c35] transition"
            required
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-[#dbe8d7] bg-white p-3 text-[#083f26] placeholder-[#718579] outline-none focus:ring-2 focus:ring-[#075c35] focus:border-[#075c35] transition"
            required
          />

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#075c35] p-3 font-semibold text-white shadow-md hover:bg-[#083f26] hover:scale-[1.02] transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <div className="h-px w-1/4 bg-[#dbe8d7]"></div>

          <span className="mx-3 text-[#718579] font-medium">OR</span>

          <div className="h-px w-1/4 bg-[#dbe8d7]"></div>
        </div>

        {/* Google Signup */}
        <button
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-white border border-[#dbe8d7] text-[#083f26] p-3 font-semibold shadow-md hover:bg-[#eaf5e5] hover:scale-[1.02] transition-all duration-300"
          onClick={handleGoogleSignup}
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        {/* Login Link */}
        <p className="text-center mt-6 text-[#52665b]">
          Already have an account?
          <Link
            to="/"
            className="ml-1 text-[#075c35] font-semibold hover:text-[#083f26] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Popup */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#083f26]/70 z-50 px-4">
          <div
            className={`p-6 rounded-2xl shadow-2xl text-center w-full max-w-sm border ${
              popup.type === "success"
                ? "bg-[#eaf5e5] border-[#dbe8d7]"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p
              className={`text-lg font-semibold ${
                popup.type === "success" ? "text-[#075c35]" : "text-red-700"
              }`}
            >
              {popup.message}
            </p>

            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="mt-4 rounded-lg bg-[#075c35] px-5 py-2 text-white font-semibold hover:bg-[#083f26] transition"
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
