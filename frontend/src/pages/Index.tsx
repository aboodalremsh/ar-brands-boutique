import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts, useCategories } from '@/hooks/useProducts';

export default function Index() {
  const { data: featuredProducts, isLoading } = useProducts({ featured: true });
  const { data: categories } = useCategories();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-secondary min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="container relative z-20">
          <div className="max-w-xl animate-fade-up">
            <span className="inline-block text-accent font-medium uppercase tracking-widest text-sm mb-4">
              New Collection 2025
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6">
              Elegance Meets Modern Style
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our curated collection of premium fashion pieces designed for the modern individual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button size="xl" variant="hero">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/shop?category=new-arrivals">
                <Button size="xl" variant="hero-outline">
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Find your perfect style</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop' },
              { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1972&auto=format&fit=crop' },
              { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1980&auto=format&fit=crop' },
            ].map((category, index) => (
              <Link
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                className="group relative aspect-[3/4] overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-background mb-2">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center text-sm font-medium text-background/80 group-hover:text-gold transition-colors">
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked for you</p>
            </div>
            <Link to="/shop">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded" />
                  <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                  <div className="mt-2 h-4 bg-muted rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts?.slice(0, 4) || []} />
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Join Our Community</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Subscribe to get exclusive offers, early access to new arrivals, and style inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <Button variant="gold" size="lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
