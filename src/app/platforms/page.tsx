'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, DollarSign, ShoppingCart, Megaphone } from 'lucide-react'

export default function PlatformsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard?period=month')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading || !data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-8">Analiza platform</h1>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-64 rounded-xl bg-surface/60 animate-pulse" />)}
        </div>
      </div>
    )
  }

  const { platformStats } = data

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Analiza platform</h1>
      <p className="text-sm text-text-secondary mb-8">Porównanie wyników sprzedaży według platformy</p>

      {/* Platform cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {platformStats.map((p: any) => (
          <Card key={p.platform} className="hover:border-border transition-all">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-10 rounded-full flex-shrink-0"
                  style={{ background: PLATFORM_COLORS[p.platform] ?? '#6366f1' }}
                />
                <div>
                  <h3 className="font-semibold text-text-primary">{PLATFORM_LABELS[p.platform]}</h3>
                  <p className="text-xs text-text-secondary">{p.sales} transakcji</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-2/50 rounded-lg p-2.5">
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <DollarSign size={10} /> Przychód
                  </p>
                  <p className="text-sm font-bold text-text-primary mt-0.5">{formatCurrency(p.revenue)}</p>
                </div>
                <div className="bg-surface-2/50 rounded-lg p-2.5">
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <TrendingUp size={10} /> Zysk
                  </p>
                  <p className={`text-sm font-bold mt-0.5 ${p.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(p.profit)}
                  </p>
                </div>
                <div className="bg-surface-2/50 rounded-lg p-2.5">
                  <p className="text-xs text-text-secondary">Marża</p>
                  <p className={`text-sm font-bold mt-0.5 ${p.margin >= 20 ? 'text-success' : p.margin >= 10 ? 'text-warning' : 'text-danger'}`}>
                    {formatPercent(p.margin)}
                  </p>
                </div>
                <div className="bg-surface-2/50 rounded-lg p-2.5">
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <Megaphone size={10} /> ROAS
                  </p>
                  <p className="text-sm font-bold text-text-primary mt-0.5">{p.roas.toFixed(2)}x</p>
                </div>
              </div>

              {/* Margin bar */}
              <div className="mt-3">
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.margin >= 20 ? 'bg-success' : p.margin >= 10 ? 'bg-warning' : 'bg-danger'}`}
                    style={{ width: `${Math.max(0, Math.min(100, p.margin))}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Przychód według platformy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="platform" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => PLATFORM_LABELS[v] ?? v} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                    labelFormatter={v => PLATFORM_LABELS[v] ?? v}
                    formatter={(v: number) => [formatCurrency(v), 'Przychód']}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {platformStats.map((p: any) => (
                      <Cell key={p.platform} fill={PLATFORM_COLORS[p.platform] ?? '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zysk według platformy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="platform" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => PLATFORM_LABELS[v] ?? v} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                    labelFormatter={v => PLATFORM_LABELS[v] ?? v}
                    formatter={(v: number) => [formatCurrency(v), 'Zysk']}
                  />
                  <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                    {platformStats.map((p: any) => (
                      <Cell key={p.platform} fill={p.profit >= 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
