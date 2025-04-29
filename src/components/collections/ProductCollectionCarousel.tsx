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
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ProductCollectionCarousel = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 relative z-0">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Our Collection
      </h2>

      <div className="overflow-x-auto pb-4">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          style={{ width: "max-content" }}
        >
          {sampleProducts.map((product, idx) => (
            <div key={`${product.title}-${idx}`} className="w-[300px]">
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
    </section>
  );
};

export default ProductCollectionCarousel;
