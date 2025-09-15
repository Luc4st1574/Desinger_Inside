import { gql } from '@apollo/client';

export const DELETE_FILE = gql`
  mutation DeleteFile($fileId: String!) {
    deleteFile(fileId: $fileId)
  }
`;
