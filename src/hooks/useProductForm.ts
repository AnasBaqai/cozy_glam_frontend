import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
  Category,
  SubCategory,
  categoryService,
  productService,
  uploadService,
} from "../services/api";
import {
  ProductFormData,
  ImagePreview,
  ToastMessage,
} from "../types/product.types";

const useProductForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    quantity: "",
    images: [],
    category: "",
    subCategories: [],
  });

  // UI state
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [totalImageSize, setTotalImageSize] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [sizeError, setSizeError] = useState("");

  // Categories and subcategories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<ToastMessage>({
    visible: false,
    message: "",
    type: "success",
  });

  // Constants
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB in bytes

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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await categoryService.getCategories();
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Handle numeric fields (price and quantity)
    if (name === "price" || name === "quantity") {
      // Allow empty value for backspacing
      if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      // Only allow numeric values
      if (/^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      // Handle text fields normally
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle category selection
  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryId = e.target.value;

    // Update the form data with the selected category
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subCategories: [], // Reset subcategories when category changes
    }));

    // Clear any error on the category field
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }

    // If no category is selected, clear subcategories
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    // Fetch subcategories for the selected category
    try {
      setLoadingSubcategories(true);
      const response = await categoryService.getSubCategories(categoryId);

      if (response.status) {
        if (response.data && Array.isArray(response.data)) {
          setSubcategories(response.data);
        } else if (
          response.data &&
          response.data.subcategories &&
          Array.isArray(response.data.subcategories)
        ) {
          setSubcategories(response.data.subcategories);
        } else if (Array.isArray(response)) {
          setSubcategories(response);
        } else {
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, subcategoryId],
    }));
  };

  // Handle subcategory removal
  const handleSubcategoryRemove = (subcategoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((id) => id !== subcategoryId),
    }));
  };

  // Update images in form data
  const handleImagesChange = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (Number(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (Number(formData.quantity) <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";
    if (!formData.category) newErrors.category = "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");
    setIsSubmitting(true);
    setSuccessMessage("");

    const isValid = validateForm();
    if (!isValid) {
      console.log("Form validation failed:", errors);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Uploading images...");
      // Upload images first
      const imageUrls = await uploadService.uploadMultipleImages(
        formData.images
      );
      console.log("Images uploaded successfully:", imageUrls);

      // Create product data
      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        images: imageUrls,
        seller_id: user?._id || "",
        categories: formData.category || "", // Changed from category to categories
        subcategories: formData.subCategories,
        status: "active" as const, // Set status to active for publish
      };

      console.log(
        "Sending product data to API:",
        JSON.stringify(productData, null, 2)
      );

      // Call API to create product
      const response = await productService.createProduct(productData);
      console.log("Product created successfully:", response);

      // Store success message in localStorage for dashboard
      localStorage.setItem(
        "dashboardFlash",
        JSON.stringify({
          type: "success",
          message: `Product "${formData.title}" was successfully created!`,
          timestamp: Date.now(),
        })
      );

      // Navigate to dashboard immediately
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating product:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      } else {
        console.error("Unknown error type:", err);
      }

      setErrors({
        submit:
          err instanceof Error
            ? err.message
            : "Failed to create product. Please try again.",
      });

      // Show error toast that fades out after 5 seconds
      setToastMessage({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to create product. Please try again.",
        visible: true,
      });

      setTimeout(() => {
        setToastMessage((prev) => ({ ...prev, visible: false }));
      }, 5000);

      setIsSubmitting(false);
    }
  };

  // Add the handleSaveAsDraft function
  const handleSaveAsDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save as draft started");
    setIsSubmitting(true);
    setSuccessMessage("");

    // For drafts, we'll validate with less strict rules
    // Title and at least one image are required, but other fields can be incomplete
    const draftErrors: { [key: string]: string } = {};

    if (!formData.title.trim())
      draftErrors.title = "Title is required for draft";
    if (formData.images.length === 0)
      draftErrors.images = "At least one image is required for draft";

    if (Object.keys(draftErrors).length > 0) {
      console.log("Draft validation failed:", draftErrors);
      setErrors(draftErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Uploading images for draft...");
      // Upload images first
      const imageUrls = await uploadService.uploadMultipleImages(
        formData.images
      );
      console.log("Images for draft uploaded successfully:", imageUrls);

      // Create product data
      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price || 0),
        quantity: Number(formData.quantity || 0), // Use 0 as fallback
        images: imageUrls,
        seller_id: user?._id || "",
        categories: formData.category || "", // Changed from category to categories
        subcategories: formData.subCategories,
        status: "draft" as const, // Set status to draft
      };

      console.log(
        "Sending draft product data to API:",
        JSON.stringify(productData, null, 2)
      );

      // Call API to create product
      const response = await productService.createProduct(productData);
      console.log("Draft product created successfully:", response);

      // Store success message in localStorage for dashboard
      localStorage.setItem(
        "dashboardFlash",
        JSON.stringify({
          type: "success",
          message: `Product "${formData.title}" was saved as draft.`,
          timestamp: Date.now(),
        })
      );

      // Navigate to dashboard immediately
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving product as draft:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      } else {
        console.error("Unknown error type:", err);
      }

      setErrors({
        submit:
          err instanceof Error
            ? err.message
            : "Failed to save product as draft. Please try again.",
      });

      // Show error toast that fades out after 5 seconds
      setToastMessage({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to save product as draft. Please try again.",
        visible: true,
      });

      setTimeout(() => {
        setToastMessage((prev) => ({ ...prev, visible: false }));
      }, 5000);

      setIsSubmitting(false);
    }
  };

  return {
    formData,
    imagePreviews,
    totalImageSize,
    isSubmitting,
    errors,
    successMessage,
    sizeError,
    categories,
    subcategories,
    loadingCategories,
    loadingSubcategories,
    toastMessage,
    MAX_TOTAL_SIZE,
    handleInputChange,
    handleCategoryChange,
    handleSubcategorySelect,
    handleSubcategoryRemove,
    handleImagesChange,
    handleSubmit,
    handleSaveAsDraft,
    setImagePreviews,
    setTotalImageSize,
    setSizeError,
    setToastMessage,
  };
};

export default useProductForm;
