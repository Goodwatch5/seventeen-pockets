# GitHub to GitLab Import Guide

## Overview

Complete guide for importing projects from GitHub to GitLab with full history, branches, tags, and issues.

## Method 1: GitLab Web UI (Easiest - 5 minutes)

### Step 1: Go to GitLab New Project

1. Log in to GitLab
2. Click **New project** button
3. Select **Import project**
4. Choose **GitHub**

### Step 2: Authorize GitHub

1. Click **Authorize with GitHub**
2. GitHub will ask for permission
3. Click **Authorize gitlab**
4. You'll be redirected back to GitLab

### Step 3: Select Repository

1. GitLab shows list of your GitHub repos
2. Click **Import** next to the repo you want
3. Choose:
   * **Project name** (auto-filled)
   * **Project slug** (auto-filled)
   * **Project description** (optional)
   * **Visibility** (Private/Internal/Public)

### Step 4: Wait for Import

* GitLab imports:
  * ✅ All commits and history
  * ✅ All branches
  * ✅ All tags
  * ✅ All issues
  * ✅ All pull requests (as merge requests)
  * ✅ All wiki pages
  * ✅ All milestones
  * ✅ All labels
* Takes 1-10 minutes depending on repo size
* You'll get notification when complete

***

## Method 2: GitLab API (Programmatic)

### Step 1: Get GitHub Token

```bash
# Go to GitHub Settings → Developer settings → Personal access tokens
# Create token with:
# - repo (full control of private repositories)
# - read:user
# - user:email

export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
```

### Step 2: Get GitLab Token

```bash
# Go to GitLab Settings → Access Tokens
# Create token with:
# - api
# - read_user
# - read_repository

export GITLAB_TOKEN="glpat-xxxxxxxxxxxxxxxxxxxx"
export GITLAB_URL="https://gitlab.com"
```

### Step 3: Import via API

```bash
curl --request POST \
  --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  --form "import_url=https://github.com/username/repo.git" \
  --form "path=repo-name" \
  --form "name=Repo Name" \
  --form "visibility=private" \
  "$GITLAB_URL/api/v4/projects/import"
```

### Step 4: Check Import Status

```bash
curl --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "$GITLAB_URL/api/v4/projects/import_status"
```

***

## Method 3: Command Line (Full Control)

### Step 1: Clone GitHub Repo (Mirror)

```bash
git clone --mirror https://github.com/username/repo.git repo.git
cd repo.git
```

This creates a bare repository with all history.

### Step 2: Create Empty GitLab Project

```bash
# Via GitLab UI:
# 1. New project
# 2. Create blank project
# 3. Name: repo-name
# 4. Visibility: Private
# 5. Create project

# Note the project URL:
# https://gitlab.com/username/repo.git
```

### Step 3: Push to GitLab

```bash
git push --mirror https://gitlab.com/username/repo.git
```

This pushes:

* ✅ All commits
* ✅ All branches
* ✅ All tags
* ✅ All refs

### Step 4: Clone Normal Repo

```bash
cd ..
rm -rf repo.git
git clone https://gitlab.com/username/repo.git
cd repo
```

***

## Method 4: Bulk Import (Multiple Repos)

### Step 1: Create Script

```bash
#!/bin/bash

# bulk-import.sh

GITLAB_TOKEN="glpat-xxxxxxxxxxxxxxxxxxxx"
GITLAB_URL="https://gitlab.com"
GITHUB_ORG="your-github-org"

# List of repos to import
REPOS=(
  "repo1"
  "repo2"
  "repo3"
)

for REPO in "${REPOS[@]}"; do
  echo "Importing $REPO..."
  
  curl --request POST \
    --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
    --form "import_url=https://github.com/$GITHUB_ORG/$REPO.git" \
    --form "path=$REPO" \
    --form "name=$REPO" \
    --form "visibility=private" \
    "$GITLAB_URL/api/v4/projects/import"
  
  echo "$REPO import started"
  sleep 2
done
```

### Step 2: Run Script

```bash
chmod +x bulk-import.sh
./bulk-import.sh
```

### Step 3: Monitor Imports

```bash
# Check status of all imports
curl --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "$GITLAB_URL/api/v4/projects?import_status=started"
```

***

## Method 5: GitHub Actions (Automated)

### Step 1: Create GitHub Action

```yaml
# .github/workflows/import-to-gitlab.yml

name: Import to GitLab

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Daily

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Push to GitLab
        run: |
          git push --mirror https://oauth2:${{ secrets.GITLAB_TOKEN }}@gitlab.com/${{ secrets.GITLAB_PROJECT }}.git
```

### Step 2: Add Secrets

1. Go to GitHub repo → Settings → Secrets
2. Add:
   * `GITLAB_TOKEN`: Your GitLab personal access token
   * `GITLAB_PROJECT`: Your GitLab project path (e.g., `username/repo`)

### Step 3: Trigger Action

* Push to main branch
* Or wait for scheduled run
* GitLab repo stays in sync

***

## What Gets Imported

### ✅ Imported

* All commits and history
* All branches
* All tags
* All issues (as GitLab issues)
* All pull requests (as merge requests)
* All wiki pages
* All milestones
* All labels
* All release notes
* Repository settings
* Webhooks (need to reconfigure)

### ⚠️ Partially Imported

* Issue comments (imported but may lose formatting)
* PR comments (imported but may lose formatting)
* Reactions (not imported)
* GitHub Actions (not imported, use GitLab CI instead)

### ❌ Not Imported

* GitHub Actions workflows (convert to GitLab CI)
* GitHub Pages (use GitLab Pages instead)
* GitHub Discussions (use GitLab Discussions)
* GitHub Projects (use GitLab Boards)
* GitHub Secrets (add to GitLab CI/CD variables)

***

## Post-Import Steps

### Step 1: Update Remote URL

```bash
cd repo
git remote set-url origin https://gitlab.com/username/repo.git
git push -u origin main
```

### Step 2: Update CI/CD

```bash
# Convert GitHub Actions to GitLab CI
# Create .gitlab-ci.yml based on .github/workflows/*.yml

# Example conversion:
# GitHub Actions → GitLab CI
# uses: actions/checkout@v3 → image: ubuntu:latest
# run: npm test → script: npm test
```

### Step 3: Update Documentation

```bash
# Update README.md
# - Change GitHub URLs to GitLab URLs
# - Update issue/PR links
# - Update badge URLs

# Example:
# FROM: https://github.com/username/repo
# TO: https://gitlab.com/username/repo
```

### Step 4: Configure Webhooks

```bash
# GitLab → Settings → Webhooks
# Add webhooks for:
# - Push events
# - Issues events
# - Merge requests events
# - Wiki page events
```

### Step 5: Set Up CI/CD Variables

```bash
# GitLab → Settings → CI/CD → Variables
# Add any secrets that were in GitHub:
# - API keys
# - Tokens
# - Credentials
```

### Step 6: Configure Protected Branches

```bash
# GitLab → Settings → Repository → Protected branches
# Set up branch protection rules:
# - Require merge request reviews
# - Require status checks
# - Require code owner reviews
```

***

## Troubleshooting

### Import Stuck

```bash
# Check import status
curl --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "$GITLAB_URL/api/v4/projects/import_status"

# If stuck, try manual mirror push
git clone --mirror https://github.com/username/repo.git
cd repo.git
git push --mirror https://gitlab.com/username/repo.git
```

### Large Repository

```bash
# For repos >1GB, use command line method
# Web UI may timeout

git clone --mirror https://github.com/username/repo.git repo.git
cd repo.git
git push --mirror https://gitlab.com/username/repo.git
```

### Authentication Failed

```bash
# Use personal access token instead of password
# GitHub: Settings → Developer settings → Personal access tokens
# GitLab: Settings → Access Tokens

# Format: https://username:token@gitlab.com/username/repo.git
```

### Missing Issues/PRs

```bash
# Issues and PRs are imported but may take time
# Check import status:
curl --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "$GITLAB_URL/api/v4/projects/1/import_github_gists"

# If missing, manually import:
# GitLab → Settings → Integrations → GitHub
```

***

## Best Practices

### 1. Test Import First

```bash
# Import to a test project first
# Verify all data is there
# Then import to production
```

### 2. Keep GitHub as Backup

```bash
# Don't delete GitHub repo immediately
# Keep it for 1-2 weeks
# Verify everything works in GitLab
# Then archive on GitHub
```

### 3. Update Documentation

```bash
# Update all references:
# - README.md
# - Contributing.md
# - Issue templates
# - PR templates
# - Links in code
```

### 4. Notify Team

```bash
# Tell team about migration
# Update:
# - Team wiki
# - Slack channels
# - Email
# - Documentation
```

### 5. Set Up Redirects

```bash
# GitHub → Settings → Repository → Danger Zone
# Add redirect notice in README:
# "This project has moved to GitLab: https://gitlab.com/username/repo"
```

***

## Comparison: Import Methods

| Method         | Ease  | Speed | Control | Automation |
| -------------- | ----- | ----- | ------- | ---------- |
| Web UI         | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐  | ⭐⭐      | ❌          |
| API            | ⭐⭐⭐   | ⭐⭐⭐⭐  | ⭐⭐⭐⭐    | ✅          |
| CLI            | ⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐   | ✅          |
| Bulk           | ⭐⭐    | ⭐⭐⭐   | ⭐⭐⭐⭐    | ✅          |
| GitHub Actions | ⭐⭐⭐   | ⭐⭐⭐⭐  | ⭐⭐⭐     | ✅          |

***

## Quick Reference

### Fastest Way (5 minutes)

```bash
# 1. Go to GitLab → New project → Import project → GitHub
# 2. Authorize GitHub
# 3. Select repo
# 4. Click Import
# 5. Wait for completion
```

### Most Reliable Way (10 minutes)

```bash
# 1. Create empty GitLab project
# 2. Clone GitHub repo as mirror
git clone --mirror https://github.com/username/repo.git
# 3. Push to GitLab
cd repo.git
git push --mirror https://gitlab.com/username/repo.git
# 4. Clone normal repo
cd ..
rm -rf repo.git
git clone https://gitlab.com/username/repo.git
```

### Most Automated Way (Ongoing)

```bash
# 1. Add GitHub Action to sync
# 2. Commits automatically push to GitLab
# 3. Keep both in sync
```

***

## Support

* [GitLab Import Documentation](https://docs.gitlab.com/ee/user/project/import/github.html)
* [GitLab API Import](https://docs.gitlab.com/ee/api/projects.html#import-github-project)
* [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
