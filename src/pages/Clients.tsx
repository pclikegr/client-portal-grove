
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import ClientsTable from '@/components/ClientsTable';
import { deleteClient, getClients, searchClients } from '@/data/clients';
import { Client } from '@/types/client';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  
  useEffect(() => {
    setClients(getClients());
  }, []);
  
  const handleDelete = (id: string) => {
    const success = deleteClient(id);
    if (success) {
      setClients(getClients());
    }
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Πελάτες</h1>
          
          <Link to="/clients/add">
            <Button className="gap-2 btn-hover-effect">
              <UserPlus className="h-4 w-4" />
              <span>Νέος Πελάτης</span>
            </Button>
          </Link>
        </div>
        
        <ClientsTable 
          clients={clients} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default Clients;
