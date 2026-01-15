import { useState } from "react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update this URL to your actual Render backend URL
  // If you use VITE, you can set this in a .env file as VITE_API_URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please enter some code to review");
      return;
    }

    setLoading(true);
    setError("");
    setReview("");

    try {
      // Use the dynamic API_BASE_URL instead of a hardcoded localhost
      const res = await axios.post(`${API_BASE_URL}/api/review`, { code }, {
        withCredentials: true // Ensures cookies/headers are sent if needed
      });
      setReview(res.data.review); 
    } catch (err) {
      console.error("Error:", err);
      // More specific error handling for CORS or Network issues
      const errorMessage = err.response?.data?.error || 
                           (err.code === "ERR_NETWORK" ? "Connection failed. Is the backend server awake?" : "Error fetching review.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setReview("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="w-full max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-100 flex items-center">
            <span className="text-blue-400 text-4xl mr-3">AI Code Reviewer</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time code analysis powered by Gemini
          </p>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-3 text-gray-300">Your Code (Input)</h2>
            <div className="flex-1 bg-gray-800 rounded-xl shadow-xl border border-gray-700/70 p-6 flex flex-col">
                <textarea
                    id="code-input"
                    className="flex-1 min-h-[300px] border border-gray-600 rounded-lg p-4 font-mono text-sm text-gray-100 bg-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none mb-4"
                    placeholder="Paste your code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !code.trim()}
                        className="flex-1 flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed font-semibold text-base transition-colors"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            "Review Code"
                        )}
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={loading}
                        className="w-auto px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 border border-gray-600 disabled:bg-gray-800 disabled:text-gray-600 font-semibold transition-colors"
                    >
                        Clear
                    </button>
                </div>
                {error && (
                    <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg shadow-md mt-4">
                        <p className="text-red-400 font-bold">⚠️ Error</p>
                        <p className="text-red-300 text-sm mt-1">{error}</p>
                    </div>
                )}
            </div>
        </div>

        <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-3 text-gray-300">Code Review Results</h2>
            {review ? (
                <div className="flex-1 bg-gray-800 p-6 rounded-xl border border-gray-700/70 shadow-xl overflow-y-auto">
                    <div className="flex items-start space-x-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            A
                        </div>
                        <h3 className="text-lg font-semibold text-gray-200">
                            AI Review Response
                        </h3>
                    </div>
                    <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {review}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-800 p-6 rounded-xl border border-gray-700/70 shadow-xl">
                    <p className="text-gray-500 text-center">
                        The review results will appear here after you submit your code.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;