import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

// Import routes
import userRoutes from './routes/users.js';
import tripRoutes from './routes/trips.js';
import cityRoutes from './routes/cities.js';
import weatherRoutes from './routes/weather.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173', // Development
    'http://localhost:3000', // Alternative dev port
    'https://your-frontend-domain.vercel.app', // Replace with your Vercel domain
    process.env.FRONTEND_URL // Environment variable for frontend URL
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderwise')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/weather', weatherRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'WanderWise API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});