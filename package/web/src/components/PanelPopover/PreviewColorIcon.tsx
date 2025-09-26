import { cn } from "../Popover"

type Props = {
  children: React.ReactNode
  className?: string
}

export const PreviewColorIcon = ({ children, className }: Props) => {
  return <span className={cn(`w-4 h-4 flex items-center justify-cente font-bold`, className)}>{children}</span>
}