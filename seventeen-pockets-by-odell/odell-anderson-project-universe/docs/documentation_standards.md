# Documentation Standards

## Overview

This document standardizes documentation across all Seventeen Pockets projects.

## Required Documentation Files

Every project must include:

### 1. README.md

**Required sections:**

* Project title and description
* Features
* Tech stack
* Quick start
* Project structure
* Contributing guidelines
* License

### 2. CONTRIBUTING.md

**Required sections:**

* Development setup
* Coding standards
* Commit message format
* Pull request process
* Testing requirements

### 3. DEPLOYMENT.md

**Required sections:**

* Prerequisites
* Environment variables
* Deployment steps
* Verification
* Rollback procedures

### 4. ARCHITECTURE.md

**Required sections:**

* System overview
* Component architecture
* Data flow
* Database schema
* API endpoints

### 5. DEPENDENCY\_VERSIONS.md

**Purpose:** Locked dependency versions

### 6. PLATFORM\_COMPATIBILITY.md

**Purpose:** Platform-specific configurations

### 7. CONFIGURATION\_STANDARDS.md

**Purpose:** Configuration standards

## Documentation Standards

### Formatting

* Use Markdown for all documentation
* Use clear, concise language
* Include code examples
* Use proper heading hierarchy

### Code Examples

* Always include language identifier
* Keep examples concise and runnable
* Include expected output
* Use realistic data

### Links

* Use relative links for internal docs
* Use absolute URLs for external links
* Verify all links work

### Updates

* Update docs when code changes
* Keep version numbers current
* Document breaking changes
* Include migration guides

## Documentation Checklist

* [ ] README.md exists and is complete
* [ ] CONTRIBUTING.md exists
* [ ] DEPLOYMENT.md exists
* [ ] ARCHITECTURE.md exists
* [ ] DEPENDENCY\_VERSIONS.md exists
* [ ] PLATFORM\_COMPATIBILITY.md exists
* [ ] CONFIGURATION\_STANDARDS.md exists
* [ ] All links are valid
* [ ] Code examples are tested
* [ ] Version numbers are current

## Synchronization Across Projects

### Shared Documentation

These files should be identical across all projects:

* DEPENDENCY\_VERSIONS.md
* PLATFORM\_COMPATIBILITY.md
* CONFIGURATION\_STANDARDS.md
* DOCUMENTATION\_STANDARDS.md

### Project-Specific Documentation

These files should be customized per project:

* README.md
* CONTRIBUTING.md
* DEPLOYMENT.md
* ARCHITECTURE.md
