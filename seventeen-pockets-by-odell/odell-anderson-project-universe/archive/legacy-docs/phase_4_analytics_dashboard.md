# Phase 4: Analytics & Dashboard

## Overview

Phase 4 implements comprehensive analytics collection and reporting system with interactive dashboards.

## Components

### 1. Metrics Collector

**File**: `scripts/metrics-collector.py`

**Features**:

* Collect learner metrics
* Collect review metrics
* Collect certificate metrics
* Aggregate data
* Save metrics to JSON

**Metrics Collected**:

**Learner Metrics**:

* Total learners
* Active learners
* Completed learners
* Courses enrolled
* Courses completed
* Average completion percentage
* Status breakdown

**Review Metrics**:

* Total reviews
* Completed reviews
* Pending reviews
* Average rating
* Average quality score
* Status breakdown

**Certificate Metrics**:

* Total certificates
* Issued certificates
* Revoked certificates
* Expired certificates
* Active certificates

**Usage**:

```bash
# Collect all metrics
python scripts/metrics-collector.py

# Collect specific metrics
python scripts/metrics-collector.py --type learners
python scripts/metrics-collector.py --type reviews
python scripts/metrics-collector.py --type certificates

# Save to custom file
python scripts/metrics-collector.py --output custom/metrics.json
```

### 2. Report Generator

**File**: `scripts/report-generator.py`

**Features**:

* Generate summary reports
* Generate learner reports
* Generate review reports
* Generate certificate reports
* Generate HTML dashboards

**Report Types**:

**Summary Report**:

* Overview of all metrics
* Key performance indicators
* High-level statistics

**Learner Report**:

* Learner enrollment data
* Completion statistics
* Status breakdown
* Progress analysis

**Review Report**:

* Review completion data
* Rating statistics
* Quality metrics
* Status breakdown

**Certificate Report**:

* Certificate issuance data
* Revocation statistics
* Expiry tracking
* Active certificate count

**HTML Dashboard**:

* Interactive visualization
* Real-time metrics
* Visual cards
* Responsive design

**Usage**:

```bash
# Generate summary report
python scripts/report-generator.py --type summary

# Generate learner report
python scripts/report-generator.py --type learner

# Generate review report
python scripts/report-generator.py --type review

# Generate certificate report
python scripts/report-generator.py --type certificate

# Generate HTML dashboard
python scripts/report-generator.py --type dashboard

# Save to custom file
python scripts/report-generator.py --type summary --output custom/report.json
```

## Workflow

```
Data Collection
    ↓
Metrics Aggregation
    ↓
Report Generation
    ↓
Dashboard Creation
    ↓
Visualization
```

## Key Metrics

### Learner Metrics

* **Total Learners**: Count of all registered learners
* **Active Learners**: Learners currently in progress
* **Completed Learners**: Learners who finished courses
* **Completion Rate**: Average completion percentage
* **Courses Enrolled**: Total course enrollments
* **Courses Completed**: Total completed courses

### Review Metrics

* **Total Reviews**: Count of all reviews
* **Completed Reviews**: Reviews with feedback submitted
* **Pending Reviews**: Reviews awaiting feedback
* **Average Rating**: Mean rating across reviews
* **Quality Score**: Feedback quality assessment

### Certificate Metrics

* **Total Certificates**: Count of all certificates
* **Issued Certificates**: Active certificates
* **Revoked Certificates**: Revoked certificates
* **Expired Certificates**: Expired certificates
* **Active Certificates**: Valid, non-expired certificates

## Dashboard Features

### Visual Elements

* Metric cards with key statistics
* Color-coded values
* Responsive grid layout
* Real-time updates
* Timestamp tracking

### Metrics Displayed

* Total learners
* Active learners
* Completed learners
* Completion rate
* Total reviews
* Average review rating
* Total certificates
* Active certificates

## File Structure

```
analytics/
├── metrics.json
├── dashboard.html
└── reports/
    ├── summary.json
    ├── learner.json
    ├── review.json
    └── certificate.json
```

## Integration with CI/CD

**Add to `.gitlab-ci.yml`**:

```yaml
analytics:collect-metrics:
  stage: deploy
  image: python:3.11
  script:
    - python scripts/metrics-collector.py
  artifacts:
    paths:
      - analytics/metrics.json
    expire_in: 30 days
  only:
    - schedules
  variables:
    SCHEDULE_TYPE: "collect-metrics"

analytics:generate-reports:
  stage: deploy
  image: python:3.11
  script:
    - python scripts/report-generator.py --type summary
    - python scripts/report-generator.py --type learner
    - python scripts/report-generator.py --type review
    - python scripts/report-generator.py --type certificate
    - python scripts/report-generator.py --type dashboard
  artifacts:
    paths:
      - analytics/reports/
      - analytics/dashboard.html
    expire_in: 90 days
  only:
    - schedules
  variables:
    SCHEDULE_TYPE: "generate-reports"
```

## Scheduling

### Daily Metrics Collection

* Collect metrics every day at 00:00 UTC
* Store in `analytics/metrics.json`
* Retain for 30 days

### Weekly Report Generation

* Generate reports every Monday at 08:00 UTC
* Create summary, learner, review, certificate reports
* Generate HTML dashboard
* Retain for 90 days

### Monthly Analysis

* Deep dive analysis
* Trend identification
* Performance review
* Recommendations

## Usage Examples

### Collect Metrics

```bash
python scripts/metrics-collector.py
```

### Generate All Reports

```bash
python scripts/report-generator.py --type summary
python scripts/report-generator.py --type learner
python scripts/report-generator.py --type review
python scripts/report-generator.py --type certificate
python scripts/report-generator.py --type dashboard
```

### View Dashboard

```bash
# Open analytics/dashboard.html in browser
open analytics/dashboard.html
```

## Testing

```bash
# Test metrics collection
python scripts/metrics-collector.py --type all

# Test report generation
python scripts/report-generator.py --type summary

# Test dashboard generation
python scripts/report-generator.py --type dashboard
```

## Next Steps

1. Deploy Phase 4
2. Set up scheduled jobs
3. Monitor metrics
4. Review reports
5. Optimize based on data

## Future Enhancements

* Advanced visualizations (charts, graphs)
* Real-time dashboards
* Custom report builder
* Data export (CSV, Excel)
* Email reports
* Slack notifications
* Predictive analytics
* Anomaly detection
