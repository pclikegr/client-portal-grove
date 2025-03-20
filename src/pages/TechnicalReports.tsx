
import React, { useState, useEffect } from 'react';
import { getTechnicalReports } from '@/data/technicalReports';
import { TechnicalReport } from '@/types/client';
import TechnicalReportsList from '@/components/TechnicalReportsList';

const TechnicalReports: React.FC = () => {
  const [reports, setReports] = useState<TechnicalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getTechnicalReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch technical reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    try {
      // Currently we don't have a search function for technical reports
      // This would be implemented in the future
      const data = await getTechnicalReports();
      // Filter reports client-side for now
      const filteredData = data.filter(report => 
        report.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
        report.solution?.toLowerCase().includes(query.toLowerCase())
      );
      setReports(filteredData);
    } catch (error) {
      console.error("Failed to search technical reports:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-20">
      <h1 className="text-2xl font-bold mb-6">Τεχνικές Αναφορές</h1>
      
      <TechnicalReportsList 
        reports={reports}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default TechnicalReports;
