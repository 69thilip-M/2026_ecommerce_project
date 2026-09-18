import { FaGooglePlay, FaApple } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // ✅ import theme hook
import logo from "../assets/images/kmrlogo.png"; // ✅ import your logo

function Footer() {
  const { theme } = useTheme(); // ✅ get current theme (light/dark)

  return (
    <footer
      className={`w-full py-10 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-orange-600 text-white"
      }`}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {/* Column 1 - About with Logo */}
        <div>
          {/* ✅ Logo */}
          <img src={logo} alt="FreshMart Logo" className="h-12 w-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">FreshMart</h2>
          <p className="text-sm leading-6">
            FreshMart is your one-stop destination for fresh groceries, fruits,
            and vegetables delivered straight to your doorstep.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:underline">
                Products
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Follow Us */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 - Download App */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Download App</h2>
          <div className="flex flex-col space-y-3">
            <button
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <FaGooglePlay size={18} /> Google Play
            </button>
            <button
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <FaApple size={18} /> App Store
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className={`mt-10 text-center border-t pt-4 text-sm transition-colors ${
          theme === "dark" ? "border-gray-700 text-gray-400" : "border-white/20"
        }`}
      >
        © {new Date().getFullYear()} FreshMart. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
