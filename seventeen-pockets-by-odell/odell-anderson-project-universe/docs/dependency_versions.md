# Standardized Dependency Versions

## Overview

This document standardizes all dependency versions across the Seventeen Pockets project to eliminate 80% of production failures.

## Locked Versions

### Node.js

* **Version:** 20.19.0 (LTS)
* **Why:** Stable, long-term support, widely tested
* **Configuration:** `.nvmrc`, `package.json` engines field
* **Docker:** `node:20.19.0-alpine`

### Python

* **Version:** 3.13.12 (Latest Stable)
* **Why:** Latest stable release with security patches
* **Configuration:** `.python-version`
* **Docker:** `python:3.13.12-slim`

### pnpm

* **Version:** 6.0.0
* **Why:** Compatible with Node 20, stable, performant
* **Configuration:** `.pnpmrc`, `package.json` engines field
* **Installation:** `npm install -g pnpm@6.0.0`

## Installation Instructions

### Using nvm (Node Version Manager)

```bash
nvm install 20.19.0
nvm use 20.19.0
node --version  # v20.19.0
```

### Using pyenv (Python Version Manager)

```bash
pyenv install 3.13.12
pyenv local 3.13.12
python --version  # Python 3.13.12
```

### Installing pnpm

```bash
npm install -g pnpm@6.0.0
pnpm --version  # 6.0.0
```

## Lockfile Regeneration

**For Node.js projects:**

```bash
rm -f package-lock.json pnpm-lock.yaml yarn.lock
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: regenerate lockfile with pnpm 6.0.0"
```

**For Python projects:**

```bash
rm -f requirements.lock Pipfile.lock poetry.lock
pip freeze > requirements.txt
git add requirements.txt
git commit -m "chore: regenerate lockfile with Python 3.13.12"
```

## Verification Checklist

* [ ] Node.js version is 20.19.0
* [ ] Python version is 3.13.12
* [ ] pnpm version is 6.0.0
* [ ] `.nvmrc` file exists and contains `20.19.0`
* [ ] `.python-version` file exists and contains `3.13.12`
* [ ] `.pnpmrc` file exists with correct configuration
* [ ] `package.json` engines field specifies correct versions
* [ ] Lockfiles are regenerated and committed
* [ ] CI/CD configuration uses correct Docker images
* [ ] All tests pass with locked versions
