/* eslint-disable no-unused-vars */
// src/pages/About.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import bannerHome from "../assets/images/banner-home.jpg";

function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // const fadeIn = {
  //   hidden: { opacity: 0 },
  //   visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  // };

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      <section className="page-hero about-page-hero">
        <div>
          <span>ABOUT KMR FRESH</span>
          <h1>
            Fresh shopping
            <br />
            from your
            <br />
            nearest store.
          </h1>
          <p>
            KMR Fresh connects you with live inventory at your nearest store.
            Fresh products are ready for collection or fast delivery straight
            from our store.
          </p>
          <div className="page-hero-points">
            <b>Fresh every day</b>
            <b>From your nearest store</b>
            <b>Fast &amp; reliable</b>
          </div>
        </div>
        <div className="page-hero-art">
          <img src={bannerHome} alt="Fresh produce from KMR Fresh" />
          <strong>Active store</strong>
        </div>
      </section>

      <div className="bg-orange-100 dark:bg-gray-900 flex-grow transition-colors duration-300">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Page Title */}
          <motion.h1
            className="text-4xl font-bold text-center text-orange-700 dark:text-orange-400 mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            About Us
          </motion.h1>

          {/* Company Info */}
          <motion.div
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-8 transition-colors duration-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            {/* About Description */}
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Welcome to{" "}
              <span className="font-semibold text-orange-700 dark:text-orange-400">
                FreshMart
              </span>{" "}
              – your one-stop shop for fresh vegetables, fruits, and organic
              products. We are committed to delivering the best quality products
              directly from farms to your doorstep.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Founded in 2024, our mission is to make healthy and organic living
              accessible to everyone. With a wide range of fresh produce, we
              ensure that your family enjoys the goodness of nature every day.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              Thank you for choosing FreshMart – where freshness meets trust. 🌱
            </p>

            {/* Vision & Mission Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              {/* Vision */}
              <div className="bg-orange-50 dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                  Our Vision
                </h3>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  To be the most trusted and convenient platform for fresh,
                  healthy, and organic produce, bringing farm-to-table goodness
                  to every home.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-orange-50 dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                  Our Mission
                </h3>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  To provide fresh, high-quality vegetables, fruits, and organic
                  products directly from local farms, ensuring sustainability,
                  health, and customer satisfaction.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Team Info */}
          <motion.div
            className="mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-semibold text-orange-700 dark:text-orange-400 mb-4">
              Our Team
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: "Kural", role: "Founder & CEO" },
                { name: "Thilip", role: "Head of Operations" },
                { name: "Narmadha", role: "Customer Relations" },
              ].map((member, i) => (
                <motion.li
                  key={i}
                  className="bg-orange-50 dark:bg-gray-700 p-4 rounded-xl shadow"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <h3 className="text-xl font-bold dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {member.role}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Static Google Map */}
          <motion.div
            className="mb-8 mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-semibold text-orange-700 dark:text-orange-400 mb-4">
              Our Location
            </h2>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="FreshMart Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.4742551580387!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670e943e8c7%3A0x1fbc!2sBangalore!5e0!3m2!1sen!2sin!4v1615189259969!5m2!1sen!2sin"
                width="100%"
                height="400"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
