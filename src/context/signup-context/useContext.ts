import { useContext } from 'react';
import { SignupContext } from './util';

function useSignupContext() {
  const context = useContext(SignupContext);
  if (context === undefined)
    throw new Error('SignupContext was used outside SignupContextProvider');
  return context;
}

export { useSignupContext };
