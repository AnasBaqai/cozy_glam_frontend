import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";
import { productService } from "../services/api";

// Interface for product stock info
interface ProductStock {
  [key: string]: number;
}

// Add CartItem interface at the top with other interfaces
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const CartPage: React.FC = () => {
  const { items, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [stockLevels, setStockLevels] = useState<ProductStock>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch stock levels for all items in cart
  useEffect(() => {
    const fetchStockLevels = async () => {
      setError(null);
      const levels: ProductStock = {};

      try {
        for (const item of items) {
          const response = await productService.getProductById(item.id);
          if (response.status) {
            levels[item.id] = response.data.quantity;
          }
        }
        setStockLevels(levels);
      } catch (err) {
        console.error("Error fetching stock levels:", err);
        setError("Failed to fetch current stock levels");
      }
    };

    if (items.length > 0) {
      fetchStockLevels();
    }
  }, [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = "Free";
  const total = subtotal;

  const handleRemoveAll = () => {
    clearCart();
  };

  // Check if quantity exceeds stock
  const isQuantityExceedsStock = (itemId: string, quantity: number) => {
    return stockLevels[itemId] !== undefined && quantity > stockLevels[itemId];
  };

  // Handle quantity increase with stock validation
  const handleIncreaseQuantity = (item: CartItem) => {
    if (isQuantityExceedsStock(item.id, item.quantity + 1)) {
      return;
    }
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 mt-28 md:mt-32">
        {/* Cart Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-glam-dark">
            Shopping Cart {items.length > 0 && `(${items.length})`}
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
            >
              Remove all items
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Cart Items Header */}
                <div className="px-6 py-4 border-b border-gray-100 hidden md:grid md:grid-cols-12 text-sm font-medium text-gray-500">
                  <div className="md:col-span-6">Product</div>
                  <div className="md:col-span-2 text-center">Price</div>
                  <div className="md:col-span-2 text-center">Quantity</div>
                  <div className="md:col-span-2 text-right">Total</div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="md:grid md:grid-cols-12 md:gap-6">
                        {/* Product Info */}
                        <div className="md:col-span-6 flex">
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex flex-col">
                            <h3 className="font-medium text-glam-dark">
                              {item.title}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm text-rose-500 hover:text-rose-600 transition-colors mt-2 text-left w-fit"
                            >
                              Remove
                            </button>
                            {stockLevels[item.id] !== undefined && (
                              <p className="text-xs text-gray-500 mt-1">
                                {stockLevels[item.id]} available
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="md:col-span-2 flex md:justify-center items-center mt-4 md:mt-0">
                          <span className="text-sm text-gray-500 md:hidden mr-2">
                            Price:
                          </span>
                          <span className="font-medium text-glam-dark">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="md:col-span-2 flex md:justify-center items-center mt-4 md:mt-0">
                          <span className="text-sm text-gray-500 md:hidden mr-2">
                            Quantity:
                          </span>
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-glam-primary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-10 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item)}
                              className={`w-8 h-8 flex items-center justify-center transition-colors ${
                                isQuantityExceedsStock(
                                  item.id,
                                  item.quantity + 1
                                )
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-600 hover:text-glam-primary"
                              }`}
                              disabled={isQuantityExceedsStock(
                                item.id,
                                item.quantity + 1
                              )}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="md:col-span-2 flex md:justify-end items-center mt-4 md:mt-0">
                          <span className="text-sm text-gray-500 md:hidden mr-2">
                            Total:
                          </span>
                          <span className="font-medium text-glam-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/"
                  className="text-glam-primary hover:text-glam-dark transition-colors inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-glam-dark mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-glam-dark">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">
                      {shipping}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-glam-dark">Total</span>
                      <span className="text-glam-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-glam-primary hover:bg-glam-dark text-white font-medium py-3 px-4 rounded-xl transition transform hover:scale-[1.02] mt-6"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Payment Methods */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">We Accept:</p>
                    <div className="flex gap-2">
                      <img
                        src="/card_icons/visa.png"
                        alt="Visa"
                        className="h-8 w-auto"
                      />
                      <img
                        src="/card_icons/master.png"
                        alt="Mastercard"
                        className="h-8 w-auto"
                      />
                      <img
                        src="/card_icons/paypal.png"
                        alt="PayPal"
                        className="h-8 w-auto"
                      />
                      <img
                        src="/card_icons/klarna.png"
                        alt="Klarna"
                        className="h-8 w-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-bold text-glam-dark mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-glam-primary hover:bg-glam-dark text-white font-medium px-8 py-3 rounded-xl transition transform hover:scale-[1.02]"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
