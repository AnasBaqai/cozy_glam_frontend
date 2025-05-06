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
import {
  BusinessFormData,
  SocialPlatform,
} from "../../../types/business.types";

const BusinessInfoForm: React.FC = () => {
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
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // File state - store the file for upload at form submission
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Redirect if user is not authenticated or is not a seller
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "seller") {
      navigate("/");
    } else if (user?.isStoreCreated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  // Pre-fill business email and phone with user data
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        businessEmail: user.email || "",
        businessPhone: user.phone_number || "",
      }));
    }
  }, [user]);

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

      // Step 3: Create the store
      await storeService.createStore(payload);

      // Step 4: Update app state
      dispatch(setStoreCreated());
      setIsStoreCreated(true);

      // Show success message and redirect
      setSuccess("Store created successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to create store");
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
            <FormHeader title="Create Your Store" />

            <FeedbackMessage error={error} success={success} />

            <LogoUploadField
              previewImage={previewImage}
              setPreviewImage={setPreviewImage}
              onFileSelect={handleFileSelect}
              uploadLoading={uploadLoading}
              sizeError={sizeError}
              setSizeError={setSizeError}
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
              label="Continue"
              loadingLabel="Creating Store..."
              loading={loading}
              className="mt-4"
            />
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessInfoForm;
