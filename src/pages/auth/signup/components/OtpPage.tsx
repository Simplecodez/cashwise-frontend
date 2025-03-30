import { Button } from '@/components/ui/button';
import { OtpForm } from './OtpForm';
import { PhoneDetails } from '@/utils/types';
import { useEffect, useState } from 'react';
import { useVerifyOtp } from '@/api/user';

interface IOtpPageProps {
  header: string;
  subHeader: string;
  returnOnSubmit: Function;
  entity: 'email' | 'phonenumber';
  sessionId: string;
  entityDetails: PhoneDetails | { email: string };
}
export function OtpPage({
  header,
  subHeader,
  sessionId,
  entity,
  returnOnSubmit,
  entityDetails
}: IOtpPageProps) {
  const [resendOtpCountDown, setResentOtpCountDown] = useState(0);
  const { mutate: verifyOtp, isLoading: isVerifyingOtp } = useVerifyOtp(entity);

  useEffect(() => {
    if (resendOtpCountDown <= 0) return;

    const intervalId = setInterval(() => {
      setResentOtpCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [resendOtpCountDown]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-2 text-xl font-semibold text-slate-800">{header}</h1>
      <h2 className="mb-4 text-sm text-gray-600">{subHeader}</h2>

      <OtpForm
        entityDetails={entityDetails as any}
        isLoading={isVerifyingOtp}
        sessionId={sessionId}
        verifyOtp={verifyOtp}
      />

      {resendOtpCountDown > 0 ? (
        <p className="mt-3 text-sm text-gray-500">
          You can request a new OTP in &nbsp;.
          <span className="font-semibold text-emerald-500">
            {resendOtpCountDown}s
          </span>
        </p>
      ) : (
        <Button
          onClick={() => {
            setResentOtpCountDown(15);
            if (entity === 'phonenumber') {
              return returnOnSubmit(true)(entityDetails);
            } else {
              return returnOnSubmit(entityDetails);
            }
          }}
          className="mt-4 bg-emerald-50 text-sm font-medium text-emerald-500 hover:underline active:bg-emerald-700 disabled:text-gray-400 sm:w-1/4"
          disabled={resendOtpCountDown > 0}
        >
          Resend OTP
        </Button>
      )}
    </div>
  );
}
