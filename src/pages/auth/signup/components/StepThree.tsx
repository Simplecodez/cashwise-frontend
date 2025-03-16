import { FloatingInput } from '@/components/shared/FloatingInput';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface IStepThreeProps {
  form: UseFormReturn<any>;
}

export function StepThree({ form }: IStepThreeProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <section className="space-y-5">
      <h1 className="font-semibold text-gray-800">PASSWORD SETUP</h1>

      <div className="relative h-full w-full">
        <FloatingInput
          type={showPassword ? 'text' : 'password'}
          form={form}
          name="password"
          id="password"
          label="Password"
          includeMessage
          className="border-slate-300"
        />

        <span
          className="absolute right-3 top-[20px] z-30 -translate-y-1/2 cursor-pointer text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

      <div className="relative h-full w-full">
        <FloatingInput
          type={showConfirmPassword ? 'text' : 'password'}
          form={form}
          name="confirmPassword"
          id="confirmPassword"
          label="Confirm Password"
          includeMessage
          className="border-slate-300"
        />

        <span
          className="absolute right-3 top-[20px] -translate-y-1/2 cursor-pointer text-gray-500"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>
    </section>
  );
}
