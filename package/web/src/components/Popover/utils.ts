import type { PopoverPlacement, PopoverPosition } from './types';

export interface ElementRect {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export const getElementRect = (element: HTMLElement): ElementRect => {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
  };
};

export const getViewportSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const calculatePopoverPosition = (
  triggerElement: HTMLElement,
  contentElement: HTMLDivElement,
  placement: PopoverPlacement = 'bottom',
  offset: number = 8
): PopoverPosition => {
  const triggerRect = getElementRect(triggerElement);
  const contentRect = getElementRect(contentElement);
  const viewport = getViewportSize();

  let x = 0;
  let y = 0;

  // Calculate base position based on placement
  switch (placement) {
    case 'top':
      x = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      y = triggerRect.top - contentRect.height - offset;
      break;
    case 'top-start':
      x = triggerRect.left;
      y = triggerRect.top - contentRect.height - offset;
      break;
    case 'top-end':
      x = triggerRect.right - contentRect.width;
      y = triggerRect.top - contentRect.height - offset;
      break;
    case 'bottom':
      x = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      y = triggerRect.bottom + offset;
      break;
    case 'bottom-start':
      x = triggerRect.left;
      y = triggerRect.bottom + offset;
      break;
    case 'bottom-end':
      x = triggerRect.right - contentRect.width;
      y = triggerRect.bottom + offset;
      break;
    case 'left':
      x = triggerRect.left - contentRect.width - offset;
      y = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
      break;
    case 'left-start':
      x = triggerRect.left - contentRect.width - offset;
      y = triggerRect.top;
      break;
    case 'left-end':
      x = triggerRect.left - contentRect.width - offset;
      y = triggerRect.bottom - contentRect.height;
      break;
    case 'right':
      x = triggerRect.right + offset;
      y = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
      break;
    case 'right-start':
      x = triggerRect.right + offset;
      y = triggerRect.top;
      break;
    case 'right-end':
      x = triggerRect.right + offset;
      y = triggerRect.bottom - contentRect.height;
      break;
  }

  // Adjust for viewport boundaries
  const padding = 8;
  
  // Horizontal boundary checks
  if (x < padding) {
    x = padding;
  } else if (x + contentRect.width > viewport.width - padding) {
    x = viewport.width - contentRect.width - padding;
  }

  // Vertical boundary checks
  if (y < padding) {
    y = padding;
  } else if (y + contentRect.height > viewport.height - padding) {
    y = viewport.height - contentRect.height - padding;
  }

  return { x, y };
};

export const getOptimalPlacement = (
  triggerElement: HTMLElement,
  contentElement: HTMLDivElement,
  preferredPlacement: PopoverPlacement = 'bottom',
  offset: number = 8
): PopoverPlacement => {
  const triggerRect = getElementRect(triggerElement);
  const contentRect = getElementRect(contentElement);
  const viewport = getViewportSize();

  const spaceTop = triggerRect.top;
  const spaceBottom = viewport.height - triggerRect.bottom;
  const spaceLeft = triggerRect.left;
  const spaceRight = viewport.width - triggerRect.right;

  const requiredHeight = contentRect.height + offset;
  const requiredWidth = contentRect.width + offset;

  // Check if preferred placement fits
  const canFitPreferred = (() => {
    switch (preferredPlacement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        return spaceTop >= requiredHeight;
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        return spaceBottom >= requiredHeight;
      case 'left':
      case 'left-start':
      case 'left-end':
        return spaceLeft >= requiredWidth;
      case 'right':
      case 'right-start':
      case 'right-end':
        return spaceRight >= requiredWidth;
      default:
        return false;
    }
  })();

  if (canFitPreferred) {
    return preferredPlacement;
  }

  // Find the best alternative
  const alternatives: PopoverPlacement[] = ['bottom', 'top', 'right', 'left'];
  
  for (const placement of alternatives) {
    switch (placement) {
      case 'top':
        if (spaceTop >= requiredHeight) return placement;
        break;
      case 'bottom':
        if (spaceBottom >= requiredHeight) return placement;
        break;
      case 'left':
        if (spaceLeft >= requiredWidth) return placement;
        break;
      case 'right':
        if (spaceRight >= requiredWidth) return placement;
        break;
    }
  }

  // If nothing fits perfectly, return the placement with the most space
  const spaces = [
    { placement: 'top' as PopoverPlacement, space: spaceTop },
    { placement: 'bottom' as PopoverPlacement, space: spaceBottom },
    { placement: 'left' as PopoverPlacement, space: spaceLeft },
    { placement: 'right' as PopoverPlacement, space: spaceRight },
  ];

  return spaces.sort((a, b) => b.space - a.space)[0].placement;
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
