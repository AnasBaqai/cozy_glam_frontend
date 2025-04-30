import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";
import { useCart } from "../context/CartContext";

// Demo: Generate 3 products for each category
const getCategoryProducts = (category: string) => [
  {
    id: `${category.toLowerCase()}-classic`,
    title: `${category} Classic`,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    price: 29.99,
  },
  {
    id: `${category.toLowerCase()}-premium`,
    title: `${category} Premium`,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    price: 49.99,
  },
  {
    id: `${category.toLowerCase()}-deluxe`,
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
  const { addToCart, removeFromCart, getItemCount } = useCart();
  const products = getCategoryProducts(category);

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-1 mt-16 md:mt-20">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-glam-dark">
            {category}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Explore our {category.toLowerCase()} collection
          </p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
          {products.map((product) => (
            <div key={product.id} className="w-full max-w-[300px]">
              <ProductCard
                title={product.title}
                image={product.image}
                price={product.price}
                quantity={getItemCount(product.id)}
                onAdd={() => addToCart(product)}
                onRemove={() => removeFromCart(product.id)}
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
