import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const geminiClient = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    key: process.env.GEMINI_API_KEY, // Pass API key as query param instead
  },
});