const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // Import auth routes
const employeeRoutes = require('./routes/Employees'); // Import employee routes
const app = express();
const cors = require('cors'); // Import cors for cross-origin requests


// Load environment variables
dotenv.config();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cors({origin:'*'})); // Enable CORS

// Use routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/employees', employeeRoutes); // Employee routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
