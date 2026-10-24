const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Connect Database
const connectDB = async () => {
  try {
    // using default local mongod
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pediatric_health');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/records', require('./routes/records'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
