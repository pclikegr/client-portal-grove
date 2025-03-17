
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { session, updateProfile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState(session?.user?.firstName || '');
  const [lastName, setLastName] = useState(session?.user?.lastName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  React.useEffect(() => {
    if (!isLoading && !session) {
      navigate('/auth');
    }
  }, [session, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!session?.user) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await updateProfile({
      firstName,
      lastName,
    });
    
    setIsSubmitting(false);
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user.avatarUrl || ''} alt={`${firstName} ${lastName}`} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Το προφίλ μου</CardTitle>
                <CardDescription>Διαχειριστείτε τα στοιχεία του λογαριασμού σας</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Όνομα</Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Επώνυμο</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={session.user.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Ρόλος</Label>
                <Input 
                  id="role" 
                  value={session.user.role === 'admin' ? 'Διαχειριστής' : 'Χρήστης'}
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button 
                type="submit" 
                disabled={isSubmitting || (firstName === session.user.firstName && lastName === session.user.lastName)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Αποθήκευση...
                  </>
                ) : (
                  'Αποθήκευση αλλαγών'
                )}
              </Button>
              
              <Button 
                variant="destructive" 
                type="button" 
                onClick={handleSignOut}
              >
                Αποσύνδεση
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
