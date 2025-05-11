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
import { login, clearError } from "../../../store/slices/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen bg-glam-light">
      <Marquee />
      <Navbar />

      <div className="flex min-h-[calc(110vh-180px)] items-center justify-center p-4 mt-20">
        <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Image */}
          <div className="hidden md:block relative bg-glam-primary/10 p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-glam-primary/20 to-transparent" />
            <img
              src="/illustrations/shop_1-removebg-preview.png"
              alt="Login illustration"
              className="w-full h-full object-contain relative z-10"
            />
            <div className="absolute bottom-12 left-12 right-12 text-glam-dark">
              <h2 className="text-3xl font-serif mb-4">Welcome Back!</h2>
              <p className="text-gray-600">
                Sign in to access your account and explore our latest
                collections.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-8 md:p-12">
            <div className="max-w-sm mx-auto">
              <LogoSection />

              <h1 className="text-3xl font-serif text-center text-glam-dark mb-8">
                Sign In
              </h1>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-glam-dark"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-glam-primary hover:text-glam-dark transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <DividerWithText text="or continue with" />
                <AuthSocialButtons />

                <p className="text-center text-gray-600 text-sm mt-6">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-glam-primary font-medium hover:text-glam-dark transition-colors"
                  >
                    Create an account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
