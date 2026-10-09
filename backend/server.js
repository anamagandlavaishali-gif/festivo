import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB, getDBStatus } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with auto-fallback to resilient in-memory mode if mongod is not local)
connectDB();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// System Health and Database Status Endpoint
app.get('/api/status', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'online',
    appName: 'Festivo - College Event Management Platform',
    version: '1.0.0',
    database: dbStatus,
    guide: dbStatus.mode === 'mongodb'
      ? 'Connected to live MongoDB database.'
      : 'Running in demonstration in-memory mock mode. To connect real MongoDB, configure MONGO_URI in backend/.env with your local or MongoDB Atlas connection string and restart the server.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Festivo College Event Management API is running.');
});

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`\x1b[35m✨ Festivo API Server listening on http://localhost:${PORT}\x1b[0m`);
});

export default app;
