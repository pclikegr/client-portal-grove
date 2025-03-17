
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
    if (!isLoading && !session) {
      navigate('/auth');
    } else if (!isLoading && session?.user && !allowedRoles.includes(session.user.role as 'user' | 'admin')) {
      navigate('/');
    }
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
