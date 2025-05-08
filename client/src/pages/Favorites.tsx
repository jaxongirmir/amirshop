import { useFavorites } from "../contexts/FavoritesContext";
import ProductCard from "../components/ProductCard";
import { Link } from "wouter";
import { useFilter } from "../contexts/FilterContext";

export default function Favorites() {
  const { favorites, favoriteProducts } = useFavorites();
  const { setGender } = useFilter();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="mb-4 text-gray-400">
            <i className="far fa-heart text-6xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your favorites list is empty</h2>
          <p className="text-gray-500 mb-8">Add items to your favorites to save them for later</p>
          <Link 
            href="/" 
            onClick={() => setGender('all')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
