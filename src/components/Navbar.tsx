
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { session, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Αποσυνδεθήκατε με επιτυχία');
    } catch (error) {
      toast.error('Παρουσιάστηκε πρόβλημα κατά την αποσύνδεση');
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">ClientBook</span>
          </Link>
          {session && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/clients"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/clients') || location.pathname.startsWith('/clients/') ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Πελάτες
              </Link>
              <Link
                to="/devices"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/devices') || location.pathname.startsWith('/devices/') ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Συσκευές
              </Link>
              <Link
                to="/technical-reports"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/technical-reports') || location.pathname.startsWith('/technical-reports/') ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Τεχνικές Εκθέσεις
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {session ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="outline" size="icon" title="Προφίλ">
                  <User className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={handleSignOut} title="Αποσύνδεση">
                <LogOut className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </div>
          ) : (
            location.pathname !== '/auth' && (
              <Link to="/auth">
                <Button>Σύνδεση</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
