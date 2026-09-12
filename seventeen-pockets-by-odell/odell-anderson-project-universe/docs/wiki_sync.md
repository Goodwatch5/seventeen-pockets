# 📊 Automated Wiki Roadmap Sync

## Overview

**Auto Wiki Sync** automatically updates the Series A Roadmap wiki page whenever changes are merged to main.

***

## 🤖 How It Works

### Fully Automated via GitLab CI

```
Merge to main → GitLab CI triggers → auto_wiki_sync.sh runs → Wiki updated
```

**NO manual execution required!**

***

## ✅ What Gets Updated

### Wiki Page: "Series A Roadmap"

**Content:**

1. **Mission Statement** - Rightway's vision and mission
2. **Live Mermaid Gantt Chart** - Interactive timeline
3. **Strategic Moats** - 5 competitive advantages
4. **Key Milestones** - Q1-Q4 2026 roadmap
5. **Funding Strategy** - Series A details ($5M)
6. **Success Metrics** - Technical, business, impact
7. **Competitive Advantage** - Comparison table
8. **Contact Info** - ODell Anderson details
9. **Resources** - Links to key documents

**Auto-Updates:**

* ✅ Timestamp (last updated)
* ✅ Mermaid chart (from roadmap.mmd)
* ✅ Milestones (from current status)
* ✅ Metrics (from latest data)

***

## 🚀 Execution Flow

### When You Merge:

1. GitLab CI detects merge to `main`
2. Triggers `wiki:sync-roadmap` job
3. Runs `auto_wiki_sync.sh` script
4. Checks if wiki page exists
5. Creates or updates "Series A Roadmap" page
6. Embeds live Mermaid Gantt chart
7. Adds timestamp and reference point
8. Pipeline completes

### Result:

**Wiki URL:** [https://gitlab.com/shippedout/17-pockets-left-brand/-/wikis/Series-A-Roadmap](https://gitlab.com/shippedout/17-pockets-left-brand/-/wikis/Series-A-Roadmap)

***

## 📊 Mermaid Gantt Chart

The wiki embeds a **live Mermaid Gantt chart** showing:

* Q1: Foundation (Odell Standard, Edge Architecture, Legal)
* Q1: Clinical Pilot (First clinic, Clinics 2-5, Validation)
* Q1: Fundraising (Investor meetings)
* Q2: Scale Pilot (Clinics 6-10, Case studies, HIPAA audit)
* Q2: Fundraising (Due diligence, Series A close)
* Q2-Q3: AI Optimization (Offline AI, Biomarker validation)
* Q3-Q4: Scale (50 clinics, International, Series B prep)
* Milestones (10 clinics, $100k MRR, Break-even, Series B ready)

**Interactive:** Hover over tasks to see details

***

## 🔄 Comparison: Manual vs Automated

### Your Original Script (Manual):

```bash
# Set token
export GITLAB_TOKEN="..."

# Run script
./wiki_sync.sh

# Check wiki manually
# Hope it worked
```

### This Automated Version:

```bash
# Just merge to main
# That's it!
```

**Benefits:**

* ✅ Zero manual execution
* ✅ Uses CI\_JOB\_TOKEN (secure)
* ✅ Always up-to-date
* ✅ Runs in GitLab infrastructure
* ✅ Auditable and repeatable

***

## ✅ Verification (After Merge)

### 1. Check Pipeline

* Go to: CI/CD → Pipelines
* Look for: `wiki:sync-roadmap` job
* Status: Should be ✅ green

### 2. Check Wiki

* Go to: [Wiki → Series A Roadmap](https://gitlab.com/shippedout/17-pockets-left-brand/-/wikis/Series-A-Roadmap)
* Should see:
  * ✅ Updated timestamp
  * ✅ Live Mermaid chart
  * ✅ All sections present
  * ✅ Correct formatting

### 3. Check Logs

* View pipeline job logs
* Should see: "✅ Wiki Roadmap is Live!"

***

## 🛠️ Manual Execution (If Needed)

If automated execution fails, run manually:

```bash
# Set token
export GITLAB_TOKEN="your_token"

# Run script
chmod +x .gitlab/scripts/auto_wiki_sync.sh
./.gitlab/scripts/auto_wiki_sync.sh
```

***

## 🎯 Use Cases

### For Investors:

* Share wiki link in pitch emails
* Live roadmap always up-to-date
* Professional presentation
* Interactive Gantt chart

### For Team:

* Single source of truth
* Always current milestones
* Clear strategic direction
* Easy to reference

### For Partners:

* Transparent roadmap
* Clear timelines
* Strategic moats visible
* Contact info readily available

***

## 📝 Customization

To update the roadmap:

1. Edit `.gitlab/scripts/auto_wiki_sync.sh`
2. Update `ROADMAP_MERMAID` variable (Gantt chart)
3. Update `WIKI_CONTENT` variable (page content)
4. Commit and merge to main
5. Wiki updates automatically

***

## 🚨 Troubleshooting

### Issue: Wiki not updated

**Check:**

* Pipeline logs for errors
* CI\_JOB\_TOKEN has wiki permissions
* Wiki is enabled for project

**Solution:**

* Re-run pipeline manually
* Check project settings → General → Visibility → Wiki enabled

### Issue: Mermaid chart not rendering

**Check:**

* Mermaid syntax is valid
* Chart is wrapped in \`\`\`mermaid ... \`\`\`
* No special characters breaking syntax

**Solution:**

* Test Mermaid syntax at [mermaid.live](https://mermaid.live)
* Fix syntax errors
* Re-run sync

***

## 📞 Contact

**ODell Anderson**\
Founder, Rightway

📧 odell@odellecosystem.com\
📱 (803) 349-5051\
📍 Columbia, SC 29203

***

_Automated wiki sync for Series A roadmap_\
_&#x50;art of the Seventeen Pockets ecosystem_
