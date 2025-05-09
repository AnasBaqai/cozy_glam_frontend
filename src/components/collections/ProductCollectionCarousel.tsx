import { Link } from "react-router-dom";
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | "">(
    ""
  );
  const [changingPage, setChangingPage] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 8;
  const ITEMS_PER_ROW = 4;
  const ROWS_PER_PAGE = 2;

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

  const loadPage = async (pageNumber: number) => {
    if (pageNumber < 1 || (pageNumber > totalPages && totalPages > 0)) return;

    try {
      setChangingPage(true);
      setSlideDirection(pageNumber > currentPage ? "left" : "right");

      const response = await categoryService.getCategories(
        pageNumber,
        ITEMS_PER_PAGE
      );

      setTimeout(() => {
        setCategories(response.data.categories);
        setCurrentPage(pageNumber);
        setTotalPages(Math.ceil(response.data.totalPages));

        setTimeout(() => {
          setSlideDirection("");
          setChangingPage(false);
        }, 300);
      }, 200);

      if (desktopScrollRef.current) desktopScrollRef.current.scrollLeft = 0;
      if (mobileScrollRef.current) mobileScrollRef.current.scrollLeft = 0;
    } catch (error) {
      console.error(`Failed to fetch page ${pageNumber}:`, error);
      setSlideDirection("");
      setChangingPage(false);
    }
  };

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

  const itemsPerDesktopPage = ITEMS_PER_ROW * ROWS_PER_PAGE;

  const slideClasses = {
    container: `transition-all duration-500 ease-in-out transform ${
      slideDirection === "left"
        ? "-translate-x-8 opacity-0"
        : slideDirection === "right"
        ? "translate-x-8 opacity-0"
        : ""
    }`,
  };

  const renderCategoryCard = (category: Category, idx: number) => (
    <Link
      to={`/category/${slugify(category.name)}`}
      className="group relative block overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setHoveredCategory(category._id)}
      onMouseLeave={() => setHoveredCategory(null)}
      key={`${category._id}-${idx}`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={getFullImageUrl(category.image)}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold tracking-wide mb-2">
          {category.name}
        </h3>
        <div
          className={`transform transition-all duration-300 ${
            hoveredCategory === category._id
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <p className="text-sm text-gray-200 mb-3">
            Explore our collection of {category.name.toLowerCase()}
          </p>
          <span className="inline-flex items-center text-sm font-medium text-white">
            View Collection
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 relative z-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Explore Categories
          </h2>
          <p className="text-gray-600 text-lg">
            Discover our curated collection of products
          </p>
        </div>

        {/* Desktop Navigation Controls */}
        <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || changingPage}
            className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              currentPage <= 1 || changingPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-glam-primary hover:text-white shadow-sm hover:shadow-md"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Previous</span>
          </button>

          <span className="text-gray-600 font-medium">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || changingPage}
            className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              currentPage >= totalPages || changingPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-glam-primary hover:text-white shadow-sm hover:shadow-md"
            }`}
          >
            <span>Next</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {loading && categories.length === 0 ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-glam-primary border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Loading Overlay */}
          {changingPage && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-sm">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-glam-primary border-t-transparent"></div>
              </div>
            </div>
          )}

          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div
              ref={mobileScrollRef}
              className="overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar"
            >
              <div className={`flex gap-4 ${slideClasses.container}`}>
                {categories.map((category, idx) => (
                  <div
                    key={`${category._id}-${idx}`}
                    className="w-[300px] flex-shrink-0 snap-start"
                  >
                    {renderCategoryCard(category, idx)}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={goToPrevPage}
                disabled={currentPage <= 1 || changingPage}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentPage <= 1 || changingPage
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-glam-primary hover:text-white shadow-sm"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <span className="text-gray-600 font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages || changingPage}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentPage >= totalPages || changingPage
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-glam-primary hover:text-white shadow-sm"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="overflow-hidden">
              <div ref={desktopScrollRef} className={slideClasses.container}>
                <div className="grid grid-cols-4 gap-6">
                  {categories.map((category, idx) => (
                    <div key={`${category._id}-${idx}`} className="w-full">
                      {renderCategoryCard(category, idx)}
                    </div>
                  ))}
                  {[...Array(itemsPerDesktopPage - categories.length)].map(
                    (_, idx) => (
                      <div key={`empty-${idx}`} className="w-full"></div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCollectionCarousel;
