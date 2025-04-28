import { useState } from "react";
import { Link } from "react-router-dom";
import cozyGlamLogo from "../../../assets/images/cozy_glam_logo.jpeg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt with:", { email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-glam-light">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={cozyGlamLogo} alt="Cozy Glam Logo" className="h-24 mb-2" />
        </div>

        {/* Login Header */}
        <h1 className="text-4xl font-serif text-center text-gray-800 mb-10">
          Login
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-800"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-gray-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gray-900 text-white text-lg font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            New to CozyGlam?{" "}
            <Link to="/signup" className="text-black font-medium underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Social Login Options */}
        <div className="mt-10 flex justify-center space-x-8">
          <button className="p-2">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.03 20.39 19.62 18.59C21.2 16.79 22.04 14.49 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
            </svg>
          </button>
          <button className="p-2">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
          </button>
          <button className="p-2">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.623 3.872 10.328 9.092 11.63-.056-.162-.092-.35-.092-.583v-2.051c-.487 0-1.303 0-1.508 0-.821 0-1.551-.353-1.905-1.009-.393-.729-.461-1.844-1.435-2.526-.289-.227-.069-.486.264-.451.615.174 1.125.596 1.605 1.222.478.627.703.769 1.596.769.433 0 1.081-.025 1.691-.121.328-.833.895-1.6 1.588-1.962-3.996-.411-5.903-2.399-5.903-5.098 0-1.162.495-2.286 1.336-3.233-.276-.94-.623-2.857.106-3.587 1.798 0 2.885 1.166 3.146 1.481.896-.307 1.88-.481 2.914-.481 1.036 0 2.024.174 2.922.483C14.915 6.866 16.002 5.7 17.8 5.7c.732.731.381 2.656.102 3.594.836.945 1.328 2.066 1.328 3.226 0 2.697-1.904 4.684-5.894 5.097C14.134 18.67 15 20.22 15 21.417v2.248c0 .16-.03.327-.077.482C19.777 22.994 24 18.048 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
