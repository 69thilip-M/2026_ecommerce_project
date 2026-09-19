import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function AddTestimonial() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !text) {
      return alert("Please fill all fields!");
    }

    if (!user) {
      return alert("You must be logged in to add a testimonial");
    }

    try {
      await addDoc(collection(db, "testimonials"), {
        name,
        text,
        userId: user.uid,
        createdAt: new Date(),
      });

      alert("Testimonial added successfully!");

      navigate("/home");
    } catch (error) {
      console.error("Error adding testimonial:", error);

      alert("Failed to add testimonial. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7fbf4] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#dbe8d7] p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        {/* Heading */}

        <h2 className="text-2xl font-bold text-[#075c35] mb-6 text-center">
          Add Testimonial
        </h2>

        {/* Name */}

        <div className="mb-4">
          <label className="block text-[#083f26] font-medium mb-1">Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-[#dbe8d7] bg-[#f7fbf4] text-[#083f26] placeholder-[#718579] focus:outline-none focus:ring-2 focus:ring-[#075c35] focus:border-[#075c35] transition"
            placeholder="Your name"
          />
        </div>

        {/* Comment */}

        <div className="mb-4">
          <label className="block text-[#083f26] font-medium mb-1">
            Comment
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-[#dbe8d7] bg-[#f7fbf4] text-[#083f26] placeholder-[#718579] focus:outline-none focus:ring-2 focus:ring-[#075c35] focus:border-[#075c35] transition resize-none"
            placeholder="Your comment"
            rows={4}
          />
        </div>

        {/* Submit Button */}

        <button
          type="submit"
          className="w-full bg-[#075c35] hover:bg-[#083f26] text-white px-4 py-2 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddTestimonial;
