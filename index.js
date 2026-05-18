require('dotenv').config({ path: require('path').resolve(__dirname, '.env') }); // Load env variables from root
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
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());               // Enable CORS for all routes
app.use(express.json());       // Parse JSON bodies
app.use('/api/v1', v1Routes);
app.use('/auth',authroute);
app.use('/hero',hero);
app.use('/event',event);
app.use('/downloads',downloads);
app.use('/history', historyRoutes);
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
const fs = require('fs');
const path = require('path');
app.listen(PORT, '0.0.0.0', () => {
  const msg = `Server started at ${new Date().toISOString()} on port ${PORT}. process.env.PORT is ${process.env.PORT}\n`;
  console.log(msg);
  fs.appendFileSync(path.resolve(__dirname, 'startup.log'), msg);
}).on('error', (err) => {
  const errMsg = `Server failed to start: ${err.message}\n`;
  console.error(errMsg);
  fs.appendFileSync(path.resolve(__dirname, 'startup.log'), errMsg);
});

