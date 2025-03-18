
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['user', 'admin'] 
}) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      // Add detailed logging for debugging
      console.log('ProtectedRoute - Auth state:', { 
        session, 
        isLoading, 
        hasSession: Boolean(session),
        hasUser: Boolean(session?.user),
        userRole: session?.user?.role
      });
      
      if (!isLoading) {
        if (!session || !session.user) {
          console.log('No session, redirecting to auth');
          navigate('/auth', { replace: true });
          setIsAuthorized(false);
          return;
        }
        
        if (!allowedRoles.includes(session.user.role)) {
          console.log('User not authorized, redirecting to home. Role:', session.user.role, 'Allowed roles:', allowedRoles);
          navigate('/', { replace: true });
          setIsAuthorized(false);
          return;
        }
        
        console.log('User is authenticated and authorized:', session.user);
        setIsAuthorized(true);
      }
    };
    
    checkAuth();
  }, [session, isLoading, navigate, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render children until we're sure authorization is complete
  if (isAuthorized === null || isAuthorized === false) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
