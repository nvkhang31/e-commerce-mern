import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './src/config/connectionToDB.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

// Test Route
app.get("/", (req, res) => {
  res.send("Hello, KHANG!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`);
});