import { gql } from "@apollo/client";

export const FILES_BY_WORKSPACE_ID = gql`
  query filesByWorkspaceId($workspaceId: String!, $parentId: String) {
    filesByWorkspaceId(workspaceId: $workspaceId, parentId: $parentId) {
      _id
      name
      type
      url
      ext
      size
      uploadedBy
      uploadedAt
      parentId
      workspaceId
      deletedAt
      tags
      access
      createdAt
      updatedAt
    }
  }
`;
