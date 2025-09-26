import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePopoverContext } from './PopoverContext';
import type { PopoverContentProps } from './types';
import { cn } from './utils';

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className,
  style,
  // sideOffset = 8,
  // align = 'center',
  // avoidCollisions = true,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}) => {
  const { isOpen, position, contentRef, updatePosition } = usePopoverContext();

  // Update position when content changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(updatePosition, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, updatePosition, children]);

  if (!isOpen) return null;

  const content = (
    <div
      ref={contentRef}
      className={cn(
        'fixed z-50 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        ...style,
      }}
      data-state={isOpen ? 'open' : 'closed'}
    // onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
};

// Alternative implementation without portal for cases where you want the popover to be contained within a specific container
export const PopoverContentInline: React.FC<PopoverContentProps> = ({
  children,
  className,
  style,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}) => {
  const { isOpen, position, contentRef } = usePopoverContext();

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        ...style,
      }}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}
    </div>
  );
};
