import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Marquee from "../components/layout/Marquee/Marquee";

// Payment method type
type PaymentMethod = "card" | "paypal" | "klarna" | "googlepay";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Handle payment method selection
  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  // Handle checkout submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      navigate("/checkout/success");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 mt-28 md:mt-32">
        <div className="w-full">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-glam-dark mb-3">
              Checkout
            </h1>
            <p className="text-gray-600">
              Complete your purchase by providing your details below
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Payment and Shipping */}
            <div className="lg:col-span-8 space-y-6">
              {/* Payment Methods */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-glam-dark mb-4">
                  Payment Method
                </h2>

                {/* Credit Card */}
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-glam-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === "card"}
                      onChange={() => handlePaymentSelect("card")}
                      className="form-radio text-glam-primary"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-glam-dark">
                        Credit or Debit Card
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Pay securely with your card
                      </div>
                    </div>
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
                    </div>
                  </label>

                  {/* PayPal */}
                  <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-glam-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === "paypal"}
                      onChange={() => handlePaymentSelect("paypal")}
                      className="form-radio text-glam-primary"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-glam-dark">PayPal</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Pay with your PayPal account
                      </div>
                    </div>
                    <img
                      src="/card_icons/paypal.png"
                      alt="PayPal"
                      className="h-8 w-auto"
                    />
                  </label>

                  {/* Klarna */}
                  <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-glam-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === "klarna"}
                      onChange={() => handlePaymentSelect("klarna")}
                      className="form-radio text-glam-primary"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-glam-dark">
                        Pay with Klarna
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Pay in 3 interest-free installments
                      </div>
                    </div>
                    <img
                      src="/card_icons/klarna.png"
                      alt="Klarna"
                      className="h-8 w-auto"
                    />
                  </label>

                  {/* Google Pay */}
                  <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-glam-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === "googlepay"}
                      onChange={() => handlePaymentSelect("googlepay")}
                      className="form-radio text-glam-primary"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-glam-dark">
                        Google Pay
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Fast and secure checkout
                      </div>
                    </div>
                    <img
                      src="/card_icons/gpay.png"
                      alt="Google Pay"
                      className="h-8 w-auto"
                    />
                  </label>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-glam-dark mb-4">
                  Shipping Address
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-glam-dark mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-glam-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-glam-dark mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-glam-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-glam-dark mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-glam-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-glam-dark mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-glam-primary focus:border-transparent"
                      required
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-glam-dark mb-4">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-glam-dark">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium text-glam-dark">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-glam-dark">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span className="text-glam-dark">Total</span>
                    <span className="text-glam-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className={`w-full py-3 px-4 rounded-xl text-white font-medium transition transform hover:scale-[1.02] ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-glam-primary hover:bg-glam-dark"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay ${total.toFixed(2)} USD`
                  )}
                </button>

                {/* Security Notice */}
                <div className="mt-4 text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Secure Checkout
                  </div>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
