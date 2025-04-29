import { useState } from "react";
import { Link } from "react-router-dom";
import cozyGlamLogo from "../../../assets/images/cozy_glam_logo-removebg-preview.png";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import SocialButton from "../../../components/ui/SocialButton/SocialButton";
import DividerWithText from "../../../components/ui/DividerWithText/DividerWithText";
import Navbar from "../../../components/layout/Navbar/Navbar";
import Footer from "../../../components/layout/Footer/Footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 py-4 px-4">
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

          {/* Login Header */}
          <h1 className="text-3xl font-heading text-center text-glam-dark mb-6 font-medium">
            Login
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="space-y-1">
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="block text-base font-medium text-glam-dark"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-glam-dark hover:text-glam-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full py-2 px-4">
              Login
            </Button>
            <DividerWithText text="or sign in with" />
            <div className="flex justify-center space-x-4 mb-2">
              <SocialButton provider="google" />
              <SocialButton provider="apple" />
              <SocialButton provider="facebook" />
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <p className="text-glam-dark text-sm">
              New to CozyGlam?{" "}
              <Link
                to="/signup"
                className="text-glam-primary font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
