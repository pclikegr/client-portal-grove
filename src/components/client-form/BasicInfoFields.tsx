
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoFieldsProps {
  control: Control<any>;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="first_name"
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
          control={control}
          name="last_name"
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
          control={control}
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
          control={control}
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
        control={control}
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
    </div>
  );
};

export default BasicInfoFields;
