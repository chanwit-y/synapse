export type ColorVariant = 'inherit'| 'primary'| 'secondary'| 'success'| 'error'| 'info'| 'warning';

export type SizeVariant = 'small' | 'medium' | 'large';

export const ButtonVariant = {
  text: 'text',
  outlined: 'outlined',
  contained: 'contained',
} as const;

export type ButtonVariant = typeof ButtonVariant[keyof typeof ButtonVariant];

export interface NodeMenuItem {
  icon: React.ReactNode;
  title: string;
  action: () => void;
  color?: string;
  bgColor?: string;
}

// Type for width that accepts only "300px" format.
export type PixelValue = `${number}px`