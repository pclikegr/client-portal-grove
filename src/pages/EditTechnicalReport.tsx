
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TechnicalReportForm from '@/components/TechnicalReportForm';
import { toast } from '@/components/ui/use-toast';
import { TechnicalReport, UpdateTechnicalReportData } from '@/types/client';
import { getTechnicalReportById, updateTechnicalReport } from '@/data/technicalReports';
import { useQueryClient } from '@tanstack/react-query';

const EditTechnicalReport: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<TechnicalReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) return;
      
      try {
        const reportData = await getTechnicalReportById(reportId);
        if (reportData) {
          setReport(reportData);
        } else {
          setReport(null);
        }
      } catch (error) {
        console.error("Error fetching technical report:", error);
        toast({
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατή η ανάκτηση της τεχνικής αναφοράς.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [reportId]);
  
  const handleSubmit = async (data: UpdateTechnicalReportData) => {
    if (!reportId) return;
    
    setIsSubmitting(true);
    
    try {
      await updateTechnicalReport(reportId, data);
      queryClient.invalidateQueries({ queryKey: ['technical-reports'] });
      queryClient.invalidateQueries({ queryKey: ['technical-report', reportId] });
      
      toast({
        title: "Επιτυχής ενημέρωση",
        description: "Η τεχνική αναφορά ενημερώθηκε επιτυχώς.",
      });
      
      navigate(`/technical-reports/${reportId}`);
    } catch (error) {
      console.error("Error updating technical report:", error);
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε ένα πρόβλημα κατά την ενημέρωση της τεχνικής αναφοράς. Προσπαθήστε ξανά.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!report) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-xl mb-4">Η τεχνική αναφορά δεν βρέθηκε</h2>
        <button 
          onClick={() => navigate('/technical-reports')}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Επιστροφή στις Τεχνικές Αναφορές
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Επεξεργασία Τεχνικής Αναφοράς</h1>
          <p className="text-muted-foreground mt-1">
            Τροποποιήστε τα στοιχεία της τεχνικής αναφοράς παρακάτω.
          </p>
        </div>
        
        <TechnicalReportForm
          report={report}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditTechnicalReport;
