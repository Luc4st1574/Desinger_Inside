import { gql } from "@apollo/client";


export const CREATE_NOTE = gql`
  mutation CREATE_NOTE($createNoteInput: CreateNoteInput!) {
    createNote(createNoteInput: $createNoteInput) {
      _id
      title
      slug
      content
       createdBy {
        _id
        firstName
        lastName
      }
      userClient {
        _id
        firstName
        lastName
      }
      workspace
      tags
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UPDATE_NOTE($updateNoteInput: UpdateNoteInput!) {
    updateNote(updateNoteInput: $updateNoteInput) {
      _id
      title
      slug
      content
       createdBy {
        _id
        firstName
        lastName
      }
      userClient {
        _id
        firstName
        lastName
      }
      workspace
      tags
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_NOTE = gql`
  mutation REMOVE_NOTE($id: ID!) {
    removeNote(id: $id) {
      _id
    }
  }
`;