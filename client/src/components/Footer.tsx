import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="footer mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">FashionZone</h3>
            <p className="text-gray-300 mb-4">Your one-stop destination for the latest fashion trends and styles.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Men's Fashion</Link></li>
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Women's Fashion</Link></li>
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Accessories</Link></li>
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">New Arrivals</Link></li>
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">FAQs</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Size Guide</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Track Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Our Story</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 FashionZone. All rights reserved.</p>
          <div className="flex space-x-4">
            <img src="https://via.placeholder.com/120x40/2D3748/FFFFFF?text=Payment+Methods" alt="Payment methods" className="h-10 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
}
