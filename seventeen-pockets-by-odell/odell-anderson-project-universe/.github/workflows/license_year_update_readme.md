# License Year Update Automation

**Purpose:** Automatically update copyright year in all license files on January 1st each year.

## How It Works

### Trigger

* **Schedule:** Runs automatically on January 1st at 00:00 UTC
* **Manual:** Can be triggered manually via GitHub Actions UI

### Process

1. **Checkout repository** - Gets latest code
2. **Get current year** - Determines the new year
3. **Update LICENSE files** - Updates all license files:
   * LICENSE
   * LICENSE.md (if exists)
   * LICENSE.txt (if exists)
4. **Update documentation** - Updates copyright in:
   * README.md (if contains copyright)
   * brand-manifest.md (if exists)
5. **Create Pull Request** - Automatically creates a PR with changes
6. **Assign for review** - Assigns to maintainers for approval

### Files Updated

The workflow automatically updates copyright year in:

* `LICENSE` - Primary license file
* `LICENSE.md` - Markdown version (if exists)
* `LICENSE.txt` - Text version (if exists)
* `README.md` - If contains copyright notice
* `brand-manifest.md` - Brand documentation (if exists)

## Configuration

### Schedule

The workflow runs on January 1st at 00:00 UTC:

```yaml
schedule:
  - cron: '0 0 1 1 *'
```

To change the schedule, modify the cron expression:

* `0 0 1 1 *` = January 1st at 00:00 UTC
* `0 0 1 * *` = 1st of every month at 00:00 UTC
* `0 0 * * 0` = Every Sunday at 00:00 UTC

### Copyright Holder

The workflow updates copyright for:

```
Copyright (c) [YEAR] Odell Anderson
```

To change the copyright holder, update the sed commands:

```bash
sed -i "s/Copyright (c) [0-9]\{4\} YOUR_NAME/Copyright (c) $CURRENT_YEAR YOUR_NAME/g" LICENSE
```

## Manual Trigger

To manually run the workflow:

1. Go to GitHub Actions
2. Select "Update License Year" workflow
3. Click "Run workflow"
4. Select branch (usually main)
5. Click "Run workflow"

## Pull Request

When changes are detected, the workflow:

1. **Creates a PR** with:
   * Title: `chore: update license year to [YEAR]`
   * Description: Details of changes
   * Labels: `chore`, `license`, `automated`
   * Assignee: Maintainers
2. **Includes:**
   * List of updated files
   * Trigger information
   * Copyright holder details
3. **Requires:**
   * Review and approval
   * Merge to main branch

## Example Output

```
✅ Updated LICENSE file with year 2026
✅ Updated README.md with year 2026
✅ Updated brand-manifest.md with year 2026

Changes detected:
LICENSE
README.md
brand-manifest.md
```

## Troubleshooting

### No PR Created

If no PR is created, check:

* Are there any license files in the repository?
* Do they contain the copyright notice?
* Check workflow logs for errors

### Incorrect Year Updated

If the wrong year is updated:

* Check the cron schedule
* Verify the sed regex pattern
* Check for special characters in copyright notice

### PR Not Assigned

If the PR isn't assigned:

* Verify the assignee username is correct
* Check GitHub Actions permissions
* Ensure the user has access to the repository

## Best Practices

1. **Review PRs** - Always review automated PRs before merging
2. **Test locally** - Verify changes are correct
3. **Update schedule** - Adjust cron if needed
4. **Monitor logs** - Check workflow logs for issues
5. **Document changes** - Update CHANGELOG if needed

## Related Documentation

* [GitHub Actions Scheduling](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
* [Cron Syntax](https://crontab.guru/)
* [Create Pull Request Action](https://github.com/peter-evans/create-pull-request)

## Support

For issues or questions:

* Check workflow logs in GitHub Actions
* Review this documentation
* Contact maintainers

***

**Last Updated:** 2025-12-29 **Next Update:** 2026-01-01
