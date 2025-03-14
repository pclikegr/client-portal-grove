
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Device, DeviceType, CreateDeviceData, UpdateDeviceData } from '@/types/client';
import { getClients } from '@/data/clients';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

// Σχήμα επικύρωσης
const deviceSchema = z.object({
  clientId: z.string().min(1, { message: 'Η επιλογή πελάτη είναι υποχρεωτική' }),
  type: z.nativeEnum(DeviceType),
  brand: z.string().min(1, { message: 'Η μάρκα είναι υποχρεωτική' }),
  model: z.string().min(1, { message: 'Το μοντέλο είναι υποχρεωτικό' }),
  serialNumber: z.string().optional(),
  problem: z.string().min(5, { message: 'Η περιγραφή του προβλήματος πρέπει να έχει τουλάχιστον 5 χαρακτήρες' }),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
});

interface DeviceFormProps {
  device?: Device;
  clientId?: string;
  onSubmit: (data: CreateDeviceData | UpdateDeviceData) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ 
  device, 
  clientId, 
  onSubmit, 
  isLoading = false,
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const [availableClients, setAvailableClients] = useState([]);
  
  // Φόρτωση πελατών όταν απαιτείται επιλογή πελάτη
  useEffect(() => {
    if (!clientId) {
      setAvailableClients(getClients());
    }
  }, [clientId]);
  
  // Αρχικοποίηση φόρμας
  const form = useForm<z.infer<typeof deviceSchema>>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      clientId: device?.clientId || clientId || '',
      type: device?.type || DeviceType.LAPTOP,
      brand: device?.brand || '',
      model: device?.model || '',
      serialNumber: device?.serialNumber || '',
      problem: device?.problem || '',
      status: device?.status || 'pending',
    },
  });

  // Χειρισμός υποβολής
  const handleSubmit = (values: z.infer<typeof deviceSchema>) => {
    if (isEditing && device) {
      onSubmit({
        id: device.id,
        ...values
      });
    } else {
      onSubmit(values as CreateDeviceData);
    }
  };

  return (
    <Card className="w-full overflow-hidden animation-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="p-6 space-y-4">
            {/* Επιλογή πελάτη - Εμφανίζεται μόνο όταν δεν υπάρχει προκαθορισμένος πελάτης */}
            {!clientId && (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Πελάτης</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Επιλέξτε πελάτη" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableClients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.firstName} {client.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τύπος Συσκευής</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε τύπο συσκευής" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DeviceType.LAPTOP}>Laptop</SelectItem>
                      <SelectItem value={DeviceType.MOBILE}>Κινητό</SelectItem>
                      <SelectItem value={DeviceType.TABLET}>Tablet</SelectItem>
                      <SelectItem value={DeviceType.DESKTOP}>Desktop</SelectItem>
                      <SelectItem value={DeviceType.OTHER}>Άλλο</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Μάρκα</FormLabel>
                    <FormControl>
                      <Input placeholder="π.χ. Apple, Samsung, Dell" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Μοντέλο</FormLabel>
                    <FormControl>
                      <Input placeholder="π.χ. iPhone 12, Galaxy S21" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Σειριακός Αριθμός</FormLabel>
                  <FormControl>
                    <Input placeholder="Serial Number (προαιρετικό)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Περιγραφή Προβλήματος</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Περιγράψτε το πρόβλημα της συσκευής..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Κατάσταση</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Επιλέξτε κατάσταση" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Σε αναμονή</SelectItem>
                        <SelectItem value="in_progress">Σε εξέλιξη</SelectItem>
                        <SelectItem value="completed">Ολοκληρώθηκε</SelectItem>
                        <SelectItem value="cancelled">Ακυρώθηκε</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>

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

export default DeviceForm;
