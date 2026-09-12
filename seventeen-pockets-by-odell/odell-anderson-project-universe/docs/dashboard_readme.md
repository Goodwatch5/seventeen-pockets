# SEVENTEEN POCKETS - Dashboard Server Setup

## Quick Start

### Option 1: Using Python (Recommended)

```bash
# Python 3
python3 -m http.server 8080 --directory dashboard

# Python 2
python -m SimpleHTTPServer 8080
```

Then open: **http://localhost:8080**

### Option 2: Using Node.js

```bash
npm install
npm start
```

Then open: **http://localhost:8080**

### Option 3: Using the Bash Script

```bash
chmod +x start-dashboard.sh
./start-dashboard.sh
```

### Option 4: Using Docker

```bash
docker build -t seventeen-pockets-dashboard .
docker run -p 8080:8080 seventeen-pockets-dashboard
```

Then open: **http://localhost:8080**

## Dashboard Features

### 1. System Health Overview

* Active pockets count (17)
* Total energy flow (40,000 MW)
* System uptime (99.99%)
* Total errors (0)

### 2. Pipeline Health Monitoring

* Doughnut chart showing pipeline status
* Success/failed rate summary
* Real-time pipeline metrics

### 3. Network Topology Visualization

* Circular network diagram with all 17 pockets
* Visual connections between nodes
* Interactive hover effects
* Status indicators

### 4. Energy Distribution Analysis

* Bar chart: Capacity vs. Current Load
* Per-pocket energy metrics
* Real-time load tracking

### 5. Pocket Status Grid

* 17-pocket overview
* Click for detailed information
* Color-coded status indicators

### 6. Repository Activity Tracking

* Line chart: Commits vs. Pipelines
* Multi-repository comparison
* Activity trends

### 7. Connection Strength Heatmap

* 17x17 connection matrix
* Color-coded strength (80-100%)
* Interactive cells

### 8. Real-time Metrics

* CPU, memory, disk usage
* Network latency and throughput
* Error rates and sync status
* Updates every 5 seconds

## File Structure

```
.
├── dashboard/
│   ├── index.html          # Main dashboard HTML
│   ├── styles.css          # Complete styling
│   ├── data.js             # Sample data for 17 pockets
│   └── dashboard.js        # Dashboard controller
├── Dockerfile              # Docker configuration
├── nginx.conf              # Nginx configuration
├── package.json            # Node.js dependencies
├── start-dashboard.sh      # Bash startup script
└── README.md               # This file
```

## Technology Stack

* **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
* **Charts**: Chart.js 3.x
* **Animations**: GSAP 3.x
* **Styling**: Modern glassmorphism with gradients
* **Responsive**: Mobile-friendly design

## Browser Support

* Chrome/Edge 90+
* Firefox 88+
* Safari 14+
* Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Update Pocket Data

Edit `dashboard/data.js` to modify:

* Pocket names and status
* Energy capacity and load
* Pipeline statistics
* Repository information

### Change Colors

Edit `dashboard/styles.css` CSS variables:

```css
:root {
    --primary-color: #00d4ff;      /* Cyan */
    --secondary-color: #ff006e;    /* Magenta */
    --accent-color: #ffbe0b;       /* Yellow */
    --success-color: #00ff41;      /* Green */
    --error-color: #ff0055;        /* Red */
}
```

### Modify Update Interval

Edit `dashboard/dashboard.js` line \~280:

```javascript
setInterval(() => {
    // Updates every 5000ms (5 seconds)
}, 5000);
```

## Integration with Backend

To connect to the PostgreSQL database:

1. Create a Node.js/Express backend API
2. Update `dashboard.js` to fetch from API endpoints
3. Replace sample data with real database queries

Example API endpoints needed:

```
GET /api/pockets              # All pocket data
GET /api/pipelines            # Pipeline statistics
GET /api/repositories         # Repository information
GET /api/metrics              # Real-time metrics
GET /api/connections          # Connection matrix
```

## Performance Tips

* Dashboard is fully client-side (no server processing)
* Charts are rendered once and updated efficiently
* SVG topology uses minimal resources
* Responsive design adapts to all screen sizes

## Troubleshooting

### Port Already in Use

```bash
# Use a different port
python3 -m http.server 9000 --directory dashboard
```

### CORS Issues

If connecting to a backend API, ensure CORS headers are set:

```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

### Charts Not Rendering

* Check browser console for errors
* Ensure Chart.js CDN is accessible
* Verify JavaScript is enabled

## Future Enhancements

* [ ] WebSocket integration for real-time updates
* [ ] PostgreSQL backend connection
* [ ] User authentication and authorization
* [ ] Custom time range filtering
* [ ] Export functionality (PDF, CSV)
* [ ] Advanced analytics and reporting
* [ ] Dark/Light theme toggle
* [ ] Mobile app version

## License

MIT

## Support

For issues or questions, please create an issue in the GitLab repository.
