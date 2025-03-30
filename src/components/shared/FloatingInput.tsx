import { Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { FloatingLabelInput } from '../ui/floating-input';

interface IInputProps {
  form: UseFormReturn<any>;
  inputMode?: string;
  name: Path<any>;
  label?: string;
  id: string;
  type?: string;
  className?: string;
  includeMessage?: boolean;
}

export function FloatingInput({
  form,
  name,
  id,
  inputMode,
  label,
  type = 'text',
  className,
  includeMessage = false
}: IInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <FloatingLabelInput
              inputMode={inputMode ? (inputMode as 'numeric') : 'text'}
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
