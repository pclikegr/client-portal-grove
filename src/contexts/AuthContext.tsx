
import React, { createContext, useContext } from 'react';
import { AuthContextType, Session, UserProfile } from '@/types/auth';
import { useAuthSession } from '@/hooks/useAuthSession';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  signInWithOAuthProvider,
  updateUserProfile 
} from '@/utils/authUtils';

const initialSession: Session = { user: null, accessToken: null };

export const AuthContext = createContext<AuthContextType>({
  session: initialSession,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading, setSession } = useAuthSession();

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: signIn called with email:', email);
    const result = await signInWithEmail(email, password);
    console.log('AuthContext: signIn result:', result);
    return result;
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('AuthContext: signUp called with email:', email);
    return signUpWithEmail(email, password, firstName, lastName);
  };

  const signOut = async () => {
    console.log('AuthContext: signOut called');
    const { error } = await signOutUser();
    if (!error) {
      setSession(null);
    }
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook' | 'github') => {
    console.log('AuthContext: signInWithOAuth called with provider:', provider);
    return signInWithOAuthProvider(provider);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!session?.user) {
      return { error: new Error('Δεν υπάρχει συνδεδεμένος χρήστης') };
    }

    const { error } = await updateUserProfile(session.user.id, data);
    
    if (!error) {
      setSession((prevSession) => {
        if (!prevSession) return prevSession;
        return {
          ...prevSession,
          user: {
            ...prevSession.user!,
            ...data,
          },
        };
      });
    }

    return { error };
  };

  const value: AuthContextType = {
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    signInWithOAuth,
  };

  console.log('AuthContext rendering with session:', session?.user?.id, 'isLoading:', isLoading);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
