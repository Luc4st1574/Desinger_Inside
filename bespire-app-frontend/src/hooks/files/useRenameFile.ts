import { useMutation } from '@apollo/client';
import { UPDATE_FILE_NAME } from '@/graphql/mutations/files/updateFileName';

export function useRenameFile() {
  const [renameFile, { loading, error }] = useMutation(UPDATE_FILE_NAME);

  const handleRename = async (fileId: string, newName: string) => {
    return renameFile({ variables: { fileId, newName } });
  };

  return { renameFile: handleRename, loading, error };
}
