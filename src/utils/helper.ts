import axios, { AxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken') || '';
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAuthToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const mutator = async <Data>(
  request: AxiosRequestConfig
): Promise<Data> => {
  try {
    // await new Promise((resolve) =>
    //   setTimeout(() => {
    //     resolve('Done');
    //     console.log('Done');
    //   }, 2000)
    // );
    const res = await axiosInstance(request);

    return res.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

export const endpoints = {
  auth: {
    signup: {
      sendPhoneNumberOtp: '/auth/send-phone-otp',
      verifyPhoneNumber: '/auth/verify-phone-number',
      completeSignup: '/auth/register',
      verifyEmail: '/auth/verify-email'
    },
    signin: '/auth/signin'
  }
};

export const alpha = (color: any, opacity: any) => {
  const [r, g, b] = color?.match(/\d+/g);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
