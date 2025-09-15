import { useState, useEffect } from "react";
import { mockFeedbackData } from "@/mocks/feedbackList";

export type FeedbackStatus = "all" | "queued" | "in-progress" | "pending" | "completed";

export interface FeedbackItem {
  id: string;
  title: string;
  submittedBy: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  role: string;
  category: string;
  submittedDate: string;
  assignees: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
  priority: string;
  status: string;
  description: string;
}

export const useFeedbackList = (status: FeedbackStatus = "all") => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carga asíncrona
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const feedbackData = mockFeedbackData[status] || [];
        setFeedback(feedbackData);
        setLoading(false);
      } catch {
        setError("Failed to load feedback");
        setLoading(false);
      }
    }, 300); // Simular delay de red
  }, [status]);

  const refetch = () => {
    setLoading(true);
    setTimeout(() => {
      const feedbackData = mockFeedbackData[status] || [];
      setFeedback(feedbackData);
      setLoading(false);
    }, 300);
  };

  return {
    feedback,
    loading,
    error,
    refetch,
  };
};
