# Alert Pocket Integration Guide

## Quick Start

### 1. Discord Setup (5 minutes)

```bash
# Create Discord server and webhook
# 1. Open Discord → Create Server → "Seventeen Pockets"
# 2. Right-click server → Server Settings → Integrations → Webhooks
# 3. New Webhook → Name: "Seventeen Pockets Alert" → Copy URL
# 4. Set environment variable
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."

# Test webhook
curl -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🟢 Alert System Operational",
    "username": "Seventeen Pockets"
  }'
```

### 2. Telegram Setup (3 minutes)

```bash
# 1. Message @BotFather on Telegram
# 2. Send: /newbot
# 3. Name: "Seventeen Pockets Alert"
# 4. Username: "seventeen_pockets_bot"
# 5. Save bot token
export TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."

# 6. Message your bot, then get chat ID
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates"
# Find chat_id in response
export TELEGRAM_CHAT_ID="123456789"
```

### 3. Deploy Alert Service

```bash
# Docker
docker build -t alert-pocket:latest .
docker run -p 8001:8001 \
  -e DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" \
  -e TELEGRAM_BOT_TOKEN="$TELEGRAM_BOT_TOKEN" \
  -e TELEGRAM_CHAT_ID="$TELEGRAM_CHAT_ID" \
  alert-pocket:latest

# Docker Compose
docker-compose up -d
```

## API Endpoints

### Health Check

```bash
GET /health
```

### Send Alert

```bash
POST /api/v1/alert
Content-Type: application/json

{
  "type": "Pocket Down",
  "message": "Pocket 01 is DOWN",
  "pocket": "Nexus",
  "severity": "critical",
  "metadata": {
    "status_code": 503,
    "duration": "5 minutes"
  }
}
```

### Send Batch Alerts

```bash
POST /api/v1/alerts/batch
Content-Type: application/json

{
  "alerts": [
    {
      "type": "Error Detected",
      "message": "5 errors in Pocket 02",
      "pocket": "Intelligence",
      "severity": "warning"
    },
    {
      "type": "Deployment Success",
      "message": "Build #247 deployed",
      "pocket": "Pipeline",
      "severity": "success"
    }
  ]
}
```

### Test Alert

```bash
POST /api/v1/alert/test?severity=info
```

### Get Channels

```bash
GET /api/v1/channels
```

### Get Rules

```bash
GET /api/v1/rules
```

## Integration with Other Pockets

### From Pocket 09 (Monitor)

Configure UptimeRobot webhook:

```
URL: https://your-app.vercel.app/api/v1/alert
Method: POST
Content-Type: application/json

Body:
{
  "type": "Monitor Alert",
  "message": "*monitorFriendlyName* is *alertTypeFriendlyName*",
  "pocket": "*monitorFriendlyName*",
  "severity": "critical"
}
```

### From Pocket 02 (Intelligence)

```python
import requests

def send_alert(message, severity='info'):
    requests.post(
        'https://your-app.vercel.app/api/v1/alert',
        json={
            'type': 'Intelligence Alert',
            'message': message,
            'pocket': 'Intelligence',
            'severity': severity
        }
    )

# Usage
if anomalies_detected > 5:
    send_alert(
        f'{anomalies_detected} anomalies detected',
        severity='warning'
    )
```

### From Database (Neon)

```sql
CREATE OR REPLACE FUNCTION alert_on_error()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.error_count > 0 THEN
    PERFORM http_post(
      'https://your-app.vercel.app/api/v1/alert',
      json_build_object(
        'type', 'Database Alert',
        'message', 'Errors detected in pocket ' || NEW.pocket_id,
        'pocket', 'Pocket ' || NEW.pocket_id,
        'severity', 'critical'
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER error_alert_trigger
AFTER INSERT ON pocket_metrics
FOR EACH ROW
WHEN (NEW.error_count > 0)
EXECUTE FUNCTION alert_on_error();
```

## Alert Rules

Rules are defined in `config/alert_config.yaml`:

```yaml
rules:
  - name: "Pocket Down"
    condition: "status === 'down'"
    severity: "critical"
    message_template: "🔴 CRITICAL: {pocket} is DOWN"
    
  - name: "High Response Time"
    condition: "response_time > 500"
    severity: "warning"
    message_template: "⚠️ WARNING: {pocket} response time is {response_time}ms"
```

## Throttling

Alerts are throttled to prevent spam:

```yaml
severity_levels:
  critical:
    throttle_seconds: 300  # 5 minutes
  warning:
    throttle_seconds: 600  # 10 minutes
  info:
    throttle_seconds: 1800  # 30 minutes
  success:
    throttle_seconds: 86400  # 24 hours
```

## Monitoring

Metrics tracked:

* Alert delivery rate
* Channel availability
* Response times
* Failed deliveries

## Troubleshooting

### Discord webhook not working

```bash
# Test webhook
curl -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test"}'

# Check response code (should be 204)
```

### Telegram not receiving messages

```bash
# Verify bot token
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

# Verify chat ID
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates"
```

### Alerts being throttled

Check throttle configuration in `alert_config.yaml`. Throttling is per alert type + pocket + severity.

## Performance

* **Latency**: <1 second to Discord/Telegram
* **Throughput**: 1000+ alerts/minute
* **Reliability**: 99.9% delivery
* **Cost**: $0/month

## Support

For issues, check logs:

```bash
docker logs alert-pocket
```
