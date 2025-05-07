import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { userService } from "../services/api";
import { UserProfile } from "../types/dashboard.types";
import Navbar from "../components/layout/Navbar/Navbar";
import Marquee from "../components/layout/Marquee/Marquee";
import SellerSidebar from "../components/seller/dashboard/SellerSidebar";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        setUserProfile(response.data.user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Marquee />
      <Navbar />

      <div className="flex">
        {user?.role === "seller" && (
          <SellerSidebar
            collapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
        )}

        <main
          className={`flex-1 p-4 md:p-8 mt-32 ${
            user?.role === "seller"
              ? sidebarCollapsed
                ? "md:ml-20"
                : "md:ml-64"
              : ""
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-glam-primary to-glam-light p-6">
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
              </div>

              {loading ? (
                <div className="p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-glam-primary"></div>
                </div>
              ) : error ? (
                <div className="p-6 text-red-500 text-center">{error}</div>
              ) : userProfile ? (
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <div className="inline-block rounded-full bg-glam-light p-4 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-glam-primary"
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
                        <h2 className="text-xl font-semibold">
                          {userProfile.name}
                        </h2>
                        <p className="text-gray-500">{userProfile.email}</p>
                        <p className="mt-2 inline-block bg-glam-light text-glam-dark rounded-full px-3 py-1 text-sm">
                          {userProfile.role.charAt(0).toUpperCase() +
                            userProfile.role.slice(1)}
                        </p>
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Account Information
                          </h3>
                          <div className="mt-3 border-t border-gray-200 pt-4 space-y-4">
                            <div className="flex flex-col md:flex-row md:justify-between">
                              <span className="text-gray-500">
                                Phone Number
                              </span>
                              <span className="font-medium">
                                {userProfile.phone_number}
                              </span>
                            </div>
                            <div className="flex flex-col md:flex-row md:justify-between">
                              <span className="text-gray-500">
                                Account Status
                              </span>
                              <span className="font-medium capitalize">
                                {userProfile.status}
                              </span>
                            </div>
                            <div className="flex flex-col md:flex-row md:justify-between">
                              <span className="text-gray-500">
                                Member Since
                              </span>
                              <span className="font-medium">
                                {formatDate(userProfile.created_at)}
                              </span>
                            </div>
                            {userProfile.role === "seller" && (
                              <div className="flex flex-col md:flex-row md:justify-between">
                                <span className="text-gray-500">
                                  Store Status
                                </span>
                                <span
                                  className={`font-medium ${
                                    userProfile.isStoreCreated
                                      ? "text-green-600"
                                      : "text-glam-primary"
                                  }`}
                                >
                                  {userProfile.isStoreCreated
                                    ? "Created"
                                    : "Not Created"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {userProfile.skills &&
                          userProfile.skills.length > 0 && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                Skills
                              </h3>
                              <div className="mt-3 border-t border-gray-200 pt-4">
                                <div className="flex flex-wrap gap-2">
                                  {userProfile.skills.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                        <div className="pt-4 flex justify-end">
                          <button
                            className="bg-glam-primary hover:bg-glam-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            onClick={() =>
                              alert("Edit profile functionality coming soon!")
                            }
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No profile data available
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
