import { IVerifyOtpPayload } from '@/api/user';
import { OtpDailPad } from '@/components/shared/OtpDailPad';
import { Button } from '@/components/ui/button';
import { useSignupContext } from '@/context/signup-context/useContext';
import { SignupContextType } from '@/context/signup-context/SignupContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers')
});

interface OtpFormValues {
  otp: string;
}

export interface IOtpFormProps {
  isLoading: boolean;
  sessionId?: string;
  entityDetails?: Record<string, string>;
  verifyOtp: UseMutateAsyncFunction<
    {
      status: string;
      verified: boolean;
      message?: string;
    },
    any,
    IVerifyOtpPayload | { email: string; otp: string },
    unknown
  >;
}

export function OtpForm({
  isLoading,
  verifyOtp,
  entityDetails,
  sessionId
}: IOtpFormProps) {
  const { setIsPhoneVerified } = useSignupContext() as SignupContextType;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });
  const onSubmit = async (data: OtpFormValues) => {
    try {
      let verificationResult = null;
      if (entityDetails?.hasOwnProperty('email')) {
        verificationResult = await verifyOtp({
          email: entityDetails.email,
          otp: data.otp
        });
      } else {
        verificationResult = await verifyOtp({
          otp: data.otp,
          sessionId: sessionId as string
        });
      }

      if (verificationResult.status === 'success') {
        enqueueSnackbar(`${verificationResult?.message}. Redirecting...`, {
          variant: 'success'
        });
        setTimeout(() => {
          setIsPhoneVerified(true);

          navigate(`/auth/signup/complete-signup`);
        }, 3000);
      } else if (verificationResult.status === 'fail') {
        return enqueueSnackbar(`${(verificationResult as any).message}.`, {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <OtpDailPad
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}

      <Button
        disabled={isLoading}
        type="submit"
        className="block w-full rounded-2xl bg-emerald-500 px-4 py-2 font-play text-sm text-white hover:bg-emerald-600 focus:bg-emerald-600 active:bg-emerald-700 sm:w-1/4"
      >
        {isLoading ? (
          <span>
            Verifying<span className="animate-pulse">...</span>
          </span>
        ) : (
          'Verify'
        )}
      </Button>
    </form>
  );
}
