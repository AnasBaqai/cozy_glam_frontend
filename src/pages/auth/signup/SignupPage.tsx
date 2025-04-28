import { useState } from "react";
import { Link } from "react-router-dom";
import cozyGlamLogo from "../../../assets/images/cozy_glam_logo-removebg-preview.png";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import SocialButton from "../../../components/ui/SocialButton/SocialButton";
import DividerWithText from "../../../components/ui/DividerWithText/DividerWithText";

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
    <div className="flex flex-col items-center justify-center min-h-screen py-4 px-4 bg-glam-light">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 flex items-center justify-center">
            <img
              src={cozyGlamLogo}
              alt="Cozy Glam Logo"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
        </div>

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
          <div className="flex justify-center space-x-4 mb-2">
            <SocialButton provider="google" />
            <SocialButton provider="apple" />
            <SocialButton provider="facebook" />
          </div>
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
  );
};

export default SignupPage;
