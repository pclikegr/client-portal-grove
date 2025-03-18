
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<'login' | 'register'>('login');
  const { session } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Auth component - Current session:', session);
    
    if (session?.user) {
      console.log('User is authenticated, redirecting to home');
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-10 px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ClientBook</CardTitle>
          <CardDescription>
            {authMethod === 'login' 
              ? 'Συνδεθείτε στο λογαριασμό σας' 
              : 'Δημιουργήστε ένα νέο λογαριασμό'}
          </CardDescription>
        </CardHeader>
        
        <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as 'login' | 'register')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Σύνδεση</TabsTrigger>
            <TabsTrigger value="register">Εγγραφή</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm setAuthMethod={setAuthMethod} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
