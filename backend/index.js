require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const plantRoutes = require('./routes/plantRoutes');


const compression = require('compression');

const app = express();

// 🔥 Performance Middleware
app.use(compression()); // Compress all responses

app.use(cors());

// 🔥 CUSTOM MIDDLEWARE: Skip JSON parsing for multipart/form-data
app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    return next();
  }
  express.json({ limit: '50mb' })(req, res, next);
});

app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    return next();
  }
  express.urlencoded({ extended: true, limit: '50mb' })(req, res, next);
});

// 🔥 MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log('MongoDB Error ❌', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// 🔥 ROUTES (multer handles multipart in plantRoutes)
app.use('/api/plants', plantRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
