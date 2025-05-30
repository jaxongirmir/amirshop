import { createContext, useContext, useMemo, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@shared/schema";

interface Favorite {
  id: number;
  userId: number;
  productId: number;
  product: Product;
}

interface FavoritesContextType {
  favorites: Favorite[];
  favoriteProducts: Product[];
  isLoading: boolean;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Fetch favorites
  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ['/api/favorites'],
  });
  
  // Extract products from favorites for easy access using useMemo to prevent unnecessary re-renders
  const favoriteProducts = useMemo(() => {
    return favorites.map(favorite => favorite.product);
  }, [favorites]);

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest('POST', '/api/favorites', { productId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
  });
  
  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest('DELETE', `/api/favorites/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
  });
  
  // Context functions
  const toggleFavorite = (productId: number) => {
    if (isFavorite(productId)) {
      removeFromFavoritesMutation.mutate(productId);
    } else {
      addToFavoritesMutation.mutate(productId);
    }
  };
  
  const isFavorite = (productId: number) => {
    return favorites.some(favorite => favorite.productId === productId);
  };
  
  const contextValue = useMemo(() => ({
    favorites,
    favoriteProducts,
    isLoading,
    toggleFavorite,
    isFavorite,
  }), [favorites, favoriteProducts, isLoading]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
