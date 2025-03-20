import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeviceForm from '@/components/DeviceForm';
import { toast } from '@/components/ui/use-toast';
import { DeviceType, CreateDeviceData } from '@/types/client';
import { addDevice } from '@/data/devices';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddDevice: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clientId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addDeviceMutation = useMutation({
    mutationFn: addDevice,
    onSuccess: (newDevice) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['client-devices', clientId] });
      
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Η συσκευή προστέθηκε επιτυχώς στο σύστημα.",
      });
      
      // If includeReport is true, navigate to add technical report
      if (includeReport) {
        navigate(`/devices/${newDevice.id}/add-report`);
      } else {
        // Otherwise, navigate back to the client detail page
        navigate(`/clients/${newDevice.clientId}`);
      }
    },
    onError: (error: Error) => {
      console.error("Error adding device:", error);
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την προσθήκη της συσκευής. Προσπαθήστε ξανά.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });
  
  // Determine if we should include a technical report after adding the device
  const includeReport = new URLSearchParams(window.location.search).get('includeReport') === 'true';
  
  const handleSubmit = async (data: CreateDeviceData) => {
    console.log("Submitting device form with data:", data);
    setIsSubmitting(true);
    addDeviceMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Προσθήκη Νέας Συσκευής</h1>
          <p className="text-muted-foreground mt-1">
            Εισάγετε τα στοιχεία της νέας συσκευής στη φόρμα παρακάτω.
          </p>
        </div>
        
        <DeviceForm
          clientId={clientId || ''}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          includeReport={includeReport}
        />
      </div>
    </div>
  );
};

export default AddDevice;
