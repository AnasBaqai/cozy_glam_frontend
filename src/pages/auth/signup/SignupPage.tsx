import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import DividerWithText from "../../../components/ui/DividerWithText/DividerWithText";
import Navbar from "../../../components/layout/Navbar/Navbar";
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

      <div className="flex min-h-[calc(150vh-160px)] items-center justify-center">
        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Left Side - Form */}
          <div className="p-6 md:p-8 order-2 md:order-1">
            <div className="max-w-sm mx-auto">
              <LogoSection />

              <h1 className="text-xl font-serif text-center text-glam-dark mb-6">
                Create Account
              </h1>

              {(formError || error) && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-xs text-red-600">{formError || error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-glam-dark">
                    Type of User <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label
                      className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-all ${
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
                      <span className="text-xs font-medium">Freelancer</span>
                    </label>
                    <label
                      className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-all ${
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
                      <span className="text-xs font-medium">Customer</span>
                    </label>
                    <label
                      className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-all ${
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
                      <span className="text-xs font-medium">
                        Business seller
                      </span>
                    </label>
                  </div>
                </div>

                {/* Name and Email - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    id="name"
                    label="Full Name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 text-xs"
                    labelClassName="text-xs"
                    inputClassName="text-xs placeholder:text-xs"
                  />
                  <Input
                    id="email"
                    label="Email address"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 text-xs"
                    labelClassName="text-xs"
                    inputClassName="text-xs placeholder:text-xs"
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
                  className="h-9 text-xs"
                  labelClassName="text-xs"
                  inputClassName="text-xs placeholder:text-xs"
                />

                {/* Password and Confirm Password - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    required
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 text-xs"
                    labelClassName="text-xs"
                    inputClassName="text-xs placeholder:text-xs"
                  />
                  <Input
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-9 text-xs"
                    labelClassName="text-xs"
                    inputClassName="text-xs placeholder:text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-9 text-sm font-medium transition-transform active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <DividerWithText text="or sign up with" />
                <AuthSocialButtons />

                <p className="text-center text-gray-600 text-xs mt-4">
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
          <div className="hidden md:block relative bg-glam-primary/10 p-8 order-1 md:order-2">
            <div className="absolute inset-0 bg-gradient-to-bl from-glam-primary/20 to-transparent" />
            <img
              src="/illustrations/shop_1-removebg-preview.png"
              alt="Signup illustration"
              className="w-full h-full object-contain relative z-10"
            />
            <div className="absolute bottom-8 left-8 right-8 text-glam-dark">
              <h2 className="text-2xl font-serif mb-3">Join Our Community!</h2>
              <p className="text-gray-600 text-sm">
                Create an account to start shopping and get access to exclusive
                deals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
