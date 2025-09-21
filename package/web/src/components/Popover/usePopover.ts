import { useCallback, useEffect, useRef, useState } from 'react';
import type { PopoverPlacement, PopoverPosition, UsePopoverOptions, UsePopoverReturn } from './types';
import { calculatePopoverPosition, getOptimalPlacement } from './utils';

export const usePopover = (options: UsePopoverOptions = {}): UsePopoverReturn => {
  const {
    placement = 'bottom',
    offset = 8,
    closeOnClickOutside = true,
    closeOnEscape = true,
    onOpenChange,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({ x: 0, y: 0 });
  const [currentPlacement, setCurrentPlacement] = useState<PopoverPlacement>(placement);

  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const optimalPlacement = getOptimalPlacement(
      triggerRef.current,
      contentRef.current,
      placement,
      offset
    );

    const newPosition = calculatePopoverPosition(
      triggerRef.current,
      contentRef.current,
      optimalPlacement,
      offset
    );

    setPosition(newPosition);
    setCurrentPlacement(optimalPlacement);
  }, [placement, offset]);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Update position when popover opens or window resizes
  useEffect(() => {
    if (isOpen) {
      updatePosition();

      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, updatePosition]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (
        triggerRef.current?.contains(target) ||
        contentRef.current?.contains(target)
      ) {
        return;
      }

      close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnClickOutside, close]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, close]);

  return {
    isOpen,
    position,
    placement: currentPlacement,
    triggerRef: triggerRef as React.RefObject<HTMLElement>,
    contentRef: contentRef as React.RefObject<HTMLDivElement>,
    open,
    close,
    toggle,
    updatePosition,
  };
};
