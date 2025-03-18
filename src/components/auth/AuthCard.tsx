
import React from 'react';
import { Card } from '@/components/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-10 px-4">
      <Card className="w-full max-w-md mx-auto">
        {children}
      </Card>
    </div>
  );
};

export default AuthCard;
