import { useCart } from "../contexts/CartContext";
import { Link } from "wouter";
import { useFilter } from "../contexts/FilterContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { cartItems, removeFromCart, updateCartItemQuantity, cartTotal } = useCart();
  const { setGender } = useFilter();
  const { toast } = useToast();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  // Format price from cents to dollars
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };
  
  const handleRemoveItem = (cartItemId: number) => {
    removeFromCart(cartItemId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };
  
  const handleQuantityChange = (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    updateCartItemQuantity(cartItemId, quantity);
  };
  
  const handleCheckout = () => {
    setCheckoutLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase",
      });
      setCheckoutLoading(false);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-28 h-28 flex-shrink-0">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm mb-1">{item.product.description}</p>
                      <p className="text-gray-500 text-sm mb-2">Size: {item.size}</p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button 
                            className="text-gray-500 hover:text-secondary"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              
              <button 
                className={`w-full py-3 rounded-lg font-medium text-white transition-colors duration-200 ${
                  checkoutLoading ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'
                }`}
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Processing...
                  </span>
                ) : 'Proceed to Checkout'}
              </button>
              
              <Link 
                href="/" 
                onClick={() => setGender('all')}
                className="block text-center mt-4 text-accent hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="mb-4 text-gray-400">
            <i className="fas fa-shopping-bag text-6xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add items to your cart to proceed with checkout</p>
          <Link 
            href="/" 
            onClick={() => setGender('all')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
