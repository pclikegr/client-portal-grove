import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getClientById, deleteClient } from '@/data/clients';
import { getDevicesByClientId } from '@/data/devices';
import { Client, Device } from '@/types/client';
import ClientDetails from '@/components/ClientDetails';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, Trash2, Laptop, Smartphone, Plus } from 'lucide-react';
import DevicesList from '@/components/DevicesList';

const ViewClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  
  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        setIsNotFound(true);
        return;
      }
      
      try {
        const clientData = await getClientById(id);
        
        if (!clientData) {
          setIsNotFound(true);
          toast({
            title: "Σφάλμα",
            description: "Ο πελάτης δεν βρέθηκε.",
            variant: "destructive",
          });
        } else {
          setClient(clientData);
        }
      } catch (error) {
        console.error('Error loading client:', error);
        setIsNotFound(true);
      }
    };

    loadClient();
  }, [id]);
  
  const handleDelete = () => {
    if (!id) return;
    
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτόν τον πελάτη;')) {
      const success = deleteClient(id);
      
      if (success) {
        toast({
          title: "Επιτυχής διαγραφή",
          description: "Ο πελάτης διαγράφηκε επιτυχώς.",
        });
        
        navigate('/clients');
      } else {
        toast({
          title: "Σφάλμα",
          description: "Υπήρξε ένα πρόβλημα κατά τη διαγραφή του πελάτη.",
          variant: "destructive",
        });
      }
    }
  };
  
  if (isNotFound) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Ο πελάτης δεν βρέθηκε</h1>
          <p className="text-muted-foreground mb-6">
            Ο πελάτης που προσπαθείτε να προβάλετε δεν υπάρχει ή έχει διαγραφεί.
          </p>
          <button 
            onClick={() => navigate('/clients')}
            className="text-primary hover:underline"
          >
            Επιστροφή στη λίστα πελατών
          </button>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-2"></div>
          </div>
          <div className="w-full h-[400px] bg-card animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/clients')}
              className="h-8 w-8 mr-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Στοιχεία Πελάτη</h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Διαγραφή</span>
          </Button>
        </div>
        
        {client && <ClientDetails client={client} />}
        
        {client && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Συσκευές</h2>
              <Link to={`/clients/${id}/devices/add`}>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Προσθήκη Συσκευής</span>
                </Button>
              </Link>
            </div>
            
            {devices.length > 0 ? (
              <DevicesList devices={devices} />
            ) : (
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex gap-2">
                    <Laptop className="h-10 w-10 text-muted-foreground" />
                    <Smartphone className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Δεν υπάρχουν συσκευές</h3>
                <p className="text-muted-foreground mb-4">
                  Αυτός ο πελάτης δεν έχει καταχωρημένες συσκευές ακόμα.
                </p>
                <Link to={`/clients/${id}/devices/add`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Προσθήκη Πρώτης Συσκευής</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewClient;
