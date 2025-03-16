import { FloatingInput } from '@/components/shared/FloatingInput';
import { IOption, Select } from '@/components/shared/Select';
import { UseFormReturn } from 'react-hook-form';

interface IStepTwoProps {
  form: UseFormReturn<any>;
}

const nationalitySelectOptions: IOption[] = [
  { value: 'Nigeria', label: '🇳🇬 Nigeria' }
];

const residenceSelectOptions: IOption[] = [
  { value: 'Nigeria', label: '🇳🇬 Nigeria' }
];

export function StepTwo({ form }: IStepTwoProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold text-gray-800">ADDRESS INFO</h2>

      <FloatingInput
        form={form}
        name="address"
        id="address"
        label="Address"
        includeMessage
        className="border-slate-300"
      />

      <Select
        form={form}
        name="nationality"
        label="Nationality"
        id="nationality"
        options={nationalitySelectOptions}
      />

      <Select
        form={form}
        name="countryOfResidence"
        label="Country of Residence"
        id="countryOfResidence"
        options={residenceSelectOptions}
      />
    </section>
  );
}
