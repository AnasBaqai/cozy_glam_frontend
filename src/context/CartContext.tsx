import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getItemCount: (itemId: string) => number;
  getTotalCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prevItems.filter((i) => i.id !== itemId);
      }
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getItemCount,
    getTotalCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
