require('dotenv').config(); // Load env variables from root .env
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
const facultyActivitiesRoutes = require('./src/routes/facultyActivities');
const facultyFunctionariesRoutes = require('./src/routes/facultyFunctionaries');
const facultyNoticesRoutes = require('./src/routes/facultyNotices');
const facultyCpdaRoutes = require('./src/routes/facultyCpda');
const facultyDeputationRoutes = require('./src/routes/facultyDeputation');
const facultyForwardingRoutes = require('./src/routes/facultyForwarding');
const facultyWorkshopRoutes = require('./src/routes/facultyWorkshop');
const alumniActivitiesRoutes = require('./src/routes/alumniActivities');
const alumniMouRoutes = require('./src/routes/alumniMou');
const alumniFunctionariesRoutes = require('./src/routes/alumniFunctionaries');
const alumniAssistRoutes = require('./src/routes/alumniAssist');
const alumniDistinguishedRoutes = require('./src/routes/alumniDistinguished');
const alumniRegistrationRoutes = require('./src/routes/alumniRegistration');
const alumniEndowmentRoutes = require('./src/routes/alumniEndowment');
const alumniAwardsRoutes = require('./src/routes/alumniAwards');
const alumniAnnualMeetRoutes = require('./src/routes/alumniAnnualMeet');
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
app.use('/api/faculty-activities', facultyActivitiesRoutes);
app.use('/api/faculty-functionaries', facultyFunctionariesRoutes);
app.use('/api/faculty-notices', facultyNoticesRoutes);
app.use('/api/faculty-cpda', facultyCpdaRoutes);
app.use('/api/faculty-deputation', facultyDeputationRoutes);
app.use('/api/faculty-forwarding', facultyForwardingRoutes);
app.use('/api/faculty-workshop', facultyWorkshopRoutes);
app.use('/api/alumni-activities', alumniActivitiesRoutes);
app.use('/api/alumni-mou', alumniMouRoutes);
app.use('/api/alumni-functionaries', alumniFunctionariesRoutes);
app.use('/api/alumni-assist', alumniAssistRoutes);
app.use('/api/alumni-distinguished', alumniDistinguishedRoutes);
app.use('/api/alumni-registration', alumniRegistrationRoutes);
app.use('/api/alumni-endowment', alumniEndowmentRoutes);
app.use('/api/alumni-awards', alumniAwardsRoutes);
app.use('/api/alumni-annual-meet', alumniAnnualMeetRoutes);
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

