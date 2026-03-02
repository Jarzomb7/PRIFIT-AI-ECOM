import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-accent/20 text-accent-light': variant === 'default',
          'bg-success/20 text-success': variant === 'success',
          'bg-warning/20 text-warning': variant === 'warning',
          'bg-danger/20 text-danger': variant === 'danger',
          'bg-blue-500/20 text-blue-400': variant === 'info',
        },
        className
      )}
      {...props}
    />
  )
}
