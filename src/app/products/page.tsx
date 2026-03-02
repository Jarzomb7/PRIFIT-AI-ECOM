'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils'
import { Plus, Package, AlertTriangle, X, Edit2, Trash2 } from 'lucide-react'

const PLATFORM_OPTIONS = [
  { value: 'ALLEGRO', label: 'Allegro' },
  { value: 'OLX', label: 'OLX' },
  { value: 'EMPIK', label: 'Empik' },
  { value: 'AMAZON', label: 'Amazon' },
  { value: 'WOOCOMMERCE', label: 'WooCommerce' },
  { value: 'SHOPIFY', label: 'Shopify' },
  { value: 'OTHER', label: 'Inne' },
]

const VAT_OPTIONS = [
  { value: 'VAT_23', label: 'VAT 23%' },
  { value: 'VAT_8', label: 'VAT 8%' },
  { value: 'VAT_5', label: 'VAT 5%' },
  { value: 'EXEMPT', label: 'Zwolniony' },
]

const defaultForm = {
  name: '',
  sku: '',
  platform: 'ALLEGRO',
  purchasePrice: '',
  sellingPrice: '',
  stock: '',
  minStock: '5',
  commissionRate: '8.5',
  packagingCost: '3.5',
  shippingCost: '9.99',
  returnRate: '3',
  vatRate: 'VAT_23',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data.products ?? [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          purchasePrice: parseFloat(form.purchasePrice),
          sellingPrice: parseFloat(form.sellingPrice),
          stock: parseInt(form.stock),
          minStock: parseInt(form.minStock),
          commissionRate: parseFloat(form.commissionRate),
          packagingCost: parseFloat(form.packagingCost),
          shippingCost: parseFloat(form.shippingCost),
          returnRate: parseFloat(form.returnRate),
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setForm(defaultForm)
        fetchProducts()
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Usunąć ten produkt?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  const getMargin = (p: any) => {
    const revenue = p.sellingPrice
    const costs = p.purchasePrice + p.shippingCost + p.packagingCost + revenue * (p.commissionRate / 100)
    return revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0
  }

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Produkty</h1>
          <p className="text-sm text-text-secondary">{products.length} produktów w bazie</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} /> Dodaj produkt
        </Button>
      </div>

      {/* Add form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Nowy produkt</CardTitle>
                <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Input
                      label="Nazwa produktu"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <Input
                    label="SKU (opcjonalnie)"
                    value={form.sku}
                    onChange={e => setForm(p => ({ ...p, sku: e.target.value }))}
                  />
                  <Select
                    label="Platforma"
                    value={form.platform}
                    onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
                    options={PLATFORM_OPTIONS}
                  />
                  <Input
                    label="Cena zakupu"
                    type="number"
                    value={form.purchasePrice}
                    onChange={e => setForm(p => ({ ...p, purchasePrice: e.target.value }))}
                    suffix="PLN"
                    required
                  />
                  <Input
                    label="Cena sprzedaży"
                    type="number"
                    value={form.sellingPrice}
                    onChange={e => setForm(p => ({ ...p, sellingPrice: e.target.value }))}
                    suffix="PLN"
                    required
                  />
                  <Input
                    label="Stan magazynowy"
                    type="number"
                    value={form.stock}
                    onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                    suffix="szt."
                  />
                  <Input
                    label="Alert niskiego stanu"
                    type="number"
                    value={form.minStock}
                    onChange={e => setForm(p => ({ ...p, minStock: e.target.value }))}
                    suffix="szt."
                  />
                  <Input
                    label="Prowizja"
                    type="number"
                    value={form.commissionRate}
                    onChange={e => setForm(p => ({ ...p, commissionRate: e.target.value }))}
                    suffix="%"
                  />
                  <Input
                    label="Koszt pakowania"
                    type="number"
                    value={form.packagingCost}
                    onChange={e => setForm(p => ({ ...p, packagingCost: e.target.value }))}
                    suffix="PLN"
                  />
                  <Input
                    label="Koszt wysyłki"
                    type="number"
                    value={form.shippingCost}
                    onChange={e => setForm(p => ({ ...p, shippingCost: e.target.value }))}
                    suffix="PLN"
                  />
                  <Input
                    label="Wskaźnik zwrotów"
                    type="number"
                    value={form.returnRate}
                    onChange={e => setForm(p => ({ ...p, returnRate: e.target.value }))}
                    suffix="%"
                  />
                  <Select
                    label="Stawka VAT"
                    value={form.vatRate}
                    onChange={e => setForm(p => ({ ...p, vatRate: e.target.value }))}
                    options={VAT_OPTIONS}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">
                    Anuluj
                  </Button>
                  <Button type="submit" loading={saving} className="flex-1">
                    Dodaj produkt
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-surface/60 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <Package className="mx-auto mb-4 text-text-secondary" size={48} />
          <h3 className="text-text-primary font-medium mb-1">Brak produktów</h3>
          <p className="text-text-secondary text-sm mb-4">Dodaj swój pierwszy produkt</p>
          <Button onClick={() => setShowForm(true)}><Plus size={16} /> Dodaj produkt</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const margin = getMargin(product)
            const isLowStock = product.stock <= product.minStock
            return (
              <Card key={product.id} className="hover:border-border transition-all group">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">{product.name}</p>
                      {product.sku && (
                        <p className="text-xs text-text-secondary font-mono">{product.sku}</p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-danger/10 hover:text-danger text-text-secondary transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default">
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block mr-1"
                        style={{ background: PLATFORM_COLORS[product.platform] }}
                      />
                      {PLATFORM_LABELS[product.platform]}
                    </Badge>
                    {isLowStock && (
                      <Badge variant="warning">
                        <AlertTriangle size={10} /> Niski stan
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface-2/50 rounded-lg p-2.5">
                      <p className="text-xs text-text-secondary">Cena sprzedaży</p>
                      <p className="text-base font-bold text-text-primary">{formatCurrency(product.sellingPrice)}</p>
                    </div>
                    <div className="bg-surface-2/50 rounded-lg p-2.5">
                      <p className="text-xs text-text-secondary">Marża</p>
                      <p className={`text-base font-bold ${margin >= 20 ? 'text-success' : margin >= 10 ? 'text-warning' : 'text-danger'}`}>
                        {formatPercent(margin)}
                      </p>
                    </div>
                    <div className="bg-surface-2/50 rounded-lg p-2.5">
                      <p className="text-xs text-text-secondary">Stan magazynu</p>
                      <p className={`text-base font-bold ${isLowStock ? 'text-warning' : 'text-text-primary'}`}>
                        {product.stock} szt.
                      </p>
                    </div>
                    <div className="bg-surface-2/50 rounded-lg p-2.5">
                      <p className="text-xs text-text-secondary">Koszt zakupu</p>
                      <p className="text-base font-bold text-text-primary">{formatCurrency(product.purchasePrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
