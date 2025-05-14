import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import Navbar from "../../components/layout/Navbar/Navbar";

import Marquee from "../../components/layout/Marquee/Marquee";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import StoreInfoCard from "../../components/seller/dashboard/StoreInfoCard";
import "../../components/seller/dashboard/dashboard.css";
import { FlashMessage, SalesData } from "../../types/dashboard.types";
import { storeService, StoreResponse } from "../../services/api";
import { useProductContext } from "../../context/ProductContext";
import useSidebarState from "../../hooks/useSidebarState";
import { orderService } from "../../services/api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    listings,
    loading: listingsLoading,
    error: listingsError,
  } = useProductContext();

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

  // Store data state
  const [storeData, setStoreData] = useState<
    StoreResponse["data"]["stores"][0] | null
  >(null);
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);

  // Orders state
  const [orders, setOrders] = useState<{
    pending: number;
    completed: number;
    cancelled: number;
    total: number;
  }>({
    pending: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

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

  // Fetch store data
  useEffect(() => {
    const fetchStoreData = async () => {
      if (user?.isStoreCreated) {
        try {
          setStoreLoading(true);
          const response = await storeService.getStore();
          if (response.data.stores && response.data.stores.length > 0) {
            setStoreData(response.data.stores[0]);
          }
        } catch (error) {
          console.error("Failed to fetch store data:", error);
          setStoreError("Failed to load store data. Please try again later.");
        } finally {
          setStoreLoading(false);
        }
      }
    };

    fetchStoreData();
  }, [user]);

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const response = await orderService.getSellerOrders();
        if (response.status) {
          const ordersData = response.data.orders;
          const orderStats = ordersData.reduce(
            (
              acc: {
                pending: number;
                completed: number;
                cancelled: number;
                total: number;
              },
              order: { order_status: string }
            ) => {
              acc.total++;
              switch (order.order_status.toLowerCase()) {
                case "pending":
                  acc.pending++;
                  break;
                case "completed":
                  acc.completed++;
                  break;
                case "cancelled":
                  acc.cancelled++;
                  break;
              }
              return acc;
            },
            { pending: 0, completed: 0, cancelled: 0, total: 0 }
          );
          setOrders(orderStats);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrdersError("Failed to fetch orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  // Navigate to business info when store card is clicked
  const handleStoreCardClick = () => {
    if (user?.isStoreCreated) {
      navigate("/update-store");
    } else {
      navigate("/business-info");
    }
  };

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
        className={`flex-1 flex flex-col items-center justify-start p-3 mt-24 transition-all duration-300
          ${sidebarCollapsed ? "md:ml-16" : "md:ml-56"}`}
      >
        {/* Flash Message as overlay */}
        {flashMessage && (
          <div className="fixed top-24 right-3 z-50 max-w-md animate-fadeInOut">
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
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-800">
              Seller Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back, {user?.name || "Seller"}
            </p>
          </div>

          {/* Top Summary Section */}
          <div className="bg-white rounded-lg shadow p-3 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-3 md:mb-0">
                <div className="bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center mr-3">
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
                  <h2 className="text-base font-bold">
                    {user?.name ? `${user.name}'s Store` : "CozyGlam Store"}
                  </h2>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">{user?.email}</span>
                    <Link
                      to="/profile"
                      className="ml-2 text-glam-primary hover:text-glam-dark transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div className="text-[10px] text-gray-500 uppercase font-medium">
                    SALES (31 DAYS)
                  </div>
                  <div className="text-lg font-bold">
                    £{salesData.last31Days.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div className="text-[10px] text-gray-500 uppercase font-medium">
                    AWAITING DISPATCH
                  </div>
                  <div className="text-lg font-bold">{orders.pending}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Store Info Card */}
            {storeLoading ? (
              <div className="bg-white rounded-lg shadow p-3 dashboard-card flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glam-primary"></div>
              </div>
            ) : storeError ? (
              <div className="bg-white rounded-lg shadow p-3 dashboard-card h-48">
                <div className="text-red-500 p-3 text-center">{storeError}</div>
              </div>
            ) : storeData ? (
              <StoreInfoCard
                storeName={storeData.storeName}
                storeDescription={storeData.storeDescription}
                storeLogo={storeData.storeLogo}
                onClick={handleStoreCardClick}
              />
            ) : (
              <div
                className="bg-white rounded-lg shadow overflow-hidden dashboard-card cursor-pointer hover:shadow-md transition-shadow"
                onClick={handleStoreCardClick}
              >
                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-base font-medium">Store Details</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-glam-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="p-3 flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full p-4 inline-block mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-glam-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium">Set up your store</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Create your store to start selling
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Listings Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-base font-medium">Listings</h3>
                <button
                  onClick={() => navigate("/seller/listings")}
                  className="text-glam-primary hover:text-glam-dark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </button>
              </div>
              <div className="p-3">
                {listingsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-glam-primary"></div>
                  </div>
                ) : listingsError ? (
                  <div className="text-red-500 p-3 text-center">
                    {listingsError}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div
                        className="bg-glam-light p-2 rounded cursor-pointer hover:bg-glam-light/70 transition-colors"
                        onClick={() =>
                          navigate("/seller/listings?status=active")
                        }
                      >
                        <div className="text-[10px] text-gray-500 uppercase font-medium">
                          ACTIVE LISTINGS
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xl font-bold text-glam-primary">
                            {listings.active}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-glam-primary"
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

                      <div
                        className="bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          navigate("/seller/listings?status=draft")
                        }
                      >
                        <div className="text-[10px] text-gray-500 uppercase font-medium">
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
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <div
                        className="bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => navigate("/seller/listings")}
                      >
                        <div className="text-[10px] text-gray-500 uppercase font-medium">
                          TOTAL LISTINGS
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xl font-bold">
                            {listings.total}
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
                  </>
                )}

                <button
                  onClick={() => navigate("/seller/create-product")}
                  className="mt-3 bg-glam-primary text-white rounded-full py-1.5 px-3 text-xs font-medium hover:bg-glam-dark transition-colors w-full flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Listing
                </button>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-base font-medium">Orders</h3>
                <button
                  onClick={() => navigate("/seller/orders")}
                  className="text-glam-primary hover:text-glam-dark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </button>
              </div>
              <div className="p-3">
                <div
                  className="text-xs text-blue-600 hover:underline cursor-pointer mb-3"
                  onClick={() => navigate("/seller/orders")}
                >
                  See all orders
                </div>

                {ordersLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-glam-primary"></div>
                  </div>
                ) : ordersError ? (
                  <div className="text-red-500 p-3 text-center">
                    {ordersError}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs">Pending Orders</div>
                      <span className="text-xs font-bold">
                        {orders.pending}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs">Completed Orders</div>
                      <span className="text-xs font-bold">
                        {orders.completed}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs">Cancelled Orders</div>
                      <span className="text-xs font-bold">
                        {orders.cancelled}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs">Total Orders</div>
                      <span className="text-xs font-bold">{orders.total}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sales Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden dashboard-card">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-base font-medium">Sales</h3>
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
              <div className="p-3">
                <div className="mb-3">
                  <div className="text-xs font-medium mb-2">
                    Chart for sales data across 31 days
                  </div>
                  <div className="bg-gray-50 h-28 rounded relative">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
