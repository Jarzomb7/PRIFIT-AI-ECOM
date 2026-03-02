import { PrismaClient, Platform, VatRate, ExpenseType, ExpenseCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@ecomprofit.pl' },
    update: {},
    create: {
      email: 'demo@ecomprofit.pl',
      name: 'Jan Kowalski',
      password: hashedPassword,
    },
  })

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod_1' },
      update: {},
      create: {
        id: 'prod_1',
        userId: user.id,
        name: 'Słuchawki Bluetooth X200',
        sku: 'SLUCH-BT-X200',
        platform: Platform.ALLEGRO,
        purchasePrice: 45.00,
        sellingPrice: 129.00,
        stock: 87,
        minStock: 10,
        commissionRate: 8.5,
        packagingCost: 3.50,
        shippingCost: 9.99,
        returnRate: 3,
        vatRate: VatRate.VAT_23,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_2' },
      update: {},
      create: {
        id: 'prod_2',
        userId: user.id,
        name: 'Powerbank 20000mAh Pro',
        sku: 'PB-20K-PRO',
        platform: Platform.ALLEGRO,
        purchasePrice: 62.00,
        sellingPrice: 159.00,
        stock: 34,
        minStock: 15,
        commissionRate: 8.5,
        packagingCost: 4.00,
        shippingCost: 9.99,
        returnRate: 2,
        vatRate: VatRate.VAT_23,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_3' },
      update: {},
      create: {
        id: 'prod_3',
        userId: user.id,
        name: 'Kabel USB-C 2m Nylon',
        sku: 'KABEL-USBC-2M',
        platform: Platform.AMAZON,
        purchasePrice: 8.00,
        sellingPrice: 29.99,
        stock: 156,
        minStock: 30,
        commissionRate: 15,
        packagingCost: 1.50,
        shippingCost: 4.99,
        returnRate: 1.5,
        vatRate: VatRate.VAT_23,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_4' },
      update: {},
      create: {
        id: 'prod_4',
        userId: user.id,
        name: 'Smartwatch Fitness Band 5',
        sku: 'SW-FITNESS-5',
        platform: Platform.EMPIK,
        purchasePrice: 89.00,
        sellingPrice: 249.00,
        stock: 12,
        minStock: 10,
        commissionRate: 12,
        packagingCost: 5.00,
        shippingCost: 12.99,
        returnRate: 4,
        vatRate: VatRate.VAT_23,
      },
    }),
  ])

  // Generate sales for last 3 months
  const now = new Date()
  const salesData = []
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Random sales per day
    const dailySales = Math.floor(Math.random() * 8) + 2
    
    for (let s = 0; s < dailySales; s++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const qty = Math.floor(Math.random() * 3) + 1
      salesData.push({
        userId: user.id,
        productId: product.id,
        platform: product.platform,
        quantity: qty,
        unitPrice: product.sellingPrice,
        revenue: product.sellingPrice * qty,
        adsCost: Math.random() * product.sellingPrice * 0.1 * qty,
        date,
      })
    }
  }

  // Batch insert sales
  await prisma.sale.createMany({ data: salesData, skipDuplicates: false })

  // Create expenses
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  for (let m = Math.max(1, currentMonth - 2); m <= currentMonth; m++) {
    await prisma.expense.createMany({
      data: [
        { userId: user.id, name: 'ZUS przedsiębiorcy', category: ExpenseCategory.ZUS, type: ExpenseType.FIXED, amount: 1600, month: m, year: currentYear },
        { userId: user.id, name: 'Biuro rachunkowe', category: ExpenseCategory.ACCOUNTING, type: ExpenseType.FIXED, amount: 350, month: m, year: currentYear },
        { userId: user.id, name: 'Wynajem magazynu', category: ExpenseCategory.WAREHOUSE, type: ExpenseType.FIXED, amount: 800, month: m, year: currentYear },
        { userId: user.id, name: 'Materiały pakowe', category: ExpenseCategory.PACKAGING, type: ExpenseType.VARIABLE, amount: Math.round(200 + Math.random() * 300), month: m, year: currentYear },
        { userId: user.id, name: 'Reklamy Allegro Ads', category: ExpenseCategory.ADS, type: ExpenseType.VARIABLE, amount: Math.round(800 + Math.random() * 600), month: m, year: currentYear, platform: Platform.ALLEGRO },
        { userId: user.id, name: 'Reklamy Amazon PPC', category: ExpenseCategory.ADS, type: ExpenseType.VARIABLE, amount: Math.round(400 + Math.random() * 300), month: m, year: currentYear, platform: Platform.AMAZON },
        { userId: user.id, name: 'Paliwo', category: ExpenseCategory.FUEL, type: ExpenseType.VARIABLE, amount: Math.round(150 + Math.random() * 100), month: m, year: currentYear },
      ],
      skipDuplicates: false,
    })
  }

  console.log('✅ Seed completed!')
  console.log('📧 Login: demo@ecomprofit.pl')
  console.log('🔑 Password: demo1234')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
