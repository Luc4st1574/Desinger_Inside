import { gql } from '@apollo/client';

export const CREATE_TAG = gql`
  mutation CreateTag($workspaceId: String!, $name: String!, $createdBy: String) {
    createTag(workspaceId: $workspaceId, name: $name, createdBy: $createdBy) {
      name
    }
  }
`;
