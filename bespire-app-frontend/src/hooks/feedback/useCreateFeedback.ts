import { useMutation } from "@apollo/client";
import { CREATE_FEEDBACK } from "@/graphql/mutations/feedback/feedback";
import { useWorkspace } from "@/hooks/useWorkspace";

export interface CreateFeedbackInput {
  title: string;
  details: string;
  category: string; // ID de FeedbackCategory
  workspace: string; // ID del Workspace
  sendCopy?: boolean;
}

export const useCreateFeedback = () => {
  const { workspace } = useWorkspace();
  
  const [createFeedbackMutation, { loading, error }] = useMutation(CREATE_FEEDBACK, {
    errorPolicy: 'all',
  });

  const createFeedback = async (input: Omit<CreateFeedbackInput, 'workspace'>) => {
    if (!workspace?._id) {
      throw new Error('No workspace selected');
    }

    const result = await createFeedbackMutation({
      variables: {
        input: {
          ...input,
          workspace: workspace._id,
        },
      },
    });

    return result.data?.createFeedback;
  };

  return {
    createFeedback,
    loading,
    error,
  };
};
