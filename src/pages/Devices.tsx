
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { getDevices, deleteDevice } from '@/data/devices';
import { Device } from '@/types/client';
import { Input } from '@/components/ui/input';
import DevicesList from '@/components/DevicesList';
import { toast } from '@/components/ui/use-toast';

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    setDevices(getDevices());
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Εδώ θα μπορούσαμε να προσθέσουμε κώδικα για αναζήτηση
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή τη συσκευή;')) {
      const success = deleteDevice(id);
      if (success) {
        setDevices(getDevices());
        toast({
          title: 'Επιτυχία',
          description: 'Η συσκευή διαγράφηκε επιτυχώς.',
        });
      } else {
        toast({
          title: 'Σφάλμα',
          description: 'Υπήρξε ένα πρόβλημα κατά τη διαγραφή της συσκευής.',
          variant: 'destructive',
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Συσκευές</h1>
          
          <Link to="/devices/add">
            <Button className="gap-2 btn-hover-effect">
              <Plus className="h-4 w-4" />
              <span>Νέα Συσκευή</span>
            </Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Αναζήτηση συσκευών..." 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <DevicesList devices={devices} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Devices;
