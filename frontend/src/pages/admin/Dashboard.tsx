import { Package, Tags, TrendingUp } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';

export default function Dashboard() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();

  const stats = [
    {
      name: 'Total Products',
      value: products?.length || 0,
      icon: Package,
    },
    {
      name: 'Categories',
      value: categories?.length || 0,
      icon: Tags,
    },
    {
      name: 'Featured Products',
      value: products?.filter(p => p.is_featured).length || 0,
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-background p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-accent" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-background p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/admin/products"
            className="p-4 border border-border rounded hover:border-accent transition-colors"
          >
            <Package className="h-6 w-6 mb-2 text-accent" />
            <h3 className="font-medium">Manage Products</h3>
            <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
          </a>
          <a
            href="/admin/categories"
            className="p-4 border border-border rounded hover:border-accent transition-colors"
          >
            <Tags className="h-6 w-6 mb-2 text-accent" />
            <h3 className="font-medium">Manage Categories</h3>
            <p className="text-sm text-muted-foreground">Organize your product catalog</p>
          </a>
        </div>
      </div>
    </div>
  );
}
