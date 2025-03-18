
import React from 'react';
import { CardHeader, CardDescription, CardTitle } from '@/components/ui/card';

interface AuthHeaderProps {
  authMethod: 'login' | 'register';
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ authMethod }) => {
  return (
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">ClientBook</CardTitle>
      <CardDescription>
        {authMethod === 'login' 
          ? 'Συνδεθείτε στο λογαριασμό σας' 
          : 'Δημιουργήστε ένα νέο λογαριασμό'}
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
