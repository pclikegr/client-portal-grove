
import React, { useState } from 'react';
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

const AddClient: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('client');
  const [newClientId, setNewClientId] = useState<string | null>(null);
  
  const handleClientSubmit = (data: CreateClientData) => {
    setIsLoading(true);
    
    try {
      const newClient = addClient(data);
      setNewClientId(newClient.id);
      
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Ο πελάτης προστέθηκε επιτυχώς. Μπορείτε τώρα να προσθέσετε συσκευή.",
      });
      
      // Μετάβαση στην καρτέλα συσκευής
      setActiveTab('device');
    } catch (error) {
      console.error('Σφάλμα κατά την προσθήκη:', error);
      
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την προσθήκη του πελάτη.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeviceSubmit = (data: any) => {
    setIsLoading(true);
    
    try {
      const newDevice = addDevice(data);
      
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Η συσκευή προστέθηκε επιτυχώς.",
      });
      
      // Μετάβαση στη σελίδα του πελάτη
      navigate(`/clients/${newClientId}`);
    } catch (error) {
      console.error('Σφάλμα κατά την προσθήκη συσκευής:', error);
      
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
