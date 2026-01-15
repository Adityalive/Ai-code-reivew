import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const analyzeCode = async (code) => {
  try {
    const prompt = `You are an **Expert AI Code Refactoring Specialist**. Your primary task is to provide the developer with the most **optimal and corrected version** of the code block they provided, making necessary improvements for performance, best practices, and security.

Your response **MUST** follow this strict format:

1.  **Start immediately** with the corrected code block using Markdown code fencing (e.g., \`\`\`javascript ... \`\`\`).
2.  Do not add any introductory text or explanation before the code block.
3.  After the code block, provide a concise assessment in a single "Key Takeaways" section.

### Key Takeaways
* [**Refactor Summary:** Briefly explain the core changes made for optimization (e.g., "Refactored to use async/await for cleaner flow and improved error handling.")]
* [**Verdict:** 1-2 line final verdict on the code's quality.]

**Original Code to Review:**

Code:
${code}
`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Use gemini-2.5-flash (available in your API)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    console.log("Making request to Gemini API with gemini-2.5-flash...");
    
    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Gemini API Response Success!");
    
    const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return text;
  } catch (error) {
    console.error("=== GEMINI API ERROR ===");
    console.error("Status:", error.response?.status);
    console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Error Message:", error.message);
    console.error("=======================");
    throw new Error(error.response?.data?.error?.message || "Failed to analyze code");
  }
};