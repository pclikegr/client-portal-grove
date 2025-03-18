
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientById, updateClient } from '@/data/clients';
import { UpdateClientData } from '@/types/client';
import ClientForm from '@/components/ClientForm';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch client data
  const { data: client, isLoading: isClientLoading, error: clientError } = useQuery({
    queryKey: ['client', id],
    queryFn: () => id ? getClientById(id) : null,
    enabled: !!id,
    retry: 1,
    staleTime: 30000,
  });
  
  // Update client mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateClientData) => updateClient(id!, data),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      
      toast({
        title: "Επιτυχής ενημέρωση",
        description: "Τα στοιχεία του πελάτη ενημερώθηκαν επιτυχώς.",
      });
      
      navigate(`/clients/${id}`);
    },
    onError: (error: Error) => {
      console.error('Σφάλμα κατά την ενημέρωση:', error);
      
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την ενημέρωση του πελάτη.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (data: UpdateClientData) => {
    updateMutation.mutate(data);
  };
  
  // Handle error state
  if (clientError || !id) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Ο πελάτης δεν βρέθηκε</h1>
          <p className="text-muted-foreground mb-6">
            {clientError 
              ? "Υπήρξε πρόβλημα κατά τη φόρτωση του πελάτη."
              : "Ο πελάτης που προσπαθείτε να επεξεργαστείτε δεν υπάρχει ή έχει διαγραφεί."}
          </p>
          <Button 
            onClick={() => navigate('/clients')}
            variant="outline"
          >
            Επιστροφή στη λίστα πελατών
          </Button>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isClientLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Φόρτωση στοιχείων πελάτη...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // No client found
  if (!client) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Ο πελάτης δεν βρέθηκε</h1>
          <p className="text-muted-foreground mb-6">
            Ο πελάτης που προσπαθείτε να επεξεργαστείτε δεν υπάρχει ή έχει διαγραφεί.
          </p>
          <Button 
            onClick={() => navigate('/clients')}
            variant="outline"
          >
            Επιστροφή στη λίστα πελατών
          </Button>
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
            Επεξεργαστείτε τα στοιχεία του πελάτη {client.first_name} {client.last_name}.
          </p>
        </div>
        
        <ClientForm 
          client={client} 
          onSubmit={handleSubmit} 
          isLoading={updateMutation.isPending}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditClient;
