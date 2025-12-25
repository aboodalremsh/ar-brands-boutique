import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Account() {
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-8">My Account</h1>

        <div className="bg-secondary p-6 rounded mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{profile?.email || user.email}</h2>
              {isAdmin && (
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
