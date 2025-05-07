import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";
import ProductSubcategoryCard from "../components/ui/ProductSubcategoryCard";
import { slugToName } from "../utils/urlUtils";
import { MockProduct } from "../types/category.types";
import { getProductsForSubcategory } from "../services/mockProductService";

const SubcategoryProductsPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string;
    subcategorySlug: string;
  }>();

  const categoryName = categorySlug ? slugToName(categorySlug) : "Category";
  const subcategoryName = subcategorySlug
    ? slugToName(subcategorySlug)
    : "Subcategory";

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    // Simulate API call with a delay
    setLoading(true);
    const timer = setTimeout(() => {
      // Generate mock products for this subcategory
      const mockProducts = getProductsForSubcategory(
        categorySlug || "unknown",
        categoryName,
        subcategorySlug || "unknown",
        subcategoryName
      );
      setProducts(mockProducts);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [categorySlug, categoryName, subcategorySlug, subcategoryName]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (filter === "under50" && product.price < 50) return true;
    if (filter === "50to100" && product.price >= 50 && product.price <= 100)
      return true;
    if (filter === "over100" && product.price > 100) return true;
    return false;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceLow") return a.price - b.price;
    if (sortBy === "priceHigh") return b.price - a.price;
    if (sortBy === "newest") return Math.random() - 0.5; // Mock random sort for demo
    return 0; // Default: featured
  });

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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product) => (
              <ProductSubcategoryCard
                key={product.id}
                id={product.id}
                title={product.title}
                image={product.image}
                price={product.price}
                description={product.description}
                categoryName={product.categoryName}
                subcategoryName={product.subcategoryName}
              />
            ))}
          </div>
        )}

        {/* No Products Found */}
        {!loading && sortedProducts.length === 0 && (
          <div className="bg-amber-50 border border-amber-100 text-amber-700 px-4 py-3 rounded-lg">
            <p>
              No products found with the selected filters. Please try different
              filters or check back later.
            </p>
          </div>
        )}

        {/* Results Summary */}
        {!loading && sortedProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {sortedProducts.length} products
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SubcategoryProductsPage;
