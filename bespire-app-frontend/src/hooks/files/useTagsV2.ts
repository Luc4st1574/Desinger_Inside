import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { LIST_TAGS } from '@/graphql/queries/files/listTags';
import { CREATE_TAG } from '@/graphql/mutations/files/createTag';

export interface TagOption {
  value: string;
  label: string;
  _id?: string;
}

export function useTags(workspaceId: string) {
  const { data, loading, refetch } = useQuery(LIST_TAGS, {
    variables: { workspaceId },
    fetchPolicy: 'network-only',
    skip: !workspaceId,
  });

  const [createTagMutation, { loading: creating }] = useMutation(CREATE_TAG);

  const options: TagOption[] = (data?.listTags ?? []).map((t: any) => ({
    value: t.name,
    label: t.name,
    _id: t._id,
  }));

  const createTag = useCallback(
    async (name: string, createdBy?: string) => {
      if (!name.trim()) return null;
      const res = await createTagMutation({
        variables: { workspaceId, name, createdBy },
      });
      await refetch();
      return res.data?.createTag;
    },
    [workspaceId, createTagMutation, refetch]
  );

  return { options, loading, createTag, creating, refetch };
}
