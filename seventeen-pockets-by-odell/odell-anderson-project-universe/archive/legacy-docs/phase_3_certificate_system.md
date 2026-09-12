# Phase 3: Certificate Generation & Verification

## Overview

Phase 3 implements professional PDF certificate generation with QR codes and a comprehensive verification system.

## Components

### 1. PDF Certificate Generator

**File**: `scripts/pdf-certificate-generator.py`

**Features**:

* Professional PDF certificate design
* QR code generation
* Verification token embedding
* Customizable templates
* Metadata tracking

**Usage**:

```bash
python scripts/pdf-certificate-generator.py \
  --cert-id cert-001 \
  --learner-name "John Doe" \
  --course-title "GitLab Fundamentals" \
  --verification-token ABC123DEF456 \
  --instructor "Training Team"
```

### 2. Certificate Verifier

**File**: `scripts/certificate-verifier.py`

**Features**:

* Verify certificate authenticity
* Check expiry dates
* Revoke certificates
* List certificates
* Get verification statistics

**Usage**:

```bash
# Verify certificate
python scripts/certificate-verifier.py \
  --action verify \
  --certificate-id cert-001 \
  --token ABC123DEF456

# Get certificate info
python scripts/certificate-verifier.py \
  --action info \
  --certificate-id cert-001

# List certificates
python scripts/certificate-verifier.py \
  --action list

# Revoke certificate
python scripts/certificate-verifier.py \
  --action revoke \
  --certificate-id cert-001 \
  --reason "Duplicate certificate"

# Get statistics
python scripts/certificate-verifier.py \
  --action stats
```

## Certificate Features

### Professional Design

* Branded header
* Learner name prominently displayed
* Course title
* Issue and expiry dates
* Instructor signature line

### Security Features

* Unique verification token
* QR code for easy verification
* Certificate ID
* Expiry date validation
* Revocation capability

### Metadata Tracking

* Issue date
* Expiry date
* Verification token
* Instructor name
* Certificate status
* Generation timestamp

## Integration with Previous Phases

### From Phase 1: Certificate Generator

* Uses existing certificate data structure
* Extends with PDF generation
* Maintains verification tokens

### From Phase 2: MR Workflow

* Triggered on MR merge
* Automatic generation
* Learner notification

## Workflow

```
MR Merged
    ↓
Certificate Generation Triggered
    ↓
PDF Generated with QR Code
    ↓
Metadata Saved
    ↓
Learner Notified
    ↓
Certificate Available for Download
    ↓
Verification Link Provided
```

## Verification Process

### For Learners

1. Receive certificate
2. Share verification link
3. Others scan QR code or use link
4. System verifies authenticity

### For Verifiers

1. Scan QR code or click link
2. Enter certificate ID and token
3. System validates
4. Display certificate information

## Configuration

**In `config/settings.json`**:

```json
{
  "certificate_settings": {
    "validity_years": 2,
    "include_qr_code": true,
    "include_verification_token": true,
    "format": "pdf"
  }
}
```

## Dependencies

```bash
pip install reportlab qrcode pillow
```

## File Structure

```
certificates/
├── issued/
│   ├── cert-001.pdf
│   ├── cert-001-metadata.json
│   ├── cert-002.pdf
│   └── cert-002-metadata.json
└── pending-generation/
    └── review-001-trigger.json
```

## Testing

### Test Certificate Generation

```bash
python scripts/pdf-certificate-generator.py \
  --cert-id test-cert-001 \
  --learner-name "Test Learner" \
  --course-title "Test Course" \
  --verification-token TEST123ABC456
```

### Test Verification

```bash
python scripts/certificate-verifier.py \
  --action verify \
  --certificate-id test-cert-001 \
  --token TEST123ABC456
```

## Next Steps

1. Install dependencies
2. Test certificate generation
3. Test verification system
4. Integrate with Phase 2 workflow
5. Deploy to production

## Phase 4 Preview

**Analytics & Dashboard**:

* Metrics collection
* Dashboard creation
* Report generation
* Data visualization
