import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";

const CheckoutSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 mt-16 md:mt-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-serif text-glam-dark mb-4">
              Thank You for Your Order!
            </h1>

            <p className="text-gray-600 mb-8">
              Your order has been successfully placed. We'll send you an email
              with your order details and tracking information once your package
              ships.
            </p>

            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block w-full sm:w-auto bg-glam-primary hover:bg-glam-dark text-white font-medium py-3 px-8 rounded-xl transition transform hover:scale-[1.02]"
              >
                Continue Shopping
              </Link>

              <div className="text-sm text-gray-500 mt-6">
                Need help?{" "}
                <a href="#" className="text-glam-primary hover:underline">
                  Contact our support team
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutSuccessPage;
