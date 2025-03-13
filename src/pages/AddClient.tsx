
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addClient } from '@/data/clients';
import { CreateClientData } from '@/types/client';
import ClientForm from '@/components/ClientForm';
import { toast } from '@/components/ui/use-toast';

const AddClient: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (data: CreateClientData) => {
    setIsLoading(true);
    
    try {
      const newClient = addClient(data);
      
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Ο πελάτης προστέθηκε επιτυχώς.",
      });
      
      navigate(`/clients/${newClient.id}`);
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
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Προσθήκη Νέου Πελάτη</h1>
          <p className="text-muted-foreground mt-1">
            Συμπληρώστε τα στοιχεία του νέου πελάτη.
          </p>
        </div>
        
        <ClientForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default AddClient;
