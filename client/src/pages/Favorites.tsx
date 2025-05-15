import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, User, MapPin, Heart, ShoppingBag } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import ProductCard from "../components/ProductCard";
import { useFilter } from "../contexts/FilterContext";
import { Link } from "wouter";

export default function Favorites() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const {
    favorites,
    favoriteProducts,
    isLoading: isLoadingFavorites,
  } = useFavorites();
  const { setGender } = useFilter();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("favorites");

  if (isLoadingAuth || isLoadingFavorites) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Перенаправление на страницу авторизации...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-2xl text-white">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p className="text-gray-500">Клиент</p>
            </div>

            <div className="space-y-2">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Профиль
              </Button>
              {/* <Button 
                variant={activeTab === "addresses" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => navigate("/profile")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Адреса доставки
              </Button> */}
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate("/orders")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                История заказов
              </Button>
              <Button
                variant={activeTab === "favorites" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("favorites")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Избранное
                {favorites.length > 0 && (
                  <span className="ml-auto bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Избранные товары</h2>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  У вас пока нет избранных товаров
                </h3>
                <p className="text-gray-500 mb-4">
                  Добавляйте товары в избранное, чтобы сохранить их на потом
                </p>
                <Button
                  onClick={() => {
                    setGender("all");
                    navigate("/");
                  }}
                >
                  Перейти к покупкам
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
