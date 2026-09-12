# Lockfile Management Guide

## Overview

This document provides procedures for managing and regenerating lockfiles to prevent corruption.

## Best Practices

### 1. Always Commit Lockfiles

```bash
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

### 2. Use Frozen Lockfiles in CI/CD

```bash
pnpm install --frozen-lockfile
```

### 3. Regenerate When Needed

```bash
rm pnpm-lock.yaml
pnpm install
```

### 4. Keep Lockfiles Up-to-Date

* Regenerate after updating dependencies
* Regenerate after changing Node/Python versions
* Regenerate after changing pnpm version

## Regeneration Procedures

### Node.js with pnpm

**Step 1: Verify versions**

```bash
node --version    # Should be 20.19.0
pnpm --version    # Should be 6.0.0
```

**Step 2: Remove old lockfiles**

```bash
rm -f pnpm-lock.yaml package-lock.json yarn.lock
```

**Step 3: Clear cache**

```bash
pnpm store prune
```

**Step 4: Reinstall**

```bash
pnpm install
```

**Step 5: Commit**

```bash
git add pnpm-lock.yaml
git commit -m "chore: regenerate lockfile with pnpm 6.0.0"
```

### Python with pip

**Step 1: Verify version**

```bash
python --version  # Should be 3.13.12
```

**Step 2: Create virtual environment**

```bash
python -m venv venv
source venv/bin/activate
```

**Step 3: Install dependencies**

```bash
pip install -r requirements.txt
```

**Step 4: Generate lockfile**

```bash
pip freeze > requirements.lock
```

**Step 5: Commit**

```bash
git add requirements.lock
git commit -m "chore: regenerate lockfile with Python 3.13.12"
```

## Detecting Lockfile Corruption

### Signs of Corruption

* Build fails with "dependency not found"
* Version mismatches between lockfile and package.json
* Inconsistent behavior between local and CI/CD
* Unexpected version downgrades

## Fixing Corrupted Lockfiles

### Option 1: Regenerate (Recommended)

```bash
rm pnpm-lock.yaml
pnpm store prune
pnpm install
pnpm list
```

### Option 2: Repair

```bash
pnpm install --force
```

### Option 3: Revert

```bash
git checkout HEAD~1 pnpm-lock.yaml
pnpm install
```

## CI/CD Integration

### GitLab CI

```yaml
before_script:
  - npm install -g pnpm@6.0.0
  - pnpm install --frozen-lockfile
```

### GitHub Actions

```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '20.19.0'
    cache: 'pnpm'

- run: npm install -g pnpm@6.0.0
- run: pnpm install --frozen-lockfile
```

## Troubleshooting

### Issue: "pnpm-lock.yaml is corrupted"

**Solution:**

```bash
rm pnpm-lock.yaml
pnpm install
```

### Issue: "Dependency version mismatch"

**Solution:**

```bash
pnpm install --force
```

### Issue: "Lockfile out of sync with package.json"

**Solution:**

```bash
pnpm install
```

### Issue: "CI/CD fails but local works"

**Solution:**

1. Verify Node version matches
2. Verify pnpm version matches
3. Regenerate lockfile
4. Commit and push
