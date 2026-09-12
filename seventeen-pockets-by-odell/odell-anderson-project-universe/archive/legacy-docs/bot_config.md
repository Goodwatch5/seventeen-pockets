# Automation Bot Configuration

## Bot User Details

* **Username**: automation-bot
* **Email**: automation-bot@shippedout.local
* **Role**: Maintainer (across all projects)
* **Token Scopes**: api, read\_user, read\_repository, write\_repository

## Projects Configuration

### Shippedout Group

* **17-pockets-left-brand** (76967613)
  * Default branch: main
  * CI/CD: Enabled
  * Runners: Shared

### Intelligence Dev Group

* **automated-nodejs-api** (75980316)
  * Default branch: main
  * CI/CD: Enabled
  * Runners: Shared
* **deepagent** (76277290)
  * Default branch: main
  * CI/CD: Enabled
  * Runners: Shared
* **nextmyteam** (76117871)
  * Default branch: main
  * CI/CD: Enabled
  * Runners: Shared
* **no-fault-function** (76276049)
  * Default branch: Cooler98
  * CI/CD: Enabled
  * Runners: Shared
* **seventeen-pockets** (76506056)
  * Default branch: Cooler98
  * CI/CD: Enabled
  * Runners: Shared
* **solar-connect** (76887018)
  * Default branch: production
  * CI/CD: Enabled
  * Runners: Shared

### Goodwatch5 (Personal)

* **nextmyteam** (76095664)
  * Default branch: main
  * CI/CD: Enabled
  * Runners: Shared
* **okaywave** (76036226)
  * Default branch: main
  * CI/CD: Enabled
  * Runners: Shared
* **praefect-ansible-scripts** (75779524)
  * Default branch: main
  * CI/CD: Enabled (private)
  * Runners: Shared
* **first-eye** (76036228)
  * Default branch: main
  * CI/CD: Enabled
  * Runners: Shared
* **deepagent** (76036250)
  * Default branch: main
  * CI/CD: Enabled
  * Runners: Shared

## Scheduled Jobs

### Daily Schedules

* **Nightly Build**: 0 2 \* \* \* (2 AM UTC)
* **Security Scan**: 0 3 \* \* \* (3 AM UTC)
* **Health Check**: 0 \*/6 \* \* \* (Every 6 hours)

### Weekly Schedules

* **Dependency Update**: 0 0 \* \* 0 (Sunday midnight)
* **Registry Cleanup**: 0 1 \* \* 0 (Sunday 1 AM)

## CI/CD Variables (Set per project)

```
AUTOMATION_BOT_TOKEN=<generated_token>
STAGING_WEBHOOK_URL=<webhook_url>
PRODUCTION_WEBHOOK_URL=<webhook_url>
DOCKER_REGISTRY_USER=<username>
DOCKER_REGISTRY_PASSWORD=<password>
```

## Automation Workflows

1. **On Commit**: Run tests, lint, build
2. **On Schedule**: Nightly builds, security scans, dependency updates
3. **On MR**: Auto-merge if approved and passing
4. **Continuous**: Health monitoring, uptime checks
