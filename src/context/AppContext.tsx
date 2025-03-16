import { createContext, Dispatch, ReactNode, useReducer } from 'react';

interface IAppAction {
  type: 'phone-verification' | 'login' | 'logout';
  payload?: Record<string, any>;
}

interface IAppState {
  user: Record<string, any> | null;
  isAuthenticated: boolean;
  isPhoneNumberVerified: boolean;
}

export interface AppContextType extends IAppState {
  dispatch: Dispatch<IAppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isPhoneNumberVerified: false
};

function reducer(state: IAppState, action: IAppAction) {
  switch (action.type) {
    case 'phone-verification':
      return { ...state, isPhoneNumberVerified: true };
    case 'login':
      return { ...state, user: action.payload ?? null, isAuthenticated: true };
    case 'logout':
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error('Unknown action');
  }
}

function AppContextProvider({ children }: { children: ReactNode }) {
  const [{ user, isAuthenticated, isPhoneNumberVerified }, dispatch] =
    useReducer(reducer, initialState);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isPhoneNumberVerified,
        dispatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContextProvider, AppContext };
