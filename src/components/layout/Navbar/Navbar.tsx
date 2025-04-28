import React from "react";
import logo from "../../../assets/images/cozy_glam_logo-removebg-preview.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Home-improvement", href: "/home-improvement" },
  { label: "Fashion", href: "/fashion" },
  { label: "Packaging", href: "/packaging" },
  { label: "About Us", href: "/about" },
];

const Navbar: React.FC = () => (
  <nav className="w-full bg-white shadow-sm flex items-center justify-between px-6 py-3">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <img
        src={logo}
        alt="CozyGlam Logo"
        className="h-16 w-16 object-contain"
      />
    </div>
    {/* Nav Links */}
    <div className="flex gap-8">
      {navLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-lg font-medium text-glam-dark hover:text-glam-primary transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
    {/* Icons */}
    <div className="flex items-center gap-6">
      {/* Search Icon */}
      <button className="text-glam-dark hover:text-glam-primary">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      {/* User Icon (Login) */}
      <a href="/login" className="text-glam-dark hover:text-glam-primary">
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
        </svg>
      </a>
      {/* Cart Icon */}
      <button className="text-glam-dark hover:text-glam-primary">
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </button>
    </div>
  </nav>
);

export default Navbar;
