# Phase 2 Quick Start Guide

## What's New in Phase 2

✅ **MR-Based Review Workflow**

* Automatic MR creation for reviews
* Comment-based feedback collection
* Quality validation
* Automated certificate generation

✅ **New Scripts**

* `create-review-mr.py` - Create review MRs
* `parse-review-comments.py` - Parse feedback
* `mr-approval-automation.py` - Automate approval/merge

✅ **Sample Lessons**

* 5 complete lessons with quizzes
* Ready for learners to start

## Quick Start: 5-Minute Setup

### 1. Create a Test Learner

```bash
python scripts/progress-tracker.py --action create \
  --learner-id learner-demo \
  --learner-name "Demo Learner" \
  --email "demo@example.com"
```

### 2. Enroll in Course

```bash
python scripts/progress-tracker.py --action enroll \
  --learner-id learner-demo \
  --course-id course-001 \
  --course-title "GitLab Fundamentals"
```

### 3. Complete a Lesson

```bash
python scripts/progress-tracker.py --action update \
  --learner-id learner-demo \
  --course-id course-001 \
  --lesson-id lesson-001 \
  --quiz-score 90
```

### 4. Create a Review

```bash
python scripts/peer-review-manager.py --action create \
  --learner-id learner-demo \
  --learner-name "Demo Learner" \
  --course-id course-001 \
  --course-title "GitLab Fundamentals"
```

### 5. Create Review MR

```bash
python scripts/create-review-mr.py \
  --learner-id learner-demo \
  --learner-name "Demo Learner" \
  --course-id course-001 \
  --course-title "GitLab Fundamentals" \
  --review-id review-demo
```

## Full Learning Journey

### Complete Course Flow

```bash
#!/bin/bash

# 1. Create learner
python scripts/progress-tracker.py --action create \
  --learner-id learner-001 \
  --learner-name "John Doe" \
  --email "john@example.com"

# 2. Enroll
python scripts/progress-tracker.py --action enroll \
  --learner-id learner-001 \
  --course-id course-001 \
  --course-title "GitLab Fundamentals"

# 3. Complete all lessons
for i in {1..5}; do
  python scripts/progress-tracker.py --action update \
    --learner-id learner-001 \
    --course-id course-001 \
    --lesson-id lesson-00$i \
    --quiz-score 85
done

# 4. Complete course
python scripts/progress-tracker.py --action complete \
  --learner-id learner-001 \
  --course-id course-001

# 5. Create review
REVIEW=$(python scripts/peer-review-manager.py --action create \
  --learner-id learner-001 \
  --learner-name "John Doe" \
  --course-id course-001 \
  --course-title "GitLab Fundamentals" | jq -r '.review_id')

# 6. Create MR
python scripts/create-review-mr.py \
  --learner-id learner-001 \
  --learner-name "John Doe" \
  --course-id course-001 \
  --course-title "GitLab Fundamentals" \
  --review-id $REVIEW

# 7. Assign reviewer
python scripts/peer-review-manager.py --action assign \
  --review-id $REVIEW \
  --reviewer-id reviewer-001 \
  --reviewer-name "Jane Smith"

# 8. Submit feedback
python scripts/peer-review-manager.py --action submit \
  --review-id $REVIEW \
  --reviewer-id reviewer-001 \
  --rating 5 \
  --feedback "Excellent work! Clear understanding of all concepts." \
  --strengths "Clear communication" "Good examples" \
  --improvements "More advanced topics"

# 9. Check quality
python scripts/mr-approval-automation.py \
  --mr-id $REVIEW \
  --action check

# 10. Approve and merge
python scripts/mr-approval-automation.py \
  --mr-id $REVIEW \
  --action approve

python scripts/mr-approval-automation.py \
  --mr-id $REVIEW \
  --action merge

# 11. Trigger certificate
python scripts/mr-approval-automation.py \
  --mr-id $REVIEW \
  --action trigger-cert

# 12. Generate certificate
python scripts/certificate-generator.py --action create \
  --learner-id learner-001 \
  --learner-name "John Doe" \
  --course-id course-001 \
  --course-title "GitLab Fundamentals"

echo "✅ Complete learning journey finished!"
```

## Available Lessons

1. **Lesson 1**: Introduction to GitLab (30 min)
2. **Lesson 2**: Creating Your First Project (45 min)
3. **Lesson 3**: Understanding Branches and Commits (40 min)
4. **Lesson 4**: Merge Requests and Code Review (50 min)
5. **Lesson 5**: Introduction to CI/CD (45 min)

## Next Steps

1. **Try the quick start** - Get familiar with the system
2. **Run the full journey** - Test end-to-end workflow
3. **Create more lessons** - Add lessons 6-8
4. **Deploy to production** - Launch Phase 2

## Troubleshooting

### Script not found

```bash
# Make sure you're in the project root
cd /path/to/training-platform
python scripts/progress-tracker.py --help
```

### JSON errors

```bash
# Validate JSON files
python -m json.tool config/settings.json
```

### Permission denied

```bash
# Make scripts executable
chmod +x scripts/*.py
```

## Support

* Check documentation in `/docs`
* Review implementation guide
* Check Phase 2 implementation order
* Open an issue for help

## What's Next?

**Phase 3**: Certificate Generation & Verification

* PDF certificate generation
* QR code integration
* Verification system

**Phase 4**: Analytics & Dashboard

* Metrics collection
* Dashboard creation
* Report generation
