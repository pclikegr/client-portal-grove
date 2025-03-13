
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTechnicalReportById, updateTechnicalReport } from '@/data/technicalReports';
import { TechnicalReport, UpdateTechnicalReportData } from '@/types/client';
import TechnicalReportForm from '@/components/TechnicalReportForm';
import { toast } from '@/components/ui/use-toast';

const EditTechnicalReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<TechnicalReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (id) {
      const technicalReport = getTechnicalReportById(id);
      if (technicalReport) {
        setReport(technicalReport);
      } else {
        toast({
          title: 'Σφάλμα',
          description: 'Η τεχνική έκθεση δεν βρέθηκε.',
          variant: 'destructive',
        });
        navigate('/technical-reports');
      }
    }
    setIsLoading(false);
  }, [id, navigate]);
  
  const handleSubmit = (data: UpdateTechnicalReportData) => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const updatedReport = updateTechnicalReport(id, data);
      if (updatedReport) {
        toast({
          title: 'Επιτυχία',
          description: 'Η τεχνική έκθεση ενημερώθηκε επιτυχώς.',
        });
        navigate(`/technical-reports/${id}`);
      } else {
        toast({
          title: 'Σφάλμα',
          description: 'Υπήρξε ένα πρόβλημα κατά την ενημέρωση της τεχνικής έκθεσης.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Σφάλμα',
        description: 'Υπήρξε ένα πρόβλημα κατά την ενημέρωση της τεχνικής έκθεσης.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div className="min-h-screen pt-20 flex justify-center">Φόρτωση...</div>;
  }
  
  if (!report) {
    return <div className="min-h-screen pt-20 flex justify-center">Η τεχνική έκθεση δεν βρέθηκε.</div>;
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold mb-6">Επεξεργασία Τεχνικής Έκθεσης</h1>
          
          <TechnicalReportForm 
            report={report}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTechnicalReport;
