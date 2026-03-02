export interface DashboardStats {
  revenue: number
  costs: number
  netProfit: number
  margin: number
  totalSales: number
  adsCost: number
  roas: number
  revenueChange: number
  profitChange: number
}

export interface RevenueChartData {
  date: string
  revenue: number
  costs: number
  profit: number
}

export interface PlatformStats {
  platform: string
  revenue: number
  costs: number
  profit: number
  margin: number
  sales: number
  adsCost: number
  roas: number
}

export interface TopProduct {
  id: string
  name: string
  platform: string
  revenue: number
  profit: number
  quantity: number
  margin: number
}

export interface CostBreakdown {
  category: string
  amount: number
  percentage: number
}
