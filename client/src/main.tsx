import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { FilterProvider } from "./contexts/FilterContext";

createRoot(document.getElementById("root")!).render(
  <FilterProvider>
    <FavoritesProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </FavoritesProvider>
  </FilterProvider>
);
