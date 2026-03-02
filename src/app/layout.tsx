import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'EcomProfit - System zarządzania sprzedażą',
  description: 'Profesjonalny CRM i kalkulator zysku dla sprzedawców e-commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-background text-text-primary antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
