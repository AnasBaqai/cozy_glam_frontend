import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/cozy_glam_logo-removebg-preview.png";
import { useCart } from "../../../context/CartContext";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { logout } from "../../../store/slices/authSlice";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getTotalCount } = useCart();
  const cartCount = getTotalCount();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isSellerWithStore =
    user?.role === "seller" && user?.isStoreCreated === true;
  const isSellerWithoutStore = user?.role === "seller" && !user?.isStoreCreated;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
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

  // Function to handle dropdown toggle
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav
      className={`w-full bg-white shadow-sm px-4 md:px-6 py-3 fixed left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled ? "top-0" : "top-9"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <img
              src={logo}
              alt="CozyGlam Logo"
              className="h-16 w-16 object-contain"
            />
          </Link>
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
            <Link
              key={link.label}
              to={link.href}
              className="text-base lg:text-lg font-medium text-glam-dark hover:text-glam-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isSellerWithStore && (
            <Link
              to="/dashboard"
              className="text-base lg:text-lg font-medium text-glam-dark hover:text-glam-primary transition-colors"
            >
              Dashboard
            </Link>
          )}
          {isSellerWithoutStore && (
            <Link
              to="/business-info"
              className="text-base lg:text-lg font-medium text-glam-dark hover:text-glam-primary transition-colors"
            >
              Business Info
            </Link>
          )}
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

          {isAuthenticated ? (
            <div ref={dropdownRef} className="relative">
              <button
                className="text-glam-dark hover:text-glam-primary flex items-center"
                onClick={toggleDropdown}
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
                <span className="ml-2 hidden lg:inline text-sm font-medium truncate max-w-[80px]">
                  {user?.name?.split(" ")[0]}
                </span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    {isSellerWithStore && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    {isSellerWithoutStore && (
                      <Link
                        to="/business-info"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Business Info
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-glam-dark hover:text-glam-primary"
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
            </Link>
          )}

          <Link
            to="/cart"
            className="text-glam-dark hover:text-glam-primary relative"
          >
            <img
              src={"/icons/shopping_bag.png"}
              alt="cart"
              className="h-6 w-6"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-glam-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-col space-y-2 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
              >
                {link.label}
              </Link>
            ))}
            {isSellerWithStore && (
              <Link
                to="/dashboard"
                className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
              >
                Dashboard
              </Link>
            )}
            {isSellerWithoutStore && (
              <Link
                to="/business-info"
                className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
              >
                Business Info
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-left text-base font-medium text-glam-dark hover:text-glam-primary py-2"
              >
                Sign out
              </button>
            )}
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

            {!isAuthenticated && (
              <Link
                to="/login"
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
              </Link>
            )}

            <Link
              to="/cart"
              className="text-glam-dark hover:text-glam-primary py-2 relative"
            >
              <img
                src={"/icons/shopping_bag.png"}
                alt="cart"
                className="h-6 w-6"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-glam-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
