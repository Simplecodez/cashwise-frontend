import { Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { FloatingLabelInput } from '../ui/floating-input';

interface IInputProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  id: string;
  type?: string;
  className?: string;
  includeMessage?: boolean;
}

export function FloatingInput<T extends Record<string, any>>({
  form,
  name,
  id,
  label,
  type = 'text',
  className,
  includeMessage = false
}: IInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <FloatingLabelInput
              className={className}
              {...field}
              type={type}
              id={id}
              label={label}
            />
          </FormControl>
          {includeMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
