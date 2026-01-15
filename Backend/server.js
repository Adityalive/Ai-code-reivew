// Backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import reviewRoute from "./src/routes/review.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS configuration - MUST BE FIRST
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 2. Body parser middleware - MUST BE BEFORE ROUTES
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Add logging middleware to debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// 4. Routes
app.use("/api/review", reviewRoute);

// 5. Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", port: PORT });
});

// 6. Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Found' : 'Missing'}`);
});