
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, UserPlus, HomeIcon, LogIn, Laptop, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (!session?.user) return '??';
    return `${session.user.firstName.charAt(0)}${session.user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300 animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-primary font-semibold text-xl tracking-tight">
              ClientBook
            </span>
          </div>
          
          <nav className="flex items-center space-x-1">
            <Link 
              to="/" 
              className={cn("nav-link flex items-center gap-1", isActive('/') && "active")}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Αρχική</span>
            </Link>
            
            {session?.user ? (
              <>
                <Link 
                  to="/clients" 
                  className={cn("nav-link flex items-center gap-1", isActive('/clients') && "active")}
                >
                  <Users className="h-4 w-4" />
                  <span>Πελάτες</span>
                </Link>
                
                <Link 
                  to="/clients/add" 
                  className={cn("nav-link flex items-center gap-1", isActive('/clients/add') && "active")}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Νέος Πελάτης</span>
                </Link>

                <Link 
                  to="/devices" 
                  className={cn("nav-link flex items-center gap-1", isActive('/devices') && "active")}
                >
                  <Laptop className="h-4 w-4" />
                  <span>Συσκευές</span>
                </Link>

                <Link 
                  to="/technical-reports" 
                  className={cn("nav-link flex items-center gap-1", isActive('/technical-reports') && "active")}
                >
                  <FileText className="h-4 w-4" />
                  <span>Τεχνικές Εκθέσεις</span>
                </Link>
                
                <div className="ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session.user.avatarUrl || ''} alt={`${session.user.firstName} ${session.user.lastName}`} />
                          <AvatarFallback>{getInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ο λογαριασμός μου</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Προφίλ</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Αποσύνδεση</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate('/auth')} className="ml-4">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Σύνδεση</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
