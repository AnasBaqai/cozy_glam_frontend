import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

// Sample data with aesthetic images from Unsplash
const sampleProducts = [
  {
    title: "Textured Sweater",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Linen Dress",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Modern Armchair",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Decorative Vase",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Oversized T-Shirt",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Cotton Pants",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Wooden Coffee Table",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Table Lamp",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Minimalist Clock",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Ceramic Mug",
    image:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  },
];

const PAGE_SIZE = 4;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ProductCollectionCarousel: React.FC = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Simulate API pagination
  const totalPages = Math.ceil(sampleProducts.length / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const visibleProducts = sampleProducts.slice(startIdx, startIdx + PAGE_SIZE);

  const handleNext = async () => {
    if (page < totalPages) {
      setLoading(true);
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setLoading(false);
      }, 800);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 50 && page < totalPages && !loading) {
        handleNext(); // swipe left
      } else if (diff < -50 && page > 1 && !loading) {
        handlePrev(); // swipe right
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-10">Our Collection</h2>
      <div className="relative flex items-center justify-center">
        {/* Left Arrow - moved further outside */}
        <button
          onClick={handlePrev}
          disabled={page === 1 || loading}
          className="hidden md:flex absolute left-[-48px] z-20 h-2/3 items-center justify-center px-1 bg-white/70 hover:bg-white rounded-full shadow transition disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ minWidth: 36 }}
          aria-label="Previous"
        >
          <svg
            width="18"
            height="48"
            viewBox="0 0 18 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 8L5 24L13 40"
              stroke="#222"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          className="flex-1"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-h-[340px]">
            {loading ? (
              <div className="col-span-4 flex justify-center items-center h-48">
                <div className="w-10 h-10 border-4 border-glam-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              visibleProducts.map((product, idx) => (
                <Link
                  key={product.title + idx}
                  to={`/category/${slugify(product.title)}`}
                  aria-label={`View ${product.title} category`}
                  className="bg-white rounded-2xl shadow border border-gray-200 flex flex-col overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl focus:-translate-y-2 focus:shadow-2xl outline-none ring-glam-primary/40 ring-offset-2 focus:ring scale-100 hover:scale-105 focus:scale-105 duration-200"
                  tabIndex={0}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover object-center"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-end">
                    <div className="font-semibold text-lg mb-1 text-center">
                      {product.title}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        {/* Right Arrow - moved further outside */}
        <button
          onClick={handleNext}
          disabled={page === totalPages || loading}
          className="hidden md:flex absolute right-[-48px] z-20 h-2/3 items-center justify-center px-1 bg-white/70 hover:bg-white rounded-full shadow transition disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ minWidth: 36 }}
          aria-label="Next"
        >
          <svg
            width="18"
            height="48"
            viewBox="0 0 18 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 8L13 24L5 40"
              stroke="#222"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* Pagination Info (always visible) */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-700 bg-white/90 rounded-full px-4 py-1 shadow border border-gray-200">
          Page {page} of {totalPages}
        </div>
      </div>
    </section>
  );
};

export default ProductCollectionCarousel;
