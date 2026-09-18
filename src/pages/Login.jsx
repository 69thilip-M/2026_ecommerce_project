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
import { GiFruitBowl } from "react-icons/gi"; // 🍎 Fruit bowl icon
import kmrlogo from "../assets/images/kmrlogo.png"; // ✅ fixed import

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
      className="flex items-center justify-center min-h-screen bg-contain bg-no-repeat bg-center relative"
      style={{ backgroundImage: `url(${kmrlogo})` }} // ✅ full logo visible
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Login Card */}
      <div className="relative bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 border border-white/30 z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <GiFruitBowl className="text-4xl text-yellow-300" />
          <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-lg">
            Fresh Market Login
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-white/30 bg-white/20 text-white placeholder-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-white/30 bg-white/20 text-white placeholder-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-lime-500 to-orange-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
          >
            Login
          </button>
        </form>

        {/* Google login button */}
        <button
          className="w-full flex items-center justify-center gap-3 rounded-lg mt-5 bg-white text-gray-700 p-3 font-semibold shadow-md hover:scale-105 transition-transform duration-300"
          onClick={handleGooglelogin}
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        {/* Links */}
        <p className="text-center mt-6 text-white">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
        <p className="text-center mt-3">
          <Link to="/forgot-password" className="text-lime-200 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>

      {/* Error Popup Modal */}
      {error && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-red-600 font-bold text-lg mb-3">Error</h3>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
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
