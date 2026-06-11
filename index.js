require('dotenv').config({ path: './src/.env' }); // Load env variables
const express = require('express');
const cors = require('cors');  // Import cors
const app = express();
const v1Routes = require('./src/routes/v1');
const authroute = require('./src/routes/authetication');
const upload = require('./src/middlewares/minio');
const hero = require('./src/homepage/hero');
const event = require('./src/homepage/event');
const downloads = require('./src/downloads/download');
const PORT = process.env.PORT || 4000;

// ── About NITH routes ──────────────────────────────────────────────────────
const historyRoutes      = require('./src/aboutnith/history');
const aboutCityRoutes    = require('./src/aboutnith/aboutcity');
const connectivityRoutes = require('./src/aboutnith/connectivity');
const coreValuesRoutes   = require('./src/aboutnith/core_values');
const goalsRoutes        = require('./src/aboutnith/goals');
const visionRoutes       = require('./src/aboutnith/vision_mission');

// ── Authorities routes ─────────────────────────────────────────────────────
const bogRoutes      = require('./src/authorities/blog');           // BOG
const bwcRoutes      = require('./src/authorities/building');       // BWC
const senateRoutes   = require('./src/authorities/senate');         // Senate
const fcRoutes       = require('./src/authorities/finance_commitee'); // Finance Committee

// Middleware
app.use(cors());               // Enable CORS for all routes
app.use(express.json());       // Parse JSON bodies

// ── Core API routes (versioned) ────────────────────────────────────────────
app.use('/v1', v1Routes);
app.use('/auth', authroute);

// ── Homepage routes ────────────────────────────────────────────────────────
app.use('/hero', hero);
app.use('/event', event);

// ── Downloads routes ───────────────────────────────────────────────────────
app.use('/downloads', downloads);

// ── About NITH routes ──────────────────────────────────────────────────────
app.use('/history',      historyRoutes);
app.use('/about-city',   aboutCityRoutes);
app.use('/connectivity', connectivityRoutes);
app.use('/core-values',  coreValuesRoutes);
app.use('/goals',        goalsRoutes);
app.use('/vision-mission', visionRoutes);

// ── Authorities routes ─────────────────────────────────────────────────────
app.use('/bog',    bogRoutes);
app.use('/bwc',    bwcRoutes);
app.use('/senate', senateRoutes);
app.use('/fc',     fcRoutes);

// ── File upload route ──────────────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ success: true, url: req.file.location });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

// Basic health-check route
app.get('/', (req, res) => {
  res.send('NIT Hamirpur Backend API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
