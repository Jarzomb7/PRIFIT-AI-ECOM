'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { PLATFORM_COLORS, PLATFORM_LABELS, formatCurrency } from '@/lib/utils'

interface PlatformChartProps {
  data: { platform: string; revenue: number; profit: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-xl">
      <p className="text-text-primary text-sm font-medium mb-2">{PLATFORM_LABELS[label] ?? label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.fill || entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="text-text-primary font-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function PlatformChart({ data }: PlatformChartProps) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="platform"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => PLATFORM_LABELS[v] ?? v}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="revenue" name="Przychód" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.platform}
                fill={PLATFORM_COLORS[entry.platform] ?? '#6366f1'}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
