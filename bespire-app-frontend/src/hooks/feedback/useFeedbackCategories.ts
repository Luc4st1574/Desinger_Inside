import { useQuery } from "@apollo/client";
import { GET_FEEDBACK_CATEGORIES } from "@/graphql/queries/feedback/feedbackCategories";

export interface FeedbackCategory {
  id: string;
  name: string;
  description?: string;
  status: string;
}

export const useFeedbackCategories = () => {
  const { data, loading, error, refetch } = useQuery(GET_FEEDBACK_CATEGORIES, {
    errorPolicy: 'all',
  });

  return {
    categories: (data?.findAllFeedbackCategories || []) as FeedbackCategory[],
    loading,
    error,
    refetch,
  };
};
