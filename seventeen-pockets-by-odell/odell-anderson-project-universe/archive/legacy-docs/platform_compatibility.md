# Platform Compatibility Guide

## Supported Platforms

### 1. Netlify

**Status:** Primary deployment platform

**Configuration (netlify.toml):**

```toml
[build]
  command = "pnpm install && pnpm build"
  publish = "dist"
  environment = { NODE_VERSION = "20.19.0" }

[build.environment]
  NODE_VERSION = "20.19.0"
  PNPM_VERSION = "6.0.0"
```

**Requirements:**

* Node.js 20.19.0
* pnpm 6.0.0
* Build output: `dist/` directory

### 2. Vercel

**Status:** Supported for Next.js projects

**Configuration (vercel.json):**

```json
{
  "buildCommand": "pnpm install && pnpm build",
  "outputDirectory": ".next",
  "nodeVersion": "20.19.0"
}
```

### 3. Docker

**Status:** Supported for containerized deployments

**Dockerfile:**

```dockerfile
FROM node:20.19.0-alpine
WORKDIR /app
RUN npm install -g pnpm@6.0.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### 4. GitLab CI/CD

**Status:** Primary CI/CD platform

**Configuration (.gitlab-ci.yml):**

```yaml
image: node:20.19.0-alpine

before_script:
  - npm install -g pnpm@6.0.0
  - pnpm install
```

## Compatibility Matrix

| Platform  | Node    | Python  | pnpm  | Status |
| --------- | ------- | ------- | ----- | ------ |
| Netlify   | 20.19.0 | -       | 6.0.0 | ✅      |
| Vercel    | 20.19.0 | -       | 6.0.0 | ✅      |
| Docker    | 20.19.0 | 3.13.12 | 6.0.0 | ✅      |
| GitLab CI | 20.19.0 | 3.13.12 | 6.0.0 | ✅      |
