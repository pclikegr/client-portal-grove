
import React from 'react';
import { Client, CreateClientData, UpdateClientData } from '@/types/client';
import ClientFormContainer from './client-form/ClientFormContainer';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: CreateClientData | UpdateClientData) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  client, 
  onSubmit, 
  isLoading = false, 
  isEditing = false 
}) => {
  // Simplified wrapper component that passes props to the container
  return (
    <ClientFormContainer
      client={client}
      onSubmit={onSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
    />
  );
};

export default ClientForm;
