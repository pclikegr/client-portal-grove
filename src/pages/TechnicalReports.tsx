
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getTechnicalReports, deleteTechnicalReport } from '@/data/technicalReports';
import { TechnicalReport } from '@/types/client';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const TechnicalReports: React.FC = () => {
  const [reports, setReports] = useState<TechnicalReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    setReports(getTechnicalReports());
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την τεχνική έκθεση;')) {
      const success = deleteTechnicalReport(id);
      if (success) {
        setReports(getTechnicalReports());
        toast({
          title: 'Επιτυχία',
          description: 'Η τεχνική έκθεση διαγράφηκε επιτυχώς.',
        });
      } else {
        toast({
          title: 'Σφάλμα',
          description: 'Υπήρξε ένα πρόβλημα κατά τη διαγραφή της τεχνικής έκθεσης.',
          variant: 'destructive',
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Τεχνικές Εκθέσεις</h1>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Αναζήτηση τεχνικών εκθέσεων..." 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 animate-fade-in">
          {reports.length === 0 ? (
            <div className="text-center p-12">
              <p className="text-muted-foreground">Δεν βρέθηκαν τεχνικές εκθέσεις.</p>
            </div>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {report.diagnosis.substring(0, 50)}{report.diagnosis.length > 50 ? '...' : ''}
                      </h3>
                      <Badge variant={report.completed ? "default" : "secondary"} className={report.completed ? "bg-green-500 hover:bg-green-600" : ""}>
                        {report.completed ? 'Ολοκληρωμένο' : 'Σε εξέλιξη'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>ID συσκευής: {report.deviceId}</p>
                      <p>Ημερομηνία: {format(new Date(report.createdAt), 'dd/MM/yyyy')}</p>
                      {report.cost && <p>Κόστος: {report.cost}€</p>}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to={`/technical-reports/${report.id}`}>
                        <Button variant="outline" size="sm">Προβολή</Button>
                      </Link>
                      <Link to={`/technical-reports/${report.id}/edit`}>
                        <Button variant="outline" size="sm">Επεξεργασία</Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(report.id)}
                      >
                        Διαγραφή
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalReports;
