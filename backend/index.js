// /backend/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/fileUploadRoutes');
const marketDataRoutes = require('./routes/marketDataRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const preferencesRoutes = require("./routes/preferencesRoutes");
const profileRoutes = require('./routes/profileRoute');
const galleryRoutes = require('./routes/galleryRoutes');
const imageRouter = require('./routes/imageRoutes');
const multer = require('multer');


const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());  // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));

// Routes
app.use('/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/markettrends', marketDataRoutes);
app.use("/market-trends", dashboardRoutes);
app.use("/api/preferences", preferencesRoutes); 
app.use("/api", profileRoutes);
app.use('/api', galleryRoutes);
app.use('/api/images', imageRouter);

// Set up the view engine if you plan to use EJS (optional)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Starting the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
