import { DatePicker } from '@/components/shared/DatePicker';
import { FloatingInput } from '@/components/shared/FloatingInput';
import { IOption, Select } from '@/components/shared/Select';
import { UseFormReturn } from 'react-hook-form';

interface IStepOneProps {
  form: UseFormReturn<any>;
}

const genderSelectOptions: IOption[] = [{ value: 'male', label: 'Male' }];

export function StepOne({ form }: IStepOneProps) {
  return (
    <section className="space-y-5">
      <h1 className="font-semibold text-gray-700">PERSONAL INFO</h1>
      <FloatingInput
        form={form}
        name="firstName"
        id="firstname"
        label="First name"
        includeMessage
        className="border-slate-300"
      />
      <FloatingInput
        form={form}
        name="lastName"
        id="lastname"
        label="Last name"
        includeMessage
        className="border-slate-300"
      />

      <FloatingInput
        form={form}
        name="username"
        id="username"
        label="Username"
        includeMessage
        className="border-slate-300"
      />

      <FloatingInput
        form={form}
        name="email"
        id="email"
        label="Email"
        includeMessage
        className="border-slate-300"
      />

      <DatePicker
        form={form}
        name="dateOfBirth"
        label="Date of Birth"
        fromYear={1900}
        toYear={new Date().getFullYear()}
      />

      <Select
        form={form}
        name="gender"
        label="Gender"
        id="gender"
        options={genderSelectOptions}
      />
    </section>
  );
}
