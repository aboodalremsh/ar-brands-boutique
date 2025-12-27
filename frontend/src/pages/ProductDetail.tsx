import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-muted animate-pulse rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors?.length && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success('Added to cart');
  };

  const images = product.images?.length ? product.images : ['/placeholder.svg'];

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-secondary overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'w-20 h-20 shrink-0 overflow-hidden border-2 transition-colors',
                      selectedImage === index ? 'border-accent' : 'border-transparent'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="animate-fade-up">
            {product.category && (
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-medium mb-6">${product.price.toFixed(2)}</p>

            {product.description && (
              <p className="text-muted-foreground mb-8">{product.description}</p>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold uppercase tracking-wider text-sm mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-12 h-10 px-4 border transition-colors',
                        selectedSize === size
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold uppercase tracking-wider text-sm mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-4 py-2 border transition-colors capitalize',
                        selectedColor === color
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold uppercase tracking-wider text-sm mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="xl"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.is_available}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {product.is_available ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
