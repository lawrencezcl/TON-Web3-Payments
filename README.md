# TON Web3 Payments Solution

A comprehensive Web3 payment solution for Telegram integration using TON blockchain technology. This solution enables seamless cryptocurrency transactions for bill splitting, merchant payments, and tipping.

## Features

- **Bill Splitting**: Split bills with friends instantly on Telegram using TON cryptocurrency
- **Merchant Hub**: Accept payments and run loyalty programs with tokenization for businesses
- **Tipping Platform**: Tip service workers instantly with crypto and earn loyalty rewards
- **TON Blockchain Integration**: Secure, fast, and low-cost transactions on the TON blockchain
- **Wallet Connectivity**: Seamless wallet connection using TON Connect
- **Loyalty Token System**: Smart contract-based loyalty tokens for merchants

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: TON (The Open Network), TON Connect
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: TON-based wallet authentication
- **Deployment**: Vercel

## Architecture

The application is built with a clean architecture separating concerns:

- **UI Layer**: React components with shadcn/ui
- **Service Layer**: Business logic and API integrations
- **Contract Layer**: TON smart contract interactions
- **Data Layer**: Database with Prisma ORM

## Smart Contracts

The solution includes custom-built TON smart contracts for:

- **Loyalty Token Contract**: Manages merchant-specific loyalty tokens
- **Payment Processing**: Secure and efficient payment handling
- **Token Minting/Burning**: For loyalty program management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/lawrencezcl/TON-Web3-Payments.git
cd TON-Web3-Payments/TONIgnyte-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Set up the database:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run db:setup` - Set up database
- `npm run db:migrate` - Run database migrations
- `npm run contract:compile` - Compile smart contracts
- `npm run contract:deploy` - Deploy smart contracts

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── merchant/          # Merchant hub
│   ├── split/             # Bill splitting
│   ├── tip/               # Tipping platform
│   └── ...                # Other pages
├── components/            # React components
│   ├── layout/            # Layout components
│   ├── merchant/          # Merchant-specific components
│   ├── providers/         # Context providers
│   ├── tipping/           # Tipping components
│   ├── ui/                # UI components (shadcn/ui)
│   └── wallet/            # Wallet components
├── lib/                   # Libraries and utilities
│   ├── services/          # Business logic services
│   └── utils.ts           # Utility functions
├── contracts/             # TON smart contracts (FunC)
├── scripts/               # Build and deployment scripts
├── public/                # Static assets
├── styles/                # Global styles
└── ...
```

## Smart Contract Development

Smart contracts are written in FunC (TON's smart contract language):

1. To compile contracts:
```bash
npm run contract:compile
```

2. To deploy contracts (requires funded testnet wallet):
```bash
npm run contract:deploy
```

## API Endpoints

The application exposes several REST API endpoints:

- `/api/users` - User management
- `/api/payments/*` - Payment processing
- `/api/loyalty/*` - Loyalty token operations
- `/api/merchants/*` - Merchant hub operations
- `/api/splits/*` - Bill splitting operations
- `/api/tipping/*` - Tipping operations

## Wallet Integration

The application uses TON Connect for wallet integration, providing:

- Secure wallet connection
- Transaction signing
- Balance checking
- Address validation

## Deployment

The application is configured for deployment on Vercel with an automated CI/CD pipeline. The setup includes:

- GitHub Actions workflow for automatic deployments
- Environment-specific configurations
- Database migrations on deployment
- Build process with dependency installation and Prisma generation

### CI/CD Pipeline

The CI/CD pipeline is configured as follows:
1. Code is pushed to the GitHub repository
2. GitHub Actions workflow triggers automatically
3. Dependencies are installed and tests run
4. Application is built
5. Deployed to Vercel (preview for PRs, production for main branch)

For the deployment to work properly, ensure the following environment variables are set in Vercel:
- `POSTGRES_PRISMA_URL`: Database connection string (provided by Vercel Postgres)
- `JWT_SECRET`: Secret key for authentication
- `NEXT_PUBLIC_APP_URL`: Application URL
- `NEXT_PUBLIC_TON_NETWORK`: TON network (testnet/mainnet)
- `VERCEL_GIT_COMMIT_REF`: For environment-specific configurations

The build process includes:
- Dependency installation
- Prisma client generation (`prisma generate`)
- Next.js build (`next build`)
- Smart contract compilation (if needed)

## Security Considerations

- All blockchain interactions are validated
- Proper wallet authentication is implemented
- Input sanitization for all user inputs
- Rate limiting for API endpoints
- Secure handling of private keys (never stored)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and commit (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built for the TON Web3 Payments Solution
- Leveraging the power of TON blockchain technology
- Designed for seamless Telegram integration// Trigger deployment at 2025-11-09 13:21:00
// Deployment trigger line
// Fix build issues - 2025-11-09 13:45:00
