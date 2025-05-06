import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import { useRef, useState, useEffect } from "react";
import { Category, categoryService } from "../../services/api";
import { getFullImageUrl } from "../../utils/imageUtils";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ProductCollectionCarousel = () => {
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // State for categories data
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | "">(
    ""
  );
  const [changingPage, setChangingPage] = useState(false);

  // Display settings
  const ITEMS_PER_PAGE = 10;
  const ITEMS_PER_ROW = 5;
  const ROWS_PER_PAGE = 2;

  // Initial fetch of categories
  useEffect(() => {
    const fetchInitialCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategories(1, ITEMS_PER_PAGE);
        setCategories(response.data.categories);
        setTotalPages(Math.ceil(response.data.totalPages));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCategories();
  }, []);

  // Function to load categories for a specific page
  const loadPage = async (pageNumber: number) => {
    if (pageNumber < 1 || (pageNumber > totalPages && totalPages > 0)) return;

    try {
      setChangingPage(true);
      // Set slide animation direction
      setSlideDirection(pageNumber > currentPage ? "left" : "right");

      const response = await categoryService.getCategories(
        pageNumber,
        ITEMS_PER_PAGE
      );

      // Small delay to make animation visible
      setTimeout(() => {
        setCategories(response.data.categories);
        setCurrentPage(pageNumber);
        setTotalPages(Math.ceil(response.data.totalPages));

        // Clear animation after transition
        setTimeout(() => {
          setSlideDirection("");
          setChangingPage(false);
        }, 300);
      }, 200);

      // Scroll to top of carousel
      if (desktopScrollRef.current) {
        desktopScrollRef.current.scrollLeft = 0;
      }
      if (mobileScrollRef.current) {
        mobileScrollRef.current.scrollLeft = 0;
      }
    } catch (error) {
      console.error(`Failed to fetch page ${pageNumber}:`, error);
      setSlideDirection("");
      setChangingPage(false);
    }
  };

  // Navigation handlers
  const goToNextPage = () => {
    if (currentPage < totalPages && !changingPage) {
      loadPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1 && !changingPage) {
      loadPage(currentPage - 1);
    }
  };

  // Create pages for desktop and mobile views
  const itemsPerDesktopPage = ITEMS_PER_ROW * ROWS_PER_PAGE;

  // CSS classes for slide animation
  const slideClasses = {
    container: `transition-transform duration-300 ease-in-out transform ${
      slideDirection === "left"
        ? "-translate-x-8 opacity-0"
        : slideDirection === "right"
        ? "translate-x-8 opacity-0"
        : ""
    }`,
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 relative z-0">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">Our Categories</h2>
      </div>

      {loading && categories.length === 0 ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glam-primary"></div>
        </div>
      ) : (
        <div className="relative">
          {/* Centered spinner that appears during page transitions */}
          {changingPage && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-glam-primary"></div>
            </div>
          )}

          {/* Mobile Layout: Carousel with navigation */}
          <div className="relative block md:hidden">
            <div
              ref={mobileScrollRef}
              className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory"
            >
              <div
                className={`flex gap-4 w-max px-2 ${slideClasses.container}`}
              >
                {categories.map((category, idx) => (
                  <div
                    key={`${category._id}-${idx}`}
                    className="w-[300px] flex-shrink-0 snap-start"
                  >
                    <Link
                      to={`/category/${slugify(category.name)}`}
                      className="block"
                      aria-label={`View ${category.name} category`}
                    >
                      <ProductCard
                        title={category.name}
                        image={getFullImageUrl(category.image)}
                      />
                    </Link>
                  </div>
                ))}

                {/* Loading indicator for more items */}
                {loading && (
                  <div className="w-[300px] flex-shrink-0 snap-start flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glam-primary"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile page indicator & navigation */}
            <div className="flex justify-center items-center mt-6 gap-6">
              <button
                onClick={goToPrevPage}
                disabled={currentPage <= 1 || changingPage}
                className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                  currentPage <= 1 || changingPage
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Previous page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {changingPage ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-glam-primary"></div>
              ) : (
                <span className="text-center font-medium text-gray-800">
                  Page {currentPage} of {totalPages}
                </span>
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages || changingPage}
                className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                  currentPage >= totalPages || changingPage
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Next page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Layout: 4x2 grid with navigation */}
          <div className="relative hidden md:block">
            <div className="overflow-hidden">
              <div
                ref={desktopScrollRef}
                className={`${slideClasses.container} relative`}
              >
                <div className="grid grid-cols-4 grid-rows-2 gap-6 w-full">
                  {categories.map((category, idx) => (
                    <div key={`${category._id}-${idx}`} className="w-full">
                      <Link
                        to={`/category/${slugify(category.name)}`}
                        className="block"
                        aria-label={`View ${category.name} category`}
                      >
                        <ProductCard
                          title={category.name}
                          image={getFullImageUrl(category.image)}
                        />
                      </Link>
                    </div>
                  ))}

                  {/* Add empty cells to complete the grid if needed */}
                  {[...Array(itemsPerDesktopPage - categories.length)].map(
                    (_, idx) => (
                      <div key={`empty-${idx}`} className="w-full"></div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Fixed position left/right arrows for desktop - with increased spacing */}
            {categories.length > 0 && (
              <>
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage <= 1 || changingPage}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md ${
                    currentPage <= 1 || changingPage
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Previous page"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages || changingPage}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md ${
                    currentPage >= totalPages || changingPage
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Next page"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Desktop page indicator - centered below the carousel */}
            <div className="flex justify-center items-center mt-8">
              {changingPage ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-glam-primary"></div>
              ) : (
                <span className="text-center font-medium text-lg text-gray-800">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCollectionCarousel;
