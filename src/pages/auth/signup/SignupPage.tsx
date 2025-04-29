import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import DividerWithText from "../../../components/ui/DividerWithText/DividerWithText";
import Navbar from "../../../components/layout/Navbar/Navbar";
import Footer from "../../../components/layout/Footer/Footer";
import LogoSection from "../../../components/layout/Auth/LogoSection";
import AuthSocialButtons from "../../../components/layout/Auth/AuthSocialButtons";
import Marquee from "../../../components/layout/Marquee/Marquee";
const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Handle signup logic here
    console.log("Signup attempt with:", { email, password, userType });
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
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
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
              id="email"
              label="Email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Button type="submit" className="w-full py-2 px-4">
              Create Account
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
