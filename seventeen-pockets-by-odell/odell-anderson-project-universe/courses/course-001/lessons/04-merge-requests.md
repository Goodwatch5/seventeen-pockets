---
description: Master collaborative development with merge requests
---

# Merge Requests and Code Review

## Learning Objectives

By the end of this lesson, you will be able to:

* Create and manage merge requests
* Conduct effective code reviews
* Provide constructive feedback
* Handle merge conflicts
* Approve and merge changes

## What is a Merge Request?

A merge request (MR) is a request to merge changes from one branch into another. It enables:

* **Code Review**: Team members review changes
* **Discussion**: Collaborate on implementation
* **Testing**: Run automated tests
* **Approval**: Ensure quality standards

## Creating a Merge Request

### Step 1: Push Your Branch

```bash
git push origin feature/new-feature
```

### Step 2: Create MR in GitLab

1. Go to your project
2. Click **Merge requests**
3. Click **New merge request**
4. Select source and target branches
5. Fill in title and description
6. Click **Create merge request**

### Step 3: Add Details

* **Title**: Clear, concise description
* **Description**: Explain what and why
* **Assignee**: Who should review
* **Reviewers**: Request specific reviewers
* **Labels**: Add relevant labels
* **Milestone**: Link to milestone

## Code Review Best Practices

### As a Reviewer

**Do**:

* Review promptly
* Be constructive
* Ask questions
* Suggest improvements
* Approve when satisfied

**Don't**:

* Be dismissive
* Request unnecessary changes
* Approve without reviewing
* Leave vague comments

### Providing Feedback

**Good Feedback**:

```
Consider using a more descriptive variable name here.
Instead of 'x', use 'user_count' to improve readability.
```

**Poor Feedback**:

```
This is bad.
```

### Comment Types

1. **Suggestion**: Propose an improvement
2. **Question**: Ask for clarification
3. **Praise**: Acknowledge good work
4. **Concern**: Flag potential issues

## MR Workflow

### 1. Create MR

* Push branch
* Create merge request
* Add description

### 2. Request Review

* Assign reviewers
* Add labels
* Link issues

### 3. Address Feedback

* Make requested changes
* Push updates
* Respond to comments

### 4. Approval

* Reviewers approve
* Tests pass
* Conflicts resolved

### 5. Merge

* Click "Merge"
* Delete source branch
* Close related issues

## Handling Merge Conflicts

### Identify Conflicts

```bash
git status
# Shows conflicted files
```

### Resolve Conflicts

1. Open conflicted file
2.  Find conflict markers:

    ```
    <<<<<<< HEAD
    Your changes
    =======
    Their changes
    >>>>>>> branch-name
    ```
3. Edit to keep desired changes
4. Remove markers
5. Save file

### Complete Resolution

```bash
git add .
git commit -m "Resolve merge conflicts"
git push origin feature/new-feature
```

## MR Settings

### Approval Rules

* Require approvals
* Minimum number of approvers
* Dismiss approvals on new commits

### Merge Options

* **Merge commit**: Create merge commit
* **Squash commits**: Combine into one
* **Fast-forward**: Linear history

### Auto-merge

* Merge when pipeline succeeds
* Merge when approvals met

## Best Practices

* **Keep MRs focused**: One feature per MR
* **Keep MRs small**: Easier to review
* **Write clear descriptions**: Explain context
* **Link related issues**: Track work
* **Respond promptly**: Keep momentum
* **Be respectful**: Professional communication

## Resources

* [GitLab Merge Requests](https://docs.gitlab.com/ee/user/project/merge_requests/)
* [Code Review Guidelines](https://docs.gitlab.com/ee/development/code_review.html)
* [Merge Request Best Practices](https://docs.gitlab.com/ee/user/project/merge_requests/best_practices.html)

## Quiz

### Question 1: What is the main purpose of a merge request?

**A)** To delete branches **B)** To enable code review and collaboration **C)** To create backups **D)** To track issues

**Correct Answer: B**

### Question 2: What should you do before approving an MR?

**A)** Check the title **B)** Review the code changes **C)** Verify tests pass **D)** B and C

**Correct Answer: D**

### Question 3: How do you resolve a merge conflict?

**A)** Delete the file **B)** Edit the file and remove conflict markers **C)** Revert the branch **D)** Ask someone else to fix it

**Correct Answer: B**

## Summary

In this lesson, you learned:

* How to create and manage merge requests
* How to conduct effective code reviews
* How to provide constructive feedback
* How to handle merge conflicts
* Best practices for collaboration

## Next Steps

Proceed to **Lesson 5: Introduction to CI/CD** to learn about automated testing and deployment.

## Feedback

Have questions? Please open an issue or contact your instructor.
