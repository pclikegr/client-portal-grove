
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client, CreateClientData, UpdateClientData } from '@/types/client';

// Schema definition for client data validation
export const clientSchema = z.object({
  first_name: z.string().min(2, { message: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες' }),
  last_name: z.string().min(2, { message: 'Το επώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες' }),
  email: z.string().email({ message: 'Μη έγκυρη διεύθυνση email' }),
  phone: z.string().min(10, { message: 'Το τηλέφωνο πρέπει να έχει τουλάχιστον 10 ψηφία' }),
  company: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface UseClientFormProps {
  client?: Client;
  onSubmit: (data: CreateClientData | UpdateClientData) => void;
  isEditing?: boolean;
}

export const useClientForm = ({ client, onSubmit, isEditing = false }: UseClientFormProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      first_name: client?.first_name || '',
      last_name: client?.last_name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      company: client?.company || '',
      position: client?.position || '',
      address: client?.address || '',
      city: client?.city || '',
      zip_code: client?.zip_code || '',
      country: client?.country || '',
      notes: client?.notes || '',
    },
  });

  const handleFormSubmit = (values: ClientFormData) => {
    if (isEditing && client) {
      onSubmit({
        id: client.id,
        ...values
      });
    } else {
      onSubmit(values as CreateClientData);
    }
  };

  return {
    form,
    activeTab,
    setActiveTab,
    handleFormSubmit
  };
};

export default useClientForm;
