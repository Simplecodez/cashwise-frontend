import { createContext } from 'react';
import { SignupContextType } from './SignupContext';

export const SignupContext = createContext<SignupContextType | null>(null);
