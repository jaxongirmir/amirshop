import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Имя пользователя обязательно"),
  password: z.string().min(1, "Пароль обязателен"),
});

// Registration schema
const registerSchema = z.object({
  username: z.string().min(3, "Имя пользователя должно содержать не менее 3 символов"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
  confirmPassword: z.string().min(1, "Пожалуйста, подтвердите пароль"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type LoginInputs = z.infer<typeof loginSchema>;
type RegisterInputs = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // If user is already logged in, redirect to home page
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const loginForm = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginInputs) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в FashionZone!",
        });
        navigate("/");
      },
      onError: (error) => {
        toast({
          title: "Ошибка входа",
          description: error.message || "Неверное имя пользователя или пароль",
          variant: "destructive",
        });
      }
    });
  };

  // Handle registration submission
  const onRegisterSubmit = (data: RegisterInputs) => {
    // Remove confirmPassword before submitting
    const { confirmPassword, ...registerData } = data;

    registerMutation.mutate(registerData, {
      onSuccess: () => {
        toast({
          title: "Регистрация прошла успешно",
          description: "Ваш аккаунт создан, и вы вошли в систему",
        });
        navigate("/");
      },
      onError: (error) => {
        toast({
          title: "Ошибка регистрации",
          description: error.message || "Не удалось создать аккаунт. Попробуйте другое имя пользователя.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Auth Form */}
        <div className="w-full lg:w-1/2">
          <Tabs defaultValue="login" className="w-full max-w-md mx-auto" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Вход в аккаунт</CardTitle>
                  <CardDescription>
                    Введите свои данные для входа в личный кабинет
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Имя пользователя</Label>
                        <Input
                          id="username"
                          placeholder="demo"
                          {...loginForm.register("username")}
                        />
                        {loginForm.formState.errors.username && (
                          <p className="text-sm text-destructive">
                            {loginForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          {...loginForm.register("password")}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-destructive">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Вход...
                          </>
                        ) : "Войти"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground text-center w-full">
                    Нет аккаунта?{" "}
                    <button 
                      type="button" 
                      className="underline text-primary"
                      onClick={() => setActiveTab("register")}
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Создать аккаунт</CardTitle>
                  <CardDescription>
                    Зарегистрируйтесь, чтобы сохранять товары в избранное и делать покупки
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Имя пользователя</Label>
                        <Input
                          id="username"
                          placeholder="johndoe"
                          {...registerForm.register("username")}
                        />
                        {registerForm.formState.errors.username && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          {...registerForm.register("password")}
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          {...registerForm.register("confirmPassword")}
                        />
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Регистрация...
                          </>
                        ) : "Зарегистрироваться"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground text-center w-full">
                    Уже есть аккаунт?{" "}
                    <button 
                      type="button" 
                      className="underline text-primary"
                      onClick={() => setActiveTab("login")}
                    >
                      Войти
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Hero Section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-8 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-4">Добро пожаловать в AmirHub</h1>
            <p className="text-gray-700 mb-6">
              Создайте аккаунт, чтобы получить доступ к эксклюзивным предложениям, отслеживать статус заказов и сохранять товары в избранное.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary">Избранное</h3>
                <p className="text-sm text-gray-600">Сохраняйте любимые товары для будущих покупок</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary">История заказов</h3>
                <p className="text-sm text-gray-600">Просматривайте и отслеживайте ваши заказы</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary">Быстрый чекаут</h3>
                <p className="text-sm text-gray-600">Сохраните данные для быстрого оформления заказа</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary">Специальные предложения</h3>
                <p className="text-sm text-gray-600">Получайте эксклюзивные скидки и промо-коды</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Присоединяйтесь к тысячам довольных клиентов AmirHub и наслаждайтесь удобством покупок онлайн.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}