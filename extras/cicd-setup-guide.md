# CI/CD Setup Guide

## Overview

This guide provides complete CI/CD setup examples for Vue 3 applications, including GitHub Actions, GitLab CI, and deployment to popular platforms.

---

## GitHub Actions

### Basic CI Workflow

Location: `.github/workflows/ci.yml`

This workflow runs on every push and pull request:

**Features:**
- Linting with ESLint
- Running tests with Vitest
- Building the application
- Matrix testing with Node.js 18 and 20
- Automatic deployment to production on main branch

### Frontend-Specific CI

Location: `.github/workflows/frontend-ci.yml`

Tests all example projects in the course:

**Features:**
- Matrix strategy for multiple projects
- Individual project testing
- Build verification
- Parallel execution

### Deployment Workflow

Location: `.github/workflows/deploy-examples.yml`

Deploys examples to Vercel and Netlify:

**Features:**
- Manual and automatic deployment
- Multiple deployment targets
- Environment variable management

### Setup Instructions

1. **Create GitHub Secrets:**

   Go to Repository Settings → Secrets and variables → Actions

   For Vercel:
   - `VERCEL_TOKEN`: Get from Vercel dashboard
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

   For Netlify:
   - `NETLIFY_AUTH_TOKEN`: Get from Netlify dashboard
   - `NETLIFY_SITE_ID`: Your Netlify site ID

2. **Enable GitHub Actions:**

   - Go to Repository Settings → Actions → General
   - Enable "Allow all actions and reusable workflows"

3. **Test the Workflow:**

   ```bash
   git push origin main
   ```

   Check Actions tab to see workflow running.

---

## GitLab CI

### Complete GitLab CI Configuration

Location: `.gitlab-ci.yml`

**Stages:**
1. **Install**: Install dependencies
2. **Lint**: Run linters
3. **Test**: Run tests
4. **Build**: Build applications
5. **Deploy**: Deploy to production

### Setup Instructions

1. **Add to GitLab Repository:**

   ```bash
   # Copy .gitlab-ci.yml to your GitLab repository root
   cp .gitlab-ci.yml /path/to/gitlab-repo/
   ```

2. **Configure GitLab Runner:**

   ```bash
   # Register a GitLab Runner (if not already done)
   gitlab-runner register
   ```

3. **Set Variables (Optional):**

   GitLab → Settings → CI/CD → Variables

---

## Vercel Deployment

### Automatic Deployment

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login:**

   ```bash
   vercel login
   ```

3. **Deploy:**

   ```bash
   cd lesson1-fundamentals-setup/example/vite-demo
   vercel
   ```

### Manual Deployment via GitHub Actions

The workflow automatically deploys when code is pushed to `main` branch.

### Environment Variables

Add in Vercel dashboard:
- `VITE_API_URL`: Your API URL
- Other environment-specific variables

---

## Netlify Deployment

### Automatic Deployment

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**

   ```bash
   netlify login
   ```

3. **Deploy:**

   ```bash
   cd lesson1-fundamentals-setup/example/vite-demo
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Netlify Configuration File

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Docker Deployment

### Dockerfile for Vue App

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

---

## AWS Deployment (S3 + CloudFront)

### GitHub Actions Workflow

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to S3
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Upload to S3
        run: |
          aws s3 sync dist/ s3://your-bucket-name --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

---

## Common CI/CD Patterns

### 1. Testing Before Building

```yaml
- name: Run tests
  run: npm test
  
- name: Build only if tests pass
  if: success()
  run: npm run build
```

### 2. Conditional Deployment

```yaml
deploy:
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: npm run deploy
```

### 3. Matrix Testing

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
    os: [ubuntu-latest, windows-latest]
```

### 4. Cache Dependencies

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

---

## Troubleshooting

### Common Issues

1. **Build Fails:**
   - Check Node.js version matches `engines` in package.json
   - Verify all dependencies are listed
   - Check for TypeScript errors (if any TS files remain)

2. **Deployment Fails:**
   - Verify secrets are set correctly
   - Check deployment platform status
   - Review build logs

3. **Tests Fail:**
   - Ensure test environment is set up
   - Check test configuration files
   - Verify test dependencies are installed

### Debug Commands

```bash
# Test locally
npm run lint
npm test
npm run build

# Check Node version
node --version

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Best Practices

1. **Always test locally first**
2. **Use environment variables for secrets**
3. **Cache dependencies for faster builds**
4. **Run linters before building**
5. **Test on multiple Node.js versions**
6. **Use semantic versioning**
7. **Automate deployments only on main branch**
8. **Keep build artifacts small**

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)

---
