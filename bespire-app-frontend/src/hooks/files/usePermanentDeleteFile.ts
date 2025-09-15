import { useMutation } from "@apollo/client";
import { DELETE_FILE } from "@/graphql/mutations/files/deleteFile";
import { FILES_BY_LINKED_TO_ID } from "@/graphql/queries/files/files";

export function usePermanentDeleteFile(linkedToId: string | null = null) {
  const [deleteFileMutation, { loading, error }] = useMutation(DELETE_FILE, {
    refetchQueries: [
      { query: FILES_BY_LINKED_TO_ID, variables: { linkedToId: linkedToId } },
    ],
  });

  const permanentlyDeleteFiles = async (fileIds: string[]) => {
    const results = await Promise.all(
      fileIds.map((fileId) => deleteFileMutation({ variables: { fileId } }))
    );
    return results;
  };

  return { permanentlyDeleteFiles, loading, error };
}
