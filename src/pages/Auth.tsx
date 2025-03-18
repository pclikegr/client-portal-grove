
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthCard from '@/components/auth/AuthCard';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthTabs from '@/components/auth/AuthTabs';

const Auth: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<'login' | 'register'>('login');
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Auth component - Current session state:', {
      session: session,
      isLoading: isLoading,
      hasUser: Boolean(session?.user),
      authenticatedUser: session?.user?.id
    });
    
    // Only redirect when we have a session and we're not loading
    if (session?.user && !isLoading) {
      console.log('User is authenticated, redirecting to home page');
      navigate('/', { replace: true });
    }
  }, [session, isLoading, navigate]);

  // If we're still loading, show some feedback
  if (isLoading) {
    console.log('Auth page - Loading session data...');
  }

  return (
    <AuthCard>
      <AuthHeader authMethod={authMethod} />
      <AuthTabs authMethod={authMethod} setAuthMethod={setAuthMethod} />
    </AuthCard>
  );
};

export default Auth;
