
import { useState } from 'react';
import { toast } from 'sonner';
import { AuthContextType } from '@/types/auth';

export const useOAuthSignIn = (signInWithOAuth: AuthContextType['signInWithOAuth']) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'github') => {
    setIsSubmitting(true);
    try {
      console.log(`Attempting sign in with ${provider}`);
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        console.error(`${provider} login error:`, error);
        toast.error(`Προέκυψε ένα σφάλμα κατά τη σύνδεση με ${provider}: ${error.message}`);
      }
    } catch (err) {
      console.error(`${provider} login error:`, err);
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
