# Contributing to the ODell Ecosystem

**Part of the ODell Ecosystem | Branded by ODell | Powered by ODell and Light Creations**

Thank you for helping build projects in the ODell ecosystem. We appreciate your contributions!

## Before You Start

Please read our [Legal Compliance Policy](.gitlab/legal_compliance_policy.md) to understand our branding and legal requirements.

## Contribution Guidelines

### 1. Open Issues First

Before starting work, please:

* Check if an issue already exists
* Open a new issue describing the work
* Wait for feedback from maintainers
* Get approval before starting major work

### 2. Branch Naming

Use descriptive branch names:

* `feature/<short-description>` - New features
* `fix/<short-description>` - Bug fixes
* `docs/<short-description>` - Documentation updates
* `refactor/<short-description>` - Code refactoring
* `legal/<short-description>` - Legal/compliance updates

**Examples:**

* `feature/add-user-auth`
* `fix/resolve-memory-leak`
* `docs/update-api-reference`

### 3. Merge Request Process

When submitting a merge request:

1. Use the provided MR template
2. Link to the related issue
3. Describe your changes clearly
4. Include any breaking changes
5. Add tests if applicable
6. Ensure all checks pass

### 4. Legal Compliance

All contributions must comply with our [Legal Compliance Policy](.gitlab/legal_compliance_policy.md):

* ✅ Use correct branding (ODell, Light Creations, Seventeen Pockets)
* ✅ Include platform disclaimer in new documentation
* ✅ No claims of Git/GitHub/GitLab ownership
* ✅ Proper copyright and licensing
* ✅ Reference LEGAL\_COMPLIANCE.md when relevant

**Non-compliant MRs will be flagged and requested for changes.**

### 5. Code of Conduct

All contributors must follow our [Code of Conduct](https://gitlab.com/shippedout/17-pockets-left-brand/-/blob/main/CODE_OF_CONDUCT.md):

* Be respectful and inclusive
* Provide constructive feedback
* Report violations to maintainers

## For Maintainers

### Review Requirements

* **Trivial changes** (typos, docs): 1 approval
* **Code changes**: 2 approvals
* **Legal/compliance changes**: 2 approvals + legal review
* **Breaking changes**: 3 approvals + discussion

### Labels

Use labels to triage issues and MRs:

* `bug` - Bug reports
* `feature` - Feature requests
* `documentation` - Documentation updates
* `legal-compliance` - Legal/compliance issues
* `good-first-issue` - Good for new contributors
* `help-wanted` - Need community help
* `blocked` - Blocked by another issue

### Merge Checklist

Before merging:

* [ ] All checks pass
* [ ] Required approvals obtained
* [ ] Legal compliance verified
* [ ] Tests added/updated
* [ ] Documentation updated
* [ ] No merge conflicts
* [ ] Commit messages are clear

## Development Setup

### Prerequisites

* Git
* \[Your project-specific requirements]

### Local Setup

```bash
# Clone the repository
git clone https://gitlab.com/shippedout/[project-name].git
cd [project-name]

# Create a feature branch
git checkout -b feature/your-feature-name

# Install dependencies
[Your project-specific setup]

# Make your changes
# ...

# Run tests
[Your test command]

# Commit with clear messages
git commit -m "feat: add new feature"

# Push to your fork
git push origin feature/your-feature-name
```

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

* `feat` - New feature
* `fix` - Bug fix
* `docs` - Documentation
* `style` - Code style (formatting, etc.)
* `refactor` - Code refactoring
* `test` - Test updates
* `chore` - Build, dependencies, etc.
* `legal` - Legal/compliance updates

**Example:**

```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
Users can enable 2FA in account settings.

Closes #123
```

## Testing

* Write tests for new features
* Update tests for bug fixes
* Ensure all tests pass before submitting MR
* Aim for >80% code coverage

## Documentation

* Update README.md if behavior changes
* Add/update API documentation
* Include examples for new features
* Keep CHANGELOG.md updated

## Questions?

Reach out to the maintainers:

**Contact:** Odell Anderson **Email:** iknewnothingnew@gmail.com

Or open an issue in the repository.

## Platform Disclaimer

This project is hosted on GitLab and/or GitHub. We do not own, operate, or control GitLab, GitHub, or any Git-related infrastructure. These are third-party services we utilize for version control and collaboration.

***

**Thank you for contributing to the ODell ecosystem!**
