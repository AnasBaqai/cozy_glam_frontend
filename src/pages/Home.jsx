import React from "react";

const Home = () => {
  return (
    <div>
      <section className="py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Cozy Glam</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop shop for cozy and glamorous products
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* This would be populated with actual data from the backend */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Product {item}</h3>
                <p className="text-gray-600 mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <p className="font-bold">$99.99</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
