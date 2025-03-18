
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addClient } from '@/data/clients';
import { addDevice } from '@/data/devices';
import { CreateClientData } from '@/types/client';
import ClientForm from '@/components/ClientForm';
import DeviceForm from '@/components/DeviceForm';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AddClient: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('client');
  const [newClientId, setNewClientId] = useState<string | null>(null);
  const { session, isLoading: authLoading } = useAuth();
  
  useEffect(() => {
    console.log('AddClient: Auth state updated:', { 
      authenticated: !!session?.user, 
      authLoading, 
      userId: session?.user?.id 
    });
  }, [session, authLoading]);
  
  const handleClientSubmit = async (data: CreateClientData) => {
    if (authLoading) {
      toast({
        title: "Περιμένετε",
        description: "Γίνεται επαλήθευση του λογαριασμού σας...",
      });
      return;
    }
    
    if (!session?.user) {
      toast({
        title: "Σφάλμα",
        description: "Πρέπει να συνδεθείτε για να προσθέσετε πελάτη.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('AddClient: Submitting client data:', data);
      const newClient = await addClient(data);
      console.log('AddClient: Client created successfully:', newClient);
      setNewClientId(newClient.id);
      
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Ο πελάτης προστέθηκε επιτυχώς. Μπορείτε τώρα να προσθέσετε συσκευή.",
      });
      
      setActiveTab('device');
    } catch (error) {
      console.error('AddClient: Error adding client:', error);
      
      let errorMessage = "Υπήρξε ένα πρόβλημα κατά την προσθήκη του πελάτη.";
      if (error instanceof Error) {
        if (error.message === 'No authenticated user') {
          errorMessage = "Πρέπει να συνδεθείτε για να προσθέσετε πελάτη.";
          navigate('/auth');
        } else {
          errorMessage = `Σφάλμα: ${error.message}`;
        }
      }
      
      toast({
        title: "Σφάλμα",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeviceSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      console.log('AddClient: Submitting device data:', data);
      const newDevice = await addDevice(data);
      console.log('AddClient: Device created successfully:', newDevice);
      
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Η συσκευή προστέθηκε επιτυχώς.",
      });
      
      navigate(`/clients/${newClientId}`);
    } catch (error) {
      console.error('AddClient: Error adding device:', error);
      
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την προσθήκη της συσκευής.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSkipDevice = () => {
    if (newClientId) {
      navigate(`/clients/${newClientId}`);
    }
  };
  
  // If auth is still loading, show a loading indicator
  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Φόρτωση...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Προσθήκη Νέου Πελάτη</h1>
          <p className="text-muted-foreground mt-1">
            Συμπληρώστε τα στοιχεία του νέου πελάτη και της συσκευής του.
          </p>
        </div>
        
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="client">Στοιχεία Πελάτη</TabsTrigger>
                <TabsTrigger value="device" disabled={!newClientId}>Στοιχεία Συσκευής</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-0">
              <TabsContent value="client" className="mt-0">
                <ClientForm 
                  onSubmit={handleClientSubmit} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="device" className="mt-0">
                {newClientId ? (
                  <div>
                    <DeviceForm 
                      clientId={newClientId}
                      onSubmit={handleDeviceSubmit} 
                      isLoading={isLoading}
                    />
                    <div className="flex justify-center p-6 border-t">
                      <Button 
                        variant="outline" 
                        onClick={handleSkipDevice}
                        disabled={isLoading}
                      >
                        Παράλειψη προσθήκης συσκευής
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p>Παρακαλώ συμπληρώστε πρώτα τα στοιχεία του πελάτη.</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AddClient;
