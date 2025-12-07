import { use, useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

type RecentFeedback = {
  id: number;
  rating: number;
  review: string;
  ai_response: string;
  ai_summary: string;
  ai_recommended_actions: string;
  created_at: string;
  updated_at: string;
};

type AnalyticsResponse = {
  total_feedbacks: number;
  rating_distribution: {
    star_1: number;
    star_2: number;
    star_3: number;
    star_4: number;
    star_5: number;
  };
  average_rating: number;
  recent_feedbacks: RecentFeedback[];
};

const Admin = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const analyzeFeedback = async () => {
    try {
      setError("");
      setIsSubmitting(true);
      const response = await axios.get(`${API_BASE_URL}/feedbacks/analytics/`);
      
      if (response.status === 200) {
        const response_data: AnalyticsResponse = response.data;
        setAnalytics(response_data);
      } else {
        setError("Failed to analyze the feedback.");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again.");
      console.error("Error analyzing feedback:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    analyzeFeedback();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin Analytics</h1>
            <p className="mt-1 text-sm text-slate-600">Fetch and view feedback analytics.</p>
          </div>
          <div className="hidden md:block text-xs text-slate-500">Last updated {new Date().toLocaleString()}</div>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M3 6a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9 9a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-3Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Feedback Analytics</p>
                  <p className="text-xs text-slate-500">Aggregates recent reviews and ratings</p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                <button
                  onClick={analyzeFeedback}
                  disabled={isSubmitting}
                  className={`inline-flex w-full sm:w-auto items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition
                    ${
                      isSubmitting
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                    }`}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" className="fill-none stroke-white/70" strokeWidth="4" />
                      </svg>
                      Fetching...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3Z" />
                      </svg>
                      Fetch Analytics
                    </span>
                  )}
                </button>
                <a
                  href="/reviews"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300"
                >
                  View All Reviews
                </a>
              </div>
            </div>
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>

        {analytics ? (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">Total Feedbacks</p>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">All time</span>
                  </div>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{analytics.total_feedbacks}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5">
                  <p className="text-sm font-medium text-slate-700">Average Rating</p>
                  <div className="mt-3 flex items-end gap-2">
                    <p className="text-3xl font-semibold tracking-tight text-slate-900">{analytics.average_rating.toFixed(2)}</p>
                    <span className="text-3xl text-amber-500">★</span>
                  </div>
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {[1,2,3,4,5].map((star) => (
                      <div key={star} className="rounded-lg bg-slate-50 p-2 text-center">
                        <p className="text-xs font-medium text-slate-600">{star}★</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {analytics.rating_distribution[`star_${star as 1|2|3|4|5}`]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <p className="text-sm font-medium text-slate-900">Recent Feedbacks</p>
                  <span className="text-xs text-slate-500">Showing last {analytics.recent_feedbacks.length}</span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 gap-4">
                    {analytics.recent_feedbacks.map((fb) => (
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                  <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {[...Array(5)].map((__, j) => (
                      <div key={j} className="h-14 animate-pulse rounded-lg bg-slate-100" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="p-5 grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
