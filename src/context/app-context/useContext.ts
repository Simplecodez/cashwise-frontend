import { useContext } from 'react';
import { AppContext } from './AppContext';

function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error('AppContext was used outside AppContextProvider');
  return context;
}

export { useAppContext };
