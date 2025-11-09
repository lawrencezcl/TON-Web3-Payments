// components/layout/sidebar.tsx
'use client';

import { WalletConnector } from '@/components/ui/wallet-connector';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  HandCoins,
  Settings,
  BarChart3,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/dashboard', 
      icon: BarChart3, 
      label: 'Dashboard',
      active: pathname === '/dashboard'
    },
    { 
      href: '/split', 
      icon: Users, 
      label: 'Split Bills',
      active: pathname === '/split'
    },
    { 
      href: '/merchant', 
      icon: CreditCard, 
      label: 'Merchant Hub',
      active: pathname === '/merchant'
    },
    { 
      href: '/tip', 
      icon: HandCoins, 
      label: 'Tip Service',
      active: pathname === '/tip'
    },
    { 
      href: '/wallet', 
      icon: Wallet, 
      label: 'My Wallet',
      active: pathname === '/wallet'
    },
    { 
      href: '/settings', 
      icon: Settings, 
      label: 'Settings',
      active: pathname === '/settings'
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-background lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <DollarSign className="h-6 w-6" />
            <span>TON Web3</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <WalletConnector />
        </div>
      </div>
    </aside>
  );
}