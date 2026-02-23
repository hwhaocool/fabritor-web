import { createContext } from 'react';

export interface ApiPanelContextValue {
  isApiPanelActive: boolean;
  setApiPanelActive: (active: boolean) => void;
}

export const ApiPanelContext = createContext<ApiPanelContextValue>({
  isApiPanelActive: false,
  setApiPanelActive: () => {}
});
