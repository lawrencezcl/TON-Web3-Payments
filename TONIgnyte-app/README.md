# TON x Ignyte - Web3 Payments on Telegram

This is a Next.js application that implements the TON x Ignyte Global Challenge solution for Web3 payments on Telegram.

## Features

1. **Bill Splitting Among Friends** - Split bills instantly with friends using TON cryptocurrency
2. **Merchant Payment Hub** - Accept payments and run loyalty programs with tokenization
3. **Frictionless Tipping for Service Workers** - Tip service workers instantly with crypto

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Blockchain**: TON (The Open Network)
- **Wallet Integration**: TON Connect
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/                  # Next.js app router pages
components/           # React components
  bill-split/         # Bill splitting components
  merchant/           # Merchant payment components
  tipping/            # Tipping platform components
  ui/                 # shadcn/ui components
  providers/          # React context providers
lib/                  # Utility functions and services
  services/           # Business logic services
public/               # Static assets
styles/               # Global styles
```

## Core Components

### UI Components (shadcn/ui)
- Button
- Card
- Input
- Badge
- Avatar
- Table
- Form
- Label

### Custom Components
- WalletConnector - TON wallet connection button
- ExpenseForm - Form for adding bill splitting expenses
- PaymentQR - QR code payment interface for merchants
- TipInterface - Tipping interface for service workers

## Services

- AuthService - Wallet authentication and signature verification
- PaymentService - TON blockchain payment processing
- SplitEngineService - Bill splitting algorithm

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [TON Blockchain Documentation](https://ton.org/docs)
- [TON Connect Documentation](https://docs.ton.org/ton-connect)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)