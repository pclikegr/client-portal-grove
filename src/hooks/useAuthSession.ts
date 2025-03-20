
import { useState, useEffect, useCallback } from 'react';
import { Session } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  console.log('useAuthSession hook initialized');

  const fetchUserProfile = useCallback(async (userId: string) => {
    console.log('Fetching profile for user ID:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data) {
        console.error('No profile found for user ID:', userId);
        return null;
      }

      return {
        id: data.id,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        avatarUrl: data.avatar_url || undefined,
        role: (data.role as 'user' | 'admin') || 'user',
      };
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  }, []);

  const updateSession = useCallback(async (supabaseSession: any) => {
    console.log('Updating session with supabaseSession:', !!supabaseSession);
    
    if (!supabaseSession) {
      console.log('No Supabase session - setting session to null');
      setSession(null);
      return;
    }

    try {
      const profile = await fetchUserProfile(supabaseSession.user.id);
      
      if (!profile) {
        console.error('Failed to get profile for user:', supabaseSession.user.id);
        toast({
          title: "Σφάλμα προφίλ",
          description: "Δεν ήταν δυνατή η φόρτωση του προφίλ σας. Παρακαλώ προσπαθήστε ξανά.",
          variant: "destructive",
        });
        setSession(null);
        return;
      }

      console.log('Profile fetched successfully:', profile.id);
      
      setSession({
        user: profile,
        accessToken: supabaseSession.access_token,
      });
    } catch (error) {
      console.error('Error updating session:', error);
      setSession(null);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    console.log('Checking session...');
    
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, supabaseSession) => {
        console.log('Auth state changed:', event, supabaseSession?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed:', supabaseSession?.user?.id);
          setIsLoading(true);
          await updateSession(supabaseSession);
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setSession(null);
        }
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session: supabaseSession } }) => {
      console.log('Initial session check:', !!supabaseSession);
      updateSession(supabaseSession).finally(() => {
        setIsLoading(false);
        setInitialCheckDone(true);
      });
    }).catch(error => {
      console.error('Error getting initial session:', error);
      setIsLoading(false);
      setInitialCheckDone(true);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [updateSession]);

  return { session, isLoading, setSession, initialCheckDone };
};
