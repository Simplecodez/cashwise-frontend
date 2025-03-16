import { IVerifyOtpPayload } from '@/api/user';
import { OtpDailPad } from '@/components/shared/OtpDailPad';
import { Button } from '@/components/ui/button';
import { AppContextType } from '@/context/AppContext';
import { useAppContext } from '@/context/useContext';
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
interface IOtpFormProps {
  isLoading: boolean;
  sessionId?: string;
  verifyOtp: UseMutateAsyncFunction<
    {
      status: string;
      verified: boolean;
    },
    any,
    IVerifyOtpPayload,
    unknown
  >;
}

export function OtpForm({ isLoading, verifyOtp, sessionId }: IOtpFormProps) {
  const { dispatch } = useAppContext() as AppContextType;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });
  const onSubmit = async (data: OtpFormValues) => {
    console.log('OTP Submitted:', data);
    try {
      const verificationResult = await verifyOtp({
        otp: data.otp,
        sessionId: sessionId as string
      });
      if (verificationResult.status === 'success') {
        dispatch({ type: 'phone-verification' });
        navigate(`/auth/signup/complete-signup?sessionId=${sessionId}`);
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
        disabled={!isValid}
        type="submit"
        className="block w-full rounded-2xl bg-emerald-500 px-4 py-2 font-outfit text-sm text-white hover:bg-emerald-600 focus:bg-emerald-600 active:bg-emerald-700 sm:w-1/4"
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
