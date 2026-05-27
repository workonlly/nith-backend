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
const studentActivitiesRoutes = require('./src/routes/studentActivities');
const studentFunctionariesRoutes = require('./src/routes/studentFunctionaries');
const studentNoticesRoutes = require('./src/routes/studentNotices');
const studentSgrcRoutes = require('./src/routes/studentSgrc');
const studentCulturalRoutes = require('./src/routes/studentCultural');
const studentHillfairRoutes = require('./src/routes/studentHillfair');
const studentSpicmacayRoutes = require('./src/routes/studentSpicmacay');
const studentTechnicalIntroRoutes = require('./src/routes/studentTechnicalIntro');
const studentNimbusRoutes = require('./src/routes/studentNimbus');
const studentInnovationRoutes = require('./src/routes/studentInnovation');
const studentSportsIntroRoutes = require('./src/routes/studentSportsIntro');
const studentLalkaarRoutes = require('./src/routes/studentLalkaar');
const studentYogaDayRoutes = require('./src/routes/studentYogaDay');
const studentNssRoutes = require('./src/routes/studentNss');
const studentNccRoutes = require('./src/routes/studentNcc');
const studentMagazineRoutes = require('./src/routes/studentMagazine');
const studentNewsBulletinRoutes = require('./src/routes/studentNewsBulletin');
const studentHostelManagementRoutes = require('./src/routes/studentHostelManagement');
const studentHostelNithRoutes = require('./src/routes/studentHostelNith');
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
app.use('/api/student-activities', studentActivitiesRoutes);
app.use('/api/student-functionaries', studentFunctionariesRoutes);
app.use('/api/student-notices', studentNoticesRoutes);
app.use('/api/student-sgrc', studentSgrcRoutes);
app.use('/api/student-cultural', studentCulturalRoutes);
app.use('/api/student-hillfair', studentHillfairRoutes);
app.use('/api/student-spicmacay', studentSpicmacayRoutes);
app.use('/api/student-technical-intro', studentTechnicalIntroRoutes);
app.use('/api/student-nimbus', studentNimbusRoutes);
app.use('/api/student-innovation', studentInnovationRoutes);
app.use('/api/student-sports-intro', studentSportsIntroRoutes);
app.use('/api/student-lalkaar', studentLalkaarRoutes);
app.use('/api/student-yogaday', studentYogaDayRoutes);
app.use('/api/student-nss', studentNssRoutes);
app.use('/api/student-ncc', studentNccRoutes);
app.use('/api/student-magazine', studentMagazineRoutes);
app.use('/api/student-news-bulletin', studentNewsBulletinRoutes);
app.use('/api/student-hostel-management', studentHostelManagementRoutes);
app.use('/api/student-hostels-at-nith', studentHostelNithRoutes);



// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Error occurred during file upload' });
    }
    if (req.file) {
      res.json({ success: true, url: req.file.location });
    } else {
      res.status(400).json({ success: false, error: 'No file uploaded' });
    }
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

