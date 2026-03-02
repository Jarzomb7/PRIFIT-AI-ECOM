'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { PlatformChart } from '@/components/dashboard/platform-chart'
import { CostPieChart } from '@/components/dashboard/cost-pie-chart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp, DollarSign, ShoppingCart, Target,
  Megaphone, Package, AlertTriangle, BarChart3,
} from 'lucide-react'
import {
  formatCurrency, formatPercent, formatNumber,
  PLATFORM_LABELS, PLATFORM_COLORS,
} from '@/lib/utils'

type Period = 'day' | 'week' | 'month'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('month')

  useEffect(() => {
    fetchDashboard()
  }, [period])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard?period=${period}`)
      const json = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-surface/60 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const { stats, chartData, platformStats, topProducts, costBreakdown, lowStockCount } = data

  const PERIODS: { value: Period; label: string }[] = [
    { value: 'day', label: 'Dziś' },
    { value: 'week', label: '7 dni' },
    { value: 'month', label: 'Miesiąc' },
  ]

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Przegląd wyników sprzedaży</p>
        </div>
        <div className="flex items-center gap-1 bg-surface/60 border border-border/50 rounded-xl p-1">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === value
                  ? 'bg-accent text-white shadow-md shadow-accent/30'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Przychód brutto"
          value={stats.revenue}
          format="currency"
          change={stats.revenueChange}
          changeLabel="vs poprzedni okres"
          icon={<DollarSign size={18} />}
          accentColor="accent"
        />
        <StatsCard
          title="Zysk netto"
          value={stats.netProfit}
          format="currency"
          change={stats.profitChange}
          changeLabel="vs poprzedni okres"
          icon={<TrendingUp size={18} />}
          accentColor="success"
        />
        <StatsCard
          title="Marża netto"
          value={stats.margin}
          format="percent"
          icon={<Target size={18} />}
          accentColor="warning"
        />
        <StatsCard
          title="Sprzedane sztuki"
          value={stats.totalSales}
          icon={<ShoppingCart size={18} />}
        />
        <StatsCard
          title="Wydatki na reklamy"
          value={stats.adsCost}
          format="currency"
          icon={<Megaphone size={18} />}
          accentColor="warning"
        />
        <StatsCard
          title="ROAS"
          value={`${stats.roas.toFixed(2)}x`}
          subtitle="Zwrot z wydatków reklamowych"
          icon={<BarChart3 size={18} />}
          accentColor="accent"
        />
        <StatsCard
          title="Koszty całkowite"
          value={stats.costs}
          format="currency"
          icon={<DollarSign size={18} />}
          accentColor="danger"
        />
        <StatsCard
          title="Niska ilość towaru"
          value={lowStockCount}
          subtitle="produktów poniżej progu"
          icon={<AlertTriangle size={18} />}
          accentColor="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Przychód vs Koszty vs Zysk</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Struktura kosztów</CardTitle>
          </CardHeader>
          <CardContent>
            <CostPieChart data={costBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Platform + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Przychód według platformy</CardTitle>
          </CardHeader>
          <CardContent>
            <PlatformChart data={platformStats} />
            <div className="mt-4 space-y-2">
              {platformStats.map((p: any) => (
                <div key={p.platform} className="flex items-center justify-between py-2 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: PLATFORM_COLORS[p.platform] ?? '#6366f1' }}
                    />
                    <span className="text-sm text-text-secondary">{PLATFORM_LABELS[p.platform]}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">{formatCurrency(p.revenue)}</p>
                    <p className="text-xs text-success">{formatPercent(p.margin)} marża</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top produkty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product: any, i: number) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/40 hover:bg-surface-2/70 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-accent-light">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="default" className="text-[10px] px-1.5">
                        {PLATFORM_LABELS[product.platform]}
                      </Badge>
                      <span className="text-xs text-text-secondary">{product.quantity} szt.</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-text-primary">{formatCurrency(product.revenue)}</p>
                    <p className={`text-xs font-medium ${product.margin >= 20 ? 'text-success' : product.margin >= 10 ? 'text-warning' : 'text-danger'}`}>
                      {formatPercent(product.margin)}
                    </p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-text-secondary text-sm text-center py-8">Brak sprzedaży w tym okresie</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
