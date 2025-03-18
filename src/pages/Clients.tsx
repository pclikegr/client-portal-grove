
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import ClientsTable from '@/components/ClientsTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, deleteClient } from '@/data/clients';
import { toast } from '@/components/ui/use-toast';

const Clients: React.FC = () => {
  const queryClient = useQueryClient();
  
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Επιτυχής διαγραφή",
        description: "Ο πελάτης διαγράφηκε επιτυχώς."
      });
    },
    onError: (error: Error) => {
      console.error("Delete client error:", error);
      toast({
        title: "Σφάλμα",
        description: `Υπήρξε ένα πρόβλημα κατά τη διαγραφή: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτόν τον πελάτη;')) {
      deleteMutation.mutate(id);
    }
  };
  
  if (error) {
    console.error("Client fetching error:", error);
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-destructive/10 p-4 rounded border border-destructive text-destructive">
            <h2 className="text-lg font-semibold">Σφάλμα φόρτωσης</h2>
            <p>Υπήρξε πρόβλημα κατά τη φόρτωση των πελατών. Παρακαλώ προσπαθήστε ξανά.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Πελάτες</h1>
          
          <Link to="/clients/add">
            <Button className="gap-2 btn-hover-effect">
              <UserPlus className="h-4 w-4" />
              <span>Νέος Πελάτης</span>
            </Button>
          </Link>
        </div>
        
        {clients.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <h2 className="text-lg font-medium mb-2">Δεν βρέθηκαν πελάτες</h2>
            <p className="text-muted-foreground mb-4">Δεν υπάρχουν καταχωρημένοι πελάτες.</p>
            <Link to="/clients/add">
              <Button>Προσθήκη πρώτου πελάτη</Button>
            </Link>
          </div>
        ) : (
          <ClientsTable 
            clients={clients} 
            onDelete={handleDelete} 
          />
        )}
      </div>
    </div>
  );
};

export default Clients;
