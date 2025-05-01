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
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// MongoDB connection
const uri = process.env.MONGO_URI; // use your actual URI
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

// Root
app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

app.listen(5000, () => {
  console.log(`🚀 Server is running at http://localhost:5000`);
});
