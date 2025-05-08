import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";
import ProductSubcategoryCard from "../components/ui/ProductSubcategoryCard";
import { slugToName } from "../utils/urlUtils";
import { getFullImageUrl } from "../utils/imageUtils";
import { productService } from "../services/api";
import { getCategoryId, getSubcategoryId } from "../utils/categoryUtils";

// Define Product interface based on API response
interface Product {
  _id: string;
  seller_id: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  price: number;
  inventory_count: number;
  categories: {
    _id: string;
    name: string;
  };
  subcategories: Array<{
    _id: string;
    name: string;
  }>;
  tags: string[];
  images: string[];
  quantity: number;
  status: string;
  ratings: {
    average: number;
    count: number;
  };
  reviews: Array<{
    _id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Pagination interface
interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const SubcategoryProductsPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string;
    subcategorySlug: string;
  }>();

  const categoryName = categorySlug ? slugToName(categorySlug) : "Category";
  const subcategoryName = subcategorySlug
    ? slugToName(subcategorySlug)
    : "Subcategory";

  // State for products and UI
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 50,
  });

  // Fetch products from API
  const fetchProducts = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Get the stored category and subcategory IDs using our utility functions
      const categoryId = getCategoryId(categorySlug || "");
      const subcategoryId = getSubcategoryId(subcategorySlug || "");

      if (!categoryId) {
        setError(
          "Category information missing. Please navigate from the category page."
        );
        setLoading(false);
        return;
      }

      console.log(
        "Fetching products with categoryId:",
        categoryId,
        "subcategoryId:",
        subcategoryId
      );

      const response = await productService.getProductsByCategoryAndSubcategory(
        categoryId,
        subcategoryId,
        page,
        pagination.pageSize
      );

      console.log("API Response:", response);

      if (response.status) {
        console.log("Product data received:", response.data.products);

        // Log first product's image URLs for debugging
        if (response.data.products.length > 0) {
          console.log(
            "First product images:",
            response.data.products[0].images
          );
          const firstImageUrl = getFullImageUrl(
            response.data.products[0].images[0]
          );
          console.log("First image URL constructed:", firstImageUrl);
        }

        setProducts(response.data.products);
        setPagination({
          total: response.data.total,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
        });
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("An error occurred while fetching products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when parameters change
  useEffect(() => {
    fetchProducts(1);
  }, [categorySlug, subcategorySlug]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  // Filter products (client-side)
  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (filter === "under50" && product.price < 50) return true;
    if (filter === "50to100" && product.price >= 50 && product.price <= 100)
      return true;
    if (filter === "over100" && product.price > 100) return true;
    return false;
  });

  // Sort products (client-side)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceLow") return a.price - b.price;
    if (sortBy === "priceHigh") return b.price - a.price;
    if (sortBy === "newest") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return 0; // Default: featured
  });

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
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-gray-600"
      >
        &lt;
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
          className={`px-3 py-1 rounded border ${
            currentPage === i
              ? "bg-glam-primary text-white border-glam-primary"
              : "border-gray-300 hover:bg-glam-light hover:text-glam-primary text-gray-600 transition-colors"
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
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-gray-600"
      >
        &gt;
      </button>
    );

    return <div className="flex space-x-2 justify-center mt-6">{pages}</div>;
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-1 mt-24 md:mt-28">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 bg-white px-4 py-3 rounded-lg shadow-sm">
          <a href="/" className="hover:text-amber-600 transition-colors">
            Home
          </a>
          <span className="text-gray-400 mx-1">/</span>
          <a
            href={`/category/${categorySlug}`}
            className="hover:text-amber-600 transition-colors"
          >
            {categoryName}
          </a>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-amber-600 font-medium">{subcategoryName}</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            {subcategoryName}
          </h1>
          <p className="text-gray-600">
            Browse our collection of {subcategoryName.toLowerCase()} products in
            the {categoryName.toLowerCase()} category.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-700 font-medium">Filter:</span>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "all"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("under50")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "under50"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Under $50
            </button>
            <button
              onClick={() => setFilter("50to100")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "50to100"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              $50 - $100
            </button>
            <button
              onClick={() => setFilter("over100")}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === "over100"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Over $100
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-100 border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product) => {
              console.log("Product:", product.title);
              console.log("Product images:", product.images);
              const imageUrl = getFullImageUrl(product.images[0]);
              console.log("Generated image URL:", imageUrl);

              return (
                <ProductSubcategoryCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  image={imageUrl}
                  price={product.price}
                  description={product.description}
                  categoryName={product.categories.name}
                  subcategoryName={product.subcategories[0]?.name || ""}
                />
              );
            })}
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && sortedProducts.length === 0 && (
          <div className="bg-amber-50 border border-amber-100 text-amber-700 px-4 py-3 rounded-lg">
            <p>
              No products found with the selected filters. Please try different
              filters or check back later.
            </p>
          </div>
        )}

        {/* Results Summary */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {sortedProducts.length} of {pagination.total} products
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && renderPagination()}
      </div>
      <Footer />
    </div>
  );
};

export default SubcategoryProductsPage;
