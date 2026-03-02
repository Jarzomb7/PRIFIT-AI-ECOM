'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { calculateProfit, formatCurrency, formatPercent } from '@/lib/utils'
import {
  Calculator, TrendingUp, TrendingDown, AlertCircle,
  DollarSign, Package, Truck, RotateCcw, Percent, Minus,
} from 'lucide-react'

const VAT_OPTIONS = [
  { value: 'VAT_23', label: 'VAT 23%' },
  { value: 'VAT_8', label: 'VAT 8%' },
  { value: 'VAT_5', label: 'VAT 5%' },
  { value: 'EXEMPT', label: 'Zwolnienie z VAT' },
]

const TAX_OPTIONS = [
  { value: '12', label: 'Skala podatkowa 12%' },
  { value: '19', label: 'Liniowy 19%' },
  { value: '0', label: 'Brak (ryczałt)' },
]

interface Params {
  sellingPrice: number
  quantity: number
  purchasePrice: number
  commissionRate: number
  adsCost: number
  packagingCost: number
  shippingCost: number
  returnRate: number
  vatRate: string
  incomeTaxRate: number
  zusMonthlyCost: number
  accountingMonthlyCost: number
  otherFixedCosts: number
}

function ResultRow({
  label,
  value,
  variant = 'default',
  indent = false,
  bold = false,
}: {
  label: string
  value: number
  variant?: 'default' | 'success' | 'danger' | 'muted'
  indent?: boolean
  bold?: boolean
}) {
  const color = {
    default: 'text-text-primary',
    success: 'text-success',
    danger: 'text-danger',
    muted: 'text-text-secondary',
  }[variant]

  return (
    <div className={`flex items-center justify-between py-2 ${indent ? 'pl-4 border-l border-border/30' : ''}`}>
      <span className={`text-sm ${indent ? 'text-text-secondary' : 'text-text-primary'} ${bold ? 'font-semibold' : ''}`}>
        {label}
      </span>
      <span className={`text-sm font-mono ${color} ${bold ? 'font-bold text-base' : ''}`}>
        {formatCurrency(value)}
      </span>
    </div>
  )
}

export default function CalculatorPage() {
  const [params, setParams] = useState<Params>({
    sellingPrice: 129,
    quantity: 50,
    purchasePrice: 45,
    commissionRate: 8.5,
    adsCost: 200,
    packagingCost: 3.5,
    shippingCost: 9.99,
    returnRate: 3,
    vatRate: 'VAT_23',
    incomeTaxRate: 19,
    zusMonthlyCost: 1600,
    accountingMonthlyCost: 350,
    otherFixedCosts: 0,
  })

  const update = (key: keyof Params) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
    setParams(prev => ({ ...prev, [key]: val }))
  }

  const result = useMemo(() => calculateProfit(params), [params])

  const marginColor =
    result.marginPercent >= 25 ? 'text-success' :
    result.marginPercent >= 10 ? 'text-warning' :
    'text-danger'

  return (
    <div className="animate-slide-up">
      <Header title="Kalkulator zysku" subtitle="Oblicz realny zysk po wszystkich kosztach" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INPUT PANEL */}
        <div className="space-y-5">
          {/* Podstawowe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign size={18} className="text-accent-light" />
                Podstawowe dane
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Cena sprzedaży"
                  type="number"
                  value={params.sellingPrice}
                  onChange={update('sellingPrice')}
                  suffix="PLN"
                  min={0}
                  step={0.01}
                />
                <Input
                  label="Ilość sprzedana"
                  type="number"
                  value={params.quantity}
                  onChange={update('quantity')}
                  suffix="szt."
                  min={1}
                />
              </div>
              <Input
                label="Koszt zakupu towaru (za sztukę)"
                type="number"
                value={params.purchasePrice}
                onChange={update('purchasePrice')}
                suffix="PLN"
                min={0}
                step={0.01}
              />
            </CardContent>
          </Card>

          {/* Koszty sprzedaży */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={18} className="text-warning" />
                Koszty sprzedaży
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Prowizja platformy"
                type="number"
                value={params.commissionRate}
                onChange={update('commissionRate')}
                suffix="%"
                min={0}
                max={100}
                step={0.1}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Koszt pakowania"
                  type="number"
                  value={params.packagingCost}
                  onChange={update('packagingCost')}
                  suffix="PLN"
                  min={0}
                  step={0.01}
                />
                <Input
                  label="Koszt wysyłki"
                  type="number"
                  value={params.shippingCost}
                  onChange={update('shippingCost')}
                  suffix="PLN"
                  min={0}
                  step={0.01}
                />
              </div>
              <Input
                label="Współczynnik zwrotów"
                type="number"
                value={params.returnRate}
                onChange={update('returnRate')}
                suffix="%"
                min={0}
                max={50}
                step={0.1}
              />
              <Input
                label="Wydatki na reklamy (ADS)"
                type="number"
                value={params.adsCost}
                onChange={update('adsCost')}
                suffix="PLN"
                min={0}
              />
            </CardContent>
          </Card>

          {/* Podatki i koszty stałe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent size={18} className="text-danger" />
                Podatki i koszty stałe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Stawka VAT"
                  value={params.vatRate}
                  onChange={update('vatRate')}
                  options={VAT_OPTIONS}
                />
                <Select
                  label="Podatek dochodowy"
                  value={String(params.incomeTaxRate)}
                  onChange={(e) => setParams(prev => ({ ...prev, incomeTaxRate: parseInt(e.target.value) }))}
                  options={TAX_OPTIONS}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="ZUS (miesięcznie)"
                  type="number"
                  value={params.zusMonthlyCost}
                  onChange={update('zusMonthlyCost')}
                  suffix="PLN"
                  min={0}
                />
                <Input
                  label="Księgowość (miesięcznie)"
                  type="number"
                  value={params.accountingMonthlyCost}
                  onChange={update('accountingMonthlyCost')}
                  suffix="PLN"
                  min={0}
                />
              </div>
              <Input
                label="Inne koszty stałe"
                type="number"
                value={params.otherFixedCosts}
                onChange={update('otherFixedCosts')}
                suffix="PLN"
                min={0}
              />
            </CardContent>
          </Card>
        </div>

        {/* RESULTS PANEL */}
        <div className="space-y-5">
          {/* Main result */}
          <Card className="border-2 border-accent/20">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-text-secondary text-sm mb-1">Realny zysk netto</p>
                <p className={`text-5xl font-bold font-mono tracking-tight ${result.netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(result.netProfit)}
                </p>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-xs text-text-secondary">Marża netto</p>
                    <p className={`text-lg font-bold ${marginColor}`}>{formatPercent(result.marginPercent)}</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="text-xs text-text-secondary">ROAS</p>
                    <p className="text-lg font-bold text-text-primary">{result.roas.toFixed(2)}x</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="text-xs text-text-secondary">Próg rentowności</p>
                    <p className="text-lg font-bold text-text-primary">
                      {result.breakevenUnits === Infinity ? '∞' : result.breakevenUnits} szt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Marża progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Marża</span>
                  <span>{formatPercent(result.marginPercent)}</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.marginPercent >= 25 ? 'bg-success' :
                      result.marginPercent >= 10 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, result.marginPercent))}%` }}
                  />
                </div>
              </div>

              {result.netProfit < 0 && (
                <div className="flex items-center gap-2 bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4">
                  <AlertCircle size={16} className="text-danger flex-shrink-0" />
                  <p className="text-danger text-sm">
                    Sprzedajesz ze stratą! Musisz sprzedać co najmniej {result.breakevenUnits === Infinity ? '∞' : result.breakevenUnits} sztuk, aby wyjść na zero.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step-by-step breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator size={18} className="text-accent-light" />
                Szczegółowe obliczenia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0.5">
                <ResultRow label={`Przychód (${params.quantity} × ${formatCurrency(params.sellingPrice)})`} value={result.revenue} bold />
                <div className="border-t border-border/30 pt-2 mt-2">
                  <ResultRow label="Koszt towaru" value={-result.totalVariableCosts} variant="danger" indent />
                  <ResultRow label="Prowizja platformy" value={-result.commissionAmount} variant="danger" indent />
                  <ResultRow label="Koszty zwrotów" value={-result.returnCost} variant="danger" indent />
                  <ResultRow label="Zysk po prowizjach" value={result.profitAfterCommission} variant={result.profitAfterCommission >= 0 ? 'success' : 'danger'} bold />
                </div>
                <div className="border-t border-border/30 pt-2 mt-2">
                  <ResultRow label="Koszty reklam" value={-params.adsCost} variant="danger" indent />
                  <ResultRow label="Zysk po reklamach" value={result.profitAfterAds} variant={result.profitAfterAds >= 0 ? 'success' : 'danger'} bold />
                </div>
                <div className="border-t border-border/30 pt-2 mt-2">
                  <ResultRow label="Koszty stałe (ZUS + księgowość + inne)" value={-result.totalFixedCosts} variant="danger" indent />
                  <ResultRow label="Zysk po kosztach stałych" value={result.profitAfterAllCosts} variant={result.profitAfterAllCosts >= 0 ? 'success' : 'danger'} bold />
                </div>
                <div className="border-t border-border/30 pt-2 mt-2">
                  <ResultRow label="VAT" value={-result.vatAmount} variant="muted" indent />
                  <ResultRow label="Podatek dochodowy" value={-result.incomeTax} variant="muted" indent />
                </div>
                <div className="border-t-2 border-accent/30 pt-3 mt-3">
                  <ResultRow
                    label="REALNY ZYSK NETTO"
                    value={result.netProfit}
                    variant={result.netProfit >= 0 ? 'success' : 'danger'}
                    bold
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unit economics */}
          <Card>
            <CardHeader>
              <CardTitle>Na sztukę</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Cena sprzedaży', value: params.sellingPrice },
                  { label: 'Koszt towaru', value: -params.purchasePrice },
                  { label: 'Prowizja', value: -(params.sellingPrice * params.commissionRate / 100) },
                  { label: 'Wysyłka + pakowanie', value: -(params.shippingCost + params.packagingCost) },
                  { label: 'Marża jednostkowa', value: result.unitMargin },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-surface-2/40 rounded-xl p-3">
                    <p className="text-xs text-text-secondary mb-1">{label}</p>
                    <p className={`text-base font-bold font-mono ${value >= 0 ? 'text-text-primary' : 'text-danger'}`}>
                      {formatCurrency(value)}
                    </p>
                  </div>
                ))}
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-3">
                  <p className="text-xs text-text-secondary mb-1">Marża %</p>
                  <p className={`text-base font-bold ${marginColor}`}>{formatPercent(result.marginPercent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
