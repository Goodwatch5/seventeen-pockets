# Real Data Sources

This project must use real data sources before it is presented as production-ready.

## Supported / Candidate Sources

* GitLab API: repository, pipeline, issue, and deployment activity.
* GitHub API: mirrored repository activity where available.
* GCP Dataform IAM verification: analytics service-account readiness.

## Environment Variables

```bash
GITLAB_TOKEN=optional_for_private_gitlab_projects
GITHUB_TOKEN=optional_for_github_rate_limits
GCP_PROJECT_NUMBER=248946685771
CUSTOM_SA_EMAIL=iknewnothingnew@gmail.com
```

## Readiness Rule

If `README.md` is missing, this project is not externally ready. Add a clear README before claiming readiness.

## Minimum Realness Standard

* README exists
* CI exists
* env variables documented
* `scripts/deep-logic-audit.mjs` runs in CI
