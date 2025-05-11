import { useUser } from "../../../context/UserContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "../../layout/Marquee/Marquee";
import Navbar from "../../layout/Navbar/Navbar";
import BusinessInfoFields from "./BusinessInfoFields";
import SocialLinksSetup from "./SocialLinksSetup";
import LogoUploadField from "./LogoUploadField";
import FormHeader from "./FormHeader";
import FeedbackMessage from "./FeedbackMessage";
import SubmitButton from "../../common/SubmitButton";
import { storeService, uploadService } from "../../../services/api";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setStoreCreated } from "../../../store/slices/authSlice";
import { getFullImageUrl } from "../../../utils/imageUtils";
import {
  BusinessFormData,
  SocialPlatform,
  BusinessInfoFormProps,
} from "../../../types/business.types";
import SellerSidebar from "../../seller/dashboard/SellerSidebar";
import SidebarMobileToggle from "../../seller/dashboard/SidebarMobileToggle";
import useSidebarState from "../../../hooks/useSidebarState";

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  isUpdateMode = false,
}) => {
  const { setIsStoreCreated } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Sidebar state for mobile view
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Form state
  const [form, setForm] = useState<BusinessFormData>({
    storeName: "",
    storeDescription: "",
    storeLogo: "", // Will be filled after upload during form submission
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
    website: "",
    instagram: "",
    facebook: "",
    tiktok: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isUpdateMode);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // File state - store the file for upload at form submission
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Fetch existing store data if in update mode
  useEffect(() => {
    if (isUpdateMode && user?.isStoreCreated) {
      const fetchStoreData = async () => {
        try {
          setFetchLoading(true);
          const response = await storeService.getStore();
          console.log("Store API response:", response);

          if (response.data.stores && response.data.stores.length > 0) {
            const store = response.data.stores[0];
            console.log("Store data:", store);
            console.log("Store logo path:", store.storeLogo);
            console.log("Store ID:", store._id);

            setForm({
              _id: store._id,
              storeName: store.storeName || "",
              storeDescription: store.storeDescription || "",
              storeLogo: store.storeLogo || "",
              businessEmail: store.businessEmail || "",
              businessPhone: store.businessPhone || "",
              businessAddress: store.businessAddress || "",
              country: store.country || "",
              city: store.city || "",
              state: store.state || "",
              postalCode: store.postcode || "",
              website: store.website || "",
              instagram: store.socialLinks?.instagram || "",
              facebook: store.socialLinks?.facebook || "",
              tiktok: store.socialLinks?.tiktok || "",
            });

            // Set preview image for the logo with full URL
            if (store.storeLogo) {
              const fullLogoUrl = getFullImageUrl(store.storeLogo);
              console.log("Setting preview image:", fullLogoUrl);
              setPreviewImage(fullLogoUrl);
            } else {
              console.log("No store logo found in the data");
            }
          } else {
            console.log("No stores found in the API response");
          }
        } catch (err) {
          console.error("Failed to fetch store data:", err);
          setError("Failed to load store data. Please try again.");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchStoreData();
    }
  }, [isUpdateMode, user]);

  // Redirect if user is not authenticated or is not a seller
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "seller") {
      navigate("/");
    } else if (!isUpdateMode && user?.isStoreCreated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate, isUpdateMode]);

  // Pre-fill business email and phone with user data
  useEffect(() => {
    if (user && !isUpdateMode) {
      setForm((prev) => ({
        ...prev,
        businessEmail: user.email || "",
        businessPhone: user.phone_number || "",
      }));
    }
  }, [user, isUpdateMode]);

  // Form field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Social media links handler
  const setSocial = (platform: SocialPlatform, value: string) => {
    setForm((prev) => ({ ...prev, [platform]: value }));
  };

  // Handle file selection (from LogoUploadField)
  const handleFileSelect = (file: File) => {
    setLogoFile(file);
  };

  // Upload the logo and get the URL
  const uploadLogo = async (): Promise<string> => {
    if (!logoFile) {
      throw new Error("No logo file selected");
    }

    setUploadLoading(true);
    try {
      const response = await uploadService.uploadImage(logoFile);
      return response.data.imageUrl;
    } finally {
      setUploadLoading(false);
    }
  };

  // Form submission handler
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: Upload the logo if we have a file
      let logoUrl = form.storeLogo;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      // Step 2: Prepare the payload
      const { instagram, facebook, tiktok, postalCode, ...rest } = form;

      const payload = {
        ...rest,
        storeLogo: logoUrl, // Use the uploaded logo URL
        postcode: postalCode,
        socialLinks: {
          instagram,
          facebook,
          tiktok,
        },
      };

      // Step 3: Create or update the store
      if (isUpdateMode) {
        await storeService.updateStore(payload, payload._id);
        setSuccess("Store updated successfully!");
      } else {
        await storeService.createStore(payload);
        dispatch(setStoreCreated());
        setIsStoreCreated(true);
        setSuccess("Store created successfully!");
      }

      // Show success message and redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          `Failed to ${isUpdateMode ? "update" : "create"} store`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />

      {/* Show sidebar and mobile toggle only in update mode */}
      {isUpdateMode && (
        <>
          <SellerSidebar
            collapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <SidebarMobileToggle toggleSidebar={toggleSidebar} />
        </>
      )}

      <main
        className={`flex-1 flex items-center justify-center p-10 mt-24 ${
          isUpdateMode ? (sidebarCollapsed ? "md:ml-20" : "md:ml-64") : ""
        }`}
      >
        <section className="grid max-w-7xl w-full gap-8 lg:grid-cols-10 items-start">
          {/* ── Illustration & Progress ─────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-8">
            {/* Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-glam-primary/20 to-transparent rounded-3xl"></div>
              <img
                src="/illustrations/shop_1.png"
                alt="Cozy Glam boutique illustration"
                className="w-full rounded-3xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent rounded-b-3xl">
                <h2 className="text-2xl font-serif text-white mb-2">
                  {isUpdateMode
                    ? "Update Your Store"
                    : "Let's Set Up Your Store"}
                </h2>
                <p className="text-white/80">
                  Fill in your business details to get started with selling on
                  Cozy Glam
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-sm p-6">
              <h3 className="text-lg font-medium text-glam-dark mb-4">
                Setup Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-glam-primary text-white flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-glam-dark">Create Account</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-glam-primary text-white flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-glam-dark">
                      Business Information
                    </p>
                    <p className="text-sm text-gray-500">In Progress</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-400">Start Selling</p>
                    <p className="text-sm text-gray-500">Next Step</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Box */}
            <div className="bg-glam-primary/10 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-glam-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-glam-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-glam-dark mb-1">
                    Need Help?
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Our support team is here to help you set up your store
                    successfully.
                  </p>
                  <a
                    href="/help"
                    className="text-sm text-glam-primary hover:text-glam-dark font-medium"
                  >
                    View Setup Guide →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Form Card ────────────────────────────────── */}
          <form
            onSubmit={handleContinue}
            className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-sm px-6 py-8 w-full lg:col-span-7"
          >
            <FormHeader
              title={isUpdateMode ? "Update Your Store" : "Create Your Store"}
            />

            <FeedbackMessage error={error} success={success} />

            {fetchLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glam-primary"></div>
              </div>
            ) : (
              <>
                {/* Form Sections */}
                <div className="space-y-8">
                  {/* Store Logo Section */}
                  <div className="bg-glam-light/30 rounded-2xl p-6">
                    <h3 className="text-lg font-medium text-glam-dark mb-4">
                      Store Logo
                    </h3>
                    <LogoUploadField
                      previewImage={previewImage}
                      setPreviewImage={setPreviewImage}
                      onFileSelect={handleFileSelect}
                      uploadLoading={uploadLoading}
                      sizeError={sizeError}
                      setSizeError={setSizeError}
                      isRequired={!isUpdateMode}
                    />
                  </div>

                  {/* Store Information Section */}
                  <div className="bg-glam-light/30 rounded-2xl p-6">
                    <h3 className="text-lg font-medium text-glam-dark mb-4">
                      Store Information
                    </h3>
                    <BusinessInfoFields form={form} onChange={handleChange} />
                  </div>

                  {/* Social Media Section */}
                  <div className="bg-glam-light/30 rounded-2xl p-6">
                    <h3 className="text-lg font-medium text-glam-dark mb-4">
                      Social Media Links
                    </h3>
                    <SocialLinksSetup
                      socials={{
                        instagram: form.instagram,
                        facebook: form.facebook,
                        tiktok: form.tiktok,
                      }}
                      setSocial={setSocial}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <SubmitButton
                    label={isUpdateMode ? "Update Store" : "Create Store"}
                    loadingLabel={
                      isUpdateMode ? "Updating Store..." : "Creating Store..."
                    }
                    loading={loading}
                  />
                </div>
              </>
            )}
          </form>
        </section>
      </main>
    </div>
  );
};

export default BusinessInfoForm;
