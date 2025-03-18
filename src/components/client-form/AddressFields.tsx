
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface AddressFieldsProps {
  control: Control<any>;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4 animate-slide-up">
      <FormField
        control={control}
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
          control={control}
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
          control={control}
          name="zip_code"
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
          control={control}
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
    </div>
  );
};

export default AddressFields;
