
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
    const loadReport = async () => {
      if (id) {
        try {
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
        } catch (error) {
          console.error("Error loading technical report:", error);
          toast({
            title: 'Σφάλμα',
            description: 'Υπήρξε ένα πρόβλημα κατά τη φόρτωση της τεχνικής έκθεσης.',
            variant: 'destructive',
          });
          navigate('/technical-reports');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadReport();
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
      console.error("Error updating technical report:", error);
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
    return <div className="min-h-screen pt-20 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2">Φόρτωση...</span>
    </div>;
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
