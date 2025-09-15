import { gql } from '@apollo/client';

export const UPDATE_FILE_NAME = gql`
  mutation UpdateFileName($fileId: String!, $newName: String!) {
    updateFileName(fileId: $fileId, newName: $newName) {
      _id
      name
    }
  }
`;
