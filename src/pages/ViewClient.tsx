
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getClientById, deleteClient } from '@/data/clients';
import { Client } from '@/types/client';
import ClientDetails from '@/components/ClientDetails';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, Trash2, ArrowLeft } from 'lucide-react';

const ViewClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
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
        
        <ClientDetails client={client} />
      </div>
    </div>
  );
};

export default ViewClient;
