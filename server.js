const express = require('express');
const path = require('path');
require('dotenv').config();

const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const academicRoutes = require('./routes/academicRoutes');
app.use('/api/academics', academicRoutes);

const enrollmentRoutes = require('./routes/enrollmentRoutes');
app.use('/api/enrollments', enrollmentRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const backupRoutes = require('./routes/backupRoutes');
app.use('/api/backups', backupRoutes);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);

// Catch-all 404 and Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT} with currency HTG`);
});

