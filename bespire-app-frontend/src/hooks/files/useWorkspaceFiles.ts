// src/hooks/useWorkspaceFiles.ts
import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LIST_FILES } from '@/graphql/queries/files/listFiles';
import { LIST_TAGS } from '@/graphql/queries/files/listTags';
import type { CreateFolderInput } from '@/types/workspaceFiles';
import { CREATE_FOLDER } from '@/graphql/mutations/files/workspaceFiles';

type UseWorkspaceFilesProps = { 
  workspaceId: string; 
  parentId?: string;
  type?: 'file' | 'folder' | string; // Opcional: filtra por tipo
  includeDeleted?: boolean;
};

export function useWorkspaceFiles({ workspaceId, parentId, type, includeDeleted }: UseWorkspaceFilesProps) {
  const listVariables = { 
    input: { 
      workspaceId, 
      parentId: parentId ?? null,
      ...(type && { type }),
      ...(includeDeleted !== undefined ? { includeDeleted } : {})
    } 
  };
  const { data, loading, error, refetch } = useQuery(LIST_FILES, { 
    variables: listVariables,
    skip: !workspaceId,
  });

  const [createFolderMutation, { loading: creating }] = useMutation(CREATE_FOLDER, {
    // Refrescar tanto los archivos como los tags después de crear una carpeta
    refetchQueries: [
      { query: LIST_FILES, variables: listVariables },
      { query: LIST_TAGS, variables: { workspaceId } }
    ],
    awaitRefetchQueries: true,
  });

  const createFolder = useCallback(
    async (input: CreateFolderInput) => {
      const { data } = await createFolderMutation({ variables: { input } });
      return data?.createFolder ?? null;
    },
    [createFolderMutation]
  );

  return {
    files: data?.listFiles ?? [],
    loading,
    error,
    refetch,
    // actions
    createFolder,
    creating,
  };
}
