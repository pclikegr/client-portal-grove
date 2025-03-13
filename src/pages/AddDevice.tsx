
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDevice } from '@/data/devices';
import { getClientById } from '@/data/clients';
import { CreateDeviceData, Client } from '@/types/client';
import DeviceForm from '@/components/DeviceForm';
import { toast } from '@/components/ui/use-toast';

const AddDevice: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  
  useEffect(() => {
    if (clientId) {
      const clientData = getClientById(clientId);
      if (clientData) {
        setClient(clientData);
      } else {
        toast({
          title: "Σφάλμα",
          description: "Ο πελάτης δεν βρέθηκε.",
          variant: "destructive",
        });
        navigate('/clients');
      }
    }
  }, [clientId, navigate]);
  
  const handleSubmit = (data: CreateDeviceData) => {
    setIsLoading(true);
    
    try {
      const newDevice = addDevice(data);
      
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Η συσκευή προστέθηκε επιτυχώς.",
      });
      
      if (clientId) {
        navigate(`/clients/${clientId}`);
      } else {
        navigate(`/devices/${newDevice.id}`);
      }
    } catch (error) {
      console.error('Σφάλμα κατά την προσθήκη:', error);
      
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την προσθήκη της συσκευής.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Προσθήκη Νέας Συσκευής</h1>
          {client ? (
            <p className="text-muted-foreground mt-1">
              Προσθήκη συσκευής για τον πελάτη: {client.firstName} {client.lastName}
            </p>
          ) : (
            <p className="text-muted-foreground mt-1">
              Συμπληρώστε τα στοιχεία της νέας συσκευής.
            </p>
          )}
        </div>
        
        <DeviceForm
          clientId={clientId}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AddDevice;
