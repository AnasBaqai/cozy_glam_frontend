import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Cozy Glam</h1>
            {/* Navigation would go here */}
            <nav className="flex space-x-4">
              <a href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </a>
              <a href="/products" className="text-gray-700 hover:text-gray-900">
                Products
              </a>
              <a href="/about" className="text-gray-700 hover:text-gray-900">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Cozy Glam. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
