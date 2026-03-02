# EcomProfit 📊

**Profesjonalny system CRM + Profit Calculator dla sprzedawców e-commerce**

Rozwiązuje kluczowy problem sprzedawców na Allegro, OLX, Empik, Amazon i własnych sklepach: **brak wiedzy o realnym zysku po wszystkich kosztach**.

---

## 🚀 Funkcje

| Moduł | Opis |
|-------|------|
| **Dashboard** | KPI w czasie rzeczywistym: przychód, zysk, marża, ROAS |
| **Kalkulator zysku** | Obliczenia krok po kroku: prowizje, VAT, ZUS, podatek |
| **Produkty** | Zarządzanie magazynem, alerty niskiego stanu |
| **Koszty firmowe** | Stałe i zmienne, kategoryzowane |
| **Analiza platform** | Porównanie Allegro / Amazon / OLX / Empik |
| **Zatowarowanie** | Rekomendacje zamówień i cashflow forecast |

---

## 🛠 Stack technologiczny

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** (dark glassmorphism design)
- **Prisma ORM** + PostgreSQL (Neon / Supabase)
- **NextAuth.js** (credentials + JWT)
- **Recharts** (wykresy)

---

## ⚡ Szybki start

### 1. Klonuj i zainstaluj

```bash
git clone https://github.com/twoj-user/ecomprofit.git
cd ecomprofit
npm install
```

### 2. Skonfiguruj zmienne środowiskowe

```bash
cp .env.example .env
```

Wypełnij `.env`:

```env
# Neon (https://neon.tech) lub Supabase
DATABASE_URL="postgresql://..."

# Wygeneruj: openssl rand -base64 32
NEXTAUTH_SECRET="twoj-sekret-min-32-znaki"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Uruchom bazę danych

```bash
npm run db:push    # Stwórz tabele
npm run db:seed    # Załaduj demo dane
```

### 4. Uruchom devserver

```bash
npm run dev
```

Otwórz: http://localhost:3000

**Demo konto:** `demo@ecomprofit.pl` / `demo1234`

---

## 🌐 Wdrożenie na Vercel

### Krok 1: Baza danych (Neon - darmowy)

1. Zarejestruj się na https://neon.tech
2. Stwórz projekt → skopiuj `DATABASE_URL`

### Krok 2: Deploy na Vercel

```bash
npm install -g vercel
vercel
```

LUB przez GitHub:
1. Push do GitHub
2. https://vercel.com → New Project → Import
3. Framework: Next.js (autodetect)

### Krok 3: Environment Variables na Vercel

W panelu Vercel → Settings → Environment Variables dodaj:

```
DATABASE_URL = postgresql://...
NEXTAUTH_SECRET = twoj-sekret
NEXTAUTH_URL = https://twoja-domena.vercel.app
```

### Krok 4: Migracja bazy

```bash
# Po deployu, uruchom lokalnie z production DATABASE_URL:
DATABASE_URL="..." npm run db:push
DATABASE_URL="..." npm run db:seed
```

---

## 📁 Struktura projektu

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth + rejestracja
│   │   ├── products/      # CRUD produktów
│   │   ├── expenses/      # CRUD kosztów
│   │   └── dashboard/     # Statystyki
│   ├── auth/              # Login / Register
│   ├── dashboard/         # Główny panel
│   ├── calculator/        # Kalkulator zysku
│   ├── products/          # Zarządzanie produktami
│   ├── expenses/          # Koszty firmowe
│   ├── platforms/         # Analiza platform
│   ├── restock/           # Zatowarowanie
│   └── settings/          # Ustawienia
├── components/
│   ├── dashboard/         # Wykresy, karty KPI
│   ├── layout/            # Sidebar, Header
│   └── ui/                # Button, Input, Card, Badge
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Helpers + calculateProfit()
└── types/
    └── index.ts
prisma/
├── schema.prisma          # Modele: User, Product, Sale, Expense
└── seed.ts                # Demo dane
```

---

## 🗄 Schemat bazy danych

```
User ──< Product ──< Sale
User ──< Expense
User ──< UserPlatform
```

### Kluczowe modele:

- **Product**: name, platform, purchasePrice, sellingPrice, stock, commissionRate, shippingCost...
- **Sale**: productId, platform, quantity, revenue, adsCost, date
- **Expense**: name, category (ZUS/ADS/WAREHOUSE...), type (FIXED/VARIABLE), amount, month, year

---

## 🔧 Kalkulator zysku - logika

Funkcja `calculateProfit()` w `src/lib/utils.ts`:

```
Przychód
  - Koszt towaru
  - Prowizja platformy
  - Koszt zwrotów
= Zysk po prowizjach

  - Koszty reklam
= Zysk po reklamach

  - ZUS + Księgowość + Inne koszty stałe
= Zysk przed podatkami

  - VAT (23%/8%/5%/zwolnienie)
  - Podatek dochodowy (12%/19%)
= REALNY ZYSK NETTO
```

Automatycznie liczy też:
- Marżę %
- ROAS
- Próg rentowności (ile sztuk sprzedać żeby wyjść na zero)
- Marżę jednostkową

---

## 🔐 Bezpieczeństwo SaaS

- Każdy użytkownik widzi **tylko swoje dane** (filtrowanie po `userId`)
- Hasła hashowane bcryptjs (cost factor 10)
- Sesje JWT z NextAuth
- Walidacja wejścia Zod na wszystkich endpointach API

---

## 📈 Roadmap

- [ ] Import CSV z Allegro / Amazon
- [ ] Integracje API (Allegro API, BaseLinker)
- [ ] Plan subskrypcji (Stripe)
- [ ] Eksport raportów PDF
- [ ] Powiadomienia email (niski stan, progi zysku)
- [ ] Aplikacja mobilna (React Native)

---

## 📝 Licencja

MIT
