import { Path, UseFormReturn } from 'react-hook-form';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem } from '../ui/form';

interface ICheckboxProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  children: React.ReactNode;
  className?: string;
  name: Path<T>;
  isSendingOtp: boolean;
}

export function Checkbox<T extends Record<string, any>>({
  form,
  className,
  isSendingOtp,
  name,
  children
}: ICheckboxProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-100">
          <FormControl>
            <ShadcnCheckbox
              disabled={isSendingOtp}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={`${className} border border-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500`}
            />
          </FormControl>
          {children}
        </FormItem>
      )}
    />
  );
}
