
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session, UserProfile } from "@/types/auth";

/**
 * Fetch user profile data from Supabase
 */
export const fetchUserProfile = async (userId: string) => {
  console.log('Fetching profile for user ID:', userId);
  const { data: profileData, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return { error, profileData: null };
  }

  console.log('Profile data fetched successfully:', profileData);
  return { error: null, profileData };
};

/**
 * Create a session object from profile data
 */
export const createSessionFromProfile = (profileData: any, accessToken: string): Session => {
  console.log('Creating session from profile data:', profileData);
  // Ensure role is either "user" or "admin"
  const userRole = profileData.role === 'admin' ? 'admin' as const : 'user' as const;

  return {
    accessToken,
    user: {
      id: profileData.id,
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      email: profileData.email,
      avatarUrl: profileData.avatar_url,
      role: userRole,
    },
  };
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log('Attempting sign in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return { error };
    }
    
    console.log('Sign in successful, auth data:', data);
    // We don't need to manually update the session here
    // The onAuthStateChange event will handle that
    return { error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { error };
  }
};

/**
 * Sign up with email, password and profile data
 */
export const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    console.log('Attempting sign up with:', email, firstName, lastName);
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

    console.log('Sign up successful, data:', data);
    toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
    
    const userProfile: UserProfile | null = data.user ? {
      id: data.user.id,
      firstName,
      lastName,
      email,
      role: 'user' as const
    } : null;
    
    return { error: null, user: userProfile };
  } catch (error: any) {
    console.error('Sign up error:', error);
    toast.error('Η εγγραφή απέτυχε: ' + error.message);
    return { error, user: null };
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async () => {
  try {
    await supabase.auth.signOut();
    toast.success('Αποσυνδεθήκατε με επιτυχία');
    return { error: null };
  } catch (error: any) {
    toast.error('Σφάλμα κατά την αποσύνδεση: ' + error.message);
    return { error };
  }
};

/**
 * Sign in with OAuth provider
 */
export const signInWithOAuthProvider = async (provider: 'google' | 'facebook' | 'github') => {
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

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        avatar_url: data.avatarUrl,
      })
      .eq('id', userId);

    if (error) throw error;

    toast.success('Το προφίλ ενημερώθηκε με επιτυχία');
    return { error: null };
  } catch (error: any) {
    toast.error('Σφάλμα κατά την ενημέρωση του προφίλ: ' + error.message);
    return { error };
  }
};
