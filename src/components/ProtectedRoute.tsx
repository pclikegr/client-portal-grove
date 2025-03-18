
import React, { useEffect } from 'react';
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

  useEffect(() => {
    const checkAuth = () => {
      if (!isLoading) {
        if (!session) {
          console.log('No session, redirecting to auth');
          navigate('/auth', { replace: true });
        } else if (session?.user && !allowedRoles.includes(session.user.role as 'user' | 'admin')) {
          console.log('User not authorized, redirecting to home');
          navigate('/', { replace: true });
        } else {
          console.log('User is authenticated and authorized');
        }
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

  if (!session) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
