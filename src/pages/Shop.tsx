import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const categorySlug = searchParams.get('category');
  const { data: categories } = useCategories();
  const selectedCategory = categories?.find(c => c.slug === categorySlug);

  const { data: products, isLoading } = useProducts({
    categoryId: selectedCategory?.id,
    search: search || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
  });

  const handleCategoryClick = (slug: string | null) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearch('');
    setPriceRange([0, 1000]);
    setSearchParams({});
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">
            {selectedCategory ? selectedCategory.name : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {products?.length || 0} products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop Sidebar */}
          <aside className={cn(
            'lg:w-64 shrink-0',
            'fixed lg:static inset-0 z-50 bg-background lg:bg-transparent p-6 lg:p-0',
            'transition-transform duration-300 lg:transform-none',
            showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-8">
              <h3 className="font-semibold uppercase tracking-wider text-sm mb-4">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold uppercase tracking-wider text-sm mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={cn(
                    'block w-full text-left py-2 px-3 rounded transition-colors',
                    !categorySlug ? 'bg-secondary font-medium' : 'hover:bg-secondary/50'
                  )}
                >
                  All Products
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={cn(
                      'block w-full text-left py-2 px-3 rounded transition-colors',
                      categorySlug === category.slug ? 'bg-secondary font-medium' : 'hover:bg-secondary/50'
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-semibold uppercase tracking-wider text-sm mb-4">Price Range</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0] || ''}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1] === 1000 ? '' : priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 1000])}
                  className="w-20"
                />
              </div>
            </div>

            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded" />
                    <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                    <div className="mt-2 h-4 bg-muted rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={products || []} columns={3} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </Layout>
  );
}
