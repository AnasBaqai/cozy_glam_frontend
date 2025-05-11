import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import Marquee from "../../components/layout/Marquee/Marquee";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import { useAppSelector } from "../../store/hooks";
import { productService } from "../../services/api";
import { getFullImageUrl } from "../../utils/imageUtils";
import { toast } from "react-toastify";
import "../../components/seller/dashboard/dashboard.css";
import useSidebarState from "../../hooks/useSidebarState";

// Define product type
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

// Define pagination type
interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Add this type definition after the existing interfaces
type SortOption = {
  value: string;
  label: string;
};

// Add this type definition after SortOption
type PageSizeOption = {
  value: number;
  label: string;
};

const ListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Get status from URL query params or default to 'active'
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get("status");

  // Status state (active or draft)
  const [activeTab, setActiveTab] = useState<string>(statusParam || "active");

  // Replace the useState with our custom hook
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

  // UI states
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });

  // Add new state for sorting
  const [sortBy, setSortBy] = useState<string>("newest");

  // Add sorting options
  const sortOptions: SortOption[] = [
    { value: "newest", label: "Recently Created" },
    { value: "oldest", label: "Oldest Created" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "quantity-low", label: "Quantity: Low to High" },
    { value: "quantity-high", label: "Quantity: High to Low" },
  ];

  // Add page size options
  const pageSizeOptions: PageSizeOption[] = [
    { value: 10, label: "10 per page" },
    { value: 20, label: "20 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  // Add the resetSearch function near the top of the component, right after the useState declarations
  const resetSearch = () => {
    setSearchTerm("");
    fetchProductsForCurrentTab();
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle tab change
  const handleTabChange = (status: string) => {
    setActiveTab(status);
    // Update URL without refreshing the page
    navigate(`/seller/listings?status=${status}`, { replace: true });
    toast.info(`Viewing ${status} listings`);
  };

  // Add sort function
  const sortProducts = (productsToSort: Product[]) => {
    return [...productsToSort].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "quantity-low":
          return a.quantity - b.quantity;
        case "quantity-high":
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });
  };

  // Handle page size change
  const handlePageSizeChange = async (newSize: number) => {
    setLoading(true); // Show loading state while fetching new data
    setPagination({
      ...pagination,
      pageSize: newSize,
      currentPage: 1, // Reset to first page when changing page size
    });

    try {
      const response = await productService.getSellerProducts(
        activeTab,
        1, // Reset to first page
        newSize // Use new page size
      );

      if (response.status) {
        const sortedProducts = sortProducts(response.data.products);
        setProducts(sortedProducts);
        setPagination({
          total: response.data.total,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          pageSize: newSize,
        });
        toast.success(`Now showing ${newSize} items per page`);
      } else {
        setError("Failed to update items per page");
        toast.error("Failed to update items per page");
      }
    } catch (err) {
      console.error("Error updating page size:", err);
      setError("Failed to update items per page");
      toast.error("Failed to update items per page");
    } finally {
      setLoading(false);
    }
  };

  // Add raw products state to store the original data
  const [rawProducts, setRawProducts] = useState<Product[]>([]);

  // Add a separate function to handle filtering and sorting
  const applyFiltersAndSort = (
    productsToProcess: Product[] | undefined | null
  ) => {
    // Return empty array if productsToProcess is undefined or null
    if (!productsToProcess) {
      setProducts([]);
      return;
    }

    let processedProducts = [...productsToProcess];

    // Apply search filter if search term exists
    if (searchTerm) {
      processedProducts = processedProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    processedProducts.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "quantity-low":
          return a.quantity - b.quantity;
        case "quantity-high":
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    setProducts(processedProducts);
  };

  // Update fetchProductsForCurrentTab to handle the response properly
  const fetchProductsForCurrentTab = async () => {
    if (!user?.isStoreCreated) return;

    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching products with page size: ${pagination.pageSize}`);
      const response = await productService.getSellerProducts(
        activeTab,
        pagination.currentPage,
        pagination.pageSize
      );

      // Check if the response is successful
      if (response?.status) {
        // Initialize empty arrays and default pagination values
        const products: Product[] = [];
        const paginationData = {
          total: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize: pagination.pageSize,
        };

        // If response has data and products, use them
        if (response.data?.products) {
          products.push(...response.data.products);
          paginationData.total = response.data.total || 0;
          paginationData.totalPages = response.data.totalPages || 1;
          paginationData.currentPage = response.data.currentPage || 1;
        }

        // Update state with products (even if empty)
        setRawProducts(products);
        applyFiltersAndSort(products);
        setPagination(paginationData);
        setError(null);
      } else {
        console.error("Failed to fetch products:", response);
        setError("Failed to connect to the server. Please try again later.");
        toast.error("Failed to connect to the server");
        setProducts([]);
        setRawProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to connect to the server. Please try again later.");
      toast.error("Failed to connect to the server");
      setProducts([]);
      setRawProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to only fetch when necessary
  useEffect(() => {
    // Only fetch from API when page, page size, tab, or user changes
    if (activeTab || pagination.currentPage || pagination.pageSize || user) {
      fetchProductsForCurrentTab();
    }
  }, [activeTab, pagination.currentPage, pagination.pageSize, user]);

  // Add useEffect for client-side filtering and sorting
  useEffect(() => {
    // Only apply filters and sort if we have raw products
    if (rawProducts.length > 0) {
      applyFiltersAndSort(rawProducts);
    }
  }, [sortBy, searchTerm]);

  // Update handleSearch to use client-side filtering
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Apply filters to existing data
    applyFiltersAndSort(rawProducts);
  };

  // Add handler for sort changes
  const handleSortChange = (newSortValue: string) => {
    setSortBy(newSortValue);
    // Sorting will be handled by the useEffect
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    // Update the current page in pagination state
    setPagination({ ...pagination, currentPage: page });
    // The useEffect will trigger a new API call with the updated pagination
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  // Redirect non-sellers or sellers without a store to appropriate pages
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "seller") {
      navigate("/");
    } else if (user?.role === "seller" && !user?.isStoreCreated) {
      navigate("/business-info");
    }
  }, [isAuthenticated, user, navigate]);

  // Delete product (placeholder function)
  const handleDeleteProduct = (productId: string, productTitle: string) => {
    // This would be replaced with an actual API call in a full implementation
    console.log(`Deleting product: ${productId}`);
    toast.success(`Product "${productTitle}" deleted successfully`);
    // After successful deletion, refresh the product list
    const updatedProducts = products.filter(
      (product) => product._id !== productId
    );
    setProducts(updatedProducts);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
          currentPage === 1
            ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-glam-primary hover:text-white hover:border-glam-primary"
        }`}
      >
        Previous
      </button>
    );

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === i
              ? "bg-glam-primary text-white border border-glam-primary"
              : "border border-gray-300 text-gray-700 hover:bg-glam-primary hover:text-white hover:border-glam-primary"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
          currentPage === totalPages
            ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-glam-primary hover:text-white hover:border-glam-primary"
        }`}
      >
        Next
      </button>
    );

    return (
      <div className="mt-8 mb-6 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">{pages}</div>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  // Add helper function to get sort label
  const getSortLabel = (value: string): string => {
    return sortOptions.find((option) => option.value === value)?.label || "";
  };

  // Update the empty state message in the render section
  const renderEmptyState = () => (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div className="w-24 h-24 mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-4">
        {activeTab === "active"
          ? "No Active Listings Yet"
          : "No Draft Listings Yet"}
      </h3>
      <p className="text-gray-600 mb-8">
        {activeTab === "active"
          ? "Start selling by creating your first product listing."
          : "Save product listings as drafts while you work on them."}
      </p>
      <button
        onClick={() => navigate("/seller/create-product")}
        className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-glam-primary hover:bg-glam-dark focus:outline-none transition-colors"
      >
        <svg
          className="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Create Your First Product
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Marquee />
      <Navbar />

      {/* Sidebar */}
      <SellerSidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content with adjusted margin */}
      <main
        className={`flex-1 flex flex-col items-center p-4 md:p-6 mt-28 md:mt-32 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="w-full max-w-7xl">
          {/* Header & Tabs */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Manage Listings
              </h1>
              <p className="text-gray-600 text-sm">
                View and manage your product listings
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate("/seller/create-product")}
                className="bg-glam-primary hover:bg-glam-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Listing
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => handleTabChange("active")}
                  className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "active"
                      ? "border-glam-primary text-glam-primary"
                      : "border-transparent text-gray-500 hover:text-glam-primary hover:border-glam-light"
                  }`}
                >
                  Active Listings
                </button>
                <button
                  onClick={() => handleTabChange("draft")}
                  className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "draft"
                      ? "border-glam-primary text-glam-primary"
                      : "border-transparent text-gray-500 hover:text-glam-primary hover:border-glam-light"
                  }`}
                >
                  Draft Listings
                </button>
                <div className="flex-grow"></div>
                <p className="text-sm text-glam-primary self-center font-medium">
                  {pagination.total} {pagination.total === 1 ? "item" : "items"}
                </p>
              </nav>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative flex w-full rounded-md shadow-sm overflow-hidden border border-gray-300">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="flex-grow border-0 pl-10 pr-10 py-2 focus:ring-glam-primary focus:border-glam-primary sm:text-sm"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-16 flex items-center">
                    <button
                      type="button"
                      onClick={resetSearch}
                      className="h-6 w-6 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  className="flex-shrink-0 min-w-24 py-2 px-4 text-white bg-glam-primary hover:bg-glam-dark text-sm font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Sort and Page Size Controls */}
            <div className="flex gap-2">
              {/* Page Size Dropdown */}
              <div className="flex-shrink-0">
                <select
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-glam-primary focus:border-glam-primary sm:text-sm rounded-md bg-white"
                  aria-label="Select number of items per page"
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-glam-primary focus:border-glam-primary sm:text-sm rounded-md bg-white"
                  aria-label="Sort products"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Status */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* Page Size Indicator */}
            <div className="px-3 py-2 bg-glam-light rounded-md">
              <span className="text-sm text-glam-dark">
                Showing{" "}
                <span className="font-medium">{pagination.pageSize}</span> items
                per page
              </span>
            </div>

            {/* Sort Status */}
            <div className="px-3 py-2 bg-glam-light rounded-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-glam-primary mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span className="text-sm text-glam-dark">
                Sorted by:{" "}
                <span className="font-medium">{getSortLabel(sortBy)}</span>
              </span>
            </div>

            {/* Search Term Indicator */}
            {searchTerm && (
              <div className="px-3 py-2 bg-glam-light rounded-md flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-glam-primary mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm text-glam-dark">
                  Search: <span className="font-medium">"{searchTerm}"</span>
                </span>
                <button
                  onClick={resetSearch}
                  className="ml-2 text-glam-primary hover:text-glam-dark text-sm"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Total Results */}
            <div className="px-3 py-2 bg-glam-light rounded-md ml-auto">
              <span className="text-sm text-glam-dark">
                Total: <span className="font-medium">{pagination.total}</span>{" "}
                items
              </span>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glam-primary"></div>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <div className="bg-red-50 p-4 rounded-lg mx-auto max-w-md">
                  <p className="text-red-600 font-medium mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-white bg-glam-primary hover:bg-glam-dark rounded-md text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : products.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {/* Table Header with Sort Indicators */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-glam-light">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-glam-dark uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium tracking-wider ${
                            sortBy.includes("price")
                              ? "text-glam-primary"
                              : "text-glam-dark"
                          }`}
                        >
                          Price
                          {sortBy === "price-low" && " ↓"}
                          {sortBy === "price-high" && " ↑"}
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium tracking-wider ${
                            sortBy.includes("quantity")
                              ? "text-glam-primary"
                              : "text-glam-dark"
                          }`}
                        >
                          Quantity
                          {sortBy === "quantity-low" && " ↓"}
                          {sortBy === "quantity-high" && " ↑"}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-glam-dark uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium tracking-wider ${
                            sortBy.includes("newest") ||
                            sortBy.includes("oldest")
                              ? "text-glam-primary"
                              : "text-glam-dark"
                          }`}
                        >
                          Created
                          {sortBy === "newest" && " ↓"}
                          {sortBy === "oldest" && " ↑"}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-glam-dark uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img
                                    src={getFullImageUrl(product.images[0])}
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.jpg";
                                    }}
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    No image
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {product.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  ID: {product._id.slice(-6)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatPrice(product.price)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-glam-light text-glam-primary"
                              }`}
                            >
                              {product.status === "active" ? "Active" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(product.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/seller/edit-product/${product._id}`
                                  )
                                }
                                className="p-2 text-glam-primary hover:text-glam-dark transition-colors rounded-full hover:bg-gray-100"
                                title="Edit product"
                              >
                                <img
                                  src="/icons/edit.png"
                                  alt="Edit"
                                  className="w-5 h-5"
                                />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete "${product.title}"?`
                                    )
                                  ) {
                                    handleDeleteProduct(
                                      product._id,
                                      product.title
                                    );
                                  }
                                }}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-50"
                                title="Delete product"
                              >
                                <img
                                  src="/icons/delete.png"
                                  alt="Delete"
                                  className="w-5 h-5"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    {renderPagination()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingsPage;
