import express from "express";
import { getCodeReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", getCodeReview);

export default router;
