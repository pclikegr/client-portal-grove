
import React, { useState, useEffect } from 'react';
import { getDevices, searchDevices } from '@/data/devices';
import DevicesList from '@/components/DevicesList';
import { Device } from '@/types/client';

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDevices();
  }, []);
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    try {
      const data = await searchDevices(query);
      setDevices(data);
    } catch (error) {
      console.error("Failed to search devices:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-20">
      <h1 className="text-2xl font-bold mb-6">Διαχείριση Συσκευών</h1>
      
      <DevicesList 
        devices={devices}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default Devices;
