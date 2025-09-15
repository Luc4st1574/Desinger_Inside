import { useMutation } from '@apollo/client';
import { MOVE_FILE_TO_TRASH, RESTORE_FILE } from '../../graphql/mutations/files/trashMutations';

export function useTrashActions() {
  const [moveFileToTrashMutation, { loading: loadingTrash }] = useMutation(MOVE_FILE_TO_TRASH);
  const [restoreFileMutation, { loading: loadingRestore }] = useMutation(RESTORE_FILE);

  const moveFilesToTrash = async (fileIds: string[]) => {
    await Promise.all(fileIds.map(async (fileId) => {
      try {
        const res = await moveFileToTrashMutation({ variables: { fileId } });
        return res?.data?.moveFileToTrash;
      } catch (e) {
        console.error('Error moviendo archivo a trash', e);
        return null;
      }
    }));
  };

  const restoreFiles = async (fileIds: string[]) => {
    await Promise.all(fileIds.map(async (fileId) => {
      try {
        const res = await restoreFileMutation({ variables: { fileId } });
        return res?.data?.restoreFile;
      } catch (e) {
        console.error('Error restaurando archivo', e);
        return null;
      }
    }));
  };

  return {
    moveFilesToTrash,
    restoreFiles,
    loadingTrash,
    loadingRestore,
  };
}
