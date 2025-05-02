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
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 py-4 px-4">
        <div className="w-full max-w-md mt-[100px]">
          {/* Logo */}
          <LogoSection />
          {/* Signup Header */}
          <h1 className="text-3xl font-heading text-center text-glam-dark mb-6 font-medium">
            Create Account
          </h1>

          {/* Error message */}
          {(formError || error) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {formError || error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="userType"
                className="block text-base font-medium text-glam-dark"
              >
                Type of User
              </label>
              <select
                id="userType"
                required
                className="w-full px-3 py-2 border border-glam-accent rounded-md focus:outline-none focus:ring-2 focus:ring-glam-accent bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="freelancer">Freelancer</option>
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            <Input
              id="name"
              label="Full Name"
              type="text"
              required
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              id="email"
              label="Email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              required
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full py-2 px-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <DividerWithText text="or sign up with" />
            <AuthSocialButtons />
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-glam-dark text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-glam-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
