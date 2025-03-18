
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ClientFormActionsProps {
  isLoading: boolean;
}

const ClientFormActions: React.FC<ClientFormActionsProps> = ({ isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-end gap-4 p-6 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate(-1)}
        disabled={isLoading}
      >
        Ακύρωση
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Αποθήκευση...
          </>
        ) : 'Αποθήκευση'}
      </Button>
    </div>
  );
};

export default ClientFormActions;
