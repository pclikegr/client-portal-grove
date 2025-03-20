
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && !session) {
      // User is not logged in, redirect to auth page
      const returnTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth?returnTo=${returnTo}`);
    } else if (!isLoading && session && allowedRoles && !allowedRoles.includes(session.user?.role || 'user')) {
      // User is logged in but doesn't have the required role
      navigate('/');
    }
  }, [session, isLoading, navigate, location, allowedRoles]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!session) {
    // This will show briefly before redirect happens
    return null;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
