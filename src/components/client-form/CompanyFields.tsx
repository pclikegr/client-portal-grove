
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface CompanyFieldsProps {
  control: Control<any>;
}

const CompanyFields: React.FC<CompanyFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
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
          control={control}
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
    </div>
  );
};

export default CompanyFields;
