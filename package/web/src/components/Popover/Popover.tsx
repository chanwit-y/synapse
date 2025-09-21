import React from 'react';
import type { PopoverProps } from './types';
import { usePopover } from './usePopover';
import { PopoverProvider } from './PopoverContext';

export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = 'bottom',
  offset = 8,
  closeOnClickOutside = true,
  closeOnEscape = true,
  defaultOpen = false,
  onOpenChange,
}) => {
  const popover = usePopover({
    placement,
    offset,
    closeOnClickOutside,
    closeOnEscape,
    onOpenChange,
  });

  // Set default open state
  React.useEffect(() => {
    if (defaultOpen && !popover.isOpen) {
      popover.open();
    }
  }, [defaultOpen, popover]);

  return (
    <PopoverProvider value={popover}>
      {children}
    </PopoverProvider>
  );
};
