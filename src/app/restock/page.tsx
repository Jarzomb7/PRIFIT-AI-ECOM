'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, PLATFORM_LABELS } from '@/lib/utils'
import { AlertTriangle, ShoppingCart, TrendingUp, Package } from 'lucide-react'

export default function RestockPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { setProducts(d.products ?? []); setLoading(false) })
  }, [])

  // Calculate restock recommendations
  const getRestockData = (product: any) => {
    const daysOfStock = product.stock > 0 ? product.stock : 0
    const avgDailySales = 3 // simplified - would use real sales data
    const daysLeft = avgDailySales > 0 ? Math.floor(daysOfStock / avgDailySales) : 999
    const suggestedOrder = Math.max(30, product.minStock * 5)
    const expectedRevenue = suggestedOrder * product.sellingPrice
    const expectedCost = suggestedOrder * product.purchasePrice
    const expectedProfit = expectedRevenue - expectedCost - (suggestedOrder * (product.shippingCost + product.packagingCost))
    const urgency = daysLeft <= 3 ? 'danger' : daysLeft <= 7 ? 'warning' : 'success'

    return { daysLeft, suggestedOrder, expectedRevenue, expectedCost, expectedProfit, urgency }
  }

  const lowStockProducts = products.filter(p => p.stock <= p.minStock * 2)
  const totalRestockCost = lowStockProducts.reduce((sum, p) => {
    const { suggestedOrder } = getRestockData(p)
    return sum + suggestedOrder * p.purchasePrice
  }, 0)

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Panel zatowarowania</h1>
      <p className="text-sm text-text-secondary mb-8">Prognoza zamówień i cashflow</p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface/60 border border-border/50 rounded-xl p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Produkty do zamówienia</p>
          <p className="text-2xl font-bold text-warning">{lowStockProducts.length}</p>
        </div>
        <div className="bg-surface/60 border border-border/50 rounded-xl p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Szacowany koszt zatowarowania</p>
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalRestockCost)}</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Przewidywany zysk z dostawy</p>
          <p className="text-2xl font-bold text-success">
            {formatCurrency(lowStockProducts.reduce((sum, p) => {
              const { expectedProfit } = getRestockData(p)
              return sum + expectedProfit
            }, 0))}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-surface/60 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto mb-3 text-success" size={48} />
              <h3 className="text-text-primary font-medium">Wszystkie produkty mają wystarczający stan</h3>
              <p className="text-text-secondary text-sm mt-1">Brak rekomendacji zamówień</p>
            </div>
          ) : (
            lowStockProducts.map(product => {
              const { daysLeft, suggestedOrder, expectedRevenue, expectedCost, expectedProfit, urgency } = getRestockData(product)
              return (
                <Card key={product.id}>
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          urgency === 'danger' ? 'bg-danger/15' : urgency === 'warning' ? 'bg-warning/15' : 'bg-success/15'
                        }`}>
                          {urgency === 'danger' ? (
                            <AlertTriangle className="text-danger" size={20} />
                          ) : (
                            <ShoppingCart className={urgency === 'warning' ? 'text-warning' : 'text-success'} size={20} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={urgency as any}>
                              {daysLeft < 999 ? `~${daysLeft} dni towaru` : 'Brak danych'}
                            </Badge>
                            <span className="text-xs text-text-secondary">
                              {PLATFORM_LABELS[product.platform]} | Stan: {product.stock} szt.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-6 text-right">
                        <div>
                          <p className="text-xs text-text-secondary">Zalecane zamówienie</p>
                          <p className="text-base font-bold text-text-primary">{suggestedOrder} szt.</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Koszt zamówienia</p>
                          <p className="text-base font-bold text-danger">{formatCurrency(expectedCost)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Prognoza przychodu</p>
                          <p className="text-base font-bold text-text-primary">{formatCurrency(expectedRevenue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Prognoza zysku</p>
                          <p className={`text-base font-bold ${expectedProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                            {formatCurrency(expectedProfit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
