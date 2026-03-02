'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Nieprawidłowy email lub hasło')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 mb-4 shadow-lg shadow-accent/10">
            <TrendingUp className="w-7 h-7 text-accent-light" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Witaj z powrotem</h1>
          <p className="text-text-secondary text-sm mt-1">Zaloguj się do swojego konta EcomProfit</p>
        </div>

        {/* Form */}
        <div className="bg-surface/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                label="Hasło"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Zaloguj się
            </Button>
          </form>

          <div className="mt-6 p-3 bg-surface-2/50 rounded-lg">
            <p className="text-xs text-text-secondary text-center mb-1">Demo konto:</p>
            <p className="text-xs text-text-primary text-center font-mono">demo@ecomprofit.pl / demo1234</p>
          </div>

          <p className="text-center text-sm text-text-secondary mt-6">
            Nie masz konta?{' '}
            <Link href="/auth/register" className="text-accent-light hover:text-accent transition-colors font-medium">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
