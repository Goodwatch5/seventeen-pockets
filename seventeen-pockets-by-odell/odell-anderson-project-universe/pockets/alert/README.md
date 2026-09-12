# Pocket 10: Alert System

**Status**: Phase 3 - Core Infrastructure **Type**: Multi-Channel Notification Service **Cost**: $0/month (Discord, Telegram, Email) **Dependencies**: Pocket 09 (Monitor) recommended **Deployment Time**: 5 minutes

## Overview

Real-time multi-channel notification system for critical infrastructure events. Integrates with UptimeRobot, database triggers, and other pockets to deliver alerts via Discord, Telegram, and Email.

## Architecture

### Alert Channels

* **Discord**: Rich embeds, real-time, free webhooks
* **Telegram**: Bot API, mobile notifications, free
* **Email**: Built-in to UptimeRobot, SMTP fallback

### Event Types

**Critical Events**

* Pocket goes down (HTTP 5xx)
* Error count increases
* Response time exceeds 500ms
* Success rate drops below 99%
* Pipeline fails
* Anomalies detected

**Success Events**

* Pocket comes back online
* New deployment successful
* Performance improvement detected
* Zero errors maintained

## Severity Levels

| Level    | Color  | Emoji | Channels       | Throttle |
| -------- | ------ | ----- | -------------- | -------- |
| Critical | Red    | 🔴    | All            | 5 min    |
| Warning  | Yellow | ⚠️    | Discord, Email | 10 min   |
| Info     | Blue   | 🔵    | Discord        | 30 min   |
| Success  | Green  | ✅     | Discord        | 24 hours |

## Quick Start

### 1. Discord Setup (5 minutes)

```bash
# Create Discord server and webhook
# 1. Open Discord → Create Server → "Seventeen Pockets"
# 2. Right-click server → Server Settings → Integrations → Webhooks
# 3. New Webhook → Name: "Seventeen Pockets Alert" → Copy URL
# 4. Save DISCORD_WEBHOOK_URL environment variable

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
# 5. Save TELEGRAM_BOT_TOKEN
# 6. Message your bot, then visit:
# https://api.telegram.org/bot<TOKEN>/getUpdates
# 7. Find chat_id and save TELEGRAM_CHAT_ID
```

### 3. Deploy Alert Endpoint

```bash
# Deploy to Vercel/Netlify
# Add environment variables
# Test endpoint
curl -X POST "https://your-app.vercel.app/api/alert" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Test Alert",
    "message": "System operational",
    "pocket": "Alert",
    "severity": "success"
  }'
```

## Integration Points

### From Pocket 09 (Monitor)

UptimeRobot webhook → Alert endpoint → Discord/Telegram

### From Pocket 02 (Intelligence)

```python
from alert_client import send_alert

if anomalies_detected > 5:
    send_alert(
        message=f'{anomalies_detected} anomalies detected',
        pocket='Intelligence',
        severity='warning'
    )
```

### From Database (Neon)

```sql
CREATE TRIGGER error_alert_trigger
AFTER INSERT ON pocket_metrics
FOR EACH ROW
WHEN (NEW.error_count > 0)
EXECUTE FUNCTION alert_on_error();
```

## Performance

* **Latency**: <1 second to Discord/Telegram
* **Throughput**: 1000+ alerts/minute
* **Reliability**: 99.9% delivery
* **Cost**: $0/month

## Monitoring

* Alert delivery rate
* Channel availability
* Response times
* Failed deliveries

## References

* [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
* [Telegram Bot API](https://core.telegram.org/bots/api)
* [UptimeRobot Webhooks](https://uptimerobot.com/api)
