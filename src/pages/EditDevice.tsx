
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeviceForm from '@/components/DeviceForm';
import { toast } from '@/components/ui/use-toast';
import { Device, UpdateDeviceData } from '@/types/client';
import { getDeviceById, updateDevice } from '@/data/devices';
import { useQueryClient } from '@tanstack/react-query';

const EditDevice: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchDevice = async () => {
      if (!deviceId) return;
      
      try {
        const deviceData = await getDeviceById(deviceId);
        setDevice(deviceData || null);
      } catch (error) {
        console.error("Error fetching device:", error);
        toast({
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατή η ανάκτηση των στοιχείων της συσκευής.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDevice();
  }, [deviceId]);
  
  const handleSubmit = async (data: UpdateDeviceData) => {
    if (!deviceId) return;
    
    setIsSubmitting(true);
    
    try {
      await updateDevice(deviceId, data);
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', deviceId] });
      
      toast({
        title: "Επιτυχής ενημέρωση",
        description: "Τα στοιχεία της συσκευής ενημερώθηκαν επιτυχώς.",
      });
      
      navigate(`/devices/${deviceId}`);
    } catch (error) {
      console.error("Error updating device:", error);
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την ενημέρωση της συσκευής. Προσπαθήστε ξανά.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!device) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-xl mb-4">Η συσκευή δεν βρέθηκε</h2>
        <button 
          onClick={() => navigate('/devices')}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Επιστροφή στις Συσκευές
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Επεξεργασία Συσκευής</h1>
          <p className="text-muted-foreground mt-1">
            Τροποποιήστε τα στοιχεία της συσκευής παρακάτω.
          </p>
        </div>
        
        <DeviceForm
          device={device}
          clientId={device.clientId}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditDevice;
