import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useQuery } from "@tanstack/react-query";
import { useFilter } from "../contexts/FilterContext";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  const { setGender } = useFilter();
  const { user, logoutMutation } = useAuth();
  
  // Get notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
  });
  
  const unreadNotifications = Array.isArray(notifications) 
    ? notifications.filter((notification: any) => !notification.read)
    : [];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update filter context with search query
      setGender('all');
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleCategoryClick = (gender: string) => {
    setGender(gender);
    navigate('/');
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            AmirHub
          </Link>
          
          {/* Search Bar */}
          <div className="hidden md:block w-1/3">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Поиск товаров..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => handleCategoryClick('men')}
              className={`text-gray-700 hover:text-accent transition-colors duration-200 ${
                location === '/' && useFilter().gender === 'men' ? 'text-accent' : ''
              }`}
            >
              Мужчинам
            </button>
            <button
              onClick={() => handleCategoryClick('women')}
              className={`text-gray-700 hover:text-accent transition-colors duration-200 ${
                location === '/' && useFilter().gender === 'women' ? 'text-accent' : ''
              }`}
            >
              Женщинам
            </button>
            <Link href="/favorites" className="relative text-gray-700 hover:text-accent transition-colors duration-200">
              <i className="far fa-heart text-xl"></i>
              {favorites.length > 0 && (
                <span className="badge">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/notifications" className="relative text-gray-700 hover:text-accent transition-colors duration-200">
              <i className="far fa-bell text-xl"></i>
              {unreadNotifications.length > 0 && (
                <span className="badge">
                  {unreadNotifications.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-accent transition-colors duration-200">
              <i className="fas fa-shopping-bag text-xl"></i>
              {cartItems.length > 0 && (
                <span className="badge">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex items-center text-gray-700 hover:text-accent transition-colors duration-200">
                  <i className="fas fa-user text-xl mr-1"></i>
                  <span className="text-sm">{user.username}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Мои заказы</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="hidden md:block text-gray-700 hover:text-accent transition-colors duration-200">
                <i className="far fa-user text-xl mr-1"></i>
                <span className="text-sm">Войти</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Поиск товаров..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
