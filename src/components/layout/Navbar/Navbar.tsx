import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/cozy_glam_logo-removebg-preview.png";
import { useCart } from "../../../context/CartContext";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { logout } from "../../../store/slices/authSlice";
import { Category, SubCategory, categoryService } from "../../../services/api";
import { getFullImageUrl } from "../../../utils/imageUtils";
import "./navbar-animations.css";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [mobileExpandedCategoryId, setMobileExpandedCategoryId] = useState<
    string | null
  >(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const subcategoryDebounceRef = useRef<number | null>(null);

  const { getTotalCount } = useCart();
  const cartCount = getTotalCount();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isSellerWithStore =
    user?.role === "seller" && user?.isStoreCreated === true;
  const isSellerWithoutStore = user?.role === "seller" && !user?.isStoreCreated;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await categoryService.getCategories(1, 50);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!hoveredCategoryId) {
      setSubcategories([]);
      return;
    }
    // Debounce: only fetch after 200ms of stable hover
    if (subcategoryDebounceRef.current) {
      clearTimeout(subcategoryDebounceRef.current);
    }
    setLoadingSubcategories(true);
    subcategoryDebounceRef.current = window.setTimeout(() => {
      categoryService
        .getSubCategories(hoveredCategoryId)
        .then((res) => {
          setSubcategories(res.data.subcategories || []);
        })
        .catch(() => setSubcategories([]))
        .finally(() => setLoadingSubcategories(false));
    }, 200);
    return () => {
      if (subcategoryDebounceRef.current) {
        clearTimeout(subcategoryDebounceRef.current);
      }
    };
  }, [hoveredCategoryId]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }

      if (
        event.target instanceof Element &&
        !event.target.closest(".categories-dropdown") &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  return (
    <nav
      className={`w-full bg-white shadow-md px-2 md:px-4 py-3 fixed left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled ? "top-0" : "top-9"
      }`}
    >
      <div className="w-full mx-0 px-0">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="CozyGlam Logo"
              className="h-16 w-16 object-contain"
            />
          </Link>

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

          <div className="hidden md:block flex-grow mx-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex">
                <div
                  className="relative hidden md:inline-block"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center justify-between max-w-[260px] min-w-[180px] h-[44px] py-0 px-4 bg-gray-100 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-glam-primary focus:border-glam-primary text-gray-700 categories-dropdown"
                    style={{ lineHeight: "44px" }}
                    tabIndex={0}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="flex items-center">
                      {selectedCategory ? (
                        <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 mr-2 bg-gray-100">
                          <img
                            src={getFullImageUrl(
                              categories.find(
                                (c) => c.name === selectedCategory
                              )?.image || ""
                            )}
                            alt={selectedCategory}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder.png";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 mr-2 bg-gray-50 border border-gray-200 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm font-medium truncate">
                        {selectedCategory || "All Categories"}
                      </span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 flex z-30">
                      <div className="w-[260px] max-h-[400px] overflow-y-auto bg-white rounded-l-lg shadow-xl border border-gray-200 categories-dropdown animate-fade-in-dropdown">
                        <button
                          className="flex items-center w-full text-left px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          onClick={() => {
                            setSelectedCategory("");
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 mr-2 bg-gray-50 border border-gray-200 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                          </div>
                          All Categories
                        </button>
                        <div className="py-1">
                          {categories.map((category) => (
                            <div
                              key={category._id}
                              className={`flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-glam-primary transition-colors cursor-pointer ${
                                hoveredCategoryId === category._id
                                  ? "bg-gray-100"
                                  : ""
                              }`}
                              onMouseEnter={() =>
                                setHoveredCategoryId(category._id)
                              }
                              onMouseLeave={() => setHoveredCategoryId(null)}
                              onClick={() => {
                                setSelectedCategory(category.name);
                                setIsDropdownOpen(false);
                              }}
                            >
                              <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 mr-2 bg-gray-100">
                                <img
                                  src={getFullImageUrl(category.image)}
                                  alt={category.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/placeholder.png";
                                  }}
                                />
                              </div>
                              <span className="truncate">{category.name}</span>
                              <svg
                                className="ml-auto h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="w-[420px] max-h-[400px] overflow-y-auto bg-white rounded-r-lg shadow-xl border-t border-b border-r border-gray-200 px-6 py-4 animate-fade-in-dropdown">
                        {loadingSubcategories ? (
                          <SubcategorySkeleton />
                        ) : subcategories.length > 0 ? (
                          <>
                            <div className="font-semibold text-lg mb-3">
                              {categories.find(
                                (c) => c._id === hoveredCategoryId
                              )?.name || "Subcategories"}
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                              {subcategories.map((sub) => (
                                <Link
                                  key={sub._id}
                                  to={`/subcategory/${slugify(sub.name)}`}
                                  className="flex flex-col items-center text-center hover:text-glam-primary"
                                >
                                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                                    <img
                                      src={sub.imageUrl || "/placeholder.png"}
                                      alt={sub.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "/placeholder.png";
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium truncate w-20">
                                    {sub.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-500 text-sm flex items-center justify-center h-full">
                            {hoveredCategoryId
                              ? "No subcategories found"
                              : "Hover a category to see subcategories"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Search for anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[44px] pl-4 pr-12 bg-gray-100 border-t border-b border-r border-gray-300 focus:outline-none focus:ring-1 focus:ring-glam-primary focus:border-glam-primary rounded-r-none"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center bg-glam-primary text-white px-5 rounded-r-full hover:bg-glam-primary-dark transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div ref={dropdownRef} className="relative">
                <button
                  className="text-glam-dark hover:text-glam-primary flex items-center gap-1"
                  onClick={toggleDropdown}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-medium truncate max-w-[80px]">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {user?.email}
                        </p>
                      </div>
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
                className="text-gray-700 hover:text-glam-primary font-medium transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100"
              >
                Sign in
              </Link>
            )}

            <Link
              to="/cart"
              className="text-glam-dark hover:text-glam-primary relative p-1.5 rounded-full hover:bg-gray-100"
            >
              <img
                src={"/icons/shopping_bag.png"}
                alt="cart"
                className="h-6 w-6"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-glam-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search for anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-4 pr-12 bg-gray-100 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-glam-primary focus:border-glam-primary text-sm"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center bg-glam-primary text-white px-4 rounded-r-full hover:bg-glam-primary-dark transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {isMenuOpen && (
          <div className="mt-3 md:hidden border-t border-gray-100 pt-3">
            <div className="font-medium text-gray-800 mb-2">
              Shop by Category
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="py-2 flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-glam-primary"></div>
                </div>
              ) : categories.length > 0 ? (
                <div>
                  {categories.map((category) => (
                    <div key={category._id}>
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-glam-primary transition-colors"
                        onClick={() =>
                          setMobileExpandedCategoryId(
                            mobileExpandedCategoryId === category._id
                              ? null
                              : category._id
                          )
                        }
                      >
                        <div className="h-7 w-7 rounded-full overflow-hidden flex-shrink-0 mr-3 bg-gray-100">
                          <img
                            src={getFullImageUrl(category.image)}
                            alt={category.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder.png";
                            }}
                          />
                        </div>
                        <span className="truncate flex-1">{category.name}</span>
                        <svg
                          className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${
                            mobileExpandedCategoryId === category._id
                              ? "rotate-90"
                              : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      {mobileExpandedCategoryId === category._id && (
                        <MobileSubcategories categoryId={category._id} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-2 text-sm text-gray-500">
                  No categories found
                </div>
              )}
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden mt-3 border-t border-gray-100 pt-3">
            <div className="flex flex-col space-y-2 pb-3">
              <Link
                to="/"
                className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/deals"
                className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Today's Deals
              </Link>
              <Link
                to="/about"
                className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              {isSellerWithStore && (
                <Link
                  to="/dashboard"
                  className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isSellerWithoutStore && (
                <Link
                  to="/business-info"
                  className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Business Info
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-base font-medium text-glam-dark hover:text-glam-primary py-2"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-base font-medium text-glam-dark hover:text-glam-primary py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
            <div className="flex justify-start gap-6 pt-3 border-t border-gray-100">
              <Link
                to="/cart"
                className="text-glam-dark hover:text-glam-primary py-2 relative"
                onClick={() => setIsMenuOpen(false)}
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

        <div className="hidden md:flex mt-2 justify-center space-x-8 text-sm">
          <Link to="/" className="text-gray-600 hover:text-glam-primary">
            Home
          </Link>
          <Link to="/deals" className="text-gray-600 hover:text-glam-primary">
            Today's Deals
          </Link>
          <Link to="/popular" className="text-gray-600 hover:text-glam-primary">
            Popular Items
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-glam-primary">
            About Us
          </Link>
          {isSellerWithStore ? (
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-glam-primary"
            >
              Seller Dashboard
            </Link>
          ) : (
            <Link
              to="/become-seller"
              className="text-gray-600 hover:text-glam-primary"
            >
              Become a Seller
            </Link>
          )}
          <Link to="/contact" className="text-gray-600 hover:text-glam-primary">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

const MobileSubcategories: React.FC<{ categoryId: string }> = ({
  categoryId,
}) => {
  const [subcategories, setSubcategories] = React.useState<SubCategory[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    categoryService
      .getSubCategories(categoryId)
      .then((res) => setSubcategories(res.data.subcategories || []))
      .catch(() => setSubcategories([]))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) {
    return <SubcategorySkeleton />;
  }
  if (!subcategories.length) {
    return (
      <div className="py-2 text-sm text-gray-500 pl-10">
        No subcategories found
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3 px-6 py-2">
      {subcategories.map((sub) => (
        <Link
          key={sub._id}
          to={`/subcategory/${sub.name.replace(/\s+/g, "-").toLowerCase()}`}
          className="flex flex-col items-center text-center hover:text-glam-primary"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-1">
            <img
              src={sub.imageUrl || "/placeholder.png"}
              alt={sub.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
          </div>
          <span className="text-xs font-medium truncate w-16">{sub.name}</span>
        </Link>
      ))}
    </div>
  );
};

const SubcategorySkeleton: React.FC = () => (
  <div className="grid grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-gray-200 mb-2" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

export default Navbar;
