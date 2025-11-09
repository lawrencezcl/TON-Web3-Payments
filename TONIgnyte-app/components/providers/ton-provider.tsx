// components/providers/ton-provider.tsx
'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Use a local manifest URL for development
const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const manifestUrl = isDev 
  ? `${window.location.origin}/tonconnect-manifest.json`
  : 'https://ton-web3-payments.vercel.app/tonconnect-manifest.json';

export function TonProvider({ children }: Props) {
  return <TonConnectUIProvider manifestUrl={manifestUrl}>{children}</TonConnectUIProvider>;
}