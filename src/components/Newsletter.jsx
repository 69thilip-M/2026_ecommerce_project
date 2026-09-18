import { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email!");
      return;
    }
    alert(`Thanks for subscribing, ${email}! 🎉`);
    setEmail("");
  };

  return (
    <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 py-16 px-6 text-center text-white">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-bounce">
        📩 Subscribe & Get Exclusive Deals
      </h2>
      <p className="mb-6 text-lg opacity-90">
        Join our newsletter to receive the best offers on fresh fruits & veggies
        🍎🥦
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex justify-center gap-4 flex-col md:flex-row items-center"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg text-gray-800 w-72 shadow-md focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-white text-orange-700 rounded-lg font-semibold shadow-lg hover:scale-105 hover:bg-orange-100 transition duration-300"
        >
          Subscribe 🚀
        </button>
      </form>

      {/* Decorative */}
      <div className="mt-6 text-sm opacity-80">
        We promise not to spam you ✨
      </div>
    </div>
  );
}

export default Newsletter;
