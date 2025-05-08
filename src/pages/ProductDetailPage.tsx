import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";
import { getFullImageUrl } from "../utils/imageUtils";
import { productService } from "../services/api";
import { useCart } from "../context/CartContext";

// Define Product interface based on API response
interface Product {
  _id: string;
  seller_id: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  price: number;
  inventory_count: number;
  categories: {
    _id: string;
    name: string;
  };
  subcategories: Array<{
    _id: string;
    name: string;
  }>;
  tags: string[];
  images: string[];
  quantity: number;
  status: string;
  ratings: {
    average: number;
    count: number;
  };
  reviews: Array<{
    _id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();

  // State for product and UI
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await productService.getProductById(productId);

        if (response.status) {
          setProduct(response.data);
          // Set the first image as selected by default
          if (response.data.images && response.data.images.length > 0) {
            setSelectedImage(getFullImageUrl(response.data.images[0]));
          }
        } else {
          setError("Failed to load product details");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          "An error occurred while fetching product details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        title: product.title,
        image: product.images[0] ? getFullImageUrl(product.images[0]) : "",
        price: product.price,
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Generate star rating
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-1 mt-24 md:mt-28">
        {/* Breadcrumb Navigation */}
        {product && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 bg-white px-4 py-3 rounded-lg shadow-sm">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-400 mx-1">/</span>
            <Link
              to={`/category/${product.categories.name.toLowerCase()}`}
              className="hover:text-amber-600 transition-colors"
            >
              {product.categories.name}
            </Link>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-amber-600 font-medium">{product.title}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Product Detail */}
        {!loading && !error && product && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Left Column - Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="border border-gray-200 rounded-lg overflow-hidden h-80">
                  <img
                    src={selectedImage || getFullImageUrl(product.images[0])}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error(`Image load error:`, selectedImage);
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                </div>

                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(getFullImageUrl(image))}
                        className={`w-16 h-16 border-2 rounded overflow-hidden ${
                          selectedImage === getFullImageUrl(image)
                            ? "border-amber-500"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={getFullImageUrl(image)}
                          alt={`${product.title} - view ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.png";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Title and Badge */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {product.title}
                    </h1>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      {product.status === "active"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    {renderRating(product.ratings.average)}
                    <span className="text-gray-500 text-sm">
                      ({product.ratings.count}{" "}
                      {product.ratings.count === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-b border-gray-200 py-4">
                  <div className="text-3xl font-bold text-glam-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {product.quantity > 0 ? (
                      <>
                        <span className="text-green-600 font-medium">
                          In Stock
                        </span>
                        <span> - {product.quantity} available</span>
                      </>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Seller Info */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Seller Information
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center text-amber-800 font-bold">
                      {product.seller_id.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">
                        {product.seller_id.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Member since {formatDate(product.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="quantity"
                      className="text-gray-700 font-medium"
                    >
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.quantity <= 0}
                      className="btn btn-lg bg-glam-primary hover:bg-amber-600 border-amber-500 hover:border-amber-600 text-white rounded-lg px-8 py-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>

                    <button className="btn btn-lg bg-glam-primary hover:bg-glam-dark border-glam-primary hover:border-glam-dark text-white rounded-lg px-8 py-3 flex-1">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="border-t border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Product Description
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Product Specifications */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Product Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Category
                      </h4>
                      <p>{product.categories.name}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Subcategories
                      </h4>
                      <p>
                        {product.subcategories
                          .map((sub) => sub.name)
                          .join(", ")}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Listed On
                      </h4>
                      <p>{formatDate(product.created_at)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Item ID
                      </h4>
                      <p>{product._id}</p>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Reviews ({product.reviews.length})
                  </h3>

                  {product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div
                          key={review._id}
                          className="border-b border-gray-200 pb-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 font-bold">
                                {review.user_id.charAt(0).toUpperCase()}
                              </div>
                              <div className="font-medium">
                                User {review.user_id.substring(0, 8)}...
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(review.created_at)}
                            </div>
                          </div>
                          <div className="mt-2">
                            {renderRating(review.rating)}
                          </div>
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-500">
                        No reviews yet. Be the first to review this product!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
