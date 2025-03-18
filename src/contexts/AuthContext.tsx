
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
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading, setSession } = useAuthSession();

  const signIn = async (email: string, password: string) => {
    return signInWithEmail(email, password);
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    return signUpWithEmail(email, password, firstName, lastName);
  };

  const signOut = async () => {
    const { error } = await signOutUser();
    if (!error) {
      setSession(null);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook' | 'github') => {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
