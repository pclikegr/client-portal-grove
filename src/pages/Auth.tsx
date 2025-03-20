
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthCard from '@/components/auth/AuthCard';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthTabs from '@/components/auth/AuthTabs';
import { Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<'login' | 'register'>('login');
  const { session, isLoading, initialCheckDone } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
  
  useEffect(() => {
    console.log('Auth component - Current session state:', {
      session: session,
      isLoading: isLoading,
      hasUser: Boolean(session?.user),
      authenticatedUser: session?.user?.id,
      returnTo,
      initialCheckDone
    });
    
    // Only redirect when we have a session and we're not loading
    if (session?.user && !isLoading) {
      console.log('User is authenticated, redirecting to:', returnTo);
      navigate(returnTo, { replace: true });
    }
  }, [session, isLoading, navigate, returnTo, initialCheckDone]);

  // Display login form after a short timeout if still loading
  // This prevents being stuck on the loading screen
  const [forceShowForm, setForceShowForm] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceShowForm(true);
    }, 3000); // Show form after 3 seconds even if still loading
    
    return () => clearTimeout(timer);
  }, []);

  // Show login form either if initial check is done or after timeout
  if (!forceShowForm && isLoading && !initialCheckDone) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p>Έλεγχος συνεδρίας...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthCard>
      <AuthHeader authMethod={authMethod} />
      <AuthTabs authMethod={authMethod} setAuthMethod={setAuthMethod} />
    </AuthCard>
  );
};

export default Auth;
