'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Calculator,
  Package,
  Receipt,
  BarChart3,
  ShoppingCart,
  LogOut,
  TrendingUp,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calculator', label: 'Kalkulator zysku', icon: Calculator },
  { href: '/products', label: 'Produkty', icon: Package },
  { href: '/expenses', label: 'Koszty firmowe', icon: Receipt },
  { href: '/platforms', label: 'Platformy', icon: BarChart3 },
  { href: '/restock', label: 'Zatowarowanie', icon: ShoppingCart },
  { href: '/settings', label: 'Ustawienia', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface/80 backdrop-blur-xl border-r border-border/50 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-text-primary text-sm">EcomProfit</p>
            <p className="text-xs text-text-secondary">Panel zarządzania</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-accent/15 text-accent-light border border-accent/20'
                  : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
              )}
            >
              <Icon className={cn('w-4.5 h-4.5 flex-shrink-0', active ? 'text-accent-light' : '')} size={18} />
              <span>{label}</span>
              {active && <ChevronRight className="ml-auto w-4 h-4 text-accent-light" />}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <span className="text-xs font-bold text-accent-light">
              {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {session?.user?.name ?? 'Użytkownik'}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
        >
          <LogOut size={16} />
          Wyloguj się
        </button>
      </div>
    </aside>
  )
}
