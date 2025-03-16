import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSendOtp, useVerifyOtp } from '@/api/user';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { OtpForm } from '@/pages/auth/signup/components/OtpForm';
import { useState } from 'react';
import { IOption, Select } from '@/components/shared/Select';
import { FloatingInput } from '@/components/shared/FloatingInput';
import { Accordion } from '@/components/shared/Accordion';
import { Checkbox } from '@/components/shared/CheckBox';

const formSchema = zod.object({
  phoneNumber: zod
    .string()
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits'),
  countryCode: zod
    .string()
    .min(2, 'Invalid country code')
    .max(7, 'Invalid country code'),
  inviteCode: zod
    .string()
    .min(2, 'Invite code too short')
    .max(5, 'Invite code too long')
    .or(zod.literal(''))
    .optional(),
  terms: zod.boolean().refine((val) => val, 'You must accept the terms')
});

const countryCodeSelectOptions: IOption[] = [
  { value: '+123-NG', label: '🇳🇬 Nigeria' }
];

export function ValidatePhonenumber() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const { mutate: sendOtp, isLoading: isSendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isLoading: isVerifyingOtp } =
    useVerifyOtp('phonenumber');

  const { enqueueSnackbar } = useSnackbar();
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      countryCode: '',
      inviteCode: '',
      terms: false
    },
    mode: 'onChange'
  });

  const {
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = form;
  const isChecked = watch('terms');

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    const { phoneNumber, countryCode } = values;
    const extractedCountryCode = countryCode.split('-')[1];
    const inputData = { phoneNumber, countryCode: extractedCountryCode };

    try {
      const result = await sendOtp(inputData);
      if (result.status === 'success') {
        enqueueSnackbar(result.data.message, {
          variant: 'success'
        });

        setTimeout(() => {
          setIsOtpSent((state) => !state);
          setSessionId(result.data.sessionId);
        }, 3000);
      } else if (result.status === 'fail') {
        return enqueueSnackbar(`${(result as any).message}.`, {
          variant: 'error'
        });
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log(error);

        if (error.code === 'ERR_NETWORK')
          return enqueueSnackbar(`${error.message}.`, { variant: 'error' });
        return enqueueSnackbar(error.response?.data.message, {
          variant: 'error'
        });
      }
      throw error;
    }
  }

  return (
    <Card className="mt-11 flex flex-col justify-center border-none p-6 font-outfit shadow-none sm:w-auto sm:items-start">
      {!isOtpSent ? (
        <>
          <h1 className="mb-4 font-outfit text-2xl font-bold text-gray-800">
            Get a Cashwise account
          </h1>
          <Form {...form}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row gap-2 sm:flex-wrap">
                <Select
                  form={form}
                  name="countryCode"
                  id="countryCode"
                  placeholder="Country Code"
                  options={countryCodeSelectOptions}
                />
                <FloatingInput
                  form={form}
                  name="phoneNumber"
                  id="phoneNumber"
                  label="Phone number"
                />
              </div>

              <Accordion
                triggerText="Have an Invitation Code?"
                className="py-1 pt-3"
              >
                <FloatingInput
                  form={form}
                  name="inviteCode"
                  id="inviteCode"
                  label="Invite code"
                  className="mt-4"
                />
              </Accordion>

              {/* Submit Button */}
              <Button
                className="block w-full rounded-2xl bg-emerald-500 font-outfit text-base hover:bg-emerald-600 focus:bg-emerald-600 active:bg-emerald-700 sm:w-1/4"
                type="submit"
                disabled={!isChecked || !isValid || isSendingOtp}
              >
                {isSendingOtp ? (
                  <span>
                    Loading<span className="animate-pulse">...</span>
                  </span>
                ) : (
                  'Proceed'
                )}
              </Button>

              <Checkbox form={form} isSendingOtp={isSendingOtp} name="terms">
                <div className="flex flex-col">
                  <p className="text-sm leading-none text-slate-600">
                    I accept and agree to the
                    <a href="/terms" className="text-emerald-500">
                      &nbsp;Terms & Conditions and Privacy Policy
                    </a>
                  </p>
                </div>
              </Checkbox>
            </form>
          </Form>
          {Object.keys(errors).length > 0 && (
            <div className="mt-8 rounded-md bg-red-50 p-3 text-red-700">
              {Object.values(errors).map((error, index) => (
                <p key={index}>{(error as any).message}</p>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-2 text-xl font-semibold text-slate-800">
            Phone Number Verification
          </h1>
          <h2 className="mb-4 text-sm text-gray-600">
            Enter the OTP sent to your phone
          </h2>

          <OtpForm
            isLoading={isVerifyingOtp}
            sessionId={sessionId}
            verifyOtp={verifyOtp}
          />
        </div>
      )}
    </Card>
  );
}
