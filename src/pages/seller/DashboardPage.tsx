import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import Marquee from "../../components/layout/Marquee/Marquee";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect non-sellers or sellers without a store to appropriate pages
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "seller") {
      navigate("/");
    } else if (user?.role === "seller" && !user?.isStoreCreated) {
      navigate("/business-info");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start p-4 mt-20">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-serif font-bold text-glam-dark mb-6">
            Seller Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Stats Cards */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-medium text-glam-dark mb-2">
                Products
              </h2>
              <p className="text-3xl font-bold text-glam-primary">0</p>
              <p className="text-gray-500 text-sm mt-2">
                Total products in your store
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-medium text-glam-dark mb-2">
                Orders
              </h2>
              <p className="text-3xl font-bold text-glam-primary">0</p>
              <p className="text-gray-500 text-sm mt-2">
                Pending orders to fulfill
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-medium text-glam-dark mb-2">
                Revenue
              </h2>
              <p className="text-3xl font-bold text-glam-primary">$0.00</p>
              <p className="text-gray-500 text-sm mt-2">
                Total revenue this month
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-medium text-glam-dark mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-glam-primary text-white rounded-lg hover:bg-glam-dark transition-colors">
                Add New Product
              </button>
              <button className="px-4 py-2 bg-glam-primary text-white rounded-lg hover:bg-glam-dark transition-colors">
                View Orders
              </button>
              <button className="px-4 py-2 bg-glam-primary text-white rounded-lg hover:bg-glam-dark transition-colors">
                Edit Store Profile
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
