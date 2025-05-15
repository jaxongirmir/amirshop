import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/hooks/use-auth";
import { Product as ProductType } from "@shared/schema";
import { 
  ChevronLeft, 
  ShoppingBag, 
  Heart, 
  Truck, 
  PackageOpen, 
  ArrowLeft,
  Star,
  CreditCard,
  ShieldCheck,
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [, navigate] = useLocation();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<ProductType>({
    queryKey: [`/api/products/${id}`],
  });

  // Format price from cents to dollars
  const formattedPrice = (price: number) => {
    return `₽${(price / 100).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему чтобы добавить товар в корзину",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!selectedSize) {
      toast({
        title: "Выберите размер",
        description: "Пожалуйста, выберите размер перед добавлением в корзину",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Adding to cart:", {
        productId: product.id,
        size: selectedSize,
        quantity: quantity,
      });
      
      // Добавляем товар в корзину
      addToCart({
        productId: product.id,
        size: selectedSize,
        quantity: quantity,
      });
      
      // Показываем уведомление
      toast({
        title: "Добавлено в корзину",
        description: `${product.name} (${selectedSize}) добавлен в вашу корзину`,
      });
      
      // Обновляем страницу для подтверждения изменений (временное решение)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Ошибка", 
        description: "Не удалось добавить товар в корзину. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleFavorite = () => {
    if (!product) return;
    
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему чтобы добавить товар в избранное",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    try {
      // Сохраняем текущее состояние избранного до запроса
      const wasInFavorites = isFavorite(product.id);
      
      // Выполняем запрос к API
      console.log("Toggling favorite for product:", product.id);
      toggleFavorite(product.id);
      
      // Показываем уведомление после успешного запроса
      toast({
        title: wasInFavorites ? "Удалено из избранного" : "Добавлено в избранное",
        description: wasInFavorites
          ? `${product.name} удален из избранного`
          : `${product.name} добавлен в избранное`,
      });
      
      // Обновляем страницу для подтверждения изменений (временное решение)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Ошибка", 
        description: "Не удалось обновить избранное. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (isLoading || isLoadingAuth) {
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
          <div className="relative">
            <Skeleton className="w-full h-[600px] rounded-lg" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          </div>
          <div className="space-y-8">
            <Skeleton className="w-3/4 h-12" />
            <Skeleton className="w-1/4 h-8" />
            <Skeleton className="w-full h-40" />
            <div className="space-y-2">
              <Skeleton className="w-1/2 h-6" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-12 h-12 rounded-md" />
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="w-1/3 h-14" />
              <Skeleton className="w-1/3 h-14" />
              <Skeleton className="w-12 h-14 rounded-md" />
            </div>
            <div className="space-y-4 pt-6">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="text-red-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Товар не найден
          </h2>
          <p className="text-gray-600 mb-8">
            К сожалению, запрашиваемый товар не существует или был удален. Пожалуйста, вернитесь на главную страницу и выберите другой товар.
          </p>
          <Button className="w-full" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  // Parse the available sizes from JSON
  const availableSizes: string[] = Array.isArray(product.availableSizes) 
    ? product.availableSizes 
    : typeof product.availableSizes === 'string' 
      ? JSON.parse(product.availableSizes) 
      : [];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад к товарам
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full object-cover h-[600px]"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border-2 hover:border-primary cursor-pointer transition-all">
                <img 
                  src={product.imageUrl} 
                  alt={`${product.name} view ${i+1}`} 
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={product.gender === "men" ? "default" : "secondary"}>
                {product.gender === "men" ? "Мужское" : "Женское"}
              </Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">(24 отзыва)</span>
            </div>
            
            <div className="text-3xl font-bold text-primary mb-4">
              {formattedPrice(product.price)}
            </div>
          </div>
          
          <Tabs defaultValue="description" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="details">Детали</TabsTrigger>
              <TabsTrigger value="delivery">Доставка</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Категория</h4>
                      <p className="font-medium">{product.category}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Пол</h4>
                      <p className="font-medium">{product.gender === "men" ? "Мужской" : "Женский"}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Состав</h4>
                    <p className="font-medium">100% хлопок</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Уход</h4>
                    <p className="font-medium">Машинная стирка при 30°C</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="delivery" className="mt-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 mr-4 text-primary" />
                    <div>
                      <h4 className="font-medium">Стандартная доставка</h4>
                      <p className="text-sm text-gray-500">3-5 рабочих дней</p>
                    </div>
                    <span className="ml-auto font-semibold">₽300</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-4 text-primary" />
                    <div>
                      <h4 className="font-medium">Экспресс доставка</h4>
                      <p className="text-sm text-gray-500">1-2 рабочих дня</p>
                    </div>
                    <span className="ml-auto font-semibold">₽600</span>
                  </div>
                  
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-4 text-green-500" />
                    <div>
                      <h4 className="font-medium">Гарантированный возврат</h4>
                      <p className="text-sm text-gray-500">30 дней на возврат товара</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Size Selection */}
          <div>
            <p className="font-medium text-gray-900 mb-3">Выберите размер:</p>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`w-14 h-14 border-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all
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
            <p className="font-medium text-gray-900 mb-3">Количество:</p>
            <div className="flex items-center border-2 border-gray-300 rounded-lg w-40">
              <button 
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button 
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4 pt-2">
            <Button 
              className="flex-1 h-14 text-lg rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Добавить в корзину
            </Button>
            
            <Button 
              variant="outline"
              className="w-14 h-14 p-0 rounded-xl"
              onClick={handleToggleFavorite}
            >
              <Heart 
                className={`h-6 w-6 ${isFavorite(product.id) ? "fill-secondary text-secondary" : ""}`} 
              />
            </Button>
          </div>
          
          <Button 
            variant="secondary"
            className="w-full h-14 text-lg rounded-xl mt-2"
            onClick={handleBuyNow}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Купить сейчас
          </Button>
          
          {/* Additional Information */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
              <Truck className="h-8 w-8 mb-2 text-primary" />
              <p className="text-sm font-medium">Бесплатная доставка<br/>от ₽5000</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
              <ShieldCheck className="h-8 w-8 mb-2 text-primary" />
              <p className="text-sm font-medium">100% гарантия<br/>качества</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
              <PackageOpen className="h-8 w-8 mb-2 text-primary" />
              <p className="text-sm font-medium">Возврат в течение<br/>30 дней</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}