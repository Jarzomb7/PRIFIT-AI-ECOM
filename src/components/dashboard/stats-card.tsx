import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  format?: 'currency' | 'percent' | 'number'
  accentColor?: string
  subtitle?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  format,
  accentColor = 'accent',
  subtitle,
}: StatsCardProps) {
  const displayValue =
    typeof value === 'number'
      ? format === 'currency'
        ? formatCurrency(value)
        : format === 'percent'
        ? formatPercent(value)
        : value.toLocaleString('pl-PL')
      : value

  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <div className="rounded-xl border border-border/50 bg-surface/60 backdrop-blur-sm p-5 group hover:border-border transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-text-secondary font-medium">{title}</p>
        {icon && (
          <div className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center',
            `bg-${accentColor}/15 text-${accentColor}`
          )}>
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold text-text-primary tracking-tight">
          {displayValue}
        </p>
        {subtitle && (
          <p className="text-xs text-text-secondary">{subtitle}</p>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
            isPositive && 'bg-success/15 text-success',
            isNegative && 'bg-danger/15 text-danger',
            !isPositive && !isNegative && 'bg-surface-2 text-text-secondary',
          )}>
            {isPositive ? <TrendingUp size={11} /> : isNegative ? <TrendingDown size={11} /> : <Minus size={11} />}
            {Math.abs(change).toFixed(1)}%
          </div>
          {changeLabel && (
            <span className="text-xs text-text-secondary">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
