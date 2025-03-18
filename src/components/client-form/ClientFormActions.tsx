
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
        {isLoading ? 'Αποθήκευση...' : 'Αποθήκευση'}
      </Button>
    </div>
  );
};

export default ClientFormActions;
