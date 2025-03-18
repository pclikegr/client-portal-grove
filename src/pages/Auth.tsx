
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
    console.log('Auth component - Current session:', session);
    console.log('Auth component - Is loading:', isLoading);
    
    // Μόνο κάνουμε redirect όταν έχουμε session και δεν φορτώνουμε
    if (session?.user && !isLoading) {
      console.log('User is authenticated, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [session, isLoading, navigate]);

  return (
    <AuthCard>
      <AuthHeader authMethod={authMethod} />
      <AuthTabs authMethod={authMethod} setAuthMethod={setAuthMethod} />
    </AuthCard>
  );
};

export default Auth;
