---
description: Automate testing and deployment with CI/CD pipelines
---

# Introduction to CI/CD

## Learning Objectives

By the end of this lesson, you will be able to:

* Understand CI/CD concepts
* Create a basic CI/CD pipeline
* Configure automated testing
* Set up automated deployment
* Monitor pipeline status

## What is CI/CD?

### Continuous Integration (CI)

Automatically test code changes when pushed to the repository.

**Benefits**:

* Catch bugs early
* Ensure code quality
* Reduce manual testing
* Faster feedback

### Continuous Deployment (CD)

Automatically deploy tested code to production.

**Benefits**:

* Faster releases
* Reduced manual errors
* Consistent deployments
* Quick rollbacks

## GitLab CI/CD

GitLab CI/CD uses `.gitlab-ci.yml` file to define pipelines.

### Basic Structure

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - echo "Building..."

test:
  stage: test
  script:
    - echo "Testing..."

deploy:
  stage: deploy
  script:
    - echo "Deploying..."
```

## Pipeline Concepts

### Jobs

Individual tasks that run in a pipeline.

```yaml
test_unit:
  stage: test
  script:
    - pytest tests/
```

### Stages

Groups of jobs that run sequentially.

```yaml
stages:
  - build
  - test
  - deploy
```

### Runners

Machines that execute jobs.

* Shared runners (provided by GitLab)
* Specific runners (your own machines)

## Creating a Pipeline

### Step 1: Create `.gitlab-ci.yml`

```yaml
image: python:3.11

stages:
  - test
  - build

test:
  stage: test
  script:
    - pip install -r requirements.txt
    - pytest

build:
  stage: build
  script:
    - python setup.py build
```

### Step 2: Commit and Push

```bash
git add .gitlab-ci.yml
git commit -m "Add CI/CD pipeline"
git push origin main
```

### Step 3: Monitor Pipeline

1. Go to **CI/CD** > **Pipelines**
2. View pipeline status
3. Click on jobs for details

## Common Pipeline Jobs

### Testing

```yaml
test:
  stage: test
  script:
    - pytest tests/ --cov
  coverage: '/TOTAL.*\s+(\d+%)$/'
```

### Linting

```yaml
lint:
  stage: test
  script:
    - pylint src/
```

### Building

```yaml
build:
  stage: build
  script:
    - docker build -t myapp:latest .
```

### Deployment

```yaml
deploy:
  stage: deploy
  script:
    - docker push myapp:latest
    - kubectl apply -f deployment.yaml
  only:
    - main
```

## Pipeline Status

### Success

* All jobs passed
* Ready to merge
* Can deploy

### Failed

* One or more jobs failed
* Cannot merge (if required)
* Fix issues and retry

### Skipped

* Job conditions not met
* Manual approval needed
* Waiting for other jobs

## Best Practices

* **Keep pipelines fast**: Optimize job duration
* **Fail fast**: Run quick tests first
* **Use caching**: Speed up builds
* **Parallel jobs**: Run independent jobs together
* **Clear logs**: Easy debugging
* **Notifications**: Alert on failures

## Resources

* [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
* [Pipeline Configuration](https://docs.gitlab.com/ee/ci/yaml/)
* [CI/CD Examples](https://docs.gitlab.com/ee/ci/examples/)

## Quiz

### Question 1: What does CI stand for?

**A)** Continuous Integration **B)** Code Integration **C)** Continuous Improvement **D)** Code Inspection

**Correct Answer: A**

### Question 2: What file defines a GitLab CI/CD pipeline?

**A)** `.gitlab.yml` **B)** `.gitlab-ci.yml` **C)** `gitlab.yaml` **D)** `pipeline.yml`

**Correct Answer: B**

### Question 3: What are stages used for?

**A)** To organize jobs sequentially **B)** To run jobs in parallel **C)** To skip jobs **D)** To store artifacts

**Correct Answer: A**

## Summary

In this lesson, you learned:

* CI/CD concepts and benefits
* How to create a GitLab CI/CD pipeline
* How to configure jobs and stages
* How to monitor pipeline status
* Best practices for pipelines

## Next Steps

Proceed to **Lesson 6: Collaboration and Teams** to learn about working with teams.

## Feedback

Have questions? Please open an issue or contact your instructor.
