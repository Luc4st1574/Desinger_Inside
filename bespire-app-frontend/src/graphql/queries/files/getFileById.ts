// src/graphql/queries/files/getFileById.ts
import { gql } from "@apollo/client";

export const GET_FILE_BY_ID = gql`
  query GetFileById($fileId: String!) {
    getFileById(fileId: $fileId) {
      _id
      name
      type
      tags
      url
      access
      parentId
      ext
      size
    }
  }
`;