# Postman CLI Integration Guide

This document explains how to set up and use Postman CLI with the Seventeen Pockets project.

## Overview

Postman CLI brings the power of Postman's API platform directly to your terminal. It allows you to:

* Run API collections and tests
* Automate API checks in CI/CD pipelines
* Enforce API governance and security rules
* Monitor API health and performance

## Installation

### Global Installation

```bash
npm install -g postman-cli
```

### Project Installation

```bash
npm install
```

The project includes `postman-cli` as a dev dependency in `package.json`.

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Set the following variables:

```bash
# Postman API Key (required)
POSTMAN_API_KEY=your_postman_api_key_here

# Collection Configuration (optional)
POSTMAN_COLLECTION_ID=your_collection_id_here
POSTMAN_ENVIRONMENT_ID=your_environment_id_here

# Monitor Configuration (optional)
POSTMAN_MONITOR_ID=your_monitor_id_here

# API Governance (optional)
POSTMAN_API_ID=your_api_id_here

# Region (default: us)
POSTMAN_REGION=us

# API Endpoints
API_BASE_URL=http://localhost:3000
```

### Getting Your Postman API Key

1. Go to [Postman API Keys](https://web.postman.co/settings/me/api-keys)
2. Click "Generate API Key"
3. Copy the generated key
4. Add it to your `.env` file

### Finding Collection and Environment IDs

1. In Postman, open your collection
2. Click the three dots menu
3. Select "Share Collection"
4. The collection ID is in the URL or share dialog
5. Similarly, find environment IDs in the Environments section

## Setup

### Initial Setup

```bash
# Run the setup script
chmod +x scripts/postman-setup.sh
./scripts/postman-setup.sh
```

Or manually:

```bash
# Login to Postman
postman login --with-api-key $POSTMAN_API_KEY
```

## Usage

### Run Collection Tests

```bash
# Using npm script
npm run postman:run-collection

# Or directly
postman collection run $POSTMAN_COLLECTION_ID -e $POSTMAN_ENVIRONMENT_ID
```

### Run Monitor

```bash
# Using npm script
npm run postman:run-monitor

# Or directly
postman monitor run $POSTMAN_MONITOR_ID
```

### Check API Governance

```bash
# Using npm script
npm run postman:lint

# Or directly
postman api lint $POSTMAN_API_ID
```

### Full Test Suite

```bash
npm run postman:test
```

## CI/CD Integration

The project includes a `test:postman` job in `.gitlab-ci.yml` that:

1. Installs Postman CLI
2. Authenticates with your Postman API key
3. Runs collection tests
4. Checks API governance rules
5. Generates test reports

### GitLab CI Variables

Set these in your GitLab project settings:

* `POSTMAN_API_KEY` - Your Postman API key (mark as protected/masked)
* `POSTMAN_COLLECTION_ID` - Your collection ID
* `POSTMAN_ENVIRONMENT_ID` - Your environment ID (optional)
* `POSTMAN_API_ID` - Your API ID (optional)
* `POSTMAN_REGION` - Region (default: us)

## Available Commands

```bash
# Setup
npm run postman:login

# Testing
npm run postman:run-collection
npm run postman:run-monitor
npm run postman:test

# Governance
npm run postman:lint
```

## Test Results

Test results are saved to:

* `postman-test-results.json` - Collection test results
* `postman-lint-results.json` - API linting results

These files are available as CI/CD artifacts.

## Troubleshooting

### "Binary not found" Error

If you get a "Binary not found" error:

```bash
# Ensure you're not using --no-optional flag
npm install

# Or reinstall
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

```bash
# Verify your API key
echo $POSTMAN_API_KEY

# Re-login
postman login --with-api-key $POSTMAN_API_KEY
```

### Collection Not Found

```bash
# Verify collection ID
echo $POSTMAN_COLLECTION_ID

# Check Postman API key has correct permissions
```

## Best Practices

1. **Never commit API keys** - Use environment variables
2. **Use separate environments** - Development, staging, production
3. **Version your collections** - Track changes in Git
4. **Run tests in CI/CD** - Automate API validation
5. **Monitor API health** - Use Postman monitors
6. **Document endpoints** - Keep API documentation updated

## Resources

* [Postman CLI Documentation](https://learning.postman.com/docs/postman-cli/postman-cli-overview/)
* [Postman API Reference](https://learning.postman.com/docs/postman-cli/postman-cli-run-collections/)
* [API Governance Rules](https://learning.postman.com/docs/postman-cli/postman-cli-api-lint/)

## Support

For issues or questions:

1. Check the [Postman CLI Documentation](https://learning.postman.com/docs/postman-cli/)
2. Review the [Postman Support](https://www.postman.com/support/)
3. Check [GitHub Issues](https://github.com/postmanlabs/postman-cli/issues)

## Next Steps

1. ✅ Install postman-cli
2. ✅ Set up environment variables
3. ✅ Create Postman collection
4. ✅ Configure CI/CD variables
5. ✅ Run tests locally
6. ✅ Verify CI/CD integration
