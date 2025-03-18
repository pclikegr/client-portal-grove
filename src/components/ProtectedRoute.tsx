
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
}

// Simplified ProtectedRoute that always grants access
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children 
}) => {
  console.log('ProtectedRoute - Always granting access for testing');
  
  // Just render the children without authentication
  return <>{children}</>;
};

export default ProtectedRoute;
