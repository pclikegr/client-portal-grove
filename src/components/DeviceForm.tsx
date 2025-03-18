import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Device, DeviceType, CreateDeviceData, UpdateDeviceData } from '@/types/client';
import { getClients } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const deviceSchema = z.object({
  clientId: z.string().min(1, { message: 'Η επιλογή πελάτη είναι υποχρεωτική' }),
  type: z.nativeEnum(DeviceType),
  brand: z.string().min(1, { message: 'Η μάρκα είναι υποχρεωτική' }),
  model: z.string().min(1, { message: 'Το μοντέλο είναι υποχρεωτικό' }),
  serialNumber: z.string().optional(),
  problem: z.string().min(5, { message: 'Η περιγραφή του προβλήματος πρέπει να έχει τουλάχιστον 5 χαρακτήρες' }),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
  receivedAt: z.date().optional(),
});

const technicalReportSchema = z.object({
  diagnosis: z.string().min(5, { message: 'Η διάγνωση πρέπει να έχει τουλάχιστον 5 χαρακτήρες' }).optional(),
  solution: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
  timeSpent: z.coerce.number().min(0).optional(),
  completed: z.boolean().default(false),
});

const combinedFormSchema = z.object({
  device: deviceSchema,
  report: technicalReportSchema,
});

interface DeviceFormProps {
  device?: Device;
  clientId?: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  isEditing?: boolean;
  includeReport?: boolean;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ 
  device, 
  clientId, 
  onSubmit, 
  isLoading = false,
  isEditing = false,
  includeReport = false
}) => {
  const navigate = useNavigate();
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState<string>("device");
  const [isReportExpanded, setIsReportExpanded] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      if (!clientId) {
        const clients = await getClients();
        setAvailableClients(clients);
      }
    };
    
    loadClients();
  }, [clientId]);
  
  const form = useForm<z.infer<typeof combinedFormSchema>>({
    resolver: zodResolver(combinedFormSchema),
    defaultValues: {
      device: {
        clientId: device?.clientId || clientId || '',
        type: device?.type || DeviceType.LAPTOP,
        brand: device?.brand || '',
        model: device?.model || '',
        serialNumber: device?.serialNumber || '',
        problem: device?.problem || '',
        status: device?.status || 'pending',
        receivedAt: device?.receivedAt || new Date(),
      },
      report: {
        diagnosis: '',
        solution: '',
        cost: undefined,
        timeSpent: undefined,
        completed: false,
      }
    },
  });

  const handleSubmit = (values: z.infer<typeof combinedFormSchema>) => {
    if (isEditing && device) {
      onSubmit({
        device: {
          id: device.id,
          ...values.device
        },
        technicalReport: isReportExpanded ? values.report : undefined
      });
    } else {
      const deviceData = values.device as CreateDeviceData;
      const reportData = isReportExpanded ? values.report : undefined;

      onSubmit({
        device: deviceData,
        technicalReport: reportData
      });
    }
  };

  return (
    <Card className="w-full overflow-hidden animation-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Στοιχεία Συσκευής</h2>
              
              {!clientId && (
                <FormField
                  control={form.control}
                  name="device.clientId"
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
                name="device.type"
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
                  name="device.brand"
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
                  name="device.model"
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
                name="device.receivedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ημερομηνία Εισαγωγής</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Επιλέξτε ημερομηνία</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="device.serialNumber"
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
                name="device.problem"
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
                  name="device.status"
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
            </div>

            {includeReport && (
              <div className="border-t pt-4 mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsReportExpanded(!isReportExpanded)} 
                  className="flex items-center w-full justify-between"
                >
                  <span className="text-left font-medium">
                    {isReportExpanded ? "Απόκρυψη δελτίου τεχνικού ελέγχου" : "Προσθήκη δελτίου τεχνικού ελέγχου"}
                  </span>
                  {isReportExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>

                {isReportExpanded && (
                  <div className="space-y-4 mt-4">
                    <h2 className="text-xl font-medium">Δελτίο Τεχνικού Ελέγχου</h2>
                    
                    <FormField
                      control={form.control}
                      name="report.diagnosis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Διάγνωση</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Καταγράψτε τη διάγνωση του προβλήμ��τος..." 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="report.solution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Λύση</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Περιγράψτε τη λύση που εφαρμόστηκε..." 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="report.cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Κόστος (€)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                {...field} 
                                value={field.value || ''}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="report.timeSpent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Χρόνος Εργασίας (ώρες)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.0" 
                                {...field}
                                value={field.value || ''} 
                                onChange={(e) => {
                                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="report.completed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ολοκληρωμένο</FormLabel>
                            <FormDescription>
                              Επιλέξτε αυτό αν η επισκευή έχει ολοκληρωθεί.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
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
