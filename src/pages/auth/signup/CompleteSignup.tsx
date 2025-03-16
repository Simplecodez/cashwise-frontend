import { Card } from '@/components/ui/card';
import { combinedSchema, stepFields } from '@/utils/validation-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { z as zod } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import PreviewPage from './components/Preview';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { ISignupPayload, useSignup, useVerifyOtp } from '@/api/user';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { useAppContext } from '@/context/useContext';
import { AppContextType } from '@/context/AppContext';
import { OtpForm } from './components/OtpForm';

// const navigate = useNavigate();
// const { isPhoneNumberVerified } = useAppContext() as AppContextType;

// useEffect(() => {
//   if (!isPhoneNumberVerified) navigate('/auth/signup/verify-phone');
// }, [isPhoneNumberVerified, navigate]);

const totalSteps = 3;

export function CompleteSignup() {
  let areAllCurrrentFieldsFilled = false;
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') as string;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { isPhoneNumberVerified } = useAppContext() as AppContextType;

  useEffect(() => {
    if (!isPhoneNumberVerified) navigate('/auth/signup/verify-phone');
  }, [isPhoneNumberVerified, navigate]);

  const { mutate: verifyOtp, isLoading: isVerifyingOtp } =
    useVerifyOtp('email');

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0
    })
  };
  const handleNext = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const form = useForm<zod.infer<typeof combinedSchema>>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      dateOfBirth: '' as any,
      gender: '' as any,
      address: '',
      nationality: '',
      countryOfResidence: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  });

  const currentStepFields = stepFields[step];

  const watchedValues = form.watch();

  const { mutate: signup, isLoading } = useSignup();

  if (currentStepFields) {
    console.log(step);
    const allFieldsFilled = currentStepFields.every(
      (field) => !!watchedValues[field]
    );
    areAllCurrrentFieldsFilled =
      step < 2
        ? allFieldsFilled
        : allFieldsFilled &&
          watchedValues.confirmPassword === watchedValues.password;
  }

  async function onSubmit(values: any) {
    console.log(values);
    const signupData: ISignupPayload = { userData: values, sessionId };
    try {
      const signupResult = await signup(signupData);

      if (signupResult.status === 'success') {
        enqueueSnackbar(signupResult.message, {
          variant: 'success'
        });

        setTimeout(() => {
          setIsOtpSent((state) => !state);
        }, 3000);
      } else if (signupResult.status === 'fail') {
        return enqueueSnackbar(`${(signupResult as any).message}.`, {
          variant: 'error'
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_NETWORK')
          return enqueueSnackbar(`${error.message}.`, { variant: 'error' });
        return enqueueSnackbar(error.response?.data.message, {
          variant: 'error'
        });
      }
      throw error;
    }
  }

  if (!isPhoneNumberVerified) return null;

  return (
    <Card className="mt-6 flex flex-col justify-center border-none p-6 font-outfit shadow-none sm:w-auto sm:items-start">
      {step <= 2 && <ProgressBar steps={3} currentStep={step} />}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          custom={direction}
        >
          {!isOtpSent ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                {step === 0 ? (
                  <StepOne form={form} />
                ) : step === 1 ? (
                  <StepTwo form={form} />
                ) : step === 2 ? (
                  <StepThree form={form} />
                ) : (
                  <PreviewPage
                    isLoading={isLoading}
                    handlePrev={handlePrev}
                    formData={watchedValues}
                  />
                )}

                {step < totalSteps && (
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className={`${step <= 0 && 'opacity-50'} border-emerald-600 text-emerald-600 hover:bg-emerald-100`}
                      onClick={handlePrev}
                      disabled={step <= 0}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-100"
                      onClick={handleNext}
                      disabled={!areAllCurrrentFieldsFilled}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          ) : (
            <>
              <h3 className="mb-3 font-semibold text-slate-700">
                Email Verification
              </h3>
              <OtpForm
                isLoading={isVerifyingOtp}
                sessionId={sessionId}
                verifyOtp={verifyOtp}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
