import { useState } from "react";
import axios from "axios";
console.log('ENV', import.meta.env);
// Vite only exposes env vars that start with VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const User = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const submitFeedback = async () => {
    if (!rating || !review.trim()) {
      setError("Please provide both rating and review.");
      return;
    }

    try {
      setError("");
      setSubmitDone(false);
      setIsSubmitting(true);

      const response = await axios.post(`${API_BASE_URL}/feedbacks/`, {
        rating: rating,
        review: review,
      });

      if (response.status === 201) {
        const response_data = response.data;
        setAiResponse(response_data.ai_response);
        setSubmitDone(true);
        setReview("");
        setRating(null);
      } else {
        setError("Failed to submit the feedback.");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again.");
      console.error("Error checking answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10 space-y-6">
      {!submitDone ? (
        <>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">
              Feedback Form
            </h1>
            <p className="text-sm text-slate-500">
              Please provide your feedback below:
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="rate"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Rating (1-5)
              </label>
              <input
                id="rate"
                value={rating ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setRating(val === "" ? null : Number(val));
                }}
                type="number"
                min="1"
                max="5"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter rating here"
              />
            </div>

            <div>
              <label
                htmlFor="review"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Write a review
              </label>
              <textarea
                id="review"
                value={review ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setReview(val);
                }}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Enter review here"
              />
            </div>

            <button
              onClick={submitFeedback}
              disabled={isSubmitting}
              className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 transition
                ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-emerald-700">
              Thank you for your feedback!
            </h1>
            <p className="text-sm text-slate-500">
              Your feedback has been submitted successfully.
            </p>
          </div>

          {aiResponse && (
            <div className="mt-4 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 text-left">
              {aiResponse}
            </div>
          )}

          <button
            onClick={() => {
              setSubmitDone(false);
              setAiResponse(null);
              setError("");
            }}
            className="mt-4 w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-indigo-500"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  </div>
);
};

export default User;