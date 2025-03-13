
import React from 'react';
import { Link } from 'react-router-dom';
import { Device, DeviceType } from '@/types/client';
import { formatDistanceToNow } from 'date-fns';
import { el } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pen, Trash2, FileText, Laptop, Smartphone, Tablet, Monitor, HardDrive } from 'lucide-react';

interface DevicesListProps {
  devices: Device[];
  onDelete?: (id: string) => void;
}

const DevicesList: React.FC<DevicesListProps> = ({ devices, onDelete }) => {
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case DeviceType.LAPTOP:
        return <Laptop className="h-5 w-5" />;
      case DeviceType.MOBILE:
        return <Smartphone className="h-5 w-5" />;
      case DeviceType.TABLET:
        return <Tablet className="h-5 w-5" />;
      case DeviceType.DESKTOP:
        return <Monitor className="h-5 w-5" />;
      default:
        return <HardDrive className="h-5 w-5" />;
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

  if (devices.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/40 rounded-lg">
        <p className="text-muted-foreground">Δεν βρέθηκαν συσκευές</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {devices.map((device) => (
        <Card key={device.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(device.type)}
                  <h3 className="font-semibold">
                    {device.brand} {device.model}
                  </h3>
                </div>
                {getStatusBadge(device.status)}
              </div>
              
              <div className="text-sm text-muted-foreground mb-3">
                <p>Τύπος: {getDeviceTypeName(device.type)}</p>
                {device.serialNumber && <p>S/N: {device.serialNumber}</p>}
              </div>
              
              <p className="text-sm mb-2 line-clamp-2">
                <strong>Πρόβλημα:</strong> {device.problem}
              </p>
              
              <p className="text-xs text-muted-foreground">
                Καταχωρήθηκε: {formatDistanceToNow(new Date(device.createdAt), { addSuffix: true, locale: el })}
              </p>
            </div>
            
            <div className="bg-muted/20 p-2 flex items-center justify-between border-t">
              <div>
                {device.technicalReportId ? (
                  <Link to={`/technical-reports/${device.technicalReportId}`}>
                    <Button size="sm" variant="ghost" className="gap-1 h-8">
                      <FileText className="h-4 w-4" />
                      <span>Δελτίο</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to={`/devices/${device.id}/technical-report/add`}>
                    <Button size="sm" variant="ghost" className="gap-1 h-8">
                      <FileText className="h-4 w-4" />
                      <span>Προσθήκη Δελτίου</span>
                    </Button>
                  </Link>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Link to={`/devices/${device.id}`}>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                
                <Link to={`/devices/${device.id}/edit`}>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Pen className="h-4 w-4" />
                  </Button>
                </Link>
                
                {onDelete && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => onDelete(device.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DevicesList;
