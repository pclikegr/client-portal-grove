
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, Session, UserProfile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        if (supabaseSession) {
          console.log('Supabase session found:', supabaseSession);
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseSession.user.id)
              .single();

            if (error) {
              console.error('Error fetching profile:', error);
              setSession(null);
              setIsLoading(false);
              return;
            }

            console.log('Profile data retrieved:', profileData);
            const userRole = profileData.role === 'admin' ? 'admin' : 'user';

            const sessionData = {
              accessToken: supabaseSession.access_token,
              user: {
                id: profileData.id,
                firstName: profileData.first_name,
                lastName: profileData.last_name,
                email: profileData.email,
                avatarUrl: profileData.avatar_url,
                role: userRole,
              },
            };
            
            console.log('Setting session with data:', sessionData);
            setSession(sessionData);
          } catch (error) {
            console.error('Error in session check:', error);
            setSession(null);
          }
        } else {
          console.log('No Supabase session found');
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, supabaseSession) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (supabaseSession) {
          console.log('User signed in or token refreshed:', supabaseSession);
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseSession.user.id)
              .single();

            if (error) {
              console.error('Error fetching profile after state change:', error);
              setSession(null);
              return;
            }

            console.log('Profile data after auth change:', profileData);
            const userRole = profileData.role === 'admin' ? 'admin' : 'user';

            const sessionData = {
              accessToken: supabaseSession.access_token,
              user: {
                id: profileData.id,
                firstName: profileData.first_name,
                lastName: profileData.last_name,
                email: profileData.email,
                avatarUrl: profileData.avatar_url,
                role: userRole,
              },
            };
            
            console.log('Setting session after auth change:', sessionData);
            setSession(sessionData);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setSession(null);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log('Sign in successful');
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Η σύνδεση απέτυχε: ' + error.message);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
      
      const userProfile: UserProfile | null = data.user ? {
        id: data.user.id,
        firstName,
        lastName,
        email,
        role: 'user'
      } : null;
      
      return { error: null, user: userProfile };
    } catch (error: any) {
      toast.error('Η εγγραφή απέτυχε: ' + error.message);
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      toast.success('Αποσυνδεθήκατε με επιτυχία');
    } catch (error: any) {
      toast.error('Σφάλμα κατά την αποσύνδεση: ' + error.message);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      console.log(`Attempting OAuth sign in with: ${provider}`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      toast.error(`Η σύνδεση με ${provider} απέτυχε: ${error.message}`);
      return { error };
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!session?.user) {
      return { error: new Error('Δεν υπάρχει συνδεδεμένος χρήστης') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          avatar_url: data.avatarUrl,
        })
        .eq('id', session.user.id);

      if (error) throw error;

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

      toast.success('Το προφίλ ενημερώθηκε με επιτυχία');
      return { error: null };
    } catch (error: any) {
      toast.error('Σφάλμα κατά την ενημέρωση του προφίλ: ' + error.message);
      return { error };
    }
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
