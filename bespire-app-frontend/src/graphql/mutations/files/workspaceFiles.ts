import { gql } from "@apollo/client";

export const CREATE_FOLDER = gql`
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      _id
      name
      type
      parentId
      workspaceId
      tags
      access
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_FILE_WORKSPACE = gql`
  mutation deleteFile($fileId: String!) {
    deleteFile(fileId: $fileId)
  }
`;
