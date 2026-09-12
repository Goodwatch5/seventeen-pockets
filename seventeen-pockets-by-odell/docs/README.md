# Solar Nexus

**GitLab Project Network Visualization**

Interactive D3.js visualization of your GitLab projects, their relationships, and activity.

***

## 🎯 What is Solar Nexus?

Solar Nexus is a **standalone visualization tool** that creates an interactive network graph of your GitLab projects.

### Features

* 🌐 **Interactive Network Graph** - D3.js powered visualization
* 📊 **Project Statistics** - Commits, issues, contributors
* 🔗 **Fork Relationships** - See how projects connect
* 🎨 **Activity Visualization** - Color-coded by recent activity
* 🔄 **Auto-Refresh** - Scheduled data updates via CI/CD
* 📱 **Responsive Design** - Works on all devices

***

## 🚀 Quick Start

### 1. Set GitLab Token

```bash
export GITLAB_TOKEN='glpat-your-token-here'
```

### 2. Run Data Collection

```bash
cd solar-nexus
python fetch_gitlab_data.py
```

### 3. View Visualization

Open `index.html` in your browser or deploy to GitLab Pages.

***

## 📦 Installation

### Prerequisites

* Python 3.11+
* GitLab account with API access
* GitLab Personal Access Token with `read_api` scope

### Setup

```bash
# Clone repository
git clone https://gitlab.com/intelligence-dev-for-seventeen-pockets/solar-connect.git
cd solar-connect

# Install Python dependencies
pip install requests python-dotenv

# Configure environment
cp solar-nexus/.env.example solar-nexus/.env
# Edit .env with your GITLAB_TOKEN

# Collect data
cd solar-nexus
python fetch_gitlab_data.py

# View locally
python -m http.server 8000
# Visit http://localhost:8000
```

***

## ⚙️ Configuration

### Environment Variables

| Variable          | Required | Description                  | Default                                  |
| ----------------- | -------- | ---------------------------- | ---------------------------------------- |
| `GITLAB_TOKEN`    | ✅ Yes    | GitLab personal access token | -                                        |
| `GITLAB_URL`      | No       | GitLab instance URL          | `https://gitlab.com`                     |
| `GITLAB_GROUP_ID` | No       | Group to fetch projects from | `intelligence-dev-for-seventeen-pockets` |
| `GITLAB_USERNAME` | No       | Fallback username            | `goodwatch5`                             |
| `OUTPUT_FILE`     | No       | Data output location         | `public/data.json`                       |

### GitLab Token Scopes

**Required:**

* `read_api` - Read project data
* `read_repository` - Access repository information

***

## 🔄 Automated Deployment (GitLab Pages)

### Enable GitLab Pages

1. Go to **Settings → General → Visibility**
2. Enable **Pages**
3. Save changes

### Configure CI/CD Variables

1. Go to **Settings → CI/CD → Variables**
2. Add variable:
   * **Key:** `GITLAB_TOKEN`
   * **Value:** Your GitLab token
   * **Protected:** ✅ Yes
   * **Masked:** ✅ Yes

### Pipeline Runs Automatically

* **On push to main:** Collects data and deploys
* **On schedule:** Refreshes data (configure in CI/CD → Schedules)

### Access Your Visualization

After pipeline completes:

**URL:** https://intelligence-dev-for-seventeen-pockets.gitlab.io/solar-connect

***

## 📅 Scheduled Data Refresh

### Setup Schedule

1. Go to **CI/CD → Schedules**
2. Click **New schedule**
3. Configure:
   * **Description:** "Data refresh"
   * **Interval:** `0 */6 * * *` (every 6 hours)
   * **Target branch:** `main`
   * **Active:** ✅ Yes
4. Save

***

## 🎨 Visualization Features

### Node Properties

* **Size:** Number of commits
* **Color:**
  * 🔵 Blue = Main projects
  * 🟣 Purple = Forked projects
  * 🔷 Light blue = Active (< 7 days)

### Interactions

* **Click node:** View project details
* **Drag node:** Rearrange graph
* **Hover:** Highlight connections

### Statistics Dashboard

* Total projects
* Active contributors
* Total commits
* Open issues

***

## 🛠️ Development

### Local Development

```bash
# Run data collection
cd solar-nexus
export GITLAB_TOKEN='your-token'
python fetch_gitlab_data.py

# Serve locally
python -m http.server 8000
```

### File Structure

```
solar-nexus/
├── index.html              # Visualization interface
├── fetch_gitlab_data.py    # Data collection script
├── .gitlab-ci.yml          # CI/CD pipeline
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md              # Documentation
```

***

## 🐛 Troubleshooting

### Data Collection Fails

**Error:** `GITLAB_TOKEN not set`

```bash
export GITLAB_TOKEN='glpat-your-token'
```

**Error:** `403 Forbidden`

* Check token has `read_api` scope
* Verify token hasn't expired
* Ensure access to group/projects

### Visualization Not Loading

**Check data file exists:**

```bash
ls -la public/data.json
```

**Validate JSON:**

```bash
cat public/data.json | python -m json.tool
```

### Pipeline Fails

**Check CI/CD variables:**

1. Go to **Settings → CI/CD → Variables**
2. Verify `GITLAB_TOKEN` is set
3. Check token is not expired

***

## 📊 Data Collection Details

### What Data is Collected

* Project metadata (name, description, URL)
* Commit statistics
* Issue counts
* Fork relationships
* Contributor information
* Activity timestamps
* Pipeline status
* Branch information

### Data Privacy

* ✅ Only public/accessible project data
* ✅ No personal information stored
* ✅ Data accessed via official GitLab API
* ✅ All requests authenticated with your token

***

## 🔐 Security

### Best Practices

* ✅ Never commit `.env` file
* ✅ Use masked CI/CD variables
* ✅ Rotate tokens every 90 days
* ✅ Use minimum required token scopes
* ✅ Enable 2FA on GitLab account

### Token Security

**If token is compromised:**

1. Revoke token in GitLab
2. Generate new token
3. Update CI/CD variables
4. Re-run pipeline

***

## 📝 License

MIT License

***

## 👤 Author

**Odell Anderson**

* Email: iknewnothingnew@gmail.com
* GitLab: [@Goodwatch5](https://gitlab.com/Goodwatch5)

***

## 🎯 Project Status

**Version:** 1.0.0\
**Status:** ✅ Production Ready\
**Last Updated:** 2025-12-05

***

**This is a standalone project - no external dependencies required.**
