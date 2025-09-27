import {
  ButtonVariant,
  type ColorVariant,
  type SizeVariant,
} from "../../@type";
import { Colors } from "../../util/constant";
import { getColor } from "../../util/helper/style";

type Props = {
  variant?: ButtonVariant;
  bgColor?: ColorVariant | string;
  color?: ColorVariant | string;
  size?: SizeVariant;
  borderRadius?: SizeVariant | "full";
  mt?: string;
  mb?: string;
  ml?: string;
  mr?: string;
  pt?: string;
  pb?: string;
  pl?: string;
  pr?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
};

// TODO: 1. Add disabled state 2. Add icon support 3.onClick support

export const Button = ({
  children,
  variant = ButtonVariant.contained,
  bgColor = "text-neutral-950",
  color,
  size = "small",
  borderRadius = "small",
  mt,
  mb,
  ml,
  mr,
  pt,
  pb,
  pl,
  pr,
  onClick,
  startIcon,
  endIcon,
  disabled = false,
}: Props) => {
  const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    text: "bg-transparent hover:none",
    outlined: "bg-transparent border border-gray-500 hover:shadow-md",
    contained: "hover:brightness-90 hover:shadow-md",
  };

  const borderRadiusClasses = {
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
    full: "rounded-full",
  };

  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];
  const borderRadiusClass = borderRadiusClasses[borderRadius];

  const colorvalue = () => {
    if (disabled) return Colors.grey;
    if (color) return getColor(color);

    if (variant === ButtonVariant.outlined) return getColor(bgColor);

    return "text-neutral-800";
  };

  const borderColorValue = () => {
    if (disabled) return Colors.lightgrey;

    if (variant === ButtonVariant.outlined) return getColor(bgColor);
    return undefined;
  }

  const backgroundColorValue = () => {
    if (disabled) return Colors.lightgrey;

    if (variant === ButtonVariant.contained) return getColor(bgColor);
    return undefined;
  }

  return (
    <button
      disabled={disabled}
      className={`font-semibold text-sm shadow-sm ${sizeClass} ${variantClass} ${borderRadiusClass}  transition duration-300 `}
      onClick={onClick}
      style={{
        marginTop: mt,
        marginBottom: mb,
        marginLeft: ml,
        marginRight: mr,
        paddingTop: pt,
        paddingBottom: pb,
        paddingLeft: pl,
        paddingRight: pr,
        color: colorvalue(),
        borderColor: borderColorValue(),
        cursor: "pointer",
        boxShadow: variant === ButtonVariant.text ? "none" : undefined,
        backgroundColor: backgroundColorValue(),
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      {startIcon && (
        <span
          className="mr-1 w-4 h-4 [&>svg]:w-full [&>svg]:h-full inline-flex"
          style={{ verticalAlign: "middle" }}
        >
          {startIcon}
        </span>
      )}
      <span style={{ verticalAlign: "middle" }}>{children}</span>
      {endIcon && (
        <span
          className="ml-1 w-4 h-4 [&>svg]:w-full [&>svg]:h-full inline-flex"
          style={{ verticalAlign: "middle" }}
        >
          {endIcon}
        </span>
      )}
    </button>
  );
};
