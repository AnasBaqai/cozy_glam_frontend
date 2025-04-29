import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";

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
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Mock API that returns more products
const fetchMoreProducts = () => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Return more products (for demo, we'll recycle existing ones with new IDs)
      resolve([
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
      ]);
    }, 1500);
  });
};

const ProductCollectionCarousel = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  const loadMoreProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newProducts = (await fetchMoreProducts()) as typeof sampleProducts;

      // If no more products or we've cycled twice, stop infinite scroll
      if (newProducts.length === 0 || page >= 3) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        loadMoreProducts();
      }
    }, options);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 relative z-0">
      <h2 className="text-4xl font-bold text-center mb-8">Our Collection</h2>
      <div className="w-full overflow-x-auto">
        <div className="flex w-max gap-6 px-4 py-8">
          {products.map((product, idx) => (
            <Link
              key={`${product.title}-${idx}`}
              to={`/category/${slugify(product.title)}`}
              className="block"
              aria-label={`View ${product.title} category`}
            >
              <ProductCard title={product.title} image={product.image} />
            </Link>
          ))}

          {/* Loader Element - this is what triggers more content to load */}
          {hasMore && (
            <div
              ref={loaderRef}
              className="flex items-center justify-center min-w-[200px]"
            >
              {loading ? (
                <div className="w-10 h-10 border-4 border-glam-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-10 h-10 opacity-0">•</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCollectionCarousel;
