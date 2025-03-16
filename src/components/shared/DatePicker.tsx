import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { UseFormReturn, Path } from 'react-hook-form';

interface IDatePickerProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>; // Ensures `name` matches the form fields
  label?: string;
  fromYear?: number;
  toYear?: number;
  description?: string;
}

export function DatePicker<T extends Record<string, any>>({
  form,
  name,
  label = 'Select Date',
  fromYear = 1900,
  // toYear = new Date().getFullYear(),
  description
}: IDatePickerProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-slate-600">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full border-slate-300 pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>Pick a date</span>
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
                captionLayout="dropdown"
                fromMonth={new Date(1990)}
                toMonth={new Date()}
                className="w-full rounded-lg border p-4 shadow-md"
                classNames={{
                  caption: 'flex justify-center flex-row gap-4' // Month & year dropdowns side by side
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date(`${fromYear}-01-01`)
                }
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
