import { useState } from "react";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import { app } from "../firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth(app);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7fbf4] px-4 transition-colors duration-300">
      <div className="bg-white border border-[#dbe8d7] p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-[#075c35] mb-6">
          Reset Password
        </h2>

        {/* Form */}
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-[#dbe8d7] bg-[#f7fbf4] text-[#083f26] placeholder-[#718579] p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-[#075c35] focus:border-[#075c35] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#075c35] text-white py-3 rounded-lg hover:bg-[#083f26] font-semibold transition duration-300"
          >
            Send Reset Email
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <p className="mt-4 text-[#075c35] font-semibold text-center">
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
