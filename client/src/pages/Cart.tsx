import { useCart } from "../contexts/CartContext";
import { Link, useLocation } from "wouter";
import { useFilter } from "../contexts/FilterContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, updateCartItemQuantity, cartTotal } = useCart();
  const { setGender } = useFilter();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  if (isLoading) {
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
  
  // Форматируем цену из копеек в рубли
  const formatPrice = (price: number) => {
    return `₽${(price / 100).toFixed(2)}`;
  };
  
  const handleRemoveItem = (cartItemId: number) => {
    removeFromCart(cartItemId);
    toast({
      title: "Товар удален",
      description: "Товар был удален из вашей корзины",
    });
  };
  
  const handleQuantityChange = (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    updateCartItemQuantity(cartItemId, quantity);
  };
  
  const handleCheckout = () => {
    setCheckoutLoading(true);
    
    // Имитируем процесс оформления заказа
    setTimeout(() => {
      toast({
        title: "Заказ успешно оформлен!",
        description: "Спасибо за вашу покупку",
      });
      setCheckoutLoading(false);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>
      
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Товары в корзине ({cartItems.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-28 h-28 flex-shrink-0">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg">{item.product.name}</h3>
                      <p className="text-gray-500 mb-2">Размер: {item.size}</p>
                      <p className="text-primary font-semibold">{formatPrice(item.product.price)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold mb-2">{formatPrice(item.product.price * item.quantity)}</p>
                      <button 
                        className="text-sm text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Итого заказа</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Подытог</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Доставка</span>
                  <span className="font-medium">Бесплатно</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Налог</span>
                  <span className="font-medium">{formatPrice(cartTotal * 0.1)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Итого</span>
                    <span className="text-primary">{formatPrice(cartTotal * 1.1)}</span>
                  </div>
                </div>
                
                <Link to="/checkout" className="w-full">
                  <button 
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 mt-4 flex items-center justify-center"
                    onClick={handleCheckout}
                  >
                    {checkoutLoading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Обработка...
                      </>
                    ) : (
                      'Перейти к оформлению'
                    )}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shopping-cart text-2xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h2>
          <p className="text-gray-600 mb-6">Похоже, вы еще не добавили товары в корзину.</p>
          <Link to="/">
            <button 
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
              onClick={() => setGender('all')}
            >
              Продолжить покупки
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}