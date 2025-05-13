import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { storeService, uploadService } from "../../services/api";
import Navbar from "../../components/layout/Navbar/Navbar";
import Marquee from "../../components/layout/Marquee/Marquee";
import DocumentUploadField from "../../components/seller/business-info/DocumentUploadField";
import { VerificationFormData } from "../../types/business.types";
import { toast } from "react-toastify";

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

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
    } else if (!user?.isStoreCreated) {
      navigate("/business-info");
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

      <main className="flex-1 flex items-center justify-center p-10 mt-24">
        <div className="max-w-4xl w-full">
          <div className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-sm px-6 py-8 w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl font-semibold text-glam-dark mb-2">
                Verify Your Store
              </h1>
              <p className="text-gray-600">
                Complete verification to increase buyer trust and unlock
                additional features
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-3 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-3 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Registration Information */}
              <div className="bg-glam-light/30 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-glam-dark mb-4">
                  Business Registration Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-glam-dark mb-2">
                      CRN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="crn_number"
                      value={form.crn_number}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-glam-primary bg-white"
                      placeholder="Enter your CRN number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-glam-dark mb-2">
                      VAT Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vat_number"
                      value={form.vat_number}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-glam-primary bg-white"
                      placeholder="Enter your VAT number"
                    />
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="bg-glam-light/30 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-glam-dark mb-4">
                  Document Uploads
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <DocumentUploadField
                    label="Identity Document"
                    required
                    file={form.identity_document}
                    setFile={setIdentityDocument}
                    uploadLoading={uploadingIdentity}
                    sizeError={identitySizeError}
                    setSizeError={setIdentitySizeError}
                  />
                  <DocumentUploadField
                    label="CRN Document"
                    required
                    file={form.crn_document}
                    setFile={setCrnDocument}
                    uploadLoading={uploadingCrn}
                    sizeError={crnSizeError}
                    setSizeError={setCrnSizeError}
                  />
                  <DocumentUploadField
                    label="VAT Document"
                    required
                    file={form.vat_document}
                    setFile={setVatDocument}
                    uploadLoading={uploadingVat}
                    sizeError={vatSizeError}
                    setSizeError={setVatSizeError}
                  />
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

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-glam-primary text-white rounded-xl font-medium hover:bg-glam-dark transition-colors flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Verification"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Verification Benefits */}
          <div className="mt-8 bg-white/90 rounded-3xl shadow-lg backdrop-blur-sm p-6">
            <h3 className="text-lg font-medium text-glam-dark mb-4">
              Benefits of Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-glam-primary/10 p-3 rounded-full mb-3">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-glam-dark mb-2">
                  Increased Trust
                </h4>
                <p className="text-sm text-gray-600">
                  Verified sellers gain more trust from buyers, leading to
                  higher conversion rates
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-glam-primary/10 p-3 rounded-full mb-3">
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
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-glam-dark mb-2">
                  Better Payment Terms
                </h4>
                <p className="text-sm text-gray-600">
                  Access to improved payment processing terms and faster payouts
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-glam-primary/10 p-3 rounded-full mb-3">
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-glam-dark mb-2">
                  Featured Placement
                </h4>
                <p className="text-sm text-gray-600">
                  Verified stores receive priority in search results and
                  featured sections
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
