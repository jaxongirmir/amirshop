import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Package, CheckCircle, Clock, ShoppingBag, User, MapPin, Heart, X } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  deliveryCost?: number;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  deliveryMethod?: string;
  notes?: string;
}

export default function Orders() {
  const { user, isLoading } = useAuth();
  const { favorites } = useFavorites();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("orders");
  
  // Загружаем заказы из localStorage
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const { toast } = useToast();
  
  // Загрузка заказов при монтировании
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('orderHistory');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        // Если есть заказы, устанавливаем их
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
          setOrders(parsedOrders);
          return;
        }
      }
      
      // Если нет сохраненных заказов, используем демо-данные
      setOrders([
        {
          id: "ORD-2023-001",
          date: "15.05.2023",
          total: 12500,
          status: "Доставлен",
          items: [
            { name: "Футболка с принтом", price: 2500, quantity: 2 },
            { name: "Джинсы классические", price: 7500, quantity: 1 },
          ],
        },
        {
          id: "ORD-2023-002",
          date: "03.06.2023",
          total: 5800,
          status: "В пути",
          items: [
            { name: "Кроссовки спортивные", price: 5800, quantity: 1 },
          ],
        },
      ]);
    } catch (error) {
      console.error('Ошибка при загрузке истории заказов:', error);
    }
  }, []);
  
  // Функция для повторного заказа
  const handleRepeatOrder = (order: Order) => {
    // В реальном приложении здесь было бы добавление товаров в корзину
    // через API и перенаправление в корзину
    toast({
      title: "Создаем заказ",
      description: "Добавляем товары в корзину...",
    });
    
    // Перенаправляем на главную страницу (в реальном приложении - в корзину)
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };
  
  // Функция для показа деталей заказа
  const showDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Доставлен":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "В пути":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "В обработке":
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-gray-500" />;
    }
  };

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
              <Button 
                variant={activeTab === "addresses" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => navigate("/profile")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Адреса доставки
              </Button>
              <Button 
                variant={activeTab === "orders" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                История заказов
              </Button>
              <Button 
                variant={activeTab === "favorites" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => navigate("/favorites")}
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
          <h2 className="text-2xl font-bold mb-6">История заказов</h2>
          
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Заказ {order.id}</CardTitle>
                      <CardDescription>от {order.date}</CardDescription>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 font-medium">{order.status}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-sm text-gray-500">
                              <th className="pb-2">Товар</th>
                              <th className="pb-2 text-right">Цена</th>
                              <th className="pb-2 text-right">Кол-во</th>
                              <th className="pb-2 text-right">Итого</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="py-3">{item.name}</td>
                                <td className="py-3 text-right">{item.price} ₽</td>
                                <td className="py-3 text-right">{item.quantity}</td>
                                <td className="py-3 text-right">{item.price * item.quantity} ₽</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gray-200 font-semibold">
                              <td colSpan={3} className="pt-3 text-right">Итого:</td>
                              <td className="pt-3 text-right">{order.total} ₽</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" className="mr-2" onClick={() => showDetails(order)}>
                          Детали заказа
                        </Button>
                        <Button onClick={() => handleRepeatOrder(order)}>
                          Повторить заказ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">У вас пока нет заказов</h3>
                <p className="text-gray-500 mb-4">
                  Как только вы сделаете свой первый заказ, он появится здесь
                </p>
                <Button onClick={() => navigate("/")}>
                  Перейти к покупкам
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Модальное окно с деталями заказа */}
          {showOrderDetails && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
                <CardHeader className="sticky top-0 bg-white z-10 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Детали заказа {selectedOrder.id}</CardTitle>
                    <CardDescription>от {selectedOrder.date}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowOrderDetails(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Статус заказа */}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center">
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-2 font-medium">{selectedOrder.status}</span>
                      </div>
                      {selectedOrder.status === "Доставлен" && (
                        <div className="text-sm text-muted-foreground">
                          Доставлен {selectedOrder.date}
                        </div>
                      )}
                    </div>
                    
                    {/* Информация о заказе */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Товары в заказе</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-sm text-gray-500">
                              <th className="pb-2">Товар</th>
                              <th className="pb-2 text-right">Цена</th>
                              <th className="pb-2 text-right">Кол-во</th>
                              <th className="pb-2 text-right">Итого</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="py-3">{item.name}</td>
                                <td className="py-3 text-right">{item.price} ₽</td>
                                <td className="py-3 text-right">{item.quantity}</td>
                                <td className="py-3 text-right">{item.price * item.quantity} ₽</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gray-200">
                              <td colSpan={3} className="pt-3 text-right">Товары:</td>
                              <td className="pt-3 text-right">{selectedOrder.total - (selectedOrder.deliveryCost || 0)} ₽</td>
                            </tr>
                            {selectedOrder.deliveryCost && (
                              <tr>
                                <td colSpan={3} className="pt-1 text-right">Доставка:</td>
                                <td className="pt-1 text-right">{selectedOrder.deliveryCost} ₽</td>
                              </tr>
                            )}
                            <tr className="border-t border-gray-200 font-semibold">
                              <td colSpan={3} className="pt-3 text-right">Итого:</td>
                              <td className="pt-3 text-right">{selectedOrder.total} ₽</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      {/* Информация о доставке */}
                      {selectedOrder.shippingAddress && (
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Адрес доставки</h3>
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                            <p>{selectedOrder.shippingAddress.address}</p>
                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Способ оплаты и доставки */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOrder.paymentMethod && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Способ оплаты</h3>
                            <div className="p-4 bg-muted rounded-lg">
                              <p>{selectedOrder.paymentMethod === "card" ? "Банковская карта" : "Наличные при получении"}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedOrder.deliveryMethod && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Способ доставки</h3>
                            <div className="p-4 bg-muted rounded-lg">
                              <p>{selectedOrder.deliveryMethod === "express" ? "Экспресс-доставка" : "Стандартная доставка"}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t p-4">
                  <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                    Закрыть
                  </Button>
                  <Button onClick={() => {
                    handleRepeatOrder(selectedOrder);
                    setShowOrderDetails(false);
                  }}>
                    Повторить заказ
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}