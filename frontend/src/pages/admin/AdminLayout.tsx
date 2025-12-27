import { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
];

export default function AdminLayout() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border p-6 hidden lg:block">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Store</span>
          </Link>
          <h1 className="text-xl font-serif font-bold">
            AR <span className="text-gradient-gold">Brands</span>
          </h1>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded transition-colors',
                location.pathname === item.href
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif font-bold">AR Brands Admin</h1>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Store
            </Button>
          </Link>
        </div>
        <nav className="flex gap-2 mt-4 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded text-sm whitespace-nowrap transition-colors',
                location.pathname === item.href
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
