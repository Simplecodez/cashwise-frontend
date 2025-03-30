import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSendOtp } from '@/api/user';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { FloatingInput } from '@/components/shared/FloatingInput';
import { Accordion } from '@/components/shared/Accordion';
import { Checkbox } from '@/components/shared/CheckBox';
import { PhoneDetails } from '@/utils/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { OtpPage } from './OtpPage';
import PhoneNumberInput from '@/components/shared/PhoneInput';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSignupContext } from '@/context/signup-context/useContext';
import { SignupContextType } from '@/context/signup-context/SignupContext';

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

export function ValidatePhonenumber() {
  const { mutate: sendOtp, isLoading: isSendingOtp } =
    useSendOtp('phonenumber');

  const [phoneNumberDetails, setPhoneNumberDetails] =
    useLocalStorage<PhoneDetails>('phone-details', {
      phoneNumber: '',
      countryCode: '',
      inviteCode: '',
      terms: false
    });

  const [isOtpSent, setIsOtpSent] = useLocalStorage<boolean>(
    'is-otp-sent',
    false
  );

  const [sessionId, setSessionId] = useLocalStorage('sessionId', '');

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

  const savePhoneDetails = () => {
    const formValues = form.getValues();
    setPhoneNumberDetails(formValues as PhoneDetails);
  };

  const {
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = form;
  const isChecked = watch('terms');

  function returnOnSubmit(resending?: boolean) {
    return async (values: zod.infer<typeof formSchema>) => {
      console.log(values);

      const { phoneNumber, countryCode } = values;
      const extractedCountryCode = countryCode.split('-')[1];
      const inputData = { phoneNumber, countryCode: extractedCountryCode };

      if (!phoneNumberDetails.phoneNumber) savePhoneDetails();

      try {
        const result = await sendOtp(inputData);
        if (result.status === 'success') {
          enqueueSnackbar(
            resending
              ? 'A new OTP has been sent to your phone.'
              : (
                  result as {
                    status: string;
                    data: { message: string; sessionId: string };
                  }
                ).data.message,
            { variant: 'success' }
          );

          setTimeout(() => {
            if (!resending) {
              setIsOtpSent((state) => !state);
            }
            setSessionId(
              (
                result as {
                  status: string;
                  data: { message: string; sessionId: string };
                }
              ).data.sessionId
            );
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
    };
  }

  const { isPhoneNumberVerified } = useSignupContext() as SignupContextType;

  const navigate = useNavigate();
  useEffect(() => {
    if (isPhoneNumberVerified) navigate('/auth/signup/complete-signup');
  }, [isPhoneNumberVerified, navigate]);

  if (isPhoneNumberVerified) return null;

  return (
    <Card className="mt-11 flex flex-col justify-center border-none p-6 font-play shadow-none sm:w-auto sm:items-start">
      {!isOtpSent ? (
        <>
          <h1 className="mb-4 font-play text-2xl font-bold text-gray-800">
            Get a Cashwise account
          </h1>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(returnOnSubmit(false))}
            >
              <PhoneNumberInput showDropDown={false} form={form} />
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

              <Button
                className="block w-full rounded-2xl bg-emerald-500 font-play text-base hover:bg-emerald-600 focus:bg-emerald-600 active:bg-emerald-700 sm:w-1/4"
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
        <OtpPage
          sessionId={sessionId}
          header="Phone Number Verification"
          subHeader="Enter the OTP sent to your phone"
          returnOnSubmit={returnOnSubmit}
          entity="phonenumber"
          entityDetails={phoneNumberDetails}
        />
      )}
    </Card>
  );
}
