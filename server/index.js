// 1. Load Environment Config FIRST (Sabse upar hona chahiye!)
const dotenv = require('dotenv');
dotenv.config();

// 2. Core Dependencies
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

// 3. Import Route Handlers (Ab inke andar process.env smoothly chalega)
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const aiRoutes = require('./routes/aiRoutes');

// 4. Database Connection
connectDB();

const app = express();

// 5. Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Dedicated API Routing Mounting Pipeline
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes); 
app.use('/api/ai', aiRoutes); 

// Base Health Check Test Endpoint
app.get('/', (req, res) => {
  res.send('AI Habit Tracker API is running smoothly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));