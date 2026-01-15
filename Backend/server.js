// Backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import reviewRoute from "./src/routes/review.route.js";

const app = express();

// IMPORTANT: Deployment platforms provide the PORT via environment variables.
// Do not hardcode 3000 as the only option.
const PORT = process.env.PORT || 3000;

// 1. Updated CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'https://ai-code-reviewer-frontend.vercel.app' // Your actual Vercel URL
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.use(cors(corsOptions));

// 2. Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Logging (Keep this for debugging production logs)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 4. Routes
app.use("/api/review", reviewRoute);

// 5. Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", port: PORT });
});

// 6. Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// IMPORTANT: Bind to 0.0.0.0 for external access on many cloud providers
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port: ${PORT}`);
  console.log(`✅ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Found' : 'Missing'}`);
});