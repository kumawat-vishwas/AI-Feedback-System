import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

type Feedback = {
  id: number;
  rating: number;
  review: string;
  ai_response?: string | null;
  ai_summary?: string | null;
  ai_recommended_actions?: string | null;
  created_at: string;
  updated_at: string;
};

const Reviews = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllFeedbacks = async () => {
    try {
      setError("");
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/feedbacks/`);
      if (response.status === 200) {
        setFeedbacks(response.data as Feedback[]);
      } else {
        setError("Failed to fetch reviews.");
      }
    } catch (err) {
      console.error("Error fetching all feedbacks:", err);
      setError("Error connecting to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">All Reviews</h1>
            <p className="mt-1 text-sm text-slate-600">Fetched from `/feedbacks/` endpoint.</p>
          </div>
          <div className="hidden md:block text-xs text-slate-500">Last updated {new Date().toLocaleString()}</div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm">
          <div className="p-6 sm:p-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm4 3v2h10V8H7Zm0 4v2h10v-2H7Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">All Feedbacks</p>
                <p className="text-xs text-slate-500">Full list of submitted reviews</p>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={fetchAllFeedbacks}
                disabled={isLoading}
                className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition ${
                  isLoading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                }`}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" className="fill-none stroke-white/70" strokeWidth="4" />
                    </svg>
                    Refreshing...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3Z" />
                    </svg>
                    Fetch All Reviews
                  </span>
                )}
              </button>
              <a
                href="/admin"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300"
              >
                Back to Analytics
              </a>
            </div>
          </div>
          {error && (
            <div className="px-6 pb-6">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <p className="text-sm font-medium text-slate-900">Reviews</p>
            <span className="text-xs text-slate-500">Showing {feedbacks.length}</span>
          </div>
          <div className="p-5 grid grid-cols-1 gap-4">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600 text-xs font-semibold">{fb.rating}★</span>
                    <p className="text-sm font-medium text-slate-900">Review</p>
                  </div>
                  <p className="text-xs text-slate-500">{new Date(fb.created_at).toLocaleString()}</p>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <p className="text-sm text-slate-800">{fb.review}</p>
                  {fb.ai_summary && (
                    <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2">
                      <p className="text-xs font-medium text-indigo-900">AI Summary</p>
                      <p className="mt-1 text-sm text-indigo-900/90">{fb.ai_summary}</p>
                    </div>
                  )}
                  {fb.ai_recommended_actions && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <p className="text-xs font-medium text-emerald-900">AI Recommended Actions</p>
                      <pre className="mt-1 whitespace-pre-wrap break-words text-sm text-emerald-900/90">{fb.ai_recommended_actions}</pre>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">Updated: {new Date(fb.updated_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {feedbacks.length === 0 && !isLoading && !error && (
              <div className="text-sm text-slate-600">No reviews found.</div>
            )}
            {isLoading && (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
