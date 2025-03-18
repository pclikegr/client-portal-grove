
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientForm from '@/components/ClientForm';
import { toast } from '@/components/ui/use-toast';
import { CreateClientData } from '@/types/client';
import { addClient } from '@/data/clients';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddClient: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const addClientMutation = useMutation({
    mutationFn: addClient,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Ο πελάτης προστέθηκε επιτυχώς στο σύστημα.",
      });
      navigate(`/clients/${result.id}`);
    },
    onError: (error: Error) => {
      console.error("Error adding client:", error);
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την προσθήκη του πελάτη. Προσπαθήστε ξανά.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = async (data: CreateClientData) => {
    console.log("Submitting new client form with data:", data);
    addClientMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Προσθήκη Νέου Πελάτη</h1>
          <p className="text-muted-foreground mt-1">
            Εισάγετε τα στοιχεία του νέου πελάτη στη φόρμα παρακάτω.
          </p>
        </div>
        
        <ClientForm
          onSubmit={handleSubmit}
          isLoading={addClientMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AddClient;
