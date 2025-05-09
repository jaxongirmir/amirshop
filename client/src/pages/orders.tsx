import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, CheckCircle, Clock, ShoppingBag } from "lucide-react";

export default function Orders() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

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

  // На данный момент у нас нет реальных заказов, поэтому создадим демо-данные
  const demoOrders = [
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
  ];

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

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">История заказов</h1>
      
      {demoOrders.length > 0 ? (
        <div className="space-y-6">
          {demoOrders.map((order) => (
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
                    <Button variant="outline" className="mr-2">
                      Детали заказа
                    </Button>
                    <Button>
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
    </div>
  );
}