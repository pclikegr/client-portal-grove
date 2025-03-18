
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
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        setIsNotFound(true);
        setIsDataLoading(false);
        return;
      }
      
      try {
        console.log(`Loading client with ID: ${id}`);
        const clientData = await getClientById(id);
        
        if (!clientData) {
          console.log(`Client not found with ID: ${id}`);
          setIsNotFound(true);
          toast({
            title: "Σφάλμα",
            description: "Ο πελάτης δεν βρέθηκε.",
            variant: "destructive",
          });
        } else {
          console.log(`Client loaded successfully:`, clientData);
          setClient(clientData);
        }
      } catch (error) {
        console.error('Error loading client:', error);
        setIsNotFound(true);
        toast({
          title: "Σφάλμα",
          description: "Υπήρξε πρόβλημα κατά τη φόρτωση του πελάτη.",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    loadClient();
  }, [id]);
  
  const handleSubmit = async (data: UpdateClientData) => {
    if (!id) return;
    
    setIsLoading(true);
    
    try {
      console.log(`Updating client ${id} with data:`, data);
      const updatedClient = await updateClient(id, data);
      
      console.log("Client updated successfully:", updatedClient);
      toast({
        title: "Επιτυχής ενημέρωση",
        description: "Τα στοιχεία του πελάτη ενημερώθηκαν επιτυχώς.",
      });
      
      navigate(`/clients/${id}`);
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
  
  if (isDataLoading) {
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
            Επεξεργαστείτε τα στοιχεία του πελάτη {client?.first_name} {client?.last_name}.
          </p>
        </div>
        
        {client && (
          <ClientForm 
            client={client} 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default EditClient;
