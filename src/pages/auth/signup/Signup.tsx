import { Logo } from '@/components/shared/Logo';
import { SignupContextProvider } from '@/context/signup-context/SignupContext';
import { Outlet } from 'react-router-dom';

export function Signup() {
  return (
    <SignupContextProvider>
      <main className="mt-0">
        <Logo className="sm:ml-8" />
        <Outlet />
      </main>
    </SignupContextProvider>
  );
}
