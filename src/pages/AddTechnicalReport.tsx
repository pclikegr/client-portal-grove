
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addTechnicalReport } from '@/data/technicalReports';
import { getDeviceById } from '@/data/devices';
import { getClientById } from '@/data/clients';
import { CreateTechnicalReportData, Device, Client } from '@/types/client';
import TechnicalReportForm from '@/components/TechnicalReportForm';
import { toast } from '@/components/ui/use-toast';

const AddTechnicalReport: React.FC = () => {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  
  useEffect(() => {
    if (!deviceId) {
      toast({
        title: "Σφάλμα",
        description: "Δεν βρέθηκε η συσκευή.",
        variant: "destructive",
      });
      navigate('/devices');
      return;
    }
    
    const deviceData = getDeviceById(deviceId);
    if (!deviceData) {
      toast({
        title: "Σφάλμα",
        description: "Η συσκευή δεν βρέθηκε.",
        variant: "destructive",
      });
      navigate('/devices');
      return;
    }
    
    setDevice(deviceData);
    
    // Φορτώνουμε τον πελάτη
    const clientData = getClientById(deviceData.clientId);
    if (clientData) {
      setClient(clientData);
    }
  }, [deviceId, navigate]);
  
  const handleSubmit = (data: CreateTechnicalReportData) => {
    setIsLoading(true);
    
    try {
      const newReport = addTechnicalReport(data);
      
      toast({
        title: "Επιτυχής προσθήκη",
        description: "Το δελτίο τεχνικού ελέγχου προστέθηκε επιτυχώς.",
      });
      
      navigate(`/devices/${deviceId}`);
    } catch (error) {
      console.error('Σφάλμα κατά την προσθήκη:', error);
      
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την προσθήκη του δελτίου.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!device || !client) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 animate-pulse">
            <div className="h-8 w-64 bg-muted rounded mb-2"></div>
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
          <h1 className="text-2xl font-bold">Νέο Δελτίο Τεχνικού Ελέγχου</h1>
          <p className="text-muted-foreground mt-1">
            Συσκευή: {device.brand} {device.model} | Πελάτης: {client.firstName} {client.lastName}
          </p>
        </div>
        
        <TechnicalReportForm
          deviceId={deviceId}
          clientId={client.id}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AddTechnicalReport;
