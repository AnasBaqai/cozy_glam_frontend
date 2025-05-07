import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAppSelector } from "../store/hooks";
import { productService } from "../services/api";
import { ListingsData } from "../types/dashboard.types";

interface ProductContextType {
  listings: ListingsData;
  loading: boolean;
  error: string | null;
  refreshListings: () => Promise<void>;
}

const defaultContext: ProductContextType = {
  listings: {
    active: 0,
    drafts: 0,
    total: 0,
  },
  loading: false,
  error: null,
  refreshListings: async () => {},
};

const ProductContext = createContext<ProductContextType>(defaultContext);

export const useProductContext = () => useContext(ProductContext);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [listings, setListings] = useState<ListingsData>(
    defaultContext.listings
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  const fetchProductListings = async () => {
    if (user?.isStoreCreated) {
      try {
        setLoading(true);
        setError(null);

        // Get active products
        const activeResponse = await productService.getSellerProducts("active");
        const activeCount = activeResponse.data.total || 0;

        // Get draft products
        const draftResponse = await productService.getSellerProducts("draft");
        const draftCount = draftResponse.data.total || 0;

        // Calculate total
        const totalCount = activeCount + draftCount;

        setListings({
          active: activeCount,
          drafts: draftCount,
          total: totalCount,
        });
      } catch (error) {
        console.error("Failed to fetch product listings:", error);
        setError("Failed to load product listings");
      } finally {
        setLoading(false);
      }
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchProductListings();
  }, [user]);

  const refreshListings = async () => {
    await fetchProductListings();
  };

  return (
    <ProductContext.Provider
      value={{ listings, loading, error, refreshListings }}
    >
      {children}
    </ProductContext.Provider>
  );
};
