import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Client } from '@/types/client';
import { Search, Eye, Edit, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface ClientsTableProps {
  clients: Client[];
  onDelete: (id: string) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Client>('last_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredClients = clients.filter(client => {
    const query = searchQuery.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.includes(query) ||
      (client.company && client.company.toLowerCase().includes(query))
    );
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    
    if (fieldA === undefined || fieldB === undefined) return 0;
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA);
    } else if (fieldA instanceof Date && fieldB instanceof Date) {
      return sortDirection === 'asc' 
        ? fieldA.getTime() - fieldB.getTime() 
        : fieldB.getTime() - fieldA.getTime();
    }
    
    return 0;
  });

  const handleSort = (field: keyof Client) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτόν τον πελάτη;')) {
      onDelete(id);
      toast({
        title: "Επιτυχής διαγραφή",
        description: "Ο πελάτης διαγράφηκε επιτυχώς.",
      });
    }
  };

  const SortIcon = ({ field }: { field: keyof Client }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Αναζήτηση πελατών..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden transition-all duration-300 glass-card animate-slide-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th 
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('last_name')}
                >
                  <div className="flex items-center">
                    <span>Ονοματεπώνυμο</span>
                    <SortIcon field="last_name" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    <span>Email</span>
                    <SortIcon field="email" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center">
                    <span>Τηλέφωνο</span>
                    <SortIcon field="phone" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('company')}
                >
                  <div className="flex items-center">
                    <span>Εταιρεία</span>
                    <SortIcon field="company" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.length > 0 ? (
                sortedClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {client.last_name} {client.first_name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {client.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {client.phone}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {client.company || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/clients/${client.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/clients/${client.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    {searchQuery 
                      ? `Δεν βρέθηκαν πελάτες που να ταιριάζουν με "${searchQuery}"`
                      : 'Δεν υπάρχουν καταχωρημένοι πελάτες'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ClientsTable;
