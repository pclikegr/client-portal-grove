
import { useState } from 'react';
import { toast } from 'sonner';
import { AuthContextType } from '@/types/auth';

export const useOAuthSignIn = (signInWithOAuth: AuthContextType['signInWithOAuth']) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'github') => {
    setIsSubmitting(true);
    try {
      console.log(`Attempting OAuth sign in with: ${provider}`);
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        console.error(`OAuth sign in error:`, error);
        toast.error(`Η σύνδεση με ${provider} απέτυχε: ${error.message}`);
      }
    } catch (err) {
      console.error('OAuth sign in error:', err);
      toast.error(`Προέκυψε ένα σφάλμα κατά τη σύνδεση με ${provider}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleOAuthSignIn,
    isSubmitting,
  };
};
