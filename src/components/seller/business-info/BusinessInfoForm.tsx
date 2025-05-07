import { useUser } from "../../../context/UserContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "../../layout/Marquee/Marquee";
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";
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

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  isUpdateMode = false,
}) => {
  const { setIsStoreCreated } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <main className="flex-1 flex items-center justify-center p-4 mt-20">
        <section className="grid max-w-7xl w-full gap-8 lg:grid-cols-10 items-start">
          {/* ── Illustration ─────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
            <img
              src="/illustrations/shop_1.png"
              alt="Cozy Glam boutique illustration"
              className="max-w-full w-full opacity-90"
            />
          </div>

          {/* ── Form Card ────────────────────────────────── */}
          <form
            onSubmit={handleContinue}
            className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-sm px-6 py-6 w-full lg:col-span-7"
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
                <LogoUploadField
                  previewImage={previewImage}
                  setPreviewImage={setPreviewImage}
                  onFileSelect={handleFileSelect}
                  uploadLoading={uploadLoading}
                  sizeError={sizeError}
                  setSizeError={setSizeError}
                  isRequired={!isUpdateMode}
                />

                <BusinessInfoFields form={form} onChange={handleChange} />

                <SocialLinksSetup
                  socials={{
                    instagram: form.instagram,
                    facebook: form.facebook,
                    tiktok: form.tiktok,
                  }}
                  setSocial={setSocial}
                />

                <SubmitButton
                  label={isUpdateMode ? "Update Store" : "Continue"}
                  loadingLabel={
                    isUpdateMode ? "Updating Store..." : "Creating Store..."
                  }
                  loading={loading}
                  className="mt-4"
                />
              </>
            )}
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessInfoForm;
