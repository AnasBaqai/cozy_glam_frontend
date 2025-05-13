import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import Marquee from "../../components/layout/Marquee/Marquee";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import { useAppSelector } from "../../store/hooks";
import { orderService } from "../../services/api";
import useSidebarState from "../../hooks/useSidebarState";
import { toast } from "react-toastify";

interface Order {
  _id: string;
  buyer_id: {
    _id: string;
    name: string;
    email: string;
  };
  products: {
    product_id: {
      _id: string;
      title: string;
      price: number;
    };
    title: string;
    quantity: number;
    price: number;
    seller_id: {
      _id: string;
      name: string;
      email: string;
    };
    _id: string;
  }[];
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  shipping_cost: number;
  total_amount: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

type SortOption = {
  value: string;
  label: string;
};

type PageSizeOption = {
  value: number;
  label: string;
};

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

  // State for orders and UI
  const [orders, setOrders] = useState<Order[]>([]);
  const [rawOrders, setRawOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filter, setFilter] = useState("all");

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });

  // Add loading state for accept order action
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);

  // Sort options
  const sortOptions: SortOption[] = [
    { value: "newest", label: "Recently Created" },
    { value: "oldest", label: "Oldest Created" },
    { value: "amount-low", label: "Amount: Low to High" },
    { value: "amount-high", label: "Amount: High to Low" },
  ];

  // Page size options
  const pageSizeOptions: PageSizeOption[] = [
    { value: 10, label: "10 per page" },
    { value: 20, label: "20 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Reset search
  const resetSearch = () => {
    setSearchTerm("");
    applyFiltersAndSort(rawOrders);
  };

  // Apply filters and sort
  const applyFiltersAndSort = (ordersToProcess: Order[] | undefined | null) => {
    if (!ordersToProcess) {
      setOrders([]);
      return;
    }

    let processedOrders = [...ordersToProcess];

    // Apply status filter
    if (filter !== "all") {
      processedOrders = processedOrders.filter(
        (order) => order.order_status.toLowerCase() === filter
      );
    }

    // Apply search filter
    if (searchTerm) {
      processedOrders = processedOrders.filter(
        (order) =>
          order.buyer_id.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.products.some((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply sorting
    processedOrders.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "amount-low":
          return a.total_amount - b.total_amount;
        case "amount-high":
          return b.total_amount - a.total_amount;
        default:
          return 0;
      }
    });

    setOrders(processedOrders);
  };

  // Handle page size change
  const handlePageSizeChange = async (newSize: number) => {
    setLoading(true);
    setPagination({
      ...pagination,
      pageSize: newSize,
      currentPage: 1,
    });

    try {
      const response = await orderService.getSellerOrders(1, newSize);
      if (response.status) {
        setRawOrders(response.data.orders);
        applyFiltersAndSort(response.data.orders);
        setPagination({
          total: response.data.total,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          pageSize: newSize,
        });
        toast.success(`Now showing ${newSize} items per page`);
      } else {
        setError("Failed to update items per page");
        toast.error("Failed to update items per page");
      }
    } catch (err) {
      console.error("Error updating page size:", err);
      setError("Failed to update items per page");
      toast.error("Failed to update items per page");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.isStoreCreated) return;

      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getSellerOrders(
          pagination.currentPage,
          pagination.pageSize
        );

        if (response.status) {
          setRawOrders(response.data.orders);
          applyFiltersAndSort(response.data.orders);
          setPagination({
            total: response.data.total,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
            pageSize: pagination.pageSize,
          });
        } else {
          setError("Failed to fetch orders");
          toast.error("Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("An error occurred while fetching orders");
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.currentPage, pagination.pageSize, user]);

  // Apply filters and sort when criteria change
  useEffect(() => {
    if (rawOrders.length > 0) {
      applyFiltersAndSort(rawOrders);
    }
  }, [sortBy, searchTerm, filter]);

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "seller") {
      navigate("/");
    } else if (!user?.isStoreCreated) {
      navigate("/business-info");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFiltersAndSort(rawOrders);
  };

  const handleSortChange = (newSortValue: string) => {
    setSortBy(newSortValue);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get sort label helper
  const getSortLabel = (value: string): string => {
    return sortOptions.find((option) => option.value === value)?.label || "";
  };

  // Handle accept order
  const handleAcceptOrder = async (orderId: string) => {
    try {
      setAcceptingOrderId(orderId);
      const response = await orderService.acceptOrder(orderId);

      if (response.status) {
        toast.success("Order accepted successfully");
        // Refresh orders after accepting
        const updatedResponse = await orderService.getSellerOrders(
          pagination.currentPage,
          pagination.pageSize
        );
        if (updatedResponse.status) {
          setRawOrders(updatedResponse.data.orders);
          applyFiltersAndSort(updatedResponse.data.orders);
        }
      } else {
        toast.error("Failed to accept order");
      }
    } catch (err) {
      console.error("Error accepting order:", err);
      toast.error("Failed to accept order");
    } finally {
      setAcceptingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />

      <SellerSidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main
        className={`flex-1 flex flex-col items-center p-4 md:p-6 mt-28 md:mt-32 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="w-full max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Orders</h1>
              <p className="text-gray-600 text-sm">
                View and manage your customer orders
              </p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setFilter("all")}
                  className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    filter === "all"
                      ? "border-glam-primary text-glam-primary"
                      : "border-transparent text-gray-500 hover:text-glam-primary hover:border-glam-light"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    filter === "pending"
                      ? "border-glam-primary text-glam-primary"
                      : "border-transparent text-gray-500 hover:text-glam-primary hover:border-glam-light"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("accepted")}
                  className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    filter === "accepted"
                      ? "border-glam-primary text-glam-primary"
                      : "border-transparent text-gray-500 hover:text-glam-primary hover:border-glam-light"
                  }`}
                >
                  Accepted
                </button>
                <div className="flex-grow"></div>
                <p className="text-sm text-glam-primary self-center font-medium">
                  {pagination.total}{" "}
                  {pagination.total === 1 ? "order" : "orders"}
                </p>
              </nav>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative flex w-full rounded-md shadow-sm overflow-hidden border border-gray-300">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="flex-grow border-0 pl-10 pr-10 py-2 focus:ring-glam-primary focus:border-glam-primary sm:text-sm"
                  placeholder="Search by order ID, customer name, or product"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-16 flex items-center">
                    <button
                      type="button"
                      onClick={resetSearch}
                      className="h-6 w-6 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  className="flex-shrink-0 min-w-24 py-2 px-4 text-white bg-glam-primary hover:bg-glam-dark text-sm font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Sort and Page Size Controls */}
            <div className="flex gap-2">
              {/* Page Size Dropdown */}
              <div className="flex-shrink-0">
                <select
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-glam-primary focus:border-glam-primary sm:text-sm rounded-md bg-white"
                  aria-label="Select number of items per page"
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-glam-primary focus:border-glam-primary sm:text-sm rounded-md bg-white"
                  aria-label="Sort orders"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Status */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* Page Size Indicator */}
            <div className="px-3 py-2 bg-glam-light rounded-md">
              <span className="text-sm text-glam-dark">
                Showing{" "}
                <span className="font-medium">{pagination.pageSize}</span> items
                per page
              </span>
            </div>

            {/* Sort Status */}
            <div className="px-3 py-2 bg-glam-light rounded-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-glam-primary mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span className="text-sm text-glam-dark">
                Sorted by:{" "}
                <span className="font-medium">{getSortLabel(sortBy)}</span>
              </span>
            </div>

            {/* Filter Status */}
            {filter !== "all" && (
              <div className="px-3 py-2 bg-glam-light rounded-md flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-glam-primary mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm text-glam-dark">
                  Filtered by status:{" "}
                  <span className="font-medium capitalize">{filter}</span>
                </span>
                <button
                  onClick={() => setFilter("all")}
                  className="ml-2 text-glam-primary hover:text-glam-dark text-sm"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Search Term Indicator */}
            {searchTerm && (
              <div className="px-3 py-2 bg-glam-light rounded-md flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-glam-primary mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm text-glam-dark">
                  Search: <span className="font-medium">"{searchTerm}"</span>
                </span>
                <button
                  onClick={resetSearch}
                  className="ml-2 text-glam-primary hover:text-glam-dark text-sm"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Total Results */}
            <div className="px-3 py-2 bg-glam-light rounded-md ml-auto">
              <span className="text-sm text-glam-dark">
                Total: <span className="font-medium">{pagination.total}</span>{" "}
                orders
              </span>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glam-primary"></div>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <div className="bg-red-50 p-4 rounded-lg mx-auto max-w-md">
                  <p className="text-red-600 font-medium mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-white bg-glam-primary hover:bg-glam-dark rounded-md text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-500">
                  {filter !== "all"
                    ? `No ${filter} orders found.`
                    : searchTerm
                    ? "No orders match your search criteria."
                    : "When you receive orders, they will appear here."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        {filter === "pending" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            // TODO: Navigate to order details
                            console.log("Navigate to order:", order._id);
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.buyer_id.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.buyer_id.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {order.products.map((product) => (
                                <div key={product._id} className="mb-1">
                                  {product.title} x {product.quantity}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.total_amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                order.order_status
                              )}`}
                            >
                              {order.order_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          {filter === "pending" && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                {order.order_status.toLowerCase() ===
                                  "pending" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcceptOrder(order._id);
                                    }}
                                    disabled={acceptingOrderId === order._id}
                                    className={`inline-flex items-center p-2 rounded-full ${
                                      acceptingOrderId === order._id
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-green-100 hover:bg-green-200"
                                    }`}
                                    title="Accept Order"
                                  >
                                    {acceptingOrderId === order._id ? (
                                      <div className="animate-spin h-5 w-5">
                                        <svg
                                          className="text-green-700"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                      </div>
                                    ) : (
                                      <img
                                        src="/icons/accept.png"
                                        alt="Accept"
                                        className="w-5 h-5"
                                      />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex justify-between items-center">
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={pagination.currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        {[...Array(pagination.totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pagination.currentPage === i + 1
                                ? "z-10 bg-glam-primary border-glam-primary text-white"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages
                          }
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
