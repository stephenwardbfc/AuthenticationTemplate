import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './utils/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5050;

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});
