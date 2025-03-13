
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TechnicalReport, CreateTechnicalReportData, UpdateTechnicalReportData } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Card, CardContent } from '@/components/ui/card';

// Σχήμα επικύρωσης
const technicalReportSchema = z.object({
  diagnosis: z.string().min(5, { message: 'Η διάγνωση πρέπει να έχει τουλάχιστον 5 χαρακτήρες' }),
  solution: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
  timeSpent: z.coerce.number().min(0).optional(),
  completed: z.boolean().default(false),
});

interface TechnicalReportFormProps {
  report?: TechnicalReport;
  deviceId?: string;
  clientId?: string;
  onSubmit: (data: CreateTechnicalReportData | UpdateTechnicalReportData) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const TechnicalReportForm: React.FC<TechnicalReportFormProps> = ({ 
  report, 
  deviceId,
  clientId,
  onSubmit, 
  isLoading = false,
  isEditing = false 
}) => {
  const navigate = useNavigate();
  
  // Αρχικοποίηση φόρμας
  const form = useForm<z.infer<typeof technicalReportSchema>>({
    resolver: zodResolver(technicalReportSchema),
    defaultValues: {
      diagnosis: report?.diagnosis || '',
      solution: report?.solution || '',
      cost: report?.cost || undefined,
      timeSpent: report?.timeSpent || undefined,
      completed: report?.completed || false,
    },
  });

  // Χειρισμός υποβολής
  const handleSubmit = (values: z.infer<typeof technicalReportSchema>) => {
    if (isEditing && report) {
      onSubmit({
        id: report.id,
        ...values
      });
    } else {
      onSubmit({
        deviceId: deviceId || '',
        clientId: clientId || '',
        ...values
      });
    }
  };

  return (
    <Card className="w-full overflow-hidden animation-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Διάγνωση</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Καταγράψτε τη διάγνωση του προβλήματος..." 
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
              name="solution"
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
                name="cost"
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
                name="timeSpent"
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
              name="completed"
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

export default TechnicalReportForm;
