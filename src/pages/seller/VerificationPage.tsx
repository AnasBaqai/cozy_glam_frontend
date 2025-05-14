import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { storeService, uploadService } from "../../services/api";
import Navbar from "../../components/layout/Navbar/Navbar";
import Marquee from "../../components/layout/Marquee/Marquee";
import DocumentUploadField from "../../components/seller/business-info/DocumentUploadField";
import { VerificationFormData } from "../../types/business.types";
import { toast } from "react-toastify";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import SidebarMobileToggle from "../../components/seller/dashboard/SidebarMobileToggle";
import useSidebarState from "../../hooks/useSidebarState";

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarState();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Form state
  const [form, setForm] = useState<VerificationFormData>({
    store_id: storeId || "",
    crn_number: "",
    vat_number: "",
    identity_document: null,
    crn_document: null,
    vat_document: null,
    utility_bill: null,
    identity_document_url: "",
    crn_document_url: "",
    vat_document_url: "",
    utility_bill_url: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [identitySizeError, setIdentitySizeError] = useState<string | null>(
    null
  );
  const [crnSizeError, setCrnSizeError] = useState<string | null>(null);
  const [vatSizeError, setVatSizeError] = useState<string | null>(null);
  const [utilityBillSizeError, setUtilityBillSizeError] = useState<
    string | null
  >(null);
  const [uploadingIdentity, setUploadingIdentity] = useState(false);
  const [uploadingCrn, setUploadingCrn] = useState(false);
  const [uploadingVat, setUploadingVat] = useState(false);
  const [uploadingUtilityBill, setUploadingUtilityBill] = useState(false);

  // Redirect if user is not authenticated or is not a seller
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "seller") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch store ID if not provided
  useEffect(() => {
    const fetchStoreId = async () => {
      if (!storeId && user?.isStoreCreated) {
        try {
          const response = await storeService.getStore();
          if (response.data.stores && response.data.stores.length > 0) {
            const store = response.data.stores[0];
            setForm((prev) => ({ ...prev, store_id: store._id }));
          }
        } catch (err) {
          console.error("Failed to fetch store data:", err);
          setError("Failed to load store data. Please try again.");
        }
      }
    };

    fetchStoreId();
  }, [storeId, user]);

  // Form input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Set document files
  const setIdentityDocument = (file: File | null) => {
    setForm((prev) => ({ ...prev, identity_document: file }));
  };

  const setCrnDocument = (file: File | null) => {
    setForm((prev) => ({ ...prev, crn_document: file }));
  };

  const setVatDocument = (file: File | null) => {
    setForm((prev) => ({ ...prev, vat_document: file }));
  };

  const setUtilityBill = (file: File | null) => {
    setForm((prev) => ({ ...prev, utility_bill: file }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!form.crn_number) {
        setError("CRN Number is required");
        setLoading(false);
        return;
      }

      if (!form.identity_document) {
        setError("Identity document is required");
        setLoading(false);
        return;
      }

      if (!form.crn_document) {
        setError("CRN document is required");
        setLoading(false);
        return;
      }

      if (!form.utility_bill) {
        setError("Utility bill is required");
        setLoading(false);
        return;
      }

      // Step 1: Upload identity document
      let identityDocUrl = "";
      if (form.identity_document) {
        try {
          setUploadingIdentity(true);
          const identityResponse = await uploadService.uploadFile(
            form.identity_document
          );
          if (!identityResponse.status) {
            throw new Error("Failed to upload identity document");
          }
          identityDocUrl = identityResponse.data.fileUrl;
          setUploadingIdentity(false);
        } catch {
          // Error caught but not directly used
          setError("Failed to upload identity document. Please try again.");
          setLoading(false);
          setUploadingIdentity(false);
          return;
        }
      }

      // Step 2: Upload CRN document
      let crnDocUrl = "";
      if (form.crn_document) {
        try {
          setUploadingCrn(true);
          const crnResponse = await uploadService.uploadFile(form.crn_document);
          if (!crnResponse.status) {
            throw new Error("Failed to upload CRN document");
          }
          crnDocUrl = crnResponse.data.fileUrl;
          setUploadingCrn(false);
        } catch {
          // Error caught but not directly used
          setError("Failed to upload CRN document. Please try again.");
          setLoading(false);
          setUploadingCrn(false);
          return;
        }
      }

      // Step 3: Upload VAT document (optional)
      let vatDocUrl = "";
      if (form.vat_document) {
        try {
          setUploadingVat(true);
          const vatResponse = await uploadService.uploadFile(form.vat_document);
          if (!vatResponse.status) {
            throw new Error("Failed to upload VAT document");
          }
          vatDocUrl = vatResponse.data.fileUrl;
          setUploadingVat(false);
        } catch {
          // Error caught but not directly used
          setError("Failed to upload VAT document. Please try again.");
          setLoading(false);
          setUploadingVat(false);
          return;
        }
      }

      // Step 4: Upload Utility Bill
      let utilityBillUrl = "";
      if (form.utility_bill) {
        try {
          setUploadingUtilityBill(true);
          const utilityBillResponse = await uploadService.uploadFile(
            form.utility_bill
          );
          if (!utilityBillResponse.status) {
            throw new Error("Failed to upload utility bill");
          }
          utilityBillUrl = utilityBillResponse.data.fileUrl;
          setUploadingUtilityBill(false);
        } catch {
          // Error caught but not directly used
          setError("Failed to upload utility bill. Please try again.");
          setLoading(false);
          setUploadingUtilityBill(false);
          return;
        }
      }

      // Step 5: Now that all files are uploaded, prepare verification data
      const verificationData = {
        store_id: form.store_id,
        crn_number: form.crn_number,
        vat_number: form.vat_number || undefined,
        identity_document: identityDocUrl,
        crn_document: crnDocUrl,
        vat_document: vatDocUrl || undefined,
        utility_bill: utilityBillUrl,
      };

      console.log("Submitting verification data:", verificationData);

      // Step 6: Submit verification
      const response = await storeService.submitVerification(verificationData);

      if (response.status) {
        setSuccess("Verification documents submitted successfully!");
        toast.success("Verification documents submitted successfully!");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(
          response.message || "Failed to submit verification documents."
        );
        toast.error(
          response.message || "Failed to submit verification documents."
        );
      }
    } catch (err: unknown) {
      console.error("Error submitting verification:", err);
      const axiosError = err as {
        response?: {
          data?: {
            message?: string;
          };
          status?: number;
        };
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        "An error occurred while submitting verification documents.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Skip verification and go to dashboard
  const handleSkip = () => {
    toast.info("You can complete verification later from your dashboard");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />

      <SellerSidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <SidebarMobileToggle toggleSidebar={toggleSidebar} />

      <main
        className={`flex-1 p-3 md:p-4 mt-20 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        } transition-all duration-300`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Modern Card with Shadow */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header with Progress */}
            <div className="bg-gradient-to-r from-glam-primary to-glam-dark text-white p-3 md:p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-lg md:text-xl font-bold">
                  Store Verification
                </h1>
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-xs font-medium">
                    Required for selling
                  </span>
                  <div className="w-20 h-1.5 bg-white/30 rounded-full">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="mt-0.5 text-white/80 text-xs md:text-sm">
                Complete verification to increase buyer trust and unlock seller
                features
              </p>
            </div>

            {/* Error/Success Messages */}
            {(error || success) && (
              <div className="px-4 pt-3">
                {error && (
                  <div className="mb-3 text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-3 text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-xs">
                    {success}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4">
              {/* Business Registration Information */}
              <div className="mb-4">
                <h3 className="text-base font-semibold text-glam-dark mb-3 flex items-center">
                  <div className="w-5 h-5 rounded-full bg-glam-primary text-white flex items-center justify-center mr-2 text-xs">
                    1
                  </div>
                  Business Registration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-glam-dark mb-1">
                      CRN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="crn_number"
                      value={form.crn_number}
                      onChange={handleInputChange}
                      required
                      className="w-full h-8 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-glam-primary bg-white text-sm"
                      placeholder="Enter your CRN number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-glam-dark mb-1">
                      VAT Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vat_number"
                      value={form.vat_number}
                      onChange={handleInputChange}
                      required
                      className="w-full h-8 px-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-glam-primary bg-white text-sm"
                      placeholder="Enter your VAT number"
                    />
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div>
                <h3 className="text-base font-semibold text-glam-dark mb-3 flex items-center">
                  <div className="w-5 h-5 rounded-full bg-glam-primary text-white flex items-center justify-center mr-2 text-xs">
                    2
                  </div>
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <DocumentUploadField
                      label="Identity Document"
                      required
                      file={form.identity_document}
                      setFile={setIdentityDocument}
                      uploadLoading={uploadingIdentity}
                      sizeError={identitySizeError}
                      setSizeError={setIdentitySizeError}
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <DocumentUploadField
                      label="CRN Document"
                      required
                      file={form.crn_document}
                      setFile={setCrnDocument}
                      uploadLoading={uploadingCrn}
                      sizeError={crnSizeError}
                      setSizeError={setCrnSizeError}
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <DocumentUploadField
                      label="VAT Document"
                      required
                      file={form.vat_document}
                      setFile={setVatDocument}
                      uploadLoading={uploadingVat}
                      sizeError={vatSizeError}
                      setSizeError={setVatSizeError}
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <DocumentUploadField
                      label="Utility Bill"
                      required
                      file={form.utility_bill}
                      setFile={setUtilityBill}
                      uploadLoading={uploadingUtilityBill}
                      sizeError={utilityBillSizeError}
                      setSizeError={setUtilityBillSizeError}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-2 justify-end mt-5 border-t pt-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-4 py-1.5 border border-gray-300 rounded text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-glam-primary text-white rounded text-sm font-medium hover:bg-glam-dark transition-colors flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Verification"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-white p-3 rounded shadow flex items-start">
              <div className="bg-glam-primary/10 p-1.5 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-glam-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-glam-dark text-xs">
                  Increased Trust
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Verified sellers gain more trust from buyers
                </p>
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow flex items-start">
              <div className="bg-glam-primary/10 p-1.5 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-glam-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-glam-dark text-xs">
                  Better Payment Terms
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Access to improved payment processing terms
                </p>
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow flex items-start">
              <div className="bg-glam-primary/10 p-1.5 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-glam-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-glam-dark text-xs">
                  Featured Placement
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Priority in search results and featured sections
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerificationPage;
