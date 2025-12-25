import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-serif font-bold mb-4">
              AR <span className="text-gold">Brands</span>
            </h2>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Elevating your style with premium fashion that speaks sophistication.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-sm mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/shop?category=men" className="hover:text-primary-foreground transition-colors">Men</Link></li>
              <li><Link to="/shop?category=women" className="hover:text-primary-foreground transition-colors">Women</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-primary-foreground transition-colors">Accessories</Link></li>
              <li><Link to="/shop?category=new-arrivals" className="hover:text-primary-foreground transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-sm mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-sm mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>info@arbrands.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Mon - Sat: 9AM - 6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} AR Brands. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
