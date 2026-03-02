'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']

interface CostPieChartProps {
  data: { category: string; amount: number; percentage: number }[]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-surface border border-border rounded-xl p-3 shadow-xl">
      <p className="text-text-primary text-sm font-medium">{item.name}</p>
      <p className="text-text-secondary text-sm">{formatCurrency(item.value)}</p>
      <p className="text-accent text-xs">{item.payload.percentage.toFixed(1)}%</p>
    </div>
  )
}

export function CostPieChart({ data }: CostPieChartProps) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="amount"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            formatter={(value) => <span className="text-text-secondary">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
