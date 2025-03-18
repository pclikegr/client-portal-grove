
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2, Github, Chrome } from 'lucide-react';
import { useLoginForm } from '@/utils/authFormUtils';
import { useOAuthSignIn } from '@/utils/oAuthUtils';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm: React.FC = () => {
  const { signIn, signInWithOAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const { formData, handleChange, handleSignIn, isSubmitting } = useLoginForm(signIn);
  const { handleOAuthSignIn, isSubmitting: isOAuthSubmitting } = useOAuthSignIn(signInWithOAuth);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSignIn}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Κωδικός</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button 
              type="button"
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || isOAuthSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Σύνδεση...
            </>
          ) : (
            'Σύνδεση'
          )}
        </Button>
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-sm text-muted-foreground">
              ή συνδεθείτε με
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleOAuthSignIn('google')}
            disabled={isSubmitting || isOAuthSubmitting}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleOAuthSignIn('github')}
            disabled={isSubmitting || isOAuthSubmitting}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
