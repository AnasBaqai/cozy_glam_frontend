import React, { useState, useEffect } from "react";
import logo from "../../../assets/images/cozy_glam_logo-removebg-preview.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Home-improvement", href: "/home-improvement" },
  { label: "Fashion", href: "/fashion" },
  { label: "Packaging", href: "/packaging" },
  { label: "About Us", href: "/about" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the Marquee height (9 = 36px)
      if (window.scrollY > 36) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`w-full bg-white shadow-sm px-4 md:px-6 py-3 fixed left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled ? "top-0" : "top-9"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="CozyGlam Logo"
            className="h-16 w-16 object-contain"
          />
          <a href="/" className="text-2xl font-bold text-glam-dark"></a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-glam-dark"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-4 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base lg:text-lg font-medium text-glam-dark hover:text-glam-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-3 lg:gap-6">
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
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-col space-y-2 pb-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex justify-start gap-6 pt-3 border-t border-gray-100">
            <button className="text-glam-dark hover:text-glam-primary py-2">
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
            <a
              href="/login"
              className="text-glam-dark hover:text-glam-primary py-2"
            >
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
            <button className="text-glam-dark hover:text-glam-primary py-2">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
