
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@/types/auth';
import { fetchUserProfile, createSessionFromProfile } from '@/utils/authUtils';

export const useAuthSession = () => {
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
            const { error, profileData } = await fetchUserProfile(supabaseSession.user.id);

            if (error) {
              console.error('Error fetching profile:', error);
              setSession(null);
              setIsLoading(false);
              return;
            }

            console.log('Profile data retrieved:', profileData);
            const sessionData = createSessionFromProfile(
              profileData, 
              supabaseSession.access_token
            );
            
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
            const { error, profileData } = await fetchUserProfile(supabaseSession.user.id);

            if (error) {
              console.error('Error fetching profile after state change:', error);
              setSession(null);
              return;
            }

            console.log('Profile data after auth change:', profileData);
            const sessionData = createSessionFromProfile(
              profileData, 
              supabaseSession.access_token
            );
            
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

  return { session, isLoading, setSession };
};
