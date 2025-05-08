import { Link } from "wouter";
import { useFilter } from "../contexts/FilterContext";

export default function FeaturedCategories() {
  const { setGender, setCategory } = useFilter();
  
  const handleCategoryClick = (gender: string) => {
    setGender(gender);
    setCategory('');
  };
  
  const handleAccessoriesClick = () => {
    setGender('all');
    setCategory('accessories');
  };
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Men's Category */}
        <div className="relative rounded-lg overflow-hidden h-60 group">
          <img 
            src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80" 
            alt="Men's fashion collection" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 w-full">
              <h3 className="text-white text-xl font-bold mb-2">Men's Collection</h3>
              <Link 
                href="/" 
                onClick={() => handleCategoryClick('men')}
                className="inline-block bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* Women's Category */}
        <div className="relative rounded-lg overflow-hidden h-60 group">
          <img 
            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80" 
            alt="Women's fashion collection" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 w-full">
              <h3 className="text-white text-xl font-bold mb-2">Women's Collection</h3>
              <Link 
                href="/" 
                onClick={() => handleCategoryClick('women')}
                className="inline-block bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* Accessories Category */}
        <div className="relative rounded-lg overflow-hidden h-60 group">
          <img 
            src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80" 
            alt="Fashion accessories collection" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 w-full">
              <h3 className="text-white text-xl font-bold mb-2">Accessories</h3>
              <Link 
                href="/" 
                onClick={handleAccessoriesClick}
                className="inline-block bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
