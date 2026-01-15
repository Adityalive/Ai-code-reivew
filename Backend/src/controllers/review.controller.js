import { analyzeCode } from "../services/gemini.service.js";

export const getCodeReview = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    const review = await analyzeCode(code);
    res.json({ review });
  } catch (err) {
    console.error("Controller Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate review" });
  }
};
