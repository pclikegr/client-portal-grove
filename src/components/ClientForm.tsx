
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client, CreateClientData, UpdateClientData } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

// Σχήμα επικύρωσης
const clientSchema = z.object({
  firstName: z.string().min(2, { message: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες' }),
  lastName: z.string().min(2, { message: 'Το επώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες' }),
  email: z.string().email({ message: 'Μη έγκυρη διεύθυνση email' }),
  phone: z.string().min(10, { message: 'Το τηλέφωνο πρέπει να έχει τουλάχιστον 10 ψηφία' }),
  company: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: CreateClientData | UpdateClientData) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, isLoading = false, isEditing = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  
  // Αρχικοποίηση φόρμας
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: client?.firstName || '',
      lastName: client?.lastName || '',
      email: client?.email || '',
      phone: client?.phone || '',
      company: client?.company || '',
      position: client?.position || '',
      address: client?.address || '',
      city: client?.city || '',
      zipCode: client?.zipCode || '',
      country: client?.country || '',
      notes: client?.notes || '',
    },
  });

  // Χειρισμός υποβολής
  const handleSubmit = (values: z.infer<typeof clientSchema>) => {
    if (isEditing && client) {
      onSubmit({
        id: client.id,
        ...values
      });
    } else {
      onSubmit(values as CreateClientData);
    }
  };

  return (
    <Card className="w-full overflow-hidden animation-fade-in glass-card">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="basic">Βασικά Στοιχεία</TabsTrigger>
                <TabsTrigger value="company">Εταιρικά Στοιχεία</TabsTrigger>
                <TabsTrigger value="address">Διεύθυνση</TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="basic" className="space-y-4 animate-slide-up">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Όνομα</FormLabel>
                        <FormControl>
                          <Input placeholder="Όνομα" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Επώνυμο</FormLabel>
                        <FormControl>
                          <Input placeholder="Επώνυμο" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Τηλέφωνο</FormLabel>
                        <FormControl>
                          <Input placeholder="Τηλέφωνο" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Σημειώσεις</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Προσθέστε σημειώσεις για τον πελάτη..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="company" className="space-y-4 animate-slide-up">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Εταιρεία</FormLabel>
                        <FormControl>
                          <Input placeholder="Όνομα εταιρείας" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Θέση</FormLabel>
                        <FormControl>
                          <Input placeholder="Θέση στην εταιρεία" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4 animate-slide-up">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Διεύθυνση</FormLabel>
                      <FormControl>
                        <Input placeholder="Οδός και αριθμός" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Πόλη</FormLabel>
                        <FormControl>
                          <Input placeholder="Πόλη" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Τ.Κ.</FormLabel>
                        <FormControl>
                          <Input placeholder="Ταχυδρομικός κώδικας" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Χώρα</FormLabel>
                        <FormControl>
                          <Input placeholder="Χώρα" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>

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
        </form>
      </Form>
    </Card>
  );
};

export default ClientForm;
