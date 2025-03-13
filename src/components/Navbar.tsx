
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
