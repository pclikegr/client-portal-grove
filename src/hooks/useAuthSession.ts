
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@/types/auth';
import { fetchUserProfile, createSessionFromProfile } from '@/utils/authUtils';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        setIsLoading(true);
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        if (supabaseSession) {
          console.log('Supabase session found:', supabaseSession);
          try {
            const { error, profileData } = await fetchUserProfile(supabaseSession.user.id);

            if (error) {
              console.error('Error fetching profile:', error);
              if (isMounted) {
                setSession(null);
                setIsLoading(false);
              }
              return;
            }

            console.log('Profile data retrieved:', profileData);
            const sessionData = createSessionFromProfile(
              profileData, 
              supabaseSession.access_token
            );
            
            console.log('Setting session with data:', sessionData);
            if (isMounted) {
              setSession(sessionData);
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Error in session check:', error);
            if (isMounted) {
              setSession(null);
              setIsLoading(false);
            }
          }
        } else {
          console.log('No Supabase session found');
          if (isMounted) {
            setSession(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (isMounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, supabaseSession) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsLoading(true);
        if (supabaseSession) {
          console.log('User signed in or token refreshed:', supabaseSession);
          try {
            const { error, profileData } = await fetchUserProfile(supabaseSession.user.id);

            if (error) {
              console.error('Error fetching profile after state change:', error);
              if (isMounted) {
                setSession(null);
                setIsLoading(false);
              }
              return;
            }

            console.log('Profile data after auth change:', profileData);
            const sessionData = createSessionFromProfile(
              profileData, 
              supabaseSession.access_token
            );
            
            console.log('Setting session after auth change:', sessionData);
            if (isMounted) {
              setSession(sessionData);
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            if (isMounted) {
              setSession(null);
              setIsLoading(false);
            }
          }
        } else {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        if (isMounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading, setSession };
};
