import { Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '../ui/label';

export interface IOption {
  value: string;
  label: string;
}

interface ISelectProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  id: string;
  className?: string;
  options: IOption[]; // ✅ Pass in dynamic options
}

export function Select<T extends Record<string, any>>({
  form,
  name,
  label,
  placeholder = 'Select an option',
  id,
  options,
  className
}: ISelectProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <Label htmlFor={id} className="my-0 text-slate-600">
              {label}
            </Label>
          )}
          <FormControl>
            <ShadcnSelect
              onValueChange={field.onChange}
              value={field.value || ''}
            >
              <SelectTrigger
                id={id}
                className={`${className} border-slate-400 px-2 text-sm`}
              >
                <SelectValue
                  className="text-base font-semibold text-gray-500"
                  placeholder={placeholder}
                />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadcnSelect>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
