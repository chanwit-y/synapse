import React, { createContext, useContext } from 'react';
import type { PopoverContextValue } from './types';

import "./popover.css"

const PopoverContext = createContext<PopoverContextValue | null>(null);

export const PopoverProvider: React.FC<{
  children: React.ReactNode;
  value: PopoverContextValue;
}> = ({ children, value }) => {
  return (
    <PopoverContext.Provider value={value}>
      {children}
    </PopoverContext.Provider>
  );
};

export const usePopoverContext = (): PopoverContextValue => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopoverContext must be used within a PopoverProvider');
  }
  return context;
};
