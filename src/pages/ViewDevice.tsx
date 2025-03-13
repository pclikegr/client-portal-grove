
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getDeviceById, deleteDevice } from '@/data/devices';
import { getClientById } from '@/data/clients';
import { getTechnicalReportByDeviceId } from '@/data/technicalReports';
import { Device, Client, TechnicalReport, DeviceType } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, Trash2, FileText, Laptop, Smartphone, Tablet, Monitor, HardDrive, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { el } from 'date-fns/locale';

const ViewDevice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [report, setReport] = useState<TechnicalReport | null>(null);
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
      
      // Φορτώνουμε τον πελάτη
      const clientData = getClientById(deviceData.clientId);
      if (clientData) {
        setClient(clientData);
      }
      
      // Φορτώνουμε το δελτίο τεχνικού ελέγχου αν υπάρχει
      if (deviceData.technicalReportId) {
        const reportData = getTechnicalReportByDeviceId(deviceData.id);
        if (reportData) {
          setReport(reportData);
        }
      }
    }
  }, [id]);
  
  const handleDelete = () => {
    if (!id) return;
    
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή τη συσκευή;')) {
      const success = deleteDevice(id);
      
      if (success) {
        toast({
          title: "Επιτυχής διαγραφή",
          description: "Η συσκευή διαγράφηκε επιτυχώς.",
        });
        
        navigate('/devices');
      } else {
        toast({
          title: "Σφάλμα",
          description: "Υπήρξε ένα πρόβλημα κατά τη διαγραφή της συσκευής.",
          variant: "destructive",
        });
      }
    }
  };
  
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case DeviceType.LAPTOP:
        return <Laptop className="h-6 w-6" />;
      case DeviceType.MOBILE:
        return <Smartphone className="h-6 w-6" />;
      case DeviceType.TABLET:
        return <Tablet className="h-6 w-6" />;
      case DeviceType.DESKTOP:
        return <Monitor className="h-6 w-6" />;
      default:
        return <HardDrive className="h-6 w-6" />;
    }
  };
  
  const getDeviceTypeName = (type: DeviceType) => {
    switch (type) {
      case DeviceType.LAPTOP:
        return 'Laptop';
      case DeviceType.MOBILE:
        return 'Κινητό';
      case DeviceType.TABLET:
        return 'Tablet';
      case DeviceType.DESKTOP:
        return 'Desktop';
      default:
        return 'Άλλο';
    }
  };
  
  const getStatusBadge = (status: string) => {
    let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'outline';
    let label = '';
    
    switch (status) {
      case 'pending':
        variant = 'outline';
        label = 'Σε αναμονή';
        break;
      case 'in_progress':
        variant = 'secondary';
        label = 'Σε εξέλιξη';
        break;
      case 'completed':
        variant = 'default';
        label = 'Ολοκληρώθηκε';
        break;
      case 'cancelled':
        variant = 'destructive';
        label = 'Ακυρώθηκε';
        break;
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };
  
  if (isNotFound) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Η συσκευή δεν βρέθηκε</h1>
          <p className="text-muted-foreground mb-6">
            Η συσκευή που προσπαθείτε να προβάλετε δεν υπάρχει ή έχει διαγραφεί.
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
          </div>
          <div className="w-full h-[400px] bg-card animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/devices')}
              className="h-8 w-8 mr-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Στοιχεία Συσκευής</h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Διαγραφή</span>
          </Button>
        </div>
        
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {getDeviceIcon(device.type)}
                <CardTitle className="text-xl font-bold">
                  {device.brand} {device.model}
                </CardTitle>
              </div>
              {getStatusBadge(device.status)}
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Τύπος</p>
                  <p>{getDeviceTypeName(device.type)}</p>
                </div>
                
                {device.serialNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Σειριακός Αριθμός</p>
                    <p>{device.serialNumber}</p>
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Πρόβλημα</p>
                  <p className="mt-1">{device.problem}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ημερομηνία Καταχώρησης</p>
                  <p>{formatDistanceToNow(new Date(device.createdAt), { addSuffix: true, locale: el })}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Τελευταία Ενημέρωση</p>
                  <p>{formatDistanceToNow(new Date(device.updatedAt), { addSuffix: true, locale: el })}</p>
                </div>
                
                <div className="md:col-span-2 pt-4">
                  <Link to={`/devices/${device.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Επεξεργασία
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {client && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <CardTitle className="text-lg">Στοιχεία Πελάτη</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Όνομα</p>
                    <p>{client.firstName} {client.lastName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{client.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Τηλέφωνο</p>
                    <p>{client.phone}</p>
                  </div>
                  
                  {client.company && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Εταιρεία</p>
                      <p>{client.company}</p>
                    </div>
                  )}
                  
                  <div className="md:col-span-2 pt-2">
                    <Link to={`/clients/${client.id}`}>
                      <Button variant="outline" size="sm">
                        Προβολή Πελάτη
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {report ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle className="text-lg">Δελτίο Τεχνικού Ελέγχου</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Διάγνωση</p>
                    <p className="mt-1">{report.diagnosis}</p>
                  </div>
                  
                  {report.solution && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Λύση</p>
                      <p className="mt-1">{report.solution}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.cost !== undefined && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Κόστος</p>
                        <p>{report.cost}€</p>
                      </div>
                    )}
                    
                    {report.timeSpent !== undefined && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Χρόνος Εργασίας</p>
                        <p>{report.timeSpent} ώρες</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Link to={`/technical-reports/${report.id}`}>
                      <Button variant="outline" size="sm">
                        Προβολή Δελτίου
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Δεν υπάρχει δελτίο τεχνικού ελέγχου</h3>
              <p className="text-muted-foreground mb-4">
                Αυτή η συσκευή δεν έχει συνδεδεμένο δελτίο τεχνικού ελέγχου ακόμα.
              </p>
              <Link to={`/devices/${device.id}/technical-report/add`}>
                <Button variant="outline" size="sm">
                  Προσθήκη Δελτίου
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDevice;
