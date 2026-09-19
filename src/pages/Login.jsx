import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { GiFruitBowl } from "react-icons/gi";
import kmrlogo from "../assets/images/kmrlogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth(app);
  const navigate = useNavigate();
  const googleprovider = new GoogleAuthProvider();

  // Email/Password login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      console.log("loggedIn");
      navigate("/home");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  // Google login
  const handleGooglelogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithPopup(auth, googleprovider);

      console.log("google login successful");
      navigate("/home");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-[#f7fbf4] bg-contain bg-no-repeat bg-center relative"
      style={{ backgroundImage: `url(${kmrlogo})` }}
    >
      {/* Dark green overlay */}
      <div className="absolute inset-0 bg-[#083f26]/70"></div>

      {/* Login Card */}
      <div className="relative bg-[#f7fbf4]/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#dbe8d7] z-10">
        {/* Logo / Heading */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <GiFruitBowl className="text-4xl text-[#075c35]" />

          <h2 className="text-3xl font-extrabold text-center text-[#075c35]">
            Fresh Market Login
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-[#dbe8d7] bg-white text-[#083f26] placeholder-[#718579] p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#075c35] focus:border-[#075c35] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-[#dbe8d7] bg-white text-[#083f26] placeholder-[#718579] p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#075c35] focus:border-[#075c35] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#075c35] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-[#083f26] hover:scale-[1.02] transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Google Login */}
        <button
          className="w-full flex items-center justify-center gap-3 rounded-lg mt-5 bg-white border border-[#dbe8d7] text-[#083f26] p-3 font-semibold shadow-md hover:bg-[#eaf5e5] hover:scale-[1.02] transition-all duration-300"
          onClick={handleGooglelogin}
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        {/* Register Link */}
        <p className="text-center mt-6 text-[#52665b]">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#075c35] font-semibold hover:text-[#083f26] hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Forgot Password */}
        <p className="text-center mt-3">
          <Link
            to="/forgot-password"
            className="text-[#075c35] font-semibold hover:text-[#083f26] hover:underline"
          >
            Forgot Password?
          </Link>
        </p>
      </div>

      {/* Error Popup Modal */}
      {error && (
        <div className="fixed inset-0 bg-[#083f26]/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-[#dbe8d7] p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <h3 className="text-[#075c35] font-bold text-lg mb-3">
              Login Error
            </h3>

            <p className="text-[#52665b] mb-4">{error}</p>

            <button
              className="bg-[#075c35] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#083f26] transition"
              onClick={() => setError("")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
