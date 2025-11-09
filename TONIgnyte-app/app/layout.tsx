// app/layout.tsx
import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TonProvider } from '@/components/providers/ton-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WalletProvider } from '@/components/providers/wallet-provider'
import { Sidebar } from '@/components/layout/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TON Web3 Payments',
  description: 'Web3 payment solution for Telegram',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TonProvider>
          <WalletProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 lg:pl-64">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </WalletProvider>
        </TonProvider>
      </body>
    </html>
  )
}