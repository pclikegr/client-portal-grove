
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
        setIsSubmitting(false);
      }
      // Note: For OAuth, we don't need to set isSubmitting to false on success
      // because the page will redirect to the provider's auth page
    } catch (err) {
      console.error('OAuth sign in error:', err);
      toast.error(`Προέκυψε ένα σφάλμα κατά τη σύνδεση με ${provider}`);
      setIsSubmitting(false);
    }
  };

  return {
    handleOAuthSignIn,
    isSubmitting,
  };
};
