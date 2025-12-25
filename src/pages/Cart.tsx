import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderDetails = items.map(item => {
      let details = `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`;
      if (item.selectedSize) details += ` (Size: ${item.selectedSize})`;
      if (item.selectedColor) details += ` (Color: ${item.selectedColor})`;
      return details;
    }).join('\n');

    const message = encodeURIComponent(
      `🛍️ *New Order from AR Brands*\n\n` +
      `*Order Details:*\n${orderDetails}\n\n` +
      `*Total: $${totalPrice.toFixed(2)}*\n\n` +
      `Please confirm my order. Thank you!`
    );

    // Replace with your WhatsApp number
    const whatsappNumber = '1234567890';
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    
    clearCart();
    toast.success('Order sent! Check WhatsApp to complete your purchase.');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/shop">
            <Button size="lg">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 p-4 bg-secondary rounded animate-fade-in"
              >
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-24 h-32 object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-medium hover:text-accent transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                  {item.selectedSize && (
                    <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                  )}
                  {item.selectedColor && (
                    <p className="text-sm text-muted-foreground">Color: {item.selectedColor}</p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary p-6 rounded sticky top-24">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-accent">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                size="lg"
                variant="gold"
                className="w-full"
                onClick={handleWhatsAppCheckout}
              >
                Checkout via WhatsApp
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Complete your order via WhatsApp for a personalized shopping experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
