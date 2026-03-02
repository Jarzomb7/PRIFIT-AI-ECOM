'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, EXPENSE_CATEGORY_LABELS } from '@/lib/utils'
import { Plus, X, Trash2, Receipt } from 'lucide-react'

const CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
const TYPE_OPTIONS = [
  { value: 'FIXED', label: 'Stały' },
  { value: 'VARIABLE', label: 'Zmienny' },
]
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2024, i, 1).toLocaleString('pl-PL', { month: 'long' }),
}))

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const now = new Date()
  const [month, setMonth] = useState(String(now.getMonth() + 1))
  const [year] = useState(String(now.getFullYear()))
  const [form, setForm] = useState({
    name: '',
    category: 'OTHER',
    type: 'FIXED',
    amount: '',
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    notes: '',
  })

  useEffect(() => { fetchExpenses() }, [month, year])

  const fetchExpenses = async () => {
    setLoading(true)
    const res = await fetch(`/api/expenses?month=${month}&year=${year}`)
    const data = await res.json()
    setExpenses(data.expenses ?? [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          month: parseInt(form.month),
          year: parseInt(form.year),
        }),
      })
      if (res.ok) {
        setShowForm(false)
        fetchExpenses()
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteExpense = async (id: string) => {
    await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' })
    fetchExpenses()
  }

  const totalFixed = expenses.filter(e => e.type === 'FIXED').reduce((s, e) => s + e.amount, 0)
  const totalVariable = expenses.filter(e => e.type === 'VARIABLE').reduce((s, e) => s + e.amount, 0)
  const total = totalFixed + totalVariable

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Koszty firmowe</h1>
          <p className="text-sm text-text-secondary">Zarządzaj stałymi i zmiennymi kosztami</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            label=""
            value={month}
            onChange={e => setMonth(e.target.value)}
            options={MONTH_OPTIONS}
          />
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Dodaj koszt
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface/60 border border-border/50 rounded-xl p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Koszty stałe</p>
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalFixed)}</p>
        </div>
        <div className="bg-surface/60 border border-border/50 rounded-xl p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Koszty zmienne</p>
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalVariable)}</p>
        </div>
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Łącznie</p>
          <p className="text-2xl font-bold text-accent-light">{formatCurrency(total)}</p>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Nowy koszt</CardTitle>
                <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nazwa"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Kategoria"
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    options={CATEGORY_OPTIONS}
                  />
                  <Select
                    label="Typ"
                    value={form.type}
                    onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    options={TYPE_OPTIONS}
                  />
                  <Input
                    label="Kwota"
                    type="number"
                    value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    suffix="PLN"
                    required
                  />
                  <Select
                    label="Miesiąc"
                    value={form.month}
                    onChange={e => setForm(p => ({ ...p, month: e.target.value }))}
                    options={MONTH_OPTIONS}
                  />
                </div>
                <Input
                  label="Notatki (opcjonalnie)"
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Anuluj</Button>
                  <Button type="submit" loading={saving} className="flex-1">Dodaj</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expense list */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-surface-2 animate-pulse" />)}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-16">
              <Receipt className="mx-auto mb-3 text-text-secondary" size={40} />
              <p className="text-text-secondary">Brak kosztów w tym miesiącu</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/70 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Receipt size={16} className="text-accent-light" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{expense.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={expense.type === 'FIXED' ? 'info' : 'warning'}>
                          {expense.type === 'FIXED' ? 'Stały' : 'Zmienny'}
                        </Badge>
                        <span className="text-xs text-text-secondary">
                          {EXPENSE_CATEGORY_LABELS[expense.category]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-base font-bold text-text-primary">{formatCurrency(expense.amount)}</p>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-danger/10 hover:text-danger text-text-secondary transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
