import useLocalStorage from '@/hooks/useLocalStorage';
import { SignupState } from '@/utils/types';
import { Dispatch, ReactNode, useEffect, useMemo, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { combinedSchema } from '@/utils/validation-schema';
import { SignupContext } from './util';

const totalSteps = 3;

const formDefaultValues = {
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
};

interface ISignupState {
  isPhoneNumberVerified: boolean;
  currentStep: number;
  direction: number;
}

export interface SignupContextType extends ISignupState {
  methods: UseFormReturn<any>;
  setIsPhoneVerified: Dispatch<React.SetStateAction<boolean>>;
  handleNext: () => void;
  handlePrev: () => void;
}

export function SignupContextProvider({ children }: { children: ReactNode }) {
  const [direction, setDirection] = useState(1);

  const [isPhoneNumberVerified, setIsPhoneVerified] = useLocalStorage<boolean>(
    'isPhoneVerified',
    false
  );

  const methods = useForm<zod.infer<typeof combinedSchema>>({
    resolver: zodResolver(combinedSchema),
    defaultValues: formDefaultValues,
    mode: 'onChange'
  });

  const [savedSignupState, setSavedSignupState] = useLocalStorage<SignupState>(
    'signupState',
    {
      currentStep: 0,
      signupData: formDefaultValues
    }
  );

  function stepNavigation(direction: string) {
    if (direction === 'next') {
      setDirection(1);
      setSavedSignupState((prevState) => ({
        ...prevState,
        currentStep: Math.min(prevState.currentStep + 1, totalSteps)
      }));
    } else {
      setDirection(-1);
      setSavedSignupState((prevState) => ({
        ...prevState,
        currentStep: Math.max(prevState.currentStep - 1, 0)
      }));
    }
  }

  useEffect(() => {
    if (savedSignupState) {
      methods.reset(savedSignupState.signupData as any);
    }
  }, []);

  const saveSignupState = () => {
    const formValues = methods.getValues();

    setSavedSignupState({
      currentStep: savedSignupState.currentStep + 1,
      signupData: {
        ...formValues,
        dateOfBirth: formValues.dateOfBirth as any
      }
    });
  };

  const handleNext = () => {
    stepNavigation('next');
    saveSignupState();
  };

  const handlePrev = () => {
    stepNavigation('prev');
  };

  const value = useMemo(
    () => ({
      methods,
      isPhoneNumberVerified,
      setIsPhoneVerified,
      currentStep: savedSignupState.currentStep,
      handleNext,
      handlePrev,
      direction
    }),
    [methods, handleNext, handlePrev]
  );

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
}
