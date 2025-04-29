import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";

// Demo: Generate 3 products for each category
const getCategoryProducts = (category: string) => [
  {
    title: `${category} Classic`,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    price: 29.99,
  },
  {
    title: `${category} Premium`,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    price: 49.99,
  },
  {
    title: `${category} Deluxe`,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80",
    price: 69.99,
  },
];

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Category";
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const products = getCategoryProducts(category);

  const handleAdd = (title: string) => {
    setQuantities((prev) => ({ ...prev, [title]: (prev[title] || 0) + 1 }));
  };
  const handleRemove = (title: string) => {
    setQuantities((prev) => ({
      ...prev,
      [title]: Math.max((prev[title] || 1) - 1, 0),
    }));
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Navbar />
      <div className="w-full max-w-[1440px] mx-auto px-6 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-glam-dark">{category}</h1>
          <p className="text-gray-600 mt-2">
            Explore our {category.toLowerCase()} collection
          </p>
        </div>
        <div className="flex flex-wrap -mx-3">
          {products.map((product) => (
            <div
              key={product.title}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-3 mb-6"
            >
              <ProductCard
                title={product.title}
                image={product.image}
                price={product.price}
                quantity={quantities[product.title] || 0}
                onAdd={() => handleAdd(product.title)}
                onRemove={() => handleRemove(product.title)}
                showActions
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryDetailPage;
