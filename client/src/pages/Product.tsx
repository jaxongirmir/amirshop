import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Product as ProductType } from "@shared/schema";
import { 
  ChevronLeft, 
  ShoppingBag, 
  Heart, 
  HeartFilled, 
  Truck, 
  PackageOpen, 
  ArrowLeft,
  Star,
  StarFilled
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [, navigate] = useLocation();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<ProductType>({
    queryKey: [`/api/products/${id}`],
  });

  // Format price from cents to dollars
  const formattedPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast({
        title: "Выберите размер",
        description: "Пожалуйста, выберите размер перед добавлением в корзину",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      size: selectedSize,
      quantity: quantity,
    });
    
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} (${selectedSize}) добавлен в вашу корзину`,
    });
  };
  
  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product.id);
    
    toast({
      title: isFavorite(product.id) ? "Удалено из избранного" : "Добавлено в избранное",
      description: isFavorite(product.id)
        ? `${product.name} удален из избранного`
        : `${product.name} добавлен в избранное`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Назад к товарам
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[500px] rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="w-3/4 h-10" />
            <Skeleton className="w-1/4 h-8" />
            <Skeleton className="w-full h-32" />
            <div className="space-y-2">
              <Skeleton className="w-1/2 h-6" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-10 h-10 rounded-md" />
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="w-1/3 h-12" />
              <Skeleton className="w-1/3 h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Товар не найден
        </h2>
        <p className="text-gray-600 mb-8">
          К сожалению, запрашиваемый товар не существует или был удален.
        </p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться на главную
        </Button>
      </div>
    );
  }

  // Parse the available sizes from JSON
  const availableSizes = Array.isArray(product.availableSizes) 
    ? product.availableSizes 
    : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад к товарам
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full object-cover h-[500px]"
          />
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  i < 4 ? 
                    <StarFilled key={i} className="h-4 w-4" /> : 
                    <Star key={i} className="h-4 w-4" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(24 отзыва)</span>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-primary">
            {formattedPrice(product.price)}
          </div>
          
          <p className="text-gray-700">{product.description}</p>
          
          <div className="border-t border-b py-4">
            <p className="text-sm text-gray-500 mb-1">Категория: <span className="font-medium capitalize">{product.category}</span></p>
            <p className="text-sm text-gray-500">Для: <span className="font-medium capitalize">{product.gender === "men" ? "Мужчин" : "Женщин"}</span></p>
          </div>
          
          {/* Size Selection */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Выберите размер:</p>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`w-12 h-12 border rounded-md flex items-center justify-center text-sm font-medium transition-colors
                    ${selectedSize === size 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-gray-300 text-gray-600 hover:border-gray-400"}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity Selection */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Количество:</p>
            <div className="flex items-center border border-gray-300 rounded-md w-36">
              <button 
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-md"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button 
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-md"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              className="flex-1 h-12"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Добавить в корзину
            </Button>
            
            <Button 
              variant="outline"
              className="w-12 h-12 p-0"
              onClick={handleToggleFavorite}
            >
              {isFavorite(product.id) ? (
                <HeartFilled className="h-5 w-5 text-secondary" />
              ) : (
                <Heart className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          {/* Shipping Information */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center text-gray-700">
              <Truck className="h-5 w-5 mr-3 text-primary" />
              <p className="text-sm">Бесплатная доставка при заказе от $50</p>
            </div>
            <div className="flex items-center text-gray-700">
              <PackageOpen className="h-5 w-5 mr-3 text-primary" />
              <p className="text-sm">Возврат в течение 30 дней</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}