'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, Shield, Bell, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="animate-slide-up max-w-2xl">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Ustawienia</h1>
      <p className="text-sm text-text-secondary mb-8">Zarządzaj swoim kontem</p>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} className="text-accent-light" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Imię i nazwisko" defaultValue={session?.user?.name ?? ''} />
            <Input label="Adres email" defaultValue={session?.user?.email ?? ''} type="email" />
            <Button variant="outline">Zapisz zmiany</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={18} className="text-warning" />
              Bezpieczeństwo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Obecne hasło" type="password" placeholder="••••••••" />
            <Input label="Nowe hasło" type="password" placeholder="••••••••" />
            <Input label="Powtórz nowe hasło" type="password" placeholder="••••••••" />
            <Button variant="outline">Zmień hasło</Button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={18} className="text-accent-light" />
              Subskrypcja
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-accent/20">
              <div>
                <p className="font-semibold text-text-primary">Plan Free</p>
                <p className="text-sm text-text-secondary">Wszystkie podstawowe funkcje</p>
              </div>
              <Button>Ulepsz do Pro</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
