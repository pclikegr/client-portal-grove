
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientForm from '@/components/ClientForm';
import { toast } from '@/components/ui/use-toast';
import { CreateClientData } from '@/types/client';
import { addClient } from '@/data/clients';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import DeviceForm from '@/components/DeviceForm';

const AddClient: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [clientId, setClientId] = useState<string | null>(null);
  const [showDeviceForm, setShowDeviceForm] = useState(false);
  
  const addClientMutation = useMutation({
    mutationFn: addClient,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Ο πελάτης προστέθηκε επιτυχώς στο σύστημα.",
      });
      
      // Save the client ID and show device form
      setClientId(result.id);
      setShowDeviceForm(true);
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

  const handleDeviceSubmit = (data: any) => {
    console.log("Device submitted:", data);
    // After device is added, navigate to client details
    navigate(`/clients/${clientId}`);
  };

  const skipDeviceAddition = () => {
    // Skip device addition and navigate to client details
    navigate(`/clients/${clientId}`);
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {!showDeviceForm ? (
          <>
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
          </>
        ) : (
          <>
            <div className="mb-6 animate-fade-in">
              <h1 className="text-2xl font-bold">Προσθήκη Συσκευής</h1>
              <p className="text-muted-foreground mt-1">
                Θέλετε να προσθέσετε συσκευή για τον νέο πελάτη;
              </p>
            </div>
            
            <div className="flex justify-end mb-4">
              <button 
                onClick={skipDeviceAddition}
                className="text-primary hover:underline"
              >
                Παράλειψη
              </button>
            </div>
            
            {clientId && (
              <DeviceForm
                clientId={clientId}
                onSubmit={handleDeviceSubmit}
                isLoading={false}
                includeReport={true}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddClient;
