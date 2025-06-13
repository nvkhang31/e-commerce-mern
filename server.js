import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './src/config/connectionToDB.js';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';


// Load environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware để parse JSON từ client
app.use(express.json());

// Middleware để parse dữ liệu form (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware để parse cookies
app.use(cookieParser());

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Hello, KHANG!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});