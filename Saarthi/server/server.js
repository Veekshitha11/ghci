const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const faqRoutes = require('./routes/faqRoutes'); // <--- ADD THIS
const botRoutes = require('./routes/botRoutes');


// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/assistant', assistantRoutes);

app.use('/api/faq', faqRoutes); // <--- ADD THIS
app.use('/api/bot', botRoutes);



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinTech Voice API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Make sure ML API is running on http://localhost:5000`);
});