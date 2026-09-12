# 24/7 Automation Bot Setup Guide

## Overview

This guide explains how to set up and manage the 24/7 automation bot across all Shippedout and Intelligence dev projects.

## Bot Service Account Setup

### Step 1: Create Bot User Account

1. Go to GitLab Admin Area > Users
2. Click "New user"
3. Create account:
   * Username: `automation-bot`
   * Email: `automation-bot@shippedout.local`
   * Name: `Automation Bot`
   * Access Level: Regular user
4. Set a strong password
5. Uncheck "Send welcome email"

### Step 2: Generate API Token

1. Log in as the bot user
2. Go to Settings > Access Tokens
3. Create token:
   * Name: `automation-token`
   * Scopes: `api`, `read_user`, `read_repository`, `write_repository`
   * Expiration: 1 year (or as per your policy)
4. Copy the token and store securely

### Step 3: Add Bot to Projects

For each project, add the bot with **Maintainer** role:

```bash
# Using GitLab API
curl --request POST \
  --header "PRIVATE-TOKEN: <YOUR_ADMIN_TOKEN>" \
  --data "user_id=<BOT_USER_ID>&access_level=40" \
  https://gitlab.com/api/v4/projects/<PROJECT_ID>/members
```

Projects to add bot to:

* shippedout/17-pockets-left-brand (76967613)
* intelligence-dev/automated-nodejs-api (75980316)
* intelligence-dev/deepagent (76277290)
* intelligence-dev/nextmyteam (76117871)
* intelligence-dev/no-fault-function (76276049)
* intelligence-dev/seventeen-pockets (76506056)
* intelligence-dev/solar-connect (76887018)
* goodwatch5/nextmyteam (76095664)
* goodwatch5/okaywave (76036226)
* goodwatch5/praefect-ansible-scripts (75779524)
* goodwatch5/first-eye (76036228)
* goodwatch5/deepagent (76036250)

## CI/CD Pipeline Configuration

### Automation Features

#### 1. Automated Testing

* Runs on every commit
* Executes unit tests, linting, and code quality checks
* Generates coverage reports
* Fails pipeline if tests don't pass

#### 2. Automated Building

* Builds Docker images
* Creates artifacts (dist/, build/)
* Pushes to container registry
* Runs on main and Cooler98 branches

#### 3. Scheduled Jobs (Cron-based)

**Nightly Builds** (Daily at 2 AM UTC)

```yaml
scheduled:nightly-build:
  only:
    - schedules
  script:
    - npm run build:full
    - npm run test:e2e
```

**Dependency Updates** (Weekly)

```yaml
scheduled:dependency-update:
  only:
    - schedules
  script:
    - npm outdated
    - npm audit fix
```

**Security Scanning** (Daily)

```yaml
scheduled:security-scan:
  only:
    - schedules
  script:
    - npm audit --json
```

#### 4. Health Monitoring

* Checks application endpoints
* Monitors uptime
* Alerts on failures
* Runs every 6 hours

#### 5. Container Registry Cleanup

* Removes images older than 90 days
* Keeps latest 10 images per repository
* Runs weekly

#### 6. Auto-Merge for Approved MRs

* Automatically merges MRs with:
  * All approvals received
  * All CI checks passing
  * No conflicts
* Removes source branch after merge

## Setting Up Scheduled Pipelines

### Create a Scheduled Pipeline

1. Go to Project > CI/CD > Schedules
2. Click "New schedule"
3. Configure:
   * Description: `Nightly Build`
   * Cron: `0 2 * * *` (2 AM UTC daily)
   * Timezone: UTC
   * Target branch: main or Cooler98
   * Active: Yes

### Common Cron Expressions

* `0 2 * * *` - Daily at 2 AM
* `0 */6 * * *` - Every 6 hours
* `0 0 * * 0` - Weekly on Sunday
* `0 0 1 * *` - Monthly on 1st

## Environment Variables

Set these in Project > Settings > CI/CD > Variables:

```
AUTOMATION_BOT_TOKEN=<bot_api_token>
STAGING_WEBHOOK_URL=<your_staging_webhook>
PRODUCTION_WEBHOOK_URL=<your_production_webhook>
DOCKER_REGISTRY_USER=<registry_username>
DOCKER_REGISTRY_PASSWORD=<registry_password>
```

## Monitoring & Alerts

### Pipeline Status

* View in Project > CI/CD > Pipelines
* Filter by status, branch, or date
* Click pipeline to see job details

### Email Notifications

1. Go to Project > Settings > Integrations
2. Enable "Pipeline events"
3. Configure notification recipients

### Slack Integration (Optional)

1. Create Slack webhook
2. Add to Project > Settings > Integrations > Slack
3. Configure events to notify

## Troubleshooting

### Pipeline Failures

1. Check job logs: Project > CI/CD > Pipelines > Job
2. Common issues:
   * Missing dependencies: Run `npm ci`
   * Permission denied: Check bot token scopes
   * Docker build fails: Check Dockerfile syntax

### Bot Access Issues

1. Verify bot is added to project with Maintainer role
2. Check token hasn't expired
3. Verify token has correct scopes
4. Check project visibility settings

### Scheduled Jobs Not Running

1. Verify schedule is active
2. Check cron expression syntax
3. Ensure target branch exists
4. Check runner availability

## Best Practices

1. **Token Security**
   * Store tokens in CI/CD variables, not in code
   * Rotate tokens regularly (every 6 months)
   * Use minimal required scopes
2. **Pipeline Performance**
   * Cache dependencies (npm, Docker layers)
   * Run tests in parallel when possible
   * Set appropriate timeouts
3. **Monitoring**
   * Review pipeline metrics weekly
   * Set up alerts for failures
   * Document automation changes
4. **Maintenance**
   * Update dependencies regularly
   * Review and update CI/CD configs quarterly
   * Archive old pipelines

## Support & Documentation

* GitLab CI/CD Docs: https://docs.gitlab.com/ee/ci/
* API Documentation: https://docs.gitlab.com/ee/api/
* Scheduled Pipelines: https://docs.gitlab.com/ee/ci/pipelines/schedules.html

## Automation Task Tracking

See work item #15 in shippedout/17-pockets-left-brand for setup progress and status.
