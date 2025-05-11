import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import DividerWithText from "../../../components/ui/DividerWithText/DividerWithText";
import Navbar from "../../../components/layout/Navbar/Navbar";
import Footer from "../../../components/layout/Footer/Footer";
import LogoSection from "../../../components/layout/Auth/LogoSection";
import AuthSocialButtons from "../../../components/layout/Auth/AuthSocialButtons";
import Marquee from "../../../components/layout/Marquee/Marquee";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { signup, clearError } from "../../../store/slices/authSlice";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [formError, setFormError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "seller") {
        navigate("/business-info");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate, user]);

  // Clear Redux errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate form
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    // Dispatch signup action
    dispatch(
      signup({
        name,
        email,
        password,
        phone_number: phoneNumber,
        role,
      })
    );
  };

  return (
    <div className="min-h-screen bg-glam-light">
      <Marquee />
      <Navbar />

      <div className="flex min-h-[calc(170vh-180px)] items-center justify-center ">
        <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Form */}
          <div className="p-8 md:p-12 order-2 md:order-1">
            <div className="max-w-sm mx-auto">
              <LogoSection />

              <h1 className="text-3xl font-serif text-center text-glam-dark mb-8">
                Create Account
              </h1>

              {(formError || error) && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-sm text-red-600">{formError || error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-glam-dark">
                    Type of User <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label
                      className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                        role === "freelancer"
                          ? "border-glam-primary bg-glam-primary/5 text-glam-primary"
                          : "border-gray-200 hover:border-glam-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value="freelancer"
                        checked={role === "freelancer"}
                        onChange={(e) => setRole(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">Freelancer</span>
                    </label>
                    <label
                      className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                        role === "customer"
                          ? "border-glam-primary bg-glam-primary/5 text-glam-primary"
                          : "border-gray-200 hover:border-glam-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value="customer"
                        checked={role === "customer"}
                        onChange={(e) => setRole(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">Customer</span>
                    </label>
                    <label
                      className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                        role === "seller"
                          ? "border-glam-primary bg-glam-primary/5 text-glam-primary"
                          : "border-gray-200 hover:border-glam-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value="seller"
                        checked={role === "seller"}
                        onChange={(e) => setRole(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">Seller</span>
                    </label>
                  </div>
                </div>

                {/* Name and Email - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="name"
                    label="Full Name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                  <Input
                    id="email"
                    label="Email address"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Phone Number - Full width */}
                <Input
                  id="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12"
                />

                {/* Password and Confirm Password - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    required
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                  <Input
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium transition-transform active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <DividerWithText text="or sign up with" />
                <AuthSocialButtons />

                <p className="text-center text-gray-600 text-sm mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-glam-primary font-medium hover:text-glam-dark transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden md:block relative bg-glam-primary/10 p-12 order-1 md:order-2">
            <div className="absolute inset-0 bg-gradient-to-bl from-glam-primary/20 to-transparent" />
            <img
              src="/illustrations/shop_1-removebg-preview.png"
              alt="Signup illustration"
              className="w-full h-full object-contain relative z-10"
            />
            <div className="absolute bottom-12 left-12 right-12 text-glam-dark">
              <h2 className="text-3xl font-serif mb-4">Join Our Community!</h2>
              <p className="text-gray-600">
                Create an account to start shopping and get access to exclusive
                deals.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupPage;
