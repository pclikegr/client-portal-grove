
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
    // Only redirect if we're not loading and there's no session
    if (!isLoading && !session) {
      console.log('User not authenticated, redirecting to auth page');
      const returnTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth?returnTo=${returnTo}`, { replace: true });
    } else if (!isLoading && session && allowedRoles && !allowedRoles.includes(session.user?.role || 'user')) {
      // User is logged in but doesn't have the required role
      console.log('User does not have required role, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [session, isLoading, navigate, location, allowedRoles]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Έλεγχος συνεδρίας...</p>
        </div>
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
