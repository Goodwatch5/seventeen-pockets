# Security Guidelines for Token-Based Migration

## Critical Rules

### 🔴 NEVER

* ❌ Commit tokens to git
* ❌ Paste tokens in chat, email, or logs
* ❌ Hardcode tokens in scripts
* ❌ Share tokens with others
* ❌ Use tokens in URLs that might be logged
* ❌ Leave tokens in shell history

### 🟢 ALWAYS

* ✅ Use environment variables
* ✅ Revoke tokens when done
* ✅ Use short-lived tokens when possible
* ✅ Rotate tokens regularly
* ✅ Use SSH keys for git operations
* ✅ Store tokens in secure vaults

## Safe Token Usage

### Method 1: Environment Variables (Recommended)

```bash
# In your shell (not in a file)
export GITHUB_TOKEN="ghp_..."
export GITLAB_TOKEN="glpat_..."

# Run script
./create_and_mirror.sh

# Clear tokens when done
unset GITHUB_TOKEN
unset GITLAB_TOKEN
```

### Method 2: Temporary File with Restricted Permissions

```bash
# Create temporary file
cat > /tmp/tokens.sh << 'EOF'
export GITHUB_TOKEN="ghp_..."
export GITLAB_TOKEN="glpat_..."
EOF

# Restrict permissions
chmod 600 /tmp/tokens.sh

# Source and run
source /tmp/tokens.sh
./create_and_mirror.sh

# Delete file
shred -u /tmp/tokens.sh
```

### Method 3: OS Credential Store

**macOS (Keychain):**

```bash
security add-generic-password -s "github-token" -a "$USER" -w "ghp_..."
GITHUB_TOKEN=$(security find-generic-password -s "github-token" -w)
export GITHUB_TOKEN
```

**Linux (pass):**

```bash
pass insert github/token
GITHUB_TOKEN=$(pass show github/token)
export GITHUB_TOKEN
```

**Windows (Credential Manager):**

```powershell
cmdkey /add:github /user:token /pass:ghp_...
```

## Token Scopes

### GitHub Token Scopes

**Minimum (public repos only):**

* `public_repo` - Access public repositories

**Recommended (private repos):**

* `repo` - Full control of private repositories
* `read:user` - Read user profile

**Full access:**

* `admin:repo_hook` - Manage webhooks
* `admin:org_hook` - Manage organization webhooks
* `repo:status` - Access commit status

### GitLab Token Scopes

**Minimum:**

* `api` - Full API access

**Recommended:**

* `api` - Full API access
* `read_repository` - Read repository
* `write_repository` - Write repository

**Optional:**

* `read_user` - Read user profile
* `read_api` - Read API

## Token Rotation

### When to Rotate

* After migration is complete
* If token is exposed
* Quarterly (best practice)
* When team member leaves
* After security incident

### How to Rotate

1. **Create new token** with same scopes
2. **Update environment variables** to use new token
3. **Test new token** with API calls
4. **Run migration** with new token
5. **Revoke old token** from GitHub/GitLab
6. **Verify** old token no longer works

## Detecting Token Leaks

### GitHub

GitHub automatically scans for leaked tokens:

* Checks public repositories
* Notifies token owner
* Automatically revokes exposed tokens

### GitLab

GitLab has secret detection:

* Scans for patterns
* Can be enabled in CI/CD
* Prevents commits with secrets

### Manual Checks

```bash
# Search git history for tokens
git log -p | grep -i "token\|secret\|password"

# Search current files
grep -r "ghp_\|glpat_" .

# Check shell history
history | grep -i "token\|secret"
```

## If Token is Leaked

1. **Immediately revoke** the token
   * GitHub: Settings → Developer settings → Personal access tokens → Delete
   * GitLab: Settings → Access Tokens → Revoke
2. **Create new token** with same scopes
3. **Update all scripts** to use new token
4. **Check logs** for unauthorized access
5. **Notify team** if shared token
6. **Monitor account** for suspicious activity

## SSH Alternative (Recommended)

For production use, prefer SSH keys over tokens:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -f ~/.ssh/gitlab_deploy

# Add to GitLab
# Settings → SSH Keys → Add key

# Use in script
git clone git@gitlab.com:user/repo.git
git push origin main
```

## Audit Trail

### GitHub

* Settings → Security log
* Shows all token usage
* Tracks API calls

### GitLab

* Settings → Audit events
* Shows all API access
* Tracks project changes

## Compliance

### GDPR

* Don't store tokens in logs
* Delete tokens after use
* Encrypt tokens at rest

### SOC 2

* Rotate tokens regularly
* Use short-lived tokens
* Monitor token usage
* Audit access logs

### PCI DSS

* Never log tokens
* Use secure transmission
* Restrict token access
* Monitor for leaks

## Questions?

If you have security concerns:

1. Check GitHub Security Advisory: https://github.com/advisories
2. Check GitLab Security: https://about.gitlab.com/security/
3. Report to security team
4. Never share tokens for debugging
