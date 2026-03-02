'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, User, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Błąd rejestracji')
        setLoading(false)
        return
      }

      // Auto login
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.ok) router.push('/dashboard')
    } catch {
      setError('Błąd połączenia z serwerem')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 mb-4">
            <TrendingUp className="w-7 h-7 text-accent-light" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Utwórz konto</h1>
          <p className="text-text-secondary text-sm mt-1">Zacznij kontrolować swoje zyski</p>
        </div>

        <div className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-3 top-9 w-4 h-4 text-text-secondary" />
              <Input
                label="Imię i nazwisko"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jan Kowalski"
                className="pl-9"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-9 w-4 h-4 text-text-secondary" />
              <Input
                label="Adres email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan@firma.pl"
                className="pl-9"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-9 w-4 h-4 text-text-secondary" />
              <Input
                label="Hasło (min. 8 znaków)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Zarejestruj się
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Masz już konto?{' '}
            <Link href="/auth/login" className="text-accent-light hover:text-accent transition-colors font-medium">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
