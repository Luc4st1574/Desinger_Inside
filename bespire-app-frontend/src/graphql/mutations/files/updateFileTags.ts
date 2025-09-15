import { gql } from '@apollo/client';

export const UPDATE_FILE_TAGS = gql`
  mutation UpdateFileTags($fileId: String!, $tags: [String!]!) {
    updateFileTags(fileId: $fileId, tags: $tags) {
      _id
      name
      tags
    }
  }
`;
