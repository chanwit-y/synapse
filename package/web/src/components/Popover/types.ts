import type { ReactNode, RefObject } from 'react';

export type PopoverPlacement = 
  | 'top' 
  | 'top-start' 
  | 'top-end'
  | 'bottom' 
  | 'bottom-start' 
  | 'bottom-end'
  | 'left' 
  | 'left-start' 
  | 'left-end'
  | 'right' 
  | 'right-start' 
  | 'right-end';

export interface PopoverPosition {
  x: number;
  y: number;
}

export interface PopoverState {
  isOpen: boolean;
  position: PopoverPosition;
  placement: PopoverPlacement;
}

export interface PopoverContextValue {
  isOpen: boolean;
  position: PopoverPosition;
  placement: PopoverPlacement;
  triggerRef: RefObject<HTMLElement>;
  contentRef: RefObject<HTMLDivElement>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  updatePosition: () => void;
}

export interface PopoverProps {
  children: ReactNode;
  placement?: PopoverPlacement;
  offset?: number;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  avoidCollisions?: boolean;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
}

export interface UsePopoverOptions {
  placement?: PopoverPlacement;
  offset?: number;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface UsePopoverReturn {
  isOpen: boolean;
  position: PopoverPosition;
  placement: PopoverPlacement;
  triggerRef: RefObject<HTMLElement>;
  contentRef: RefObject<HTMLDivElement>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  updatePosition: () => void;
}
