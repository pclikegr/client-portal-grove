
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClientById, updateClient } from '@/data/clients';
import { Client, UpdateClientData } from '@/types/client';
import ClientForm from '@/components/ClientForm';
import { toast } from '@/components/ui/use-toast';

const EditClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  
  useEffect(() => {
    if (!id) {
      setIsNotFound(true);
      return;
    }
    
    const clientData = getClientById(id);
    
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
  }, [id]);
  
  const handleSubmit = (data: UpdateClientData) => {
    if (!id) return;
    
    setIsLoading(true);
    
    try {
      const updatedClient = updateClient(id, data);
      
      if (updatedClient) {
        toast({
          title: "Επιτυχής ενημέρωση",
          description: "Τα στοιχεία του πελάτη ενημερώθηκαν επιτυχώς.",
        });
        
        navigate(`/clients/${id}`);
      } else {
        throw new Error('Αποτυχία ενημέρωσης πελάτη');
      }
    } catch (error) {
      console.error('Σφάλμα κατά την ενημέρωση:', error);
      
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την ενημέρωση του πελάτη.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isNotFound) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Ο πελάτης δεν βρέθηκε</h1>
          <p className="text-muted-foreground mb-6">
            Ο πελάτης που προσπαθείτε να επεξεργαστείτε δεν υπάρχει ή έχει διαγραφεί.
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
            <div className="h-4 w-full bg-muted rounded"></div>
          </div>
          <div className="w-full h-[500px] bg-card animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Επεξεργασία Πελάτη</h1>
          <p className="text-muted-foreground mt-1">
            Επεξεργαστείτε τα στοιχεία του πελάτη {client.firstName} {client.lastName}.
          </p>
        </div>
        
        <ClientForm 
          client={client} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default EditClient;
