import { Card } from '@/components/ui/card';
import { stepFields } from '@/utils/validation-schema';
import { motion, AnimatePresence } from 'framer-motion';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import PreviewPage from './components/Preview';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { ISignupPayload, useSendOtp, useSignup } from '@/api/user';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { useSignupContext } from '@/context/signup-context/useContext';
import { SignupContextType } from '@/context/signup-context/SignupContext';
import useLocalStorage from '@/hooks/useLocalStorage';
import { OtpPage } from './components/OtpPage';

const totalSteps = 3;

export function CompleteSignup() {
  let areAllCurrrentFieldsFilledAndNoCurrentStepError = false;
  const [isOtpSent, setIsOtpSent] = useLocalStorage('email_opt', false);
  const [sessionId] = useLocalStorage('sessionId', '');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { mutate: resendEmailOtp } = useSendOtp('email');

  const {
    methods,
    isPhoneNumberVerified,
    currentStep,
    handleNext,
    handlePrev,
    direction
  } = useSignupContext() as SignupContextType;

  useEffect(() => {
    if (!isPhoneNumberVerified) navigate('/auth/signup/verify-phone');
  }, [isPhoneNumberVerified, navigate]);

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

  const currentStepFields = stepFields[currentStep];

  const watchedValues = methods.watch();
  const { errors } = methods.formState;
  const { mutate: signup, isLoading } = useSignup();

  if (currentStepFields) {
    const allFieldsFilled = currentStepFields.every(
      (field) => !!watchedValues[field]
    );
    const noCurrentStepErrors = currentStepFields.every(
      (field) => !errors[field]
    );
    areAllCurrrentFieldsFilledAndNoCurrentStepError =
      currentStep < 2
        ? allFieldsFilled && noCurrentStepErrors
        : allFieldsFilled &&
          noCurrentStepErrors &&
          watchedValues.confirmPassword === watchedValues.password;
  }

  async function resendEmailVerificationOtp(data: { email: string }) {
    try {
      const emailVerificationResult = await resendEmailOtp(data);
      if (emailVerificationResult.status === 'success') {
        enqueueSnackbar(
          (emailVerificationResult as { status: string; message: string })
            .message,
          {
            variant: 'success'
          }
        );

        setTimeout(() => {
          setIsOtpSent(true);
        }, 3000);
      } else if (emailVerificationResult.status === 'fail') {
        return enqueueSnackbar(`${(emailVerificationResult as any).message}.`, {
          variant: 'error'
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_NETWORK')
          return enqueueSnackbar(`${error.message}.`, { variant: 'error' });
        if (error.response?.data?.code === 'E_INVALID_ACCOUNT') {
          localStorage.clear();
          return navigate('/auth/signup/verify-phone');
        }
        return enqueueSnackbar(error.response?.data.message, {
          variant: 'error'
        });
      }
    }
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
        if (error.response?.data?.code === 'E_PHONE_NOT_VERIFIED') {
          localStorage.clear();
          return navigate('/auth/signup/verify-phone');
        }
        return enqueueSnackbar(error.response?.data.message, {
          variant: 'error'
        });
      }
      throw error;
    }
  }

  if (!isPhoneNumberVerified) return null;

  return (
    <Card className="mt-6 flex flex-col justify-center border-none p-6 font-play shadow-none sm:w-auto sm:items-start">
      {currentStep <= 2 && <ProgressBar steps={3} currentStep={currentStep} />}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          custom={direction}
        >
          {!isOtpSent ? (
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit, (errors) => {
                  console.log('Validation errors:', errors);
                })}
                className="space-y-2"
              >
                {currentStep === 0 ? (
                  <StepOne form={methods} />
                ) : currentStep === 1 ? (
                  <StepTwo form={methods} />
                ) : currentStep === 2 ? (
                  <StepThree form={methods} />
                ) : (
                  <PreviewPage
                    isLoading={isLoading}
                    handlePrev={handlePrev}
                    formData={watchedValues}
                  />
                )}

                {currentStep < totalSteps && (
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className={`${currentStep <= 0 && 'opacity-50'} border-emerald-600 text-emerald-600 hover:bg-emerald-100`}
                      onClick={handlePrev}
                      disabled={currentStep <= 0}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-100"
                      onClick={handleNext}
                      disabled={
                        !areAllCurrrentFieldsFilledAndNoCurrentStepError
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          ) : (
            <OtpPage
              sessionId={sessionId}
              header="Email Verification"
              subHeader="Enter the OTP sent to your phone"
              returnOnSubmit={resendEmailVerificationOtp}
              entityDetails={{ email: watchedValues['email'] }}
              entity="email"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
