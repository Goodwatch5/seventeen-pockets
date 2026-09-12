# Training Platform API Specification

## Overview

RESTful API for managing courses, lessons, progress, reviews, and certificates.

## Base URL

```
https://api.training-platform.local/v1
```

## Authentication

All endpoints require Bearer token authentication.

```
Authorization: Bearer <token>
```

***

## Endpoints

### Courses

#### GET /courses

List all available courses.

**Response:**

```json
{
  "courses": [
    {
      "id": "course-001",
      "title": "GitLab Fundamentals",
      "description": "Learn GitLab basics",
      "difficulty_level": "Beginner",
      "estimated_duration": 4,
      "lesson_count": 8,
      "created_at": "2025-12-01T00:00:00Z"
    }
  ]
}
```

#### POST /courses

Create a new course.

**Request:**

```json
{
  "title": "Advanced CI/CD",
  "description": "Master GitLab CI/CD pipelines",
  "difficulty_level": "Advanced",
  "estimated_duration": 8
}
```

### Lessons

#### GET /courses/{course\_id}/lessons

List lessons in a course.

#### POST /courses/{course\_id}/lessons

Create a new lesson.

#### GET /lessons/{lesson\_id}

Get lesson details.

### Progress

#### GET /learners/{learner\_id}/progress

Get learner's progress across all courses.

#### POST /learners/{learner\_id}/progress

Update learner progress.

**Request:**

```json
{
  "course_id": "course-001",
  "lesson_id": "lesson-001",
  "quiz_score": 85,
  "status": "completed"
}
```

### Reviews

#### GET /reviews/pending

Get pending peer reviews.

#### POST /reviews

Submit a peer review.

**Request:**

```json
{
  "learner_id": "learner-001",
  "course_id": "course-001",
  "rating": 5,
  "feedback": "Excellent work!",
  "areas_of_strength": ["Clear communication"],
  "areas_for_improvement": ["More examples"]
}
```

### Certificates

#### GET /certificates/{learner\_id}

Get learner's certificates.

#### POST /certificates

Generate a new certificate.

**Request:**

```json
{
  "learner_id": "learner-001",
  "course_id": "course-001"
}
```

#### GET /certificates/verify/{token}

Verify certificate authenticity.

***

## Error Handling

**Standard Error Response:**

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: title",
    "details": {}
  }
}
```

**HTTP Status Codes:**

* 200: Success
* 201: Created
* 400: Bad Request
* 401: Unauthorized
* 403: Forbidden
* 404: Not Found
* 500: Server Error
