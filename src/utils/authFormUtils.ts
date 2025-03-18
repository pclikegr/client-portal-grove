import { useState } from 'react';
import { toast } from 'sonner';
import { AuthContextType } from '@/types/auth';

export type AuthFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const useLoginForm = (signIn: AuthContextType['signIn']) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Attempting sign in with:', formData.email);
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error(`Σφάλμα σύνδεσης: ${error.message}`);
        setIsSubmitting(false);
      } else {
        console.log('Sign in successful, redirection should happen automatically');
        toast.success('Επιτυχής σύνδεση!');
        // We're keeping isSubmitting true as we wait for the redirect
        // which will happen automatically when the session is updated
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Προέκυψε ένα σφάλμα κατά τη σύνδεση');
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSignIn,
    isSubmitting,
  };
};

export const useRegisterForm = (signUp: AuthContextType['signUp'], setAuthMethod: (method: 'login' | 'register') => void) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started with data:", formData);
    
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Calling signUp with:", formData.email, "and name:", formData.firstName, formData.lastName);
      const { error, user } = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      
      if (error) {
        console.error('Signup error:', error);
        toast.error(`Σφάλμα εγγραφής: ${error.message}`);
      } else {
        console.log("Signup successful, user:", user);
        toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
        // If we don't have a user returned, it might be because email confirmation is enabled
        if (!user) {
          setAuthMethod('login');
        }
      }
    } catch (err: any) {
      console.error('Signup error caught:', err);
      toast.error(`Προέκυψε ένα σφάλμα κατά την εγγραφή: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSignUp,
    isSubmitting,
  };
};
