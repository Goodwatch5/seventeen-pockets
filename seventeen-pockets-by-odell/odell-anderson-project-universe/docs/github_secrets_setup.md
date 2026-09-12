# GitHub Secrets Setup Guide for Seventeen Pockets

## Complete Instructions to Get All Required Secrets

### 1. SUPABASE\_URL

**Where to get it:**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** (bottom left)
4. Click **API**
5. Copy the **Project URL**

**Example:** `https://your-project.supabase.co`

***

### 2. SUPABASE\_ANON\_KEY

**Where to get it:**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** (bottom left)
4. Click **API**
5. Under "Project API keys", copy the **anon public** key

**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

***

### 3. SUPABASE\_PROJECT\_ID

**Where to get it:**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** (bottom left)
4. Click **General**
5. Copy the **Reference ID** (under Project Info)

**Example:** `your-project-id`

***

### 4. SUPABASE\_ACCESS\_TOKEN

**Where to get it:**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click your **Profile** (top right)
3. Click **Access Tokens**
4. Click **Generate new token**
5. Name it: `GitHub Actions`
6. Copy the token

**Example:** `sbp_1234567890abcdef...`

***

### 5. VERCEL\_TOKEN

**Where to get it:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your **Profile** (bottom left)
3. Click **Settings**
4. Click **Tokens**
5. Click **Create**
6. Name it: `GitHub Actions`
7. Copy the token

**Example:** `vercel_1234567890abcdef...`

***

### 6. VERCEL\_ORG\_ID

**Where to get it:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your **Profile** (bottom left)
3. Click **Settings**
4. Click **Teams**
5. Copy your **Team ID** (or Personal Account ID)

**Example:** `team_1234567890abcdef`

***

### 7. VERCEL\_PROJECT\_ID

**Where to get it:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Seventeen Pockets** project
3. Click **Settings**
4. Copy the **Project ID**

**Example:** `prj_1234567890abcdef`

***

### 8. SLACK\_WEBHOOK

**Where to get it:**

1. Go to [Slack App Directory](https://api.slack.com/apps)
2. Click **Create New App**
3. Choose **From scratch**
4. Name: `Seventeen Pockets`
5. Select your workspace
6. Click **Incoming Webhooks** (left sidebar)
7. Toggle **Activate Incoming Webhooks** ON
8. Click **Add New Webhook to Workspace**
9. Select channel: `#deployments` (or create new)
10. Copy the **Webhook URL**

**Example:** `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`

***

## Adding Secrets to GitHub

### Step 1: Go to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. Click **Secrets and variables** (left sidebar)
4. Click **Actions**

### Step 2: Add Each Secret

For each secret below, click **New repository secret**:

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_PROJECT_ID
SUPABASE_ACCESS_TOKEN
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
SLACK_WEBHOOK
```

### Step 3: Paste Values

1. **Name:** Copy the secret name exactly (e.g., `SUPABASE_URL`)
2. **Value:** Paste the secret value
3. Click **Add secret**
4. Repeat for all 8 secrets

***

## Verification Checklist

* [ ] SUPABASE\_URL added
* [ ] SUPABASE\_ANON\_KEY added
* [ ] SUPABASE\_PROJECT\_ID added
* [ ] SUPABASE\_ACCESS\_TOKEN added
* [ ] VERCEL\_TOKEN added
* [ ] VERCEL\_ORG\_ID added
* [ ] VERCEL\_PROJECT\_ID added
* [ ] SLACK\_WEBHOOK added

***

## Testing Secrets

### Test 1: Verify Secrets Are Set

1. Go to **Actions** tab
2. Select any workflow
3. Click **Run workflow**
4. Check logs for errors

### Test 2: Manual Workflow Dispatch

1. Go to **Actions** tab
2. Select **Deploy to Supabase**
3. Click **Run workflow**
4. Monitor the run

### Test 3: Check Slack Notifications

1. Trigger a workflow
2. Check your Slack channel for notifications

***

## Troubleshooting

### Workflow fails with "secret not found"

* Verify secret name matches exactly (case-sensitive)
* Check secret is added to correct repository
* Refresh page and try again

### Supabase deployment fails

* Verify SUPABASE\_ACCESS\_TOKEN is valid
* Check SUPABASE\_PROJECT\_ID is correct
* Ensure Supabase project exists

### Vercel deployment fails

* Verify VERCEL\_TOKEN is valid
* Check VERCEL\_ORG\_ID and VERCEL\_PROJECT\_ID
* Ensure project exists in Vercel

### Slack notifications not working

* Verify SLACK\_WEBHOOK URL is correct
* Check webhook is for correct channel
* Ensure bot has permission to post

***

## Security Best Practices

✅ **DO:**

* Rotate tokens regularly
* Use separate tokens for different services
* Restrict token permissions
* Monitor token usage

❌ **DON'T:**

* Share secrets in code
* Commit secrets to repository
* Use personal access tokens
* Reuse tokens across projects

***

## Next Steps After Setup

1. **Merge all 3 MRs**
   * MR #31 (React System)
   * MR #32 (CI/CD Workflows)
   * MR #33 (Database Migrations)
2.  **Run Database Migrations**

    ```bash
    supabase db push
    ```
3. **Test Workflows**
   * Trigger Deploy to Supabase
   * Check Slack notifications
   * Verify Vercel deployment
4. **Monitor Automation**
   * Check Actions tab for runs
   * Review deployment logs
   * Monitor Slack channel
5. **Configure Schedules** (optional)
   * Edit cron expressions in workflows
   * Adjust auto-merge frequency
   * Customize health check intervals

***

## Quick Reference

| Secret                  | Source                      | Format    |
| ----------------------- | --------------------------- | --------- |
| SUPABASE\_URL           | Supabase Settings > API     | URL       |
| SUPABASE\_ANON\_KEY     | Supabase Settings > API     | JWT Token |
| SUPABASE\_PROJECT\_ID   | Supabase Settings > General | ID        |
| SUPABASE\_ACCESS\_TOKEN | Supabase Profile > Tokens   | Token     |
| VERCEL\_TOKEN           | Vercel Settings > Tokens    | Token     |
| VERCEL\_ORG\_ID         | Vercel Settings > Teams     | ID        |
| VERCEL\_PROJECT\_ID     | Vercel Project > Settings   | ID        |
| SLACK\_WEBHOOK          | Slack App > Webhooks        | URL       |

***

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review workflow logs in Actions tab
3. Verify all secrets are set correctly
4. Check service status pages

***

## Built by

Odell Anderson - Intelligence Dev for Seventeen Pockets Namespace

**Status:** Ready for production deployment
