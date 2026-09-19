import { FaGooglePlay, FaApple } from "react-icons/fa";

import logo from "../assets/images/kmrlogo.png";

function Footer() {
  return (
    <footer className="w-full bg-[#075c35] text-white py-10 transition-colors duration-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {/* Column 1 - About with Logo */}

        <div>
          <img src={logo} alt="FreshMart Logo" className="h-12 w-auto mb-4" />

          <h2 className="text-xl font-semibold mb-4">FreshMart</h2>

          <p className="text-sm leading-6 text-[#eaf5e5]">
            FreshMart is your one-stop destination for fresh groceries, fruits,
            and vegetables delivered straight to your doorstep.
          </p>
        </div>

        {/* Column 2 - Quick Links */}

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>

          <ul className="space-y-2 text-sm text-[#eaf5e5]">
            <li>
              <a
                href="/"
                className="hover:text-white hover:underline transition"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="/products"
                className="hover:text-white hover:underline transition"
              >
                Products
              </a>
            </li>

            <li>
              <a
                href="/about"
                className="hover:text-white hover:underline transition"
              >
                About
              </a>
            </li>

            <li>
              <a
                href="/contact"
                className="hover:text-white hover:underline transition"
              >
                Contact
              </a>
            </li>

            <li>
              <a
                href="/blog"
                className="hover:text-white hover:underline transition"
              >
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Follow Us */}

        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>

          <ul className="space-y-2 text-sm text-[#eaf5e5]">
            <li>
              <a
                href="#"
                className="hover:text-white hover:underline transition"
              >
                Facebook
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-white hover:underline transition"
              >
                Twitter
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-white hover:underline transition"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 - Download App */}

        <div>
          <h2 className="text-xl font-semibold mb-4">Download App</h2>

          <div className="flex flex-col space-y-3">
            {/* Google Play */}

            <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#083f26] text-white hover:bg-[#052c1b] transition-colors shadow-md">
              <FaGooglePlay size={18} />
              Google Play
            </button>

            {/* App Store */}

            <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#083f26] text-white hover:bg-[#052c1b] transition-colors shadow-md">
              <FaApple size={18} />
              App Store
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}

      <div className="mt-10 text-center border-t border-[#dbe8d7]/30 pt-4 text-sm text-[#eaf5e5]">
        © {new Date().getFullYear()} FreshMart. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
