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
    <div className="bg-[#eaf5e5] py-16 px-6 text-center text-[#083f26] border-y border-[#dbe8d7]">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#075c35]">
        📩 Subscribe & Get Exclusive Deals
      </h2>

      <p className="mb-6 text-lg text-[#52665b]">
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
          className="px-4 py-3 rounded-lg text-[#083f26] bg-white border border-[#dbe8d7] w-72 shadow-md focus:outline-none focus:ring-4 focus:ring-[#075c35]/20 focus:border-[#075c35] transition"
        />

        <button
          type="submit"
          className="px-6 py-3 bg-[#075c35] text-white rounded-lg font-semibold shadow-lg hover:bg-[#083f26] hover:scale-105 transition duration-300"
        >
          Subscribe 🚀
        </button>
      </form>

      {/* Decorative */}
      <div className="mt-6 text-sm text-[#718579]">
        We promise not to spam you ✨
      </div>
    </div>
  );
}

export default Newsletter;
