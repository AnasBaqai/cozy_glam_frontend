import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserInfo {
  id: string;
  name: string;
  type: "seller" | "buyer";
  email: string;
}

interface UserContextType {
  user: UserInfo | null;
  isStoreCreated: boolean;
  setUser: (user: UserInfo | null) => void;
  setIsStoreCreated: (created: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const USER_STORAGE_KEY = "cozy_glam_user";
const STORE_CREATED_KEY = "cozy_glam_is_store_created";

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [isStoreCreated, setIsStoreCreated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORE_CREATED_KEY);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORE_CREATED_KEY, JSON.stringify(isStoreCreated));
  }, [isStoreCreated]);

  return (
    <UserContext.Provider
      value={{ user, isStoreCreated, setUser, setIsStoreCreated }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
