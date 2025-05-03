const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const secret = process.env.JWT_SECRET;

app.use(express.json());
const allowedOrigins = [
  'https://ghibliclimatechange-awareness.vercel.app', // your deployed frontend
  'http://localhost:3000',
  'http://localhost:3001'
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
console.log('CORS allowed origins:', allowedOrigins);

// Add preflight support for /profile
app.options('/profile', cors());

// MongoDB connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Use routes
app.use('/', authRoutes);
app.use('/', goalRoutes);
app.use('/', postRoutes);

// Health check endpoint for cron job
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

const PORT = process.env.PORT || 5000;
console.log('PORT:', PORT);
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});