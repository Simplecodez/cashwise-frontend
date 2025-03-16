import {
  //   useInfiniteQuery,
  useMutation,
  // useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from '../react-query';
import { endpoints, mutator } from '@/utils/helper';

interface ISendOtpPayload {
  phoneNumber: string;
  countryCode: string;
}

export interface IVerifyOtpPayload {
  otp: string;
  sessionId: string;
}

export interface ISignupPayload {
  userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    dateOfBirth: Date;
    gender: 'male' | 'female';
    address: string;
    nationality: string;
    countryOfResidence: string;
    password: string;
    confirmPassword: string;
  };
  sessionId: string;
}

function useBaseMutation<TResponse, TVariables>(url: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, data, isPending, isError, error } = useMutation<
    TResponse,
    any,
    TVariables
  >({
    mutationFn: (values) =>
      mutator({
        method: 'POST',
        data: values,
        url
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.root });
    }
  });

  return useMemo(
    () => ({
      mutate: mutateAsync,
      data,
      isLoading: isPending,
      error,
      isError
    }),
    [mutateAsync, data, isPending, error, isError]
  );
}

export function useSendOtp() {
  return useBaseMutation<
    { status: string; data: { message: string; sessionId: string } },
    ISendOtpPayload
  >(endpoints.auth.signup.sendPhoneNumberOtp);
}

export function useVerifyOtp(type: 'email' | 'phonenumber') {
  const url =
    type === 'email'
      ? endpoints.auth.signup.verifyEmail
      : endpoints.auth.signup.verifyPhoneNumber;

  return useBaseMutation<
    { status: string; verified: boolean },
    IVerifyOtpPayload
  >(url);
}

export function useSignup() {
  return useBaseMutation<{ status: string; message: string }, ISignupPayload>(
    endpoints.auth.signup.completeSignup
  );
}
