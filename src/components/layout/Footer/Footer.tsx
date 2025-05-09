import React, { useState } from "react";
import { Link } from "react-router-dom";

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
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Home-improvement", href: "/category/home-improvement" },
  { label: "Fashion", href: "/category/fashion" },
  { label: "Packaging", href: "/category/packaging" },
  { label: "About us", href: "/about" },
  { label: "Cart", href: "/cart" },
];

const policies = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  {
    name: "Instagram",
    icon: "/icons/instagram.png",
    url: "https://www.instagram.com/cozyglamshop/",
    active: true,
  },
  {
    name: "YouTube",
    icon: "/icons/youtube.png",
    url: "https://www.youtube.com/@cozyglamshop",
    active: true,
  },
  {
    name: "Pinterest",
    icon: "/icons/pintrest.png",
    url: "https://www.pinterest.com/cozyglamshop/",
    active: true,
  },
  {
    name: "TikTok",
    icon: "/icons/tiktok.png",
    url: "https://www.tiktok.com/@cozyglamshop",
    active: true,
  },
  {
    name: "Facebook",
    icon: "/icons/facebook.png",
    url: "#",
    active: false,
  },
];

const paymentMethods = [
  { name: "Visa", icon: "/card_icons/visa.png" },
  { name: "Mastercard", icon: "/card_icons/master.png" },
  { name: "Apple Pay", icon: "/card_icons/apple_pay.png" },
  { name: "Google Pay", icon: "/card_icons/gpay.png" },
  { name: "PayPal", icon: "/card_icons/paypal.png" },
  { name: "Discover", icon: "/card_icons/discover.png" },
  { name: "American Express", icon: "/card_icons/am_ex.png" },
  { name: "UnionPay", icon: "/card_icons/union_pay.png" },
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
                <Link to={item.href} className="hover:underline">
                  {item.label}
                </Link>
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
              <Link to="/privacy" className="underline">
                privacy policy
              </Link>
            </label>
          </div>
          <div className="flex space-x-6 mt-4 mb-2">
            {/* Social icons using Flaticon PNGs and real links */}
            {socialLinks.map((social) =>
              social.active ? (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80"
                  aria-label={social.name}
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="h-6 w-6 object-contain"
                  />
                </a>
              ) : (
                <span
                  key={social.name}
                  className="bg-[#232323] rounded-full p-1 opacity-50 cursor-not-allowed"
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="h-6 w-6 object-contain"
                  />
                </span>
              )
            )}
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-[#111] py-6 text-gray-400 text-xs mt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
          <div className="flex gap-4 mb-2 md:mb-0">
            {quickLinks.map((link) => (
              <span key={link.label}>{link.label}</span>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            {/* Payment icons using real images, styled as cards */}
            {paymentMethods.map((method) => (
              <span
                key={method.name}
                className="bg-white rounded-xl px-2 py-1 shadow flex items-center"
                title={method.name}
              >
                <img
                  src={method.icon}
                  alt={method.name}
                  className="h-7 w-auto object-contain"
                />
              </span>
            ))}
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
