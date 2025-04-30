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

interface Product {
  title: string;
  image: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Function to arrange products in a custom pattern:
// - First page: normal grid (items 1-6)
// - Second page onwards:
//   - Column 1, row 1 (item 7)
//   - Column 1, row 2 (item 8)
//   - Column 3, row 1 (item 9)
//   - Column 3, row 2 (item 10)
//   - Column 2, row 1 (item 11)
//   - Column 2, row 2 (item 12)
function arrangeProductsInCustomPattern(products: Product[], itemsPerPage = 6) {
  // First page is normal grid
  const firstPage = products.slice(0, itemsPerPage);

  // If we only have one page, return it
  if (products.length <= itemsPerPage) {
    return [firstPage];
  }

  // Additional pages with custom pattern
  const extraProducts = products.slice(itemsPerPage);
  const extraPages: Product[][] = [];
  let currentPage: (Product | null)[] = Array(itemsPerPage).fill(null);

  // Position map for the custom pattern (0-based positions in a 3x2 grid)
  // [0, 1, 2]  <- row 1 (positions 0, 1, 2)
  // [3, 4, 5]  <- row 2 (positions 3, 4, 5)
  const positionOrder = [0, 3, 2, 5, 1, 4]; // Col1R1, Col1R2, Col3R1, Col3R2, Col2R1, Col2R2

  extraProducts.forEach((product, idx) => {
    const positionInPage = idx % itemsPerPage;

    // If we've filled a page, start a new one
    if (positionInPage === 0 && idx > 0) {
      extraPages.push(currentPage.filter((p): p is Product => p !== null));
      currentPage = Array(itemsPerPage).fill(null);
    }

    // Place product at the correct position in the current page
    const gridPosition = positionOrder[positionInPage];
    currentPage[gridPosition] = product;
  });

  // Add the last page if it has any products
  if (currentPage.some((p) => p !== null)) {
    extraPages.push(currentPage.filter((p): p is Product => p !== null));
  }

  return [firstPage, ...extraPages];
}

const ProductCollectionCarousel = () => {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(0);

  // Arrange products in custom pattern
  const arrangedProductPages = arrangeProductsInCustomPattern(sampleProducts);

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
          {arrangedProductPages.map((pageProducts, pageIndex) => (
            <div
              key={pageIndex}
              className="grid grid-cols-3 grid-rows-2 gap-6 w-[1000px] flex-shrink-0"
            >
              {/* First grid page: regular order */}
              {pageIndex === 0 ? (
                // First page: normal grid layout
                pageProducts.map((product, idx) => (
                  <div
                    key={`${product.title}-${idx}-${pageIndex}`}
                    className="w-full"
                  >
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
                ))
              ) : (
                // Extra pages: we use absolute positioning to place items in the grid
                // This ensures they appear in the specified pattern even with missing items
                <>
                  {[0, 1, 2, 3, 4, 5].map((position) => {
                    // Find the product at this position (if any)
                    const productIndex = pageProducts.findIndex((_, idx) => {
                      const positionOrder = [0, 3, 2, 5, 1, 4];
                      return positionOrder[idx % 6] === position;
                    });

                    if (productIndex === -1)
                      return (
                        <div
                          key={`empty-${position}-${pageIndex}`}
                          className="w-full"
                        />
                      );

                    const product = pageProducts[productIndex];
                    return (
                      <div
                        key={`${product.title}-${productIndex}-${pageIndex}`}
                        className="w-full"
                      >
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
                    );
                  })}
                </>
              )}
            </div>
          ))}
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
        {arrangedProductPages.map((_, idx) => (
          <div
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              idx === desktopActiveIndex ? "bg-gray-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductCollectionCarousel;
