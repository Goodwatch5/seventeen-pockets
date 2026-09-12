# Configuration Standards

## Overview

This document standardizes configuration across all projects to eliminate bloat and experimental features.

## Configuration Files

### 1. package.json

**Standard structure:**

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "Project description",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {},
  "devDependencies": {},
  "engines": {
    "node": "20.19.0",
    "pnpm": "6.0.0"
  }
}
```

**Rules:**

* ✅ Include `engines` field with locked versions
* ✅ Use semantic versioning for dependencies
* ❌ No experimental features
* ❌ No beta versions
* ❌ No loose version constraints

### 2. .nvmrc

**Content:**

```
20.19.0
```

### 3. .python-version

**Content:**

```
3.13.12
```

### 4. .pnpmrc

**Standard configuration:**

```
node-version=20.19.0
pnpm-version=6.0.0
strict-peer-dependencies=false
auto-install-peers=true
shared-workspace-lockfile=true
```

### 5. .gitlab-ci.yml

**Standard structure:**

```yaml
stages:
  - validate
  - build
  - test
  - deploy

image: node:20.19.0-alpine

before_script:
  - npm install -g pnpm@6.0.0
  - pnpm install
```

**Rules:**

* ✅ Use specific Docker image versions
* ✅ Define all variables at top level
* ❌ No experimental features
* ❌ No loose image tags

## Removed Experimental Features

* ❌ `"experimental"` field in package.json
* ❌ Beta versions (e.g., `^1.0.0-beta`)
* ❌ Loose constraints (e.g., `*`, `>=`)
* ❌ Deprecated packages
* ❌ Experimental Docker features
* ❌ Beta GitLab features

## Configuration Validation

### Checklist

* [ ] All version constraints are locked
* [ ] No experimental features enabled
* [ ] No beta versions in dependencies
* [ ] All required files present
* [ ] CI/CD uses specific Docker image versions
* [ ] Platform configs specify versions
* [ ] No deprecated packages
* [ ] Lockfiles are committed
