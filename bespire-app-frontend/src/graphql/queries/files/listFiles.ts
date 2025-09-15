// src/graphql/queries/files/listFiles.ts
import { gql } from '@apollo/client';

export const LIST_FILES = gql`
  query ListFiles($input: ListFilesInput!) {
    listFiles(input: $input) {
      _id
      name
      type
      parentId
      ext
      tags
      url
      access
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
