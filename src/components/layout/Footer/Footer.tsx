import React, { useState } from "react";

const packaging = [
  "Mailing Bags",
  "Cardboard Boxes",
  "Tapes & Dispensers",
  "Envelopes",
  "Labels",
  "Wrapping Paper",
  "Void Fill & Cushioning's",
];
const homeImprovement = [
  "Duvet",
  "Pillow",
  "Cushion",
  "Mattress Protector",
  "Fitted-sheets",
  "Nursery bedding",
  "Blanket",
];
const policies = [
  { label: "Privacy Policy", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const Footer: React.FC = () => {
  const [open, setOpen] = useState({
    packaging: false,
    home: false,
    policies: false,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <footer className="bg-[#181818] text-white pt-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-12">
        {/* Packaging */}
        <div>
          <button
            className="w-full flex md:hidden justify-between items-center font-semibold mb-3 focus:outline-none"
            onClick={() => toggle("packaging")}
            aria-expanded={open.packaging}
            aria-controls="footer-packaging"
          >
            Packaging
            <span>{open.packaging ? "-" : "+"}</span>
          </button>
          <div className="hidden md:block font-semibold mb-3">Packaging</div>
          <ul
            id="footer-packaging"
            className={`space-y-1 text-sm text-gray-300 ${
              open.packaging ? "block" : "hidden"
            } md:block`}
          >
            {packaging.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {/* Home Improvement */}
        <div>
          <button
            className="w-full flex md:hidden justify-between items-center font-semibold mb-3 focus:outline-none"
            onClick={() => toggle("home")}
            aria-expanded={open.home}
            aria-controls="footer-home"
          >
            Home Improvement
            <span>{open.home ? "-" : "+"}</span>
          </button>
          <div className="hidden md:block font-semibold mb-3">
            Home Improvement
          </div>
          <ul
            id="footer-home"
            className={`space-y-1 text-sm text-gray-300 ${
              open.home ? "block" : "hidden"
            } md:block`}
          >
            {homeImprovement.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {/* Policies */}
        <div>
          <button
            className="w-full flex md:hidden justify-between items-center font-semibold mb-3 focus:outline-none"
            onClick={() => toggle("policies")}
            aria-expanded={open.policies}
            aria-controls="footer-policies"
          >
            Policies
            <span>{open.policies ? "-" : "+"}</span>
          </button>
          <div className="hidden md:block font-semibold mb-3">Policies</div>
          <ul
            id="footer-policies"
            className={`space-y-1 text-sm text-gray-300 ${
              open.policies ? "block" : "hidden"
            } md:block`}
          >
            {policies.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Sign Up and Save (always visible) */}
        <div>
          <div className="font-bold mb-3 text-lg">SIGN UP AND SAVE</div>
          <div className="mb-2 text-gray-300 text-sm">
            Sign up for exclusive offers, original stories, events and more.
          </div>
          <form className="flex mb-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-l bg-[#232323] text-white border border-gray-600 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r bg-white text-black font-semibold hover:bg-glam-primary transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
          <div className="flex items-center mb-2">
            <input type="checkbox" id="privacy" className="mr-2" />
            <label htmlFor="privacy" className="text-xs text-gray-400">
              I accept the{" "}
              <a href="#" className="underline">
                privacy policy
              </a>
            </label>
          </div>
          <div className="flex space-x-6 mt-4 mb-2">
            {/* Social icons using Flaticon PNGs and real links */}
            <a
              href="https://www.instagram.com/cozyglamshop/"
              aria-label="Instagram"
              className="hover:opacity-80"
              target="_blank"
              rel="noopener"
            >
              <img
                src="/icons/instagram.png"
                alt="Instagram"
                className="h-6 w-6 object-contain"
              />
            </a>
            <a
              href="https://www.youtube.com/@cozyglamshop"
              aria-label="YouTube"
              className="hover:opacity-80"
              target="_blank"
              rel="noopener"
            >
              <img
                src="/icons/youtube.png"
                alt="YouTube"
                className="h-6 w-6 object-contain"
              />
            </a>
            <a
              href="https://www.pinterest.com/cozyglamshop/"
              aria-label="Pinterest"
              className="hover:opacity-80"
              target="_blank"
              rel="noopener"
            >
              <img
                src="/icons/pintrest.png"
                alt="Pinterest"
                className="h-6 w-6 object-contain"
              />
            </a>
            <a
              href="https://www.tiktok.com/@cozyglamshop"
              aria-label="TikTok"
              className="hover:opacity-80"
              target="_blank"
              rel="noopener"
            >
              <img
                src="/icons/tiktok.png"
                alt="TikTok"
                className="h-6 w-6 object-contain"
              />
            </a>
            <span>
              <img
                src="/icons/facebook.png"
                alt="Facebook"
                className="h-6 w-6 object-contain opacity-50"
              />
            </span>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-[#111] py-6 text-gray-400 text-xs mt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
          <div className="flex gap-4 mb-2 md:mb-0">
            <span>Home</span>
            <span>Home-improvement</span>
            <span>Fashion</span>
            <span>Packaging</span>
            <span>About us</span>
            <span>Cart</span>
          </div>
          <div className="flex gap-2 items-center">
            {/* Payment icons using real images, styled as cards */}
            <span className="bg-white rounded-xl px-2 py-1 shadow flex items-center">
              <img
                src="/card_icons/visa.png"
                alt="Visa"
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="bg-white rounded-xl px-2 py-1 shadow flex items-center">
              <img
                src="/card_icons/master.png"
                alt="Mastercard"
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="bg-white rounded-xl px-2 py-1 shadow flex items-center">
              <img
                src="/card_icons/apple_pay.png"
                alt="Apple Pay"
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="bg-white rounded-xl px-2 py-1 shadow flex items-center">
              <img
                src="/card_icons/gpay.png"
                alt="Google Pay"
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="bg-white rounded-xl px-2 py-1 shadow flex items-center">
              <img
                src="/card_icons/paypal.png"
                alt="PayPal"
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="bg-white rounded-xl px-2 py-1 shadow flex items-center">
              <img
                src="/card_icons/discover.png"
                alt="Discover"
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="bg-white rounded-xl px-2 py-1 shadow flex items-center">
              <img
                src="/card_icons/am_ex.png"
                alt="American Express"
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="bg-white rounded-xl px-2 py-1 shadow flex items-center">
              <img
                src="/card_icons/union_pay.png"
                alt="UnionPay"
                className="h-7 w-auto object-contain"
              />
            </span>
          </div>
        </div>
        {/* Flaticon Attribution */}
        <div className="mt-4 text-center text-[10px] text-gray-500">
          <a
            href="https://www.flaticon.com/free-icons/instagram"
            title="instagram icons"
            target="_blank"
            rel="noopener"
          >
            Instagram icons created by Freepik - Flaticon
          </a>
          {" | "}
          <a
            href="https://www.flaticon.com/free-icons/tiktok"
            title="tiktok icons"
            target="_blank"
            rel="noopener"
          >
            Tiktok icons created by Freepik - Flaticon
          </a>
          {" | "}
          <a
            href="https://www.flaticon.com/free-icons/youtube"
            title="youtube icons"
            target="_blank"
            rel="noopener"
          >
            Youtube icons created by Freepik - Flaticon
          </a>
          {" | "}
          <a
            href="https://www.flaticon.com/free-icons/pintrest"
            title="pintrest icons"
            target="_blank"
            rel="noopener"
          >
            Pintrest icons created by Linseed Studio - Flaticon
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
