import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "@/hooks/use-auth";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Проверяем, есть ли товар в избранном при загрузке
  useEffect(() => {
    if (user) {
      setIsFavorited(isFavorite(product.id));
    }
  }, [user, product.id, isFavorite]);
  
  // Форматируем цену из копеек в рубли
  const formattedPrice = (price: number) => {
    return `₽${(price / 100).toFixed(2)}`;
  };
  
  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!selectedSize) {
      toast({
        title: "Требуется размер",
        description: "Пожалуйста, выберите размер перед добавлением в корзину",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      size: selectedSize,
      quantity: 1,
    });
    
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} (${selectedSize}) добавлен в вашу корзину`,
    });
  };
  
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
  
  // Парсим доступные размеры из JSON
  const availableSizes: string[] = Array.isArray(product.availableSizes) 
    ? product.availableSizes 
    : typeof product.availableSizes === 'string' 
      ? JSON.parse(product.availableSizes) 
      : [];
  
  const goToProductPage = () => {
    navigate(`/product/${product.id}`);
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 product-card">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-80 object-cover cursor-pointer"
          onClick={goToProductPage}
        />
        <button 
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={handleToggleFavorite}
        >
          <i className={`${isFavorited ? 'fas text-secondary' : 'far text-gray-600 hover:text-secondary'} fa-heart`}></i>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <h3 
            className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors"
            onClick={goToProductPage}
          >
            {product.name}
          </h3>
          <span className="text-lg font-bold text-primary">{formattedPrice(product.price)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        
        <div className="mb-4">
          <p className="font-medium text-sm mb-2">Выберите размер:</p>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size: string) => (
              <button
                key={size}
                className={`size-button ${
                  selectedSize === size ? "size-button-selected" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <i className="fas fa-shopping-bag mr-2"></i>
          Добавить в корзину
        </button>
      </div>
    </div>
  );
}
