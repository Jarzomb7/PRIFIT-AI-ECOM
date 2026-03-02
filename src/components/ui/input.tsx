import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
  suffix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, suffix, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-text-secondary text-sm">{prefix}</span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border border-border bg-surface-2/50 text-text-primary text-sm',
              'px-3 py-2.5 placeholder:text-text-secondary/50',
              'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60',
              'transition-colors duration-200',
              prefix && 'pl-8',
              suffix && 'pr-8',
              error && 'border-danger focus:ring-danger/40',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-text-secondary text-sm">{suffix}</span>
          )}
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
