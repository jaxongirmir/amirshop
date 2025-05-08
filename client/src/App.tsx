import { Switch, Route, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Cart from "@/pages/Cart";
import Favorites from "@/pages/Favorites";
import Notifications from "@/pages/Notifications";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { FilterProvider } from "./contexts/FilterContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";

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
          <Route path="/cart" component={Cart} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/notifications" component={Notifications} />
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
      <FilterProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router />
          </FavoritesProvider>
        </CartProvider>
      </FilterProvider>
    </TooltipProvider>
  );
}

export default App;
