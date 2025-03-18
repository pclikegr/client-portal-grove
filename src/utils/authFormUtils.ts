
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
      } else {
        toast.success('Επιτυχής σύνδεση!');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Προέκυψε ένα σφάλμα κατά τη σύνδεση');
    } finally {
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
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error, user } = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      
      if (error) {
        console.error('Signup error:', error);
        toast.error(`Σφάλμα εγγραφής: ${error.message}`);
      } else {
        toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
        if (!user) {
          setAuthMethod('login');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('Προέκυψε ένα σφάλμα κατά την εγγραφή');
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
