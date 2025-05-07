import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import Navbar from "../../components/layout/Navbar/Navbar";

import Marquee from "../../components/layout/Marquee/Marquee";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import "../../components/seller/dashboard/dashboard.css";
import {
  FlashMessage,
  SalesData,
  ListingsData,
  OrdersData,
  TrafficData,
} from "../../types/dashboard.types";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // State for flash message
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);

  // Demo data for the dashboard
  const [salesData] = useState<SalesData>({
    today: 0,
    last7Days: 0,
    last31Days: 0,
    last90Days: 188.69,
  });

  const [listings] = useState<ListingsData>({
    active: 0,
    drafts: 2,
    auctionsEnding: 0,
    unsold: 286,
  });

  const [orders] = useState<OrdersData>({
    awaiting: 0,
    returns: 0,
    canceled: 0,
    awaitingPayment: 0,
    awaitingFeedback: 0,
  });

  const [trafficData] = useState<TrafficData>({
    impressions: 61,
    clickRate: 4.9,
    pageViews: 4,
    conversionRate: 0,
  });

  // Check for flash messages in localStorage
  useEffect(() => {
    const storedFlash = localStorage.getItem("dashboardFlash");
    if (storedFlash) {
      try {
        const flashData = JSON.parse(storedFlash) as FlashMessage;

        // Only show messages that are less than 5 seconds old
        const now = Date.now();
        if (now - flashData.timestamp < 5000) {
          setFlashMessage(flashData);

          // Remove message after animation completes (4.5s for animation)
          setTimeout(() => {
            setFlashMessage(null);
          }, 4500);
        }

        // Clear the message from localStorage
        localStorage.removeItem("dashboardFlash");
      } catch (error) {
        console.error("Error parsing flash message:", error);
        localStorage.removeItem("dashboardFlash");
      }
    }
  }, []);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Marquee />
      <Navbar />

      {/* Sidebar */}
      <SellerSidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content with adjusted margin */}
      <main
        className={`flex-1 flex flex-col items-center justify-start p-4 md:p-6 mt-28 md:mt-32 transition-all duration-300
          ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        {/* Flash Message as overlay */}
        {flashMessage && (
          <div className="fixed top-32 md:top-24 right-4 z-50 max-w-md animate-fadeInOut">
            <div
              className={`${
                flashMessage.type === "success"
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              } border-l-4 p-4 rounded-md shadow-lg`}
            >
              <div className="flex items-center">
                {flashMessage.type === "success" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <p
                  className={`text-sm font-medium ${
                    flashMessage.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {flashMessage.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-7xl">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Seller Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || "Seller"}
            </p>
          </div>

          {/* Top Summary Section */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {user?.name ? `${user.name}'s Store` : "CozyGlam Store"}
                  </h2>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-xs text-gray-500 uppercase font-medium">
                    SALES (31 DAYS)
                  </div>
                  <div className="text-2xl font-bold">
                    £{salesData.last31Days.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-xs text-gray-500 uppercase font-medium">
                    AWAITING DISPATCH
                  </div>
                  <div className="text-2xl font-bold">{orders.awaiting}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tasks Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-medium">Tasks</h3>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-3">
                  No tasks pending.
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <h4 className="text-sm font-medium mb-2">
                    Suggested actions
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                      Update profile
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                        Finish setting up your Store to help improve conversion
                      </div>
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                        6
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Listings Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-medium">Listings</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs text-gray-500 uppercase font-medium">
                      ACTIVE LISTINGS
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xl font-bold">
                        {listings.active}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs text-gray-500 uppercase font-medium">
                      DRAFTS
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xl font-bold">
                        {listings.drafts}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs text-gray-500 uppercase font-medium">
                      AUCTIONS ENDING TODAY
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xl font-bold">
                        {listings.auctionsEnding}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs text-gray-500 uppercase font-medium">
                      UNSOLD AND NOT RELISTED
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xl font-bold">
                        {listings.unsold}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/seller/create-product")}
                  className="mt-4 bg-blue-600 text-white rounded-full py-2 px-4 text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  List an item
                </button>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-medium">Orders</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="p-4">
                <div className="text-sm text-blue-600 hover:underline cursor-pointer mb-4">
                  See all orders
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      Awaiting postage - print postage label
                    </div>
                    <span className="text-sm font-bold">{orders.awaiting}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">All open returns/replacements</div>
                    <span className="text-sm font-bold">{orders.returns}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">Open cancellations</div>
                    <span className="text-sm font-bold">{orders.canceled}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">Awaiting payment</div>
                    <span className="text-sm font-bold">
                      {orders.awaitingPayment}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      Posted and awaiting your feedback
                    </div>
                    <span className="text-sm font-bold">
                      {orders.awaitingFeedback}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Show more</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-medium">Sales</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">
                    Chart for sales data across 31 days
                  </div>
                  <div className="bg-gray-50 h-36 rounded relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-sm text-gray-400">
                        No sales data to display
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Today</div>
                    <span className="text-sm font-medium">
                      £{salesData.today.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">Last 7 days</div>
                    <span className="text-sm font-medium">
                      £{salesData.last7Days.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">Last 31 days</div>
                    <div className="flex items-center">
                      <span className="text-xs text-red-500 mr-2">100.0%</span>
                      <span className="text-sm font-medium">
                        £{salesData.last31Days.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">Last 90 days</div>
                    <span className="text-sm font-medium">
                      £{salesData.last90Days.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Data is for May 5 - June 5 at 7:40pm. Percentage change
                  compared to prior period.
                </div>
              </div>
            </div>

            {/* Advertising Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">Advertising</h3>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src="/illustrations/marketing_illustraion_remove_bg.png"
                    alt="Marketing"
                    className="h-28 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/100x100?text=Ad";
                    }}
                  />
                </div>

                <h4 className="font-medium text-lg mb-2">Reach more buyers</h4>
                <p className="text-sm text-gray-600 mb-4">
                  CozyGlam Advertising connects you with more buyers around the
                  world with simple-to-use, high-performing solutions that match
                  your sales goals and campaign budget.
                </p>

                <button className="bg-white border border-gray-300 rounded-full py-2 px-4 text-sm font-medium hover:bg-gray-50 transition-colors">
                  Get started
                </button>
              </div>
            </div>

            {/* Traffic Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-medium">Traffic</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">Listing impressions</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-red-500 mr-1">99.8%</span>
                        <span className="text-sm">
                          {trafficData.impressions}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">Click-through rate</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">
                          {trafficData.clickRate}%
                        </span>
                        <span className="text-xs text-green-500 ml-1">
                          2.7% pts
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">Listing page views</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-red-500 mr-1">99.4%</span>
                        <span className="text-sm">{trafficData.pageViews}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">Sales conversion rate</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">
                          {trafficData.conversionRate}.0%
                        </span>
                        <span className="text-xs text-red-500 ml-1">
                          0.08 pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Data for May 5 - June 5 at 7:40pm. Percentage change compared
                  to prior period.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
