'use client'

import { Bell, Search } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const [date] = useState(() =>
    new Intl.DateTimeFormat('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date())
  )

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
        ) : (
          <p className="text-sm text-text-secondary mt-0.5 capitalize">{date}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-lg border border-border/50 bg-surface/60 flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border transition-colors">
          <Bell size={16} />
        </button>
      </div>
    </header>
  )
}
