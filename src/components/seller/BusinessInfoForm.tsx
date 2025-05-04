import { useUser } from "../../context/UserContext";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "../layout/Marquee/Marquee";
import Navbar from "../layout/Navbar/Navbar";
import Footer from "../layout/Footer/Footer";
import BusinessInfoFields from "./BusinessInfoFields";
import SocialLinksSetup from "./SocialLinksSetup";
import { storeService, uploadService } from "../../services/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setStoreCreated } from "../../store/slices/authSlice";

// Get image CDN URL from environment
const IMAGE_CDN_URL = import.meta.env.VITE_IMAGE_CDN_URL;

// Function to get full image URL
const getFullImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_CDN_URL}${path}`;
};

// 5MB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function BusinessInfoForm() {
  const { setIsStoreCreated } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

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

  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    storeLogo: "", // Will be filled by the upload process but not shown in the form
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    country: "",
    city: "",
    state: "",
    postalCode: "", // Added postal code field
    website: "",
    instagram: "",
    facebook: "",
    tiktok: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Set preview image if storeLogo exists
  useEffect(() => {
    if (form.storeLogo && !previewImage) {
      setPreviewImage(getFullImageUrl(form.storeLogo));
    }
  }, [form.storeLogo, previewImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setSocial = (
    platform: "instagram" | "facebook" | "tiktok",
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [platform]: value }));
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleLogoFile(files[0]);
  };

  const handleLogoFile = async (file: File) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setSizeError(
        `File is too large. Maximum size is 5MB. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB.`
      );
      setTimeout(() => setSizeError(null), 5000); // Clear error after 5 seconds
      return;
    }

    setSizeError(null);

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image
    try {
      setUploadLoading(true);
      setError("");
      const response = await uploadService.uploadImage(file);
      console.log(response);
      // Store only the relative path in the form
      setForm((prev) => ({ ...prev, storeLogo: response.data.imageUrl }));
      // Check if we need to update the preview image with the server URL
      if (!previewImage || previewImage.startsWith("data:")) {
        setPreviewImage(getFullImageUrl(response.data.imageUrl));
      }
      setSuccess("Logo uploaded successfully!");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to upload logo");
      setPreviewImage(null);
    } finally {
      setUploadLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Remove instagram, facebook, tiktok from payload using destructuring
      const { instagram, facebook, tiktok, postalCode, ...rest } = form;

      // Create typed payload with postcode instead of postalCode
      const payload = {
        ...rest,
        postcode: postalCode,
        socialLinks: {
          instagram,
          facebook,
          tiktok,
        },
      };

      await storeService.createStore(payload);

      // Update Redux state to reflect store creation
      dispatch(setStoreCreated());

      // Update local context if needed
      setIsStoreCreated(true);

      setSuccess("Store created successfully!");

      // Redirect to dashboard
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

  // Logo Upload Field Component
  const LogoUploadField = () => (
    <div className="mb-5">
      <label className="block text-base font-medium text-glam-dark mb-2">
        Business Logo <span className="text-red-500">*</span>
      </label>
      <div
        className={`relative group ${
          uploadLoading ? "pointer-events-none opacity-70" : ""
        }`}
        onDragEnter={handleDrag}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Preview Container */}
          <div
            className={`
            w-full md:w-1/3 border-2 
            ${
              dragActive
                ? "border-glam-primary bg-glam-primary/5"
                : "border-dashed border-glam-accent"
            } 
            rounded-xl transition-all duration-200 flex items-center justify-center
            h-[120px] hover:border-glam-primary hover:bg-glam-primary/5
          `}
            onClick={triggerFileInput}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {previewImage ? (
              <div className="relative w-full h-full">
                <img
                  src={
                    previewImage.startsWith("data:")
                      ? previewImage
                      : getFullImageUrl(previewImage)
                  }
                  alt="Logo Preview"
                  className="w-full h-full object-contain rounded-lg p-2"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center rounded-lg transition-all">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                    className="bg-white text-glam-dark p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-glam-primary hover:text-white"
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mx-auto text-glam-accent group-hover:text-glam-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm font-medium text-glam-dark mt-1">
                  Upload logo
                </p>
              </div>
            )}

            {uploadLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glam-primary"></div>
                  <p className="mt-2 text-sm text-glam-dark">Uploading...</p>
                </div>
              </div>
            )}
          </div>

          {/* Description & Button */}
          <div className="flex-1 text-sm text-gray-600">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p className="mb-1">Upload your business logo (max 5MB)</p>
                <p className="text-xs text-gray-500">
                  PNG or JPG format, 500x500px recommended
                </p>
              </div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-3 py-1.5 bg-glam-primary text-white rounded-lg hover:bg-glam-dark text-sm transition-colors whitespace-nowrap"
                disabled={uploadLoading}
              >
                {uploadLoading ? "Uploading..." : "Choose Image"}
              </button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
          required={!form.storeLogo}
        />

        {sizeError && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
            {sizeError}
          </div>
        )}
      </div>
    </div>
  );

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
            {/* Header */}
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-glam-dark mb-1">
              Business&nbsp;Info
            </h1>

            {/* Progress bar */}
            <div className="mb-4 h-1 w-full rounded bg-glam-primary/20">
              <div className="h-full w-2/3 rounded bg-glam-primary" />
            </div>

            {/* Feedback */}
            {error && (
              <div className="mb-3 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-3 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2 text-sm">
                {success}
              </div>
            )}

            {/* Logo Upload Field */}
            <LogoUploadField />

            {/* Business Info Fields */}
            <BusinessInfoFields form={form} onChange={handleChange} />

            {/* Social Links Setup - Integrated in the form flow */}
            <SocialLinksSetup
              socials={{
                instagram: form.instagram,
                facebook: form.facebook,
                tiktok: form.tiktok,
              }}
              setSocial={setSocial}
            />

            {/* Continue Button */}
            <button
              type="submit"
              className="mt-4 w-full h-12 rounded-xl bg-glam-primary text-white font-medium text-lg hover:bg-glam-dark active:translate-y-px transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Store...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
