import { useState } from "react";
import { Link } from "react-router-dom";
import cozyGlamLogo from "../../../assets/images/cozy_glam_logo-removebg-preview.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt with:", { email, password });
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

        {/* Login Header */}
        <h1 className="text-3xl font-heading text-center text-glam-dark mb-6 font-medium">
          Login
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-base font-medium text-glam-dark"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Email"
              className="w-full px-3 py-2 border border-glam-accent rounded-md focus:outline-none focus:ring-2 focus:ring-glam-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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
            <input
              id="password"
              type="password"
              required
              placeholder="Password"
              className="w-full px-3 py-2 border border-glam-accent rounded-md focus:outline-none focus:ring-2 focus:ring-glam-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-glam-dark text-white text-base font-medium rounded-md hover:bg-glam-primary transition-colors focus:outline-none focus:ring-2 focus:ring-glam-primary"
          >
            Login
          </button>
          {/* Social Login Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-glam-accent" />
            <span className="mx-2 text-glam-dark text-xs">or sign in with</span>
            <div className="flex-grow h-px bg-glam-accent" />
          </div>
          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-4 mb-2">
            <button
              type="button"
              className="bg-white border border-glam-accent rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
              title="Sign in with Google"
            >
              <svg className="h-6 w-6" viewBox="0 0 48 48">
                <g>
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.86-6.86C36.68 2.36 30.7 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.36 13.36 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.67 28.29c-1.01-2.99-1.01-6.19 0-9.18l-7.98-6.2C.64 16.36 0 20.09 0 24c0 3.91.64 7.64 2.69 11.09l7.98-6.2z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.19-5.6c-2.01 1.35-4.59 2.15-8.7 2.15-6.26 0-11.64-3.86-13.33-9.29l-7.98 6.2C6.73 42.18 14.82 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </g>
              </svg>
            </button>
            <button
              type="button"
              className="bg-white border border-glam-accent rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
              title="Sign in with Apple"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.04 0-.08 0-.12-.01-.02-.04-.03-.09-.03-.14 0-1.13.93-2.06 2.07-2.06.04 0 .08 0 .12.01.02.04.03.09.03.13zm2.13 4.13c-1.13-.13-2.08.62-2.62.62-.54 0-1.38-.6-2.28-.58-.88.01-1.7.51-2.16 1.3-.92 1.59-.24 3.94.66 5.23.44.65.97 1.37 1.67 1.34.67-.03.92-.43 1.72-.43.8 0 1.02.43 1.72.42.71-.01 1.16-.66 1.6-1.31.5-.73.7-1.44.71-1.48-.02-.01-1.36-.52-1.38-2.07-.01-1.29 1.05-1.9 1.1-1.93-.6-.88-1.54-.98-1.87-.99zm-3.6 13.13c-.02-.02-1.97-.77-1.99-3.04-.01-1.91 1.56-2.82 1.63-2.86-.89-1.29-2.28-1.47-2.77-1.49-1.18-.12-2.3.7-2.9 1.7-.62 1.01-.49 2.5.31 3.97.6 1.13 1.67 2.53 3.01 2.48 1.32-.05 2.18-1.08 2.71-1.76zm-2.71-1.76c-.01 0-.01 0-.02.01-.01 0-.01 0-.02-.01z" />
              </svg>
            </button>
            <button
              type="button"
              className="bg-white border border-glam-accent rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
              title="Sign in with Facebook"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F3">
                <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
              </svg>
            </button>
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
  );
};

export default LoginPage;
