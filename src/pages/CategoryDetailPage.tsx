import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";
import SubCategoryCard from "../components/ui/SubCategoryCard";
import { categoryService } from "../services/api";
import { Category, SubCategory } from "../types/category.types";
import { createSlug, slugToName } from "../utils/urlUtils";

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = slug ? slugToName(slug) : "Category";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [matchedCategory, setMatchedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategoryAndSubcategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get all categories to find the one that matches our slug
        const categoriesResponse = await categoryService.getCategories();
        const categories = categoriesResponse.data.categories;

        const foundCategory = categories.find(
          (cat) => createSlug(cat.name) === slug
        );

        if (!foundCategory) {
          setError("Category not found");
          setLoading(false);
          return;
        }

        setMatchedCategory(foundCategory);

        // Now fetch subcategories for this category
        try {
          const subcategoriesResponse = await categoryService.getSubCategories(
            foundCategory._id
          );
          setSubcategories(subcategoriesResponse.data.subcategories);
        } catch (subcatError) {
          console.error("Error fetching subcategories:", subcatError);
          // Fallback to mock data if API fails
          const mockSubcategories = categoryService.getMockSubCategories(
            foundCategory._id
          );
          setSubcategories(mockSubcategories);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError("Failed to load category data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndSubcategories();
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-1 mt-24 md:mt-28">
        {/* Category Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 bg-white px-4 py-3 rounded-lg shadow-sm">
            <a href="/" className="hover:text-amber-600 transition-colors">
              Home
            </a>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-amber-600 font-medium">{categoryName}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            {categoryName}
          </h1>

          <p className="text-gray-600 max-w-2xl">
            Explore our collection of {categoryName.toLowerCase()} products
            across various subcategories. Find the perfect items to match your
            style and needs.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Subcategories Grid */}
        {!loading && !error && subcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Browse {categoryName} Subcategories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {subcategories.map((subcategory) => (
                <SubCategoryCard
                  key={subcategory._id}
                  name={subcategory.name}
                  image={subcategory.imageUrl || ""}
                  categoryName={categoryName}
                  id={subcategory._id}
                  categoryId={matchedCategory?._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Subcategories Found */}
        {!loading && !error && subcategories.length === 0 && (
          <div className="bg-amber-50 border border-amber-100 text-amber-700 px-4 py-3 rounded-lg">
            <p>
              No subcategories found for this category. Please check back later.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryDetailPage;
