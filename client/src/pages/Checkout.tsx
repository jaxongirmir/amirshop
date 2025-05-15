import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CreditCard, Banknote, Truck, ArrowLeft, CheckCircle } from "lucide-react";

// Checkout form schema
const checkoutSchema = z.object({
  fullName: z.string().min(1, "Имя и фамилия обязательны"),
  email: z.string().email("Введите действительный email адрес"),
  phone: z.string().min(10, "Введите действительный номер телефона"),
  address: z.string().min(1, "Адрес обязателен"),
  city: z.string().min(1, "Город обязателен"),
  postalCode: z.string().min(1, "Почтовый индекс обязателен"),
  paymentMethod: z.enum(["card", "cash"]),
  deliveryMethod: z.enum(["standard", "express"]),
  notes: z.string().optional(),
});

type CheckoutInputs = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { cartItems, cartTotal, removeFromCart } = useCart();

  // Format price from cents to dollars
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  // Delivery cost
  const [deliveryCost, setDeliveryCost] = useState(0);
  const totalWithDelivery = cartTotal + deliveryCost;

  // Form setup
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutInputs>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "card",
      deliveryMethod: "standard",
      notes: "",
    },
  });

  // Watch delivery method to update cost
  const deliveryMethod = watch("deliveryMethod");
  
  // Update delivery cost when method changes
  useState(() => {
    if (deliveryMethod === "standard") {
      setDeliveryCost(499); // $4.99
    } else {
      setDeliveryCost(999); // $9.99
    }
  });

  // Process order
  const onSubmit = (data: CheckoutInputs) => {
    setIsSubmitting(true);
    
    // Генерируем уникальный ID заказа
    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toLocaleDateString('ru-RU');
    
    // Создаем объект заказа
    const order = {
      id: orderId,
      date: orderDate,
      status: "В обработке",
      items: cartItems.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      total: cartTotal + deliveryCost,
      deliveryCost,
      shippingAddress: {
        fullName: data.fullName,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
      },
      paymentMethod: data.paymentMethod,
      deliveryMethod: data.deliveryMethod,
      notes: data.notes,
    };
    
    // Сохраняем заказ в localStorage
    try {
      // Получаем существующие заказы
      const existingOrdersJson = localStorage.getItem('orderHistory');
      let orders = [];
      if (existingOrdersJson) {
        orders = JSON.parse(existingOrdersJson);
      }
      
      // Добавляем новый заказ
      orders.push(order);
      
      // Сохраняем обратно в localStorage
      localStorage.setItem('orderHistory', JSON.stringify(orders));
      
      // Очищаем корзину
      // Т.к. работа с API реальной корзины требует отдельного функционала, 
      // для демо-целей просто показываем сообщение
      
      console.log('Order submitted', order);
      
      setIsSubmitting(false);
      setIsOrderComplete(true);
      
      toast({
        title: "Заказ оформлен!",
        description: "Ваш заказ успешно оформлен и будет отправлен в ближайшее время.",
      });
    } catch (error) {
      console.error('Ошибка при сохранении заказа:', error);
      
      setIsSubmitting(false);
      
      toast({
        title: "Ошибка!",
        description: "Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.",
        variant: "destructive"
      });
    }
  };

  // If cart is empty, redirect to cart page
  if (cartItems.length === 0 && !isOrderComplete) {
    navigate("/cart");
    return null;
  }

  if (isOrderComplete) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Спасибо за ваш заказ!</h1>
          <p className="text-gray-600 mb-6">
            Ваш заказ был успешно оформлен и будет доставлен в ближайшее время.
            Мы отправили подтверждение на ваш email.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h2 className="font-medium mb-2">Номер заказа: #FZ{Math.floor(Math.random() * 10000)}</h2>
            <p className="text-sm text-muted-foreground">Сохраните этот номер для отслеживания заказа</p>
          </div>
          <Button 
            size="lg" 
            onClick={() => navigate("/")}
          >
            Продолжить покупки
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Назад к корзине
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Оформление заказа</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Личная информация</CardTitle>
                <CardDescription>Введите данные для доставки</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Имя и фамилия</Label>
                    <Input id="fullName" {...register("fullName")} />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" type="tel" {...register("phone")} />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Адрес доставки</CardTitle>
                <CardDescription>Укажите адрес для доставки заказа</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес</Label>
                  <Input id="address" {...register("address")} />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Почтовый индекс</Label>
                    <Input id="postalCode" {...register("postalCode")} />
                    {errors.postalCode && (
                      <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Способ оплаты</CardTitle>
                <CardDescription>Выберите удобный способ оплаты</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card" className="space-y-4" {...register("paymentMethod")}>
                  <div className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label 
                      htmlFor="card" 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                    >
                      <CreditCard className="h-5 w-5 text-primary/80" />
                      <div>
                        <p className="font-medium">Банковская карта</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, Mir</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label 
                      htmlFor="cash" 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                    >
                      <Banknote className="h-5 w-5 text-primary/80" />
                      <div>
                        <p className="font-medium">Наличными при получении</p>
                        <p className="text-sm text-muted-foreground">Оплата курьеру или в пункте выдачи</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Способ доставки</CardTitle>
                <CardDescription>Выберите способ доставки заказа</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="standard" className="space-y-4" {...register("deliveryMethod")}>
                  <div className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label 
                      htmlFor="standard" 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                    >
                      <Truck className="h-5 w-5 text-primary/80" />
                      <div className="flex-1">
                        <p className="font-medium">Стандартная доставка</p>
                        <p className="text-sm text-muted-foreground">3-5 рабочих дней</p>
                      </div>
                      <span className="font-medium">$4.99</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors">
                    <RadioGroupItem value="express" id="express" />
                    <Label 
                      htmlFor="express" 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                    >
                      <Truck className="h-5 w-5 text-primary/80" />
                      <div className="flex-1">
                        <p className="font-medium">Экспресс-доставка</p>
                        <p className="text-sm text-muted-foreground">1-2 рабочих дня</p>
                      </div>
                      <span className="font-medium">$9.99</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Дополнительная информация</CardTitle>
                <CardDescription>Необязательно</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Комментарий к заказу</Label>
                  <Textarea id="notes" rows={3} {...register("notes")} />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Ваш заказ</CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? 'товар' : cartItems.length < 5 ? 'товара' : 'товаров'} в корзине
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Product list */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            Размер: {item.size} | Кол-во: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Price summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Сумма заказа</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span>{formatPrice(deliveryCost)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Итого</span>
                    <span>{formatPrice(totalWithDelivery)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Оформление...
                  </>
                ) : (
                  <>
                    Оформить заказ
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}