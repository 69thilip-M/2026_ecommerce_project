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

    if (!name || !text) return alert("Please fill all fields!");
    if (!user) return alert("You must be logged in to add a testimonial");

    try {
      await addDoc(collection(db, "testimonials"), {
        name,
        text,
        userId: user.uid,
        createdAt: new Date(),
      });
      alert("Testimonial added successfully!");
      navigate("/home"); // Redirect after submission
    } catch (error) {
      console.error("Error adding testimonial:", error);
      alert("Failed to add testimonial. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center">
          Add Testimonial
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-orange-400 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Your name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Comment
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-orange-400 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Your comment"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddTestimonial;
