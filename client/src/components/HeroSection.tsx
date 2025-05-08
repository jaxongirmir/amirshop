import { Link } from "wouter";
import { useFilter } from "../contexts/FilterContext";

export default function HeroSection() {
  const { setGender } = useFilter();
  
  const handleShopWomen = () => {
    setGender('women');
  };
  
  const handleShopMen = () => {
    setGender('men');
  };
  
  return (
    <section className="mb-12">
      <div className="relative h-96 rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80" 
          alt="Fashion collection banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="text-white p-8 max-w-lg">
            <h1 className="text-4xl font-bold mb-4">New Summer Collection</h1>
            <p className="text-lg mb-6">Discover the latest trends for the upcoming season. Find your perfect style with our exclusive pieces.</p>
            <div className="flex space-x-4">
              <Link 
                href="/" 
                onClick={handleShopWomen}
                className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Shop Women
              </Link>
              <Link 
                href="/" 
                onClick={handleShopMen}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
              >
                Shop Men
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
