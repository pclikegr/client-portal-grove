import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Loader2, Github, Mail, Chrome } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMethod, setAuthMethod] = useState<'login' | 'register'>('login');
  
  const { signIn, signUp, session, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Auth component - Current session:', session);
    
    if (session?.user) {
      console.log('User is authenticated, redirecting to home');
      navigate('/');
    }
  }, [session, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Attempting sign in with:', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(`Σφάλμα σύνδεσης: ${error.message}`);
        console.error('Sign in error:', error);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      toast.error('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await signUp(email, password, firstName, lastName);
      
      if (!error) {
        toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
        setAuthMethod('login');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('Προέκυψε ένα σφάλμα κατά την εγγραφή');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'github') => {
    setIsSubmitting(true);
    try {
      console.log(`Attempting sign in with ${provider}`);
      await signInWithOAuth(provider);
    } catch (err) {
      console.error(`${provider} login error:`, err);
      toast.error(`Προέκυψε ένα σφάλμα κατά τη σύνδεση με ${provider}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={isSubmitting}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Όνομα</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Επώνυμο</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input 
                    id="registerEmail" 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Κωδικός</Label>
                  <div className="relative">
                    <Input 
                      id="registerPassword" 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Εγγραφή...
                    </>
                  ) : (
                    'Εγγραφή'
                  )}
                </Button>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-sm text-muted-foreground">
                      ή εγγραφείτε με
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={isSubmitting}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={isSubmitting}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
