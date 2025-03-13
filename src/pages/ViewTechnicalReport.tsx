
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTechnicalReportById, deleteTechnicalReport } from '@/data/technicalReports';
import { getDeviceById } from '@/data/devices';
import { getClientById } from '@/data/clients';
import { TechnicalReport, Device, Client } from '@/types/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash } from 'lucide-react';

const ViewTechnicalReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<TechnicalReport | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const technicalReport = getTechnicalReportById(id);
      if (technicalReport) {
        setReport(technicalReport);
        const deviceData = getDeviceById(technicalReport.deviceId);
        if (deviceData) {
          setDevice(deviceData);
          const clientData = getClientById(technicalReport.clientId);
          if (clientData) {
            setClient(clientData);
          }
        }
      } else {
        toast({
          title: 'Σφάλμα',
          description: 'Η τεχνική έκθεση δεν βρέθηκε.',
          variant: 'destructive',
        });
        navigate('/technical-reports');
      }
    }
    setIsLoading(false);
  }, [id, navigate]);
  
  const handleDelete = () => {
    if (!id) return;
    
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την τεχνική έκθεση;')) {
      const success = deleteTechnicalReport(id);
      if (success) {
        toast({
          title: 'Επιτυχία',
          description: 'Η τεχνική έκθεση διαγράφηκε επιτυχώς.',
        });
        navigate('/technical-reports');
      } else {
        toast({
          title: 'Σφάλμα',
          description: 'Υπήρξε ένα πρόβλημα κατά τη διαγραφή της τεχνικής έκθεσης.',
          variant: 'destructive',
        });
      }
    }
  };
  
  if (isLoading) {
    return <div className="min-h-screen pt-20 flex justify-center">Φόρτωση...</div>;
  }
  
  if (!report) {
    return <div className="min-h-screen pt-20 flex justify-center">Η τεχνική έκθεση δεν βρέθηκε.</div>;
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6 animate-fade-in">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Πίσω
          </Button>
          <h1 className="text-2xl font-bold">Προβολή Τεχνικής Έκθεσης</h1>
        </div>
        
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Στοιχεία Έκθεσης</h2>
                <p className="text-sm text-muted-foreground">ID: {report.id}</p>
                <p className="text-sm text-muted-foreground">
                  Ημερομηνία: {format(new Date(report.createdAt), 'dd/MM/yyyy')}
                </p>
              </div>
              <Badge variant={report.completed ? "default" : "secondary"} className={report.completed ? "bg-green-500 hover:bg-green-600" : ""}>
                {report.completed ? 'Ολοκληρωμένο' : 'Σε εξέλιξη'}
              </Badge>
            </div>
            
            {client && (
              <div className="mb-6">
                <h2 className="text-md font-medium mb-2">Στοιχεία Πελάτη</h2>
                <p>
                  <span className="font-medium">Ονοματεπώνυμο:</span> {client.firstName} {client.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {client.email}
                </p>
                <p>
                  <span className="font-medium">Τηλέφωνο:</span> {client.phone}
                </p>
              </div>
            )}
            
            {device && (
              <div className="mb-6">
                <h2 className="text-md font-medium mb-2">Στοιχεία Συσκευής</h2>
                <p>
                  <span className="font-medium">Τύπος:</span> {device.type}
                </p>
                <p>
                  <span className="font-medium">Μάρκα:</span> {device.brand}
                </p>
                <p>
                  <span className="font-medium">Μοντέλο:</span> {device.model}
                </p>
                {device.serialNumber && (
                  <p>
                    <span className="font-medium">Serial Number:</span> {device.serialNumber}
                  </p>
                )}
                <p>
                  <span className="font-medium">Περιγραφή Προβλήματος:</span> {device.problem}
                </p>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-md font-medium mb-2">Διάγνωση</h2>
              <p className="whitespace-pre-wrap">{report.diagnosis}</p>
            </div>
            
            {report.solution && (
              <div className="mb-6">
                <h2 className="text-md font-medium mb-2">Λύση</h2>
                <p className="whitespace-pre-wrap">{report.solution}</p>
              </div>
            )}
            
            {(report.cost !== undefined || report.timeSpent !== undefined) && (
              <div className="mb-6">
                <h2 className="text-md font-medium mb-2">Κόστος & Χρόνος</h2>
                {report.cost !== undefined && (
                  <p>
                    <span className="font-medium">Κόστος:</span> {report.cost}€
                  </p>
                )}
                {report.timeSpent !== undefined && (
                  <p>
                    <span className="font-medium">Χρόνος Εργασίας:</span> {report.timeSpent} ώρες
                  </p>
                )}
              </div>
            )}
            
            <div className="flex space-x-2 mt-6">
              <Link to={`/technical-reports/${report.id}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-1 h-4 w-4" /> Επεξεργασία
                </Button>
              </Link>
              <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleDelete}>
                <Trash className="mr-1 h-4 w-4" /> Διαγραφή
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewTechnicalReport;
