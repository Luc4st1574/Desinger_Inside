import { gql } from '@apollo/client';

export const GET_FILE_BY_ID = gql`
  query GetFileById($fileId: String!) {
    getFileById(fileId: $fileId) {
      _id
      name
      type
      url
      parentId
      tags
      access
      createdAt
      updatedAt
    }
  }
`;

export const GET_FOLDER_PATH = gql`
  query GetFolderPath($folderId: String!) {
    getFolderPath(folderId: $folderId) {
      _id
      name
      type
      parentId
      tags
      access
      createdAt
      updatedAt
    }
  }
`;
