import { Tags } from 'lucide-react';
import { useCategories } from '@/hooks/useProducts';

export default function Categories() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8">Categories</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="bg-background p-6 rounded-lg border border-border flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Tags className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">/{category.slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-8">
        Categories are pre-configured. Contact support to add new categories.
      </p>
    </div>
  );
}
