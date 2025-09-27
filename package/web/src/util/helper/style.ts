import type { ColorVariant } from "../../@type";
import { colorPatterns } from "../constant";

export const isColorCodeFormat = (value: string): boolean => {
  return Object.values(colorPatterns).some(pattern => pattern.test(value));
};

// use in style you can use like this: backgroundColor: getColorBg('primary'), getColorBg('#ff0000')
export const getColor = (color: ColorVariant | string | undefined) => {

  if (!color || color === 'undefined') {
    return 'var(--color-primary)';
  }

  switch (color) {
    case 'inherit':
      return 'inherit';
    case 'primary':
      return 'var(--color-primary)';
    case 'secondary':
      return 'var(--color-secondary)';
    case 'success':
      return 'var(--color-success)';
    case 'error':
      return 'var(--color-error)';
    case 'info':
      return 'var(--color-info)';
    case 'warning':
      return 'var(--color-warning)';
    default:
      if (isColorCodeFormat(color)) {
        return color; // return รหัสสีโดยตรง
      }
      return `var(--color-${color})`;
  }
};

// color is in hex format only, example: #3b82f6
export const darkenColor = (color: string, amount: number = 0.2): string => {
  if (!isColorCodeFormat(color) || !color.startsWith('#')) {
    return color;
  }
  const hex = color.replace('#', '');
  
  // change to RGB
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  // change RGB values based on amount (0-1)
  const newR = Math.max(0, Math.floor(r * (1 - amount)));
  const newG = Math.max(0, Math.floor(g * (1 - amount)));
  const newB = Math.max(0, Math.floor(b * (1 - amount)));

  // change back to hex
  const newHex = ((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0');
  
  return `#${newHex}`;
};