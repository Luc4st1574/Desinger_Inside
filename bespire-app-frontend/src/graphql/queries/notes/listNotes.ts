import { gql } from "@apollo/client";
export const GET_NOTES = gql`
  query GET_NOTES {
    notes {
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
