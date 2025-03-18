import { Client } from '@/types/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Edit, Mail, Phone, MapPin, Building, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface ClientDetailsProps {
  client: Client;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client }) => {
  return (
    <Card className="w-full overflow-hidden glass-card animate-fade-in">
      <CardHeader className="bg-primary/5 pb-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">
              {client.first_name} {client.last_name}
            </CardTitle>
            {client.company && client.position && (
              <CardDescription className="mt-1">
                {client.position} στην {client.company}
              </CardDescription>
            )}
          </div>
          <Link to={`/clients/${client.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              <span>Επεξεργασία</span>
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Στοιχεία Επικοινωνίας</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{client.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{client.phone}</p>
                  <p className="text-sm text-muted-foreground">Τηλέφωνο</p>
                </div>
              </div>
              
              {(client.address || client.city || client.zip_code || client.country) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    {client.address && <p className="font-medium">{client.address}</p>}
                    {client.city && client.zip_code && (
                      <p className="font-medium">
                        {client.city}, {client.zip_code}
                      </p>
                    )}
                    {client.country && <p className="font-medium">{client.country}</p>}
                    <p className="text-sm text-muted-foreground">Διεύθυνση</p>
                  </div>
                </div>
              )}
              
              {client.company && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{client.company}</p>
                    {client.position && <p className="font-medium">{client.position}</p>}
                    <p className="text-sm text-muted-foreground">Εταιρεία</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {client.notes && (
              <>
                <h3 className="text-sm font-medium text-muted-foreground">Σημειώσεις</h3>
                <div className="rounded-md bg-muted/50 p-4">
                  <p className="text-sm whitespace-pre-line">{client.notes}</p>
                </div>
              </>
            )}
            
            <div className="space-y-2 mt-auto pt-4">
              <h3 className="text-sm font-medium text-muted-foreground">Πληροφορίες</h3>
              <div className="rounded-md bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">
                      Δημιουργήθηκε στις {format(client.created_at, 'PP', { locale: el })}
                    </p>
                    <p className="text-sm">
                      Τελευταία ενημέρωση στις {format(client.updated_at, 'PP', { locale: el })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDetails;
