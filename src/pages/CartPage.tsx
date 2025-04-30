import React from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";
import { Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const { items, addToCart, removeFromCart, clearCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = "Free";
  const total = subtotal;

  const handleRemoveAll = () => {
    clearCart();
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 mt-16 md:mt-20">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#2E221A] mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left side - Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white/90 shadow-sm p-6">
              {items.length > 0 ? (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 ml-4">
                        <h3 className="font-medium text-[#2E221A]">
                          {item.title}
                        </h3>
                        <div className="flex items-center mt-2">
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-600"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="mx-3 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-600"
                            onClick={() => addToCart(item)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <p className="font-bold text-[#2E221A]">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="text-right mt-4">
                    <button
                      onClick={handleRemoveAll}
                      className="text-rose-400 hover:text-rose-600 text-sm transition"
                    >
                      Remove All
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                  <h3 className="text-xl font-serif font-bold text-[#2E221A] mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-[#DFAE9E] hover:bg-[#d79e8d] text-white font-medium py-2 px-6 rounded-full transition transform hover:scale-[1.02]"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Order Summary Card */}
              <div className="rounded-2xl bg-white shadow-md p-6">
                <h2 className="text-2xl font-serif font-bold text-[#2E221A] mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#2E221A]">Subtotal</span>
                    <span className="font-medium text-[#2E221A]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#2E221A]">Shipping</span>
                    <span className="font-medium text-[#2E221A]">
                      {shipping}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-lg font-medium text-[#2E221A]">
                      Total
                    </span>
                    <span className="text-lg font-bold text-[#2E221A]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full mt-6 text-white font-medium py-3 px-4 rounded-full transition transform hover:scale-[1.02] ${
                    items.length > 0
                      ? "bg-[#DFAE9E] hover:bg-[#d79e8d] hover:shadow-md"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={items.length === 0}
                >
                  Checkout
                </button>
              </div>

              {/* Promo Code Card */}
              <div className="rounded-2xl bg-white shadow-md p-6">
                <h3 className="text-lg font-serif font-bold text-[#2E221A] mb-3">
                  Promo code
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DFAE9E] focus:border-transparent placeholder-gray-400"
                    placeholder="Enter code"
                    disabled={items.length === 0}
                  />
                  <button
                    className={`text-white font-medium py-2 px-6 rounded-full transition transform hover:scale-[1.02] ${
                      items.length > 0
                        ? "bg-[#DFAE9E] hover:bg-[#d79e8d]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={items.length === 0}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
