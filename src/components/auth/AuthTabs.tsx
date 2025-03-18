
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

interface AuthTabsProps {
  authMethod: 'login' | 'register';
  setAuthMethod: (method: 'login' | 'register') => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ authMethod, setAuthMethod }) => {
  return (
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
  );
};

export default AuthTabs;
