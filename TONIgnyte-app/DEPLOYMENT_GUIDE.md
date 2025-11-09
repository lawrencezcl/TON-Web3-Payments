# Deployment Guide: TON x Ignyte Web3 Payments

This document outlines the steps to deploy the TON x Ignyte Web3 Payments application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository for the project
- PostgreSQL database (e.g., from Neon, Supabase, or another provider)

## Deployment Steps

### 1. Connect Your Git Repository

1. Fork or clone this repository to your own GitHub/GitLab/Bitbucket account
2. Sign in to [Vercel](https://vercel.com) and click "New Project"
3. Select your Git provider and find the repository
4. Click "Import"

### 2. Configure Environment Variables

In your Vercel project settings, go to the "Environment Variables" section and add:

```
DATABASE_URL=your_postgres_database_url
NEXT_PUBLIC_APP_NAME="TON x Ignyte Web3 Payments"
NEXT_PUBLIC_APP_DESCRIPTION="Web3 payment solution for Telegram"
TON_NETWORK="mainnet"
```

**Note:** Replace `your_postgres_database_url` with your actual PostgreSQL database URL, which should follow this format:
```
postgresql://username:password@host:port/database?schema=public
```

### 3. Configure Build Settings (Optional)

In your Vercel project settings, under "Build & Development Settings":
- Framework Preset: Next.js (should be auto-detected)
- Build Command: `npm run build` (default)
- Install Command: `npm install` (default)
- Output Directory: `.next` (default)

### 4. Run Prisma Migrations

After the first deployment, you need to run database migrations. You can do this via Vercel's CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Link your project
vercel link

# Run migrations
vercel run npx prisma migrate deploy
```

Alternatively, you can set up automatic migrations by adding a post-deployment hook or by including the migration command in your build process.

### 5. Configure Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Vercel

## Database Setup

### Prisma Migrations

To set up the database schema, you'll need to run Prisma migrations. You can do this in several ways:

#### Option 1: Local Migration
```bash
# Set your production DATABASE_URL
export DATABASE_URL="your_production_database_url"

# Run the migration
npx prisma migrate dev
```

#### Option 2: Production Migration
```bash
# Run in production environment
npx prisma migrate deploy
```

#### Option 3: Using Vercel CLI
```bash
# Run migration in your deployed environment
vercel run npx prisma migrate deploy
```

## TON Connect Configuration

For TON Connect to work properly, ensure that:

1. The manifest URL in your TON Connect configuration matches your deployed domain
2. The `tonconnect-manifest.json` file is properly served from your domain root
3. Your domain supports HTTPS (required for TON Connect)

## Post-Deployment Tasks

### 1. Verify Database Connection

Check that the application can connect to the database by visiting the health check endpoint:
```
https://your-domain.vercel.app/api/health
```

### 2. Test TON Connect

Verify that wallet connections work properly on your deployed application.

### 3. Set Up Analytics (Optional)

Add your analytics tracking code in `app/layout.tsx` or via Vercel Analytics.

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Verify that your `DATABASE_URL` is correctly set in environment variables
2. **TON Connect Issues**: Ensure your domain is properly configured in the TON Connect manifest
3. **Build Failures**: Check that all dependencies are properly specified in `package.json`

### Monitoring

- Check Vercel's deployment logs for any build or runtime errors
- Monitor database connection and query performance
- Set up alerts for critical errors

## Maintenance

### Deploying Updates

1. Push changes to your Git repository
2. Vercel will automatically deploy the new version
3. Monitor the deployment logs for any issues

### Database Migrations

For schema changes, create and run new Prisma migrations:
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy
```

## Security Considerations

- Keep your `DATABASE_URL` and other sensitive environment variables secure
- Regularly update dependencies to patch security vulnerabilities
- Implement proper input validation and sanitization
- Use HTTPS for all communications
- Regularly audit your application for potential security issues