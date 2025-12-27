import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const imageUrl = product.images?.[0] || '/placeholder.svg';

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        'group block animate-fade-up',
        className
      )}
    >
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 text-xs font-medium uppercase tracking-wider">
            Featured
          </span>
        )}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
