
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientForm from '@/components/ClientForm';
import { toast } from '@/components/ui/use-toast';
import { CreateClientData } from '@/types/client';
import { addClient } from '@/data/clients';

const AddClient: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: CreateClientData) => {
    setIsLoading(true);
    
    try {
      console.log("Submitting new client form with data:", data);
      const result = await addClient(data);
      
      console.log("Client added successfully:", result);
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Ο πελάτης προστέθηκε επιτυχώς στο σύστημα.",
      });
      
      navigate(`/clients/${result.id}`);
    } catch (error) {
      console.error("Error adding client:", error);
      
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την προσθήκη του πελάτη. Προσπαθήστε ξανά.",
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
            Εισάγετε τα στοιχεία του νέου πελάτη στη φόρμα παρακάτω.
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
