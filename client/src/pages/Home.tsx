import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useFilter } from "../contexts/FilterContext";
import HeroSection from "../components/HeroSection";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import FeaturedCategories from "../components/FeaturedCategories";
import Newsletter from "../components/Newsletter";
import { Product } from "@shared/schema";

export default function Home() {
  const [location] = useLocation();
  const { gender, category, sortBy, setSearchQuery } = useFilter();

  // Parse search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearchQuery(searchQuery);
    } else {
      setSearchQuery("");
    }
  }, [location, setSearchQuery]);

  // Fetch products with filters
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products/filter", gender, category, sortBy],
    queryFn: async ({ queryKey }) => {
      const [_, gender, category] = queryKey as string[];

      // Construct the filter URL
      let url = "/api/products/filter?";
      if (gender && gender !== "all") url += `gender=${gender}&`;
      if (category) url += `category=${category}&`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");

      let data = await res.json();

      // Apply client-side sorting
      if (sortBy === "price-low") {
        data = data.sort((a: Product, b: Product) => a.price - b.price);
      } else if (sortBy === "price-high") {
        data = data.sort((a: Product, b: Product) => b.price - a.price);
      } else if (sortBy === "newest") {
        // In a real app, you'd sort by date
        // Here we're just reversing the array to simulate "newest"
        data = data.reverse();
      }
      // 'popular' is the default, no sorting needed

      return data;
    },
  });

  // Search products
  const { data: searchResults = [] } = useQuery({
    queryKey: ["/api/products/search", useFilter().searchQuery],
    queryFn: async ({ queryKey }) => {
      const [_, query] = queryKey as string[];
      if (!query) return [];

      const res = await fetch(
        `/api/products/search?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to search products");

      return await res.json();
    },
    enabled: !!useFilter().searchQuery,
  });

  // Determine which products to display - search results or filtered products
  const displayProducts = useFilter().searchQuery ? searchResults : products;

  return (
    <div className="container mx-auto px-4 py-8">
      {!useFilter().searchQuery && <HeroSection />}

      <CategoryFilter />

      <section className="mb-12">
        {useFilter().searchQuery && (
          <h2 className="text-2xl font-bold mb-6">
            Search Results for "{useFilter().searchQuery}"
          </h2>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md h-[500px] animate-pulse"
              >
                <div className="bg-gray-200 h-80 w-full"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 w-10 bg-gray-200 rounded-lg"
                      ></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try different filters or search terms
            </p>
          </div>
        )}

        {/* {!useFilter().searchQuery && displayProducts.length > 0 && (
          <div className="flex justify-center mt-10">
            <button className="bg-white border border-gray-300 text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
              Load More Products
            </button>
          </div>
        )} */}
      </section>

      {!useFilter().searchQuery && (
        <>
          <FeaturedCategories />
          <Newsletter />
        </>
      )}
    </div>
  );
}
