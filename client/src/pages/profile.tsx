import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Profile() {
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
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Профиль пользователя</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
            <CardDescription>Ваши персональные данные</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Имя пользователя</h3>
                <p className="text-lg font-medium">{user.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Дата регистрации</h3>
                <p className="text-lg font-medium">
                  {new Date().toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
            <CardDescription>Информация о вашей активности</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Товаров в избранном</h3>
                <p className="text-lg font-medium">0</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Заказов выполнено</h3>
                <p className="text-lg font-medium">0</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Отзывов оставлено</h3>
                <p className="text-lg font-medium">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Настройки</CardTitle>
            <CardDescription>Настройки вашего аккаунта</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Язык</h3>
                <p className="text-lg font-medium">Русский</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Валюта</h3>
                <p className="text-lg font-medium">RUB ₽</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Тема</h3>
                <p className="text-lg font-medium">Светлая</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}