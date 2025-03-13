
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTechnicalReportById, deleteTechnicalReport } from '@/data/technicalReports';
import { getDeviceById } from '@/data/devices';
import { TechnicalReport, Device } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, ArrowLeft, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const ViewTechnicalReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<TechnicalReport | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const technicalReport = getTechnicalReportById(id);
      if (technicalReport) {
        setReport(technicalReport);
        const associatedDevice = getDeviceById(technicalReport.deviceId);
        if (associatedDevice) {
          setDevice(associatedDevice);
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
    if (id && window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την τεχνική έκθεση;')) {
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
        <div className="mb-6 flex items-center justify-between animate-fade-in">
          <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Πίσω
          </Button>
          
          <div className="flex gap-2">
            <Link to={`/technical-reports/${id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Pencil size={16} />
                Επεξεργασία
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Διαγραφή
            </Button>
          </div>
        </div>
        
        <div className="mb-6 animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Wrench size={20} /> 
                  Τεχνική Έκθεση
                </CardTitle>
                <Badge variant={report.completed ? "success" : "secondary"}>
                  {report.completed ? 'Ολοκληρωμένο' : 'Σε εξέλιξη'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ημερομηνία δημιουργίας</p>
                  <p className="font-medium">{format(new Date(report.createdAt), 'dd/MM/yyyy')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Τελευταία ενημέρωση</p>
                  <p className="font-medium">{format(new Date(report.updatedAt), 'dd/MM/yyyy')}</p>
                </div>
                
                {report.cost && (
                  <div>
                    <p className="text-sm text-muted-foreground">Κόστος</p>
                    <p className="font-medium">{report.cost}€</p>
                  </div>
                )}
                
                {report.timeSpent && (
                  <div>
                    <p className="text-sm text-muted-foreground">Χρόνος εργασίας</p>
                    <p className="font-medium">{report.timeSpent} ώρες</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Διάγνωση</p>
                <div className="p-3 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{report.diagnosis}</p>
                </div>
              </div>
              
              {report.solution && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Λύση</p>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="whitespace-pre-wrap">{report.solution}</p>
                  </div>
                </div>
              )}
              
              {device && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Στοιχεία Συσκευής</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Τύπος</p>
                      <p className="font-medium">{device.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Μάρκα/Μοντέλο</p>
                      <p className="font-medium">{device.brand} {device.model}</p>
                    </div>
                    {device.serialNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Σειριακός Αριθμός</p>
                        <p className="font-medium">{device.serialNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Πρόβλημα</p>
                      <p className="font-medium">{device.problem}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link to={`/devices/${device.id}`}>
                      <Button variant="link" className="p-0 h-auto">Προβολή συσκευής</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewTechnicalReport;
