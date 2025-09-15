// src/graphql/queries/tags/listTags.ts
import { gql } from '@apollo/client';

export const LIST_TAGS = gql`
  query ListTags($workspaceId: String!, $search: String) {
    listTags(workspaceId: $workspaceId, search: $search) {
      _id
      name
    }
  }
`;
