/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@apollo/client";
import { useCallback } from "react";
import { ASSIGNEES_BY_ENTITY } from "../graphql/queries/assignees/assigness";
import {
  ADD_ASSIGNEE,
  REMOVE_ASSIGNEE,
} from "../graphql/mutations/assignees/assigness";
import { useRequests } from "./useRequests";
import { GET_REQUEST_DETAIL } from "@/graphql/queries/requests/getRequestDetail";
import { GET_REQUEST_CHANGE_LOG } from "@/graphql/queries/requests/getRequestChangeLog";
import { GET_REQUESTS } from "@/graphql/mutations/requests/getRequests";
import { GET_COMMENTS_FOR_ENTITY } from "@/graphql/queries/comments/getCommentsForEntity";

export function useAssignees({ linkedToId, linkedToType }: any) {
  const { data, loading, error, refetch } = useQuery(ASSIGNEES_BY_ENTITY, {
    variables: { linkedToId, linkedToType },
    skip: !linkedToId || !linkedToType,
    fetchPolicy: "network-only",
  });
  const { refetch: refetchRequests } = useRequests();

  const [addAssigneeMutation] = useMutation(ADD_ASSIGNEE);
  const [removeAssigneeMutation] = useMutation(REMOVE_ASSIGNEE);

  const addAssignee = useCallback(
    async (userId: string) => {
      console.log("Adding assignee:", userId);
      if (!linkedToId || !linkedToType) {
        console.error("linkedToId or linkedToType is not defined");
        return;
      }
      await addAssigneeMutation({
        variables: {
          input: {
            linkedToId,
            linkedToType,
            user: userId,
          },
        },
        refetchQueries: [
          { query: GET_REQUEST_DETAIL, variables: { id: linkedToId } },
          {
            query: GET_REQUEST_CHANGE_LOG,
            variables: { requestId: linkedToId },
          },
          {
            query: GET_COMMENTS_FOR_ENTITY,
            variables: { linkedToId: linkedToId },
          },
        ],
      });
      await refetch();
      await refetchRequests();
    },
    [addAssigneeMutation, linkedToId, linkedToType, refetch, refetchRequests]
  );

  const removeAssignee = useCallback(
    async (userId: string) => {
      await removeAssigneeMutation({
        variables: {
          linkedToId,
          linkedToType,
          user: userId,
        },
      });
      await refetch();
      await refetchRequests();
    },
    [removeAssigneeMutation, linkedToId, linkedToType, refetch, refetchRequests]
  );

  return {
    assignees: data?.assigneesByEntity || [],
    loading,
    error,
    addAssignee,
    removeAssignee,
    refetch,
  };
}
