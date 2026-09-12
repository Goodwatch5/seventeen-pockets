# GitHub → GitLab Migration Toolkit

Complete toolkit for migrating repositories from GitHub to GitLab with full history, issues, and pull requests.

## Quick Start

### Option A: Mirror Push Only (Branches & Tags)

```bash
cd MIGRATION_TOOLKIT
export GITHUB_TOKEN="ghp_your_token_here"
export GITLAB_TOKEN="glpat_your_token_here"
export GITHUB_USERNAME="Goodwatch5"
export GITLAB_USERNAME="your_gitlab_user"
export GITHUB_REPO="Goodwatch5/Seventeen-Pockets-eternal-Project"
export PROJECT_NAME="Seventeen-Pockets-eternal-Project"
export VISIBILITY="private"

./create_and_mirror.sh
```

### Option B: Full Migration (Repo + Issues + PRs)

```bash
cd MIGRATION_TOOLKIT
export GITHUB_TOKEN="ghp_your_token_here"
export GITLAB_TOKEN="glpat_your_token_here"
export GITHUB_REPO="Goodwatch5/Seventeen-Pockets-eternal-Project"
export GITLAB_PROJECT_ID="your_project_id"

python3 migrate_issues_and_prs.py
```

## Files Included

### 1. `create_and_mirror.sh`

Creates a new GitLab project and mirrors the GitHub repository.

**Features:**

* Creates GitLab project via API
* Clones GitHub repo as mirror (preserves all branches/tags)
* Pushes to GitLab (prefers SSH, falls back to HTTPS)
* Automatic cleanup

**Requirements:** git, curl, jq

### 2. `migrate_issues_and_prs.py`

Migrates GitHub issues and pull requests to GitLab with full metadata.

**Features:**

* Preserves issue titles, descriptions, labels
* Migrates comments with original authors
* Converts PRs to merge requests
* Handles timestamps and state (open/closed)
* Rate-limit aware
* Progress tracking

**Requirements:** Python 3.6+, requests library

### 3. `migrate_with_group.sh`

Advanced version that creates projects in a specific GitLab group.

**Features:**

* All features of `create_and_mirror.sh`
* Plus: places project in specified group
* Requires group ID (can be looked up via API)

### 4. `token_setup.sh`

Helper script to securely manage tokens.

**Features:**

* Validates token format
* Tests token permissions
* Stores in secure location
* Provides usage examples

## Token Setup

### GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   * `repo` (full control of private repositories)
   * `public_repo` (access public repositories)
4. Copy token and save securely

### GitLab Personal Access Token

1. Go to https://gitlab.com/-/user\_settings/personal\_access\_tokens
2. Click "Add new token"
3. Select scopes:
   * `api` (full API access)
   * `read_repository` (read repository)
   * `write_repository` (write repository)
4. Copy token and save securely

## Security Best Practices

⚠️ **CRITICAL: Never commit tokens to git**

### Safe Token Usage

```bash
# ✅ GOOD: Use environment variables
export GITHUB_TOKEN="ghp_..."
export GITLAB_TOKEN="glpat_..."
./create_and_mirror.sh

# ❌ BAD: Don't hardcode in scripts
echo "GITHUB_TOKEN=ghp_..." > script.sh  # NEVER DO THIS

# ❌ BAD: Don't paste in chat/logs
# (tokens can be extracted from history)
```

### Token Rotation

1. Create new token with same scopes
2. Update environment variables
3. Run migration
4. Delete old token from GitHub/GitLab

### Revoking Tokens

**GitHub:**

* Settings → Developer settings → Personal access tokens → Delete

**GitLab:**

* Settings → Access Tokens → Revoke

## Migration Workflow

### Step 1: Create Empty GitLab Project

Option A: Via UI

* Go to https://gitlab.com/projects/new
* Create empty project
* Copy HTTPS/SSH URL

Option B: Via Script (automatic)

* Run `create_and_mirror.sh`
* Script creates project automatically

### Step 2: Mirror Repository

```bash
./create_and_mirror.sh
```

This:

1. Creates GitLab project (if not exists)
2. Clones GitHub repo as mirror
3. Pushes all branches and tags to GitLab
4. Cleans up temporary files

### Step 3: Migrate Issues & PRs (Optional)

```bash
python3 migrate_issues_and_prs.py
```

This:

1. Fetches all GitHub issues
2. Fetches all GitHub pull requests
3. Creates GitLab issues from GitHub issues
4. Creates GitLab merge requests from GitHub PRs
5. Migrates comments and labels

## Troubleshooting

### "Permission denied" on push

**Solution:** Check SSH key setup

```bash
ssh -T git@gitlab.com
# Should show: Welcome to GitLab, @username!
```

If SSH fails, script will fall back to HTTPS with token.

### "Invalid token" error

**Solution:** Verify token scopes

```bash
./token_setup.sh
```

Ensure tokens have required scopes (see Token Setup section).

### "Project already exists"

**Solution:** Use existing project

```bash
export GITLAB_PROJECT_ID="12345"
python3 migrate_issues_and_prs.py
```

### Rate limiting

**GitHub:** 60 requests/hour (unauthenticated), 5000/hour (authenticated) **GitLab:** 600 requests/minute (authenticated)

Scripts include rate-limit handling. If you hit limits:

1. Wait for reset (check response headers)
2. Use better tokens (higher limits)
3. Migrate in batches

## Advanced Usage

### Migrate to Specific Group

```bash
./migrate_with_group.sh
```

Will prompt for group name/ID.

### Custom Issue Mapping

Edit `migrate_issues_and_prs.py` to customize:

* Label mapping (GitHub → GitLab)
* Author mapping (if users don't exist)
* Description formatting
* State mapping

### Preserve GitHub Actions

GitHub Actions workflows are NOT automatically converted. To preserve:

1. Copy `.github/workflows/` to `.gitlab-ci.yml`
2. Convert syntax (GitHub Actions → GitLab CI)
3. Commit and push

Or use third-party converters:

* https://github.com/marketplace/actions/github-actions-to-gitlab-ci

## What Gets Migrated

### Repository (Mirror Push)

* ✅ All branches
* ✅ All tags
* ✅ All commits
* ✅ Full history
* ❌ GitHub Actions workflows (manual conversion needed)
* ❌ GitHub Pages config (manual setup needed)

### Issues

* ✅ Title, description
* ✅ Labels
* ✅ State (open/closed)
* ✅ Comments
* ✅ Timestamps
* ⚠️ Author (mapped to current user if not found)
* ❌ Assignees (requires user mapping)
* ❌ Milestones (requires manual mapping)

### Pull Requests → Merge Requests

* ✅ Title, description
* ✅ Source/target branches
* ✅ Comments
* ✅ State (open/merged/closed)
* ⚠️ Commits (preserved in mirror)
* ❌ Reviewers (requires user mapping)
* ❌ Status checks (requires CI setup)

## Performance

**Typical migration times:**

* Small repo (< 100 issues): 2-5 minutes
* Medium repo (100-1000 issues): 10-30 minutes
* Large repo (1000+ issues): 1-2 hours

**Factors affecting speed:**

* Number of issues/PRs
* Number of comments per issue
* Network speed
* API rate limits

## Support & Issues

If you encounter problems:

1. Check troubleshooting section above
2. Review script output for error messages
3. Verify tokens have correct scopes
4. Check GitLab/GitHub API status
5. Review logs in `migration.log`

## Next Steps

After migration:

1. **Verify repository:** Check all branches/tags in GitLab
2. **Test CI/CD:** Update `.gitlab-ci.yml` if needed
3. **Update documentation:** Update README with GitLab URLs
4. **Redirect GitHub:** Add note to GitHub repo pointing to GitLab
5. **Update team:** Notify team of new GitLab location
6. **Archive GitHub:** Consider archiving GitHub repo

## License

MIT - Use freely, modify as needed
