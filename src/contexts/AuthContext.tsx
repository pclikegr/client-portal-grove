
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
    // Έλεγχος αν υπάρχει ήδη ενεργή συνεδρία
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (error) throw error;

          // Ensure role is either 'user' or 'admin'
          const userRole = profileData.role === 'admin' ? 'admin' : 'user';

          setSession({
            accessToken: data.session.access_token,
            user: {
              id: profileData.id,
              firstName: profileData.first_name,
              lastName: profileData.last_name,
              email: profileData.email,
              avatarUrl: profileData.avatar_url,
              role: userRole,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscription στις αλλαγές της κατάστασης αυθεντικοποίησης
    const { data: { subscription }} = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) throw error;
            
            // Ensure role is either 'user' or 'admin'
            const userRole = profileData.role === 'admin' ? 'admin' : 'user';

            setSession({
              accessToken: session.access_token,
              user: {
                id: profileData.id,
                firstName: profileData.first_name,
                lastName: profileData.last_name,
                email: profileData.email,
                avatarUrl: profileData.avatar_url,
                role: userRole,
              },
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
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

      // Το προφίλ δημιουργείται αυτόματα μέσω του trigger
      toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
      
      // Explicitly type the user with the 'user' role
      const userProfile: UserProfile | null = data.user ? {
        id: data.user.id,
        firstName,
        lastName,
        email,
        role: 'user' // Always assign 'user' role to new users
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

      // Ενημέρωση του τοπικού session
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
