import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'PLN') {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('pl-PL').format(value)
}

export const PLATFORM_LABELS: Record<string, string> = {
  ALLEGRO: 'Allegro',
  OLX: 'OLX',
  EMPIK: 'Empik',
  AMAZON: 'Amazon',
  WOOCOMMERCE: 'WooCommerce',
  SHOPIFY: 'Shopify',
  OTHER: 'Inne',
}

export const PLATFORM_COLORS: Record<string, string> = {
  ALLEGRO: '#ff5a00',
  OLX: '#002f5f',
  EMPIK: '#e31e24',
  AMAZON: '#ff9900',
  WOOCOMMERCE: '#7f54b3',
  SHOPIFY: '#95bf47',
  OTHER: '#64748b',
}

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  PACKAGING: 'Opakowania',
  TRANSPORT: 'Transport',
  FUEL: 'Paliwo',
  WAREHOUSE: 'Magazyn',
  ACCOUNTING: 'Księgowość',
  ZUS: 'ZUS',
  EMPLOYEES: 'Pracownicy',
  ADS: 'Reklamy',
  OTHER: 'Inne',
}

export const VAT_RATES: Record<string, number> = {
  VAT_23: 0.23,
  VAT_8: 0.08,
  VAT_5: 0.05,
  EXEMPT: 0,
}

export function calculateProfit(params: {
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
}) {
  const {
    sellingPrice,
    quantity,
    purchasePrice,
    commissionRate,
    adsCost,
    packagingCost,
    shippingCost,
    returnRate,
    vatRate,
    incomeTaxRate,
    zusMonthlyCost,
    accountingMonthlyCost,
    otherFixedCosts,
  } = params

  const revenue = sellingPrice * quantity
  const commissionAmount = revenue * (commissionRate / 100)
  const returnCost = revenue * (returnRate / 100)
  const totalVariableCosts = (purchasePrice + packagingCost + shippingCost) * quantity
  const totalFixedCosts = zusMonthlyCost + accountingMonthlyCost + otherFixedCosts

  const grossProfit = revenue - totalVariableCosts
  const profitAfterCommission = grossProfit - commissionAmount - returnCost
  const profitAfterAds = profitAfterCommission - adsCost
  const profitAfterAllCosts = profitAfterAds - totalFixedCosts

  const vatAmount = revenue * (VAT_RATES[vatRate] ?? 0)
  const profitAfterVat = profitAfterAllCosts - vatAmount
  const incomeTax = Math.max(0, profitAfterVat * (incomeTaxRate / 100))
  const netProfit = profitAfterVat - incomeTax

  const marginPercent = revenue > 0 ? (netProfit / revenue) * 100 : 0
  const roas = adsCost > 0 ? revenue / adsCost : 0

  // Breakeven: how many units to sell to cover all costs
  const unitMargin = sellingPrice - purchasePrice - packagingCost - shippingCost -
    sellingPrice * (commissionRate / 100) - sellingPrice * (returnRate / 100)
  const breakevenUnits = unitMargin > 0
    ? Math.ceil((totalFixedCosts + adsCost) / unitMargin)
    : Infinity

  return {
    revenue,
    commissionAmount,
    returnCost,
    totalVariableCosts,
    totalFixedCosts,
    grossProfit,
    profitAfterCommission,
    profitAfterAds,
    profitAfterAllCosts,
    vatAmount,
    profitAfterVat,
    incomeTax,
    netProfit,
    marginPercent,
    roas,
    breakevenUnits,
    unitMargin,
  }
}
