require('dotenv').config({ path: './src/.env' }); // Load env variables
const express = require('express');
const cors = require('cors');  // Import cors
const app = express();
const v1Routes = require('./src/routes/v1');
const authroute=require('./src/routes/authetication');
const upload = require('./src/middlewares/minio');
const hero=require('./src/homepage/hero');
const event=require('./src/homepage/event');
const downloads=require('./src/downloads/download');
const historyRoutes = require('./src/aboutnith/history');
const visionMissionRoutes = require('./src/aboutnith/vision_mission');
const goalsRoutes = require('./src/aboutnith/goals');
const aboutcityRoutes = require('./src/aboutnith/aboutcity');
const corevalueRoute = require('./src/aboutnith/core_value');
const connectivityRoute = require('./src/aboutnith/connectivity');
const bogRoute = require('./src/authorities/bog');
const sentaeRoute = require('./src/authorities/senate')
const buildingRoute = require('./src/authorities/building')
const fcRoute = require('./src/authorities/finance_committee')
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());               // Enable CORS for all routes
app.use(express.json());       // Parse JSON bodies
app.use('/v1', v1Routes);
app.use('/auth',authroute);
app.use('/hero',hero);
app.use('/event',event);
app.use('/downloads',downloads);
app.use('/history', historyRoutes);
app.use('/vision-mission', visionMissionRoutes);
app.use('/goals', goalsRoutes);
app.use('/about-city',aboutcityRoutes);
app.use('/core-values',corevalueRoute);
app.use('/connectivity',connectivityRoute);
app.use('/bog',bogRoute);
app.use('/senate',sentaeRoute);
app.use('/bwc',buildingRoute);
app.use('/fc',fcRoute);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ success: true, url: req.file.location });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

