
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDeviceById, updateDevice } from '@/data/devices';
import { Device, UpdateDeviceData } from '@/types/client';
import DeviceForm from '@/components/DeviceForm';
import { toast } from '@/components/ui/use-toast';

const EditDevice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  
  useEffect(() => {
    if (!id) {
      setIsNotFound(true);
      return;
    }
    
    const deviceData = getDeviceById(id);
    
    if (!deviceData) {
      setIsNotFound(true);
      toast({
        title: "Σφάλμα",
        description: "Η συσκευή δεν βρέθηκε.",
        variant: "destructive",
      });
    } else {
      setDevice(deviceData);
    }
  }, [id]);
  
  const handleSubmit = (data: UpdateDeviceData) => {
    if (!id) return;
    
    setIsLoading(true);
    
    try {
      const updatedDevice = updateDevice(id, data);
      
      if (updatedDevice) {
        toast({
          title: "Επιτυχής ενημέρωση",
          description: "Τα στοιχεία της συσκευής ενημερώθηκαν επιτυχώς.",
        });
        
        navigate(`/devices/${id}`);
      } else {
        throw new Error('Αποτυχία ενημέρωσης συσκευής');
      }
    } catch (error) {
      console.error('Σφάλμα κατά την ενημέρωση:', error);
      
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την ενημέρωση της συσκευής.",
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
          <h1 className="text-2xl font-bold mb-4">Η συσκευή δεν βρέθηκε</h1>
          <p className="text-muted-foreground mb-6">
            Η συσκευή που προσπαθείτε να επεξεργαστείτε δεν υπάρχει ή έχει διαγραφεί.
          </p>
          <button 
            onClick={() => navigate('/devices')}
            className="text-primary hover:underline"
          >
            Επιστροφή στη λίστα συσκευών
          </button>
        </div>
      </div>
    );
  }
  
  if (!device) {
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
          <h1 className="text-2xl font-bold">Επεξεργασία Συσκευής</h1>
          <p className="text-muted-foreground mt-1">
            Επεξεργαστείτε τα στοιχεία της συσκευής {device.brand} {device.model}.
          </p>
        </div>
        
        <DeviceForm 
          device={device} 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditDevice;
