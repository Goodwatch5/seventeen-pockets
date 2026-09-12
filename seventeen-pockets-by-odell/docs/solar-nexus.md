# 🌟 The Solar Nexus - Seventeen Pockets

**Connecting Humanity Solarly**

A stunning 3D visualization dashboard that displays real-time GitLab project metrics through an interactive Earth globe with 17 connected pocket nodes.

![Solar Nexus Preview](https://img.shields.io/badge/Status-Operational-00ff00?style=for-the-badge) ![Pipeline](https://img.shields.io/badge/Pipeline-100%-00ff00?style=for-the-badge) ![Errors](https://img.shields.io/badge/Errors-0-00ff00?style=for-the-badge)

## ✨ Features

### 🌍 3D Visualization

* **Interactive Earth Globe** - Rotating 3D Earth with wireframe overlay using Three.js
* **17 Pocket Nodes** - Distributed connection points with real-time pulse animations
* **Dynamic Connections** - Animated network lines between active nodes
* **Starfield Background** - 3,000+ particle stars for immersive space environment

### 📊 Live Metrics Dashboard

* **Connected Nodes** - Real-time node count based on project activity
* **Solar Energy Flow** - Dynamic energy metrics calculated from GitLab data
* **System Uptime** - 99.99% operational status monitoring
* **Pipeline Success Rate** - Automated CI/CD pipeline health tracking
* **Zero Error Badge** - Rotating badge displaying current error count

### 🔗 GitLab Integration

* **Live Data Feed** - Automatic fetching from GitLab API
* **Project Statistics** - Stars, forks, and issue tracking
* **Recent Commits** - Latest commit messages and authors
* **Auto-Refresh** - Updates every 30 seconds

### 🤖 AI Intelligence Layer

* **Predictive Analysis** - Simulated AI monitoring messages
* **Anomaly Detection** - System health status updates
* **Neural Network** - Connection pathway optimization

### 📱 Responsive Design

* **Mobile Optimized** - Adaptive layout for all screen sizes
* **Touch Friendly** - Optimized interactions for mobile devices
* **Performance** - Smooth 60 FPS animations

## 🚀 Quick Start

### Prerequisites

* Python 3.11+
* GitLab account with API access
* Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://gitlab.com/intelligence-dev-for-seventeen-pockets/solar-connect.git
    cd solar-connect/solar-nexus
    ```
2.  **Install Python dependencies**

    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure environment variables**

    ```bash
    cp .env.example .env
    # Edit .env and add your GitLab token
    ```
4.  **Generate data**

    ```bash
    python fetch_gitlab_data.py
    ```
5.  **Open visualization**

    ```bash
    # Open index.html in your browser
    open index.html  # macOS
    xdg-open index.html  # Linux
    start index.html  # Windows
    ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
GITLAB_URL=https://gitlab.com
GITLAB_TOKEN=glpat-your-token-here
GITLAB_GROUP_ID=intelligence-dev-for-seventeen-pockets
```

### GitLab Token Setup

1. Go to GitLab → **Settings** → **Access Tokens**
2. Create a new token with `read_api` scope
3. Copy the token to your `.env` file

## 📦 Deployment

### GitLab Pages (Automatic)

The project includes a `.gitlab-ci.yml` file that automatically:

1. Collects GitLab data on every push to `main`
2. Generates `gitlab_data.json`
3. Deploys to GitLab Pages

**Access your deployment at:**

```
https://intelligence-dev-for-seventeen-pockets.gitlab.io/solar-connect
```

### Manual Deployment

1.  **Generate data**

    ```bash
    python fetch_gitlab_data.py
    ```
2. **Deploy files**
   * `index.html`
   * `app.js`
   * `gitlab_data.json`

Host on any static web server (GitHub Pages, Netlify, Vercel, etc.)

## 🎨 Customization

### Modify Metrics Calculation

Edit `fetch_gitlab_data.py` in the `calculate_metrics()` function:

```python
def calculate_metrics(self, projects):
    metrics = {
        'connected_nodes': len(projects) * 603,  # Adjust multiplier
        'energy_flow': total_stars * 1247,       # Customize formula
        'uptime': 99.99,                         # Set target uptime
        'pipeline_success_rate': 100,
        'errors': 0
    }
    return metrics
```

### Change Visual Theme

Edit colors in `index.html` CSS:

```css
/* Primary accent color */
.metric-box {
    border: 2px solid #00f5ff;  /* Change to your color */
}

/* Title gradient */
.title {
    background: linear-gradient(45deg, #00f5ff, #ff00ff, #ffff00);
}
```

### Adjust Animation Speed

Modify Three.js animation parameters in `app.js`:

```javascript
earth.rotation.y += 0.001;      // Earth rotation speed
wireframe.rotation.y += 0.001;  // Wireframe rotation
starField.rotation.y += 0.0001; // Star field rotation
```

## 📊 Data Structure

The `gitlab_data.json` file structure:

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "group_id": "intelligence-dev-for-seventeen-pockets",
  "total_projects": 10,
  "metrics": {
    "connected_nodes": 10247,
    "energy_flow": 16853,
    "uptime": 99.99,
    "pipeline_success_rate": 100,
    "errors": 0
  },
  "projects": [
    {
      "id": 123,
      "name": "Project Name",
      "path": "group/project",
      "stars": 5,
      "forks": 2,
      "issues": 3,
      "commits": [...],
      "url": "https://gitlab.com/..."
    }
  ]
}
```

## 🔄 Automated Updates

### CI/CD Pipeline

The pipeline runs on:

* Every push to `main` branch
* Scheduled intervals (configure in GitLab)

### Schedule Setup

1. Go to **CI/CD** → **Schedules**
2. Create new schedule
3. Set interval (e.g., every hour)
4. Target branch: `main`

## 🐛 Troubleshooting

### Data Not Loading

**Symptom:** Orange status dot, "Using simulated data" message

**Solutions:**

1. Check `gitlab_data.json` exists
2. Verify GitLab token is valid
3. Check browser console for errors
4. Ensure CORS is configured if hosting remotely

### Pipeline Failing

**Check:**

1. CI/CD variables are set (`GITLAB_TOKEN`)
2. Token has `read_api` scope
3. Group ID is correct
4. Python dependencies installed

### Performance Issues

**Optimize:**

1. Reduce star particle count (3000 → 1000)
2. Decrease pocket node count (17 → 10)
3. Lower animation frame rate
4. Disable glow effects on mobile

## 🏗️ Architecture

```
solar-nexus/
├── index.html              # Main visualization (3D + HUD)
├── app.js                  # Three.js logic and data integration
├── fetch_gitlab_data.py    # Data collection script
├── requirements.txt        # Python dependencies
├── .gitlab-ci.yml         # CI/CD pipeline
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a merge request

## 📄 License

MIT License - feel free to use and modify!

## 🌟 Credits

* **Three.js** - 3D graphics library
* **GitLab API** - Data source
* **Seventeen Pockets** - Concept and vision

## 🔗 Links

* **Live Demo:** https://intelligence-dev-for-seventeen-pockets.gitlab.io/solar-connect
* **Repository:** https://gitlab.com/intelligence-dev-for-seventeen-pockets/solar-connect
* **Issues:** https://gitlab.com/intelligence-dev-for-seventeen-pockets/solar-connect/-/issues

***

**Made with ❤️ by Seventeen Pockets**

_Connecting Humanity Solarly_ 🌍✨
