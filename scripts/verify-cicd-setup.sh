#!/bin/bash

# CI/CD Pipeline Verification Script

echo "Verifying CI/CD Pipeline Setup..."
echo "=================================="

# Check if GitHub repository exists
echo "1. Checking GitHub repository..."
if git remote get-url upstream > /dev/null 2>&1; then
    REPO_URL=$(git remote get-url upstream)
    echo "   ✓ GitHub repository configured: $REPO_URL"
else
    echo "   ✗ GitHub repository not configured"
    exit 1
fi

# Check if GitHub Actions workflow exists
echo "2. Checking GitHub Actions workflow..."
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "   ✓ GitHub Actions workflow exists"
else
    echo "   ✗ GitHub Actions workflow not found"
    exit 1
fi

# Check if Vercel configuration exists
echo "3. Checking Vercel configuration..."
if [ -f "TONIgnyte-app/vercel.json" ]; then
    echo "   ✓ Vercel configuration exists"
else
    echo "   ✗ Vercel configuration not found"
    exit 1
fi

# Check if environment variables example exists
echo "4. Checking environment variables example..."
if [ -f "TONIgnyte-app/.env.example" ]; then
    echo "   ✓ Environment variables example exists"
else
    echo "   ✗ Environment variables example not found"
    exit 1
fi

# Check if Node.js version is specified
echo "5. Checking Node.js version specification..."
if grep -q '"node":' "TONIgnyte-app/package.json"; then
    echo "   ✓ Node.js version specified in package.json"
else
    echo "   ✗ Node.js version not specified in package.json"
    exit 1
fi

# Check if build command is properly configured
echo "6. Checking build command configuration..."
if grep -q '"buildCommand"' "TONIgnyte-app/vercel.json"; then
    echo "   ✓ Build command properly configured in vercel.json"
else
    echo "   ✗ Build command not properly configured in vercel.json"
    exit 1
fi

echo ""
echo "CI/CD Pipeline Setup Verification Complete!"
echo "==========================================="
echo "✓ All checks passed. The CI/CD pipeline is properly configured."
echo ""
echo "Next steps:"
echo "1. Ensure Vercel secrets are configured in GitHub repository settings:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_PROJECT_ID"
echo "2. Push code to main branch to trigger deployment"
echo "3. Monitor deployment progress in GitHub Actions and Vercel dashboard"