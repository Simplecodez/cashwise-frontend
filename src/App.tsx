import { Error } from './components/shared/Error';
import Auth from './components/shared/Auth';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Signup } from './pages/auth/signup/Signup';
import { Signin } from './pages/auth/signin/Signin';
import { ValidatePhonenumber } from './pages/auth/signup/components/PhoneNumberValidation';
import { AppContextProvider } from './context/app-context/AppContext';
import { CompleteSignup } from './pages/auth/signup/CompleteSignup';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './react-query';
import SnackbarProvider from './components/shared/snack/SnackbarProvider';
import { ThemeProvider } from 'styled-components';
import { theme } from './components/shared/snack/theme';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
    children: [
      {
        path: 'signup',
        element: <Signup />,
        children: [
          {
            path: 'verify-phone',
            element: <ValidatePhonenumber />
          },
          {
            path: 'complete-signup',
            element: <CompleteSignup />
          }
        ]
      },
      { path: 'signin', element: <Signin /> }
    ]
  },
  { path: '*', element: <Error /> }
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </AppContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
