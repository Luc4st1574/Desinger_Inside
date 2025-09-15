import { useQuery, useMutation } from "@apollo/client";
import { CREATE_COMMENT } from "@/graphql/mutations/comments/createComment";
import { GET_REQUEST_CHANGE_LOG } from "@/graphql/queries/requests/getRequestChangeLog";
import { GET_COMMENTS_FOR_ENTITY } from "@/graphql/queries/comments/getCommentsForEntity";

export function useComments(requestId: string) {

  const [createComment, { loading: creating, error: createError }] = useMutation(CREATE_COMMENT,{
    refetchQueries: [{ query: GET_REQUEST_CHANGE_LOG, variables: { requestId: requestId } },
      { query: GET_COMMENTS_FOR_ENTITY, variables: { linkedToId: requestId } }
    ],
  });

  // 3. Función para enviar comentario
  const addComment = async (text: string, linkedToType: string = "request") => {
    await createComment({
      variables: {
        input: {
          linkedToId: requestId,
          linkedToType: linkedToType,
          text,
        },
      },
    });
  };

  // 4. Normaliza el resultado para la UI
  return {
    addComment,
    creating,
    createError,
  };
}
