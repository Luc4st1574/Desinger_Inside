import { gql } from '@apollo/client';

export const MOVE_FILE_TO_TRASH = gql`
  mutation MoveFileToTrash($fileId: String!) {
    moveFileToTrash(fileId: $fileId) {
      _id
      name
      deletedAt
    }
  }
`;

export const RESTORE_FILE = gql`
  mutation RestoreFile($fileId: String!) {
    restoreFile(fileId: $fileId) {
      _id
      name
      deletedAt
    }
  }
`;
