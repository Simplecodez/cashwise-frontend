import { Logo } from '@/components/shared/Logo';
import { Outlet } from 'react-router-dom';

export function Signup() {
  return (
    <main className="mt-0">
      <Logo className="sm:ml-8" />
      <Outlet />
    </main>
  );
}
