# 🚀 Solar Nexus - Complete Setup Guide

This guide will walk you through setting up the Solar Nexus 3D visualization from scratch.

## 📋 Prerequisites

### Required Software

* **Python 3.11+** - [Download](https://www.python.org/downloads/)
* **Git** - [Download](https://git-scm.com/downloads)
* **Modern Web Browser** - Chrome, Firefox, Safari, or Edge
* **GitLab Account** - [Sign up](https://gitlab.com/users/sign_up)

### Required Access

* GitLab account with API access
* Permission to create access tokens
* Access to the `intelligence-dev-for-seventeen-pockets` group

## 🔧 Step-by-Step Setup

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://gitlab.com/intelligence-dev-for-seventeen-pockets/solar-connect.git

# Or clone via SSH (if configured)
git clone git@gitlab.com:intelligence-dev-for-seventeen-pockets/solar-connect.git

# Navigate to project
cd solar-connect/solar-nexus
```

### 2. Install Python Dependencies

```bash
# Install dependencies
pip install -r requirements.txt

# Verify installation
pip list | grep requests
pip list | grep python-dotenv
```

**Expected output:**

```
requests       2.31.0
python-dotenv  1.0.0
```

### 3. Create GitLab Access Token

1. **Go to GitLab Settings**
   * Click your avatar (top right)
   * Select **Settings**
   * Navigate to **Access Tokens**
2. **Create New Token**
   * **Token name:** `Solar Nexus Data Collection`
   * **Expiration date:** Set to 1 year from now
   * **Scopes:** Check `read_api` only
   * Click **Create personal access token**
3. **Copy Token**
   * ⚠️ **Important:** Copy the token immediately
   * You won't be able to see it again!
   * Format: `glpat-xxxxxxxxxxxxxxxxxxxx`

### 4. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**Edit `.env` with your values:**

```bash
# GitLab Configuration
GITLAB_URL=https://gitlab.com
GITLAB_TOKEN=glpat-your-token-here  # ← Paste your token here
GITLAB_GROUP_ID=intelligence-dev-for-seventeen-pockets
```

**Save and close** (Ctrl+X, then Y, then Enter in nano)

### 5. Test Data Collection

```bash
# Run data collection script
python fetch_gitlab_data.py
```

**Expected output:**

```
🔍 Fetching projects from group: intelligence-dev-for-seventeen-pockets
✅ Found 3 projects
  📦 Processing 1/3: solar-connect
  📦 Processing 2/3: solar-nexus
  📦 Processing 3/3: another-project

✅ Data saved to gitlab_data.json
📊 Metrics:
   • Connected Nodes: 10,247
   • Energy Flow: 16,853 MW
   • Uptime: 99.99%
   • Pipeline Success: 100%
   • Errors: 0

🌟 Open index.html to view visualization!
```

### 6. View Visualization Locally

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html

# Or use a local server (recommended)
python -m http.server 8000
# Then open: http://localhost:8000
```

**You should see:**

* 3D rotating Earth globe
* 17 glowing pocket nodes
* Live metrics dashboard
* GitLab project data
* Green status indicators

## 🔄 GitLab CI/CD Setup

### 1. Configure CI/CD Variables

1. **Go to Project Settings**
   * Navigate to **Settings** → **CI/CD**
   * Expand **Variables** section
2. **Add Variables**
   * Click **Add variable**
   * **Key:** `GITLAB_TOKEN`
   * **Value:** Your GitLab token (glpat-...)
   * **Type:** Variable
   * **Environment scope:** All
   * **Protect variable:** ✓ (checked)
   * **Mask variable:** ✓ (checked)
   * Click **Add variable**

### 2. Trigger First Pipeline

```bash
# Make a small change to trigger pipeline
echo "# Pipeline test" >> README.md

# Commit and push
git add README.md
git commit -m "Test pipeline"
git push origin main
```

### 3. Monitor Pipeline

1. Go to **CI/CD** → **Pipelines**
2. Click on the running pipeline
3. Watch the stages:
   * ✅ `collect:data` - Fetches GitLab data
   * ✅ `pages` - Deploys to GitLab Pages

**Expected duration:** 1-2 minutes

### 4. Access Deployed Site

Once pipeline completes:

**URL:** https://intelligence-dev-for-seventeen-pockets.gitlab.io/solar-connect

## 📅 Schedule Automatic Updates

### 1. Create Pipeline Schedule

1. Go to **CI/CD** → **Schedules**
2. Click **New schedule**
3. Configure:
   * **Description:** `Hourly data refresh`
   * **Interval Pattern:** Custom
   * **Cron syntax:** `0 * * * *` (every hour)
   * **Target branch:** `main`
   * **Active:** ✓ (checked)
4. Click **Save pipeline schedule**

### 2. Common Cron Patterns

```bash
# Every hour
0 * * * *

# Every 6 hours
0 */6 * * *

# Every day at midnight
0 0 * * *

# Every Monday at 9 AM
0 9 * * 1
```

## 🎨 Customization

### Change Metrics Calculation

Edit `fetch_gitlab_data.py`:

```python
def calculate_metrics(self, projects):
    total_stars = sum(p.get('star_count', 0) for p in projects)
    total_forks = sum(p.get('forks_count', 0) for p in projects)
    
    return {
        'connected_nodes': len(projects) * 1000,  # ← Adjust multiplier
        'energy_flow': total_stars * 2000,        # ← Customize formula
        'uptime': 99.99,                          # ← Set target
        'pipeline_success_rate': 100,
        'errors': 0
    }
```

### Modify Visual Theme

Edit `index.html` CSS section:

```css
/* Change primary color */
.metric-box {
    border: 2px solid #00f5ff;  /* ← Change to your color */
}

/* Change title gradient */
.title {
    background: linear-gradient(45deg, #00f5ff, #ff00ff, #ffff00);
    /* ← Customize gradient colors */
}
```

### Adjust Animation Speed

Edit `app.js`:

```javascript
// Slower rotation
earth.rotation.y += 0.0005;  // ← Reduce for slower

// Faster rotation
earth.rotation.y += 0.002;   // ← Increase for faster
```

## 🐛 Troubleshooting

### Issue: "GITLAB\_TOKEN not set"

**Solution:**

```bash
# Verify .env file exists
ls -la .env

# Check contents (token will be visible!)
cat .env

# Ensure token starts with glpat-
```

### Issue: "No projects found"

**Possible causes:**

1. Token doesn't have `read_api` scope
2. Group ID is incorrect
3. No access to group

**Solution:**

```bash
# Test API access manually
curl --header "PRIVATE-TOKEN: glpat-your-token" \
  "https://gitlab.com/api/v4/groups/intelligence-dev-for-seventeen-pockets/projects"
```

### Issue: "Pipeline failing"

**Check:**

1. CI/CD variable `GITLAB_TOKEN` is set
2. Variable is not expired
3. Variable is not masked incorrectly

**Debug:**

```bash
# View pipeline logs
# Go to CI/CD → Pipelines → Click failed pipeline → View logs
```

### Issue: "Data not loading in browser"

**Solution:**

```bash
# Check if data file exists
ls -lh gitlab_data.json

# Verify JSON is valid
python -m json.tool gitlab_data.json

# Check browser console (F12) for errors
```

### Issue: "CORS error when loading data"

**Solution:**

* Use a local web server instead of file://

```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

## 📊 Verify Everything Works

### Checklist

* [ ] Python dependencies installed
* [ ] GitLab token created and configured
* [ ] `.env` file created with token
* [ ] `fetch_gitlab_data.py` runs successfully
* [ ] `gitlab_data.json` file generated
* [ ] Visualization opens in browser
* [ ] 3D Earth globe visible
* [ ] Metrics display real data
* [ ] Green status indicators
* [ ] CI/CD variable configured
* [ ] Pipeline runs successfully
* [ ] GitLab Pages deployed
* [ ] Live site accessible

### Test Commands

```bash
# Test data collection
python fetch_gitlab_data.py

# Verify data file
cat gitlab_data.json | python -m json.tool | head -20

# Check file sizes
ls -lh index.html app.js gitlab_data.json

# Test in browser
open index.html
```

## 🎓 Next Steps

1. **Customize metrics** - Adjust formulas in `fetch_gitlab_data.py`
2. **Change theme** - Modify colors in `index.html`
3. **Add features** - Extend visualization with new elements
4. **Schedule updates** - Set up automatic data refresh
5. **Share** - Send live URL to team members

## 📚 Additional Resources

* [GitLab API Documentation](https://docs.gitlab.com/ee/api/)
* [Three.js Documentation](https://threejs.org/docs/)
* [GitLab CI/CD Guide](https://docs.gitlab.com/ee/ci/)
* [GitLab Pages Setup](https://docs.gitlab.com/ee/user/project/pages/)

## 🆘 Getting Help

**Issues?**

* Create an issue: https://gitlab.com/intelligence-dev-for-seventeen-pockets/solar-connect/-/issues
* Check existing issues for solutions
* Review pipeline logs for errors

**Questions?**

* Review this guide thoroughly
* Check the main README.md
* Consult GitLab documentation

***

**Setup complete! 🎉**

_You're now ready to visualize your GitLab projects in stunning 3D!_

🌍✨ **Connecting Humanity Solarly** ✨🌍
