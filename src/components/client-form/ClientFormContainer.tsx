
import React from 'react';
import { Form } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Client, CreateClientData, UpdateClientData } from '@/types/client';
import useClientForm from './useClientForm';
import BasicInfoFields from './BasicInfoFields';
import CompanyFields from './CompanyFields';
import AddressFields from './AddressFields';
import ClientFormActions from './ClientFormActions';

interface ClientFormContainerProps {
  client?: Client;
  onSubmit: (data: CreateClientData | UpdateClientData) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const ClientFormContainer: React.FC<ClientFormContainerProps> = ({ 
  client, 
  onSubmit, 
  isLoading = false, 
  isEditing = false 
}) => {
  const { form, activeTab, setActiveTab, handleFormSubmit } = useClientForm({
    client,
    onSubmit,
    isEditing
  });

  return (
    <Card className="w-full overflow-hidden animation-fade-in glass-card">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="basic">Βασικά Στοιχεία</TabsTrigger>
                <TabsTrigger value="company">Εταιρικά Στοιχεία</TabsTrigger>
                <TabsTrigger value="address">Διεύθυνση</TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="basic">
                <BasicInfoFields control={form.control} />
              </TabsContent>

              <TabsContent value="company">
                <CompanyFields control={form.control} />
              </TabsContent>

              <TabsContent value="address">
                <AddressFields control={form.control} />
              </TabsContent>
            </CardContent>
          </Tabs>

          <ClientFormActions isLoading={isLoading} />
        </form>
      </Form>
    </Card>
  );
};

export default ClientFormContainer;
