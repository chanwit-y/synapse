import React, { cloneElement, isValidElement } from 'react';
import type { PopoverTriggerProps } from './types';
import { usePopoverContext } from './PopoverContext';
import { cn } from './utils';

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  children,
  asChild = false,
  className,
}) => {
  const { triggerRef, toggle } = usePopoverContext();

  if (asChild && isValidElement(children)) {
    const childElement = children as React.ReactElement<any>;
    return cloneElement(childElement, {
      ref: triggerRef,
      onClick: (e: React.MouseEvent) => {
        childElement.props.onClick?.(e);
        toggle();
      },
      className: cn((children as React.ReactElement<any>).props.className, className),
    });
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      type="button"
    >
      {children}
    </button>
  );
};
