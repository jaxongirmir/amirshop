import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Edit, 
  Save,
  Clock,
  Heart,
  ShoppingBag,
  Star,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { favorites } = useFavorites();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Россия",
    bio: "",
    notifications: true
  });
  
  // Initialize form with user data when user loads
  useState(() => {
    if (user) {
      setFormData({
        ...formData,
        username: user.username
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      notifications: checked
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные успешно сохранены",
    });
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
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Профиль
              </Button>
              <Button 
                variant={activeTab === "addresses" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("addresses")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Адреса доставки
              </Button>
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
          {activeTab === "profile" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Личная информация</CardTitle>
                  <CardDescription>Управление вашими персональными данными</CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Редактировать
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Имя пользователя</Label>
                        {isEditing ? (
                          <Input 
                            id="username" 
                            name="username"
                            value={formData.username} 
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{user.username}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Полное имя</Label>
                        {isEditing ? (
                          <Input 
                            id="fullName" 
                            name="fullName"
                            value={formData.fullName} 
                            onChange={handleInputChange}
                            placeholder="Иванов Иван Иванович"
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{formData.fullName || "Не указано"}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Электронная почта</Label>
                        {isEditing ? (
                          <Input 
                            id="email" 
                            name="email"
                            type="email"
                            value={formData.email} 
                            onChange={handleInputChange}
                            placeholder="example@mail.ru"
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{formData.email || "Не указано"}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Номер телефона</Label>
                        {isEditing ? (
                          <Input 
                            id="phone" 
                            name="phone"
                            value={formData.phone} 
                            onChange={handleInputChange}
                            placeholder="+7 (999) 123-45-67"
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{formData.phone || "Не указано"}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">О себе</Label>
                      {isEditing ? (
                        <Textarea 
                          id="bio" 
                          name="bio"
                          value={formData.bio} 
                          onChange={handleInputChange}
                          placeholder="Расскажите немного о себе..."
                          rows={4}
                        />
                      ) : (
                        <div className="p-2 border rounded-md h-24 overflow-auto">
                          {formData.bio || "Не указано"}
                        </div>
                      )}
                    </div>
                    

                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-gray-500">
                  <Clock className="inline-block mr-1 h-4 w-4" />
                  Регистрация: {new Date().toLocaleDateString('ru-RU')}
                </div>
                {isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Отмена
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
          
          {activeTab === "addresses" && (
            <Card>
              <CardHeader>
                <CardTitle>Адреса доставки</CardTitle>
                <CardDescription>Управление адресами для доставки</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Address Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Основной адрес</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Адрес</Label>
                        {isEditing ? (
                          <Input 
                            id="address" 
                            name="address"
                            value={formData.address} 
                            onChange={handleInputChange}
                            placeholder="ул. Пушкина, д. 10, кв. 5"
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{formData.address || "Не указано"}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">Город</Label>
                        {isEditing ? (
                          <Input 
                            id="city" 
                            name="city"
                            value={formData.city} 
                            onChange={handleInputChange}
                            placeholder="Москва"
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{formData.city || "Не указано"}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Почтовый индекс</Label>
                        {isEditing ? (
                          <Input 
                            id="postalCode" 
                            name="postalCode"
                            value={formData.postalCode} 
                            onChange={handleInputChange}
                            placeholder="123456"
                          />
                        ) : (
                          <div className="p-2 border rounded-md">{formData.postalCode || "Не указано"}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Страна</Label>
                        {isEditing ? (
                          <Select
                            value={formData.country}
                            onValueChange={(value) => handleSelectChange("country", value)}
                          >
                            <SelectTrigger id="country">
                              <SelectValue placeholder="Выберите страну" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Россия">Россия</SelectItem>
                              <SelectItem value="Беларусь">Беларусь</SelectItem>
                              <SelectItem value="Казахстан">Казахстан</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 border rounded-md">{formData.country}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button variant="outline" className="w-full">
                      <MapPin className="mr-2 h-4 w-4" />
                      Добавить новый адрес
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {isEditing && (
                  <Button onClick={handleSave} className="ml-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить изменения
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Избранное</p>
              <p className="text-2xl font-bold">{favorites.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Заказы</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Отзывы</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Потрачено</p>
              <p className="text-2xl font-bold">₽12,500</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}