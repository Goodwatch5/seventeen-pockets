# GitHub Actions Workflows for Seventeen Pockets

Automated CI/CD pipelines for deployment, testing, and pocket management.

## Workflows

### 1. Deploy to Supabase (`.github/workflows/deploy-supabase.yml`)

* Triggers on push to main or manual workflow dispatch
* Builds the application
* Deploys to Supabase
* Deploys to Vercel
* Updates deployment status

**Secrets Required:**

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `SUPABASE_PROJECT_ID`
* `SUPABASE_ACCESS_TOKEN`
* `VERCEL_TOKEN`
* `VERCEL_ORG_ID`
* `VERCEL_PROJECT_ID`

### 2. Auto Merge Ready Pockets (`.github/workflows/auto-merge-pockets.yml`)

* Runs every 6 hours (configurable)
* Auto-deploys all ready pockets
* Monitors system health
* Generates deployment reports
* Sends Slack notifications

**Secrets Required:**

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `SLACK_WEBHOOK`

### 3. Sync Pockets Across Nodes (`.github/workflows/sync-pockets.yml`)

* Triggers on changes to automation library
* Syncs pockets across all nodes
* Verifies sync integrity
* Creates sync reports

**Secrets Required:**

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`

### 4. Pocket Health Check (`.github/workflows/pocket-health-check.yml`)

* Runs every 5 minutes
* Checks pocket health status
* Alerts on failures
* Sends Slack notifications

**Secrets Required:**

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `SLACK_WEBHOOK`

### 5. Database Migration (`.github/workflows/database-migration.yml`)

* Triggers on migration file changes
* Runs database migrations
* Verifies schema changes
* Commits schema updates

**Secrets Required:**

* `SUPABASE_PROJECT_ID`
* `SUPABASE_ACCESS_TOKEN`

### 6. Auto Merge PR (`.github/workflows/auto-merge-pr.yml`)

* Triggers on PR creation/update
* Checks for `auto-merge` label
* Runs tests and builds
* Automatically merges PR
* Comments on PR status

**Secrets Required:**

* `GITHUB_TOKEN` (automatic)

### 7. Production Deployment (`.github/workflows/production-deployment.yml`)

* Triggers on push to main
* Builds application
* Uploads artifacts
* Deploys to Vercel production
* Sends Slack notifications

**Secrets Required:**

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `VERCEL_TOKEN`
* `VERCEL_ORG_ID`
* `VERCEL_PROJECT_ID`
* `SLACK_WEBHOOK`

## Setup Instructions

### 1. Add GitHub Secrets

Go to your repository settings and add these secrets:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_ACCESS_TOKEN=your_access_token
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
SLACK_WEBHOOK=your_slack_webhook_url
```

### 2. Enable Workflows

Workflows are automatically enabled. Check the Actions tab to monitor runs.

### 3. Configure Schedules

Edit the cron expressions in workflow files to adjust timing:

* Auto-merge: `0 */6 * * *` (every 6 hours)
* Health check: `*/5 * * * *` (every 5 minutes)

## Workflow Triggers

| Workflow           | Trigger              | Frequency       |
| ------------------ | -------------------- | --------------- |
| Deploy to Supabase | Push to main, manual | On demand       |
| Auto Merge Pockets | Schedule             | Every 6 hours   |
| Sync Pockets       | Code changes         | On push         |
| Health Check       | Schedule             | Every 5 minutes |
| Database Migration | Migration files      | On push         |
| Auto Merge PR      | PR events            | On PR           |
| Production Deploy  | Push to main         | On push         |

## Monitoring

View workflow runs in the GitHub Actions tab:

* Check logs for detailed output
* Monitor deployment status
* Review Slack notifications
* Track pocket deployment progress

## Troubleshooting

### Workflow fails to run

* Check that all required secrets are set
* Verify branch protection rules
* Check workflow syntax

### Deployment fails

* Review build logs
* Check environment variables
* Verify Supabase/Vercel credentials

### Auto-merge not working

* Ensure PR has `auto-merge` label
* Check branch protection rules
* Verify all checks pass

## Built by

Odell Anderson - Intelligence Dev for Seventeen Pockets Namespace
