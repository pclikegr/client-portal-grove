
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TechnicalReport } from '@/types/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface TechnicalReportsListProps {
  reports: TechnicalReport[];
  searchQuery: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const TechnicalReportsList: React.FC<TechnicalReportsListProps> = ({ 
  reports, 
  searchQuery,
  onSearch,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
  };
  
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle>Λίστα Τεχνικών Αναφορών</CardTitle>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
              <Input
                type="text"
                placeholder="Αναζήτηση με διάγνωση/λύση..."
                value={localSearch}
                onChange={handleSearchInput}
                className="w-full"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Δεν βρέθηκαν τεχνικές αναφορές</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Διάγνωση</TableHead>
                  <TableHead>Συσκευή</TableHead>
                  <TableHead>Κατάσταση</TableHead>
                  <TableHead>Κόστος</TableHead>
                  <TableHead>Ημερομηνία</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id.slice(0, 8)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{report.diagnosis}</TableCell>
                    <TableCell>{report.deviceId.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Badge variant={report.completed ? "success" : "secondary"}>
                        {report.completed ? "Ολοκληρωμένο" : "Σε εξέλιξη"}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.cost} €</TableCell>
                    <TableCell>
                      {format(new Date(report.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/technical-reports/${report.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/technical-reports/${report.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalReportsList;
