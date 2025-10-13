# Smart Home Frontend - Deployment Guide

This guide explains how to deploy the Smart Home frontend application to Vercel.

## Vercel Configuration

The project includes a `vercel.json` configuration file that:
- Configures the build process for React applications
- Sets up routing for Single Page Applications (SPA)
- Optimizes static asset caching
- Enables clean URLs without trailing slashes

## Automated Deployment with GitHub Actions

### Setup Requirements

1. **Vercel Account**: Create an account at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Project Setup**: Link your GitHub repository to Vercel

### Required GitHub Secrets

Add these secrets to your GitHub repository settings:

1. **VERCEL_TOKEN**: Personal access token from Vercel
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token and copy it

2. **VERCEL_ORG_ID**: Your Vercel organization ID
   - Run `vercel org ls` in your terminal
   - Copy the ID for your organization

3. **VERCEL_PROJECT_ID**: Your Vercel project ID
   - Run `vercel project ls` in your terminal
   - Copy the ID for your project

### Deployment Workflow

The GitHub Actions workflow (`/.github/workflows/deploy.yml`) automatically:

- **On Push to Main/Master**: Deploys to production
- **On Pull Requests**: Creates preview deployments
- **Runs Tests**: Ensures code quality before deployment
- **Builds Application**: Creates optimized production build

### Manual Deployment

You can also deploy manually using the Vercel CLI:

```bash
# Navigate to frontend directory
cd SmartHomeCapstone/frontend

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

### Environment Variables

If your application requires environment variables:

1. Add them to your `.env.local` file (not committed to git)
2. Configure them in Vercel Dashboard → Project Settings → Environment Variables
3. Reference them in your React app with `REACT_APP_` prefix

### Build Command

The application uses the standard React build process:
- **Build Command**: `npm run build` or `npm run vercel-build`
- **Output Directory**: `build`
- **Install Command**: `npm ci` (for faster, reliable installs in CI)

### Custom Domain (Optional)

To use a custom domain:
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed by Vercel

## Troubleshooting

### Common Issues

1. **Build Failures**: Check the build logs in Vercel dashboard
2. **Routing Issues**: Ensure `vercel.json` is properly configured for SPA routing
3. **Environment Variables**: Verify all required variables are set in Vercel

### Local Testing

Test the production build locally:

```bash
npm run build
npx serve -s build
```

This serves the build directory on `http://localhost:3000` to simulate production.
