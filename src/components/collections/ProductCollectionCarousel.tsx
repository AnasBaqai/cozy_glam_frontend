import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import { useRef, useState, useEffect } from "react";

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
    title: "Table Lamp",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Table Lamp",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ProductCollectionCarousel = () => {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(0);

  // Track mobile scroll position
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const scrollLeft = mobileScrollRef.current.scrollLeft;
    const cardWidth = 300 + 16; // card width + gap
    const newIndex = Math.round(scrollLeft / cardWidth);
    setMobileActiveIndex(newIndex);
  };

  // Track desktop scroll position
  const handleDesktopScroll = () => {
    if (!desktopScrollRef.current) return;
    const scrollLeft = desktopScrollRef.current.scrollLeft;
    const pageWidth = 1000 + 24; // grid width + gap
    const newIndex = Math.round(scrollLeft / pageWidth);
    setDesktopActiveIndex(newIndex);
  };

  useEffect(() => {
    const mobileContainer = mobileScrollRef.current;
    if (mobileContainer) {
      mobileContainer.addEventListener("scroll", handleMobileScroll);
      return () =>
        mobileContainer.removeEventListener("scroll", handleMobileScroll);
    }
  }, []);

  useEffect(() => {
    const desktopContainer = desktopScrollRef.current;
    if (desktopContainer) {
      desktopContainer.addEventListener("scroll", handleDesktopScroll);
      return () =>
        desktopContainer.removeEventListener("scroll", handleDesktopScroll);
    }
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 relative z-0">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Our Collection
      </h2>

      {/* Mobile Layout: Single card with horizontal scroll */}
      <div
        ref={mobileScrollRef}
        className="block md:hidden overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory"
      >
        <div className="flex gap-4 w-max px-2">
          {sampleProducts.map((product, idx) => (
            <div
              key={`${product.title}-${idx}`}
              className="w-[300px] flex-shrink-0 snap-start"
            >
              <Link
                to={`/category/${slugify(product.title)}`}
                className="block"
                aria-label={`View ${product.title} category`}
              >
                <ProductCard title={product.title} image={product.image} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout: 3x2 grid with horizontal scroll */}
      <div
        ref={desktopScrollRef}
        className="hidden md:block overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <div className="flex gap-6 w-max px-2">
          {Array.from({ length: Math.ceil(sampleProducts.length / 6) }).map(
            (_, groupIndex) => (
              <div
                key={groupIndex}
                className="grid grid-cols-3 gap-6 w-[1000px] flex-shrink-0"
              >
                {sampleProducts
                  .slice(groupIndex * 6, (groupIndex + 1) * 6)
                  .map((product, idx) => (
                    <div key={`${product.title}-${idx}`} className="w-full">
                      <Link
                        to={`/category/${slugify(product.title)}`}
                        className="block"
                        aria-label={`View ${product.title} category`}
                      >
                        <ProductCard
                          title={product.title}
                          image={product.image}
                        />
                      </Link>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Mobile scroll indicators (one per card) */}
      <div className="flex justify-center mt-4 gap-1 md:hidden">
        {sampleProducts.map((_, idx) => (
          <div
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              idx === mobileActiveIndex ? "bg-gray-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Desktop scroll indicators (one per grid page) */}
      <div className="hidden md:flex justify-center mt-4 gap-1">
        {Array.from({ length: Math.ceil(sampleProducts.length / 6) }).map(
          (_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                idx === desktopActiveIndex ? "bg-gray-600" : "bg-gray-300"
              }`}
            />
          )
        )}
      </div>
    </section>
  );
};

export default ProductCollectionCarousel;
