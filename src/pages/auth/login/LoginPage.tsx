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

      <div className="flex min-h-[calc(120vh-210px)] items-center justify-center p-3 mt-16">
        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Left Side - Image */}
          <div className="hidden md:block relative bg-glam-primary/10 p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-glam-primary/20 to-transparent" />
            <img
              src="/illustrations/shop_1-removebg-preview.png"
              alt="Login illustration"
              className="w-full h-full object-contain relative z-10"
            />
            <div className="absolute bottom-8 left-8 right-8 text-glam-dark">
              <h2 className="text-2xl font-serif mb-3">Welcome Back!</h2>
              <p className="text-gray-600 text-sm">
                Sign in to access your account and explore our latest
                collections.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-6 md:p-8">
            <div className="max-w-sm mx-auto">
              <LogoSection />

              <h1 className="text-2xl font-serif text-center text-glam-dark mb-6">
                Sign In
              </h1>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Input
                    id="email"
                    label="Email address"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-glam-dark"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-glam-primary hover:text-glam-dark transition-colors"
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
                    className="h-9"
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
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <DividerWithText text="or continue with" />
                <AuthSocialButtons />

                <p className="text-center text-gray-600 text-xs mt-4">
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
    </div>
  );
};

export default LoginPage;
