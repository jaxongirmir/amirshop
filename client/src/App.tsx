import { Switch, Route, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Cart from "@/pages/Cart";
import Favorites from "@/pages/Favorites";
import Notifications from "@/pages/Notifications";
import Product from "@/pages/Product";
import AuthPage from "@/pages/auth-page";
import Checkout from "@/pages/Checkout";
import Profile from "@/pages/profile";
import Orders from "@/pages/orders";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { FilterProvider } from "./contexts/FilterContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  const [location] = useLocation();
  
  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/product/:id" component={Product} />
          <Route path="/auth" component={AuthPage} />
          
          {/* Protected routes */}
          <ProtectedRoute path="/cart" component={Cart} />
          <ProtectedRoute path="/checkout" component={Checkout} />
          <ProtectedRoute path="/favorites" component={Favorites} />
          <ProtectedRoute path="/notifications" component={Notifications} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/orders" component={Orders} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <FilterProvider>
          <CartProvider>
            <FavoritesProvider>
              <Router />
            </FavoritesProvider>
          </CartProvider>
        </FilterProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
