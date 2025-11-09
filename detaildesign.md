# Detailed Design: TON x Ignyte Global Challenge - Web3 Payments on Telegram

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Tech Stack Overview](#tech-stack-overview)
3. [UI/UX Design with shadcn/ui](#uiux-design-with-shadcnui)
4. [API & Service Architecture](#api--service-architecture)
5. [Implementation Roadmap](#implementation-roadmap)

## Executive Summary

This detailed design document expands on the original solution for the TON x Ignyte Global Challenge, focusing on a Web3 payment solution that accelerates adoption within Telegram. This design incorporates modern UI/UX practices using shadcn/ui and a Vercel-based tech stack for optimal performance and developer experience.

The solution encompasses three interconnected use cases:
1. Bill Splitting Among Friends
2. Merchant Payment Acceptance with Loyalty Tokenization
3. Frictionless Tipping for Service Workers

## Tech Stack Overview

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (for wallet state) + React Query (for server state)
- **Blockchain Integration**: @tonconnect/ui-react, ton-core, ton

### Backend Stack
- **Platform**: Vercel (Serverless Functions)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL (for user data, transactions)
- **Cache**: Redis (Vercel KV)
- **Authentication**: NextAuth.js + TON Connect
- **Blockchain Interaction**: ton-core, ton

### Development Tools
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **WebSockets**: Vercel's real-time capabilities

## UI/UX Design with shadcn/ui

### Design Principles
- **Simplicity**: Clean, minimal interface that doesn't intimidate non-crypto users
- **Familiarity**: UI patterns that feel familiar from traditional payment apps
- **Trust**: Clear feedback for blockchain transactions and security indicators
- **Accessibility**: Full compliance with WCAG 2.1 guidelines using Radix UI primitives

### Core Components

#### 1. Wallet Connection System
```tsx
// components/ui/wallet-connector.tsx
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@tonconnect/ui-react";

export function WalletConnector() {
  return (
    <ConnectButton 
      component={CustomButton}
    />
  );
}

function CustomButton({ connect, connected }) {
  return (
    <Button 
      onClick={connect}
      variant={connected ? "secondary" : "default"}
    >
      {connected ? "Connected" : "Connect Wallet"}
    </Button>
  );
}
```

#### 2. Dashboard Layout
- **Sidebar**: Navigation between bill splitting, payments, tipping, and loyalty
- **Header**: Wallet connection status, notifications, user profile
- **Main Content**: Context-aware views based on selected feature

#### 3. Bill Splitting UI Components

**Expense Creation Form**:
- Uses `shadcn/ui` form components with React Hook Form
- Input validation with Zod
- Participant selection with avatar display
- Category tags with `Badge` components

```tsx
// components/bill-split/expense-form.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ExpenseForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Input id="description" placeholder="Dinner at Italian restaurant" />
          </div>
          <div className="space-y-2">
            <label htmlFor="amount">Amount</label>
            <Input id="amount" type="number" placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <label>Participants</label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Alice</Badge>
              <Badge variant="secondary">Bob</Badge>
              <Badge variant="outline">+ Add</Badge>
            </div>
          </div>
          <Button type="submit" className="w-full">Add Expense</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

**Settlement View**:
- Table showing who owes whom using `Table` component
- Visual indicators for settlement status
- Action buttons for initiating payments

#### 4. Merchant Payment Hub UI Components

**QR Code Payment Interface**:
- Large QR code display with merchant information
- Amount input with validation
- Payment confirmation flow

```tsx
// components/merchant/payment-qr.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export function PaymentQR({ merchantId, amount }) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="border-2 border-gray-200 p-4 rounded-lg mb-4">
          {/* QR code would be generated here */}
          <div className="bg-gray-800 w-48 h-48 flex items-center justify-center">
            <QrCode className="text-white w-32 h-32" />
          </div>
        </div>
        <p className="text-lg font-medium mb-2">Pay to: Merchant #{merchantId}</p>
        <p className="text-2xl font-bold text-primary mb-4">{amount} TON</p>
        <Button>Confirm Payment</Button>
      </CardContent>
    </Card>
  );
}
```

**Loyalty Dashboard**:
- Progress indicators for loyalty tiers
- Token balance display
- Redemption options

#### 5. Tipping Platform UI Components

**Tipping Interface**:
- Quick tip amount buttons (10%, 15%, 20%)
- Custom amount input
- Service worker profile display

```tsx
// components/tipping/tip-interface.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TipInterface({ worker }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={worker.avatar} />
          <AvatarFallback>{worker.initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{worker.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{worker.role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p className="mb-4">How much would you like to tip?</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button variant="outline">10%</Button>
            <Button variant="outline">15%</Button>
            <Button variant="outline">20%</Button>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Custom amount" />
            <Button>Send Tip</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Responsive Design
- Mobile-first approach optimized for Telegram Web Apps
- Touch-friendly targets (minimum 44px)
- Adaptive layouts for different screen sizes
- Dark/light mode support using `next-themes`

### Accessibility Features
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators for interactive elements

## API & Service Architecture

### Next.js API Routes Structure
```
app/
├── api/
│   ├── auth/           # Authentication endpoints
│   │   └── [...nextauth]/route.ts
│   ├── wallet/         # TON wallet integration
│   │   ├── connect/route.ts
│   │   └── status/route.ts
│   ├── payments/       # Payment processing
│   │   ├── create/route.ts
│   │   ├── process/route.ts
│   │   └── verify/route.ts
│   ├── splits/         # Bill splitting
│   │   ├── create/route.ts
│   │   ├── calculate/route.ts
│   │   └── settle/route.ts
│   ├── merchants/      # Merchant management
│   │   ├── register/route.ts
│   │   ├── qr/route.ts
│   │   └── dashboard/route.ts
│   ├── loyalty/        # Loyalty tokens
│   │   ├── mint/route.ts
│   │   ├── balance/route.ts
│   │   └── redeem/route.ts
│   └── tipping/        # Tipping functionality
│       ├── send/route.ts
│       ├── history/route.ts
│       └── rates/route.ts
```

### Service Layer Implementation

#### Authentication Service
```typescript
// lib/services/auth-service.ts
import { verify } from '@tonconnect/protocol';

export class AuthService {
  static async verifyWalletSignature(
    address: string, 
    signature: string, 
    payload: string
  ): Promise<boolean> {
    try {
      const isValid = verify(address, signature, payload);
      return isValid;
    } catch (error) {
      console.error('Wallet signature verification failed:', error);
      return false;
    }
  }
}
```

#### Payment Processing Service
```typescript
// lib/services/payment-service.ts
import { Address, beginCell, contractAddress, internal, toNano } from 'ton-core';
import { TonClient } from 'ton';

export class PaymentService {
  private client: TonClient;

  constructor() {
    this.client = new TonClient({
      endpoint: process.env.TON_ENDPOINT!
    });
  }

  async createPaymentIntent(
    senderAddress: string,
    recipientAddress: string,
    amount: string
  ): Promise<any> {
    // Create payment intent with TON blockchain
    return {
      transactionId: `tx_${Date.now()}`,
      sender: senderAddress,
      recipient: recipientAddress,
      amount: toNano(amount),
      status: 'pending',
      expiresAt: Date.now() + 300000 // 5 minutes
    };
  }

  async executePayment(
    transactionId: string,
    senderAddress: string,
    recipientAddress: string,
    amount: string
  ): Promise<boolean> {
    // Execute payment on TON blockchain
    // Implementation would interact with smart contracts
    return true;
  }
}
```

#### Bill Splitting Engine Service
```typescript
// lib/services/split-engine-service.ts
export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  splits: Record<string, number>;
}

export class SplitEngineService {
  static calculateOptimalSettlements(expenses: Expense[]): any[] {
    // Calculate net balances for each user
    const balances = new Map<string, number>();
    
    for (const expense of expenses) {
      // Add amount to payer's balance
      balances.set(expense.paidBy, (balances.get(expense.paidBy) || 0) + expense.amount);
      
      // Subtract split amounts from participants
      const splitAmount = expense.amount / expense.participants.length;
      for (const participant of expense.participants) {
        balances.set(participant, (balances.get(participant) || 0) - splitAmount);
      }
    }
    
    // Convert balances to settlements
    const settlements: any[] = [];
    const creditors = Array.from(balances.entries())
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1]); // Sort by highest creditor
    
    const debtors = Array.from(balances.entries())
      .filter(([_, amount]) => amount < 0)
      .sort((a, b) => a[1] - b[1]); // Sort by highest debtor
    
    let creditorIdx = 0;
    let debtorIdx = 0;
    
    while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
      const [creditor, creditorBalance] = creditors[creditorIdx];
      const [debtor, debtorBalance] = debtors[debtorIdx];
      
      const settlementAmount = Math.min(creditorBalance, Math.abs(debtorBalance));
      
      settlements.push({
        from: debtor,
        to: creditor,
        amount: settlementAmount
      });
      
      creditors[creditorIdx][1] -= settlementAmount;
      debtors[debtorIdx][1] += settlementAmount;
      
      if (creditors[creditorIdx][1] === 0) creditorIdx++;
      if (debtors[debtorIdx][1] === 0) debtorIdx++;
    }
    
    return settlements;
  }
}
```

### Database Schema (PostgreSQL with Neon)

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(50) UNIQUE NOT NULL,
  ton_address VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paid_by_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  group_id UUID
);

-- Expense participants
CREATE TABLE expense_participants (
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  PRIMARY KEY (expense_id, user_id)
);

-- Merchants table
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ton_address VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_address VARCHAR(100) NOT NULL,
  to_address VARCHAR(100) NOT NULL,
  amount DECIMAL(15, 9) NOT NULL,
  transaction_hash VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  type VARCHAR(50), -- 'payment', 'tip', 'split'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty tokens table
CREATE TABLE loyalty_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id),
  merchant_id UUID REFERENCES merchants(id),
  token_amount DECIMAL(15, 9) NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Caching Strategy (Vercel KV/Redis)
- User session data
- Merchant configuration
- Exchange rates
- Recent transactions
- Loyalty program rules

### WebSocket Implementation for Real-time Updates
```typescript
// lib/websocket.ts
export class WebSocketService {
  static async broadcastSettlementUpdate(settlement: any) {
    // Implementation for real-time settlement notifications
    // Would use Vercel's real-time capabilities or third-party service
  }
}
```

### Error Handling & Monitoring
- Centralized error logging with structured data
- API rate limiting
- Transaction validation
- Blockchain interaction error handling

## Implementation Roadmap

### Phase 1: Core Infrastructure (Weeks 1-2)
1. Set up Next.js project with TypeScript and Tailwind CSS
2. Integrate shadcn/ui components
3. Implement authentication with TON Connect
4. Set up database schema and connection
5. Create basic API route structure

### Phase 2: Bill Splitting Feature (Weeks 3-4)
1. Design and implement bill splitting UI components
2. Build split calculation engine
3. Implement transaction processing for settlements
4. Add real-time notifications
5. Create user dashboard views

### Phase 3: Merchant Payment Hub (Weeks 5-6)
1. Design merchant onboarding flow
2. Implement QR code payment interface
3. Build loyalty token system
4. Create merchant dashboard
5. Integrate with TON blockchain for payments

### Phase 4: Tipping Platform (Weeks 7-8)
1. Design tipping interface
2. Implement service worker profiles
3. Add rating and review system
4. Create performance analytics dashboard
5. Integrate with loyalty tokens

### Phase 5: Integration & Testing (Weeks 9-10)
1. Cross-feature integration testing
2. Performance optimization
3. Security audit and fixes
4. User acceptance testing
5. Deployment preparation

### Phase 6: Deployment & Launch (Weeks 11-12)
1. Deploy to Vercel
2. Set up monitoring and analytics
3. Prepare documentation
4. Launch to pilot users
5. Gather feedback and iterate

## Security Considerations

### Authentication
- TON Connect for non-custodial wallet authentication
- Session management with secure tokens
- Rate limiting on authentication attempts

### Financial Transactions
- Transaction validation at multiple levels
- Amount limits based on user tier
- Double-spending protection
- Real-time fraud detection

### Data Protection
- Encryption at rest and in transit
- Proper handling of TON addresses
- GDPR compliance for user data
- Secure storage of sensitive information

## Performance Optimization

### Frontend
- Code splitting and lazy loading
- Image optimization with Next.js Image
- Caching strategies with React Query
- Bundle size optimization

### Backend
- Database query optimization
- Caching with Redis for frequently accessed data
- Efficient indexing strategies
- Serverless function optimization

### Blockchain
- Batch operations where possible
- Efficient smart contract interactions
- Proper gas estimation
- Transaction status polling optimization

## Monitoring & Analytics

### Key Metrics
- Transaction volume and success rates
- User acquisition and retention
- Feature usage patterns
- System performance indicators

### Implementation
- Integration with analytics platform
- Custom dashboards for business metrics
- Error tracking and alerting
- Performance monitoring

This detailed design provides a comprehensive roadmap for implementing the TON x Ignyte Web3 payment solution using modern UI/UX practices with shadcn/ui and a robust Vercel-based tech stack.