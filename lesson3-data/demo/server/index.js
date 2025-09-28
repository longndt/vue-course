import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ message: 'Something went wrong!' });
});

// Start server first, then try MongoDB connection
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

// MongoDB connection (optional for demo)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vue-course-lesson3')
   .then(() => {
      console.log('Connected to MongoDB');
   })
   .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.log('Server will continue without MongoDB (using in-memory storage for demo)');
   });

export default app;