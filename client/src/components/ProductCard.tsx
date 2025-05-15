import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "@/hooks/use-auth";
import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Проверяем, есть ли товар в избранном при загрузке
  useEffect(() => {
    if (user) {
      setIsFavorited(isFavorite(product.id));
    }
  }, [user, product.id, isFavorite]);
  
  const handleToggleFavorite = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    toggleFavorite(product.id);
    setIsFavorited(!isFavorited);
    
    toast({
      title: isFavorited ? "Удалено из избранного" : "Добавлено в избранное",
      description: isFavorited 
        ? `${product.name} удален из избранного` 
        : `${product.name} добавлен в избранное`,
    });
  };
  
  const goToProductPage = () => {
    navigate(`/product/${product.id}`);
  };
  
  // Получаем категорию для отображения в бейдже
  const getCategory = () => {
    if (product.gender === 'men') return 'Мужское';
    if (product.gender === 'women') return 'Женское';
    return product.category;
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 product-card h-full">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-96 object-cover cursor-pointer"
          onClick={goToProductPage}
        />
        <button 
          className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={handleToggleFavorite}
        >
          <i className={`${isFavorited ? 'fas text-secondary text-xl' : 'far text-gray-600 hover:text-secondary text-xl'} fa-heart`}></i>
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <Badge className="mb-2" variant="secondary">{getCategory()}</Badge>
          <h3 
            className="font-semibold text-xl text-white cursor-pointer hover:underline transition-colors truncate"
            onClick={goToProductPage}
          >
            {product.name}
          </h3>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-gray-600 line-clamp-2">{product.description}</p>
        
        <div className="mt-4 flex justify-center">
          <button 
            className="bg-primary/10 text-primary py-3 px-6 rounded-full font-medium hover:bg-primary hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider flex items-center justify-center"
            onClick={goToProductPage}
          >
            <i className="fas fa-eye mr-2"></i>
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
}
