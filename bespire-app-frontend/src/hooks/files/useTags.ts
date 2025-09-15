// src/hooks/useTags.ts
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { LIST_TAGS } from '@/graphql/queries/files/listTags';

interface Tag {
  name: string;
}

export function useTags(workspaceId: string, search?: string) {
  const { data, loading, refetch } = useQuery(LIST_TAGS, { variables: { workspaceId, search } });
  const options = useMemo(
    () => (data?.listTags ?? []).map((t: Tag) => ({ value: t.name, label: t.name })),
    [data]
  );
  return { options, loading, refetch };
}
