require('dotenv').config({ path: './src/.env' }); // Load env variables
const express = require('express');
const cors = require('cors');  // Import cors
const app = express();
const v1Routes = require('./src/routes/v1');
const authroute=require('./src/routes/authetication');
const upload = require('./src/middlewares/minio');
const hero=require('./src/homepage/hero');
const event=require('./src/homepage/event');
const historyRoutes = require('./src/aboutnith/history');
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());               // Enable CORS for all routes
app.use(express.json());       // Parse JSON bodies
app.use('/v1', v1Routes);
app.use('/auth',authroute);
app.use('/hero',hero);
app.use('/event',event);

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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

