import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@shared/schema";

interface CartItem {
  id: number;
  userId: number;
  productId: number;
  size: string;
  quantity: number;
  product: Product;
}

interface AddToCartInput {
  productId: number;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  cartTotal: number;
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartTotal, setCartTotal] = useState(0);
  
  // Fetch cart items
  const { data: cartItems = [], isLoading, refetch } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
  });
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (item: AddToCartInput) => {
      const response = await apiRequest('POST', '/api/cart', item);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });
  
  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });
  
  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiRequest('PATCH', `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });
  
  // Calculate cart total
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    setCartTotal(total);
  }, [cartItems]);
  
  // Context functions
  const addToCart = (item: AddToCartInput) => {
    addToCartMutation.mutate(item);
  };
  
  const removeFromCart = (id: number) => {
    removeFromCartMutation.mutate(id);
  };
  
  const updateCartItemQuantity = (id: number, quantity: number) => {
    updateCartItemMutation.mutate({ id, quantity });
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading,
      cartTotal,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
