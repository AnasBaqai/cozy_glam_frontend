import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Marquee from "../../layout/Marquee/Marquee";
import Navbar from "../../layout/Navbar/Navbar";
import BusinessInfoFields from "./BusinessInfoFields";
import SocialLinksSetup from "./SocialLinksSetup";
import LogoUploadField from "./LogoUploadField";
import FormHeader from "./FormHeader";
import FeedbackMessage from "./FeedbackMessage";
import FormInput from "./FormInput";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import {
  BusinessInfoFormProps,
  BusinessFormData,
  SocialPlatform,
} from "../../../types/business.types";
import SellerSidebar from "../../seller/dashboard/SellerSidebar";
import SidebarMobileToggle from "../../seller/dashboard/SidebarMobileToggle";
import useSidebarState from "../../../hooks/useSidebarState";
import { storeService, uploadService } from "../../../services/api";
import { setStoreCreated } from "../../../store/slices/authSlice";
import { getFullImageUrl } from "../../../utils/imageUtils";

const BusinessInfoForm = ({
  isUpdateMode = false,
}: BusinessInfoFormProps): React.ReactElement => {
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
    storeLogo: "",
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

  // Add state for location selectors
  const countries = Country.getAllCountries();
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Update states when country changes
  useEffect(() => {
    if (form.country) {
      const countryData = countries.find((c) => c.name === form.country);
      if (countryData) {
        setStates(State.getStatesOfCountry(countryData.isoCode));
      } else {
        setStates([]);
      }
    } else {
      setStates([]);
    }
  }, [form.country, countries]);

  // Update cities when state changes
  useEffect(() => {
    if (form.country && form.state) {
      const countryData = countries.find((c) => c.name === form.country);
      const stateData = states.find((s) => s.name === form.state);
      if (countryData && stateData) {
        setCities(
          City.getCitiesOfState(countryData.isoCode, stateData.isoCode)
        );
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [form.country, form.state, countries, states]);

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
    } else if (!isUpdateMode && user?.isStoreCreated && user?._id) {
      // Redirect to verification page instead of dashboard
      navigate(`/seller/verification/${user._id}`);
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

        // Show success message and redirect
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        const response = await storeService.createStore(payload);
        dispatch(setStoreCreated());
        setIsStoreCreated(true);
        setSuccess("Store created successfully!");

        // Redirect immediately to verification page
        if (response.data && response.data.store && response.data.store._id) {
          navigate(`/seller/verification/${response.data.store._id}`);
        } else {
          navigate("/seller/verification");
        }
      }
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

  // Update the handleSelectChange function to use proper types
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    // Reset dependent fields when parent field changes
    if (name === "country") {
      handleChange({
        target: { name: "state", value: "" },
      } as React.ChangeEvent<HTMLSelectElement>);
      handleChange({
        target: { name: "city", value: "" },
      } as React.ChangeEvent<HTMLSelectElement>);
    } else if (name === "state") {
      handleChange({
        target: { name: "city", value: "" },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
    handleChange(e);
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
        className={`flex-1 flex items-center justify-center p-6 mt-20 ${
          isUpdateMode ? (sidebarCollapsed ? "md:ml-20" : "md:ml-64") : ""
        }`}
      >
        <section className="grid max-w-6xl w-full gap-6 lg:grid-cols-12 items-start">
          {/* ── Left Side (Progress & Help) ─────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            {/* Illustration */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-glam-primary/20 to-transparent"></div>
              <img
                src="/illustrations/shop_1.png"
                alt="Cozy Glam boutique illustration"
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-base font-serif text-white mb-1">
                  {isUpdateMode
                    ? "Update Your Store"
                    : "Let's Set Up Your Store"}
                </h2>
                <p className="text-xs text-white/80">
                  Fill in your business details to get started
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white/90 rounded-2xl shadow-lg backdrop-blur-sm p-4">
              <h3 className="text-sm font-medium text-glam-dark mb-3">
                Setup Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-glam-primary text-white flex items-center justify-center text-xs">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-medium text-glam-dark">
                      Create Account
                    </p>
                    <p className="text-[10px] text-gray-500">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-glam-primary text-white flex items-center justify-center text-xs">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-medium text-glam-dark">
                      Business Information
                    </p>
                    <p className="text-[10px] text-gray-500">In Progress</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Verification
                    </p>
                    <p className="text-[10px] text-gray-500">Next Step</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
                    4
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Start Selling
                    </p>
                    <p className="text-[10px] text-gray-500">Final Step</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Box */}
            <div className="bg-glam-primary/10 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-glam-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-glam-primary"
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
                  <h3 className="text-xs font-medium text-glam-dark mb-1">
                    Need Help?
                  </h3>
                  <p className="text-[10px] text-gray-600 mb-2">
                    Our support team is here to help you set up your store
                    successfully.
                  </p>
                  <a
                    href="/help"
                    className="text-[10px] text-glam-primary hover:text-glam-dark font-medium"
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
            className="bg-white/90 rounded-2xl shadow-lg backdrop-blur-sm px-4 py-6 w-full lg:col-span-9"
          >
            <FormHeader
              title={isUpdateMode ? "Update Your Store" : "Create Your Store"}
            />

            <FeedbackMessage error={error} success={success} />

            {fetchLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glam-primary"></div>
              </div>
            ) : (
              <>
                {/* Form Sections */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Store Logo Section */}
                    <div className="bg-glam-light/30 rounded-xl p-4">
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
                    <div className="bg-glam-light/30 rounded-xl p-4">
                      <h3 className="text-xs font-medium text-glam-dark mb-3">
                        Store Information
                      </h3>
                      <div className="grid gap-3">
                        <BusinessInfoFields
                          form={form}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Address Section */}
                    <div className="bg-glam-light/30 rounded-xl p-4">
                      <h3 className="text-xs font-medium text-glam-dark mb-3">
                        Business Address
                      </h3>
                      <div className="grid gap-3">
                        <FormInput
                          label="Business address"
                          name="businessAddress"
                          value={form.businessAddress}
                          required
                          onChange={handleChange}
                          requiredMark
                          placeholder="Street address"
                        />

                        {/* Country Select */}
                        <div>
                          <label className="block text-xs font-medium text-glam-dark mb-1">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="country"
                            value={form.country}
                            onChange={handleSelectChange}
                            required
                            className="w-full h-9 px-3 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-glam-primary bg-white"
                          >
                            <option value="">Select country</option>
                            {countries.map((country: ICountry) => (
                              <option
                                key={country.isoCode}
                                value={country.name}
                              >
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* State Select */}
                        <div>
                          <label className="block text-xs font-medium text-glam-dark mb-1">
                            State/Province{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="state"
                            value={form.state}
                            onChange={handleSelectChange}
                            required
                            className="w-full h-9 px-3 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-glam-primary bg-white"
                            disabled={!form.country}
                          >
                            <option value="">Select state</option>
                            {states.map((state: IState) => (
                              <option key={state.isoCode} value={state.name}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* City Select */}
                        <div>
                          <label className="block text-xs font-medium text-glam-dark mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="city"
                            value={form.city}
                            onChange={handleSelectChange}
                            required
                            className="w-full h-9 px-3 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-glam-primary bg-white"
                            disabled={!form.state}
                          >
                            <option value="">Select city</option>
                            {cities.map((city: ICity) => (
                              <option key={city.name} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <FormInput
                          label="Postal Code"
                          name="postalCode"
                          value={form.postalCode}
                          required
                          onChange={handleChange}
                          requiredMark
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-glam-light/30 rounded-xl p-4">
                      <h3 className="text-xs font-medium text-glam-dark mb-3">
                        Social Media Links
                      </h3>
                      <div className="grid gap-3">
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
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative overflow-hidden group bg-glam-primary hover:bg-glam-dark text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
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
                          <span className="text-sm">
                            {isUpdateMode
                              ? "Updating Store..."
                              : "Creating Store..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm">
                            {isUpdateMode ? "Update Store" : "Create Store"}
                          </span>
                          <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
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
